import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { CssBaseline, Container, Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function App() {
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const handleChange = event => {
    setName(event.target.value);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Typography
          component="div"
          style={{ backgroundColor: "#cfe8fc", height: "100vh" }}
        >
          <form noValidate autoComplete="off">
            <div className={classes.container}>
              <TextField
                id="standard-full-width"
                label="Name"
                style={{ margin: 20 }}
                placeholder="Placeholder"
                helperText="Full width!"
                fullWidth
                multiline
                value={name}
                onChange={handleChange}
                margin="normal"
              />
            </div>
          </form>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
