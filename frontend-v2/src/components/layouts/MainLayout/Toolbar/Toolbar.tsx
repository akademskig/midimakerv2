import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, IconButton, Theme, Toolbar } from "@mui/material"
import UserSettingsMenu from "../../../user-settings/UserSettingsMenu"
import { styled } from "@mui/material/styles"

const SAppBar = styled(AppBar)(({ theme }: { theme?: Theme }) => ({
  zIndex: 1,
  transition: theme?.transitions.create(["width", "margin"], {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.leavingScreen,
  }),
  position: "fixed",
  maxHeight: "64px",
  color: theme?.palette.primary.contrastText,
}))

const SToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  backgroundColor: theme.palette.primary.dark,
  [theme.breakpoints.up("xs")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}))

const SToggleButton = styled(IconButton)(({ theme }) => ({
  marginRight: "36px",
  display: "none",
  [theme.breakpoints.up("xs")]: {
    display: "flex",
  },
}))
const SMobileToggleButton = styled(IconButton)(({ theme }) => ({
  marginRight: 36,
  display: "flex",
  [theme.breakpoints.up("xs")]: {
    display: "none",
  },
}))

const AppToolbar = ({
  handleDrawerToggle,
  handleMobileToggle,
}: {
  handleDrawerToggle: any
  handleMobileToggle: any
}) => {
  return (
    <SAppBar>
      <SToolbar>
        <SToggleButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </SToggleButton>
        <SMobileToggleButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleMobileToggle}
        >
          <MenuIcon />
        </SMobileToggleButton>
        <UserSettingsMenu />
      </SToolbar>
    </SAppBar>
  )
}
export default AppToolbar
