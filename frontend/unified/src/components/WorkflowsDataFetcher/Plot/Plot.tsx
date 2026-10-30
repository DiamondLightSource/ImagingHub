import { Suspense, useEffect, useState } from "react";
import { ArtifactSelector, Artifact } from "./ArtifactSelector";
import { Switch } from "@mui/material";
import { NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { decode } from "fast-png";
import { proxyService } from "../../../../../tomography/src/api/services";
import { DataPlotter } from "./DataPlotter";
import { DataLoadingProgress } from "./DataLoadingProgress";
import { Visit } from "@diamondlightsource/sci-react-ui";
import { ArtifactSelectorFragmentFragment } from "./__generated__/ArtifactSelector.generated";

const imageIterator = (
  height: number,
  width: number,
  totalImages: number,
  tifUrl: string,
  setLoadingImageIndex: React.Dispatch<React.SetStateAction<number | undefined>>
): AsyncGenerator<NDT> => {
  const generator = (async function* () {
    for (let i = 0; i < totalImages; i++) {
      setLoadingImageIndex(i);
      const pngData = await proxyService.getTiffPage(tifUrl, i, 1);
      const decodedPng = decode(pngData.buffer);
      yield ndarray(decodedPng.data, [height, width]) as NDT;
    }
  })();

  return generator;
};

type PlotProps = {
  workflowName: string | null;
  visit: Visit;
  queryData: ArtifactSelectorFragmentFragment;
};

export const Plot: React.FC<PlotProps> = ({
  workflowName,
  visit,
  queryData,
}) => {
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

      const {
        page_count: pageCount,
        width,
        height,
      } = await proxyService.getTiffMetadata(url);
      setTotalImages(pageCount);
      const iter = imageIterator(
        height,
        width,
        pageCount,
        url,
        setLoadingImageIndex
      );

      setArtifactData([]);
      for await (const image of iter) {
        setArtifactData((prev) => [...prev, image]);
      }
      setLoadingImageIndex(null);
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
            key={workflowName}
            setArtifact={setArtifact}
            isPlottingEnabled={isPlottingEnabled}
            queryData={queryData}
          />
        </Suspense>
      );
    }
  };

  const displayDataPlotterOrLoadingProgress = () => {
    if (isPlottingEnabled && workflowName !== null && artifact !== null) {
      if (
        artifactData !== null &&
        artifactData.length >= 1 &&
        totalImages !== null
      ) {
        return (
          <>
            <DataPlotter
              loadingIndex={loadingImageIndex}
              artifact={artifact}
              data={artifactData}
              totalImages={totalImages}
            />
            {loadingImageIndex && (
              <DataLoadingProgress
                mimeType={artifact.mimeType}
                totalImages={totalImages}
                loadingImageIndex={loadingImageIndex}
              />
            )}
          </>
        );
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
      {displayArtifactSelectorOrNoWorkflowSelected()}
      {displayDataPlotterOrLoadingProgress()}
    </>
  );
};
