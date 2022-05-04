# W12 Testing Live Coding document
[W12 Testing & Deployment](/WhzmgyR-R2GgBc__8u0vPA)
## 建立開發環境
1. 安裝 node.js LTS 版本
2. 執行 `npx create-nx-workspace` 指令
3. `workspace` 輸入 `w12-testing`
4. 選擇建立 `angular` 
   ![](https://i.imgur.com/a3DHFaY.png)
6. `project` 輸入 `bowling`
7. `Application Name` 輸入 `bowling`
8. `Default stylesheet format` 選擇 `CSS`
9. `Use Nx Cloud` 選擇 `No`
10. 就讓他跑一下，過程中會產生預設專案檔案級安裝 npm package
11. 進入 `w12-testing` 資料夾，輸入 `code .` 或使打開 VSCode 並開啟該資料夾

## 調整 jest 輸出內容
1. 打開 apps/bowling/project.json
2. 找到 `test` 的區塊
3. 在 `options` 的陣列中新增以下內容
  ```
  "coverage": true,
  "outputFile": "result.json",
  "json": true
  ```
4. 打開 terminal 並輸入 `nx test` ，就可以看到測試結果，同時間會產生 `result.json` 檔案在目錄下
5. 調整 `.gitignore` 內容，將 `result.json` 加入，因為這個檔案在每一次執行 `nx test` 時都會被產生，所以不需要入版控

## 建立 GitHub Action (CI)
1. 打開 GitHub 並建立一個空的 repository
2. 根據 `push an existing repository from the command line` 段落的指令，將剛剛建立出來的 `w12-testing` 專案推送到 GitHub 上
3. 在 GitHub 剛剛建立的 repository 頁面應可看到 push 上來的檔案，切到 `Actions` 的功能
  ![](https://i.imgur.com/qeUVM7Q.png)
4. 點選 `set up a workflow yourself`
  ![](https://i.imgur.com/HsWGgJ9.png)
5. 將 `main.yml` 的內容替換成以下內容
```yaml
name: CI
on:
  push:
    branches:
      - main
  pull_request:


jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: nrwl/nx-set-shas@v2
      - run: npm ci
      - run: npx nx test      
      - name: Process jest results with default
        if: always()
        uses: im-open/process-jest-test-results@v2.0.5
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          results-file: 'result.json'

```
6. 按下 `Start commit` & `commit file`
7. 這時候應該會觸發第一次 Action
  ![](https://i.imgur.com/UJ9CC3X.png)
8. 第一次執行會失敗，主要原因是使用的套件需要 `write` 的權限
  ![](https://i.imgur.com/B2twRmk.png)
9. 到 `Settings` --> `Actions` --> `General`，找到 `Workflow permissions` 將其設定成 `Read and write permissions` 後，按下 `Save`
  ![](https://i.imgur.com/7QnFaTq.png)
  ![](https://i.imgur.com/NdEGASZ.png)
10. 重跑 failed 的 workflow
  ![](https://i.imgur.com/vq3tmFr.png)
11. 成功完成 Build 的動作
  ![](https://i.imgur.com/FiJavm7.png)



## GitHub Action (CD)

- Deploying to Google Kubernetes Engine
回家抽時間看，期末作業會用到這個 

https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-google-kubernetes-engine



# Kata

## TDD 三步驟
![](https://i.imgur.com/ZDNddbN.png)
紅燈 -> 綠燈 -> 重構

## Bowling
1. 建立一個新的 Branch 並切換至新 branch. (任何名稱皆可)
2. 使用 nx 指令產生 game.ts 
```
nx g class game
```
這時候會產生兩個檔案 `game.ts` 和 `game.spec.ts`
3. 執行 `nx test bowling --test-file=game.spec.ts` 進行第一次測試
  ![](https://i.imgur.com/KDOCPMz.png)
4. 開啟 `game.spec.ts` 和 `game.ts` 檔案
5. 建立第一個測試 (紅燈)
```typescript=
// game.spec.ts
test('gutter game', () => {
    const game = new Game();
    for (let i = 0; i < 20; i++) {
      game.roll(0);
    }
    expect(game.score).toBe(0);
});
```
```typescript=
// game.ts
export class Game {
  roll(pins: number) {}

  get score() {
    return -1;
  }
}
```
6. 第一個綠燈
```typescript=
// game.ts
export class Game {
  roll(pins: number) {}

  get score() {
    return 0;
  }
}
```
7. 第二個測試 (紅燈)
```typescript=
// game.spec.ts
test('all one', () => {
    const game = new Game();
    for (let i = 0; i < 20; i++) {
      game.roll(1);
    }
    expect(game.score).toBe(20);
});
```
8. 第二個測試 (綠燈)
```typescript=
// game.ts
export class Game {
  private _score = 0;
  roll(pins: number) {
    this._score += pins;
  }

  get score() {
    return this._score;
  }
}
```
9. 第一次重構
```typescript=
// game.spec.ts
import { Game } from './game';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  it('should create an instance', () => {
    expect(game).toBeTruthy();
  });

  test('all zero', () => {
    rollMany(20, 0);
    expect(game.score).toBe(0);
  });

  test('all one', () => {
    rollMany(20, 1);
    expect(game.score).toBe(20);
  });

  function rollMany(n: number, pins: number) {
    for (let i = 0; i < n; i++) {
      game.roll(pins);
    }
  }
});

```
10. 第三個測試 (紅燈)
```typescript=
// game.spec.ts
test('test on one spare', () => {
  game.roll(5);
  game.roll(5); // spare
  game.roll(3);
  rollMany(17, 0);
  expect(game.score).toBe(16);
});
```
11. 第三個測試 (綠燈)
```typescript=
// game.ts
export class Game {
  private rolls: number[] = [];
  private currentRoll = 0;

  roll(pins: number) {
    this.rolls[this.currentRoll++] = pins;
  }

  get score() {
    let score = 0;
    let i = 0;
    for (let frame = 0; frame < 10; frame++) {
      if (this.rolls[i] + this.rolls[i + 1] === 10) {
        score += 10 + this.rolls[i + 2];
      } else {
        score += this.rolls[i] + this.rolls[i + 1];
      }
      i += 2;
    }
    return score;
  }
}

```
12. 第二次重構
```typescript=
// game.ts
export class Game {
  private rolls: number[] = [];
  private currentRoll = 0;
  roll(pins: number) {
    this.rolls[this.currentRoll++] = pins;
  }

  get score() {
    let score = 0;
    let frameIndex = 0;
    for (let frame = 0; frame < 10; frame++) {
      if (this.isSpare(frameIndex)) {
        score += 10 + this.rolls[frameIndex + 2];
      } else {
        score += this.rolls[frameIndex] + this.rolls[frameIndex + 1];
      }
      frameIndex += 2;
    }
    return score;
  }

  private isSpare(frameIndex: number) {
    return this.rolls[frameIndex] + this.rolls[frameIndex + 1] === 10;
  }
}
```
13. 第四個測試 (紅燈)
```typescript=
// game.spec.ts
test('test on one strike', () => {
  game.roll(10);
  game.roll(3);
  game.roll(4);
  rollMany(17, 0);
  expect(game.score).toBe(24);
});
```
14. 第四個測試 (綠燈)
```typescript=
// game.ts
export class Game {
  private rolls: number[] = [];
  private currentRoll = 0;
  roll(pins: number) {
    this.rolls[this.currentRoll++] = pins;
  }

  get score() {
    let score = 0;
    let frameIndex = 0;
    for (let frame = 0; frame < 10; frame++) {
      // add this block
      if (this.rolls[frameIndex] === 10) {
        score += 10 + this.rolls[frameIndex + 1] + this.rolls[frameIndex + 2];
        frameIndex++;
        continue;
      }
      // block-end
      if (this.isSpare(frameIndex)) {
        score += 10 + this.rolls[frameIndex + 2];
      } else {
        score += this.rolls[frameIndex] + this.rolls[frameIndex + 1];
      }
      frameIndex += 2;
    }
    return score;
  }

  private isSpare(frameIndex: number) {
    return this.rolls[frameIndex] + this.rolls[frameIndex + 1] === 10;
  }
}

```
15. 第三次重構
```typescript=
// game.ts
export class Game {
  private rolls: number[] = [];
  private currentRoll = 0;
  roll(pins: number) {
    this.rolls[this.currentRoll++] = pins;
  }

  get score() {
    let score = 0;
    let frameIndex = 0;
    for (let frame = 0; frame < 10; frame++) {
      if (this.isStrike(frameIndex)) {
        score += 10 + this.strikeBouns(frameIndex);
        frameIndex++;
        continue;
      }
      if (this.isSpare(frameIndex)) {
        score += 10 + this.spareBouns(frameIndex);
      } else {
        score += this.rolls[frameIndex] + this.rolls[frameIndex + 1];
      }
      frameIndex += 2;
    }
    return score;
  }

  private isStrike(frameIndex: number) {
    return this.rolls[frameIndex] === 10;
  }

  private isSpare(frameIndex: number) {
    return this.rolls[frameIndex] + this.rolls[frameIndex + 1] === 10;
  }

  private strikeBouns(frameIndex: number) {
    return this.rolls[frameIndex + 1] + this.rolls[frameIndex + 2];
  }

  private spareBouns(frameIndex: number) {
    return this.rolls[frameIndex + 2];
  }
}

```
16. 第五個測試
```typescript=
// game.spec.ts
test('perfect game', () => {
  rollMany(12, 10);
  expect(game.score).toBe(300);
});
```

