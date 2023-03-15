export class ValueStorage<T> {
  constructor (
    public type: 'sessionStorage' | 'localStorage',
    public name: string,
    public serialize: (value: T) => string,
    public deserialize: (text: string) => T,
    public defaultValue: () => T) {

  }

  get storage () {
    return global[this.type];
  }

  get (): T {
    if (typeof this.storage === 'undefined') {
      return this.defaultValue();
    }
    const text = this.storage.getItem(this.name);
    if (text != null) {
      return this.deserialize(text);
    } else {
      return this.defaultValue();
    }
  }

  set (value: T | null | undefined) {
    if (typeof this.storage === 'undefined') {
      return;
    }
    if (value == null) {
      this.storage.removeItem(this.name);
    } else {
      this.storage.setItem(this.name, this.serialize(value));
    }
  }
}
