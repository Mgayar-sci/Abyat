import React from "react";
import { Box, Typography } from "@material-ui/core";

export default function InfoBox({ minWidth, first, last }) {
  const widthMin = minWidth || 40;

  return (
    <Box display="flex">
      <Box minWidth={widthMin}>
        <Typography style={{ textAlign: "right", marginRight: "5px" }}>
          {first}
        </Typography>
      </Box>
      <Box minWidth={widthMin}>
        <Typography component="span">{last}</Typography>
      </Box>
    </Box>
  );
}
