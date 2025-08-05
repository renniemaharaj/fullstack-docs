// A primitive type for signals
export class Primitive {
  public title: string;
  public body: string;
  // public validator: ()=>[boolean, Primitive]

  constructor(title?: string, body?: string) {
    this.title = title ?? "";
    this.body = body ?? "";
  }

  setTitle(t: string): this {
    this.title = t;
    return this;
  }

  setBody(b: string): this {
    this.body = b;
    return this;
  }

  toString(): string {
    return JSON.stringify({ title: this.title, body: this.body });
  }

  // The validator function for primitive types
  static validator(s: string): [boolean, Primitive] {
    const nilPrimitive: Primitive = { title: "", body: "" } as Primitive;
    try {
      const parsed = JSON.parse(s);
      if ("title" in parsed && "body" in parsed) return [true, parsed];
      return [false, nilPrimitive];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
      return [false, nilPrimitive];
    }
  }
}
