interface IProductItem{
    id:string;
    title:string;
    description:string;
    category:string;
    image:string;
    price:number|null;
}

interface IStateApp{
    catalog:IProductItem[];
    preview:string;
    basket:string[];
    order:IOrder;
    total:string|number;
}

type MethodPay = 'cash'|'card';

interface IOrder{
    pay:MethodPay;
    addres?:string;
    phone?:string;
    email?:string;
    total:number;
}


type ErrorOrder = Partial<Record<keyof IOrder, string>>;

type TOrderForm = Pick<IOrder, "pay" | "addres">;
type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

interface IResultOrder{
    id:string;
    total:number;
}

export {IProductItem,IStateApp,IOrder,ErrorOrder,IResultOrder,TOrderForm,TContactsForm};