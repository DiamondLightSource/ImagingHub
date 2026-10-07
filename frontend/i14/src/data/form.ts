import type { WorkflowFormData } from "../types/workflowFields";
export const iconSize: number = 22;
export const initialData: WorkflowFormData = {
  visit: "",
  template: "dpc-batch",
  outpath: "/dls/i14/data/",
  edgeElementArray: [
    { id: "1", element: "H", transition: "Ka" },
    { id: "2", element: "H", transition: "Ka" },
  ],
  edgeElement: { element: "H", transition: "Ka" },
  elementToAlign: { element: "H", transition: "Ka" },
};
