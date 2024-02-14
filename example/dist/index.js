// /Users/vincent/progressive-value/example/node_modules/progressive-value/dist/index.js
class y {
  w;
  q;
  #F;
  #w = false;
  #x = 0;
  #q;
  #y;
  constructor(F, w, q) {
    this.getValue = w;
    this.apply = q;
    this.#y = F, this.#F = this.getValue(F);
  }
  set element(F) {
    this.#y = F, this.#F = this.getValue(F), this.#q = undefined;
  }
  setGoal(F, w, q) {
    if (this.#q && this.#q !== q)
      return;
    if (this.#F !== F || this.#x !== w)
      this.#x = w, this.#F = F, this.#q = q, this.#w = true;
  }
  get goal() {
    return this.#F;
  }
  update(F) {
    if (this.#w) {
      const w = this.getValue(this.#y), q = this.goal - w, x = Math.min(Math.abs(q), this.#x * F);
      if (x <= 0.01)
        this.apply(this.#y, this.goal), this.#w = false, this.#q = undefined;
      else
        this.apply(this.#y, w + x * Math.sign(q));
    }
    return this.#w;
  }
}

class z {
  i;
  f;
  warningLimit = 50000;
  #F = new Set;
  #w = [];
  constructor(F, w) {
    this.initCall = F, this.onRecycle = w;
  }
  create(...F) {
    const w = this.#w.pop();
    if (w)
      return this.#F.add(w), this.initCall(w, ...F);
    const q = this.initCall(undefined, ...F);
    return this.#F.add(q), this.#q(), q;
  }
  recycle(F) {
    this.#F.delete(F), this.#x(F);
  }
  recycleAll() {
    for (let F of this.#F)
      this.#x(F);
    this.#F.clear();
  }
  clear() {
    this.#w.length = 0, this.#F.clear();
  }
  countObjectsInExistence() {
    return this.#F.size + this.#w.length;
  }
  #x(F) {
    this.#w.push(F), this.onRecycle?.(F);
  }
  #q() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#F.size + this.#w.length, "in", this.constructor.name);
  }
}

class A extends z {
  constructor() {
    super((F, w) => {
      if (!F)
        return new y(w, (q) => q.valueOf(), (q, x) => q.setValue(x));
      return F.element = w, F;
    });
  }
}
var H = new A;

class B {
  w;
  q;
  #F = 0;
  #w;
  constructor(F = 0, w, q = H) {
    this.onChange = w;
    this.pool = q;
    this.#F = F;
  }
  valueOf() {
    return this.#F;
  }
  setValue(F) {
    if (F !== this.#F)
      this.#F = F, this.onChange?.(this.#F);
    return this;
  }
  addValue(F) {
    return this.setValue(this.#F + F), this;
  }
  update(F) {
    if (this.#w) {
      const w = !!this.#w.update(F);
      if (!w)
        this.pool.recycle(this.#w), this.#w = undefined;
      return w;
    }
    return false;
  }
  refresh({ deltaTime: F, stopUpdate: w }) {
    if (!this.update(F))
      w();
  }
  progressTowards(F, w, q, x) {
    if (!this.#w)
      this.#w = this.pool.create(this);
    if (this.#w.setGoal(F, w, q), x)
      x.loop(this, undefined);
  }
  get goal() {
    return this.#w?.goal ?? this.valueOf();
  }
}
export {
  B as NumVal
};
