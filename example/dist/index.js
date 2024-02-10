// /Users/vincent/progressive/example/node_modules/bun-template/dist/index.js
class y {
  q;
  w;
  #F;
  #q = false;
  #x = 0;
  #w;
  #y;
  constructor(F, q, w) {
    this.getValue = q;
    this.apply = w;
    this.#y = F, this.#F = this.getValue(F);
  }
  set element(F) {
    this.#y = F, this.#F = this.getValue(F), this.#w = undefined;
  }
  setGoal(F, q, w) {
    if (this.#w && this.#w !== w)
      return;
    if (this.#F !== F || this.#x !== q)
      this.#x = q, this.#F = F, this.#w = w, this.#q = true;
  }
  get goal() {
    return this.#F;
  }
  update(F) {
    if (this.#q) {
      const q = this.getValue(this.#y), w = this.goal - q, x = Math.min(Math.abs(w), this.#x * F);
      if (x <= 0.01)
        this.apply(this.#y, this.goal), this.#q = false, this.#w = undefined;
      else
        this.apply(this.#y, q + x * Math.sign(w));
    }
    return this.#q;
  }
}

class z {
  i;
  f;
  warningLimit = 50000;
  #F = new Set;
  #q = [];
  constructor(F, q) {
    this.initCall = F, this.onRecycle = q;
  }
  create(...F) {
    const q = this.#q.pop();
    if (q)
      return this.#F.add(q), this.initCall(q, ...F);
    const w = this.initCall(undefined, ...F);
    return this.#F.add(w), this.#w(), w;
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
    this.#q.length = 0, this.#F.clear();
  }
  countObjectsInExistence() {
    return this.#F.size + this.#q.length;
  }
  #x(F) {
    this.#q.push(F), this.onRecycle?.(F);
  }
  #w() {
    if (this.countObjectsInExistence() === this.warningLimit)
      console.warn("ObjectPool already created", this.#F.size + this.#q.length, "in", this.constructor.name);
  }
}

class A extends z {
  constructor() {
    super((F, q) => {
      if (!F)
        return new y(q, (w) => w.valueOf(), (w, x) => w.setValue(x));
      return F.element = q, F;
    });
  }
}
var H = new A;

class B {
  q;
  w;
  #F = 0;
  #q;
  constructor(F = 0, q, w = H) {
    this.onChange = q;
    this.pool = w;
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
    if (this.#q) {
      const q = !!this.#q.update(F);
      if (!q)
        this.pool.recycle(this.#q), this.#q = undefined;
      return q;
    }
    return false;
  }
  refresh({ deltaTime: F, stopUpdate: q }) {
    if (!this.update(F))
      q();
  }
  progressTowards(F, q, w, x) {
    if (!this.#q)
      this.#q = this.pool.create(this);
    if (this.#q.setGoal(F, q, w), x)
      x.loop(this, undefined);
  }
  get goal() {
    return this.#q?.goal ?? this.valueOf();
  }
}
export {
  B as NumVal
};
