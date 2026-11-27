import {
  I13PaganinFilterParameters,
  SweepParameters,
} from "../methodComponents";

const ScanType = {
  180: "180",
  360: "360",
  Radiography: "Radiography",
  TXM: "TXM",
} as const;
type ScanType = (typeof ScanType)[keyof typeof ScanType];
export { ScanType };

export const Magnification = [1.25, 2, 4, 10] as const;

const PipelineType = {
  Absorption: "Absorption",
  Paganin: "Paganin",
} as const;
type PipelineType = (typeof PipelineType)[keyof typeof PipelineType];
export { PipelineType };

const CenteringMode = {
  Auto: "Auto",
  Sweep: "Sweep",
  Fixed: "Fixed",
} as const;
type CenteringMode = (typeof CenteringMode)[keyof typeof CenteringMode];
export { CenteringMode };

const PaganinMode = {
  Sweep: "Sweep",
  Fixed: "Fixed",
} as const;
type PaganinMode = (typeof PaganinMode)[keyof typeof PaganinMode];
export { PaganinMode };

export type I13PaganinFilterSweepParameters = Omit<
  I13PaganinFilterParameters,
  "ratioDeltaBeta"
> & {
  ratioDeltaBeta: SweepParameters;
};

type I13180PipelineParameterConfig = {
  pipelineType: PipelineType;
  config: I13180PaganinPipelineParameterConfig | I13180PipelineParameterConfig;
};
