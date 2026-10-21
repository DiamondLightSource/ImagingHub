import React from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

const LayoutCard = ({ children }: { children: React.ReactNode }) => (
  <Card
    variant="outlined"
    sx={{
      mb: 2,
      p: 2,
      border: "1px solid #89987880",
      borderRadius: "4px",
    }}
  >
    <Stack direction="column" spacing={2}>
      {children}
    </Stack>
  </Card>
);

export default LayoutCard;
