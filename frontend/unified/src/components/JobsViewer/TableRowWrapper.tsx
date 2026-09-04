import { gql, TypedDocumentNode } from "@apollo/client";
import { TableCell, TableRow } from "@mui/material";
import { TableRowWrapperFragmentFragment } from "./__generated__/TableRowWrapper.generated";
import { useFragment } from "@apollo/client/react";
import BaseTableRow, { BASETABLEROW_FRAGMENT } from "./BaseTableRow";
import { finishedStatuses } from "./utils/utils";
import { useState } from "react";
import LiveTableRow from "./LiveTableRow";

export const TABLEROWWRAPPER_FRAGMENT: TypedDocumentNode<TableRowWrapperFragmentFragment> = gql`
  fragment TableRowWrapperFragment on Workflow {
    ...BaseTableRowFragment
    status {
      __typename
    }
    visit {
      proposalCode
      proposalNumber
      number
    }
    name
  }
  ${BASETABLEROW_FRAGMENT}
`;

interface TableRowWrapperProps {
  queryData: TableRowWrapperFragmentFragment;
}

const TableRowWrapper = ({ queryData }: TableRowWrapperProps) => {
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
    <BaseTableRow queryData={data} />
  ) : (
    <LiveTableRow
      visit={data.visit}
      workflowName={data.name}
      onNullSubscriptionData={onNullSubscriptionData}
    />
  );
};

export default TableRowWrapper;
