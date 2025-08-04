// This function takes a json string, validates it and conumes what's validated
export function controlFlow<I, O>(
  rawInput: I,
  validateFn: (i: I) => [boolean, O],
  consumeFn: (validated: O) => void
): void {
  try {
    const [ok, result] = validateFn(rawInput);
    if (ok) consumeFn(result);
  } catch (e) {
    console.error("Validation failed:", e);
  }
}
