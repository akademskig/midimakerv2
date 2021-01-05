import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from '../api/auth';
import { Typography } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToApp'
import SettingsIcon from '@material-ui/icons/Settings'
import UserIcon from '@material-ui/icons/Person'
import { AuthCtx } from '../providers/auth.provider'


// const UserSettingsStyled = styled.div`
//     button{
//         color: ${({ theme }) => theme.palette.getContrastText(theme.palette.primary.main)};
//         p{
//             margin-left: 0.5em;
//         }
//     }
// `
// const MenuStyled = styled(Menu)`
//     li{
//          p{
//             margin-left: 1em;
//         }
//     }
//     a{
//         text-decoration: none;
//         color: inherit;
//     }
// `
export default function UserSettingsMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const history = useHistory()
    const { user } = useContext(AuthCtx)
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
        <div>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
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
