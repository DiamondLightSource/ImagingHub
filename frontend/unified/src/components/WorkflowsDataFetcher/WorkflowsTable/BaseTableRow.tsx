import { Box, TableCell, Typography } from "@mui/material";
import { Eye } from "lucide-react";
import { useFragment } from "@apollo/client/react";
import { getWorkflowStatusIcon } from "./StatusIcons";
import { WorkflowsTableRow } from "./WorkflowsTableRow";
import { BASETABLEROW_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/BaseTableRowFragment";
import { TableRowWrapperFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableRowWrapperFragment.generated";
import { BaseTableRowFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/BaseTableRowFragment.generated";

const BaseTableRow = ({
  queryData,
  selectedWorkflowId,
  setSelectedWorkflowId,
  setSelectedWorkflowName,
}: {
  queryData: TableRowWrapperFragment;
  selectedWorkflowId: string | null;
  setSelectedWorkflowId: (_: string | null) => void;
  setSelectedWorkflowName: (_: string | null) => void;
}) => {
  const { data } = useFragment<BaseTableRowFragment>({
    fragment: BASETABLEROW_FRAGMENT,
    fragmentName: "BaseTableRowFragment",
    from: queryData,
  });

  return (
    <WorkflowsTableRow
      hover
      key={data.id}
      onClick={(_: React.MouseEvent<unknown>) => {
        if (selectedWorkflowId === data.id) {
          setSelectedWorkflowId(null);
          setSelectedWorkflowName(null);
          return;
        }
        setSelectedWorkflowName(data.name ?? null);
        setSelectedWorkflowId(data.id ?? null);
      }}
      selected={data.id === selectedWorkflowId}
      className="WorkflowsTableRow"
    >
      <TableCell>
        <Eye
          visibility={data.id === selectedWorkflowId ? "visible" : "hidden"}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ display: "grid" }}>
          <Typography
            gridRow={1}
            gridColumn={1}
            fontWeight="bold"
            visibility={data.id === selectedWorkflowId ? "visible" : "hidden"}
          >
            {data.name}
          </Typography>
          <Typography
            gridRow={1}
            gridColumn={1}
            fontWeight="normal"
            visibility={data.id === selectedWorkflowId ? "hidden" : "visible"}
          >
            {data.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{data.parameters.scanId ?? "N/A"}</TableCell>
      <TableCell>
        {getWorkflowStatusIcon(data.status?.__typename ?? "Unknown")}
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
    </WorkflowsTableRow>
  );
};

export default BaseTableRow;
