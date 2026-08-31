type ProposalCategory = "mg" | "cm" | "nt" | "nr" | "jm" | "bi" | "si";

interface InstrumentSession {
  startTime: string;
  endTime: string;
  instrumentSessionNumber: number;
}

interface Proposal {
  proposalNumber: number;
  proposalCategory: ProposalCategory;
  title: string;
  instrumentSessions: InstrumentSession[];
}

export type ApiVisitSchema = {
  data: {
    account: {
      proposalRoles: {
        proposal: Proposal;
      }[];
    };
  };
};
