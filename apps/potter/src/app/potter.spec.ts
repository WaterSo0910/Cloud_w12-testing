import { Potter } from './potter';

describe('Potter', () => {
  let potter: Potter;
  beforeEach(() => {
    potter = new Potter();
  });

  it('should create an instance', () => {
    expect(potter).toBeTruthy();
  });
  test('Basics', () => {
    expect(potter.price([])).toBe(0);
    expect(potter.price([1])).toBe(8);
    expect(potter.price([2])).toBe(8);
    expect(potter.price([3])).toBe(8);
    expect(potter.price([4])).toBe(8);
    expect(potter.price([1, 1, 1])).toBe(8 * 3);
  });
  test('Simple Discounts', () => {
    expect(potter.price([0, 1])).toBe(8 * 2 * 0.95);
    expect(potter.price([0, 2, 4])).toBe(8 * 3 * 0.9);
    expect(potter.price([0, 1, 2, 4])).toBe(8 * 4 * 0.8);
    expect(potter.price([0, 1, 2, 3, 4])).toBe(8 * 5 * 0.75);
  });
  test('Several Discounts', () => {
    expect(potter.price([0, 0, 1])).toBe(8 + 8 * 2 * 0.95);
    expect(potter.price([0, 0, 1, 1])).toBe(2 * (8 * 2 * 0.95));
    expect(potter.price([0, 0, 1, 2, 2, 3])).toBe(8 * 4 * 0.8 + 8 * 2 * 0.95);
    expect(potter.price([0, 1, 1, 2, 3, 4])).toBe(8 + 8 * 5 * 0.75);
  });
  test('Edge Cases', () => {
    expect(potter.price([0, 0, 1, 1, 2, 2, 3, 4])).toBe(2 * (8 * 4 * 0.8));
    expect(
      potter.price([
        0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4,
      ])
    ).toBe(3 * (8 * 5 * 0.75) + 2 * (8 * 4 * 0.8));
  });
});
