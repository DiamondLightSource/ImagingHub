import { templateOptions } from "../../../data/templates";
import { Beamline, Technique } from "../../../types";

export const filterTemplates = (technique: Technique) => {
  return templateOptions.filter((option) =>
    option.value.includes(technique.toLowerCase())
  );
};

const DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS = {
  [Beamline.DIAD]: "nexus",
  [Beamline["I08-1"]]: "nexus",
  [Beamline.I12]: "rawdata",
  [Beamline["I13-1"]]: "raw",
  [Beamline["I13-2"]]: "raw",
  [Beamline.I14]: "scan",
};
