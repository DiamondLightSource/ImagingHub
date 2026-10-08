const Technique = {
  Dpc: "Dpc",
  Nbed: "Nbed",
  Mib: "Mib",
  Ptycho: "Ptycho",
  Ptyrex: "Ptyrex",
  Ptypy: "Ptypy",
  Tomo: "Tomo",
  Xanes: "Xanes",
  Xrd: "Xrd",
} as const;
type Technique = (typeof Technique)[keyof typeof Technique];
export { Technique };

/**
 * String representations of a beamline is how the beamline is represented in the DLS
 * filesystem
 */
const Beamline = {
  DIAD: "DIAD",
  "I08-1": "I08-1",
  I12: "I12",
  "I13-1": "I13-1",
  "I13-2": "I13-2",
  I14: "I14",
  E01: "e01",
  E02: "e02",
  P99: "p99",
} as const;
type Beamline = (typeof Beamline)[keyof typeof Beamline];
export { Beamline };

export const BEAMLINE_TECHNIQUES_SUBSET = {
  [Beamline.DIAD]: [Technique.Tomo],
  [Beamline.I12]: [Technique.Tomo],
  [Beamline["I08-1"]]: [Technique.Ptycho, Technique.Ptypy],
  [Beamline["I13-1"]]: [
    Technique.Dpc,
    Technique.Ptyrex,
    Technique.Tomo,
    Technique.Xanes,
    Technique.Xrd,
  ],
  [Beamline["I13-2"]]: [Technique.Ptycho, Technique.Tomo],
  [Beamline.I14]: [Technique.Dpc, Technique.Xanes, Technique.Xrd],
  [Beamline.E02]: [
    Technique.Dpc,
    Technique.Nbed,
    Technique.Ptyrex,
    Technique.Mib,
  ],
  [Beamline.E01]: [Technique.Dpc, Technique.Nbed, Technique.Ptyrex],
  [Beamline.P99]: [Technique.Ptypy],
};

export const BEAMLINES_DEFAULT_TECHNIQUE = {
  [Beamline.DIAD]: Technique.Tomo,
  [Beamline.E02]: Technique.Mib,
  [Beamline.E01]: Technique.Ptyrex,
  [Beamline.I12]: Technique.Tomo,
  [Beamline["I08-1"]]: Technique.Ptycho,
  [Beamline["I13-1"]]: Technique.Ptycho,
  [Beamline["I13-2"]]: Technique.Ptycho,
  [Beamline.I14]: Technique.Dpc,
  [Beamline.P99]: Technique.Ptypy,
};

export type Option = { label: string; value: string; desc?: string };

export type TemplateComponentProps = {
  setParameters: (_: object) => void;
  setResourceParameters: (_: object) => void;
  visitDirpath: string;
};
