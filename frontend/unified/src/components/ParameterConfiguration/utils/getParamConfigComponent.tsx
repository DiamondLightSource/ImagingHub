import { ReactElement, Suspense } from "react";
import { Technique } from "../../../types";
import { DpcParameterConfiguration } from "../dpc/DpcParameterConfiguration";
import { MibParameterConfiguration } from "../mib/MibParameterConfiguration";
import PtypyI08ParameterConfiguration from "../ptypy/PtypyI08ParameterConfiguration";
import PtypyP99ParameterConfiguration from "../ptypy/PtypyP99ParameterConfiguration";
import { PtyrexParameterConfiguration } from "../ptyrex/PtyrexParameterConfiguration";
import { LoaderProvider } from "../../../../../tomography/src/contexts/LoaderContext";
import { CorSweepParameterConfiguration } from "../tomo/TomoParameterConfiguration";
import { Fbp180ParameterConfiguration } from "../tomo/Fbp180ParameterConfiguration";
import { XanesAutoprocessingParameterConfiguration } from "../xanes/XanesAutoprocessingParameterConfiguration";
import { ResourceForm } from "../../ResourceForm";

type TemplateComponentMapping = {
  [technique in Technique]: {
    [template: string]: ReactElement;
  };
};

export const getParamConfigComponent = (
  technique: Technique,
  template: string,
  resourceDisplayList: object,
  setTemplateParameters: (_: object) => void,
  setResourceParameters: (_: { nprocs: number; memory: string }) => void,
  visitDirPath: string
) => {
  const TEMPLATE_TO_COMPONENT_MAPPING: TemplateComponentMapping = {
    [Technique.Dpc]: {
      "dpc-batch": (
        <DpcParameterConfiguration
          setParameters={setTemplateParameters}
          visitDirpath={visitDirPath}
        />
      ),
    },
    [Technique.Nbed]: {},
    [Technique.Mib]: {
      "e02mib2x-auto": (
        <MibParameterConfiguration setParameters={setTemplateParameters} />
      ),
    },
    [Technique.Ptycho]: {},
    [Technique.Ptypy]: {
      "ptypy-i08-1-from-config": (
        <Suspense fallback={<p>Fetching workflow template...</p>}>
          <PtypyI08ParameterConfiguration
            setParameters={setTemplateParameters}
          />
          <ResourceForm
            resourceDisplayList={resourceDisplayList}
            setResourceParameters={setResourceParameters}
          />
        </Suspense>
      ),
      "ptypy-p99-from-config": (
        <Suspense fallback={<p>Fetching workflow template...</p>}>
          <PtypyP99ParameterConfiguration
            setParameters={setTemplateParameters}
          />
          <ResourceForm
            resourceDisplayList={resourceDisplayList}
            setResourceParameters={setResourceParameters}
          />
        </Suspense>
      ),
    },
    [Technique.Ptyrex]: {
      "ptyrex-submission": (
        <Suspense fallback={<p>Fetching workflow template...</p>}>
          <PtyrexParameterConfiguration
            setParameters={setTemplateParameters}
            visitDirpath={visitDirPath}
          />
          <ResourceForm
            resourceDisplayList={resourceDisplayList}
            setResourceParameters={setResourceParameters}
          />
        </Suspense>
      ),
    },
    [Technique.Httomo]: {
      "httomo-cor-sweep": (
        <LoaderProvider>
          <CorSweepParameterConfiguration
            setParameters={setTemplateParameters}
            visitDirpath={visitDirPath}
          />
          <ResourceForm
            resourceDisplayList={resourceDisplayList}
            setResourceParameters={setResourceParameters}
          />
        </LoaderProvider>
      ),
      "httomo-fbp-180": (
        <LoaderProvider>
          <Fbp180ParameterConfiguration
            setParameters={setTemplateParameters}
            setResourceParameters={setResourceParameters}
            visitDirpath={visitDirPath}
          />
          <ResourceForm
            resourceDisplayList={resourceDisplayList}
            setResourceParameters={setResourceParameters}
          />
        </LoaderProvider>
      ),
    },
    [Technique.Xanes]: {
      xanes: (
        <Suspense fallback={<p>Fetching workflow template...</p>}>
          <XanesAutoprocessingParameterConfiguration
            setParameters={setTemplateParameters}
          />
        </Suspense>
      ),
    },
    [Technique.Xrd]: {},
  };

  return TEMPLATE_TO_COMPONENT_MAPPING[technique][template];
};
