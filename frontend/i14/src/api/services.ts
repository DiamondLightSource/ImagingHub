import type { ApiVisitSchema, Proposal } from "../../types/APIresponse";
import type { Option } from "../../types/workflowFields";

const formatDate = (d: Date): string =>
  `${d.toLocaleString("en-GB", { month: "long" })} ${d.getFullYear()}`;

const makeVisitId = (proposal: Proposal, sessionNumber: number): string =>
  `${String(proposal.proposalCategory).toLowerCase()}${proposal.proposalNumber}-${sessionNumber}`;

const makeLabel = (
  proposal: Proposal,
  sessionNumber: number,
  d: string
): string => {
  const visit = makeVisitId(proposal, sessionNumber);
  const date = formatDate(new Date(d));
  return `${visit} - ${date}`;
};

export const dataToOptions = (d: ApiVisitSchema): Option[] =>
  d.visitArray.account.proposalRoles
    ?.flatMap((r) =>
      (r.proposal?.instrumentSessions ?? [])
        .filter((s) => s?.startTime)
        .map((s) => ({
          desc: r.proposal?.title ?? "",
          label: makeLabel(r.proposal, s.instrumentSessionNumber, s.startTime),
          value: makeVisitId(r.proposal, s.instrumentSessionNumber),
          _ts: Date.parse(s.startTime),
        }))
    )
    .filter((o) => !Number.isNaN(o._ts))
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 5)
    .map(({ _ts, ...rest }) => rest);
