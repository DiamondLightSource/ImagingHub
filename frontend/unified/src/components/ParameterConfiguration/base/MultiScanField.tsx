import { useEffect, useState } from "react";

import DynamicArray from "./../../../../../shared_components/DynamicArray";
import MultiScan from "./../../../../../shared_components/MultiScan";

import type { MultiScanArray } from "./../../../../../shared_components/types";
import type { TemplateComponentProps } from "../../types";

const MultiScanField = ({ setParameters }: TemplateComponentProps) => {
  const [scans, setScans] = useState<MultiScanArray[]>([
    { id: "1", start: 0, end: 0, excluded: "" },
  ]);

  useEffect(() => {
    setParameters({
      multiScan: scans.map((data) => ({
        multiScan: data,
      })),
    });
  }, [scans, setParameters]);

  return (
    <DynamicArray<MultiScanArray>
      title="Scan Range"
      items={scans}
      onChange={setScans}
      createItem={(id) => ({
        id,
        start: 0,
        end: 0,
        excluded: "",
      })}
      renderItem={(item, onUpdate) => (
        <MultiScan
          value={{
            start: item.start,
            end: item.end,
            excluded: item.excluded,
          }}
          onChange={({ start, end, excluded }) => {
            onUpdate({ ...item, start, end, excluded });
          }}
        />
      )}
    />
  );
};

export default MultiScanField;
