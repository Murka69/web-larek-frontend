# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Описание проекта

## Методология разработки
В этом проекте применяется событийно-ориентированный подход, который подразумевает, что взаимодействие между компонентами приложения осуществляется через обмен сообщениями, инициированными определенными событиями.

Также используется архитектурная модель MVP (Model-View-Presenter), которая делит приложение на три ключевых компонента:
- Модель: отвечает за управление данными и бизнес-логикой
- Представление: отображает данные и отправляет действия пользователя презентатору
- Презентатор: получает данные из модели, форматирует их для отображения в представлении и обрабатывает ввод данных пользователем.

# Базовые классы
---
## Класс `Api`

Базовый класс для отправки и получения запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

`constructor(baseUrl: string, options: RequestInit = {}) `принимает url сервера, по которому будут совершаться запросы и общие опции для запросов

### Поля:
- `baseUrl` - базовый адрес сервера
- `options` - объект с заголовками запросов

### Методы:
- `get(uri: string)` - отправляет GET-запрос по указанному URL.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправляет POST-запрос с данными.

## Класс `EventEmitter`
Обеспечивает управление событиями, включая установку и снятие слушателей, а также их вызов при возникновении события.

### Методы:
- `on` - подписка на событие
- `off` - отписка от события
- `emit` - инициализация события
- `onAll` - подписка одновременно на все события
- `ofAll` - сброс всех обработчиков
- `trigger` -  возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

## Класс `Component<T>`
Абстрактный класс дженерик, для создания компонентов пользовательского интерфейса.
`constructor(container: HTMLElement)`- принимает элемент контейнера, в который будет помещен компонент

### Методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - метод переключения класса элемента
- `setDisabled(element: HTMLElement, state: boolean)` - блокирует или разблокирует переданный элемент в зависимости от значения state (true/false)
- `setText(element: HTMLElement, value: unknown)` - текст для переданного элемента
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - установка изображения элемента и его alt-текст

## Класс `Model<T>`
Абстрактный класс дженерик, для расширения класса `Component<T>` и метода привязки события.
Является родительским классом для AppData
`constructor(data: Partial<T>, protected events: IEvents)`- принимает элемент контейнера, в который будет помещен компонент и брокер событий
- Методы: наследуются от класса `Component<T>`

# Компоненты модели данных
---
## Класс `WebLarekAPI`
Является ключевым компонентом для работы с сетевыми запросами в проекте. Наследуется от базового класса `Api` тем самым позволяет ему использовать его функциональность и расширять возможности взаимодействия с Api

### Методы:
- `getProductList` - возвращает массив продуктов с сервера
- `orderProducts` - отправляет данные заказа на сервер


## Класс `AppData`
Реализует интерфейс `IStateApp` и управляет состоянием приложения. Содержит методы для работы с данными, такими как добавление и удаление товаров, обновление информации о заказе и валидация форм.

Интерфейс `IStateApp`:
```
interface IStateApp{
    catalog:IProductItem[];
    preview:string;
    basket:string[];
    order:IOrder;
    total:string|number;
}
```
### Поля:
- `catalog` - данные списка товаров с сервера
- `preview` - данные товара открытого в превью
- `basket` - данные товара добавленные в корзину
- `order` - данные заказа для отправления на сервер
- `formErrors` - для случая ошибок полей формы

# Компоненты представления
----
## Класс `Card`
Реализует карточку товара используется на главной, в модальном окне и в корзине.
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает container типа HTMLElement и опциональный объект события actions типа ICardActions

Расширяется базовым абстрактным классом `Component<T>` по интерфейсу `ICard`

```
interface ICard {
  title: string;
  category: string;
  image: string;
  price: number;
  text: string;
}
```

### Поля:
- `_title` - разметка заголовка карточки
- `_category` - разметка категорий карточек
-  `_image` -  разметка изображения карточки 
- ` _price` -  цена карточки 
- `_categoryColor` - цвет карточки

### Методы:
- `set title` - установка содержимого заголовка
- `set category` - установка содержимого категории
- `set image` -  содержимое изображение
- `set price` - содержимое цены

## Класс `CardPreview`
Отвечает за отображение данных карточки в превью
`constructor(container: HTMLElement, actions?: ICardActions)` - принимает container типа HTMLElement и опциональный объект события actions типа ICardActions

Расширяется классом `Card<T>` по интерфейсу `ICardPreview`
```
interface ICardPreview {
  text: string;
}
```
### Поля:
- `_text` - разметка описания превью
- ` _button` -  разметка кнопки превью

### Методы:
- ` set text` - описание превью


## Класс `CardBasket`
Отвечает за отображение данных карточки товара в каталоге.
Поля класса отвечают за хранение разметки, а методы — за заполнение этой разметки данными.
Расширяется базовым абстрактным классом` Component<T>` по интерфейсу `ICardBasket`

`constructor(container: HTMLElement, actions?: ICardActions)` - принимает container типа HTMLElement и опциональный объект события actions типа ICardActions

```
interface ICardBasket {
  title: string;
  price: number;
  index: number;
}
```

### Поля:
- `_title` - хранит разметку заголовка
- `_price` -  хранит разметку кнопки удаления
- `_button` - разметка цены
- `_index` - разметка порядкового номера

### Методы:
- `set index` - установка содержимого заголовка
- `set title` - порядкового номера
- `set price` -  цены

