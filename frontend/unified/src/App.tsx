import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { SessionSelector } from "./components/SessionSelector";
import { ScanSelector } from "./components/ScanSelector";

import { useState } from "react";

import { initialData } from "./data/form";
import { templateOptions } from "./data/templates";
import { WorkflowForm } from "./components/WorkflowForm";
import { WorkflowFormData } from "./types/workflowFields";
import { Beamline, Technique } from "./types";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

const BEAMLINE_TECHNIQUES_SUBSET = {
  [Beamline.I12]: [Technique.Tomo],
  [Beamline["I13-1"]]: [
    Technique.Dpc,
    Technique.Ptycho,
    Technique.Tomo,
    Technique.Xanes,
    Technique.Xrd,
  ],
  [Beamline.I14]: [Technique.Dpc, Technique.Xanes, Technique.Xrd],
  [Beamline.Epsic]: [Technique.Dpc, Technique.Nbed, Technique.Ptycho],
};

const BEAMLINES_DEFAULT_TECHNIQUE = {
  [Beamline.Epsic]: Technique.Ptycho,
  [Beamline.I12]: Technique.Tomo,
  [Beamline["I13-1"]]: Technique.Ptycho,
  [Beamline.I14]: Technique.Dpc,
};

const filterTemplates = (technique: Technique) => {
  return templateOptions.filter((option) =>
    option.value.includes(technique.toLowerCase())
  );
};

export const App: React.FC = () => {
  //adding common states of beamlines, Techique, workflow
  const [showAllTechniques, setShowAllTechniques] = useState(false);
  const [currentBeamline] = useState<Beamline>(Beamline.I14);
  const [technique, setTechnique] = useState<Technique>(
    BEAMLINES_DEFAULT_TECHNIQUE[currentBeamline]
  );
  const [template, setTemplate] = useState<string>(() => {
    const filteredTemplates = filterTemplates(
      Technique[technique as keyof typeof Technique]
    );
    return filteredTemplates[0].value;
  });

  /**
   * This state is used to keep track of the app data which contains information such as the beamline
   * The current template, and the visit this likely should be broken up into different states
   * for example:
   * data: {"visit":"mg23967-1","template":"dpc-batch","outpath":"/dls/i14/data/","Beamline":"I14","technique":"dpc"}
   * this is then access by the WorkflowForm component to render its componenets
   */
  const [data] = useState<WorkflowFormData>(initialData);

  const handleChangeTechnique = (
    /**
     * This function handles the clicking of the toggle button which choose the technique and therefore determines which
     * workflows are filtered and shown the template drop down menu this then alteres the data state with new techniques
     * and templates
     */
    _event: React.MouseEvent<HTMLElement>,
    technique: string | null
  ) => {
    if (!technique) return;
    const filteredTemplates = filterTemplates(
      Technique[technique as keyof typeof Technique]
    );
    setTechnique(Technique[technique as keyof typeof Technique]);
    setTemplate(filteredTemplates[0].value);
  };

  const filterTechniques = () => {
    if (showAllTechniques) {
      return Object.values(Technique);
    }

    return BEAMLINE_TECHNIQUES_SUBSET[currentBeamline];
  };

  return (
    <>
      <Grid container spacing={HORIZONTAL_SPACING} columns={2}>
        <Stack spacing={VERTICAL_SPACING}>
          <Typography variant="h5">Session</Typography>
          <SessionSelector />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Scan</Typography>
          <ScanSelector />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Technique</Typography>
          <WorkflowForm
            data={data}
            handleChangeTechnique={handleChangeTechnique}
            showAllTechniques={showAllTechniques}
            handleShowAllTechniques={(
              e: React.ChangeEvent<HTMLInputElement>
            ) => {
              setShowAllTechniques(e.target.checked);
              const isSelectedTechniqueInSubset =
                BEAMLINE_TECHNIQUES_SUBSET[currentBeamline].includes(technique);
              if (!e.target.checked && !isSelectedTechniqueInSubset) {
                const newTechnique =
                  BEAMLINES_DEFAULT_TECHNIQUE[currentBeamline];
                setTechnique(newTechnique);
                const filteredTemplates = filterTemplates(
                  Technique[newTechnique as keyof typeof Technique]
                );
                setTemplate(filteredTemplates[0].value);
              }
            }}
            filteredTechniques={filterTechniques()}
            templateOptions={filterTemplates(technique)}
            technique={technique}
            template={template}
            setTemplate={setTemplate}
          />

          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Parameter Configuration</Typography>

          <PlaceholderComponent
            placeholderText="Parameter configuration component placeholder"
            height={200}
            width={500}
          />
        </Stack>
        <Stack spacing={VERTICAL_SPACING}>
          <Typography variant="h5">Plot</Typography>

          <PlaceholderComponent
            placeholderText="Plot component placeholder"
            height={200}
            width={500}
          />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Log</Typography>

          <PlaceholderComponent
            placeholderText="Log component placeholder"
            height={200}
            width={500}
          />
          <Divider sx={{ width: "100%" }} />
          <Typography variant="h5">Jobs</Typography>
          <PlaceholderComponent
            placeholderText="Jobs component placeholder"
            height={200}
            width={500}
          />
        </Stack>
      </Grid>
    </>
  );
};

type PlaceholderComponentProps = {
  placeholderText: string;
  height: number;
  width: number;
};

const PlaceholderComponent = ({
  placeholderText,
  height,
  width,
}: PlaceholderComponentProps) => {
  return (
    <Box
      sx={{ width: width, height: height, border: "1px dashed grey" }}
      alignContent="center"
      justifyItems="center"
    >
      <p>{placeholderText}</p>
    </Box>
  );
};
