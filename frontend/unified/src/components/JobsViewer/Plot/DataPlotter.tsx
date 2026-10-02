import { useState } from "react";
import { Slider } from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import { Artifact } from "./ArtifactSelector";

type DataPlotterProps = {
  artifact: Artifact;
  data: NDT[];
  totalImages: number;
};

export const DataPlotter: React.FC<DataPlotterProps> = ({
  artifact,
  data,
  totalImages,
}: DataPlotterProps) => {
  const [displayedImageIndex, setDisplayedImageIndex] = useState<number>(0);

  const displayDataPlotter = () => {
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
  };

  return displayDataPlotter();
};
