// game.ts
class Counter<T> {
  private list: Array<T> = [];
  constructor(list: Array<T>) {
    this.list = list;
  }
  get total() {
    return this.list.length;
  }
}
export class Potter {
  private EUR_ONE_BOOK = 8;
  private Discount = {
    1: 0,
    2: 0.05,
    3: 0.1,
    4: 0.2,
    5: 0.25,
  };
  price(books: Array<number>) {
    const booksCounter = new Counter<number>(books);
    return this.EUR_ONE_BOOK * booksCounter.total;
  }
}
