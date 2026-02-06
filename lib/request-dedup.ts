const pending = new Map<string, Promise<unknown>>();

export function deduplicateRequest<T>(
  key: string,
  factory: () => Promise<T>
): Promise<T> {
  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;

  const promise = factory().finally(() => {
    pending.delete(key);
  });

  pending.set(key, promise);
  return promise;
}
