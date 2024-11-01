/* eslint-disable @typescript-eslint/no-explicit-any */
// globals.d.ts
export {};

declare global {
  interface Window {
    ai: any; // Change `any` to the actual type you want to assign to `ai`
  }
}
