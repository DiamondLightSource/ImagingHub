import { ProcessingViewQuery } from "./graphql/__generated__/ProcessingViewQuery.generated";
import { SessionQuery } from "./graphql/__generated__/SessionQuery.generated";

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
  DIAD: "k11",
  "I08-1": "i08-1",
  I12: "i12",
  "I13-1": "i13-1",
  "I13-2": "i13-2",
  I14: "i14",
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

export type TemplateComponentProps = {
  setParameters: (_: object) => void;
  setResourceParameters?: (_: object) => void;
  visitDirpath: string;
};

export type TaskStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCEEDED"
  | "SKIPPED"
  | "FAILED"
  | "ERROR"
  | "OMITTED";

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
};

export type Templates = ProcessingViewQuery["workflowTemplates"]["nodes"];

const AppState = {
  LOADING: "LOADING",
  LATEST_NOT_FOUND: "LATEST_NOT_FOUND",
  INVALID_SESSION: "INVALID_SESSION",
  FAILED_REGEX: "FAILED_REGEX",
  VALID: "VALID",
  ERROR: "ERROR",
} as const;
type AppState = (typeof AppState)[keyof typeof AppState];
export { AppState };

type NonNullAccount = NonNullable<SessionQuery["account"]>;
export type InstrumentSession =
  NonNullAccount["instrumentSessionRoles"]["edges"][0]["node"]["instrumentSession"];

export type OutletContextType = {
  session: {
    sessionVal: InstrumentSession;
    setSessionVal: React.Dispatch<React.SetStateAction<InstrumentSession>>;
  };
  appState: {
    appStateVal: AppState;
    setAppStateVal: React.Dispatch<React.SetStateAction<AppState>>;
  };
};
