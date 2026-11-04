import { useEffect, useCallback, useState, type FC } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

import { ChevronDown } from "lucide-react";

import { buttonSx, OptionButton } from "./OptionButton";
import type { GridOption } from "./types";

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
  const [highlightedValue, setHighlightedValue] = useState(null);
  const selected = options.find((o) => o.value === value);

  const isOpen = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHighlightedValue(null);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    handleClose();
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!/^[a-z]$/i.test(event.key)) return; // Check key pressed is one letter

      const letter = event.key.toLowerCase();
      const matches = options.filter((o) =>
        o.label?.toLowerCase().startsWith(letter)
      );
      if (!matches.length) return;

      event.preventDefault(); // Prevent browser reaction to key press
      const currentValue = highlightedValue ?? value;
      const currentIndex = matches.findIndex((o) => o.value === currentValue);
      // Increment the index and reset to 0 if it is the end of the array
      const next = matches[(currentIndex + 1) % matches.length];

      setHighlightedValue(next.value);
    },
    [options, value, highlightedValue]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    // Prevent listener from running in the background
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        sx={{ ...buttonSx }}
        onClick={handleOpen}
      >
        {selected?.label ?? ""}
        {!selected?.label && (
          <ChevronDown
            size={12}
            style={{
              position: "absolute",
              right: 6,
              top: 12,
              transform: "translateY(-50%)",
            }}
          />
        )}
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
                highlighted={highlightedValue}
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
