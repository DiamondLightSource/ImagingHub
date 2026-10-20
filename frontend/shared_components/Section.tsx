import React from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

type SectionProps = {
  title?: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => {
  return (
    <Box
      component="fieldset"
      sx={{
        mt: "8px !important",
        border: "1px solid grey",
        borderRadius: 1,
        fontSize: "0.8rem",
      }}
    >
      {title && (
        <Box component="legend" sx={{ px: 0.5 }}>
          {title}
        </Box>
      )}
      <Stack spacing={2} sx={{ p: 0.5 }}>
        {children}
      </Stack>
    </Box>
  );
};

export default Section;
