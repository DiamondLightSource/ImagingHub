import { useState, Suspense } from "react";
import { Box } from "@mui/material";
import { Visit, visitToText } from "@diamondlightsource/sci-react-ui";
import SubmissionFormGPURun from "./SubmissionFormGPURun";
import SubmissionFormCOR from "./sweepPipeline/SubmissionFormCOR";
import React from "react";
import { JSONObject } from "../../types";
import SubmissionFormRawProjections from "./rawProjections/SubmissionFormRawProjections";
import { type TypedDocumentNode, gql } from "@apollo/client";
import { useSuspenseQuery, useMutation } from "@apollo/client/react";
import {
  type WorkflowTemplateQuery,
  type WorkflowTemplateQueryVariables,
  type SubmitWorkflowTemplateMutation,
  type SubmitWorkflowTemplateMutationVariables,
} from "./__generated__/Submission.generated";

export const GET_WORKFLOW_TEMPLATE: TypedDocumentNode<
  WorkflowTemplateQuery,
  WorkflowTemplateQueryVariables
> = gql`
  query workflowTemplate($name: String!) {
    workflowTemplate(name: $name) {
      name
      maintainer
      title
      description
      arguments
      uiSchema
    }
  }
`;

export const SUBMIT_WORKFLOW_TEMPLATE: TypedDocumentNode<
  SubmitWorkflowTemplateMutation,
  SubmitWorkflowTemplateMutationVariables
> = gql`
  mutation submitWorkflowTemplate(
    $name: String!
    $visit: VisitInput!
    $parameters: JSON!
  ) {
    submitWorkflowTemplate(
      name: $name
      visit: $visit
      parameters: $parameters
    ) {
      name
    }
  }
`;

interface SubmissionProps {
  /** The name of the workflow template, i.e. numpy-benchmark */
  workflowName: string;
  /** The set function for a user visit */
  setVisit: (
    value:
      Visit | undefined | ((prevState: Visit | undefined) => Visit | undefined)
  ) => void;
  /** Optional prepopulated parameters */
  prepopulatedParameters?: JSONObject;
  /** Optional visit information */
  visit?: Visit;
}

export default function Submission({
  workflowName,
  setVisit,
  visit,
}: SubmissionProps) {
  const { data } = useSuspenseQuery(GET_WORKFLOW_TEMPLATE, {
    variables: {
      name: workflowName,
    },
  });

  const [submissionResults, setSubmissionResults] = useState([]);

  const [commitMutation, { data: mutationData }] = useMutation(
    SUBMIT_WORKFLOW_TEMPLATE
  );

  function submitWorkflow(
    visit: Visit,
    parameters: object,
    onSuccess?: (workflowName: string) => void
  ) {
    commitMutation({
      variables: {
        name: workflowName,
        visit: visit,
        parameters: parameters,
      },
      onCompleted: (response) => {
        // TODO: check if this should be moved into the `onError` handler
        // if (errors?.length) {
        //   console.error("GraphQL errors:", errors);
        //   setSubmissionResults((prev) => [
        //     {
        //       type: "graphQLError",
        //       errors: errors,
        //     },
        //     ...prev,
        //   ]);
        // } else {
        const submittedName = response.submitWorkflowTemplate.name;
        setVisit(visit);
        setSubmissionResults((prev) => [
          {
            type: "success",
            message: `${visitToText(visit)}/${submittedName}`,
          },
          ...prev,
        ]);

        // Call the success callback with workflow name
        if (onSuccess) {
          onSuccess(submittedName);
        } else {
          console.log("No onSuccess callback provided");
        }
      },
      onError: (err) => {
        console.error("Submission failed:", err);
        setSubmissionResults((prev) => [
          {
            type: "networkError",
            error: err,
          },
          ...prev,
        ]);
      },
    });
  }

  // Conditionally render the appropriate form component
  const renderSubmissionForm = () => {
    const commonProps = {
      template: data.workflowTemplate,
      visit,
      onSubmit: submitWorkflow,
    };

    function switchOnWorkflowTemplate(workflowName: string) {
      switch (workflowName) {
        case "httomo-cor-sweep":
          return <SubmissionFormCOR {...commonProps} />;
        case "httomo-gpu-job":
          return <SubmissionFormGPURun {...commonProps} />;
        case "extract-raw-projections":
          return <SubmissionFormRawProjections {...commonProps} />;
        default:
          return <p>invalid workflow name</p>;
      }
    }

    return (
      <Suspense fallback={<p>Loading...</p>}>
        {switchOnWorkflowTemplate(workflowName)}
      </Suspense>
    );
  };

  return (
    <>
      {workflowName ? (
        <Box>
          {renderSubmissionForm()}
          <SubmittedMessagesList messages={submissionResults} />
        </Box>
      ) : (
        <>No Workflow Name provided</>
      )}
    </>
  );
}

const SubmittedMessagesList = ({ messages }: { messages: any[] }) => {
  return (
    <>
      {messages.map((message, messageIdx) => {
        switch (message.type) {
          case "success":
            return (
              <p
                key={messageIdx}
              >{`Successfully submitted ${message.message}`}</p>
            );
          case "networkError":
            return (
              <p
                key={messageIdx}
              >{`Submission error type ${message.error.name}`}</p>
            );
          case "graphQLError":
          default:
            return (
              <div key={messageIdx}>
                <p>{"Submission error type GraphQL"}</p>
                {message.errors.map((e, idx) => {
                  return <p key={idx}>{`Error ${idx} ${e.message}`}</p>;
                })}
              </div>
            );
        }
      })}
    </>
  );
};
