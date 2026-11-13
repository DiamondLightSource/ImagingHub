// import { DataCard } from "@diamondlightsource/sci-react-ui";
import {
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import { getFieldString, isMetadataPair } from "../beamline.config";
import { DataCardVariant, SelectedScans } from "../types";
import { ChevronDown } from "lucide-react";
import { DataCardSmall as DataCard } from "./DataCards/DataCardSmall";

type MetadataDisplayProps = {
  selectedScans: SelectedScans;
  maxColumns?: number;
};
export const MetadataDisplay = ({
  selectedScans,
  maxColumns = 4,
}: MetadataDisplayProps) => {
  const config = selectedScans?.config;
  const scans = selectedScans.scans;

  if (config) {
    if (scans.length === 1) {
      const scanData = scans[0];
      return (
        <Box>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h5">Scan metadata</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                spacing={1}
                columns={{
                  xl: maxColumns,
                  lg: Math.max(maxColumns - 1, 1),
                  md: Math.max(maxColumns - 2, 1),
                  sm: Math.max(maxColumns - 3, 1),
                  xs: Math.max(maxColumns - 4, 1),
                }}
              >
                {config?.ui.fullMetadata.map((x) => {
                  if (isMetadataPair(x)) {
                    const title = x.title;
                    const label1 = x.label1 ?? config.fields[x.value1].title;
                    const value1 =
                      getFieldString(config, scanData, x.value1) ?? "-";
                    const label2 = x.label2 ?? config.fields[x.value2].title;
                    const value2 =
                      getFieldString(config, scanData, x.value2) ?? "-";

                    switch (x.variant) {
                      case DataCardVariant.STANDARD: {
                        return (
                          <Grid size={1}>
                            <DataCard
                              title={title}
                              value={{
                                value: value1,
                                label: label1,
                              }}
                              subvalue={{
                                value: value2,
                                label: label2,
                              }}
                              colour="none"
                            />
                          </Grid>
                        );
                      }
                      case DataCardVariant.PAIRED: {
                        return (
                          <Grid size={1}>
                            <DataCard
                              title={title}
                              value1={{
                                value: value1,
                                label: label1,
                              }}
                              value2={{
                                value: value2,
                                label: label2,
                              }}
                              subvalue={{ value: "" }}
                              colour="none"
                            />
                          </Grid>
                        );
                      }
                      case DataCardVariant.STACKED: {
                        return (
                          <Grid size={1}>
                            <DataCard
                              title={title}
                              value1={{
                                value: value1,
                                label: label1,
                              }}
                              value2={{
                                value: value2,
                                label: label2,
                              }}
                              colour="none"
                            />
                          </Grid>
                        );
                      }
                    }
                  } else {
                    const title = config.fields[x].title;
                    const value = getFieldString(config, scanData, x) ?? "-";
                    return (
                      <Grid size={1}>
                        <DataCard
                          title={title}
                          value={{ value: value }}
                          colour="none"
                        />
                      </Grid>
                    );
                  }
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    } else if (scans.length > 1) {
      return (
        <Box p={2}>
          <DataCard
            title={`${scans.length} scans selected`}
            // value={{ value: `${scans.length} scans selected` }}
            value={{ value: scans.map((x) => x.scanNumber).join(", ") }}
            colour="none"
          />
        </Box>
      );
    }
  }

  return (
    <Box alignItems="center" textAlign="center" mt={4} mb={3}>
      <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
        Nothing selected
      </Typography>
      <Typography variant="body2" sx={{ color: "text.muted", mt: 0.5 }}>
        Select a scan from the scan selector to get started.
      </Typography>
    </Box>
  );
};
