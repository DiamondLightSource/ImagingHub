import { useState } from "react";
import { Beamline, BEAMLINES_DEFAULT_TECHNIQUE, Technique } from "../../types";
import { Visit } from "@diamondlightsource/sci-react-ui";
import TechniqueSelector from "./TechniqueSelector";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import { ParameterConfiguration } from "../ParameterConfiguration/ParameterConfiguration";
import { InstrumentSession } from "../SessionSelector";
import { PROCESSINGVIEW_QUERY } from "../../graphql/ProcessingViewQuery";
import { useSuspenseQuery } from "@apollo/client/react";

const ProcessingView = ({
  visit,
  beamline,
  startTime,
  scanIds,
}: {
  visit: Visit;
  beamline: Beamline;
  startTime: InstrumentSession["startTime"];
  scanIds: number[];
}) => {
  const [technique, setTechnique] = useState<Technique>(
    BEAMLINES_DEFAULT_TECHNIQUE[beamline]
  );

  const { data, error } = useSuspenseQuery(PROCESSINGVIEW_QUERY);
  if (error) console.error(`Error: ${error.message}`);

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary id="technique" expandIcon={<ChevronDown />}>
          <Typography variant="h5">Technique</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TechniqueSelector
            beamline={beamline}
            technique={technique}
            setTechnique={setTechnique}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          id="parameter-configuration"
          expandIcon={<ChevronDown />}
        >
          <Typography variant="h5">Parameter Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ParameterConfiguration
            key={`param-${technique}`}
            technique={technique}
            visit={visit}
            beamline={beamline}
            scanIds={scanIds}
            startTime={startTime}
            templateList={data.workflowTemplates.nodes.filter((t) =>
              t.name.startsWith(technique.toLowerCase())
            )}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ProcessingView;
