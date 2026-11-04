import type { Option } from "./../../../shared_components/types";
import type { WorkflowFormData } from "./../types/form";

export const initialData: WorkflowFormData = {
  visit: "",
  template: "dpc-batch",
  outpath: "/dls/i14/data/",
  edgeElementArray: [{ id: "1", element: "", transition: "" }],
  edgeElement: { element: "", transition: "" },
  elementToAlign: { element: "", transition: "" },
  method: "mutual",
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
