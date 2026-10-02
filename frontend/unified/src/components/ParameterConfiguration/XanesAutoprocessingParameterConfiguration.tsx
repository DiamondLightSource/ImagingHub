import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
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

const ScanList = () => {
  return (
    <Box sx={{ paddingBottom: 2 }}>
      <Typography>
        <strong>Scans</strong>
      </Typography>
      <ScanEntry index={1} />
    </Box>
  );
};

type ScanEntryProps = {
  index: number;
};

const ScanEntry: React.FC<ScanEntryProps> = ({ index }: ScanEntryProps) => {
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
            <IconButton>
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("clicked trash icon");
                }}
              />
            </IconButton>
          </Box>
        </Tooltip>
      </AccordionSummary>
      <AccordionDetails>Content</AccordionDetails>
    </Accordion>
  );
};
