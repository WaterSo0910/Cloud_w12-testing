// game.ts
class Counter<T> {
  private list: Array<T> = [];
  private dict: any = {};
  constructor(list: Array<T>) {
    this.list = list;
    list.forEach((element) => {
      if (!this.dict[element]) {
        this.dict[element] = 1;
      } else {
        this.dict[element] += 1;
      }
    });
  }
  get total() {
    return this.list.length;
  }
  get keys() {
    return Object.keys(this.dict);
  }
}
export class Potter {
  private EUR_ONE_BOOK = 8;
  private Discount: any = {
    1: 0,
    2: 0.05,
    3: 0.1,
    4: 0.2,
    5: 0.25,
  };
  price(books: Array<number>) {
    if (books.length === 0) {
      return 0;
    }
    const booksCounter = new Counter<number>(books);
    const uniNum = booksCounter.keys.length as number;

    return this.EUR_ONE_BOOK * booksCounter.total * (1 - this.Discount[uniNum]);
  }
}
