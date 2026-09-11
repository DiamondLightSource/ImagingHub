import { Suspense, useEffect, useState } from "react";
import { Visit } from "../JobsViewer/JobsViewer";
import { ArtifactSelector } from "./ArtifactSelector";
import { Switch } from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { decode } from "fast-png";
import { proxyService } from "../../../../tomography/src/api/services";

type PlotProps = {
  workflowName: string;
  visit: Visit;
};

export const Plot: React.FC<PlotProps> = ({ workflowName, visit }) => {
  const [artifactUrl, setArtifactUrl] = useState<string | null>(null);
  const [artifactData, setArtifactData] = useState<NDT | null>(null);
  const [isPlottingEnabled, setIsPlottingEnabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchArtifactData = async (url: string) => {
      console.log("Fetching artifact data from URL: ", url);
      const data = await proxyService.getTiffPage(url, 0);
      const decodedPng = decode(data.buffer);
      const arr = ndarray(decodedPng.data, [
        decodedPng.height,
        decodedPng.width,
      ]) as NDT;
      setArtifactData(arr);
    };

    if (artifactUrl !== null) {
      fetchArtifactData(artifactUrl);
    }
  }, [artifactUrl]);

  const displayPlotter = () => {
    if (isPlottingEnabled) {
      if (artifactUrl !== null && artifactData !== null) {
        return (
          <HeatmapPlot
            domain={[0, 255]}
            values={artifactData}
            plotConfig={{
              title: "Test plot",
              xLabel: "x",
              yLabel: "y",
            }}
          />
        );
      } else if (artifactUrl !== null && artifactData === null) {
        return <p>Loading data...</p>;
      } else {
        console.log("artifactUrl: ", artifactUrl);
        console.log("artifactData: ", artifactData);
      }
    }
  };

  return (
    <>
      <Switch
        size="small"
        checked={isPlottingEnabled}
        onChange={() => setIsPlottingEnabled(!isPlottingEnabled)}
        slotProps={{ input: { "aria-label": "controlled" } }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ArtifactSelector
          workflowName={workflowName}
          visit={visit}
          setArtifactUrl={setArtifactUrl}
          isPlottingEnabled={isPlottingEnabled}
        />
      </Suspense>
      {displayPlotter()}
    </>
  );
};
