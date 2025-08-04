// A primitive type for signals
export interface Primitive {
  title: string;
  body: string;
}

// The validator function for primitive types
export const isPrimitiveType = (s: string): [boolean, Primitive] => {
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
};
