import { type FC } from "react";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

import type { GridOption } from "../types/workflowFields";

type OptionButtonProps = {
  option: GridOption;
  selected: boolean;
  useGrid?: boolean;
  onSelect: (value: string) => void;
};

export const buttonSx = {
  width: 38,
  height: 38,
  minWidth: 0,
};

export const OptionButton: FC<OptionButtonProps> = ({
  option,
  selected,
  useGrid = false,
  onSelect,
}) => {
  const gridStyles: SxProps<Theme> = useGrid
    ? { ...buttonSx, gridRow: option.row, gridColumn: option.column }
    : { ...buttonSx };

  return (
    <Button
      variant={selected ? "contained" : "outlined"}
      sx={gridStyles}
      color={selected ? "primary" : "inherit"}
      onClick={() => onSelect(option.value)}
    >
      {option.label}
    </Button>
  );
};
