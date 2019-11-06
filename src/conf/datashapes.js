export const dataShapes = [
    {
      name: "BASKETBALL",
      fields: [
        "player name",
        "nickname",
        "number",
        "team name",
        "position",
        "scored points",
        "rebounds",
        "assists"
      ],
      nickname: 1,
      team: 3,
      selector: 4,
      formula: {
        fields: [5, 6, 7],
        G: [2, 3, 1],
        F: [2, 2, 1],
        C: [2, 1, 3]
      }
    },
    {
      name: "HANDBALL",
      fields: [
        "player name",
        "nickname",
        "number",
        "team name",
        "position",
        "goals made",
        "goals received"
      ],
      nickname: 1,
      team: 3,
      selector: 4,
      formula: {
        fields: [-1, 5, 6],
        G: [50, 5, -2],
        F: [20, 1, -1]
      }
    }
  ];