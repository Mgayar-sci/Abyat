import { dataShapes } from "../conf/datashapes";
import { isNumber } from "util";

export function parseData(data = "") {
  if (!data || data.length === 0 || !data.split) return { error: 0 };

  const strArr = data.split("\n");
  if (!strArr || strArr.length <= 2) return { error: 1, line: 1 };

  const sport = dataShapes.find(
    ds => ds.name.trim().toLowerCase() === strArr[0].trim().toLowerCase()
  );

  console.log(sport);

  if (!sport || sport.length < 1 || !sport.fields) return { error: 2, line: 1 };

  let gameData = [];
  for (let i = 1; i < strArr.length; i++) {
    const fieldsArr = strArr[i].split(";");
    if (!fieldsArr) return { error: 3, line: i + 1 };

    if (fieldsArr.length !== sport.fields.length)
      return { error: 4, line: i + 1 };

    gameData.push(fieldsArr);
  }
  return { gameData, sport };
}

export function calcFormula(gameData, sport) {
  function mulVectors(a, b) {
    return a.map((e, i) => e * b[i]);
  }

  function sumVector(a = []) {
    return a.reduce((prev, cur) => prev + cur, 0);
  }

  if (!sport || !sport.fields || !sport.formula) return { error: 10 };
  if (
    !gameData ||
    gameData.length < 2 ||
    gameData[0].length !== sport.fields.length
  )
    return { error: 11 };
  let scores = {};
  try {
    scores = gameData.map((player, i) => {
      const selectorValue = player[sport.selector];
      const formula = sport.formula[selectorValue];
      const playerAttributes = sport.formula.fields.map(f =>
        f < 0 ? 1 : player[f]
      );
      // const score1 = playerAttributes.reduce((r,a,i)=>r+a*formula[i],0);
      const score = sumVector(mulVectors(playerAttributes, formula));
      // console.log(score);

      if (!score || !isNumber(score)) throw Error(i + 2);

      return {
        nickname: player[sport.nickname],
        team: player[sport.team],
        score
      };
    });
  } catch (err) {
    return { error: 12, line: err.message };
  }

  return scores;
}

export function getPlayersData(data, players, mvp) {
  const teams = {};
  data.forEach(element => {
    if (teams.hasOwnProperty(element.team))
      teams[element.team] += element.score;
    else teams[element.team] = element.score;
  });
  if (Object.keys(teams).length < 2) return { error: 13 };

  const winningTeam = Object.entries(teams).reduce((prev, cur) =>
    prev[1] > cur[1] ? prev[0] : cur[0]
  );

  data.forEach(element => {
    console.log(element);
    if (players.hasOwnProperty(element.nickname))
      players[element.nickname] += element.score;
    else players[element.nickname] = element.score;

    if (element.team === winningTeam) players[element.nickname] += 10;

    if (mvp.score < players[element.nickname]) {
      mvp.nickname = element.nickname;
      mvp.score = players[element.nickname];
    }
  });
  return { teamsScores: teams, playersScores: players, newMvp: mvp };
}
