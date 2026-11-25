import { InstrumentSessionQuery } from "./graphql/__generated__/InstrumentSessionQuery.generated";
import { ScanNodeRaw, ScanNodeProcessed, DataCardVariant } from "./types";

/**
 * General logic behind `beamline.config.ts`
 *  - This is needed as each beamline provides and displays different bits of data
 *  - We need to tell our application:
 *    1. How to retrieve each bit of data from the graph
 *    2. How to format each bit of data from the graph
 *    3. Where to display each bit of data in our UI
 *
 * Data flow:
 *  1. Get `InstrumentSessionQuery` result from Apollo
 *  2. Transform into an array of `ScanNodeProcessed` objects by `getProcessedData()`.
 *     One element in the array corresponds to one scan.
 *      - `InstrumentSessionQuery.datasets.edges.node` contains data for each scan
 *        - `getProcessedData()` takes this data out and adds some extra fields
 *      - `InstrumentSessionQuery.datasets.edges.node.data` contains the metadata acquired by the Ingest Service
 *        - The structure of this is given by the ULIMS JSON schema
 *
 *      - Why is the transformation necessary?
 *        1. Many beamlines have a `scanRequest` field, which is a large JSON string.
 *           This string needs to be converted to an object so we can retrieve values
 *           from it.
 *        2. Scan start, scan end, and scan number fields are used by the UI beyond
 *           just showing metadata. The `ScanNodeProcessed` object makes these values
 *           easily accessible.
 *  3. The UI determines what bits of data (i.e. fields) to display where using the
 *     corresponding entry in the BEAMLINE_CONFIG array (e.g. see `MetadataDisplay.tsx` for an example).
 *      - Scan selector:
 *        - Has pre-defined slots for data to go
 *        - The config defines what field should go in which slot
 *      - Full metadata display:
 *        - Config defines the order of fields displayed, and whether they should be displayed in a pair
 *  4. Values for a particular scan are retrieved using the `getFieldValue()` and `getFieldString()` functions
 *     (e.g. see `MetadataDisplay.tsx` for an example).
 */

/**
 * Type to describe how to display a pair of values in the UI
 */
type MetadataPair = {
  // Main title of DataCard
  title: string;

  // Variant of DataCard to use
  // (see sci-react-ui docs for what each variant looks like)
  variant: DataCardVariant;

  // Optional override for value labels
  // If not given, the label will be the field's title
  label1?: string;
  label2?: string;

  // Fields to display
  value1: string;
  value2: string;
};

/**
 * Type guard to check if a {MetadataPair | string} object is a MetadataPair
 *
 * @export
 * @param {(MetadataPair | string)} v - {MetadataPair | string} value
 * @returns {v is MetadataPair} true if MetadataPair, false otherwise
 */
export function isMetadataPair(v: MetadataPair | string): v is MetadataPair {
  return (v as MetadataPair).title != undefined;
}

/**
 * Object containing commonly used getter functions
 * These take some `ScanNodeProcessed` value, `v`, and output a useful Javascript object
 * e.g. take a date in string format and return a Date object that we can do further computation on
 *
 * These functions should return `null` if the value does not exist
 *
 * @type {({ [key: string]: (v: any) => any | null })}
 */
const GETTER: { [key: string]: (v: any) => any | null } = {
  DATE: (v) => {
    return v ? new Date(v) : null;
  },
};

/**
 * Object containing commonly used formatter functions
 * These take some value, `v` (whose type is determined by the return type of the corresponding
 * getter function), and output a string for display in a UI
 *
 * If the input value is null, then the output value should also be null
 *
 * @type {({ [key: string]: (v: any) => string | null })}
 */
const FORMATTER: { [key: string]: (v: any) => string | null } = {
  DATETIME: (v) =>
    v ? new Date(v).toLocaleString(undefined, { timeZone: "UTC" }) : null,
  NONE: (v) => (v ? `${v}` : null),
};

/**
 * Defines the title, and functions to get and format data
 * from a field
 */
