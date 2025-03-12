import "./scss/styles.scss";
import { EventEmitter } from "./components/base/events";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/webLarekAPI";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { AppData,Product } from "./components/appData";
import { IOrderForm } from "./types";
import { Page } from "./components/pages";
import { Card, CardBasket, CardPreview } from "./components/card";
import { Modal } from "./components/modal";
import { Basket } from "./components/basket";
import { Order,Сontacts } from "./components/orderForm";
import { Success } from "./components/success";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const successTpl = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTpl = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTpl = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTpl = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTpl = ensureElement<HTMLTemplateElement>("#basket");
const orderTpl = ensureElement<HTMLTemplateElement>("#order");
const contactsTpl = ensureElement<HTMLTemplateElement>("#contacts");

const appData = new AppData({}, events);
const page = new Page(document.body, events);
const basket = new Basket(
  cloneTemplate<HTMLTemplateElement>(basketTpl),
  events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTpl), events);
const contacts = new Сontacts(cloneTemplate<HTMLFormElement>(contactsTpl),events
);
const modal = new Modal(document.getElementById("modal-container"), events);

events.on("items:changed", () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTpl), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render({
      title: item.title,
      category: item.category,
      image: api.cdn + item.image,
      price: item.price,
    });
  });
});

events.on("card:select", (item: Product) => {
  appData.setPreview(item);
});

events.on("preview:changed", (item: Product) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTpl), {
    onClick: () => events.emit("card:add", item),
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: api.cdn + item.image,
      text: item.description,
      price: item.price,
      category: item.category,
    }),
  });
});

events.on('card:add', (item: Product) => {
    const isItemInBasket = appData.returnBasket.some(basketItem => basketItem.id === item.id);
    const buyButton = document.getElementById(`buy-button-${item.id}`) as HTMLButtonElement;

    if (!isItemInBasket) {
        appData.updateOrderItems(item, "add");
        appData.updateBasket(item, "add");
        page.counter = appData.returnBasket.length;
        if (buyButton) {
            buyButton.disabled = true;
        }
    }
    modal.close(); 
});

events.on("basket:open", () => {
  basket.setDisabled(basket.button, appData.statusBasket);
  basket.total = appData.getTotal();
  let i = 1;
  basket.items = appData.returnBasket.map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTpl), {
      onClick: () => events.emit("card:remove", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: i++,
    });
  });
  modal.render({ content: basket.render() });
});

events.on("card:remove", (item: Product) => {
  appData.updateBasket(item, "remove");
  appData.updateOrderItems(item, "remove");
  page.counter = appData.returnBasket.length;
  basket.setDisabled(basket.button, appData.statusBasket);
  basket.total = appData.getTotal();
  let i = 1;
  basket.items = appData.returnBasket.map((item) => {
    const card = new CardBasket(cloneTemplate(cardBasketTpl), {
      onClick: () => events.emit("card:remove", item),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: i++,
    });
  });
  modal.render({
    content: basket.render(),
  });
});

events.on("formErrors:change", (errors: Partial<IOrderForm>) => {
  const { email, phone, address, payment } = errors;
  order.valid = !address && !payment;
  contacts.valid = !email && !phone;
  order.errors = Object.values({ address, payment })
    .filter((i) => !!i)
    .join("; ");
  contacts.errors = Object.values({ phone, email })
    .filter((i) => !!i)
    .join("; ");
});

events.on(
  /^contacts\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setContactsField(data.field, data.value);
  }
);

events.on(
  /^order\..*:change/,
  (data: { field: keyof IOrderForm; value: string }) => {
    appData.setOrderField(data.field, data.value);
  }
);

events.on("payment:change", (item: HTMLButtonElement) => {
  appData.order.payment = item.name;
});

events.on("order:open", () => {
  modal.render({
    content: order.render({
      address: "",
      payment: "card",
      valid: false,
      errors: [],
    }),
  });
});

events.on("order:submit", () => {
  appData.order.total = appData.getTotal();
  modal.render({
    content: contacts.render({
      email: "",
      phone: "",
      valid: false,
      errors: [],
    }),
  });
});

events.on("contacts:submit", () => {
  api
    .orderProducts(appData.order)
    .then((result) => {
      console.log(appData.order);
      const success = new Success(cloneTemplate(successTpl), {
        onClick: () => {
          	modal.close();
			appData.clearBasket();
          	page.counter = appData.returnBasket.length;
        },
      });

      modal.render({
        content: success.render({
          total: appData.getTotal(),
        }),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

events.on("modal:open", () => {
  page.locked = true;
});

events.on("modal:close", () => {
  page.locked = false;
});

api
  .getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
    console.error(err);
  });
