import { atom } from "jotai";
import type { Primitive } from "../types/primitive";

// A global signal emitter
export const globalEmitterAtom = atom<(p: Primitive) => void>();
