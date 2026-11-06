import type { MultiScanArray } from "./../types";

type xanesData = {
  multiScan: MultiScanArray;
  edgeElement: string;
  edgeTransition: string;
  outputFolder: string;
  elementToAlign?: string;
  transitionToAlign?: string;
  method?: string;
  brute?: boolean;
  max_fractional_shift?: number;
  normalise?: boolean;
};

export const initialData: xanesData = {
  multiScan: [{ id: 1, start: "", end: "", excluded: "" }],
  edgeElement: "",
  edgeTransition: "",
  outputFolder: "/dls/i14/data/",
  elementToAlign: "",
  transitionToAlign: "",
  method: "mutual",
  brute: false,
  max_fractional_shift: 0.2,
  normalise: true,
};
