import { gql, TypedDocumentNode } from "@apollo/client";
import { useFragment } from "@apollo/client/react";
import { FragmentPlaygroundChild_WorkflowTemplateFragment } from "./__generated__/FragmentPlaygroundChild.generated";

export const WORKFLOW_TEMPLATE_FRAGMENT: TypedDocumentNode<FragmentPlaygroundChild_WorkflowTemplateFragment> = gql`
  fragment FragmentPlaygroundChild_workflowTemplate on WorkflowTemplate {
    maintainer
    repository
  }
`;

type FragmentPlaygroundChildProps = {
  workflowTemplate: FragmentPlaygroundChild_WorkflowTemplateFragment;
};

export const FragmentPlaygroundChild = ({
  workflowTemplate,
}: FragmentPlaygroundChildProps) => {
  console.log(
    "workflowTemplate in FragmentPlaygroundChild is: ",
    workflowTemplate
  );
  const { complete, data } = useFragment({
    fragment: WORKFLOW_TEMPLATE_FRAGMENT,
    from: workflowTemplate,
  });

  if (!complete) return <p>Not complete...</p>;
  if (data === undefined) return <p>Data undefined</p>;

  console.log("fragment within data is: ", data);

  return (
    <>
      <p>repository: {data.repository}</p>
      <p>maintainer: {data.maintainer}</p>
    </>
  );
};
