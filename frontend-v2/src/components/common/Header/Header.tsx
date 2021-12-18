import MenuIcon from "@mui/icons-material/MenuRounded"
import UserSettingsMenu from "../../user-settings/UserSettingsMenu/UserSettingsMenu"
import { styled } from "@mui/system"
import { IconButton, Toolbar } from "@mui/material"

const SToolbar = styled(Toolbar)(
  ({ theme }) => `
        backgroundColor: ${theme.palette.primary.main};
        color: ${theme.palette.getContrastText(theme.palette.primary.main)};,
        justifyContent: 'space-between';
`
)
const Header = () => {
  return (
    <SToolbar>
      <IconButton edge="start" color="inherit" aria-label="menu">
        <MenuIcon />
      </IconButton>
      <UserSettingsMenu />
    </SToolbar>
  )
}

export default Header
