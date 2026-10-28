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
