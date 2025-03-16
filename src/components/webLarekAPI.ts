import { IOrder, IOrderResult, IProductItem } from "../types";
import { Api, ApiListResponse} from "./base/api";

export class WebLarekApi extends Api {
  cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
    this.cdn = cdn;
  }
  getProductList() {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map(item => ({...item,imageUrl: `${this.cdn}/${item.image}`}))
    );
  }
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
        (data: IOrderResult) => data
    );
  }
  prepareCardData(item: IProductItem) {
    return {
      title: item.title,
      category: item.category,
      image: this.cdn + item.image,
      price: item.price,
      text:item.description,
    };
  }
}