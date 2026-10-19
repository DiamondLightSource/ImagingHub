import { ReactElement, Suspense } from "react";
import { Technique } from "../../../types";
import { MibParameterConfiguration } from "../mib/MibParameterConfiguration";
import PtypyI08ParameterConfiguration from "../ptypy/PtypyI08ParameterConfiguration";
import PtypyP99ParameterConfiguration from "../ptypy/PtypyP99ParameterConfiguration";
import { PtyrexParameterConfiguration } from "../ptyrex/PtyrexParameterConfiguration";
import { LoaderProvider } from "../../../../../tomography/src/contexts/LoaderContext";
import { CorSweepParameterConfiguration } from "../tomo/TomoParameterConfiguration";
import { Fbp180ParameterConfiguration } from "../tomo/Fbp180ParameterConfiguration";
import { XanesAutoprocessingParameterConfiguration } from "../xanes/XanesAutoprocessingParameterConfiguration";

type TemplateComponentMapping = {
  [technique in Technique]: {
    [template: string]: ReactElement;
  };
};

export const getParamConfigComponent = (
  technique: Technique,
  template: string,
  setTemplateParameters: (_: object) => void,
  setResourceParameters: (_: { nprocs: number; memory: string }) => void,
  visitDirPath: string
) => {
  const TEMPLATE_TO_COMPONENT_MAPPING: TemplateComponentMapping = {
    [Technique.Dpc]: {},
    [Technique.Nbed]: {},
    [Technique.Mib]: {
      "e02mib2x-auto": (
        <MibParameterConfiguration setParameters={setTemplateParameters} />
      ),
    },
    [Technique.Ptycho]: {},
    [Technique.Ptypy]: {
      "ptypy-i08-1-from-config": (
        <PtypyI08ParameterConfiguration
          setParameters={setTemplateParameters}
          setResourceParameters={setResourceParameters}
        />
      ),
      "ptypy-p99-from-config": (
        <PtypyP99ParameterConfiguration
          setParameters={setTemplateParameters}
          setResourceParameters={setResourceParameters}
        />
      ),
    },
    [Technique.Ptyrex]: {
      "ptyrex-submission": (
        <PtyrexParameterConfiguration
          setParameters={setTemplateParameters}
          visitDirpath={visitDirPath}
        />
      ),
    },
    [Technique.Tomo]: {
      "httomo-cor-sweep": (
        <LoaderProvider>
          <CorSweepParameterConfiguration
            setParameters={setTemplateParameters}
            visitDirpath={visitDirPath}
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
