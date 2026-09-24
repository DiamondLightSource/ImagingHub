import React, { FC } from "react";
import {
  Card,
  Stack,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../types";

export const MibParameterConfiguration = ({
  setParameters,
}: TemplateComponentProps) => {
  const [sample, setSample] = useState<string>("");
  const [sigBinning, setSigBinning] = useState<string>("4");
  const [navBinning, setNavBinning] = useState<string>("4");
  const [dimX, setDimX] = useState<string>("256");
  const [dimY, setDimY] = useState<string>("256");

  const [mibIndex, setmibIndex] = useState(0);
  const mibMethods = ["Auto", "None", "Fly-back", "By known shape"];
  const mibPyMethods = [
    "--auto-reshape",
    "--no-reshaping",
    "--use-fly-back",
    "--known-shape",
  ];

  useEffect(() => {
    setParameters({
      sample_name: sample,
      reshape_option: mibPyMethods[mibIndex],
      bin_sig_factor: sigBinning,
      bin_nav_factor: navBinning,
      Scan_X: dimX,
      Scan_Y: dimY,
      nprocs: 4,
      memory: "32Gi",
    });
  }, [sample, mibMethods[mibIndex], sigBinning, navBinning, dimX, dimY]);

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
    setmibIndex(index);
    setliststate(null);
  };

  //check whether the By known shape option has been chosen
  const roxColComponent = mibMethods[mibIndex] == "By known shape";

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
        <Stack direction="column" spacing={1}>
          <TextField
            label={"Name of the sample"}
            value={sample}
            onChange={(e) => setSample(e.target.value)}
          />
          <List>
            <ListItemButton onClick={handleClickListItem}>
              <ListItemText
                primary={`Method: ${mibMethods[mibIndex]}`}
                secondary="Select a Method to convert the data by clicking here (default: Auto)"
              />
            </ListItemButton>
          </List>
          <Menu anchorEl={listState} open={open} onClose={handleClose}>
            {mibMethods.map((option: string, index: number) => (
              <MenuItem
                key={option}
                role="menuitemradio"
                selected={mibMethods[mibIndex] === option}
                onClick={(event) => handleMenuListItem(event, index)}
              >
                <ListItemText>{option}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
          <TextField
            label="Signal Binning factor (detector)"
            value={sigBinning}
            type="number"
            size="small"
            onChange={(e) => setSigBinning(e.target.value)}
          />
          <TextField
            label="Navigation Binning factor (scan)"
            value={navBinning}
            type="number"
            size="small"
            onChange={(e) => setNavBinning(e.target.value)}
          />
          {roxColComponent ? (
            <>
              <TextField
                label="Dimension in x (row)"
                value={dimX}
                type="number"
                size="small"
                onChange={(e) => setDimX(e.target.value)}
              />
              <TextField
                label="Dimension in y (col)"
                value={dimY}
                type="number"
                size="small"
                onChange={(e) => setDimY(e.target.value)}
              />
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Card>
    </>
  );
};
