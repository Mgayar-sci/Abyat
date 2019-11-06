import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: "sm",
  },
}));


export default function DenseTable(props) {
  const classes = useStyles();

  const { headers, highlight, array} = props;
  const data = array?props.data:Object.entries(props.data);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {headers.map(header=><TableCell key={header}>{header}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry,i) => (
              <TableRow key={i} selected={entry[0]===highlight}>
                {entry.map( (e,j) =>
                <TableCell component="th" scope="row" key={j}>
                  {e}
                </TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
