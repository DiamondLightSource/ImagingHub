import { useState } from "react";
import { TableRowWrapperFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableRowWrapperFragment.generated";
import { useFragment } from "@apollo/client/react";
import { TABLEROWWRAPPER_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableRowWrapperFragment";
import { finishedStatuses } from "../WorkflowsTable/utils/utils";
import { WorkflowEntry } from "./WorkflowEntry";
import { LiveWorkflowEntry } from "./LiveWorkflowEntry";
import { Visit } from "@diamondlightsource/sci-react-ui";

type WorkflowEntryWrapperProps = {
  queryData: TableRowWrapperFragment;
  visit: Visit;
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
};

export const WorkflowEntryWrapper = ({
  queryData,
  visit,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
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
      visit={visit}
      workflow={data}
      isSelected={selectedWorkflowId === queryData.id}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  ) : (
    <LiveWorkflowEntry
      visit={visit}
      workflowName={data.name}
      onNullSubscriptionData={onNullSubscriptionData}
      selectedWorkflowId={selectedWorkflowId}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  );
};
