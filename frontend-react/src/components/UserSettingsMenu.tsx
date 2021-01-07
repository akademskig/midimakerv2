import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from '../api/auth';
import { makeStyles, Typography } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import UserIcon from '@material-ui/icons/Person'
import { AuthCtx } from '../providers/auth.provider'

const useStyles = makeStyles((theme) => ({
    item: {
        color: theme.palette.primary.contrastText
    }
}))
export default function UserSettingsMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const history = useHistory()
    const { user } = useContext(AuthCtx)
    const classes = useStyles()
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        await logout()
        history.push("/auth")
    }

    return (
        <div >
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.item}>
                <UserIcon />
                <Typography>
                    {user && user.username}
                </Typography>
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <NavLink to="/settings#user">
                    <MenuItem onClick={handleClose}>
                        <SettingsIcon fontSize="small" />
                        <Typography>
                            Profile
                    </Typography>
                    </MenuItem>
                </NavLink>
                <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" />
                    <Typography>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </div>
    );
}
