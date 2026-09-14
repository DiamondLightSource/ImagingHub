import { Suspense, useEffect, useState } from "react";
import { Visit } from "../JobsViewer/JobsViewer";
import { ArtifactSelector, Artifact } from "./ArtifactSelector";
import {
  Box,
  CircularProgress,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import { HeatmapPlot, NDT } from "@diamondlightsource/davidia";
import ndarray from "ndarray";
import { decode } from "fast-png";
import { proxyService } from "../../../../tomography/src/api/services";
import loadData from "../../../../tomography/src/components/crop/SampleLoad";

type PlotProps = {
  workflowName: string;
  visit: Visit;
};

export const Plot: React.FC<PlotProps> = ({ workflowName, visit }) => {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [artifactData, setArtifactData] = useState<NDT[] | null>(null);
  const [fetchingImageIndex, setFetchingImageIndex] = useState<number | null>(
    null
  );
  const [totalImages, setTotalImages] = useState<number | null>(null);
  const [displayedImageIndex, setDisplayedImageIndex] = useState<number | null>(
    null
  );
  const [isPlottingEnabled, setIsPlottingEnabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchArtifactData = async (url: string, mimeType: string) => {
      console.log("Fetching artifact data from URL: ", url);
      if (mimeType === "image/jpeg") {
        setTotalImages(1);
        setFetchingImageIndex(0);
        const data = await proxyService.getTiffPage(url, 0);
        const decodedPng = decode(data.buffer);
        const arr = ndarray(decodedPng.data, [
          decodedPng.height,
          decodedPng.width,
        ]) as NDT;
        setFetchingImageIndex(null);
        setDisplayedImageIndex(0);
        setArtifactData([arr]);
        return;
      }

      loadData(url, 1, setFetchingImageIndex, setTotalImages).then((data) => {
        setFetchingImageIndex(null);
        setDisplayedImageIndex(0);
        setArtifactData(data);
      });
    };

    if (artifact !== null) {
      fetchArtifactData(artifact?.url as string, artifact.mimeType);
    }
  }, [artifact]);

  const displayPlotter = () => {
    if (isPlottingEnabled) {
      if (artifact !== null && artifactData !== null) {
        if (artifact.mimeType === "image/jpeg") {
          return (
            <HeatmapPlot
              domain={[0, 255]}
              values={artifactData[displayedImageIndex]}
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
              values={artifactData[displayedImageIndex]}
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
      } else if (artifact !== null && artifactData === null) {
        if (artifact.mimeType === "image/jpeg") {
          return <p>Loading data...</p>;
        }

        // TODO: currently assuming that fetchingImageIndex is not `null`, to be able to then indicate
        // progress if fetching artifact data, but it seemingly can be `null` for a short
        // period, so need to check the relationship between the various states relating to
        // fetching artifact data
        return (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              variant="determinate"
              enableTrackSlot
              size={80}
              value={Math.round(
                (fetchingImageIndex / totalImages) * 100 +
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
              >{`${fetchingImageIndex + 1} / ${totalImages}`}</Typography>
            </Box>
          </Box>
        );
      } else {
        console.log("artifact URL: ", artifact?.url);
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
          setArtifact={setArtifact}
          isPlottingEnabled={isPlottingEnabled}
        />
      </Suspense>
      {displayPlotter()}
    </>
  );
};
