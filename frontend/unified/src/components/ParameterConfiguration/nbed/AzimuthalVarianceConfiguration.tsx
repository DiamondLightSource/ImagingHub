import React, { FC } from "react";
import {
  Card,
  Stack,
  TextField,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../../types";

export const AzimuthalVarianceConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [sample, setSample] = useState<string>("");
  const [timeStamp, setTimeStamp] = useState<string>("");
  const [calibPath, setCalibPath] = useState<string>("");
  const [maskPath, setMaskPath] = useState<string>("");
  const [cropQ, setCropQ] = useState<string>("0");
  const [binning, setBinning] = useState<string>("1");
  const [hotPixelThrshold, setHotPixelThrshold] = useState<string>("0.1");
  const [braggDiskMin, setBraggDiskMin] = useState<string>("0.25");
  const [azimuthalBins, setAzimuthalBins] = useState<string>("360");

  const [methodsIndex, setMethodsIndex] = useState(0);
  const originMethods = ["bragg", "com"];

  useEffect(() => {
    setParameters({
      sample_name: sample,
      timestamp: timeStamp,
      calib_path: calibPath,
      maskpath: maskPath,
      origin_method: originMethods[methodsIndex],
      crop_q: cropQ,
    });
  }, [sample, timeStamp, calibPath, maskPath]);

  const [listState, setliststate] = React.useState<null | HTMLElement>(null);
  const open = Boolean(listState);

  const handleClose = () => {
    setliststate(null);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setliststate(event.currentTarget);
  };

  const handleMenuListItem = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setMethodsIndex(index);
    setliststate(null);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Typography>Data parameters</Typography>
        <Stack direction="column" spacing={1}>
          <TextField
            label={"Name of the sample"}
            value={sample}
            onChange={(e) => setSample(e.target.value)}
          />
          <TextField
            label={"Time stamp of data"}
            value={timeStamp}
            onChange={(e) => setTimeStamp(e.target.value)}
          />
          <TextField
            label={"Calibration Json file"}
            value={calibPath}
            onChange={(e) => setCalibPath(e.target.value)}
          />
          <TextField
            label={"Mask path (leave blank to skip masking step)"}
            value={maskPath}
            onChange={(e) => setMaskPath(e.target.value)}
          />
        </Stack>
        <p />
        <Typography>Processing</Typography>
        <Stack spacing={1}>
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              p: 0.1,
              border: "1px solid #89987880",
              borderRadius: "4px",
            }}
          >
            <List>
              <ListItemButton onClick={handleClickListItem}>
                <ListItemText
                  primary={`Method: ${originMethods[methodsIndex]}`}
                  secondary="Select a Method to find the origin of diffraction pattern (bragg - slow as in the manual notebook) or com (fast)"
                />
              </ListItemButton>
            </List>
            <Menu anchorEl={listState} open={open} onClose={handleClose}>
              {originMethods.map((option: string, index: number) => (
                <MenuItem
                  key={option}
                  role="menuitemradio"
                  selected={originMethods[methodsIndex] === option}
                  onClick={(event) => handleMenuListItem(event, index)}
                >
                  <ListItemText>{option}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Card>
          <TextField
            label={"Diffraction crop half width in pixels (0 = no crop)"}
            value={cropQ}
            onChange={(e) => setCropQ(e.target.value)}
            type="number"
          />
          <TextField
            label={"Real space binning"}
            value={binning}
            onChange={(e) => setBinning(e.target.value)}
            type="number"
          />
          <TextField
            label={"Hot pixel thresholding value"}
            value={hotPixelThrshold}
            onChange={(e) => setHotPixelThrshold(e.target.value)}
            type="number"
          />
          <TextField
            label={"Bragg disk minimum absolute intensity"}
            value={braggDiskMin}
            onChange={(e) => setBraggDiskMin(e.target.value)}
            type="number"
          />
          <TextField
            label={"Number of azimuthal bins"}
            value={azimuthalBins}
            onChange={(e) => setAzimuthalBins(e.target.value)}
            type="number"
          />
        </Stack>
      </Card>
    </>
  );
};
