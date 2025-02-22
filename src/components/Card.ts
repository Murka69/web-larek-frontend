
interface ICard {
    title: string;
    category: string;
    image: string;
    price: number;
    text: string;
  }
  
  interface ICardActions {
      onClick: (event: MouseEvent) => void;
  }