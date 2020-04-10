import React, { FunctionComponent, ReactComponentElement, useEffect } from 'react'


import { Sidebar } from 'react-admin';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Menu,
    Notification,
    setSidebarVisibility,
} from 'react-admin';


const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: 'white',
        position: 'relative',
    },
    appFrame: {
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'auto',
    },
    appBar: {
        position: 'relative',
        height: '50px'
    },
    contentWithSidebar: {
        display: 'flex',
        flexGrow: 1,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        padding: theme.spacing(3),
        paddingLeft: 5,
    },
    sideBar: {
        height: "calc(100vh - 50px)"
    }
}));

const MainLayout = ({
    children,
    logout,
    title,
    dashboard,
    menu,
    ...props
}: LayoutTypes) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const open = useSelector((state: any) => state.admin.ui.sidebarOpen);

    useEffect(() => {
        dispatch(setSidebarVisibility(true));
    }, [dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <AppBar className={classes.appBar} title={title} open={open} logout={logout} />
                <main className={classes.contentWithSidebar}>
                    <Sidebar className={classes.sideBar} {...props} >
                        <Menu logout={logout} hasDashboard={!!dashboard} />
                    </Sidebar>
                    <div className={classes.content}>
                        {children}
                    </div>
                </main>
                <Notification />
            </div>
        </div>
    );
};

type LayoutTypes = {
    children: FunctionComponent | ReactComponentElement<any>,
    dashboard: FunctionComponent | string,
    logout: any,
    title: string,
    menu: FunctionComponent

}

export default MainLayout;
