import {FormErrors,IAppState,IOrder,IOrderForm,IProductItem,} from '../types';
import { Model } from './base/model'
export class AppData extends Model<IAppState> {
	catalog: Product[] = [];
	preview: string = '';
	basket: Product[] = [];
	order: IOrder = {
		address: '',
		payment: 'card',
		email: '',
		total: 0,
		phone: '',
		items: [],
	};
	formErrors: FormErrors = {};

	clearBasket() {
		this.basket = [];
		this.order.items = [];
	}

	updateOrderItems(item: Product, action: 'add' | 'remove') {
		const itemId = item.id;
		if (action === 'add') {
			this.order.items.push(itemId);
		} else {
			this.order.items = this.order.items.filter((id) => id !== itemId);
		}
	}

	setCatalog(items: IProductItem[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	updateBasket(item: Product, action: 'add' | 'remove') {
		if (action === 'add') {
			this.basket.push(item);
		} else {
			this.basket = this.basket.filter((basketItem) => basketItem !== item);
		}
	}

	get statusBasket(): boolean {
		return this.basket.length === 0;
	}

	get returnBasket(): Product[] {
		return this.basket;
	}

	set total(value: number) {
		this.order.total = value;
	}

	getTotal() {
		return this.order.items.reduce((total, itemId) => {
			const product = this.catalog.find((it) => it.id === itemId);
			return total + (product ? product.price : 0);
		}, 0);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateAndEmit(this.validateOrder);
	}

	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validateAndEmit(this.validateContacts);
	}
	isItemInBasket(item: Product): boolean {
        return this.basket.some((basketItem) => basketItem.id === item.id);
    }

	private validateAndEmit(validateFn: () => boolean) {
		if (validateFn.call(this)) {
			this.events.emit('order:ready', this.order);
		}
	}

	private validateOrder() {
		const errors: Partial<FormErrors> = {};
		if (!this.order.address) errors.address = 'Необходимо указать адрес';
		return this.updateFormErrors(errors);
	}

	private validateContacts() {
		const errors: Partial<FormErrors> = {};
		if (!this.order.email) errors.email = 'Необходимо указать email';
		if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
		return this.updateFormErrors(errors);
	}

	private updateFormErrors(errors: Partial<FormErrors>) {
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

export class Product extends Model<IProductItem> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}