export type BeamlineField<T> = {
  // Name of field
  title: string;

  // Function that describes how to fetch a value
  // The getter should return null if the value does not exist
  getter: (data: ScanNodeProcessed) => T | undefined | null;

  // Function that describes how to turn the value into a UI-friendly string
  // If the input value `v` is null, then the output value must also be null
  formatter: (v: T | undefined | null) => string | null;
};

/**
 * Describes the config for a single ULIMS JSON schema
 * Tells the UI how to retrieve and format various values
 */
export type SchemaConfig = {
  ulimsSchema: string;
  version: string;

  // Function to fetch the scanRequest JSON string
  scanRequest: (v: ScanNodeRaw) => string | undefined | null;

  // The JSON path to the start time of the scan
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

/**
 * Fetches the schema configuration corresponding to the given schema URL
 *
 * @export
 * @param {(string | null | undefined)} schema - URL of schema (usually points to ULIMS JSON schema repo)
 * @returns {(SchemaConfig | null)} Corresponding SchemaConfig if found, null otherwise
 */
export function getSchemaConfig(
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

/**
 * Processes raw InstrumentSessionQuery data and returns parsed ScanNodeProcessed data.
 *
 * @export
 * @param {(InstrumentSessionQuery | null | undefined)} data - Raw InstrumentSessionQuery data from Apollo
 * @returns {ScanNodeProcessed[]} Array of parsed ScanNodeProcessed objects
 */
export function getProcessedData(
  data: InstrumentSessionQuery | null | undefined
): ScanNodeProcessed[] {
  if (!data) {
    return [];
  }

  // Fetch the corresponding schema
  const config = getSchemaConfig(
    data?.instrumentSessionByReference?.datasets?.edges?.[0]?.node?.dataSchema
  );
  if (!config) {
    return [];
  }

  // Fetch data nodes
  const nodes = data.instrumentSessionByReference
    ? (data.instrumentSessionByReference?.datasets.edges.map(
        (x) => x.node
      ) as ScanNodeRaw[])
    : [];

  // Function to turn scanRequest string into JSON object
  const parseScanRequest = (
    v: string | null | undefined
  ): { [key: object]: any } | null => {
    return v ? JSON.parse(v) : null;
  };

  // Add the parsed scanRequest and beamline
  const intermediateNodes = nodes.map((x) => {
    return {
      ...x,
      scanRequest: parseScanRequest(config.scanRequest(x)),
      beamline: data.instrumentSessionByReference?.instrument?.key ?? null,
    };
  });

  // Add the scanNumber, startTime, and endTime
  const processedScanNodes: ScanNodeProcessed[] = intermediateNodes.map((x) => {
    return {
      ...x,
      // We get type errors here as getFieldValue expects `x` to be a ScanNodeProcessed object
      // This is ok as:
      //  1. The bits missing from a ScanNodeProcessed object are the `scanNumber`, `startTime`,
      //     and `endTime` fields themselves
      //  2. The getters for `scanNumber`, `startTime`, and `endTime` should work if these
      //     fields are missing
      scanNumber: getFieldValue(config, x as ScanNodeProcessed, "scanNumber"),
      startTime: getFieldValue(config, x as ScanNodeProcessed, "startTime"),
      endTime: getFieldValue(config, x as ScanNodeProcessed, "endTime"),
    };
  });

  return processedScanNodes;
}

/**
 * Helper function to fetch the scan number. If `nexusScanNumber` is not provided, then
 * it will attempt to extract the scan number from the Nexus file name using a Regex
 *
 * @param {ScanNodeProcessed} data - A single ScanNodeProcessed object whose scan number we'd like to retrieve
 * @param {?(string | null)} [nexusScanNumber] - Scan number retrieved from within the Nexus file
 * @returns {number} The scan number
 */
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

/**
 * Helper function to fetch a field value
 *
 * @export
 * @param {SchemaConfig} config - Config corresponding the current session
 * @param {ScanNodeProcessed} data - Parsed ScanNodeProcessed object that we'd like to retrieve data from
 * @param {string} field - Name of the field to retrieve from data
 * @returns The value of the given field
 */
export function getFieldValue(
  config: SchemaConfig,
  data: ScanNodeProcessed,
  field: string
) {
  const fieldConfig = config.fields[field];
  return fieldConfig.getter(data);
}

/**
 * Helper function to fetch a field string. Will fetch the value, then run the
 * value through its formatter to get a UI-friendly string
 *
 * @export
 * @param {(SchemaConfig | null)} config - Config corresponding to the current session
 * @param {ScanNodeProcessed} data - Parsed ScanNodeProcessed object that we'd like to retrieve data from
 * @param {(string | null | undefined)} field - The value of the given field
 * @returns {(string | null)} - The formatted value of the given field
 */
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

/**
 * Contains configurations for all schema that ImagingHub supports.
 * It describes:
 *  1. What `fields` (i.e. the individual bits of data) are available
 *  2. How to fetch each field, and how to perform any additional computation
 *  3. How to format each field
 *  4. Where fields should be displayed in the scan selector and metadata display components
 *
 * Note that:
 *  1. Each beamline can have multiple schema
 *  2. Every field referenced under `BEAMLINE_CONFIG.ui` *must* be present under `BEAMLINECONFIG.fields`
 *     There is a test at `unified/tests/beamline.config.test.ts` that checks this
 *  3. If a new schema is created, or an existing one is modified, then a new entry should be made here
 *  4. If support for an old schema is dropped, it should be removed from this array
 */
export const BEAMLINE_CONFIG: SchemaConfig[] = [
  // i14
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
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i14/mapping_scan",
    version: "3.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
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
  // k11
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/k11/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
      synchrotronCurrent: {
        title: "Synchrotron current",
        getter: (v) => v.data?.sample_common?.synchrotron_current,
        formatter: (v) => `${v} mA`,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
        "synchrotronCurrent",
      ],
    },
  },
  // i08
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i08/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
      ],
    },
  },
  // i08-1
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i08-1/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
      synchrotronCurrent: {
        title: "Synchrotron current",
        getter: (v) => v.data?.sample_common?.synchrotron_current,
        formatter: (v) => `${v} mA`,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
        "synchrotronCurrent",
      ],
    },
  },
  // i13-1
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i13-1/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
      ],
    },
  },
  // i12
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i12/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
      synchrotronCurrent: {
        title: "Synchrotron current",
        getter: (v) => v.data?.sample_common?.synchrotron_current,
        formatter: (v) => `${v} mA`,
      },
      hutch: {
        title: "Experimental hutch",
        getter: (v) => {
          const tomographyShutter: string | undefined =
            v.data?.scan_parameters?.tomography_shutter;
          const tomoFlyerEh2: string | undefined =
            v.data?.scan_parameters?.tomoflyer_eh2;
          if (tomographyShutter?.toLowerCase() === "eh1shtr") {
            return "EH1";
          } else if (tomoFlyerEh2) {
            return "EH2";
          } else {
            return null;
          }
        },
        formatter: FORMATTER.NONE,
      },
      opticalModule: {
        title: "Optical module",
        getter: (v) => {
          const cam1_x: number | undefined = v.data?.scan_parameters?.cam1_x;
          if (cam1_x) {
            // Values from Alex Liptak
            if (cam1_x >= 35 && cam1_x <= 75) {
              return "M1";
            } else if (cam1_x >= 125 && cam1_x <= 165) {
              return "M2";
            } else if (cam1_x >= 205 && cam1_x <= 245) {
              return "M3";
            } else if (cam1_x >= 280 && cam1_x <= 320) {
              return "M4";
            }
          }
          return null;
        },
        formatter: FORMATTER.NONE,
      },
      pixelSize: {
        title: "Pixel size",
        getter: (v) => {
          const cam1_x: number | undefined = v.data?.scan_parameters?.cam1_x;
          if (cam1_x) {
            // Values from Alex Liptak
            if (cam1_x >= 35 && cam1_x <= 75) {
              return 18.53;
            } else if (cam1_x >= 125 && cam1_x <= 165) {
              return 7.91;
            } else if (cam1_x >= 205 && cam1_x <= 245) {
              return 3.24;
            } else if (cam1_x >= 280 && cam1_x <= 320) {
              return 1.3;
            }
          }
        },
        formatter: (v) => `${v} μm`,
      },
      monochromatorEnergy: {
        title: "Monochromator energy",
        getter: (v) => v.data?.scan_parameters?.energy_est,
        formatter: (v) => `${v} eV`,
      },
      ss1X: {
        title: "Sample stage 1 X",
        getter: (v) => v.data?.sample_parameters?.ss1_x,
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
      ss1Tx: {
        title: "Sample stage 1 TX",
        getter: (v) => v.data?.sample_parameters?.ss1_tx,
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
      ss1Tz: {
        title: "Sample stage 1 TZ",
        getter: (v) => v.data?.sample_parameters?.ss1_tz,
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
      samplePositionY: {
        title: "Sample position Y",
        getter: (v) => {
          const ss1Y1 = v.data?.sample_parameters?.ss1_y1;
          const ss1Y2 = v.data?.sample_parameters?.ss1_y2;
          const ss1Y3 = v.data?.sample_parameters?.ss1_y3;
          if (ss1Y1 && ss1Y2 && ss1Y3) {
            return ss1Y1 + ss1Y2 + ss1Y3;
          } else {
            return null;
          }
        },
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
      propagationDistance: {
        title: "Propagation distance",
        getter: (v) => v.data?.scan_parameters?.t3_m1z,
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
        "synchrotronCurrent",
        "monochromatorEnergy",
        "hutch",
        {
          title: "Optical module",
          variant: "STANDARD",
          value1: "opticalModule",
          value2: "pixelSize",
        },
        // TODO: Add sample position
        // Not currently added as unsure about
        // ss1X/ss1Tx/ss1Tz
        "propagationDistance",
      ],
    },
  },
  // i13-2
  {
    ulimsSchema:
      "https://raw.githubusercontent.com/DiamondLightSource/ulims-json-schemas/main/schemas/data_catalogue/i13-2/generic_scan",
    version: "1.0.0",
    scanRequest: (v) => v.data?.scan_common?.scan_request,
    startTimePath: "$.scan_common.start_time",
    fields: {
      scanNumber: {
        title: "Scan number",
        getter: (v) => getScanNumber(v, v.data?.scan_common?.scan_number),
        formatter: FORMATTER.NONE,
      },
      startTime: {
        title: "Start time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.start_time),
        formatter: FORMATTER.DATETIME,
      },
      endTime: {
        title: "End time",
        getter: (v) => GETTER.DATE(v.data?.scan_common?.end_time),
        formatter: FORMATTER.DATETIME,
      },
      sampleName: {
        title: "Sample name",
        getter: (v) => v.data?.sample_common?.name,
        formatter: FORMATTER.NONE,
      },
      synchrotronCurrent: {
        title: "Synchrotron current",
        getter: (v) => v.data?.sample_common?.synchrotron_current,
        formatter: (v) => `${v} mA`,
      },
      turretName: {
        title: "Turret name",
        getter: (v) => v.data?.scan_parameters?.turret_name,
        formatter: FORMATTER.NONE,
      },
      sampleStageHeight: {
        title: "Sample stage height",
        getter: (v) => v.data?.scan_parameters?.hex_y,
        formatter: FORMATTER.NONE, // TODO: Determine units
      },
      sampleDistance: {
        title: "Sample distance",
        getter: (v) => v.data?.scan_parameters?.cs1_z,
        formatter: (v) => `${v} mm`,
      },
    },
    ui: {
      scanSelector: {
        title: "scanNumber",
        item1: "startTime",
        item2: "sampleName",
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
        "synchrotronCurrent",
        "turretName",
        "sampleStageHeight",
        "sampleDistance",
      ],
    },
  },
];
