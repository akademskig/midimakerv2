import React from 'react';
import { AppBar, Toolbar, useTheme } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import UserSettingsMenu from '../../components/UserSettingsMenu';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        position: 'relative',
        maxHeight: '64px',

    },
    toggleButton: {
        marginRight: 36,
        display: 'none',
        [theme.breakpoints.up('xs')]: {
            display: 'block'
        },
    },
    mobileToggleButton: {
        marginRight: 36,
        [theme.breakpoints.up('xs')]: {
            display: 'none'
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 2),
    },
  
}))

const AppToolbar = ({handleDrawerToggle, handleMobileToggle}:{handleDrawerToggle: any, handleMobileToggle: any}) => {
    const theme = useTheme()
    console.log(theme)
    const classes = useStyles(theme)
    return (
        <AppBar
            className={classes.appBar}
        >
            <Toolbar className={classes.toolbar}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    className={classes.toggleButton}
                >
                    <MenuIcon />
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleMobileToggle}
                    edge="start"
                    className={classes.mobileToggleButton}
                >
                    <MenuIcon />
                </IconButton>
                <UserSettingsMenu />
            </Toolbar>
        </AppBar>
    )
}
export default AppToolbar