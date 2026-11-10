import { type FC } from "react";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

import type { GridOption } from "./types";

type OptionButtonProps = {
  option: GridOption;
  selected: boolean;
  highlighted?: string;
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
  highlighted,
  useGrid = false,
  onSelect,
}) => {
  const gridStyles: SxProps<Theme> = useGrid
    ? { ...buttonSx, gridRow: option.row, gridColumn: option.column }
    : { ...buttonSx };

  const highlightStyles: SxProps<Theme> =
    highlighted === option.value
      ? {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 1,
        }
      : {};

  return (
    <Button
      variant={selected ? "contained" : "outlined"}
      sx={[gridStyles, highlightStyles]}
      color={selected ? "primary" : "inherit"}
      onClick={() => onSelect(option.value)}
    >
      {option.label}
    </Button>
  );
};
