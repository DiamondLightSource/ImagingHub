import { TableCell, TableRow } from "@mui/material";
import { useFragment } from "@apollo/client/react";
import BaseTableRow from "./BaseTableRow";
import { finishedStatuses } from "./utils/utils";
import { useState } from "react";
import LiveTableRow from "./LiveTableRow";
import { TABLEROWWRAPPER_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/TableRowWrapperFragment";
import { TableRowWrapperFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableRowWrapperFragment.generated";
import { Visit } from "@diamondlightsource/sci-react-ui";

interface TableRowWrapperProps {
  queryData: TableRowWrapperFragment;
  visit: Visit;
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
}

const TableRowWrapper = ({
  queryData,
  visit,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: TableRowWrapperProps) => {
  const [isNull, setIsNull] = useState<boolean>(false);
  const { complete, data } = useFragment({
    fragment: TABLEROWWRAPPER_FRAGMENT,
    fragmentName: "TableRowWrapperFragment",
    from: queryData,
  });

  if (!data) {
    return (
      <TableRow>
        <TableCell>No Data</TableCell>
      </TableRow>
    );
  }

  if (!complete) {
    return (
      <TableRow>
        <TableCell>Loading...</TableCell>
      </TableRow>
    );
  }

  const finished =
    data.status?.__typename && finishedStatuses.has(data.status.__typename);
  const onNullSubscriptionData = () => {
    setIsNull(true);
  };

  return finished || isNull ? (
    <BaseTableRow
      queryData={data}
      selectedWorkflowId={selectedWorkflowId}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  ) : (
    <LiveTableRow
      visit={visit}
      workflowName={data.name}
      onNullSubscriptionData={onNullSubscriptionData}
      selectedWorkflowId={selectedWorkflowId}
      setSelectedWorkflowId={setSelectedWorkflowId}
      setSelectedWorkflowName={setSelectedWorkflowName}
    />
  );
};

export default TableRowWrapper;
