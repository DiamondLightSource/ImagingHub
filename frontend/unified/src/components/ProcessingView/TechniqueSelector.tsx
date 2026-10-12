import React, { useState } from "react";
import { Beamline, BEAMLINE_TECHNIQUES_SUBSET, Technique } from "../../types";
import {
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const TechniqueSelector = ({
  beamline,
  technique,
  setTechnique,
}: {
  beamline: Beamline;
  technique: Technique;
  setTechnique: (_: Technique) => void;
}) => {
  const [showAllTechniques, setShowAllTechniques] = useState<boolean>(false);
  const beamineTechniques = BEAMLINE_TECHNIQUES_SUBSET[beamline];
  const techniqueList = showAllTechniques
    ? Object.values(Technique)
    : beamineTechniques;

  const handleChangeShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllTechniques(event.target.checked);
    if (showAllTechniques) {
      setTechnique(beamineTechniques[0]);
    }
  };

  const handleChangeTechnique = (
    _: React.MouseEvent<HTMLElement>,
    newTechnique: Technique
  ) => {
    setTechnique(newTechnique);
  };
  return (
    <Stack direction="column" spacing={1}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={showAllTechniques}
              onChange={handleChangeShowAll}
            />
          }
          label="Show all"
        />
        <ToggleButtonGroup
          exclusive
          value={technique}
          onChange={handleChangeTechnique}
          aria-label="technique-selector"
        >
          {techniqueList.map((t) => (
            <ToggleButton key={t} value={t}>
              {t}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormGroup>
    </Stack>
  );
};

export default TechniqueSelector;
