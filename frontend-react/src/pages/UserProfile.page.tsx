
import React from 'react';
import { Button, Paper } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: '100vh',
    justifyContent: 'center',
  },
  box: {
    padding: theme.spacing() * 2,
    textAlign: 'center',
    border: `solid 1px ${theme.palette.secondary.dark}`,
    borderRadius: '50%',
    width: '73px',
    boxSizing: 'border-box'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing() * 3,
    border: `solid 1px ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius
  },
  notification: {
    minWidth: 'auto'
  },
  tab: {
    width: '50%'
  }
}));

const UserProfile = () => {
  const getTabIndex = (hash: string) => {
    switch (hash) {
      case "#login":
        return 0
      case "#register":
        return 1
      default:
        return 0
    }
  }
  const classes = useStyles()
  const { hash } = useLocation()
  const [value, setValue] = React.useState(getTabIndex(hash));
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
      <Paper className={classes.paper}>
        <Button className={classes.box}>
          <LockIcon color="secondary" fontSize="large"></LockIcon>
        </Button>
      </Paper>
  );
};

export default UserProfile


