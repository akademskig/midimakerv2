
import React from 'react';
import { Paper, Tabs, Tab } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import TabPanel from '../components/common/TabPanels';
import styled from 'styled-components'
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

const ContainerStyled = styled(Paper)`
    .MuiButtonBase-root{
        /* box-shadow:${({ theme }: { theme: Theme }) => theme.shadows[1]} */
    }
`

const SettingsPage = () => {
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
        <ContainerStyled className={classes.paperContainer}>
            <Tabs
                value={value}
                indicatorColor="secondary"
                color="secondary"
                onChange={handleChange}
                aria-label="Authentication tabs"
            >
                <Tab className={classes.tab} label="USER">
                </Tab>
                <Tab className={classes.tab} label="PREFERENCES" />
            </Tabs>
            <TabPanel value={value} index={0}>
                <UserSettings />
            </TabPanel>
            <TabPanel value={value} index={1}>
            </TabPanel>
        </ContainerStyled>
    );
};

export default SettingsPage


