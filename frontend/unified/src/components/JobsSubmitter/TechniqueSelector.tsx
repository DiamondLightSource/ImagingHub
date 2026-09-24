import {
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState } from "react";
import { Technique } from "../../types";

const TechniqueSelector = ({
  techniqueList,
  technique,
  setTechnique,
}: {
  techniqueList: Technique[];
  technique: Technique;
  setTechnique: (newTechnique: Technique) => void;
}) => {
  const [showAllTechniques, setShowAllTechniques] = useState<boolean>(false);

  const techniques = showAllTechniques
    ? Object.values(Technique)
    : techniqueList;

  const handleChangeShowAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAllTechniques(event.target.checked);
    if (showAllTechniques) {
      setTechnique(techniqueList[0]);
    }
  };

  const handleChangeTechnique = (
    _event: React.MouseEvent<HTMLElement>,
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
          {techniques.map((t) => (
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
