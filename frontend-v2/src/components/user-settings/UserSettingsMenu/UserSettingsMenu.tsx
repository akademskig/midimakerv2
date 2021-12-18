import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material"
import React, { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { AuthCtx } from "../../../providers/AuthProvider"
import UserIcon from "@mui/icons-material/Person"
import LogoutIcon from "@mui/icons-material/Logout"
import SettingsIcon from "@mui/icons-material/Settings"
import useAuth from "../../../hooks/useAuth"
import { LoginOutlined } from "@mui/icons-material"
import { styled } from "@mui/system"

const SMenuItem = styled(MenuItem)(({ theme }) => ({
  ".MuiTypography-root": {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    textDecoration: "none",
  },
  ".MuiSvgIcon-root": {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    marginRight: theme.spacing(1),
  },
}))
export default function UserSettingsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user } = useContext(AuthCtx)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const { logout, isAuth } = useAuth()
  const theme = useTheme()
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = async () => {
    logout()
    navigate("/auth")
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          color: theme.palette.primary.contrastText,
        }}
      >
        <UserIcon />
        <Typography>{user && user.username}</Typography>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isAuth() ? (
          [
            <NavLink key={0} to="/settings#user">
              <SMenuItem onClick={handleClose}>
                <SettingsIcon fontSize="small" />
                <Typography>Profile</Typography>
              </SMenuItem>
            </NavLink>,
            <SMenuItem key={1} onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
              <Typography>Logout</Typography>
            </SMenuItem>,
          ]
        ) : (
          <NavLink key={0} to="/auth">
            <SMenuItem onClick={handleClose}>
              <LoginOutlined fontSize="small" />
              <Typography>Login</Typography>
            </SMenuItem>
          </NavLink>
        )}
      </Menu>
    </div>
  )
}
