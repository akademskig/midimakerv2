import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/auth/auth.actions';


const useStyles = makeStyles((theme: Theme) => createStyles({
    button: {
        color: theme.palette.getContrastText(theme.palette.primary.main)
    }
}));
export default function UserSettingsMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const dispatch = useDispatch()


    const handleLogout = ()=>{
        dispatch(logout())
    }

    const classes = useStyles()

    return (
        <div>
            <Button className={classes.button} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                User
      </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <NavLink to="/user/profile">
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                </NavLink>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
