import { ProcessingViewQuery } from "./graphql/__generated__/ProcessingViewQuery.generated";
import { SessionQuery } from "./graphql/__generated__/SessionQuery.generated";

const Technique = {
  Dpc: "Dpc",
  Nbed: "Nbed",
  Mib: "Mib",
  Ptycho: "Ptycho",
  Ptyrex: "Ptyrex",
  Ptypy: "Ptypy",
  Httomo: "Httomo",
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
  E01: "e01",
  E02: "e02",
  "I08-1": "i08-1",
  I12: "i12",
  "I13-1": "i13-1",
  I13: "i13",
  I14: "i14",
  "P99 TEST": "p99",
} as const;
type Beamline = (typeof Beamline)[keyof typeof Beamline];
export { Beamline };

export const BEAMLINE_TECHNIQUES_SUBSET = {
  [Beamline.DIAD]: [Technique.Httomo],
  [Beamline.I12]: [Technique.Httomo],
  [Beamline["I08-1"]]: [Technique.Ptycho, Technique.Ptypy],
  [Beamline["I13-1"]]: [
    Technique.Dpc,
    Technique.Ptyrex,
    Technique.Httomo,
    Technique.Xanes,
    Technique.Xrd,
  ],
  [Beamline["I13"]]: [Technique.Ptycho, Technique.Httomo],
  [Beamline.I14]: [Technique.Dpc, Technique.Xanes, Technique.Xrd],
  [Beamline.E02]: [
    Technique.Dpc,
    Technique.Nbed,
    Technique.Ptyrex,
    Technique.Mib,
  ],
  [Beamline.E01]: [Technique.Dpc, Technique.Nbed, Technique.Ptyrex],
  [Beamline["P99 TEST"]]: [Technique.Ptypy],
};

export const BEAMLINES_DEFAULT_TECHNIQUE = {
  [Beamline.DIAD]: Technique.Httomo,
  [Beamline.E02]: Technique.Mib,
  [Beamline.E01]: Technique.Ptyrex,
  [Beamline.I12]: Technique.Httomo,
  [Beamline["I08-1"]]: Technique.Ptycho,
  [Beamline["I13-1"]]: Technique.Ptycho,
  [Beamline["I13"]]: Technique.Httomo,
  [Beamline.I14]: Technique.Dpc,
  [Beamline["P99 TEST"]]: Technique.Ptypy,
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

export type AppStatus =
  | { state: "LOADING" }
  | { state: "LATEST_NOT_FOUND" }
  | { state: "INVALID_SESSION"; message: string }
  | { state: "FAILED_REGEX" }
  | { state: "VALID"; session: InstrumentSession }
  | { state: "ERROR"; message: string };

type NonNullAccount = NonNullable<SessionQuery["account"]>;
export type InstrumentSession =
  NonNullAccount["instrumentSessionRoles"]["edges"][0]["node"]["instrumentSession"];

export type OutletContextType = {
  appStatus: {
    appStatusVal: AppStatus;
    setAppStatusVal: React.Dispatch<React.SetStateAction<AppStatus>>;
  };
};

const WorkflowsViewMode = {
  Table: "Table",
  List: "List",
} as const;
type WorkflowsViewMode =
  (typeof WorkflowsViewMode)[keyof typeof WorkflowsViewMode];
export { WorkflowsViewMode };
