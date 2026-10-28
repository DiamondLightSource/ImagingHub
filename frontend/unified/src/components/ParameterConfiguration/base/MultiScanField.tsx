import { useEffect, useState } from "react";

import DynamicArray from "./../../../../../shared_components/DynamicArray";
import MultiScan from "./../../../../../shared_components/MultiScan";
import { validateScanRange } from "./../../../../../shared_components/utils";

import type { MultiScanArray } from "./../../../../../shared_components/types";
import type { TemplateComponentProps } from "./../../../types";

const MultiScanField = ({ setParameters }: TemplateComponentProps) => {
  const [scans, setScans] = useState<MultiScanArray[]>([
    { id: 1, start: "", end: "", excluded: "" },
  ]);

  useEffect(() => {
    setParameters((prev) => ({
      ...prev,
      multiScan: scans.map(({ id, ...range }) => ({
        multiScan: validateScanRange(range).parsed,
      })),
    }));
  }, [scans]);

  return (
    <DynamicArray<MultiScanArray>
      title="Scan Range"
      items={scans}
      onChange={setScans}
      createItem={(id) => ({
        id,
        start: "",
        end: "",
        excluded: "",
      })}
      renderItem={(item, onUpdate) => (
        <MultiScan
          value={item}
          onChange={(newValue) => {
            onUpdate({
              ...item,
              ...newValue,
            });
          }}
        />
      )}
    />
  );
};

export default MultiScanField;
