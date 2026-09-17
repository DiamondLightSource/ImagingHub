import { gql } from "@apollo/client";
import { Box, TableCell, Typography } from "@mui/material";
import { Eye } from "lucide-react";
import { useFragment } from "@apollo/client/react";
import { BaseTableRowFragmentFragment } from "./__generated__/BaseTableRow.generated";
import { getWorkflowStatusIcon } from "./StatusIcons";
import { DeepPartial } from "@apollo/client/utilities";
import { TableRowRelayFragmentFragment } from "./__generated__/TableRowRelay.generated";
import { JobTableRow } from "./JobTableRow";

export const BASETABLEROW_FRAGMENT = gql`
  fragment BaseTableRowFragment on Workflow {
    name
    status {
      __typename
      ... on WorkflowSucceededStatus {
        startTime
      }
    }
  }
`;

const BaseTableRow = ({
  queryData,
  selectedWorkflow,
  setSelectedWorkflow,
}: {
  queryData:
    TableRowRelayFragmentFragment | DeepPartial<TableRowRelayFragmentFragment>;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  const { data } = useFragment<BaseTableRowFragmentFragment>({
    fragment: BASETABLEROW_FRAGMENT,
    fragmentName: "BaseTableRowFragment",
    from: queryData,
  });

  return (
    <JobTableRow
      hover
      key={data.name}
      onClick={(_: React.MouseEvent<unknown>) => {
        if (selectedWorkflow === data.name) {
          setSelectedWorkflow(null);
          return;
        }
        setSelectedWorkflow(data.name);
      }}
      selected={data.name === selectedWorkflow}
      className="JobTableRow"
    >
      <TableCell>
        <Eye
          visibility={data.name === selectedWorkflow ? "visible" : "hidden"}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "grid" }}>
          <Typography
            gridRow={1}
            gridColumn={1}
            fontWeight="bold"
            visibility={data.name === selectedWorkflow ? "visible" : "hidden"}
          >
            {data.name}
          </Typography>
          <Typography
            gridRow={1}
            gridColumn={1}
            fontWeight="normal"
            visibility={data.name === selectedWorkflow ? "hidden" : "visible"}
          >
            {data.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>1</TableCell>
      <TableCell>
        {getWorkflowStatusIcon(data.status?.__typename ?? "Unknown")}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </JobTableRow>
  );
};

export default BaseTableRow;
