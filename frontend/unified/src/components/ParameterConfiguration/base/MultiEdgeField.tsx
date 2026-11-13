import { useState } from "react";

import DynamicArray from "./../../../../../shared_components/DynamicArray";
import ElementSelect from "./../../../../../shared_components/ElementSelect";

import type { ElementPairArray } from "./../../../../../shared_components/types";
import type { TemplateComponentProps } from "./../../../types";

const MultiEdgeField = ({ setParameters }: TemplateComponentProps) => {
  const [elements, setElements] = useState<ElementPairArray>([
    { id: 1, element: "", transition: "" },
  ]);

  const handleChange = (newItem: ElementPairArray) => {
    setElements(newItem);
    setParameters((prev) => ({
      ...prev,
      multiEdge: newItem.map(({ element, transition }) => ({
        edgeElement: element,
        edgeTransition: transition,
      })),
    }));
  };

  return (
    <DynamicArray<ElementPairArray>
      title="Edge Element"
      desc="Line group to be aligned"
      items={elements}
      onChange={handleChange}
      createItem={(id) => ({
        id,
        element: "",
        transition: "",
      })}
      renderItem={(item, onUpdate) => (
        <ElementSelect
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

export default MultiEdgeField;
