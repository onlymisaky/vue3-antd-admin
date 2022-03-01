/**
 * @author zhushiqi
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Constructor<T> {
  new(...args: any[]): T;
}

export function singleton<T>(Target: Constructor<T>) {
  // @ts-ignore
  return class Singleton extends Target {
    static instance: T;

    static getInstance(...args: any[]): T {
      if (!Singleton.instance) {
        Singleton.instance = new Target(...args);
      }
      return Singleton.instance;
    }
  };
}
