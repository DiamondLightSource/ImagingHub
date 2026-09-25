import { Suspense, useEffect, useState } from "react";
import { ArtifactSelector, Artifact } from "./ArtifactSelector";
import { Switch } from "@mui/material";
import { NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { decode } from "fast-png";
import { proxyService } from "../../../../../tomography/src/api/services";
import loadData from "../../../../../tomography/src/components/crop/SampleLoad";
import { DataPlotter } from "./DataPlotter";
import { DataLoadingProgress } from "./DataLoadingProgress";
import { Visit } from "@diamondlightsource/sci-react-ui";

type PlotProps = {
  workflowName: string | null;
  visit: Visit;
};

export const Plot: React.FC<PlotProps> = ({ workflowName, visit }) => {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [artifactData, setArtifactData] = useState<NDT[] | null>(null);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(
    null
  );
  const [totalImages, setTotalImages] = useState<number | null>(null);
  const [isPlottingEnabled, setIsPlottingEnabled] = useState<boolean>(false);

  // TODO: straightforward way to have the plot component toggle keep its value when the
  // selected workflow changes, but the artifact data is reset to avoid potentially
  // displaying an artifact from a previously selected workflow if the plot component was
  // enabled when selecting a new workflow.
  //
  // Likely that `useEffect` isn't the best solution for this.
  useEffect(() => {
    setArtifact(null);
    setArtifactData(null);
  }, [workflowName]);

  useEffect(() => {
    const fetchArtifactData = async (url: string, mimeType: string) => {
      if (mimeType === "image/jpeg") {
        setTotalImages(1);
        setLoadingImageIndex(0);
        const data = await proxyService.getTiffPage(url, 0);
        const decodedPng = decode(data.buffer);
        const arr = ndarray(decodedPng.data, [
          decodedPng.height,
          decodedPng.width,
        ]) as NDT;
        setLoadingImageIndex(null);
        setArtifactData([arr]);
        return;
      }

      loadData(url, 1, setLoadingImageIndex, setTotalImages).then((data) => {
        setLoadingImageIndex(null);
        setArtifactData(data);
      });
    };

    if (artifact !== null) {
      fetchArtifactData(artifact?.url as string, artifact.mimeType);
    }
  }, [artifact]);

  const displayArtifactSelectorOrNoWorkflowSelected = () => {
    if (isPlottingEnabled) {
      if (workflowName === null) {
        return <p>No workflow selected</p>;
      }
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <ArtifactSelector
            workflowName={workflowName}
            visit={visit}
            setArtifact={setArtifact}
            isPlottingEnabled={isPlottingEnabled}
          />
        </Suspense>
      );
    }
  };

  const displayDataPlotterOrLoadingProgress = () => {
    if (isPlottingEnabled && workflowName !== null && artifact !== null) {
      if (artifactData !== null && totalImages !== null) {
        return (
          <DataPlotter
            artifact={artifact}
            data={artifactData}
            totalImages={totalImages}
          />
        );
      }
      return (
        <DataLoadingProgress
          mimeType={artifact.mimeType}
          totalImages={totalImages}
          loadingImageIndex={loadingImageIndex}
        />
      );
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
      {displayArtifactSelectorOrNoWorkflowSelected()}
      {displayDataPlotterOrLoadingProgress()}
    </>
  );
};
