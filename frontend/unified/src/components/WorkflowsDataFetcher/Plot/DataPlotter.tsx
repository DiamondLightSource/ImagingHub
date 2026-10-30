import { useState } from "react";
import { Slider } from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import { Artifact } from "./ArtifactSelector";

type DataPlotterProps = {
  artifact: Artifact;
  data: NDT[];
  totalImages: number;
  loadingIndex: number | null;
};

const EXPAND_PLOT_HEIGHT_STYLING = { display: "grid", height: "75vh" };

export const DataPlotter: React.FC<DataPlotterProps> = ({
  artifact,
  data,
  totalImages,
  loadingIndex,
}: DataPlotterProps) => {
  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const displayDataPlotter = () => {
    if (artifact.mimeType === "image/jpeg") {
      return (
        <div style={EXPAND_PLOT_HEIGHT_STYLING}>
          <HeatmapPlot
            domain={[0, 255]}
            values={data[displayedImageIndex]}
            plotConfig={{
              title: "Test plot",
              xLabel: "x",
              yLabel: "y",
            }}
          />
        </div>
      );
    }

    return (
      <div style={EXPAND_PLOT_HEIGHT_STYLING}>
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
          onChange={(_, value: number) => {
            if (loadingIndex !== null) {
              if (loadingIndex < totalImages - 1 && value < loadingIndex) {
                setDisplayedImageIndex(value);
              } else {
                // TODO: trying to display an image that hasn't yet been fetched, display some
                // kind of feedback that this can't be done
              }
            } else {
              // `loadingIndex` is null when the process of data-fetching is not occurring,
              // in which case it's fine to select any image
              setDisplayedImageIndex(value);
            }
          }}
        />
      </div>
    );
  };

  return displayDataPlotter();
};
