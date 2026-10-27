import { useState } from "react";
import { TableRowWrapperFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableRowWrapperFragment.generated";
import { useFragment } from "@apollo/client/react";
import { TABLEROWWRAPPER_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableRowWrapperFragment";
import { finishedStatuses } from "../WorkflowsTable/utils/utils";
import { WorkflowEntry } from "./WorkflowEntry";
import { LiveWorkflowEntry } from "./LiveWorkflowEntry";

type WorkflowEntryWrapperProps = {
  queryData: TableRowWrapperFragment;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

export const WorkflowEntryWrapper = ({
  queryData,
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowEntryWrapperProps) => {
  const [isNull, setIsNull] = useState<boolean>(false);
  const { complete, data } = useFragment({
    fragment: TABLEROWWRAPPER_FRAGMENT,
    fragmentName: "TableRowWrapperFragment",
    from: queryData,
  });

  if (!data) {
    return <p>no data</p>;
  }

  if (!complete) {
    return <p>loading...</p>;
  }

  const finished =
    data.status?.__typename && finishedStatuses.has(data.status.__typename);
  const onNullSubscriptionData = () => {
    setIsNull(true);
  };

  return finished || isNull ? (
    <WorkflowEntry
      workflow={data}
      isSelected={selectedWorkflow === queryData.name}
      setSelectedWorkflow={setSelectedWorkflow}
    />
  ) : (
    <LiveWorkflowEntry
      visit={data.visit}
      workflowName={data.name}
      onNullSubscriptionData={onNullSubscriptionData}
      selectedWorkflow={selectedWorkflow}
      setSelectedWorkflow={setSelectedWorkflow}
    />
  );
};
