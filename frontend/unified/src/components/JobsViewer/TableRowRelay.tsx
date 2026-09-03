import { gql, TypedDocumentNode } from "@apollo/client";
import { TableCell, TableRow } from "@mui/material";
import { TableRowRelayFragmentFragment } from "./__generated__/TableRowRelay.generated";
import { useFragment } from "@apollo/client/react";
import BaseTableRow, { BASETABLEROW_FRAGMENT } from "./BaseTableRow";
import { finishedStatuses } from "./utils/utils";
import { useState } from "react";
import LiveTableRow from "./LiveTableRow";

export const TABLEROWRELAY_FRAGMENT: TypedDocumentNode<TableRowRelayFragmentFragment> = gql`
  fragment TableRowRelayFragment on Workflow {
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

interface TableRowRelayProps {
  queryData: TableRowRelayFragmentFragment;
}

const TableRowRelay = ({ queryData }: TableRowRelayProps) => {
  const [isNull, setIsNull] = useState<boolean>(false);
  const { complete, data } = useFragment({
    fragment: TABLEROWRELAY_FRAGMENT,
    fragmentName: "TableRowRelayFragment",
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

export default TableRowRelay;
