import { WorkflowForm } from "./components/workflows/WorkflowForm";
import { ResourceForm } from "../../shared_components/ResourceForm";

export const App: React.FC = () => {
  return (
    <>
      <WorkflowForm />
      <ResourceForm />
    </>
  );
};
