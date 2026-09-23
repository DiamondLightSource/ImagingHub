import { templateOptions } from "../../../data/templates";
import { Technique } from "../../../types";

export const filterTemplates = (technique: Technique) => {
  return templateOptions.filter((option) =>
    option.value.includes(technique.toLowerCase())
  );
};
