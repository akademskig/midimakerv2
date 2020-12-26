import React, { Component, useCallback, useState } from 'react';
import clsx from 'clsx';
import { withStyles, Theme, makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EventIcon from '@material-ui/icons/Event';
import MailIcon from '@material-ui/icons/Mail';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import SettingsIcon from '@material-ui/icons/Settings';

import { navigationItems } from './navigationItems';
import { NavLink } from 'react-router-dom';
import AppToolbar from '../toolbar';

const drawerWidth = 220;

const useStyles = makeStyles((theme: any) =>
    ({
        root: {
            display: 'flex',
            flexDirection: 'column'
        },
        toggleButton: {
            marginRight: 36,
            [theme.breakpoints.down('xs')]: {
                display: 'none'
            },
        },
        mobileToggleButton: {
            marginRight: 36,
            [theme.breakpoints.up('sm')]: {
                display: 'none'
            },
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            [theme.breakpoints.down('xs')]: {
                width: 0
            },
        },
        drawerMobile: {
            [theme.breakpoints.up('sm')]: {
                width: 0,
                flexShrink: 0,
                display: 'none'
            },
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(7.5) + 1,
            },

        },
        content: {
            flexGrow: 1,
        },
        drawerPaper: {
            marginTop: '64px',
        },
        drawerPaperMobile: {
            width: drawerWidth,
            [theme.breakpoints.up('sm')]: {
                width: 0,
                flexShrink: 0,
            },
        },
    }))

const NavigationStyled = styled.nav`
        display: flex;
    `

const NavLinkStyled = styled(NavLink)`
    &{ 
        text-decoration: none;
        color: inherit;
    }
    &.link-active{
        div{
            color: ${({ theme }: { theme: Theme }) => theme.palette.getContrastText(theme.palette.primary.light)};
            background-color:${({ theme }) => theme.palette.primary.light}
        }
    }
`

export default function NavigationDrawer({ children, theme }: any) {

    const [open, setOpen] = useState(theme)
    const [mobileOpen, setMobileOpen] = useState(false)
    const classes = useStyles(theme)
    const handleDrawerToggle = useCallback(() => {
        setOpen(!open)
    }, [ open, setOpen ])
    const handleMobileToggle = useCallback(() => {
       setMobileOpen(!mobileOpen)
    }, [ ])
        
        return (
            <div className={classes.root}>
                <AppToolbar
                    handleDrawerToggle={handleDrawerToggle}
                    handleMobileToggle={handleMobileToggle} />
                <NavigationStyled >
                    <Hidden xsUp implementation="css">
                        <Drawer
                            variant="temporary"
                            className={classes.drawerMobile}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                            classes={{
                                paper: classes.drawerPaperMobile,
                            }}
                            open={mobileOpen}
                            onClose={handleMobileToggle}
                        >
                            <Divider />
                            <List>
                                {navigationItems.map((item, index) => (
                                    <NavLinkStyled to={item.link} key={index} activeClassName='link-active'>
                                        <ListItem button >
                                            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    </NavLinkStyled>
                                ))}
                            </List>
                            <Divider />
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            variant="permanent"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            })}
                            classes={{
                                paper: clsx(classes.drawerPaper, {
                                    [classes.drawerOpen]: open,
                                    [classes.drawerClose]: !open,
                                }),
                            }}
                        >
                            <Divider />
                            <List>
                                {navigationItems.map((item, index) => (
                                    <NavLinkStyled to={item.link} key={index} activeClassName='link-active'>
                                        <ListItem button >
                                            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    </NavLinkStyled>
                                ))}
                            </List>
                            <Divider />
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        {children}
                    </main>
                </NavigationStyled>
            </div>
        );
    }
//@ts-ignore
const getIcon = (icon: string) => {
    switch (icon) {
        case 'events':
            return <EventIcon></EventIcon>
        case 'dashboard':
            return <DashboardIcon></DashboardIcon>
        case 'settings':
            return <SettingsIcon></SettingsIcon>
        default:
            return <MailIcon />
    }
}