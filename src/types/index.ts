export interface IProductItem {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}

export interface IAppState {
	catalog: IProductItem[];
	preview: string;
	basket: string[];
	order: IOrder;
	total:number;
	loading: boolean;
}

export interface IProductsList {
	products: IProductItem[];
}

export interface IOrderForm {
	payment?: string;
	address?: string;
	phone?: string;
	email?: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total?: number;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IOrderResult {
	total: number;
	id: string;
}

