import { jest, describe, beforeEach, afterEach, it, expect } from "bun:test"
import { NumVal, ProgressivePool } from './NumVal';

describe('NumVal', () => {
  let progressivePoolMock;

  beforeEach(() => {
    progressivePoolMock = new ProgressivePool();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a NumVal instance with default value', () => {
    const numVal = new NumVal();
    expect(numVal.valueOf()).toBe(0);
  });

  it('should set value correctly', () => {
    const onChangeMock = jest.fn();
    const numVal = new NumVal(5, onChangeMock, progressivePoolMock);
    numVal.setValue(10);
    expect(numVal.valueOf()).toBe(10);
    expect(onChangeMock).toHaveBeenCalledWith(10);
  });

  it('should add value correctly', () => {
    const onChangeMock = jest.fn();
    const numVal = new NumVal(5, onChangeMock, progressivePoolMock);
    numVal.addValue(10);
    expect(numVal.valueOf()).toBe(15);
    expect(onChangeMock).toHaveBeenCalledWith(15);
  });

  it('should update progressive if exists', () => {
    const updateMock = jest.fn().mockReturnValue(true);
    const progressiveMock = {
      setGoal: jest.fn(),
      update: updateMock,
      goal: 10,
    } as any;
    progressivePoolMock.create = jest.fn().mockReturnValue(progressiveMock);

    const numVal = new NumVal(0, undefined, progressivePoolMock);
    numVal.progressTowards(15, 5);
    numVal.update(1);
    expect(progressivePoolMock.create).toHaveBeenCalledWith(numVal);
    expect(progressiveMock.setGoal).toHaveBeenCalledWith(15, 5, undefined);
    expect(updateMock).toHaveBeenCalledWith(1);
  });

  it('should create new progressive if not exists and update', () => {
    const updateMock = jest.fn().mockReturnValue(true);
    const progressiveMock = {
      setGoal: jest.fn(),
      update: updateMock,
      goal: 10,
    } as any;
    progressivePoolMock.create = jest.fn().mockReturnValue(progressiveMock);

    const numVal = new NumVal(0, undefined, progressivePoolMock);
    numVal.progressTowards(15, 5);
    numVal.update(1);
    expect(progressivePoolMock.create).toHaveBeenCalledWith(numVal);
    expect(updateMock).toHaveBeenCalledWith(1);
  });

  it('should stop update if progressive update returns false', () => {
    const updateMock = jest.fn().mockReturnValue(false);
    const stopUpdateMock = jest.fn();
    const progressiveMock = {
      setGoal: jest.fn(),
      update: updateMock,
      goal: 10,
    } as any;
    progressivePoolMock.create = jest.fn().mockReturnValue(progressiveMock);

    const motorMock = {
      loop: jest.fn(),
    } as any;

    const numVal = new NumVal(0, undefined, progressivePoolMock);
    numVal.progressTowards(15, 5, undefined, motorMock);
    numVal.refresh({ deltaTime: 1, stopUpdate: stopUpdateMock, time: 0, data: undefined, renderFrame: false, cycle: numVal, stopped: false });
    expect(stopUpdateMock).toHaveBeenCalled();
  });

  it('should return current value if progressive does not exist', () => {
    const value = 10;
    const numVal = new NumVal(value, undefined, progressivePoolMock);
    const result = numVal.goal;
    expect(result).toBe(value);
  });
});
