import { gql, TypedDocumentNode } from "@apollo/client";
import BaseTableRow, { BASETABLEROW_FRAGMENT } from "./BaseTableRow";
import { useState } from "react";
import { BaseTableRowFragmentFragment } from "./__generated__/BaseTableRow.generated";
import { apolloClientWorkflows } from "../../../../src/ApolloClient";
import {
  LiveTableRowSubscriptionSubscription,
  LiveTableRowSubscriptionSubscriptionVariables,
} from "./__generated__/LiveTableRow.generated";
import { Visit } from "@diamondlightsource/sci-react-ui";

export const LIVETABLEROW_SUBSCRIPTION: TypedDocumentNode<
  LiveTableRowSubscriptionSubscription,
  LiveTableRowSubscriptionSubscriptionVariables
> = gql`
  subscription LiveTableRowSubscription($visit: VisitInput!, $name: String!) {
    workflow(visit: $visit, name: $name) {
      status {
        __typename
      }
      ...BaseTableRowFragment
    }
  }
  ${BASETABLEROW_FRAGMENT}
`;

interface LiveTableRowProps {
  workflowName: string;
  visit: Visit;
  onNullSubscriptionData: () => void;
}

const LiveTableRow = ({
  workflowName,
  visit,
  onNullSubscriptionData,
}: LiveTableRowProps) => {
  const [queryData, setQueryData] =
    useState<BaseTableRowFragmentFragment | null>(null);
  apolloClientWorkflows
    .subscribe({
      query: LIVETABLEROW_SUBSCRIPTION,
      variables: {
        visit: visit,
        name: workflowName,
      },
    })
    .subscribe({
      next: (result) => {
        if (result.data?.workflow) {
          setQueryData(result.data.workflow);
        } else {
          onNullSubscriptionData();
          setQueryData(null);
        }
      },
      error: (error) => {
        console.error("Subscription error:", error);
      },
      complete: () => {
        console.log("Subscription completed");
        onNullSubscriptionData();
      },
    });
  return queryData ? <BaseTableRow queryData={queryData} /> : null;
};

export default LiveTableRow;
