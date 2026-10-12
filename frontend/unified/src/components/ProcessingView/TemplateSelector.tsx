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
import { Option } from "../../types";

const TemplateSelector = ({
  templateList,
  template,
  setTemplate,
}: {
  templateList: Option[];
  template: string | null;
  setTemplate: (_: string | null) => void;
}) => {
  const handleSelect = (event: SelectChangeEvent) => {
    if (event.target.value === "NONE") {
      setTemplate(null);
    } else {
      setTemplate(event.target.value);
    }
  };

  const desc = (function () {
    for (const option of templateList) {
      if (option.value === template) {
        return option.desc;
      }
    }
    return "";
  })();

  return (
    <FormControl>
      <InputLabel id="template-selector-label">Template</InputLabel>
      <Stack direction="row" spacing={1}>
        <Select
          labelId="template-selector-label"
          label="Template"
          size="small"
          value={template ?? "NONE"}
          onChange={handleSelect}
        >
          <MenuItem key="No Template" value="NONE">
            No template
          </MenuItem>
          {templateList.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {template && (
          <Tooltip title={desc}>
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
