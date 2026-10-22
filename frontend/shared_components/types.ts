type ElementPair = {
  element: string;
  transition: string;
};

type ElementPairArray = {
  id: number;
} & ElementPair;

type ScanRange = {
  start: number;
  end: number;
  excluded?: number[];
};

type RawScanRange = {
  start: string;
  end: string;
  excluded?: string;
};

type MultiScanArray = {
  id: number;
} & ScanRange;

type GridPanel = (string | null)[][];

type Option = { label: string; value: string; desc?: string };

type GridOption = Option & {
  row?: number;
  column?: number;
};
