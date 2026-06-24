import { WorkflowForm } from "./components/workflows/WorkflowForm";
import { ResourceForm } from "./components/workflows/ResourceForm";

export const App: React.FC = () => {
  return (
    <>
      <WorkflowForm />
      <ResourceForm />
    </>
  );
};
