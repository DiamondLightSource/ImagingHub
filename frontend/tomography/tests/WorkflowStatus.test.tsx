import React from "react";
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing/react";
import WorkflowStatus, {
  WORKFLOW_STATUS_SUBSCRIPTION,
} from "../src/components/workflows/WorkflowStatus";

const WORKFLOW_NAME = "httomo-cor-sweep-abcde";
const VISIT = { proposalCode: "cm", proposalNumber: 40628, number: 3 };

const mocks = [
  {
    request: {
      query: WORKFLOW_STATUS_SUBSCRIPTION,
      variables: {
        name: WORKFLOW_NAME,
        visit: VISIT,
      },
    },
    result: {
      data: {
        workflow: {
          status: {
            __typename: "WorkflowRunningStatus",
            startTime: "",
            message: "Workflow is running",
            tasks: [
              {
                id: 0,
                name: "task-0",
                status: "WorkflowRunningStatus",
                stepType: "Pod",
                artifacts: [
                  {
                    name: "some-artifact",
                    url: "https://some-artifact",
                    mimeType: "image/png",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
];

test("running workflow status from subscription displays running in status chip", async () => {
  render(
    <MockedProvider mocks={mocks}>
      <WorkflowStatus
        workflow={WORKFLOW_NAME}
        visit={`${VISIT.proposalCode}${VISIT.proposalNumber}-${VISIT.number}`}
      />
    </MockedProvider>
  );

  expect(await screen.findByText("Running")).toBeDefined();
});
