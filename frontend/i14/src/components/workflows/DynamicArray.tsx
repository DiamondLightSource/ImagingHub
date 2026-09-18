import { CirclePlus, Info, Trash } from "lucide-react";

import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import type { ReactNode } from "react";

type IdentifiableItem = {
  id: number;
};

interface DynamicArrayProps<Item extends IdentifiableItem> {
  title: string;
  desc?: string;
  items?: Item[];
  onChange: (items: Item[]) => void;
  createItem: (id: number) => Item;
  renderItem: (item: Item, onUpdate: (updatedItem: Item) => void) => ReactNode;
}

export default function DynamicArray<Item extends IdentifiableItem>({
  title,
  desc,
  items = [],
  onChange,
  createItem,
  renderItem,
}: DynamicArrayProps<Item>) {
  const handleAdd = () => {
    const highestId = Math.max(0, ...items.map((item) => item.id));
    const newItem = createItem(highestId + 1);

    onChange([...items, newItem]);
  };

  const handleRemove = (id: number) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdate = (updatedItem: Item) => {
    onChange(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <Stack direction="column" spacing={0}>
      <Stack direction="row" alignItems="center">
        <FormLabel>{title}</FormLabel>

        {desc && (
          <Tooltip title={desc}>
            <IconButton size="small" aria-label="Information">
              <Info />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack direction="column" spacing={2}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <Stack
              key={item.id}
              direction="row"
              spacing={1}
              alignItems="center"
            >
              {renderItem(item, handleUpdate)}

              {items.length > 1 && (
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    aria-label="Delete"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash />
                  </IconButton>
                </Tooltip>
              )}

              {isLastItem && (
                <Tooltip title="Add">
                  <IconButton size="small" aria-label="Add" onClick={handleAdd}>
                    <CirclePlus />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          );
        })}

        {items.length === 0 && (
          <IconButton size="small" aria-label="Add" onClick={handleAdd}>
            <CirclePlus />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );
}
