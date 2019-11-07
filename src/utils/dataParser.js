import { dataShapes } from "../conf/datashapes";

export function simpleTest() {
  const data = [
    `BASKETBALL
  player 1;nick1;4;Team A;G;10;2;7
  player 2;nick2;8;Team A;F;0;10;0
  player 3;nick3;15;Team A;C;15;10;4
  player 4;nick4;16;Team B;G;20;0;0
  player 5;nick5;23;Team B;F;4;7;7
  player 6;nick6;42;Team B;C;8;10;0
  `,
  `HANDBALL
player 1;nick1;4;Team A;G;0;20
player 2;nick2;8;Team A;F;15;20
player 3;nick3;15;Team A;F;10;20
player 4;nick4;16;Team B;G;1;25
player 5;nick5;23;Team B;F;12;25
player 6;nick6;42;Team B;F;8;25`
  ];

  let players = [];
  let mvp = { nickname: "", score: 0 };
  console.log(players, mvp);

  data.map(d=>console.log(test(d, players, mvp)));

  console.log(players, mvp);
}

function test(data, players, mvp) {
  const result = parseData(data);
  if (result.error)
    throw Error(
      `Data is not valid!, error ${result.error} line: ${result.line &&
        result.line}`
    );

  const newMatch = calcFormula(result.gameData, result.sport);
  if (newMatch.error)
    throw Error(
      `Data is not valid!, error ${newMatch.error} line: ${newMatch.line &&
        newMatch.line}, ${newMatch.msg}`
    );

  const playersData = getPlayersData(newMatch, players, mvp);

  if (playersData.error)
    throw Error(`Data is not valid!, error ${playersData.error}`);

  return playersData;
}

/**
 * Parses one file data as string and returns an array of game data and the parsed sport configuration
 * @param {string} data data string for single file
 */
export function parseData(data = "") {
  // check for invalid data
  if (!data || data.length === 0 || !data.split) return { error: 0 };

  // trim spaces and split string into lines around \r\n and \n
  const strArr = data.trim().split(/\r?\n/g);
  // the resulting array should have a length of 3 lines at least (sport name, team 1 single entry  and team 2 single entry in the minimum case)
  if (!strArr || strArr.length <= 2) return { error: 1, line: 1 };

  // get sport configuration from available configurations found in datashapes.js
  const sport = dataShapes.find(
    ds => ds.name.trim().toLowerCase() === strArr[0].trim().toLowerCase()
  );

  // checking for sport object data integrity
  if (!sport || sport.length < 1 || !sport.fields) return { error: 2, line: 1 };

  // transform string array into an array of fields and push to gamedata array
  let gameData = [];
  for (let i = 1; i < strArr.length; i++) {
    // check for empty line entries
    if (!strArr[i]) return { error: 3, line: i + 1 };

    // split lines around ; to get field values
    const fieldsArr = strArr[i].split(";");

    // check if number of fields is not equal number of fields in sport config.
    if (!fieldsArr || fieldsArr.length !== sport.fields.length)
      return { error: 4, line: i + 1 };

    // if everything is ok, push to gamedata array
    gameData.push(fieldsArr);
  }
  return { gameData, sport };
}

/**
 * Checks data shape line by line and calculates each player score
 * @param {any[]} gameData current game data
 * @param {any} sport current sport configuration
 */
export function calcFormula(gameData, sport) {
  /**
   * Multiplies 2 arrays elments pairwise
   * @param {number[]} a first array of numbers
   * @param {number[]} b second array of numbers
   */
  function mulVectors(a, b) {
    return a.map((e, i) => e * b[i]);
  }
  /**
   * Sums array elements
   * @param {number[]} a array to be summed
   */
  function sumVector(a) {
    return a.reduce((prev, cur) => prev + cur, 0);
  }

  // checks for sport object data integrity
  if (
    !sport ||
    !sport.fields ||
    !sport.formula ||
    !sport.selector ||
    !sport.nickname ||
    !sport.team ||
    !sport.formula.fields
  )
    return { error: 10, msg: "sport is not valid!" };

  // check for game data object data integrity
  if (
    !gameData ||
    gameData.length < 2 ||
    gameData[0].length !== sport.fields.length
  )
    return { error: 11, msg: "Gamedata is not valid!" };

  let scores = {};
  try {
    // map each line in gamedata to a score
    scores = gameData.map((player, i) => {
      // get player position using the sport selector property
      const playerPosition = player[sport.selector];

      // get the formula based on position which should be upper case
      const formula = sport.formula[playerPosition.toUpperCase()];

      // in case the position doesn't exist in the formula
      if (!formula)
        throw Error(
          JSON.stringify({
            msg: "position doesn't exist in formula",
            line: i + 2
          })
        );

      // here we map -1 to 1 and other values to corresponding player attributes
      const playerAttributes = sport.formula.fields.map(f =>
        f < 0 ? 1 : player[f]
      );

      // the fast way to calc score
      // const score1 = playerAttributes.reduce((r,a,i)=>r+a*formula[i],0);

      // the readable way to calc score
      // this line should multiply array elements pairwise and then calculate the sum
      const score = sumVector(mulVectors(playerAttributes, formula));

      // if player attributes (goals, assists, ... etc) includes a non number field, the score will not be a number as well, we do this check here while we could check every player line first then calculate score
      if (!score || typeof score !== "number")
        throw Error(
          JSON.stringify({ msg: "player fileds are not numeric", line: i + 2 })
        );

      return {
        nickname: player[sport.nickname],
        team: player[sport.team],
        score
      };
    });
  } catch (err) {
    const e = err.message && JSON.parse(err.message);
    return { error: 12, ...e };
  }

  return scores;
}

/**
 * Assigns each player the final score after calculating team scores and updates the current mvp nickname and score
 * @param {{nickname:string, team:string, score:number}[]} match an array of player nickname, teams and scores
 * @param {Object.<string, number>} players a dictionary of players nicknames and scores
 * @param {{nickname:string, score:number}} oldMVP an object that contains the last mvp player {nickname, score}
 */
export function getPlayersData(match, players, oldMVP) {
  const newMVP = oldMVP;
  const teamsScores = {};
  // calculate each team score in a single match
  match.forEach(element => {
    // add score to team by team name
    if (teamsScores.hasOwnProperty(element.team))
      teamsScores[element.team] += element.score;
    else teamsScores[element.team] = element.score;
  });

  // check if we don't have exactly 2 teams per match
  if (Object.keys(teamsScores).length !== 2) return { error: 13 };

  // calculate the winning team and get its name and score
  const winningTeam = Object.entries(teamsScores).reduce((prev, cur) =>
    prev[1] > cur[1] ? prev[0] : cur[0]
  );

  // calculate players scores and adds bonus to winning teams' players
  match.forEach(element => {
    // add score to a player by nickname
    if (players.hasOwnProperty(element.nickname))
      players[element.nickname] += element.score;
    else players[element.nickname] = element.score;

    // add 10 bonus points to winning team player
    if (element.team === winningTeam) players[element.nickname] += 10;

    // update mvp nickname and score
    if (newMVP.score < players[element.nickname]) {
      newMVP.nickname = element.nickname;
      newMVP.score = players[element.nickname];
    }
  });
  return { teamsScores, playersScores: players, newMVP };
}
