
import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import TabPanel from '../components/common/TabPanels';
import UserSettings from '../components/userSettings/UserSettings';

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
    paperContainer: {
        // backgroundColor: theme.palette.primary.light
    },
    paperContent: {
        margin: '1em'
    },
    notification: {
        minWidth: 'auto'
    },
    tab: {
    }
}));

const SettingsPage = () => {
    const getTabIndex = (hash: string) => {
        switch (hash) {
            case "#user":
                return 0
            case "#preferences":
                return 1
            default:
                return 0
        }
    }
    const classes = useStyles()
    const { hash } = useLocation()
    return (
        <Paper className={classes.paperContainer}>
            <Tabs
                value={getTabIndex(hash)}
                indicatorColor="secondary"
                color="secondary"
                aria-label="Authentication tabs"
            >
                <Tab className={classes.tab} label="USER" href="#user">
                </Tab>
                <Tab className={classes.tab} label="PREFERENCES"  href="#preferences"/>
            </Tabs>
            <TabPanel value={getTabIndex(hash)} index={0}>
                <UserSettings />
            </TabPanel>
            <TabPanel value={getTabIndex(hash)} index={1}>
            </TabPanel>
        </Paper>
    );
};

export default SettingsPage


