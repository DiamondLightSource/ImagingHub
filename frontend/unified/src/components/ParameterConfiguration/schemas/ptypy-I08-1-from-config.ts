export type PtypyI08FromConfigFormData = {
  id: number;
  outpath: string;
  nprocs: number;
  memory: string;
  usegpu: boolean;
  numiter: number;
  probemodes: number;
  defocus: number;
  binning: number;
};

export const ptypyI08FromConfigSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
    outpath: { type: "string", default: "processing/workflows/ptypy" },
    nprocs: { type: "integer", default: 1, exclusiveMinimum: 0 },
    memory: { type: "string", default: "100Gi", pattern: "^[0-9]+[GMK]i$" },
    usegpu: { type: "boolean", default: true },
    numiter: { type: "integer", default: 100 },
    defocus: { type: "integer", default: 50 },
    binning: { type: "integer", default: 2 },
  },
  required: ["id"],
};
