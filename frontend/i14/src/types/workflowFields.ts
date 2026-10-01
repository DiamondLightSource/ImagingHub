type ElementPair = {
  id: number;
  edge: string;
  transition: string;
};

type GridPanel = (string | null)[][];

type GridOption = {
  ...Option
  row?: number;
  column?: number;
};

type Option = { label: string; value: string; desc?: string };

type WorkflowFormData = {
  visit: string;
  template: string;
  outpath: string;
  edgeElement?: ElementPair[];
  elementToAlign?: ElementPair[];
};
