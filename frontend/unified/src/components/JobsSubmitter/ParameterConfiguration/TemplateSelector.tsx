import {
  FormControl,
  IconButton,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
} from "@mui/material";
import { Option } from "../../../types";
import { InfoIcon } from "lucide-react";

const TemplateSelector = ({
  templateList,
  template,
  setTemplate,
}: {
  templateList: Option[];
  template: string;
  setTemplate: (newTemplate: string) => void;
}) => {
  const selected = templateList.find((t) => t.value === template);
  if (!template) {
    setTemplate(templateList[0].value);
  }

  const handleChange = (event: SelectChangeEvent) => {
    setTemplate(event.target.value);
  };

  return (
    <FormControl>
      <InputLabel shrink>Template</InputLabel>
      <Stack direction="row">
        <Select
          native
          label="Template"
          size="small"
          value={template ?? templateList[0].value}
          onChange={handleChange}
        >
          {templateList.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <Tooltip title={selected?.desc ?? ""}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </FormControl>
  );
};

export default TemplateSelector;
