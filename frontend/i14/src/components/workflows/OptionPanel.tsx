import { useState, type FC } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

import { buttonSx, OptionButton } from "./OptionButton";
import type { GridOption } from "../types/workflowFields";

type Props = {
  value: string;
  options: GridOption[];
  onChange: (value: string) => void;
  useGrid?: boolean;
};

const OptionPanel: FC<Props> = ({
  value,
  options,
  onChange,
  useGrid = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  const isOpen = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        sx={{ ...buttonSx }}
        onClick={handleOpen}
      >
        {selected?.label ?? "-"}
      </Button>

      <Popover open={isOpen} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{ p: 0.5 }}>
          <Box
            sx={
              useGrid
                ? {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, 38px)",
                    gap: 0.5,
                  }
                : {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                  }
            }
          >
            {options.map((opt) => (
              <OptionButton
                key={opt.value}
                option={opt}
                selected={opt.value === value}
                useGrid={useGrid}
                onSelect={handleSelect}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default OptionPanel;
