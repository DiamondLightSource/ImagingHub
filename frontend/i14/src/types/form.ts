import type {
  ElementPair,
  ElementPairArray,
} from "./../../../shared_components/types";

type WorkflowFormData = {
  visit: string;
  template: string;
  outpath: string;
  edgeElementArray?: ElementPairArray[];
  edgeElement?: ElementPair;
  elementToAlign?: ElementPair;
  method?: string;
  brute?: boolean;
  max_fractional_shift?: number;
};
