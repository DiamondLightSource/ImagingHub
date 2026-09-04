import { gql } from "@apollo/client";
import { TableCell, TableRow } from "@mui/material";
import { useFragment } from "@apollo/client/react";
import { BaseTableRowFragmentFragment } from "./__generated__/BaseTableRow.generated";
import { getWorkflowStatusIcon } from "./StatusIcons";
import { DeepPartial } from "@apollo/client/utilities";
import { TableRowRelayFragmentFragment } from "./__generated__/TableRowRelay.generated";

export const BASETABLEROW_FRAGMENT = gql`
  fragment BaseTableRowFragment on Workflow {
    name
    status {
      __typename
    }
  }
`;

const BaseTableRow = ({
  queryData,
}: {
  queryData:
    TableRowRelayFragmentFragment | DeepPartial<TableRowRelayFragmentFragment>;
}) => {
  const { data } = useFragment<BaseTableRowFragmentFragment>({
    fragment: BASETABLEROW_FRAGMENT,
    fragmentName: "BaseTableRowFragment",
    from: queryData,
  });

  return (
    <TableRow key={data.name}>
      <TableCell>{data.name}</TableCell>
      <TableCell>1</TableCell>
      <TableCell>
        {getWorkflowStatusIcon(data.status?.__typename ?? "Unknown")}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
};

export default BaseTableRow;
