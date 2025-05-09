export const isUUID = (uuid: string): boolean =>
  uuid.match(
    '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  ) !== null;

export const calculateUsdtAmount = (usdCents: number) => BigInt(usdCents * 10000);

export async function wait(timeout: number) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay: number },
): Promise<T> {
  let lastError: Error | undefined;
  let delay = options.delay;
  for (let i = 0; i < options.retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (e instanceof Error) {
        lastError = e;
      }
      // await wait(options.delay);
      
      await wait(Math.min(delay, 30000));
      delay *= 2; 
    }
  }
  throw lastError;
}
