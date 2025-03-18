import "./scss/styles.scss";
import { EventEmitter } from "./components/base/events";
import { API_URL, CDN_URL } from "./utils/constants";
import { WebLarekApi } from "./components/webLarekAPI";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { AppData, Product } from "./components/appData";
import { IOrderForm } from "./types";
import { Page } from "./components/pages";
import { Card, CardBasket, CardPreview } from "./components/card";
import { Modal } from "./components/common/modal";
import { Basket } from "./components/common/basket";
import { Order, Сontacts } from "./components/orderForm";
import { Success } from "./components/common/success";

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");

const appData = new AppData({}, events);
const page = new Page(document.body, events);
const basket = new Basket(
  cloneTemplate<HTMLTemplateElement>(basketTemplate),
  events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new Сontacts(
  cloneTemplate<HTMLFormElement>(contactsTemplate),
  events
);
const modal = new Modal(document.getElementById("modal-container"), events);

events.on("items:changed", () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });
    return card.render(api.prepareCardData(item));
  });
});

events.on("card:select", (item: Product) => {
  appData.setPreview(item);
});

events.on("preview:changed", (item: Product) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (item.price > 0) {
        events.emit("card:add", item);
        basket.setBuyButtonDisabled(item.id, true, item.price);
      } else {
        basket.setBuyButtonDisabled(item.id, true, item.price);
      }
    },
  });
  if (item.price <= 0) {
    basket.setBuyButtonDisabled(item.id, true, item.price);
  }

  modal.render({
    content: card.render(api.prepareCardData(item)),
  });
});

events.on("card:add", (item: Product) => {
  if (!appData.isItemInBasket(item)) {
    appData.updateOrderItems(item, "add");
    appData.updateBasket(item, "add");
    page.counter = appData.returnBasket.length;
    basket.setBuyButtonDisabled(item.id, true, item.price);
  }
  modal.close();
});

events.on("basket:open", () => {
  basket.setDisabled(basket.button, appData.statusBasket);
  basket.total = appData.getTotal();
  let i = 0;
  basket.items = appData.returnBasket.map((item: Product) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
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
  let i = 0;
  basket.items = appData.returnBasket.map((item: Product) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
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
    .orderProducts({ ...appData.order, ...appData.basket })
    .then(({ total }) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
        },
      });
      success.total = String(total);
      modal.render({
        content: success.render({
          total: Number(appData.getTotal()),
        }),
      });
      const clearBasketOnClose = () => {
        appData.clearBasket();
        page.counter = appData.returnBasket.length;
      };

      events.on("modal:close", clearBasketOnClose);
    })
    .catch(console.error);
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
