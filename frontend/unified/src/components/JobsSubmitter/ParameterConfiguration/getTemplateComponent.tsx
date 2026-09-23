import { ReactElement } from "react";
import { Technique } from "../../../types";
import { LoaderProvider } from "../../../../../tomography/src/contexts/LoaderContext";
import { CorSweepParameterConfiguration } from "./TomoParameterConfiguration";

type TemplateComponentMapping = {
  [technique in Technique]: {
    [template: string]: ReactElement;
  };
};

export const getTemplateComponent = (
  techinque: Technique,
  template: string,
  setTemplateParameters: (params: object) => void
) => {
  const templateMap: TemplateComponentMapping = {
    [Technique.Dpc]: {},
    [Technique.Nbed]: {},
    [Technique.Ptycho]: {},
    [Technique.Tomo]: {
      "httomo-cor-sweep": (
        <LoaderProvider>
          <CorSweepParameterConfiguration
            setParameters={setTemplateParameters}
          />
        </LoaderProvider>
      ),
    },
    [Technique.Xanes]: {},
    [Technique.Xrd]: {},
  };
  return templateMap[techinque][template];
};
