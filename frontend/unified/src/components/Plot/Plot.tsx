import { Suspense, useEffect, useState } from "react";
import { Visit } from "../JobsViewer/JobsViewer";
import { ArtifactSelector, Artifact } from "./ArtifactSelector";
import { Switch } from "@mui/material";
import { NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { decode } from "fast-png";
import { proxyService } from "../../../../tomography/src/api/services";
import loadData from "../../../../tomography/src/components/crop/SampleLoad";
import { DataPlotter } from "./DataPlotter";
import { DataLoadingProgress } from "./DataLoadingProgress";

type PlotProps = {
  workflowName: string;
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

  useEffect(() => {
    const fetchArtifactData = async (url: string, mimeType: string) => {
      console.log("Fetching artifact data from URL: ", url);
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

  const displayDataPlotterOrLoadingProgress = () => {
    if (isPlottingEnabled && artifact !== null && totalImages !== null) {
      if (artifactData !== null) {
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
      <Suspense fallback={<div>Loading...</div>}>
        <ArtifactSelector
          workflowName={workflowName}
          visit={visit}
          setArtifact={setArtifact}
          isPlottingEnabled={isPlottingEnabled}
        />
      </Suspense>
      {displayDataPlotterOrLoadingProgress()}
    </>
  );
};
