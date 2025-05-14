export interface Context {
  index: number;
  lines: string[];
  [key: string]: any;
}

export type PearlModule = (
  tokens: string[],
  modules: Record<string, PearlModule>,
  context: Context
) => void | Promise<void>;
