import {
  Box,
  Button,
  Chip,
  Drawer,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { Filter } from "lucide-react";
import { ScanDateRange } from "../../types";
import { useEffect, useState } from "react";

const HOURS_TO_MS = 60 * 60 * 1000;

type ScanDateFilterProps = {
  sessionRef: string;
  sessionDateRange: ScanDateRange;
  scanDateFilter: ScanDateRange;
  setScanDateFilter: (v: ScanDateRange) => void;
};
export const ScanDateFilter = ({
  sessionDateRange,
  scanDateFilter,
  setScanDateFilter,
}: ScanDateFilterProps) => {
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [timeRange, setTimeRange] = useState<ScanDateRange>({});

  const SIDEBAR_WIDTH = 300;

  // console.log("sessionDateRange", sessionDateRange);
  console.log("timeRange", timeRange);

  const disabled = !sessionDateRange.start || !sessionDateRange.end;

  const rangeStartStr =
    scanDateFilter?.start && scanDateFilter?.end
      ? `${scanDateFilter.start.toLocaleDateString(undefined, {
          timeZone: "UTC",
        })} ${scanDateFilter.start.toLocaleTimeString(undefined, {
          timeZone: "UTC",
        })} to \n ${scanDateFilter.end.toLocaleDateString(undefined, {
          timeZone: "UTC",
        })} ${scanDateFilter.end.toLocaleTimeString(undefined, {
          timeZone: "UTC",
        })}`
      : null;

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="left"
        open={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
          },
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Stack sx={{ p: 2 }}>
          <Typography variant="h6">Scan start time</Typography>
          <Box sx={{ p: 5, paddingTop: 6 }}>
            <DateTimeFilterSlider
              sessionDateRange={sessionDateRange}
              timeRange={scanDateFilter}
              setTimeRange={setTimeRange}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setShowFilterDrawer(false);
              setScanDateFilter(timeRange);
            }}
          >
            Apply
          </Button>
        </Stack>
      </Drawer>
      <Stack spacing={2}>
        <Button
          variant="outlined"
          startIcon={<Filter />}
          disabled={disabled}
          onClick={() => setShowFilterDrawer(true)}
        >
          Filter
        </Button>

        {rangeStartStr && (
          <Chip
            sx={{
              p: 1,
              height: "auto",
              "& .MuiChip-label": {
                whiteSpace: "normal",
              },
            }}
            label={rangeStartStr}
            onDelete={() => setScanDateFilter({})}
          />
        )}
      </Stack>
    </>
  );
};

export type DateTimeFilterProps = {
  sessionDateRange: ScanDateRange;
  timeRange: ScanDateRange;
  setTimeRange: (v: ScanDateRange) => void;
};
export function DateTimeFilterSlider({
  sessionDateRange,
  timeRange,
  setTimeRange,
}: DateTimeFilterProps) {
  const [minSlider, setMinSlider] = useState(0);
  const [maxSlider, setMaxSlider] = useState(1);
  const MIN_DISTANCE = 1;

  const [value, setValue] = useState<number[]>([0, 1]);

  useEffect(() => {
    console.log("sessionDateRange");
    if (sessionDateRange?.start && sessionDateRange?.end) {
      const startSlider = Math.floor(
        sessionDateRange.start.getTime() / HOURS_TO_MS
      );
      const endSlider = Math.ceil(sessionDateRange.end.getTime() / HOURS_TO_MS);

      setMinSlider(startSlider);
      setMaxSlider(endSlider);

      if (timeRange?.start && timeRange?.end) {
        setValue([
          timeRange.start.getTime() / HOURS_TO_MS,
          timeRange.end.getTime() / HOURS_TO_MS,
        ]);
      } else {
        setValue([startSlider, endSlider]);
      }
    }
  }, []);

  useEffect(() => {
    console.log("value", value);
    setTimeRange({
      start: new Date(value[0] * HOURS_TO_MS),
      end: new Date(value[1] * HOURS_TO_MS),
    });
  }, [value]);

  console.log("minSlider", minSlider, "maxSlider", maxSlider);

  return (
    <Slider
      getAriaLabel={() => "Temperature range"}
      // onChange={handleChange}
      value={value}
      onChange={(e: Event, newValue: number[], activeThumb: number) => {
        console.log("onChange", newValue);
        // https://v7.mui.com/material-ui/react-slider/#MinimumDistanceSlider.tsx
        if (activeThumb === 0) {
          setValue([Math.min(newValue[0], value[1] - MIN_DISTANCE), value[1]]);
        } else {
          setValue([value[0], Math.max(newValue[1], value[0] + MIN_DISTANCE)]);
        }
      }}
      valueLabelDisplay="auto"
      disableSwap
      min={minSlider}
      max={maxSlider}
      valueLabelFormat={(v, _) => {
        return (
          <Stack alignItems="center">
            <Typography variant="caption" justifyContent="center">
              {new Date(v * HOURS_TO_MS).toLocaleDateString(undefined, {
                timeZone: "UTC",
              })}
            </Typography>
            <Typography variant="caption" justifyContent="center">
              {new Date(v * HOURS_TO_MS).toLocaleTimeString(undefined, {
                timeZone: "UTC",
              })}
            </Typography>
          </Stack>
        );
      }}
      marks={[
        {
          value: minSlider,
          label: (
            <Stack alignItems="center">
              <Typography variant="caption">
                {new Date(minSlider * HOURS_TO_MS).toLocaleDateString(
                  undefined,
                  { timeZone: "UTC" }
                )}
              </Typography>
              <Typography variant="caption">
                {new Date(minSlider * HOURS_TO_MS).toLocaleTimeString(
                  undefined,
                  { timeZone: "UTC" }
                )}
              </Typography>
            </Stack>
          ),
        },
        {
          value: maxSlider,
          label: (
            <Stack alignItems="center">
              <Typography variant="caption">
                {new Date(maxSlider * HOURS_TO_MS).toLocaleDateString(
                  undefined,
                  { timeZone: "UTC" }
                )}
              </Typography>
              <Typography variant="caption">
                {new Date(maxSlider * HOURS_TO_MS).toLocaleTimeString(
                  undefined,
                  { timeZone: "UTC" }
                )}
              </Typography>
            </Stack>
          ),
        },
      ]}
    />
  );
}
