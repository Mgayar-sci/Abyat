import React, { useEffect, useRef, useState } from "react";
import { CssBaseline, Container, Typography, Box, Button, IconButton } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

import ProgressBar from './Components/ProgressBar';
import SimpleAccordion from "./Components/SimpleAccordion";
import InfoBox from "./Components/InfoBox";
import Settings from "./Components/Settings";
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    // margin: theme.spacing(1),
    // flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export default function App() {

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


  const getInitialSettings = () => {
    let initSettings = JSON.parse(localStorage.getItem("settings"));
    if (!initSettings) {
      initSettings = { Rate: 20, Days: 5 };
      localStorage.setItem("settings", JSON.stringify(initSettings));
    }
    return initSettings;
  }

  // const [message, setMessage] = useState("");
  // const [error, setError] = useState(false);
  const [data, setData] = useState(getInitialData());
  const [settings, setSettings] = useState(getInitialSettings());

  const dataFieldRef = useRef(null);
  const classes = useStyles();

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings])

  useEffect(() => {
    console.log(`data`, data);
    localStorage.setItem("data", JSON.stringify(data));
  }, [data])

  const handlePageChange = (key, event) => {
    const page = parseInt(event.target.value)
    setData({ ...data, [key]: { max: data[key].max, page, days: Math.ceil((data[key].max - page) / settings.Rate) } });
  };

  const handleMaxChange = (key, event) => {
    const max = parseInt(event.target.value)
    setData({ ...data, [key]: { max, page: data[key].page, days: Math.ceil((max - data[key].page) / settings.Rate) } });
  };

  const addNewSubject = () => {
    const subjectName = prompt("Enter new subject name","NewSubject" + Object.keys(data).length);
    if(subjectName && !data.hasOwnProperty(subjectName)){
      setData({...data, [subjectName]:{max:1,page:1}});
    }
  }

  const removeSubject = (key) => {
    if(!data.hasOwnProperty(key)){
      alert("Invalid subject name!");
    }else {
    // eslint-disable-next-line no-restricted-globals
      const sure = confirm("Are you sure you want to delete "+ key + "?");
      if(sure){
        const {[key]:tmp, ...rest} = data;
        setData(rest);
      }
    }
  }

  const getWeekDay = (day) => {
    switch (day) {
      case 0:
        return "Saturday";
      case 1:
        return "Sunday";
      case 2:
        return "Monday";
      case 3:
        return "Tuesday";
      case 4:
        return "Wednesday";
      case 5:
        return "Thursday";
      case 6:
        return "Friday";

      default:
        return "Saturday";
    }
  }

  // const handleError = msg => {
  //   setMessage(msg);
  //   setError(true);
  //   dataFieldRef.current.focus();
  // };

  const total = Object.values(data).reduce(((a, c) => { a.max += c.max; a.page += c.page; return a; }), { max: 0, page: 0 });
  const pages = (total.max - total.page);
  const days = Math.ceil((total.max - total.page) / settings.Rate) % settings.Days;
  const weeks = Math.floor(Math.ceil((total.max - total.page) / settings.Rate) / settings.Days);

  let date = new Date();
  date.setDate(date.getDate() + weeks * 7 + days);
  const weekDay = getWeekDay(date.getDay());

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <SimpleAccordion components={[{ name: "Settings", text: `Rate: ${settings.Rate} - Days: ${settings.Days}`, Component: () => (<Settings updateSettings={setSettings} settings={settings} />) }]} />
        {Object.keys(data).map((key, index) =>
          <Typography
            key={key}
            component="div"
            style={{ backgroundColor: "#cfe8fc", marginBottom: 2, padding: 2 }}
          >
            <div className={classes.container}>
              <TextField
                id="outlined-basic-size-small"
                style={{ margin: 5, marginTop: 10, maxWidth: 75 }}
                placeholder="Page"
                // helperText={message}
                // error={error}
                type="number"
                variant="outlined"
                value={data[key].page}
                onChange={e => handlePageChange(key, e)}
                margin="dense"
                inputRef={dataFieldRef}
                autoFocus={index === 0}
              />
              <Box marginTop={2.5}>
                <Typography>of</Typography>
              </Box>
              <TextField
                id="standard-full-width"
                style={{ margin: 5, marginTop: 10, maxWidth: 75 }}
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
              <Box width="100%" display="flex" flexDirection="rows" justifyContent="flex-end">
              <IconButton onClick={()=>removeSubject(key)}>
                <DeleteIcon/>
              </IconButton>
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end">
                <InfoBox
                  first={Math.ceil((data[key].max - data[key].page) / settings.Rate)}
                  last="days" />
                <InfoBox
                  first={Math.ceil((data[key].max - data[key].page))}
                  last="pages" />
              </Box>
              </Box>
              {/* </div> */}
            </div>
            <ProgressBar name={key} max={data[key].max} value={data[key].page} />
          </Typography>)}
        <Typography
          component="div"
          style={{ display: "flex", justifyContent: "center", margin: 10}}
        >
          <Button variant="contained" color="primary" onClick={addNewSubject}>+Add</Button>
        </Typography>
        <Typography
          component="div"
          style={{ display: "flex", alignItems: "center", backgroundColor: "#cfaafc" }}
        >
          <ProgressBar name={"Total"} max={total.max} value={total.page} />
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end">
            <InfoBox
              first={weeks}
              last="weeks" />
            <InfoBox
              first={days}
              last="days" />
          </Box>
        </Typography>
        <Typography
          component="div"
          style={{ display: "flex", justifyContent: "center", backgroundColor: "#cfaafc" }}
        >
          <Box display="flex" justifyContent="space-between" width="100%">
          <InfoBox
              first={pages}
              last="pages" />
            <InfoBox
              first={weekDay}
              last={date.toLocaleDateString()} />
          </Box>
        </Typography>
      </Container>
    </React.Fragment>
  );
}
