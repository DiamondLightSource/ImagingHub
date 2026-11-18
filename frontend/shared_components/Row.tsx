import React from "react";
import Stack from "@mui/material/Stack";

type RowProps = {
  children: React.ReactNode;
};

const Row = ({ children }: RowProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
      spacing={2}
    >
      {children}
    </Stack>
  );
};

export default Row;
