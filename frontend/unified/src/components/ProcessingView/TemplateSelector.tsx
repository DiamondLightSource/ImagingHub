import {
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  MenuItem,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Templates } from "../../types";

const TemplateSelector = ({
  templateList,
  template,
  setTemplate,
}: {
  templateList: Templates;
  template: string;
  setTemplate: (_: string) => void;
}) => {
  const handleSelect = (event: SelectChangeEvent) => {
    setTemplate(event.target.value);
  };

  const desc = (function () {
    for (const option of templateList) {
      if (option.name === template) {
        return option.description;
      }
    }
    return "No description available";
  })();

  return (
    <FormControl>
      <InputLabel id="template-selector-label">Template</InputLabel>
      <Stack direction="row" spacing={1}>
        <Select
          labelId="template-selector-label"
          label="Template"
          size="small"
          value={template}
          onChange={handleSelect}
        >
          {templateList.map((opt) => (
            <MenuItem key={opt.name} value={opt.name}>
              {opt.name}
            </MenuItem>
          ))}
        </Select>
        {template && (
          <Tooltip title={desc ?? "No description available"}>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </FormControl>
  );
};

export default TemplateSelector;
