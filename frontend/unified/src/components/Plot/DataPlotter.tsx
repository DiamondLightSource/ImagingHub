import { useState } from "react";
import { Box, CircularProgress, Slider, Typography } from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import { Artifact } from "./ArtifactSelector";

type DataPlotterProps = {
  artifact: Artifact;
  data: NDT[] | null;
  totalImages: number;
  loadingImageIndex: number | null;
};

export const DataPlotter: React.FC<DataPlotterProps> = ({
  artifact,
  data,
  totalImages,
  loadingImageIndex,
}: DataPlotterProps) => {
  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const displayDataPlotter = () => {
    if (data !== null) {
      if (artifact.mimeType === "image/jpeg") {
        return (
          <HeatmapPlot
            domain={[0, 255]}
            values={data[displayedImageIndex]}
            plotConfig={{
              title: "Test plot",
              xLabel: "x",
              yLabel: "y",
            }}
          />
        );
      }

      return (
        <>
          <HeatmapPlot
            domain={[0, 255]}
            values={data[displayedImageIndex]}
            plotConfig={{
              title: "Test plot",
              xLabel: "x",
              yLabel: "y",
            }}
          />
          <Slider
            marks
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={totalImages - 1}
            defaultValue={0}
            onChange={(_, value: number) => setDisplayedImageIndex(value)}
          />
        </>
      );
    } else {
      if (artifact.mimeType === "image/jpeg") {
        return <p>Loading data...</p>;
      }

      return (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loadingImageIndex !== null ? (
            <>
              <CircularProgress
                variant="determinate"
                enableTrackSlot
                size={80}
                value={Math.round(
                  (loadingImageIndex / totalImages) * 100 +
                    (1 / totalImages) * 100
                )}
              />
              <Box
                sx={{
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                >{`${loadingImageIndex + 1} / ${totalImages}`}</Typography>
              </Box>
            </>
          ) : (
            <CircularProgress enableTrackSlot size={80} />
          )}
        </Box>
      );
    }
  };

  return displayDataPlotter();
};
