const SessionSelectionMode = {
  Latest: "Latest",
  Custom: "Custom",
} as const;
type SessionSelectionMode =
  (typeof SessionSelectionMode)[keyof typeof SessionSelectionMode];
export { SessionSelectionMode };

const Technique = {
  Dpc: "Dpc",
  Nbed: "Nbed",
  Ptycho: "Ptycho",
  Tomo: "Tomo",
  Xanes: "Xanes",
  Xrd: "Xrd",
} as const;
type Technique = (typeof Technique)[keyof typeof Technique];
export { Technique };

const Beamline = {
  DIAD: "DIAD",
  "I08-1": "I08-1",
  I12: "I12",
  "I13-1": "I13-1",
  "I13-2": "I13-2",
  I14: "I14",
  Epsic: "Epsic",
} as const;
type Beamline = (typeof Beamline)[keyof typeof Beamline];
export { Beamline };

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
