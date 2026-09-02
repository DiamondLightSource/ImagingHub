import React from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import TwoElementSelect from "./TwoElementSelect";
import { ElementPair } from "../../types/workflowFields";

interface Props {
  title: string;
  desc?: string;
  items?: ElementPair[];
  onChange: (items: ElementPair[]) => void;
}

export default function ElementArray({
  title,
  desc,
  items = [],
  onChange,
}: Props) {
  const handleAdd = () => {
    const highestId = Math.max(0, ...items.map((i) => i.id));
    onChange([...items, { id: highestId + 1, edge: "", transition: "" }]);
  };

  const handleRemove = (id: number) => {
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <Stack direction="column" spacing={0}>
      <Stack direction="row" alignItems="center">
        <FormLabel>{title}</FormLabel>
        {desc && (
          <Tooltip title={desc}>
            <IconButton size="small" aria-label="info">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack direction="column" spacing={2}>
        {items.map((item) => (
          <Stack direction="row" spacing={1} key={item.id} alignItems="center">
            <TwoElementSelect
              edge={item.edge}
              transition={item.transition}
              onChange={(edge, transition) =>
                onChange(
                  items.map((it) =>
                    it.id === item.id ? { ...it, edge, transition } : it
                  )
                )
              }
            />

            {items.length > 1 && (
              <Tooltip title="Delete">
                <IconButton onClick={() => handleRemove(item.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {item.id === items[items.length - 1]?.id && (
              <Tooltip title="Add">
                <IconButton onClick={handleAdd} size="small">
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
