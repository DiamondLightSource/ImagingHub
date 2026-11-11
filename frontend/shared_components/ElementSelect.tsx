import Stack from "@mui/material/Stack";

import OptionPanel from "./OptionPanel";
import { elementOptions, transitionOptions } from "./data/xanes";
import FieldLabel from "./FieldLabel";

import { iconSize } from "./data/ui";

import type { ElementPair } from "./types";

type ElementSelectProps = {
  title?: string;
  info?: string;
  value: ElementPair;
  onChange: (value: ElementPair) => void;
};

const ElementSelect = ({
  title,
  info,
  value,
  onChange,
}: ElementSelectProps) => {
  return (
    <Stack spacing={0} sx={{ mt: "0px !important" }}>
      {title && <FieldLabel title={title} info={info} />}
      <Stack direction="row" spacing={1} alignItems="center">
        <OptionPanel
          useGrid
          value={value.element}
          options={elementOptions}
          onChange={(element) => onChange({ ...value, element })}
        />
        <p>-</p>
        <OptionPanel
          value={value.transition}
          options={transitionOptions}
          onChange={(transition) => onChange({ ...value, transition })}
        />
      </Stack>
    </Stack>
  );
};

export default ElementSelect;
