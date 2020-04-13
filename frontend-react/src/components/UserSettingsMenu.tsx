import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/auth/auth.actions';
import { Typography } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import UserIcon from '@material-ui/icons/Person'
import styled from 'styled-components';
import { selectUser } from '../redux/auth/auth.selectors';


const UserSettingsStyled = styled.div`
    button{
        color: ${({ theme }) => theme.palette.getContrastText(theme.palette.primary.main)};
        p{
            margin-left: 0.5em;
        }
    }
`
const MenuStyled = styled(Menu)`
    li{
         p{
            margin-left: 1em;
        }
    }
    a{
        text-decoration: none;
        color: inherit;
    }
`
export default function UserSettingsMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleLogout = () => {
        dispatch(logout())
    }


    return (
        <UserSettingsStyled>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <UserIcon />
                <Typography>
                    {user.username}
                </Typography>
            </Button>
            <MenuStyled
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <NavLink to="/user/profile">
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
            </MenuStyled>
        </UserSettingsStyled>
    );
}
