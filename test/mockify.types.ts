export type Mockify<T> = {
  [P in keyof T]?: T[P] extends (...args: any) => any
    ? jest.Mock<
        ReturnType<T[P]> extends Promise<unknown> ? Promise<unknown> : unknown
      >
    : Mockify<T[P]>;
};
