import { InstrumentSessionQuery } from "./graphql/__generated__/InstrumentSessionQuery.generated";
import { ScanNodeRaw, ScanNodeProcessed, DataCardVariant } from "./types";

const FORMATTER: { [key: string]: (v: any) => string | null } = {
  DATETIME: (v) =>
    v ? new Date(v).toLocaleString(undefined, { timeZone: "UTC" }) : null,
  NONE: (v) => (v ? `${v}` : null),
};

const GETTER: { [key: string]: (v: any) => any | null } = {
  DATE: (v) => {
    return v ? new Date(v) : null;
  },
};

export type BeamlineField<T> = {
  title: string;
  getter: (data: ScanNodeProcessed) => T | undefined | null;
  formatter: (v: T) => string | null;
};

type MetadataPair = {
  title: string;
  variant: DataCardVariant;
  label1?: string;
  label2?: string;
  value1: string;
  value2: string;
  size?: number;
};
export function isMetadataPair(v: MetadataPair | string): v is MetadataPair {
  return (v as MetadataPair).title != undefined;
}

export type SchemaConfig = {
  ulimsSchema: string;
  version: string;

  // Used to transform the scan_request JSON string into a
  // Javascript object
  scanRequest: (v: ScanNodeRaw) => string | undefined | null;

  // Used to filter scans by date
  startTimePath: string;

  // Fields define what pieces of metadata can be retrieved
  // from the data returned by the graph
  fields: { [key: string]: BeamlineField<any> };

  // The UI section tells the relevant component which field
  // to use. The strings *must* match the keys of the fields above
  ui: {
    scanSelector: {
      title: string;
      item1: string;
      item2?: string;
      item3?: string;
    };
    fullMetadata: (string | MetadataPair)[];
  };
};

export function getBeamlineConfig(
  schema: string | null | undefined
): SchemaConfig | null {
  if (schema) {
    const baseName = schema.split("/").slice(0, -1).join("/");
    const versionNumber = schema.split("/").at(-1);

    for (const conf of BEAMLINE_CONFIG) {
      // TODO: Perform better version number matching
      if (
        baseName === conf.ulimsSchema &&
        versionNumber === `${conf.version}.json`
      ) {
        return conf;
      }
    }
  }
  return null;
}

export function getProcessedData(
  data: InstrumentSessionQuery | null | undefined
): ScanNodeProcessed[] {
  if (!data) {
    return [];
  }

  const config = getBeamlineConfig(
    data?.instrumentSessionByReference?.datasets?.edges?.[0]?.node?.dataSchema
  );
  if (!config) {
    return [];
  }

  const nodes = data.instrumentSessionByReference
    ? (data.instrumentSessionByReference?.datasets.edges.map(
        (x) => x.node
      ) as ScanNodeRaw[])
    : [];

  const parseScanRequest = (
    v: string | null | undefined
  ): { [key: object]: any } | null => {
    return v ? JSON.parse(v) : null;
  };

  const intermediateNodes = nodes.map((x) => {
    return {
      ...x,
      scanRequest: parseScanRequest(config.scanRequest(x)),
      beamline: data.instrumentSessionByReference?.instrument?.key ?? null,
    };
  });

  const processedScanNodes: ScanNodeProcessed[] = intermediateNodes.map((x) => {
    return {
      ...x,
      scanNumber: getFieldValue(config, x, "scanNumber"),
      startTime: getFieldValue(config, x, "startTime"),
      endTime: getFieldValue(config, x, "endTime"),
    };
  });

  return processedScanNodes;
}

function getScanNumber(
  data: ScanNodeProcessed,
  nexusScanNumber?: string | null
): number {
  if (nexusScanNumber) {
    return Number(nexusScanNumber);
  }
  // Regex to match scan number in Nexus file name
  const regex = new RegExp("\\d{5,}");
  return Number(regex.exec(data.title)?.[0]);
}

