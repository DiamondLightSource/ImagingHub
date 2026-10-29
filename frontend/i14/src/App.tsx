import { ApolloProvider } from "@apollo/client/react";

import { apolloClientUlims } from "./../../src/ApolloClient";
import { WorkflowForm } from "./components/workflows/WorkflowForm";

export const App: React.FC = () => {
  return (
    <>
      <ApolloProvider client={apolloClientUlims}>
        <WorkflowForm />
      </ApolloProvider>
    </>
  );
};
