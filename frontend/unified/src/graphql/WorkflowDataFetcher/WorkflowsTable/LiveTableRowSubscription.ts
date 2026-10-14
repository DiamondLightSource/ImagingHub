import { gql, TypedDocumentNode } from "@apollo/client";
import { BASETABLEROW_FRAGMENT } from "./BaseTableRowFragment";
import {
  LiveTableRowSubscription,
  LiveTableRowSubscriptionVariables,
} from "./__generated__/LiveTableRowSubscription.generated";

export const LIVETABLEROW_SUBSCRIPTION: TypedDocumentNode<
  LiveTableRowSubscription,
  LiveTableRowSubscriptionVariables
> = gql`
  subscription LiveTableRowSubscription($visit: VisitInput!, $name: String!) {
    workflow(visit: $visit, name: $name) {
      status {
        __typename
        ... on WorkflowSucceededStatus {
          startTime
        }
      }
      ...BaseTableRowFragment
    }
  }
  ${BASETABLEROW_FRAGMENT}
`;
