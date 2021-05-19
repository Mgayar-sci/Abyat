import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    flexBasis: "30%",
  },
  secondaryHeading: {
    color: theme.palette.text.secondary,
    opacity: 0,
    transform: "translate(0, 10vh)",
    transition: "all 0.5s",
  },
  visible: {
    color: theme.palette.text.primary,
    opacity: 1,
    transform: "translate(0, 0)",
    transition: "all 0.5s",
  },
}));

export default function SimpleAccordion({ components }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      {components.map(({ name, Component, text }) => (
        <Accordion
          key={name}
          expanded={expanded === name}
          onChange={handleChange(name)}
        >
          <AccordionSummary
            expandIcon={<SettingsIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{name}</Typography>
            {(
              <Typography className={expanded !== name?classes.visible:classes.secondaryHeading}>
                {text}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails style={{justifyContent: "center"}}>
            <Typography component="div">
              <Component />
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
