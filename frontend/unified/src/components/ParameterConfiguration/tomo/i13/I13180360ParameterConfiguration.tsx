import { useState } from "react";
import {
  CenteringMode,
  Magnification,
  PaganinMode,
  PipelineType,
} from "./types";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  I13180360AbsorptionPipelineParameterConfig,
  I13180360AbsorptionPipelineConfigurationComponent,
} from "./I13180360AbsorptionParameterConfiguration";
import {
  DEFAULT_PAGANIN_180_FIXED_PARAMETER_VALUES,
  I13180360PaganinPipelineParameterConfig,
  I13180360PaganinPipelineConfigurationComponent,
} from "./I13180360PaganinParameterConfiguration";

const DEFAULT_LOADER_PREVIEW = {
  start: 589,
  stop: 599,
  step: 2,
};

export const DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES = {
  center: 1280,
};

export const DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES = {
  smin: -50,
  smax: 50,
};

export const DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES = {
  loader: {
    start: 589,
    stop: 599,
  },
  center: {
    start: 1180,
    stop: 1380,
    step: 2.0,
  },
};

export type I13180360PipelineParameterConfig =
  | {
      pipelineType: (typeof PipelineType)["Absorption"];
      pipelineConfig: I13180360AbsorptionPipelineParameterConfig;
    }
  | {
      pipelineType: (typeof PipelineType)["Paganin"];
      pipelineConfig: I13180360PaganinPipelineParameterConfig;
    };

export type I13180360PipelineConfigurationComponentProps = {
  visitDirpath: string;
  setParameters: (_: object) => void;
  pipelineParameterConfig: I13180360PipelineParameterConfig;
  setPipelineParameterConfig: (_: I13180360PipelineParameterConfig) => void;
};

export const I13180360PipelineConfigurationComponent: React.FC<
  I13180360PipelineConfigurationComponentProps
> = ({
  visitDirpath,
  pipelineParameterConfig,
  setPipelineParameterConfig,
  setParameters,
}) => {
  const [magnification, setMagnification] =
    useState<(typeof Magnification)[number]>(1.25);

  return (
    <>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Magnification</Typography>
        <ToggleButtonGroup
          exclusive
          value={magnification}
          aria-label="i13-magnification-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: number | null
          ) => {
            if (newValue) {
              if (newValue === 1.25) {
                setMagnification(1.25);
              } else if (newValue === 2) {
                setMagnification(2);
              } else if (newValue === 4) {
                setMagnification(4);
              } else {
                setMagnification(10);
              }
            }
          }}
        >
          {Magnification.map((mag) => (
            <ToggleButton key={mag} value={mag}>{`x${mag}`}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Pipeline type</Typography>
        <ToggleButtonGroup
          exclusive
          value={pipelineParameterConfig.pipelineType}
          aria-label="i13-pipeline-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Absorption") {
                let params;
                switch (
                  pipelineParameterConfig.pipelineConfig.degreesConfig
                    .centeringMode
                ) {
                  case "Auto":
                    params = DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES;
                    break;
                  case "Sweep":
                    params = {
                      loader: DEFAULT_LOADER_PREVIEW,
                      center: DEFAULT_CENTERING_180_SWEEP_PARAMETER_VALUES,
                    };
                    break;
                  case "Fixed":
                    params = DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES;
                    break;
                }
                setPipelineParameterConfig({
                  pipelineType: PipelineType.Absorption,
                  pipelineConfig: {
                    degreesType:
                      pipelineParameterConfig.pipelineConfig.degreesType,
                    degreesConfig: {
                      centeringMode:
                        pipelineParameterConfig.pipelineConfig.degreesConfig
                          .centeringMode,
                      parameters: params,
                    },
                  },
                });
              } else {
                let params;
                if (
                  pipelineParameterConfig.pipelineConfig.degreesConfig
                    .centeringMode === CenteringMode.Auto
                ) {
                  params = {
                    paganin: DEFAULT_PAGANIN_180_FIXED_PARAMETER_VALUES,
                    centering: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
                  };
                } else if (
                  pipelineParameterConfig.pipelineConfig.degreesConfig
                    .centeringMode === CenteringMode.Fixed
                ) {
                  params = {
                    loader: DEFAULT_LOADER_PREVIEW,
                    paganin: DEFAULT_PAGANIN_180_FIXED_PARAMETER_VALUES,
                    recon: DEFAULT_CENTERING_180_FIXED_PARAMETER_VALUES,
                  };
                }
                setPipelineParameterConfig({
                  pipelineType: PipelineType.Paganin,
                  pipelineConfig: {
                    degreesType:
                      pipelineParameterConfig.pipelineConfig.degreesType,
                    degreesConfig: {
                      centeringMode:
                        pipelineParameterConfig.pipelineConfig.degreesConfig
                          .centeringMode,
                      paganinMode: PaganinMode.Fixed,
                      parameters: params,
                    },
                  },
                });
              }
            }
          }}
        >
          {Object.keys(PipelineType).map((val) => (
            <ToggleButton key={val} value={val}>
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {pipelineParameterConfig.pipelineType === PipelineType.Absorption ? (
        <I13180360AbsorptionPipelineConfigurationComponent
          magnification={magnification}
          config={pipelineParameterConfig.pipelineConfig}
          setConfig={(degreesConfig) => {
            setPipelineParameterConfig({
              pipelineType: PipelineType.Absorption,
              pipelineConfig: degreesConfig,
            });
          }}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      ) : (
        <I13180360PaganinPipelineConfigurationComponent
          magnification={magnification}
          config={pipelineParameterConfig.pipelineConfig}
          setConfig={(degreesConfig) => {
            setPipelineParameterConfig({
              pipelineType: PipelineType.Paganin,
              pipelineConfig: degreesConfig,
            });
          }}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      )}
    </>
  );
};
