import { Box, TableCell, Typography } from "@mui/material";
import { Eye } from "lucide-react";
import { useFragment } from "@apollo/client/react";
import { getWorkflowStatusIcon } from "./StatusIcons";
import { DeepPartial } from "@apollo/client/utilities";
import { WorkflowsTableRow } from "./WorkflowsTableRow";
import { BASETABLEROW_FRAGMENT } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/BaseTableRowFragment";
import { TableRowWrapperFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableRowWrapperFragment.generated";
import { BaseTableRowFragment } from "../../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/BaseTableRowFragment.generated";

const BaseTableRow = ({
  queryData,
  selectedWorkflow,
  setSelectedWorkflow,
}: {
  queryData: TableRowWrapperFragment | DeepPartial<TableRowWrapperFragment>;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  const { data } = useFragment<BaseTableRowFragment>({
    fragment: BASETABLEROW_FRAGMENT,
    fragmentName: "BaseTableRowFragment",
    from: queryData,
  });

  return (
    <WorkflowsTableRow
      hover
      key={data.name}
      onClick={(_: React.MouseEvent<unknown>) => {
        if (selectedWorkflow === data.name) {
          setSelectedWorkflow(null);
          return;
        }
        setSelectedWorkflow(data.name ?? null);
      }}
      selected={data.name === selectedWorkflow}
      className="WorkflowsTableRow"
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
