
import React, { useState } from 'react';
import { Button, Container, Paper,  Tab, Tabs,  } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useNotify from '../utils/notifications';
import LoginForm from '../components/Login.form';
import TabPanel from '../components/common/TabPanels';
import {  useLocation } from 'react-router-dom';

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

const AuthPage = () => {
  // const login = useLogin();
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
  const notify = useNotify();
  const [value, setValue] = React.useState(getTabIndex(hash));
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
    notify("info", "tab changed!")
  };

  return (
      <Container maxWidth="xs" className={classes.container}>
        <Tabs
          value={value}
          indicatorColor="secondary"
          color="secondary"
          onChange={handleChange}
          aria-label="Authentication tabs"
        >
            <Tab className={classes.tab} label="LOGIN" component="a"/>
            <Tab className={classes.tab} label="REGISTER" />

        </Tabs>
        <Paper className={classes.paper}>
          <Button className={classes.box}>
            <LockIcon color="secondary" fontSize="large"></LockIcon>
          </Button>

          <TabPanel value={value} index={0}>
            <LoginForm></LoginForm>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
        </Paper>
      </Container>
  );
};

export default AuthPage


