import BaseTableRow from "./BaseTableRow";
import { useState } from "react";
import { apolloClientWorkflows } from "../../../../../src/ApolloClient";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { BaseTableRowFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/BaseTableRowFragment.generated";
import { LIVETABLEROW_SUBSCRIPTION } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/LiveTableRowSubscription";

interface LiveTableRowProps {
  workflowName: string;
  visit: Visit;
  onNullSubscriptionData: () => void;
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
}

const LiveTableRow = ({
  workflowName,
  visit,
  onNullSubscriptionData,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: LiveTableRowProps) => {
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
    <BaseTableRow
      queryData={queryData}
      selectedWorkflowId={selectedWorkflowId}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  ) : null;
};

export default LiveTableRow;
