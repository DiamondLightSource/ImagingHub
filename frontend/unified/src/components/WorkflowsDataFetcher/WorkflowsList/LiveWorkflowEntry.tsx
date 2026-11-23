import { Visit } from "@diamondlightsource/sci-react-ui";
import { useState } from "react";
import { BaseTableRowFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/BaseTableRowFragment.generated";
import { apolloClientWorkflows } from "../../../../../src/ApolloClient";
import { LIVETABLEROW_SUBSCRIPTION } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/LiveTableRowSubscription";
import { WorkflowEntry } from "./WorkflowEntry";

type LiveWorkflowEntryProps = {
  workflowName: string;
  visit: Visit;
  onNullSubscriptionData: () => void;
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
};

export const LiveWorkflowEntry = ({
  workflowName,
  visit,
  onNullSubscriptionData,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: LiveWorkflowEntryProps) => {
  const [queryData, setQueryData] = useState<BaseTableRowFragment | null>(null);
  apolloClientWorkflows
    .subscribe({
      query: LIVETABLEROW_SUBSCRIPTION,
      variables: {
        visit: visit,
        name: workflowName,
      },
    })
    .subscribe({
      next: (result) => {
        if (result.data?.workflow) {
          setQueryData(result.data.workflow);
        } else {
          onNullSubscriptionData();
          setQueryData(null);
        }
      },
      error: (error) => {
        console.error("Subscription error:", error);
      },
      complete: () => {
        console.log("Subscription completed");
        onNullSubscriptionData();
      },
    });
  return queryData ? (
    <WorkflowEntry
      workflow={queryData}
      isSelected={selectedWorkflowId === queryData.id}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  ) : null;
};
