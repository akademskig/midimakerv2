import { useCallback, useState, useEffect } from "react"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import DashboardIcon from "@mui/icons-material/DashboardOutlined"
import SettingsIcon from "@mui/icons-material/Settings"

import { navigationItems } from "./navigationItems"
import { NavLink } from "react-router-dom"
import AppToolbar from "../Toolbar"
import useScreenSize from "../../../../providers/ScreenSizeProvider/ScreenSize.provider"
import { Collections, InfoOutlined, MusicNote } from "@mui/icons-material"
import Drawer from "@mui/material/Drawer"
import { styled } from "@mui/material/styles"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import MailIcon from "@mui/icons-material/Mail"
import { Theme } from "@mui/material/styles"
import { useTheme } from "@emotion/react"
import { MUIStyledCommonProps } from "@mui/system"
import classNames from "classnames"

const DRAWER_WIDTH = 200
const RECT_COLOR = "#000"


const SRoot = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}))

const SDrawer = styled(Drawer)(({ theme, open }) => ({
  backgroundColor: RECT_COLOR,
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  [theme.breakpoints.down("xs")]: {
    width: 0,
  },
  overflowX: "hidden",
  ".MuiDrawer-paper": {
    width: open ? `${DRAWER_WIDTH}px` : '61px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    marginTop: "64px",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      marginTop: "56px",
    },
  },
}))

const SDrawerMobile = styled(Drawer)(({ theme }) => ({
  backgroundColor: RECT_COLOR,
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  [theme.breakpoints.down("xs")]: {
    width: 0,
  },
  [theme.breakpoints.up("xs")]: {
    width: 0,
    flexShrink: 0,
    display: "none",
  },
  ".MuiDrawer-paper": {
    width: DRAWER_WIDTH,
    [theme.breakpoints.up("xs")]: {
      width: 0,
      flexShrink: 0,
    },
    backgroundColor: theme.palette.primary.main,
  },
}))
const SNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.contrastText,
  "&:hover": {
    color: theme.palette.secondary.light,
    "& svg": {
      color: theme.palette.secondary.light,
    },
  },
  "& svg": {
    color: theme.palette.primary.contrastText,
  },
  "&.link-active": {
    "& .MuiButtonBase-root": {
      backgroundColor: theme.palette.primary.main,
    },
    "& svg": {},
  },
}))

type SMainProps = {
  width: number
  height: number
}

const SMain = styled("main")(
  ({
    theme,
    width,
    height,
  }: MUIStyledCommonProps<Theme> & SMainProps) => ({
    position: "relative",
    flexGrow: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "flexStart",
    marginTop: "56px",
    height: `${height - 60}px`,
    // width: `${width-200}px`,
    transition: theme?.transitions.create("margin-left", {
      easing: theme?.transitions.easing.sharp,
      duration: theme?.transitions.duration.leavingScreen,
    }),
    "&.md": {
      marginLeft: "200px",
      marginRight: 0,
      width: `${width - 200}px`,
    },
    "&.xs": {
      height: `${height - 56}px`,
      marginLeft: "57px",
      width: `${width - 56}px`,
    },
    "&.sm": {
      // width: `${width - 60}px`,
      marginLeft: "61px",
    },
    [theme?.breakpoints.up("xs") || ""]: {
      marginLeft: "57px",
    },
    [theme?.breakpoints.up("sm") || ""]: {
      marginTop: "64px",
      marginLeft: "61px",
      height: `${height - 64}px`,
    },
    [theme?.breakpoints.up("md") || ""]: {
      marginLeft: "200px",
    },
    display: "flex",
  })
)

export default function NavigationDrawer({ children }: any) {
  const [open, setOpen] = useState(false)
  const { isMobile, isDesktop, width, height, isTablet } = useScreenSize()
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const handleDrawerToggle = useCallback(() => {
    setOpen(!open)
  }, [open, setOpen])

  const handleMobileToggle = useCallback(() => {
    setMobileOpen(!mobileOpen)
  }, [mobileOpen])

  useEffect(() => {
    if (!isDesktop) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [setOpen, isDesktop, width])
console.log(navigationItems)
  return (
    <SRoot>
      <AppToolbar
        handleDrawerToggle={handleDrawerToggle}
        handleMobileToggle={handleMobileToggle}
      />
      <SRoot>
        {isMobile && (
          <SDrawerMobile
            anchor="left"
            variant="temporary"
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            open={mobileOpen}
            onClose={handleMobileToggle}
          >
            <Divider />
            <List>
              {navigationItems.map((item, index) => (
                <SNavLink to={item.link} key={index}>
                  <ListItem button>
                    <ListItemIcon
                      sx={{
                        color: (theme as Theme)?.palette.primary?.contrastText,
                      }}
                    >
                      {getIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                </SNavLink>
              ))}
            </List>
            <Divider />
          </SDrawerMobile>
        )}
        {!isMobile && (
          <SDrawer variant="permanent" open={open}>
            <Divider />
            <List>
              {navigationItems.map((item, index) => (
                <SNavLink to={item.link} key={index}>
                  <ListItem button>
                    <ListItemIcon
                      sx={{
                        color: (theme as Theme)?.palette.primary?.contrastText,
                      }}
                    >
                      {getIcon(item.icon)}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItem>
                </SNavLink>
              ))}
            </List>
            <Divider />
          </SDrawer>
        )}
        <SMain
          width={width}
          height={height}
          className={classNames(
            { sm: !open && isDesktop },
            { md: open },
            { xs: !open && isTablet && !isMobile }
          )}
        >
          {children}
        </SMain>
      </SRoot>
    </SRoot>
  )
}
//@ts-ignore
const getIcon = (icon: string) => {
  switch (icon) {
    case "dashboard":
      return <DashboardIcon></DashboardIcon>
    case "settings":
      return <SettingsIcon></SettingsIcon>
    case "midimaker":
      return <MusicNote></MusicNote>
    case "collections":
      return <Collections></Collections>
    case "info":
      return <InfoOutlined></InfoOutlined>
    default:
      return <MailIcon />
  }
}
