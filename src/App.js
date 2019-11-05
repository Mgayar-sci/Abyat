import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
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
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

export default function App() {
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState(false);
  const [data, setData] = React.useState("");
  const dataFieldRef = React.useRef(null);
  const classes = useStyles();

  const handleChange = event => {
    setData(event.target.value);
  };
  const analyzeData = event => {
    if (data) {
      setMessage("Success!");
      setError(false);
    } else {
      setMessage("Data is not valid!");
      setError(true);
      dataFieldRef.current.focus();
    }
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
                label="Data"
                style={{ margin: 20 }}
                placeholder="Please paste your data here"
                helperText={message}
                error={error}
                fullWidth
                multiline
                value={data}
                onChange={handleChange}
                margin="normal"
                inputRef={dataFieldRef}
                autoFocus
                required
              />
            </div>
            <Button
              variant="contained"
              className={classes.button}
              onClick={analyzeData}
            >
              Analyze data
            </Button>
          </form>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
