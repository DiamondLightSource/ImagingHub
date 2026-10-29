import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import { Beamline } from "../../../types";

const DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS = {
  [Beamline.DIAD]: "nexus",
  [Beamline["I08-1"]]: "nexus",
  [Beamline.I12]: "rawdata",
  [Beamline["I13-1"]]: "raw",
  [Beamline["I13-2"]]: "raw",
  [Beamline.I14]: "scan",
};

export const determineBeamlineRawDataFilepath = (
  beamline: Beamline,
  visitDirpath: string,
  scanId: number
): string => {
  const rawDataDirname =
    DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS[
      beamline as keyof typeof DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS
    ];
  const scanFilename =
    beamline === Beamline.DIAD ? `k11-${scanId}` : `${scanId}`;
  return `${visitDirpath}${rawDataDirname}/${scanFilename}.nxs`;
};

export const determineBeamlineVisitDirpath = (
  beamline: Beamline,
  year: number,
  visit: Visit
) => {
  return `/dls/${beamline}/data/${year}/${visitToText(visit)}/`;
};
