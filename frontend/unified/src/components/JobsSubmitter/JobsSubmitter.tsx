import { Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ScanSelector } from "./ScanSelector";
import TechniqueSelector from "./TechniqueSelector";
import { Beamline, BEAMLINE_TECHNIQUES_SUBSET, Technique } from "../../types";
import { Visit } from "@diamondlightsource/sci-react-ui";
import ParameterConfiguration from "./ParameterConfiguration/ParameterConfiguration";

const JobsSubmitter = ({
  session,
  verticalSpacing = 2,
}: {
  session: InstrumentSession;
  verticalSpacing?: number;
}) => {
  const filteredTechniques = BEAMLINE_TECHNIQUES_SUBSET[beamline];
  const [selectedScanIds, setSelectedScanIds] = useState<number[]>([]);
  const [technique, setTechnique] = useState<Technique>(filteredTechniques[0]);

  return (
    <Stack direction="column" spacing={verticalSpacing}>
      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Scan</Typography>
      <ScanSelector scanIds={selectedScanIds} setScanIds={setSelectedScanIds} />

      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Technique</Typography>
      <TechniqueSelector
        techniqueList={filteredTechniques}
        technique={technique}
        setTechnique={setTechnique}
      />

      <Divider sx={{ width: "100%" }} />
      <Typography variant="h5">Parameter Configuration</Typography>
      <ParameterConfiguration technique={technique} visit={visit} />
    </Stack>
  );
};

export default JobsSubmitter;