## Класс `Page`
Реализует главную страницу, представляющую каталог товаров с функцией счетчика. Включает набор методов-сеттеров для работы с DOM-элементами главной страницы. 
При нажатии на кнопку корзины генерирует событие `basket:open`.

```
interface IPage {
  catalog: HTMLElement[]
}
```

`constructor(container: HTMLElement, protected events: IEvents) ` - принимает container типа HTMLElement и объект event типа IEvent

### Поля:
- `_counter` -  хранит разметку счетчика товаров в корзине
- `_catalog` -  разметка каталога товаров
- `_wrapper` - разметка обертки страницы
- `_basket` -  разметка кнопки корзины

### Методы:
- `set counter` - значение счётчика товаров в корзине
- `set catalog` - устанавливает каталог 
- `set locked` -  устанавливает класс для блокировки прокрутки страницы 

## Класс `Basket`   
Реализует корзину.
Содержит в себе сеттеры для изменения отображения корзины

Расширяется базовым абстрактным классом `Component<T>` по интерфейсу `IBasket`
```
interface IBasket{
  items:string;
  total:number;
}
```
`constructor(container: HTMLElement, protected events: EventEmitter)`-принимает container типа HTMLElement и объект event типа IEvent

### Поля:
- `_list` — хранит разметку обертки списка товаров
- `_total` — хранит разметку для суммы товаров
- `button` — хранит разметку кнопки перехода на шаг оформления заказа
- `items` — хранит список товаров в корзине

### Методы:
- `set items` - устанавливает товары в разметку `_list`
- `set total` - устанавливает значение суммы товаров


## Класс `Form<T>`
Отвечает за основные способы работы с формой и ее валидацию.
Класс является дженериком и принимает в переменной `<T>` тип данных компонента отображения.

`constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает container типа HTMLFormElement и объект event типа IEvent

```
interface IForm {
    valid: boolean;
    errors: string[];
  }
```
### Поля:
- `_submit` - разметка кнопки отправки формы
- `_errors` - разметка вывода ошибок валидации 

### Методы:
- `set valid` - установка валидности
- `set errors` - установка ошибок

## Класс `OrderForm`
Отвечает за реализацию компонента формы отправки заказа

`constructor(container: HTMLFormElement, events: IEvents)` - принимает container типа HTMLFormElement и объект event типа IEvent. На кнопки выбора формы оплаты вешает слушатель click по которому методом payment производится установка класса активности на эту самую кнопку

```
interface IOrderForm{
    pay:MethodPay;
    address?:string;
    phone?:string;
    email?:string;
    total:number;
}
```

### Поля:
- `_buttons` -  хранит разметку кнопок формы оплаты

### Методы:
- `set payment` - устанавливает класс активности на кнопку
- `set address` - устанавливает значение поля адрес

## Класс `ContactsForm`
Отвечает за реализацию компонента формы контактов.
Расширяется классом `Form<T>` по интерфейсу `IOrderForm`
`constructor(container: HTMLFormElement, events: IEvents)` - 

```
interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
	total?: string | number;
}

```

### Методы:
- `set email` - инпут почты
- `set phone` - инпут телефона

## Класс `Success`
Реализация окна с подтверждением заказа 
`constructor(container: HTMLElement, actions: ISuccessActions)` -  принимает `container` типа HTMLElement  и опциональный объект события actions типа ISuccessActions.Если объект actions был передан, то вешает слушатель клика на `_close` с вызовом объекта события actions

```
interface ISuccessActions {
  onClick: () => void;
}
```
### Поля:
- `close` - кнопка закрытия окна
- `total` - сумма заказа

### Методы: 
- `set total` - меняет общую сумму заказа

## Класс `Modal`
Реализация модального окна с помощью методов для управления состояния окна и генерации событий 
Расширяется базовым классом `Component<T>` по интерфейсу  `IModalData`

`constructor(container: HTMLElement, protected events: IEvents)` - принимает `container` типа HTMLElement и объект event типа `IEvent`

```
interface IModalData{
    content:HTMLElement[];
}
```
### Поля:
- `_closeButton` - разметка кнопки закрытия модального окна 
- `_content` - разметка контейнера для модального окна

### Методы:
- `set content` - устанавливает контент модального окна 
- `open` - открытие модального окна
- `close` - закрытие модального окна
- `render`  - отрисовка данных контента и открытия модального окна

# Презентер

Отвечает за взаимодействие компонентов,расположен в корневом файле `index.ts`

---

## События изменения данных
- `items:change` - изменение массива товаров каталога
- `preview:change` - изменение товара который откроют в модальном окне 
- `basket:change` - изменение списка товаров в корзине
## События интерфейса 
- `modal:open` - открытие любого модального окна
- `modal:close` - закрытие любого модального окна 
- `basket:open` - открытие модального окна корзины
- `card:select` - выбор карточки
- `order:open` - открытие окна с оформлением заказа
- `${form}:submit` - отправка формы

## Основные типы и интерфейсы
- `IAppState` - интерфейс, описывающий состояние приложения с основными свойствами.
- `IProductItem` - интерфейс товара с его характеристиками.
- `IBasket` - интерфейс корзины с содержимым и общей стоимостью.
- `IOrder` - интерфейс заказа для отправки.
- `IOrderForm` - интерфейс формы заказа с данными для оформления.
- `IOrderResult` - интерфейс результата отправки заказа.
- `FormErrors` - тип для ошибок валидации формы.