export function getFieldValue(
  config: SchemaConfig,
  data: ScanNodeProcessed,
  field: string
) {
  const fieldConfig = config.fields[field];
  return fieldConfig.getter(data);
}
export function getFieldString(
  config: SchemaConfig | null,
  data: ScanNodeProcessed,
  field: string | null | undefined
): string | null {
  if (!config || !field) {
    return null;
  }
  const fieldConfig = config.fields[field];
  const value = fieldConfig.getter(data);
  return value ? fieldConfig.formatter(value) : null;
}

const BEAMLINE_CONFIG: SchemaConfig[] = [
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i14/dummy_scan",
    version: "0.0.1",
    startTimePath: "$.scan_parameters.start_time",
    scanRequest: (_) => null,
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_parameters?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_parameters?.end_time),
        formatter: FORMATTER.DATETIME,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
      },
      fullMetadata: [
        {
          title: "Scan times",
          variant: "STACKED",
          value1: "startTime",
          label1: "Start",
          value2: "endTime",
          label2: "End",
        },
      ],
    },
  },
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i14/mapping_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_parameters?.scan_request,
    startTimePath: "$.scan_parameters.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_parameters?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_parameters?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_parameters?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_information?.name,
        formatter: FORMATTER.NONE,
      },
      experimentType: {
        title: "Experiment type",
        getter: (v) => {
          const req = v?.scanRequest?.processingRequest?.request;
          if (req) {
            return Object.keys(req);
          }
          return null;
        },
        formatter: (v) => v.join(", "),
      },
      sampleRotation: {
        title: "Sample rotation",
        getter: (v) => v.data?.scan_parameters?.rotation,
        formatter: (v) => `${v.toFixed(2)} deg`,
      },
      photonEnergy: {
        title: "Photon energy",
        getter: (v) => v.data?.scan_parameters?.photon_energy,
        formatter: (v) => `${v.toFixed(2)} keV`,
      },
      exposureTime: {
        title: "Exposure time",
        getter: (v) =>
          v?.scanRequest?.detectors?.["BL14I-ML-SCAN-01"]?.exposureTime,
        formatter: (v) => `${v} s`,
      },
      scanRoi: {
        title: "Scan ROI",
        getter: (v) =>
          v?.scanRequest?.compoundModel?.regions?.[0]?.roi?.lengths,
        formatter: (v) =>
          v.map((x: number) => `${(x * 1e3).toFixed(2)} μm`).join(" x "),
      },
      xAxisStep: {
        title: "X Axis Step",
        getter: (v) => v?.scanRequest?.compoundModel?.models?.[0]?.xAxisStep,
        formatter: (v) => `${v * 1e6} nm`,
      },
      yAxisStep: {
        title: "Y Axis Step",
        getter: (v) => v?.scanRequest?.compoundModel?.models?.[0]?.yAxisStep,
        formatter: (v) => `${v * 1e6} nm`,
      },
      slitSizeX: {
        title: "Slit Size X",
        getter: (v) => v.data?.optical_parameters?.slit_size_x,
        formatter: FORMATTER.NONE,
      },
      slitSizeY: {
        title: "Slit Size Y",
        getter: (v) => v.data?.optical_parameters?.slit_size_y,
        formatter: FORMATTER.NONE,
      },
      elementList: {
        title: "Element list",
        getter: (v) =>
          v?.scanRequest?.processingRequest?.request?.["i14-xrf"]?.[0]
            ?.element_list,
        formatter: FORMATTER.NONE,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "experimentType",
        item3: "sampleName",
      },
      fullMetadata: [
        {
          title: "Scan times",
          variant: "STACKED",
          value1: "startTime",
          label1: "Start",
          value2: "endTime",
          label2: "End",
        },
        "sampleName",
        "experimentType",
        {
          title: "Scan step",
          variant: "PAIRED",
          value1: "xAxisStep",
          label1: "X",
          value2: "yAxisStep",
          label2: "Y",
        },
        {
          title: "Slit size",
          variant: "PAIRED",
          value1: "slitSizeX",
          label1: "X",
          value2: "slitSizeY",
          label2: "Y",
        },

        "sampleRotation",
        "photonEnergy",
        "exposureTime",
        "scanRoi",
        "elementList",
      ],
    },
  },
];
