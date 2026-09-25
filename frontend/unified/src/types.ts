export enum Technique {
  Dpc = "Dpc",
  Nbed = "Nbed",
  Mib = "Mib",
  Ptycho = "Ptycho",
  Ptyrex = "Ptyrex",
  Tomo = "Tomo",
  Xanes = "Xanes",
  Xrd = "Xrd",
}

/**
 * String representations of a beamline is how the beamline is represented in the DLS
 * filesystem
 */
export enum Beamline {
  DIAD = "k11",
  "I08-1" = "i08-1",
  I12 = "i12",
  "I13-1" = "i13-1",
  "I13-2" = "i13-2",
  I14 = "i14",
  Epsic = "e01",
  E01 = "e01",
  E02 = "e02",
}

export type Option = { label: string; value: string; desc?: string };

export type TemplateComponentProps = {
  setParameters: (_: object) => void;
  visitDirpath: string;
};
