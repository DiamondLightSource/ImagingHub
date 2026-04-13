import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import { Card, List, ListItem, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Guide: React.FC = () => {
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mx: "auto",
          mb: 2,
          p: 2,
          border: "1px solid #89987880",
          borderRadius: "4px",
        }}
      >
        <Typography variant="h6">
          GUI for{" "}
          <a
            href="https://diamondlightsource.github.io/httomo/index.html"
            target="_blank"
          >
            HTTomo
          </a>
        </Typography>
        <Typography variant="body1" gutterBottom>
          <List dense={true} sx={{ listStyleType: "disc", pl: 2 }}>
            <ListItem disableGutters={true} sx={{ display: "list-item" }}>
              <Link to="methods"> Configure pipelines</Link>
            </ListItem>
            <ListItem disableGutters={true} sx={{ display: "list-item" }}>
              Upload existing or download newly configured YAML pipeline files
            </ListItem>
            <ListItem disableGutters={true} sx={{ display: "list-item" }}>
              <Link to="workflow-cor">
                Interactively find the center-of-rotation (CoR)
              </Link>
            </ListItem>
            <ListItem disableGutters={true} sx={{ display: "list-item" }}>
              <Link to="crop"> Crop projections</Link>
            </ListItem>
            <ListItem disableGutters={true} sx={{ display: "list-item" }}>
              <Link to="workflow-run">Run pipelines with HTTomo</Link>
            </ListItem>
          </List>
        </Typography>
        <Typography variant="h6">How to start?</Typography>
        <Typography variant="body1" gutterBottom>
          Start by opening <Link to="methods">methods section</Link> setting up
          your loader and then select your required methods afterwards
        </Typography>
        <Typography variant="h6">Further information</Typography>
        <Typography variant="body1" gutterBottom>
          Please visit ImagingHub's
          <a
            href="https://github.com/DiamondLightSource/ImagingHub"
            target="_blank"
          >
            {" "}
            github
          </a>{" "}
          page
        </Typography>
        <Typography variant="h6">Reporting issues</Typography>
        <Typography variant="body1">
          To{" "}
          <a
            href="https://github.com/DiamondLightSource/ImagingHub/issues/new?template=Blank+issue"
            target="_blank"
          >
            report
          </a>{" "}
          any issue/feedback
        </Typography>
      </Card>
    </>
  );
};

export default Guide;
