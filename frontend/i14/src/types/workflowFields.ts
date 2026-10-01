type ElementPair = {
  element: string;
  transition: string;
};

type GridPanel = (string | null)[][];

type Option = { label: string; value: string; desc?: string };

type GridOption = Option & {
  row?: number;
  column?: number;
};

type WorkflowFormData = {
  visit: string;
  template: string;
  outpath: string;
};
