import { useState } from "react";
import { Magnification, PipelineType } from "./types";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { I13180AbsorptionPipelineConfigurationComponent } from "./I13180AbsorptionParameterConfiguration";
import { I13180PaganinPipelineConfigurationComponent } from "./I13180PaganinParameterConfiguration";

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

export type I13180PipelineConfigurationComponentProps = {
  visitDirpath: string;
  setParameters: (_: object) => void;
};

export const I13180PipelineConfigurationComponent: React.FC<
  I13180PipelineConfigurationComponentProps
> = ({ visitDirpath, setParameters }) => {
  const [magnification, setMagnification] =
    useState<(typeof Magnification)[number]>(1.25);
  const [pipelineType, setPipelineType] = useState<PipelineType>(
    PipelineType.Absorption
  );

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
          value={pipelineType}
          aria-label="i13-pipeline-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Absorption") {
                setPipelineType(PipelineType.Absorption);
              } else {
                setPipelineType(PipelineType.Paganin);
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
      {pipelineType === PipelineType.Absorption ? (
        <I13180AbsorptionPipelineConfigurationComponent
          magnification={magnification}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      ) : (
        <I13180PaganinPipelineConfigurationComponent
          magnification={magnification}
          visitDirpath={visitDirpath}
          setParameters={setParameters}
        />
      )}
    </>
  );
};
