import { Box, CircularProgress, Typography } from "@mui/material";

type DataLoadingProgressProps = {
  mimeType: string;
  loadingImageIndex: number;
  totalImages: number;
};

const BoxHorizontallyCenteredContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

export const DataLoadingProgress: React.FC<DataLoadingProgressProps> = ({
  mimeType,
  loadingImageIndex,
  totalImages,
}) => {
  if (mimeType === "image/jpeg") {
    return (
      <BoxHorizontallyCenteredContent
        children={<CircularProgress enableTrackSlot size={80} />}
      />
    );
  }

  return (
    <BoxHorizontallyCenteredContent>
      <CircularProgress
        variant="determinate"
        enableTrackSlot
        size={80}
        value={Math.round(
          (loadingImageIndex / totalImages) * 100 + (1 / totalImages) * 100
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
    </BoxHorizontallyCenteredContent>
  );
};
