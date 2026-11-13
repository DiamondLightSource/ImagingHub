import { useState } from "react";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const ScanType = {
  180: "180",
  360: "360",
  Radiography: "Radiography",
  TXM: "TXM",
} as const;
type ScanType = (typeof ScanType)[keyof typeof ScanType];

const Magnification = [1.25, 2, 4, 10] as const;

const PipelineType = {
  Absorption: "Absorption",
  Paganin: "Paganin",
} as const;
type PipelineType = (typeof PipelineType)[keyof typeof PipelineType];

const CenteringMode = {
  Auto: "Auto",
  Sweep: "Sweep",
  Fixed: "Fixed",
} as const;
type CenteringMode = (typeof CenteringMode)[keyof typeof CenteringMode];

export const I13ParameterConfiguration = () => {
  const [scanType, setScanType] = useState<ScanType>(ScanType[180]);

  const displayScanTypeConfigurationComponent = () => {
    if (scanType === ScanType[180]) {
      return <I13180PipelineConfigurationComponent />;
    } else {
      return <p>Not implemented</p>;
    }
  };

  return (
    <Stack direction="column" spacing={2} marginBottom={2}>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Scan type</Typography>
        <ToggleButtonGroup
          exclusive
          value={scanType}
          aria-label="i13-scan-type-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "180") {
                setScanType(ScanType[180]);
              } else if (newValue === "360") {
                setScanType(ScanType[360]);
              } else if (newValue === "Radiography") {
                setScanType(ScanType.Radiography);
              } else {
                setScanType(ScanType.TXM);
              }
            }
          }}
        >
          {Object.keys(ScanType).map((val) => (
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {displayScanTypeConfigurationComponent()}
    </Stack>
  );
};

const I13180PipelineConfigurationComponent = () => {
  const [magnification, setMagnification] =
    useState<(typeof Magnification)[number]>(1.25);
  const [pipelineType, setPipelineType] = useState<PipelineType>(
    PipelineType.Absorption
  );
  const [centeringMode, setCenteringMode] = useState<CenteringMode>(
    CenteringMode.Auto
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
            <ToggleButton value={mag}>{`x${mag}`}</ToggleButton>
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
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Typography>Centering</Typography>
        <ToggleButtonGroup
          exclusive
          value={centeringMode}
          aria-label="i13-centering-mode-toggle"
          onChange={(
            _: React.MouseEvent<HTMLElement>,
            newValue: string | null
          ) => {
            if (newValue) {
              if (newValue === "Auto") {
                setCenteringMode(CenteringMode.Auto);
              } else if (newValue === "Sweep") {
                setCenteringMode(CenteringMode.Sweep);
              } else {
                setCenteringMode(CenteringMode.Fixed);
              }
            }
          }}
        >
          {Object.keys(CenteringMode).map((val) => (
            <ToggleButton value={val}>{val}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </>
  );
};
