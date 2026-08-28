import { gql, TypedDocumentNode } from "@apollo/client";
import {
  WORKFLOW_TEMPLATE_FRAGMENT,
  FragmentPlaygroundChild,
} from "./FragmentPlaygroundChild";
import { useQuery } from "@apollo/client/react";
import {
  FragmentPlaygroundQuery,
  FragmentPlaygroundQueryVariables,
} from "./__generated__/FragmentPlayground.generated";

const GET_WORKFLOW_TEMPLATE: TypedDocumentNode<
  FragmentPlaygroundQuery,
  FragmentPlaygroundQueryVariables
> = gql`
  query fragmentPlayground($name: String!) {
    workflowTemplate(name: $name) {
      name
      ...FragmentPlaygroundChild_workflowTemplate
    }
  }

  ${WORKFLOW_TEMPLATE_FRAGMENT}
`;

export const FragmentPlayground = () => {
  const { loading, error, data } = useQuery(GET_WORKFLOW_TEMPLATE, {
    variables: {
      name: "httomo-cor-sweep",
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data === undefined) {
    return <p>Data undefined</p>;
  }

  console.log("data in FragmentPlayground is: ", data);

  return (
    <>
      <FragmentPlaygroundChild workflowTemplate={data.workflowTemplate} />
    </>
  );
};
