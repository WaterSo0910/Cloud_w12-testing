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
