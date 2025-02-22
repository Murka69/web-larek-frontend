import { IEvents } from "./base/events";

abstract class Component<T>{
    protected constructor(protected readonly container: HTMLElement){} // переключение класса
    toggleClass(element:HTMLElement,className:string,force?:boolean){
        element.classList.toggle(className,force);
    }
    setDisabled(element:HTMLElement,state:boolean){ // смена статуса блокировки
        if(element){
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }
    protected contentText(element:HTMLElement,value:string){   //текст 
        if(element){
            element.textContent = value;
        }
    }
    protected setImage(element:HTMLImageElement,src:string,alt ?:string){  //изображение с альт текстом
        if(element){
            element.src = src
        }
        if(alt){
            element.alt = alt;
        }
    }
    render(data?: Partial<T>): HTMLElement{
        Object.assign(this as object, data ?? {});
        return this.container
    }
}

export abstract class Model<T> extends Component<T>{
    constructor(container: HTMLElement, protected events:IEvents){
        super(container);
    }
    
} 