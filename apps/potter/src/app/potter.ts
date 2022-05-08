// game.ts
class Counter<T> {
  private _list: Array<T> = [];
  public dict: any = {};
  constructor(list: Array<T>) {
    this._list = list;
    this._list.forEach((element) => {
      if (!this.dict[element]) {
        this.dict[element] = 1;
      } else {
        this.dict[element] += 1;
      }
    });
  }
  set list(list: Array<T>) {
    this._list = list;
    this._list.forEach((element) => {
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
    return Object.keys(this.dict) || [];
  }
  mostCommon() {
    const arr = Object.keys(this.dict).map((obj) => [
      Number(obj),
      this.dict[obj],
    ]);
    return arr.sort((a, b) => b[1] - a[1]);
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
    let result = 0;
    while (books.length != 0) {
      console.log(books);

      const booksCounter = new Counter<number>(books);
      let uniNum = booksCounter.keys.length as number;
      if (books.length > 6 && books.length < 10 && uniNum === 5) {
        let c = 0;

        for (const jk of booksCounter.keys.map(Number)) {
          if (c === 0) {
            uniNum -= 1;
            c += 1;
            continue;
          }
          c += 1;
          const k = books.indexOf(booksCounter.mostCommon()[0][0], 0);

          books.splice(k, 1);
          booksCounter.list = books;
        }
      } else {
        for (const jk of booksCounter.keys.map(Number)) {
          const k = books.indexOf(booksCounter.mostCommon()[0][0], 0);
          books.splice(k, 1);
          booksCounter.list = books;
        }
      }
      console.log(books);
      result += this.EUR_ONE_BOOK * (uniNum * (1 - this.Discount[uniNum]));
    }
    return result;
  }
}
