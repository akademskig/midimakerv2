import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { Theme, makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
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
import useScreenSize from '../../../providers/screenSize.provider';

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
            [theme.breakpoints.up('xs')]: {
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
            [theme.breakpoints.up('xs')]: {
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
            [theme.breakpoints.down('xs')]: {
                marginTop: '56px'
            },
        },
        drawerPaperMobile: {
            width: drawerWidth,
            [theme.breakpoints.up('xs')]: {
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
    const [open, setOpen] = useState(false)
    const { isMobile, isTablet, isDesktop  } = useScreenSize()
    const [mobileOpen, setMobileOpen] = useState(false)
    const classes = useStyles(theme)

    const handleDrawerToggle = useCallback(() => {
        setOpen(!open)
    }, [ open, setOpen ])

    const handleMobileToggle = useCallback(() => {
       setMobileOpen(!mobileOpen)
    }, [ mobileOpen ])

    useEffect(() => {
        if(!isDesktop){
            setOpen(false)
        }
        else if(isDesktop){
            setOpen(true)
        }
    }, [setOpen, isDesktop])
        
        return (
            <div className={classes.root}>
                <AppToolbar
                    handleDrawerToggle={handleDrawerToggle}
                    handleMobileToggle={handleMobileToggle} />
                <NavigationStyled >
                    {isMobile && 
                        <Drawer
                        anchor='left'
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
                        }
                   { !isMobile && 
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
                   }
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
        case 'dashboard':
            return <DashboardIcon></DashboardIcon>
        case 'settings':
            return <SettingsIcon></SettingsIcon>
        default:
            return <MailIcon />
    }
}