import { useState } from "react";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  CenteringMethodType,
  OutputFolderConfiguration,
} from "../methodComponents";
import { TemplateComponentProps } from "../../../../types";
import { CenteringMode, PipelineType, ScanType } from "./types";
import {
  DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
  I13180360PipelineParameterConfig,
  I13180PipelineConfigurationComponent,
} from "./I13180ParameterConfiguration";

type I13PipelineParameterConfig =
  | {
      scanType: (typeof ScanType)[180];
      scanConfig: I13180360PipelineParameterConfig;
    }
  | {
      scanType: (typeof ScanType)[360];
      scanConfig: I13180360PipelineParameterConfig;
    };

export const I13ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  visitDirpath,
  setParameters,
}) => {
  const [scanType, setScanType] = useState<ScanType>(ScanType[180]);
  const [outputFolder, setOutputFolder] = useState<string>("");
  const [config, setConfig] = useState<I13PipelineParameterConfig>({
    scanType: ScanType[180],
    scanConfig: {
      pipelineType: PipelineType.Absorption,
      pipelineConfig: {
        degreesType: CenteringMethodType[180],
        degreesConfig: {
          centeringMode: CenteringMode.Auto,
          parameters: DEFAULT_CENTERING_180_AUTO_PARAMETER_VALUES,
        },
      },
    },
  });

  const displayScanTypeConfigurationComponent = () => {
    if (scanType === ScanType[180]) {
      return (
        <I13180PipelineConfigurationComponent
          visitDirpath={visitDirpath}
          outputFolder={outputFolder}
          setOutputFolder={setOutputFolder}
          pipelineParameterConfig={config.scanConfig}
          setPipelineParameterConfig={(pipelineConfig) => {
            setConfig({
              ...config,
              scanConfig: pipelineConfig,
            });
          }}
          setParameters={(pipelineParams) => {
            const date = new Date();
            const httomoOutdirName = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_output`;
            setParameters({
              config: pipelineParams,
              output: visitDirpath + outputFolder,
              "httomo-outdir-name": httomoOutdirName,
            });
          }}
        />
      );
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
            <ToggleButton key={val} value={val}>
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {displayScanTypeConfigurationComponent()}
      <OutputFolderConfiguration
        visitDirpath={visitDirpath}
        outputFolder={outputFolder}
        setOutputFolder={setOutputFolder}
      />
    </Stack>
  );
};
