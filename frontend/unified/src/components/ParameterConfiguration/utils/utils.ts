import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import { Beamline, ResourceParameters } from "../../../types";

const DLS_FILESYSTEM_BEAMLINE_RAW_DATA_DIR_MAPPINGS = {
  [Beamline.DIAD]: "nexus",
  [Beamline["I08-1"]]: "nexus",
  [Beamline.I12]: "rawdata",
  [Beamline["I13-1"]]: "raw",
  [Beamline["I13"]]: "raw",
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

export function getDefaultResourceParameters(
  obj: Record<string, Record<string, unknown>>
): ResourceParameters {
  const result: ResourceParameters = {};
  Object.keys(obj).map((key: string) => {
    if (key === "memory" || key === "nprocs") {
      result[key] = obj[key].default as string;
      return;
    } else if (key === "usegpu") {
      result[key] = obj[key].default as boolean;
      return;
    } else return;
  });
  return result;
}
