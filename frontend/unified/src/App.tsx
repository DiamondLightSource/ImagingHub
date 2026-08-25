import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { SessionSelector } from "./components/SessionSelector";
import { ScanSelector } from "./components/ScanSelector";

import { useState } from "react";

import { initialData } from "./data/form";
import { templateOptions } from "./data/templates";
import {
  WorkflowForm,
  techniques,
  ToggleGroup,
} from "./components/WorkflowForm";
import { Option, WorkflowFormData } from "./types/workflowFields";

const VERTICAL_SPACING = 2;
const HORIZONTAL_SPACING = 2;

const BeamlineTechniquesArray = {
  I12: ["tomography"],
  "I13-1": ["dpc", "xanes", "xrd", "Ptycho", "tomography"],
  I14: ["dpc", "xanes", "xrd"],
  ePSIC: ["dpc", "NBED", "ptycho"],
  all: ["dpc", "xanes", "xrd", "ptycho", "nbed", "tomography"],
};

export const App: React.FC = () => {
  //adding common states of beamlines, Techique, workflow
  const [currentShowAllSwitchState, setShowAllSwitchState] = useState(false);
  const [currentBeamline, setBeamline] = useState<string | null>(
    initialData.beamline
  );
  const [technique, setTechnique] = useState<string>(
    techniques.find(templateCheck) ?? techniques[0]
  );
  const [template, setTemplate] = useState<string>(initialData.template);

  const handleShowAllSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    /**
     * This switch handling makes use of the BeamlineTechniquesArray const to chose between the
     * techniques specific to a Beamline and all techniques. it is assumed that a prevoius
     * component will provide the beamline as a state. But currently using a hard coded inital data.
     */
    setShowAllSwitchState(event.target.checked);
    if (event.target.checked) {
      setBeamline("all");
    } else {
      setBeamline(initialData.beamline);
    }
  };

  function templateCheck(technique: string): boolean {
    /**
     * Is used during initalisation in this case to set the choosen technquie to dpc.
     * the technquie is obtained from imported inital data which should be replace in the final version.
     */
    return initialData.template.includes(technique);
  }

  /**
   * This state is used to keep track of the app data which contains information such as the beamline
   * The current template, and the visit this likely should be broken up into different states
   * for example:
   * data: {"visit":"mg23967-1","template":"dpc-batch","outpath":"/dls/i14/data/","Beamline":"I14","technique":"dpc"}
   * this is then access by the WorkflowForm component to render its componenets
   */
  const [data] = useState<WorkflowFormData>(initialData);

  const handleToggleChange = (
    /**
     * This function handles the clicking of the toggle button which choose the technique and therefore determines which
     * workflows are filtered and shown the template drop down menu this then alteres the data state with new techniques
     * and templates
     */
    _event: React.MouseEvent<HTMLElement>,
    next: ToggleGroup | null
  ) => {
    if (!next) return;
    const filteredTemplates = getFilteredTemplates(next);
    setTechnique(next);
    setTemplate(filteredTemplates[0].value);
  };

  const getFilteredTemplates = (toggle: ToggleGroup): Option[] => {
    /**
     * Function which filters the imported list of templates from templateOptions (i.e. /frontend/unified/src/data/templates)
     * it does this by checking where toggle which in this case is one of the elements of BeamlineTechniquesArray
     * matches a templates value and then only shows those templates.
     */
    return (templateOptions ?? []).filter((o) => o.value.includes(toggle));
  };

  const filteredTemplateOptions: Option[] = getFilteredTemplates(
    /**
     * provides an indexing method of data to retrieve the choosen technique to the WorkflowForm component
     */
    technique
  );

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
            handleToggleChange={handleToggleChange}
            currentShowAllSwitchState={currentShowAllSwitchState}
            handleShowAllSwitch={handleShowAllSwitch}
            filteredTechniques={BeamlineTechniquesArray[currentBeamline]}
            templateOptions={filteredTemplateOptions}
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
