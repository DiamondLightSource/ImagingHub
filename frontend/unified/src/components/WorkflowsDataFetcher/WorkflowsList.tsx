import { Visit } from "@diamondlightsource/sci-react-ui";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Suspense, useCallback, useState } from "react";
import { WorkflowsTableQueryVariables } from "../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/WorkflowsTableQuery.generated";
import { WORKFLOWSTABLE_QUERY } from "../../graphql/WorkflowDataFetcher/WorkflowsTable/WorkflowsTableQuery";
import { useFragment, useQuery } from "@apollo/client/react";
import { TABLECONTENT_FRAGMENT } from "../../graphql/WorkflowDataFetcher/WorkflowsTable/TableContentFragment";
import { TableContentFragment } from "../../graphql/WorkflowDataFetcher/WorkflowsTable/__generated__/TableContentFragment.generated";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWorkflowStatusIcon } from "./WorkflowsTable/StatusIcons";

type WorkflowsListProps = {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

export const WorkflowsList: React.FC<WorkflowsListProps> = ({
  visit,
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowsListProps) => {
  const [selectedLimit, setSelectedLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const onChangeLimit = useCallback((limit: number) => {
    setSelectedLimit(limit);
    setCurrentPage(0);
    setCursor(null);
  }, []);

  const queryVariables: WorkflowsTableQueryVariables = {
    visit,
    limit: selectedLimit,
    cursor,
  };

  const { data } = useQuery(WORKFLOWSTABLE_QUERY, {
    variables: queryVariables,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  return (
    <Box>
      <Suspense>
        {data && (
          <WorkflowsListContents
            queryData={data.workflows}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedLimit={selectedLimit}
            setSelectedLimit={onChangeLimit}
            setCursor={setCursor}
            setSelectedWorkflow={setSelectedWorkflow}
            selectedWorkflow={selectedWorkflow}
          />
        )}
      </Suspense>
    </Box>
  );
};

type WorkflowsListContentsProps = {
  queryData: TableContentFragment;
  currentPage: number;
  setCurrentPage: (newPage: number) => void;
  selectedLimit: number;
  setSelectedLimit: (newLimit: number) => void;
  setCursor: (newCursor: string | null) => void;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
};

interface TablePaginationActionProps {
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const WorkflowsListContents: React.FC<WorkflowsListContentsProps> = ({
  queryData,
  currentPage,
  setCurrentPage,
  selectedLimit,
  setSelectedLimit,
  setCursor,
  selectedWorkflow,
  setSelectedWorkflow,
}: WorkflowsListContentsProps) => {
  const { complete, data } = useFragment({
    fragment: TABLECONTENT_FRAGMENT,
    fragmentName: "TableContentFragment",
    from: queryData,
  });

  if (!complete) return <div>Not Complete</div>;
  if (!data) return <div>No Data</div>;

  const pageInfo = data.pageInfo;

  const handlePageChange = (_: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedLimit(parseInt(event.target.value));
  };

  const TablePaginationActions = ({
    page,
    onPageChange: onPaginationPageChange,
  }: TablePaginationActionProps) => {
    const handlePrevPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page - 1);
      setCursor(pageInfo.startCursor);
    };
    const handleNextPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPaginationPageChange(event, page + 1);
      setCursor(pageInfo.endCursor);
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handlePrevPageButtonClick}
          aria-label="prev page"
          disabled={currentPage === 0}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={handleNextPageButtonClick}
          aria-label="next page"
          disabled={!pageInfo?.hasNextPage}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ padding: 2, width: 350 }}>
      <Typography variant="h5">Jobs</Typography>
      <Stack direction="column">
        {data &&
          data.nodes.map((workflow) => [
            <WorkflowEntry
              key={workflow.name}
              workflow={workflow}
              isSelected={workflow.name === selectedWorkflow}
              setSelectedWorkflow={setSelectedWorkflow}
            />,
          ])}
      </Stack>
      <TablePagination
        rowsPerPageOptions={[5]}
        rowsPerPage={selectedLimit}
        count={500}
        page={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
        labelDisplayedRows={({ from, to, page }) =>
          `${from}-${to} on page ${page + 1}`
        }
      />
    </Paper>
  );
};

type WorkflowEntryProps = {
  workflow: TableContentFragment["nodes"][0];
  isSelected: boolean;
  setSelectedWorkflow: (_: string | null) => void;
};

const WorkflowEntry: React.FC<WorkflowEntryProps> = ({
  workflow,
  isSelected,
  setSelectedWorkflow,
}: WorkflowEntryProps) => {
  const createTimeInfoString = () => {
    if (workflow.status?.__typename === "WorkflowRunningStatus") {
      return `started: ${workflow.status.startTime}`;
    } else if (
      workflow.status?.__typename === "WorkflowPendingStatus" ||
      !workflow.status
    ) {
      return "?";
    } else {
      const difference =
        Date.parse(workflow.status.endTime) -
        Date.parse(workflow.status.startTime);
      const mins = Math.floor(difference / 60 / 1000);
      const seconds = Math.floor(difference / 1000) - mins * 60;
      return `${Math.floor(mins)}m ${Math.floor(seconds)}s`;
    }
  };

  return (
    <div
      onClick={() =>
        isSelected
          ? setSelectedWorkflow(null)
          : setSelectedWorkflow(workflow.name)
      }
    >
      <Box
        paddingY={2}
        sx={(theme) => ({
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.15),
            cursor: "pointer",
          },
          backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.25)
            : "",
        })}
      >
        <Stack direction="row" spacing={1}>
          <Typography>{workflow.name}</Typography>
          {getWorkflowStatusIcon(workflow.status?.__typename ?? "Unknown")}
        </Stack>
        <Typography variant="subtitle2">{createTimeInfoString()}</Typography>
      </Box>
    </div>
  );
};
