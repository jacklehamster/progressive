import { jest, describe, beforeEach, afterEach, it, expect } from "bun:test"
import { Progressive } from './Progressive';

describe('Progressive', () => {
  let testElement: { value: number };
  let getValue;
  let apply;
  let progressive: Progressive<{ value: number }>;

  beforeEach(() => {
    testElement = { value: 0 };
    getValue = jest.fn().mockImplementation((element) => element.value);
    apply = jest.fn().mockImplementation((element, value) => {
      element.value = value;
    });
    progressive = new Progressive(testElement, getValue, apply);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should update element to the goal value', () => {
    progressive.setGoal(10, 5);
    progressive.update(1); // deltaTime = 1
    expect(apply).toHaveBeenCalledWith(testElement, 5); // Only 5 is applied as speed is 5
    progressive.update(1); // deltaTime = 1
    expect(apply).toHaveBeenCalledWith(testElement, 10); // Goal value is reached
    expect(progressive.update(1)).toBe(false); // Should return false as no update is needed
  });

  it('should update element with minimum distance when close to goal value', () => {
    testElement.value = 8;
    progressive.setGoal(10, 1);
    progressive.update(1); // deltaTime = 1
    expect(apply).toHaveBeenCalledWith(testElement, 9); // Minimum distance update
    progressive.update(1); // deltaTime = 1
    expect(apply).toHaveBeenCalledWith(testElement, 10); // Goal value is reached
    expect(progressive.update(1)).toBe(false); // Should return false as no update is needed
  });
});
