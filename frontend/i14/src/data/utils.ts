import type { Option } from "../../types/workflowFields";
import type { UserVisitsQuery } from "./__generated__/UserVisits.generated";

const formatDate = (d: Date): string =>
  `${d.toLocaleString("en-GB", {
    month: "long",
  })} ${d.getFullYear()}`;

const makeVisitId = (proposal: Proposal, sessionNumber: number): string =>
  `${String(proposal.proposalCategory).toLowerCase()}${proposal.proposalNumber}-${sessionNumber}`;

export const proposalToOptions = (response: UserVisitsQuery): Option[] => {
  const edges = response.account?.instrumentSessionRoles?.edges ?? [];
  return edges
    .map(({ node }) => {
      const { proposal, instrumentSessionNumber, startTime } =
        node.instrumentSession;
      const value = makeVisitId(proposal, instrumentSessionNumber);
      const date = formatDate(new Date(startTime));
      return {
        value,
        label: `${value} - ${date}`,
        desc: proposal.title ?? "",
        _ts: Date.parse(startTime),
      };
    })
    .filter((option) => !Number.isNaN(option._ts))
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 5)
    .map(({ _ts, ...option }) => option);
};
