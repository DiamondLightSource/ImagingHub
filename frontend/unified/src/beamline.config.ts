import type { InstrumentSessionQuery } from "./graphql/__generated__/InstrumentSessionQuery.generated";
import type { ScanNodeProcessed, ScanNodeRaw } from "./types";

const FORMATTER: { [key: string]: (v: any) => string } = {
  DATETIME: (v) => new Date(v).toLocaleString(undefined, { timeZone: "UTC" }),
  NONE: (v) => `${v}`,
};

export type MetadataContainer = {
  groupTitle: string;
  children: MetadataComponent<any>[];
};

export type MetadataComponent<T> = {
  getter: (data: ScanNodeRaw) => T | undefined | null;
  group?: string;
  title?: string;
  formatter: (v: T) => string;
};

type BeamlineConfig2 = {
  ulims_schema: string;
  version: string;
  startTime: (data: ScanNodeRaw) => string | undefined | null;
  endTime: (data: ScanNodeRaw) => string | undefined | null;
  scanNumber: (data: ScanNodeRaw) => number | undefined | null;
  components: Array<MetadataComponent<any> | MetadataContainer>;
};

export function isMetadataComponent<T>(
  v: MetadataComponent<T> | MetadataContainer
): v is MetadataComponent<T> {
  return (v as MetadataComponent<T>).getter !== undefined;
}

export function convertScanRequestToObject(data: ScanNodeRaw): ScanNodeRaw {
  if (data?.data?.scan_parameters?.scan_request) {
    console.log(data.data.scan_parameters.scan_request);
    var scanParameters = {
      ...data.data.scan_parameters,
      scan_request: JSON.parse(data.data.scan_parameters.scan_request),
    };
    var newData = { ...data.data, scan_parameters: scanParameters };
    var newScanData = { ...data, data: newData };

    return newScanData;
  }
  return data;
}

const fmtDate: (x: string | null | undefined) => Date | null = (x) => {
  return x ? new Date(x) : null;
};

export function getProcessedScanNode(
  data: InstrumentSessionQuery
): ScanNodeProcessed[] {
  const nodes: ScanNodeRaw[] = data.instrumentSessionByReference
    ? data.instrumentSessionByReference?.datasets.edges.map((x) => x.node)
    : [];

  const schema = getBeamlineConfig(nodes?.[0]?.dataSchema);
  if (!schema) {
    return [];
  }

  // Regex to match scan number in Nexus file name
  const regex = new RegExp("\\d{5,}");

  const parsedNodes = nodes.map((x) => convertScanRequestToObject(x));

  const processedScanNodes: ScanNodeProcessed[] = parsedNodes.map((x) => {
    return {
      ...x,
      scanNumber:
        schema.scanNumber(x) ?? Number(regex.exec(x.title)?.[0]) ?? null,
      beamline: data?.instrumentSessionByReference?.instrument?.key ?? null,
      startTime: fmtDate(schema.startTime(x)),
      endTime: fmtDate(schema.endTime(x)),
    };
  });

  return processedScanNodes;
}

export function getBeamlineConfig(
  schema: string | null
): BeamlineConfig2 | null {
  if (schema) {
    const baseName = schema.split("/").slice(0, -1).join("/");
    console.log("baseName", baseName);
    const versionNumber = schema.split("/").at(-1);

    for (const conf of BEAMLINE_CONFIG) {
      console.log(
        "baseName === conf.ulims_schema",
        baseName,
        conf.ulims_schema
      );
      console.log(
        "`${versionNumber}.json` === conf.version",
        `${versionNumber}.json`,
        conf.version
      );

      // TODO: Perform better version number matching
      if (
        baseName === conf.ulims_schema &&
        versionNumber === `${conf.version}.json`
      ) {
        return conf;
      }
    }
  }

  return null;
}

const BEAMLINE_CONFIG: BeamlineConfig2[] = [
  {
    ulims_schema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i14/dummy_scan",
    version: "0.0.1",
    startTime: (v) => v.data?.scan_parameters?.start_time,
    endTime: (v) => v.data?.scan_parameters?.end_time,
    scanNumber: (v) => null,
    components: [
      {
        groupTitle: "Times",
        children: [
          {
            title: "Start time",
            getter: (v) => v.data?.scan_parameters?.start_time,
            formatter: FORMATTER.DATETIME,
          },
          {
            title: "End time",
            getter: (v) => v.data?.scan_parameters?.end_time,
            formatter: FORMATTER.DATETIME,
          },
        ],
      },
    ],
  },
  {
    ulims_schema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i14/mapping_scan",
    version: "1.0.0",
    startTime: (v) => v.data?.scan_parameters?.start_time,
    endTime: (v) => v.data?.scan_parameters?.end_time,
    scanNumber: (v) => v.data?.scan_parameters?.scan_number,
    components: [
      {
        title: "Sample name",
        getter: (v) => v.data?.sample_information?.name,
        formatter: FORMATTER.NONE,
      },
      {
        groupTitle: "Times",
        children: [
          {
            title: "Start time",
            getter: (v) => v.data?.scan_parameters?.start_time,
            formatter: FORMATTER.DATETIME,
          },
          {
            title: "End time",
            getter: (v) => v.data?.scan_parameters?.end_time,
            formatter: FORMATTER.DATETIME,
          },
        ],
      },
      {
        groupTitle: "Scan info",
        children: [
          {
            title: "Sample rotation",
            getter: (v) => v.data?.scan_parameters?.rotation,
            formatter: (v) => `${v.toFixed(2)} deg`,
          },
          {
            title: "Photon energy",
            getter: (v) => v.data?.scan_parameters?.photon_energy,
            formatter: (v) => `${v.toFixed(2)} keV`,
          },
          {
            title: "Exposure time",
            getter: (v) =>
              v.data?.scan_parameters?.scan_request?.detectors?.[
                "BL14I-ML-SCAN-01"
              ]?.exposureTime,
            formatter: (v) => `${v} s`,
          },
        ],
      },
      {
        groupTitle: "Scan region",
        children: [
          {
            title: "Scan ROI",
            getter: (v) =>
              v.data?.scan_parameters?.scan_request?.compoundModel?.regions?.[0]
                ?.roi?.lengths,
            formatter: (v) =>
              v.map((x) => `${(x * 1e3).toFixed(2)} μm`).join(" x "),
          },
          {
            title: "X Axis Step",
            getter: (v) =>
              v.data?.scan_parameters?.scan_request?.compoundModel?.models?.[0]
                ?.xAxisStep,
            formatter: (v) => `${v * 1e6} nm`,
          },
          {
            title: "Y Axis Step",
            getter: (v) =>
              v.data?.scan_parameters?.scan_request?.compoundModel?.models?.[0]
                ?.yAxisStep,
            formatter: (v) => `${v * 1e6} nm`,
          },
        ],
      },
      {
        groupTitle: "Slits",
        children: [
          {
            title: "Slit Size X",
            getter: (v) => v.data?.optical_parameters?.slit_size_x,
            formatter: (v) => FORMATTER.NONE,
          },
          {
            title: "Slit Size Y",
            getter: (v) => v.data?.optical_parameters?.slit_size_y,
            formatter: (v) => FORMATTER.NONE,
          },
        ],
      },
      {
        title: "Element list",
        getter: (v) =>
          v.data?.scan_parameters?.scan_request?.processingRequest?.request?.[
            "i14-xrf"
          ]?.[0]?.element_list,
        formatter: FORMATTER.NONE,
      },
    ],
  },
];
