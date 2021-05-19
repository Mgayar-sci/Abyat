import React, { useEffect, useRef, useState } from "react";
import { CssBaseline, Container, Typography, Box } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import ProgressBar from './Components/ProgressBar';


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
  const rate = 20;

  const getInitialData = () => {
    let initData = JSON.parse(localStorage.getItem("data"));
    if (!initData) {
      initData = {
        "Math": { max: 300, page: 169 },
        "Arabic": { max: 304, page: 144 },
        "English": { max: 223, page: 77 }
      }
      localStorage.setItem("data", JSON.stringify(initData));
    }
    return initData;
  }

  // const [message, setMessage] = useState("");
  // const [error, setError] = useState(false);
  const [data, setData] = useState(getInitialData());

  const dataFieldRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    console.log(`data`, data);
    localStorage.setItem("data", JSON.stringify(data));
  }, [data])

  const handlePageChange = (key, event) => {
    const page = parseInt(event.target.value)
    setData({ ...data, [key]: { max: data[key].max, page, days: Math.ceil((data[key].max - page) / rate) } });
  };

  const handleMaxChange = (key, event) => {
    const max = parseInt(event.target.value)
    setData({ ...data, [key]: { max, page: data[key].page, days: Math.ceil((max - data[key].page) / rate) } });
  };

  // const handleError = msg => {
  //   setMessage(msg);
  //   setError(true);
  //   dataFieldRef.current.focus();
  // };

  const total = Object.values(data).reduce(((a, c) => { a.max += c.max; a.page += c.page; return a; }), { max: 0, page: 0 });

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        {Object.keys(data).map(key =>
          <Typography
            key={key}
            component="div"
            style={{ backgroundColor: "#cfe8fc" }}
          >
            <div className={classes.container}>
              <TextField
                id="outlined-basic-size-small"
                style={{ margin: 10, maxWidth: 75 }}
                placeholder="Page"
                // helperText={message}
                // error={error}
                type="number"
                variant="outlined"
                value={data[key].page}
                onChange={e => handlePageChange(key, e)}
                margin="dense"
                inputRef={dataFieldRef}
                autoFocus
              />
              <Box marginTop={2.5}>
                <Typography>of</Typography>
              </Box>
              <TextField
                id="standard-full-width"
                style={{ margin: 10, maxWidth: 75 }}
                placeholder="Max"
                // helperText={message}
                // error={error}
                type="number"
                variant="outlined"
                value={data[key].max}
                onChange={e => handleMaxChange(key, e)}
                margin="dense"
                inputRef={dataFieldRef}
              />
              <Box marginTop={0.5}>
                <Typography>{Math.ceil((data[key].max - data[key].page) / rate)} days</Typography>
                <Typography>{Math.ceil((data[key].max - data[key].page))} pages</Typography>
              </Box>
            </div>
            <ProgressBar name={key} max={data[key].max} value={data[key].page} />
          </Typography>)}
      </Container>
      <Container maxWidth="md">
        <Typography
          component="div"
          style={{display: "flex", alignItems: "center", backgroundColor: "#cfaafc"}}
        >
          <ProgressBar name={"Total"} max={total.max} value={total.page} />
          <Box minWidth={80} maxWidth={100}>
            <Typography style={{textAlign:"center"}}>
              {Math.ceil((total.max - total.page) / rate)} days
            <br />
              {Math.ceil((total.max - total.page))} pages
            </Typography>
          </Box>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
