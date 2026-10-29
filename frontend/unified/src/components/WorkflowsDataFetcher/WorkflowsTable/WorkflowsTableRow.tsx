import { TableRow, TableRowProps } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const WorkflowsTableRow = styled(TableRow)<TableRowProps>(
  ({ theme }) => ({
    // Duplicating the state selector `Mui-selected` to have the background colour of a selected
    // row take precendence over the background colour of a hovered-over row
    "&.WorkflowsTableRow.Mui-selected.Mui-selected.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    },
    "&.WorkflowsTableRow.MuiTableRow-hover:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
      cursor: "pointer",
    },
  })
);
