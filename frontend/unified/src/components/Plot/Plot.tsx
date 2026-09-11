import { Suspense, useEffect, useState } from "react";
import { Visit } from "../JobsViewer/JobsViewer";
import { ArtifactSelector } from "./ArtifactSelector";
import { Switch } from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";

type PlotProps = {
  workflowName: string;
  visit: Visit;
};

export const Plot: React.FC<PlotProps> = ({ workflowName, visit }) => {
  const [artifactUrl, setArtifactUrl] = useState<string | null>(null);
  const [artifactData, setArtifactData] = useState<NDT | null>(null);
  const [isPlottingEnabled, setIsPlottingEnabled] = useState<boolean>(false);

  const fetchArtifactData = (url: string): NDT => {
    // TODO: fetch real artifact data, generating array locally for now
    console.log("Should fetch artifact data from URL: ", url);
    console.log("Instead, displaying hardcoded local data");
    const arr = new Uint8Array(100);
    const testData = arr.map((elem, idx) => (elem = idx));
    return ndarray(testData, [10, 10]) as NDT;
  };

  useEffect(() => {
    if (artifactUrl !== null) {
      setArtifactData(fetchArtifactData(artifactUrl));
    }
  }, [artifactUrl]);

  const displayPlotter = () => {
    if (isPlottingEnabled) {
      if (artifactUrl !== null && artifactData !== null) {
        return (
          <>
            <p>
              Warning: this is <strong>not</strong> displaying data for selected
              step, only displaying dummy data
            </p>
            <HeatmapPlot
              domain={[0, 255]}
              values={artifactData}
              plotConfig={{
                title: "Test plot",
                xLabel: "x",
                yLabel: "y",
              }}
            />
          </>
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
