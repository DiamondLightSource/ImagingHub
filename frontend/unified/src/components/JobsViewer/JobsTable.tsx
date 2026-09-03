import { Box } from "@mui/material";
import {
  WorkflowsQueryQuery,
  WorkflowsQueryQueryVariables,
} from "./__generated__/JobsTable.generated";
import { Suspense, useCallback, useState } from "react";

import { Visit } from "./JobsViewer";
import TableContent, { TABLECONTENT_FRAGMENT } from "./TableContent";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const JOBSTABLE_QUERY: TypedDocumentNode<
  WorkflowsQueryQuery,
  WorkflowsQueryQueryVariables
> = gql`
  query WorkflowsQuery($visit: VisitInput!, $limit: Int, $cursor: String) {
    workflows(visit: $visit, limit: $limit, cursor: $cursor) {
      ...TableContentFragment @unmask
    }
  }
  ${TABLECONTENT_FRAGMENT}
`;

const JobsTable = ({ visit }: { visit: Visit }) => {
  const [selectedLimit, setSelectedLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const onChangeLimit = useCallback((limit: number) => {
    setSelectedLimit(limit);
    setCurrentPage(0);
    setCursor(null);
  }, []);

  const queryVariables: WorkflowsQueryQueryVariables = {
    visit,
    limit: selectedLimit,
    cursor,
  };

  const { data } = useQuery(JOBSTABLE_QUERY, {
    variables: queryVariables,
    pollInterval: 5000,
    fetchPolicy: "cache-and-network",
  });

  return (
    <Box width="600px" height="600px">
      <Suspense>
        {data && (
          <TableContent
            queryData={data.workflows}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            selectedLimit={selectedLimit}
            setSelectedLimit={onChangeLimit}
            setCursor={setCursor}
          />
        )}
      </Suspense>
    </Box>
  );
};

export default JobsTable;
