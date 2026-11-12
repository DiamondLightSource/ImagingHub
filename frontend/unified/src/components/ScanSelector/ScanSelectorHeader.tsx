import {
  IconButton,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Menu,
} from "@mui/material";
import { ChevronDown, X } from "lucide-react";
import {
  SORT_OPTIONS,
  SortDirection,
  type RowSelectionState,
} from "./ScanSelectorTable";
import { useEffect, useRef, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";
import { ScanDateRange } from "../../types";

dayjs.extend(utc);

const ALL_DATES_TEXT = "All dates";

function dateToDayjs(date: Date | undefined | null): Dayjs {
  return dayjs(date);
}

function formatDate(date: Date | undefined | null) {
  if (date) {
    return date.toLocaleString(undefined, { timeZone: "UTC" });
  }
  return "No date";
}

type ScanSelectorHeaderProps = {
  rowSelection: RowSelectionState;
  totalCount: number;
  sortDirection: SortDirection;
  setSortDirection: (v: SortDirection) => void;
  searchString: string | null;
  setSearchString: (v: string | null) => void;
  startDate: Date | null;
  endDate: Date | null;
  dateRangeFilter: ScanDateRange;
  setDateRangeFilter: (v: ScanDateRange) => void;
};
export const ScanSelectorHeader = ({
  rowSelection,
  totalCount,
  setSortDirection,
  sortDirection,
  setSearchString,
  searchString,
  startDate,
  endDate,
  dateRangeFilter,
  setDateRangeFilter,
}: ScanSelectorHeaderProps) => {
  const summaryRef = useRef<HTMLSpanElement>(null);

  const selected = Object.entries(rowSelection).filter(
    ([_, value]) => value === true
  );

  const [internalSearchString, setInternalSearchString] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dateMenuOpen = Boolean(anchorEl);
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | null | undefined
  >(null);
  const [selectedEndDate, setSelectedEndDate] = useState<
    Date | null | undefined
  >(null);
  const [dateRangeText, setDateRangeText] = useState(ALL_DATES_TEXT);

  useEffect(() => {
    if (!selectedStartDate || !selectedEndDate) {
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
    }
  }, [startDate, endDate, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    setInternalSearchString(searchString ?? "");
  }, [searchString]);

  const clearDateFilter = () => {
    setDateRangeFilter({});
    setDateRangeText(ALL_DATES_TEXT);
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  return (
    <Stack>
      <Stack
        spacing={1}
        direction="row"
        sx={{ px: 1, paddingTop: 1, paddingBottom: 0.5, flexShrink: 0 }}
      >
        <TextField
          size="small"
          type="search"
          placeholder="Scan number"
          fullWidth
          value={internalSearchString}
          onChange={(e) => setInternalSearchString(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {internalSearchString !== "" && (
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setInternalSearchString("");
                        setSearchString(null);
                      }}
                    >
                      <X />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          color="inherit"
          variant="outlined"
          sx={{ flexShrink: 0 }}
          onClick={() => {
            setSearchString(
              internalSearchString === "" ? null : internalSearchString
            );
          }}
        >
          Search
        </Button>
      </Stack>

      <Stack sx={{ px: 1, py: 0.5, flexShrink: 0 }}>
        <div>
          <TextField
            size="small"
            value={dateRangeText}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-controls="date-menu"
            aria-haspopup="true"
            fullWidth
            disabled={startDate == null || endDate == null}
            slotProps={{
              input: {
                endAdornment: (
                  <>
                    {dateRangeFilter?.start && dateRangeFilter?.end && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            clearDateFilter();
                          }}
                        >
                          <X />
                        </IconButton>
                      </InputAdornment>
                    )}
                    <InputAdornment position="end">
                      <ChevronDown />
                    </InputAdornment>
                  </>
                ),
              },
            }}
          />
          <Menu
            id="date-menu"
            open={dateMenuOpen}
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}
            slotProps={{
              list: {
                sx: {
                  p: 0,
                },
              },
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="en-gb"
            >
              <Stack spacing={1} sx={{ p: 2 }}>
                <Stack direction="row" spacing={1}>
                  <Stack>
                    <Typography variant="body2">From:</Typography>
                    <DateTimePicker
                      value={dateToDayjs(selectedStartDate)}
                      onChange={(v) => setSelectedStartDate(v?.utc().toDate())}
                      slotProps={{
                        textField: {
                          size: "small",
                        },
                      }}
                      timezone="UTC"
                      minDateTime={dateToDayjs(startDate)}
                      maxDateTime={dateToDayjs(selectedEndDate)}
                    />
                  </Stack>
                  <Stack>
                    <Typography variant="body2">To:</Typography>
                    <DateTimePicker
                      value={dateToDayjs(selectedEndDate)}
                      onChange={(v) => setSelectedEndDate(v?.utc().toDate())}
                      slotProps={{
                        textField: {
                          size: "small",
                        },
                      }}
                      timezone="UTC"
                      minDateTime={dateToDayjs(selectedStartDate)}
                      maxDateTime={dateToDayjs(endDate)}
                    />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setAnchorEl(null);
                      setDateRangeFilter({
                        start: selectedStartDate,
                        end: selectedEndDate,
                      });
                      setDateRangeText(
                        `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
                      );
                    }}
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      clearDateFilter();
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </LocalizationProvider>
          </Menu>
        </div>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{
          px: 2,
          py: 0.5,
          flexShrink: 0,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="meta"
          role="status"
          tabIndex={-1}
          ref={summaryRef}
          sx={{ flex: 1, minWidth: 0, color: "text.secondary" }}
        >
          {`${selected.length} of ${totalCount}`} selected
        </Typography>
        <TextField
          select
          size="small"
          variant="standard"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as SortDirection)}
          sx={{
            flexShrink: 0,
            "& .MuiSelect-select": { py: 0.5, typography: "body2" },
          }}
          slotProps={{
            htmlInput: { "aria-label": "Sort scans" },
            input: {
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ mr: 1 }}>
                  <Typography variant="meta" sx={{ color: "text.secondary" }}>
                    Sort:
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value} dense>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
};
