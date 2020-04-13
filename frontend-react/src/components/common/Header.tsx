import React from 'react';
import { Toolbar, IconButton, createStyles } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/MenuRounded'
import { Theme, makeStyles } from '@material-ui/core/styles';
import UserSettingsMenu from '../UserSettingsMenu';

const useStyles = makeStyles((theme: Theme) => createStyles({
    toolbar:{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    title: {
    },
    menuButton: {
    },
    userSettingsMenu:{
        color: 'inherit'
    }
}));
const Header = () => {

    const classes = useStyles()
    return (
        <Toolbar className={classes.toolbar}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <UserSettingsMenu/>
        </Toolbar>
    )
}

export default Header