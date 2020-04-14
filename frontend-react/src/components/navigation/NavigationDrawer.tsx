import React, { Component } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Hidden from '@material-ui/core/Hidden';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EventIcon from '@material-ui/icons/Event';
import MailIcon from '@material-ui/icons/Mail';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import UserSettingsMenu from '../UserSettingsMenu';
import { navigationItems } from './navigationItems';
import { NavLink } from 'react-router-dom';

const drawerWidth = 220;

const styles = (theme: any) =>
    ({
        root: {
            display: 'flex',
            flexDirection: 'column'
        },
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
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.spacing(0, 2),
        },
        appContent: {
            display: 'flex'
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
    })

class NavigationDrawer extends Component<{ children: any, classes: any }> {

    state = {
        open: false,
        mobileOpen: false
    }
    handleDrawerToggle = () => {
        this.setState({
            open: !this.state.open
        })
    }
    handleMobileToggle = () => {
        this.setState({
            mobileOpen: !this.state.mobileOpen,
        })
    }
    render() {
        const { children, classes } = this.props
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    className={classes.appBar}
                >
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerToggle}
                            edge="start"
                            className={classes.toggleButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleMobileToggle}
                            edge="start"
                            className={classes.mobileToggleButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <UserSettingsMenu />
                    </Toolbar>
                </AppBar>
                <nav className={classes.appContent}>
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
                            open={this.state.mobileOpen}
                            onClose={this.handleMobileToggle}
                        >
                            <Divider />
                            <List>
                                {navigationItems.map((item, index) => (
                                    <NavLink to={item.link} key={index} replace>
                                        <ListItem button >
                                            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    </NavLink>
                                ))}
                            </List>
                            <Divider />
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            variant="permanent"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: this.state.open,
                                [classes.drawerClose]: !this.state.open,
                            })}
                            classes={{
                                paper: clsx(classes.drawerPaper, {
                                    [classes.drawerOpen]: this.state.open,
                                    [classes.drawerClose]: !this.state.open,
                                }),
                            }}
                        >
                            <Divider />
                            <List>
                                {navigationItems.map((item, index) => (
                                    <NavLink to={item.link} key={index} replace>
                                        <ListItem button >
                                            <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    </NavLink>
                                ))}
                            </List>
                            <Divider />
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        {children}
                    </main>
                </nav>
            </div>
        );
    }
}
//@ts-ignore
export default withStyles(styles)(NavigationDrawer)
const getIcon = (icon: string) => {
    switch (icon) {
        case 'events':
            return <EventIcon></EventIcon>
        case 'dashboard':
            return <DashboardIcon></DashboardIcon>
        default:
            return <MailIcon />
    }
}