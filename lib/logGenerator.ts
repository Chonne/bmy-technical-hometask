export function choose<T>(choices: T[]): T {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

export function getRandomInt(min: number, max: number): number {
  return Math.random() * (max - min) + min;
};

export function getRound(toRound: number): number {
  return Math.round((toRound + Number.EPSILON) * 100) / 100;
};

export function sample(uuid: string): string[] {
  const service = choose(["web", "admin", "api"]);

  return [
    `id=${uuid}`,
    `service_name=${service}`,
    `process=${service}.${getRandomInt(1, 4001)}`,
    `sample#load_avg_1m=${getRound(Math.random())}`,
    `sample#load_avg_5m=${getRound(Math.random())}`,
    `sample#load_avg_15m=${getRound(Math.random())}`,
  ];
};
