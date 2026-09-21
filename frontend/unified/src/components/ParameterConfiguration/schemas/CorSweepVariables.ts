type RawAngles = {
  data_path: string;
};

type UserDefinedAngles = {
  start_angle: number;
  stop_angle: number;
  angles_total: number;
};

type PreviewKeyword = "begin" | "mid" | "end";

type StartStopEntry = {
  start: PreviewKeyword | number | null;
  start_offset: number | null;
  stop: PreviewKeyword | number | null;
  stop_offset: number | null;
};

type PreviewParam = {
  angles: StartStopEntry | null;
  detector_y: "mid" | StartStopEntry | null;
};

type StandardTomoLoaderParams = {
  data_path: string;
  image_key_path: string;
  rotation_angles: RawAngles | UserDefinedAngles;
  preview: PreviewParam | null;
};

type StandardTomoLoaderConfig = {
  method: string;
  module_path: string;
  parameters: StandardTomoLoaderParams;
};

type SweepConfig = {
  start: number;
  stop: number;
  step: number;
};

type TomopyReconConfigParams = {
  center: SweepConfig;
  sinogram_order: boolean;
  algorithm: string;
  init_recon: null;
};

type TomopyReconConfig = {
  method: string;
  module_path: string;
  parameters: TomopyReconConfigParams;
  save_result: boolean;
};

type TomopyNormalizeParams = {
  cutoff: number | null;
  averaging: "mean" | "median" | null;
};

type TomopyNormalizeConfig = {
  method: string;
  module_path: string;
  parameters: TomopyNormalizeParams;
  save_result: boolean;
};

type TomopyMinusLogConfig = {
  method: string;
  module_path: string;
  parameters: Record<string, never>;
  save_result: boolean;
};

export type CorSweepVariables =
  | [StandardTomoLoaderConfig, TomopyReconConfig]
  | [
      StandardTomoLoaderConfig,
      TomopyNormalizeConfig,
      TomopyMinusLogConfig,
      TomopyReconConfig,
    ];
