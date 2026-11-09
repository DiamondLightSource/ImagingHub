import type { MultiScanArray } from "./../types";

type xanesData = {
  method?: string;
  brute?: boolean;
  normalise?: boolean;
};

export const initialData: xanesData = {
  method: "mutual",
  brute: false,
  normalise: true,
};
