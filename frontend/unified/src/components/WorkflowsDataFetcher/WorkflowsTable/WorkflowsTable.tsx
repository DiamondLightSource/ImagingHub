import { Suspense, useCallback, useState } from "react";
import { Visit } from "@diamondlightsource/sci-react-ui";
import TableContent, { TABLECONTENT_FRAGMENT } from "./TableContent";
import { gql, TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  WorkflowsTableQueryQuery,
  WorkflowsTableQueryQueryVariables,
} from "./__generated__/WorkflowsTable.generated";

export const WORKFLOWSTABLE_QUERY: TypedDocumentNode<
  WorkflowsTableQueryQuery,
  WorkflowsTableQueryQueryVariables
> = gql`
  query WorkflowsTableQuery($visit: VisitInput!, $limit: Int, $cursor: String) {
    workflows(visit: $visit, limit: $limit, cursor: $cursor) {
      ...TableContentFragment @unmask
    }
  }
  ${TABLECONTENT_FRAGMENT}
`;

const WorkflowsTable = ({
  visit,
  setSelectedWorkflow,
  selectedWorkflow,
}: {
  visit: Visit;
  selectedWorkflow: string | null;
  setSelectedWorkflow: (_: string | null) => void;
}) => {
  const [selectedLimit, setSelectedLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [cursor, setCursor] = useState<string | null>(null);

  const onChangeLimit = useCallback((limit: number) => {
    setSelectedLimit(limit);
    setCurrentPage(0);
    setCursor(null);
  }, []);

  const queryVariables: WorkflowsTableQueryQueryVariables = {
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
    <Suspense>
      {data && (
        <TableContent
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
  );
};

export default WorkflowsTable;
