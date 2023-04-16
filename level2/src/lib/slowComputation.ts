export function sleep(interval: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}

export async function compute<T extends object>(
  payload: T,
): Promise<T & { slow_computation: string }> {
  await sleep(3000);
  return Object.assign(payload, { slow_computation: '0.0009878' });
}
