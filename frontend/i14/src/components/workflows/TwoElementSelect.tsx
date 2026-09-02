import React from "react";
import type SelectChangeEvent from "@mui/material/Select/SelectInput";

import OptionSelect from "./OptionSelect";
import { edgeOptions, transitionOptions } from "../../data/elements";

interface Props {
  edge: string;
  transition: string;
  onChange: (edge: string, transition: string) => void;
}

export default function TwoElementSelect({
  edge,
  transition,
  onChange,
}: Props) {
  return (
    <>
      <OptionSelect
        label="Edge"
        value={edge}
        options={edgeOptions}
        onChange={(e: SelectChangeEvent<string>) => {
          onChange(e.target.value, transition);
        }}
      />
      <OptionSelect
        label="Transition"
        value={transition}
        options={transitionOptions}
        onChange={(e: SelectChangeEvent<string>) => {
          onChange(edge, e.target.value);
        }}
      />
    </>
  );
}
