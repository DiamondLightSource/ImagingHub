import OptionSelect from "./OptionSelect";
import OptionPanel from "./OptionPanel";
import { elementOptions, transitionOptions } from "../../data/elements";

interface ElementSelectValue {
  edge: string;
  transition: string;
}

interface ElementSelectProps {
  value: ElementSelectValue;
  onChange: (value: ElementSelectValue) => void;
}

export default function TwoElementSelect({
  value,
  onChange,
}: ElementSelectProps) {
  return (
    <>
      <OptionPanel
        useGrid={true}
        value={value.edge}
        options={elementOptions}
        onChange={(symbol) => onChange({ ...value, edge: symbol })}
      />
      <p>-</p>
      <OptionPanel
        value={value.transition}
        options={transitionOptions}
        onChange={(symbol) => onChange({ ...value, transition: symbol })}
      />
    </>
  );
}
