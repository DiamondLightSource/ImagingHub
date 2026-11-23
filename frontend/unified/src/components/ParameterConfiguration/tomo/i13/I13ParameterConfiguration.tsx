import { useState } from "react";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { OutputFolderConfiguration } from "../methodComponents";
import { TemplateComponentProps } from "../../../../types";
import { ScanType } from "./types";
import { I13180PipelineConfigurationComponent } from "./I13180ParameterConfiguration";

export const I13ParameterConfiguration: React.FC<TemplateComponentProps> = ({
  visitDirpath,
  setParameters,
}) => {
  const [scanType, setScanType] = useState<ScanType>(ScanType[180]);
  const [outputFolder, setOutputFolder] = useState<string>("");

  const displayScanTypeConfigurationComponent = () => {
    if (scanType === ScanType[180]) {
      return (
        <I13180PipelineConfigurationComponent
          visitDirpath={visitDirpath}
          outputFolder={outputFolder}
          setOutputFolder={setOutputFolder}
          setParameters={(pipelineParams) => {
            const date = new Date();
            const httomoOutdirName = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}_output`;
            setParameters({
              ...pipelineParams,
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
