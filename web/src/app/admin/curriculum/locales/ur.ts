import { localePart1 } from './parts/ur_part1';
import { localePart2 } from './parts/ur_part2';

export const locale: Record<string, string> = {
  ...localePart1,
  ...localePart2
};
