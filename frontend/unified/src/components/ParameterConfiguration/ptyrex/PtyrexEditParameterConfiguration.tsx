import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Slider,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TemplateComponentProps } from "../../../types";

export const PtyrexEditParameterConfiguration = ({
  setParameters,
  visitDirpath,
}: TemplateComponentProps) => {
  const [projectionNumber, setProjectionNumber] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [iterations, setIterations] = useState<number>(50);
  const [alpha, setAlpha] = useState<number>(0.95);
  const [beta, setBeta] = useState<number>(0.95);
  const [probeModes, setProbeModes] = useState<number>(1);
  const [opticX, setOpticX] = useState<number>(-1);
  const [opticY, setOpticY] = useState<number>(-1);
  const [upsampling, setUpsampling] = useState<number>(1);
  const [bitdepth, setBitdepth] = useState<number>(32);
  const [probePath, setProbePath] = useState<string>("");
  const [loadProbe, setLoadProbe] = useState<boolean>(false);
  const [outpath, setOutpath] = useState<string>("");
  const [advanceMode, setAdvanceMode] = useState<boolean>(false);

  useEffect(() => {
    setParameters({
      proj_number: projectionNumber,
      prefix: prefix,
      iterations: iterations,
      objectupdate: alpha,
      probeupdate: beta,
      modes: probeModes,
      opticx: opticX,
      opticy: opticY,
      upsampling: upsampling,
      bitdepth: bitdepth,
      probepath: probePath,
      probeloadflag: loadProbe ? 1 : 0,
      outdir: outpath,
    });
  }, [
    setParameters,
    visitDirpath,
    projectionNumber,
    prefix,
    iterations,
    alpha,
    beta,
    probeModes,
    opticX,
    opticY,
    upsampling,
    bitdepth,
    probePath,
    loadProbe ? 1 : 0,
    outpath,
  ]);

  const displayVisitDir = {
    input: {
      startAdornment: (
        <InputAdornment position="start" sx={{ mr: 0 }}>
          {visitDirpath + "processing/"}
        </InputAdornment>
      ),
    },
  };

  function valueText(value: number) {
    return `${value}`;
  }

  const handleSliderAlpha = (event: Event, newValue: number) => {
    setAlpha(newValue);
  };
  const handleSliderBeta = (event: Event, newValue: number) => {
    setBeta(newValue);
  };
  const handleSliderModes = (event: Event, newValue: number) => {
    setProbeModes(newValue);
  };
  const handleSliderUpsample = (event: Event, newValue: number) => {
    setUpsampling(newValue);
  };
  const handleSliderBitdepth = (event: Event, newValue: number) => {
    setBitdepth(newValue);
  };

  const handleAdvanceMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvanceMode(event.target.checked);
  };
  const handleCheckBoxProbe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoadProbe(event.target.checked);
  };

  const updateMarks = [
    { value: 0, label: 0 },
    { value: 0.5, label: 0.5 },
    { value: 1, label: 1 },
  ];
  const probeMarks = [
    { value: 1, label: 1 },
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 15, label: 15 },
    { value: 20, label: 20 },
  ];
  const upsamplingMarks = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 4, label: 4 },
    { value: 8, label: 8 },
  ];
  const Bitdepth = [
    { value: 8, label: 8 },
    { value: 16, label: 16 },
    { value: 32, label: 32 },
  ];

  const AdvancedModeSettings = (
    <Stack direction="column" spacing={1}>
      <TextField
        size="small"
        label="Set the optical Axis (X)"
        value={opticX}
        onChange={(e) => setOpticX(Number(e.target.value))}
        type="number"
      />
      <TextField
        size="small"
        label="Set the optical Axis (Y)"
        value={opticY}
        onChange={(e) => setOpticY(Number(e.target.value))}
        type="number"
      />
      <Box>
        <Typography>
          Degree of upsampling applied to the diffraction patterns
        </Typography>
        <Slider
          aria-label="Upsampling"
          defaultValue={1}
          getAriaValueText={valueText}
          valueLabelDisplay="auto"
          step={null}
          marks={upsamplingMarks}
          onChange={handleSliderUpsample}
          max={8}
          min={1}
        />
        <Typography>
          Bit depth used to store the diffraction patterns once loaded
        </Typography>
        <Slider
          aria-label="Upsampling"
          defaultValue={16}
          getAriaValueText={valueText}
          valueLabelDisplay="auto"
          step={null}
          marks={Bitdepth}
          onChange={handleSliderBitdepth}
          max={32}
          min={8}
        />
      </Box>
      <Stack direction="row" spacing={1} alignItems="centre">
        <Typography>Load a Probe from a Previous Reconstruction</Typography>
        <Checkbox checked={loadProbe} onChange={handleCheckBoxProbe} />
      </Stack>
      <TextField
        size="small"
        label="Path to previous reconstruction, used to initialise the probe"
        value={probePath}
        onChange={(e) => setProbePath(e.target.value)}
      />
    </Stack>
  );

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Stack direction="column" spacing={1}>
          <TextField
            size="small"
            label="Projection Number"
            value={projectionNumber}
            onChange={(e) => setProjectionNumber(e.target.value)}
          />
          <TextField
            size="small"
            label="Reconstruction output prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />
          <TextField
            size="small"
            label="Output path for the reconstruction"
            value={outpath}
            onChange={(e) => setOutpath(e.target.value)}
            slotProps={displayVisitDir}
          />
          <TextField
            size="small"
            label="Number of iterations the reconstruction will run for (integers only)"
            value={iterations}
            onChange={(e) => setIterations(Number(e.target.value))}
            type="number"
          />
          <Box>
            <Typography>Object update rate (alpha)</Typography>
            <Slider
              aria-label="Object update alpha"
              defaultValue={0.95}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              shiftStep={0.025}
              step={0.025}
              marks={updateMarks}
              min={0}
              max={1}
              onChange={handleSliderAlpha}
            />
            <Typography>Probe update rate (Beta)</Typography>
            <Slider
              aria-label="Object update alpha"
              defaultValue={0.95}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              shiftStep={0.025}
              step={0.025}
              marks={updateMarks}
              min={0}
              max={1}
              onChange={handleSliderBeta}
            />
            <Typography>Number of probe modes</Typography>
            <Slider
              aria-label="probe modes"
              defaultValue={1}
              getAriaValueText={valueText}
              valueLabelDisplay="auto"
              shiftStep={1}
              step={1}
              marks={probeMarks}
              min={1}
              max={20}
              onChange={handleSliderModes}
            />
          </Box>
          <FormControlLabel
            control={
              <Switch checked={advanceMode} onChange={handleAdvanceMode} />
            }
            label="Advanced Settings"
          />
          {advanceMode && AdvancedModeSettings}
        </Stack>
      </Card>
    </>
  );
};
