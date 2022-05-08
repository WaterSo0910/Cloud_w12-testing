// game.ts
export class Counter<T> {
  private _dict: Map<T, number>;
  private _arr: Array<T>;
  constructor(arr: Array<T>) {
    this._arr = arr;
    this._dict = this.buildDict(arr);
  }
  private buildDict(arr: Array<T>): Map<T, number> {
    const m = new Map<T, number>();
    for (const x of arr) {
      const v = m.get(x) || 0;
      m.set(x, v + 1);
    }
    return m;
  }

  get keys(): Array<T> {
    return [...this._dict.keys()];
  }

  public most_common(): [T, number][] {
    let arr = Array.from(this._dict);
    arr = arr.sort((a, b) => b[1] - a[1]);
    return arr;
  }

  public total(): number {
    return this._arr.length;
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
  } as { [key: number]: number };
  private books: Array<number> = [];
  private result = 0;

  price(books: Array<number>) {
    this.books = books;
    console.log(books);

    this.result = 0;
    while (this.books.length !== 0) {
      let booksCounter = new Counter<number>(this.books);
      let uniNum = booksCounter.keys.length as number;
      if (this.haveToChangeStrategy(uniNum)) {
        uniNum -= 1;
      }
      for (let i = 0; i < uniNum; i++) {
        this.removeBookAndUpdate(booksCounter.most_common()[0][0]);
        booksCounter = new Counter<number>(this.books);
      }
      this.result += this.computeResult(uniNum);
    }
    return this.result;
  }

  private computeResult(uniNum: number) {
    console.log(uniNum, 1 - this.Discount[uniNum]);
    return this.EUR_ONE_BOOK * (uniNum * (1 - this.Discount[uniNum]));
  }
  private haveToChangeStrategy(uniNum: number): boolean {
    return this.books.length > 6 && this.books.length < 10 && uniNum === 5;
  }
  private removeBookAndUpdate(item: number) {
    const k = this.books.indexOf(item, 0);
    this.books.splice(k, 1);
  }
}
