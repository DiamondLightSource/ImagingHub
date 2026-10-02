import { useState } from "react";
import { ChevronDown, Info, Plus, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSuspenseQuery } from "@apollo/client/react";
import { TemplateComponentProps } from "../../types";
import { GET_WORKFLOW_TEMPLATE } from "../../../../tomography/src/components/workflows/Submission";

export const XanesAutoprocessingParameterConfiguration =
  ({}: TemplateComponentProps) => {
    const { error, data } = useSuspenseQuery(GET_WORKFLOW_TEMPLATE, {
      variables: {
        name: "xanes",
      },
    });
    const [normalise, setNormalise] = useState<boolean>(true);
    const [edgeElement, setEdgeElement] = useState<string>("");
    const [edgeTransition, setEdgeTransition] = useState<string>("");
    const [elementToAlign, setElementToAlign] = useState<string>("");
    const [transitionToAlign, setTransitionToAlign] = useState<string>("");
    const [outputFolder, setOutputFolder] = useState<string>("");

    const elements = data.workflowTemplate.arguments["$defs"].elements.enum;
    const edgeTransitions =
      data.workflowTemplate.arguments.properties.edgeTransition.enum;
    const transitionsToAlign =
      data.workflowTemplate.arguments.properties.transitionToAlign.enum;
    const alignmentMethods =
      data.workflowTemplate.arguments.properties.method.enum;
    const [alignmentMethod, setAlignmentMethod] = useState<string>(
      alignmentMethods[0]
    );

    if (error) return <p>Error: {error.message}</p>;

    return (
      <>
        <ScanList />
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select
                label="Method"
                size="small"
                onChange={(_, value) =>
                  setAlignmentMethod(value.props.children)
                }
                value={alignmentMethod}
                children={alignmentMethods.map((method: string) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              />
            </FormControl>
            <FormGroup>
              <FormControlLabel
                label="Normalise"
                control={
                  <Checkbox
                    checked={normalise}
                    onChange={(e) => setNormalise(e.target.checked)}
                  />
                }
              />
            </FormGroup>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Edge Element</InputLabel>
              <Select
                label="Edge Element"
                size="small"
                onChange={(_, value) => setEdgeElement(value.props.children)}
                value={edgeElement}
                required={true}
                error={edgeElement === ""}
                aria-describedby="edge-element-select-helper-text"
                children={elements.map((element: string) => (
                  <MenuItem key={element} value={element}>
                    {element}
                  </MenuItem>
                ))}
              />
              {edgeElement === "" && (
                <FormHelperText
                  id="edge-element-select-helper-text"
                  sx={{ color: "error.main" }}
                >
                  is a required property
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Edge Transition</InputLabel>
              <Select
                label="Edge Transition"
                aria-describedby="edge-transition-select-helper-text"
                size="small"
                onChange={(_, value) => setEdgeTransition(value.props.children)}
                value={edgeTransition}
                required={true}
                error={edgeTransition === ""}
                children={edgeTransitions.map((element: string) => (
                  <MenuItem key={element} value={element}>
                    {element}
                  </MenuItem>
                ))}
              />
              {edgeTransition === "" && (
                <FormHelperText
                  id="edge-transition-select-helper-text"
                  sx={{ color: "error.main" }}
                >
                  is a required property
                </FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Element To Align</InputLabel>
              <Select
                label="Element To Align"
                size="small"
                onChange={(_, value) => setElementToAlign(value.props.children)}
                value={elementToAlign}
                children={elements.map((element: string) => (
                  <MenuItem key={element} value={element}>
                    {element}
                  </MenuItem>
                ))}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Transition To Align</InputLabel>
              <Select
                label="Transition To Align"
                size="small"
                onChange={(_, value) =>
                  setTransitionToAlign(value.props.children)
                }
                value={transitionToAlign}
                children={transitionsToAlign.map((element: string) => (
                  <MenuItem key={element} value={element}>
                    {element}
                  </MenuItem>
                ))}
              />
            </FormControl>
          </Stack>
          <TextField
            variant="outlined"
            size="small"
            label="Output Folder"
            value={outputFolder}
            onChange={(e) => setOutputFolder(e.currentTarget.value)}
            required={true}
            error={outputFolder === ""}
            helperText={outputFolder !== "" ? "" : "is a required property"}
          ></TextField>
        </Stack>
      </>
    );
  };

type ScanEntryData = {
  start: number;
  end: number;
  excluded: string;
};

const ScanList = () => {
  const [scans, setScans] = useState<ScanEntryData[]>([
    { start: 0, end: 0, excluded: "" },
  ]);

  const updateScanEntryDataStart = (
    idx: number,
    data: ScanEntryData,
    start: number
  ) => {
    const zeroBasedIdx = idx - 1;
    const newData = { ...data, start: start };
    const newScanList = [
      ...scans.slice(0, zeroBasedIdx),
      newData,
      ...scans.slice(zeroBasedIdx, scans.length - 1),
    ];
    setScans(newScanList);
  };

  const updateScanEntryDataEnd = (
    idx: number,
    data: ScanEntryData,
    end: number
  ) => {
    const zeroBasedIdx = idx - 1;
    const newData = { ...data, end: end };
    const newScanList = [
      ...scans.slice(0, zeroBasedIdx),
      newData,
      ...scans.slice(zeroBasedIdx, scans.length - 1),
    ];
    setScans(newScanList);
  };

  const updateScanEntryDataExcluded = (
    idx: number,
    data: ScanEntryData,
    excluded: string
  ) => {
    const zeroBasedIdx = idx - 1;
    const newData = { ...data, excluded: excluded };
    const newScanList = [
      ...scans.slice(0, zeroBasedIdx),
      newData,
      ...scans.slice(zeroBasedIdx, scans.length - 1),
    ];
    setScans(newScanList);
  };

  return (
    <Box sx={{ paddingBottom: 2 }}>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography>
          <strong>Scans</strong>
        </Typography>
        <IconButton
          onClick={() => {
            setScans([...scans, { start: 0, end: 0, excluded: "" }]);
          }}
        >
          <Plus />
        </IconButton>
      </Stack>
      {scans.map((data, idx) => {
        return (
          <ScanEntry
            index={idx + 1}
            data={data}
            updateStart={updateScanEntryDataStart}
            updateEnd={updateScanEntryDataEnd}
            updateExcluded={updateScanEntryDataExcluded}
          />
        );
      })}
    </Box>
  );
};

type ScanEntryProps = {
  index: number;
  data: ScanEntryData;
  updateStart: (idx: number, data: ScanEntryData, start: number) => void;
  updateEnd: (idx: number, data: ScanEntryData, end: number) => void;
  updateExcluded: (idx: number, data: ScanEntryData, excluded: string) => void;
};

const ScanEntry: React.FC<ScanEntryProps> = ({
  index,
  data,
  updateStart,
  updateEnd,
  updateExcluded,
}: ScanEntryProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Avatar>{index}</Avatar>
        <TextField sx={{ visibility: "hidden" }} size="small" fullWidth />
        <Tooltip title="Delete">
          <Box
            sx={{
              paddingRight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                console.log("clicked trash icon");
              }}
            >
              <Trash2 />
            </IconButton>
          </Box>
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            variant="outlined"
            type="number"
            label="Start"
            value={data.start}
            onChange={(e) =>
              updateStart(index, data, Number(e.currentTarget.value))
            }
          >
            Start
          </TextField>
          <TextField
            size="small"
            variant="outlined"
            type="number"
            label="End"
            value={data.end}
            onChange={(e) =>
              updateEnd(index, data, Number(e.currentTarget.value))
            }
          >
            End
          </TextField>
          <TextField
            size="small"
            variant="outlined"
            type="text"
            label="Excluded"
            value={data.excluded}
            onChange={(e) => updateExcluded(index, data, e.currentTarget.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <Tooltip title="Excluded input info">
                    <InputAdornment position="end">
                      <Info />
                    </InputAdornment>
                  </Tooltip>
                ),
              },
            }}
          >
            Excluded
          </TextField>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
