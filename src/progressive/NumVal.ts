import { Progressive } from "./Progressive";
import { Val } from "dok-types";
import { IMotor, Cycle, UpdatePayload } from "motor-loop";
import { ObjectPool } from "bun-pool";

export class ProgressivePool extends ObjectPool<Progressive<NumVal>, [NumVal]> {
  constructor() {
    super((progressive, val) => {
      if (!progressive) {
        return new Progressive(val, elem => elem.valueOf(), (elem, value) => elem.setValue(value));
      }
      progressive.element = val;
      return progressive;
    });
  }
}

const COMMON_PROGRESSIVE_POOL = new ProgressivePool();

export class NumVal implements Val<number>, Cycle {
  #value: number = 0;
  #progressive?: Progressive<NumVal>;

  constructor(value: number = 0,
    readonly onChange?: (value: number) => void,
    private pool: ProgressivePool = COMMON_PROGRESSIVE_POOL) {
    this.#value = value;
  }

  valueOf(): number {
    return this.#value;
  }

  setValue(value: number): this {
    if (value !== this.#value) {
      this.#value = value;
      this.onChange?.(this.#value);
    }
    return this;
  }

  addValue(value: number): this {
    this.setValue(this.#value + value);
    return this;
  }

  update(deltaTime: number): boolean {
    if (this.#progressive) {
      const didUpdate = !!this.#progressive.update(deltaTime);
      if (!didUpdate) {
        this.pool.recycle(this.#progressive);
        this.#progressive = undefined;
      }
      return didUpdate;
    }
    return false;
  }

  refresh({ deltaTime, stopUpdate }: UpdatePayload) {
    if (!this.update(deltaTime)) {
      stopUpdate();
    }
  }

  progressTowards(goal: number, speed: number, locker?: any, motor?: IMotor) {
    if (!this.#progressive) {
      this.#progressive = this.pool.create(this);
    }
    this.#progressive.setGoal(goal, speed, locker);
    if (motor) {
      motor.loop(this, undefined);
    }
  }

  get goal(): number {
    return this.#progressive?.goal ?? this.valueOf();
  }
}
