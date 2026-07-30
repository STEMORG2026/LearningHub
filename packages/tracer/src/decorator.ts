import { Tracer } from './tracer';
import type { Span } from './types';

export function traced<TArgs extends unknown[], TReturn>(
  name: string,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  return (...args: TArgs): TReturn => {
    const tracer = Tracer.getInstance();
    const span = tracer.startSpan(name);

    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        (result as Promise<unknown>).then(
          () => { tracer.endSpan(span); },
          (err: Error) => { tracer.errorSpan(span, err); },
        );
      } else {
        tracer.endSpan(span);
      }

      return result;
    } catch (err) {
      tracer.errorSpan(span, err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };
}

export function traceDecorator(name?: string) {
  return function (
    _target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const spanName = name ?? `${(_target as { constructor: { name: string } }).constructor.name}.${propertyKey}`;

    descriptor.value = function (this: unknown, ...args: unknown[]) {
      const tracer = Tracer.getInstance();
      const span: Span = tracer.startSpan(spanName);

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return (result as Promise<unknown>).then(
            (val: unknown) => {
              tracer.endSpan(span);
              return val;
            },
            (err: Error) => {
              tracer.errorSpan(span, err);
              throw err;
            },
          );
        }

        tracer.endSpan(span);
        return result;
      } catch (err) {
        tracer.errorSpan(span, err instanceof Error ? err : new Error(String(err)));
        throw err;
      }
    };

    return descriptor;
  };
}

export { traced as trace };
