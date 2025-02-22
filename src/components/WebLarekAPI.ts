import {Api,ApiListResponse} from "./base/api"
import { IProductItem,IOrder,IResultOrder } from "../types"

class WebLarekApi extends Api{
    constructor(baseUrl:string,options?:RequestInit){
        super(baseUrl, options);
    }
    getProductList(){}
    orderProducts(){}
}