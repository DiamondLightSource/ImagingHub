import type { WorkflowFormData } from "../types/workflowFields";
export const iconSize: number = 22;
export const initialData: WorkflowFormData = {
  visit: "",
  template: "dpc-batch",
  outpath: "/dls/i14/data/",
  edgeElementArray: [{ id: "1", element: "H", transition: "Ka" }],
  edgeElement: { element: "H", transition: "Ka" },
  elementToAlign: { element: "H", transition: "Ka" },
  brute: false,
  max_fractional_shift: 0.2,
};
export const technique: [string, string][] = [
  ["dpc", "Differential Phase Contrast"],
  ["xanes", "X-ray Absorption Near Edge Structure"],
  ["xrd", "X-ray Diffraction"],
  ["xrf", "X-ray Fluorescence"],
];

export const techniqueOptions: Option[] = technique.map(([value, desc]) => ({
  label: value.toUpperCase(),
  value,
  desc,
}));
