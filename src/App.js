import React from "react";
import { CssBaseline, Container, Typography } from "@material-ui/core";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import DenseTable from "./Components/DenseTable";

import { parseData, calcFormula, getPlayersData } from "./utils/dataParser";

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
  const [players, setPlayers] = React.useState({});
  const [teams, setTeams] = React.useState({});
  const [result, setResult] = React.useState(undefined);
  const [mvp, setMvp] = React.useState({ nickname: "", score: 0 });

  const dataFieldRef = React.useRef(null);
  const classes = useStyles();

  const handleChange = event => {
    setData(event.target.value);
  };
  const analyzeData = event => {
    if (data) {
      const result = parseData(data);
      if (result.error) {
        setMessage(
          `Data is not valid!, error ${result.error} line: ${result.line &&
            result.line}`
        );
        setResult(undefined);
      } else {
        setMessage("Success!");
        setResult(result);
      }
      setError(!!result.error);
    } else {
      setMessage(`Data is not valid!`);
      setError(true);
      setResult(undefined);
      dataFieldRef.current.focus();
    }
  };

  const calculateMVP = event => {
    if (!result || !result.gameData || !result.sport) {
      setMessage(`Please analyze data first!`);
      setError(true);
      dataFieldRef.current.focus();
      return;
    }
    const newMatch = calcFormula(result.gameData, result.sport);

    if (!newMatch || newMatch.error) {
      setMessage(
        `Data is not valid!, error ${newMatch.error} line: ${newMatch.line &&
          newMatch.line}`
      );
      setError(true);
      dataFieldRef.current.focus();
      return;
    }

    const { teamsScores, playersScores, newMvp, error } = getPlayersData(
      newMatch,
      players,
      mvp
    );

    if (error) {
      setMessage(`Data is not valid!, error ${error}`);
      setError(true);
      dataFieldRef.current.focus();
      return;
    }

    setPlayers(playersScores);
    setTeams(teamsScores);
    setMvp(newMvp);
    setMessage("");
    setResult(undefined);
    setData("");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
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
              Analyze data shape
            </Button>
            {result && (
              <DenseTable
                data={result.gameData}
                headers={result.sport.fields}
                array
              />
            )}
            <Button
              variant="contained"
              className={classes.button}
              onClick={calculateMVP}
            >
              Deep analysis and Calculate MVP
            </Button>
          </form>
          <DenseTable data={teams} headers={["Team Name", "Score"]} />
          <DenseTable
            data={players}
            headers={["Player Nickname", "Score"]}
            highlight={mvp.nickname}
          />
        </Typography>
      </Container>
    </React.Fragment>
  );
}
