import { IEvents } from "./base/events";


export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}
  
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
	  element.classList.toggle(className, force);
	}
  
	setDisabled(element: HTMLElement, state: boolean) {
	  if (element) {
		if (state) element.setAttribute('disabled', 'disabled');
		else element.removeAttribute('disabled');
	  }
	}
  
	protected setText(element: HTMLElement, value: unknown) {
	  if (element) {
		element.textContent = String(value);
	  }
	}
  
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
	  if(element) {
		element.src = src;
		if(alt) {
		  element.alt = alt;
		}
	  }
	}
  
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
  }
  

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}
}
