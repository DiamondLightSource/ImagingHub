export enum Technique {
  Dpc = "Dpc",
  Nbed = "Nbed",
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
}
export const BEAMLINE_TECHNIQUES_SUBSET = {
  [Beamline.DIAD]: [Technique.Tomo],
  [Beamline.I12]: [Technique.Tomo],
  [Beamline["I08-1"]]: [Technique.Ptycho],
  [Beamline["I13-1"]]: [
    Technique.Dpc,
    Technique.Ptycho,
    Technique.Tomo,
    Technique.Xanes,
    Technique.Xrd,
  ],
  [Beamline["I13-2"]]: [Technique.Ptycho, Technique.Tomo],
  [Beamline.I14]: [Technique.Dpc, Technique.Xanes, Technique.Xrd],
  [Beamline.Epsic]: [Technique.Dpc, Technique.Nbed, Technique.Ptycho],
};

export const BEAMLINES_DEFAULT_TECHNIQUE = {
  [Beamline.DIAD]: Technique.Tomo,
  [Beamline.Epsic]: Technique.Ptycho,
  [Beamline.I12]: Technique.Tomo,
  [Beamline["I08-1"]]: Technique.Ptycho,
  [Beamline["I13-1"]]: Technique.Ptycho,
  [Beamline["I13-2"]]: Technique.Ptycho,
  [Beamline.I14]: Technique.Dpc,
};

export type Option = { label: string; value: string; desc?: string };

export type TemplateComponentProps = {
  setParameters: (_: object) => void;
  visitDirpath: string;
};

export type WorkflowStatus =
  | "Unknown"
  | "WorkflowPendingStatus"
  | "WorkflowRunningStatus"
  | "WorkflowSucceededStatus"
  | "WorkflowFailedStatus"
  | "WorkflowErroredStatus";
