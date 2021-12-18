import { FiberManualRecord } from "@mui/icons-material"
import {
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { CustomTooltip } from "../shared/Tooltip/CustomTooltip"

export const SDrawer = styled(Drawer)(({ theme }) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: "fixed",
  right: 0,
  top: "125px",
  bottom: "61px",
  overflowX: "hidden",
  overflowY: "auto",
  backgroundColor: theme.palette.primary.main,
  zIndex: 10,
  width: theme.spacing(7) + 1,
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(7.5) + 1,
  },
  "& ::-webkit-scrollbar": {
    width: "3px",
    height: "3px",
  },
  "> .MuiPaper-root": {
    backgroundColor: theme.palette.primary.main,
    position: "relative",
    "& svg": {
      color: theme.palette.primary.contrastText,
    },
    "&.MuiDrawer-paperAnchorDockedRight": {
      borderLeft: "1px solid rgba(0,0,0, 0.5)",
    },
    "&.MuiDrawer-paperAnchorDockedLeft": {
      borderRight: "1px solid rgba(0,0,0, 0.5)",
    },
  },
}))
export const SListItemButton = styled(ListItemButton)(({ theme }) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: "fixed",
  right: 0,
  top: "125px",
  bottom: "61px",
  overflowX: "hidden",
  overflowY: "auto",
  backgroundColor: theme.palette.primary.main,
  zIndex: 10,
  width: theme.spacing(7) + 1,
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(7.5) + 1,
  },
  "& ::-webkit-scrollbar": {
    width: "3px",
    height: "3px",
  },
}))
export const SListItemChannel = styled(ListItem)(({ theme }) => ({
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),

  display: "flex",
  justifyContent: "center",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "#32517d",
  },
  "&.active": {
    backgroundColor: "#32517d",
  },
}))

export const SPopoverPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[5],
  fontFamily: "Fira Code !important",
}))
export const SFiberManualRecord = styled(FiberManualRecord)(({ theme }) => ({
  width: 25,
  height: 25,
  boxSizing: "content-box",
  borderRadius: "1px",
}))
export const SDeleteButton = styled(IconButton)(({ theme }) => ({
  "& :hover": {
    color: theme.palette.secondary.light,
  },
}))
export const SListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  "& :hover": {
    color: theme.palette.secondary.light,
  },
}))
export const STooltip = styled(CustomTooltip)(({ theme }) => ({
  marginBottom: 0,
  fontSize: theme.spacing(1),
}))
export const SFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInput-root, .MuiFormLabel-root": {
    color: theme.palette.primary.contrastText,
  },
  "& .MuiInput-underline": {
    "&:hover": {
      "&:before": {
        color: theme.palette.secondary.light,
        borderBottom: `2px solid ${theme.palette.secondary.light} !important`,
      },
    },
    "&:before": {
      borderColor: theme.palette.secondary.light,
    },
    "& svg": {
      color: theme.palette.secondary.light,
    },
  },
  margin: theme.spacing(1),
  minWidth: 220,
  display: "block",
  "& .MuiInputBase-root": {
    width: "100%",
    marginTop: theme.spacing(0.5),
    fontSize: "0.95em",
  },
  "& .MuiFormLabel-root": {
    position: "relative",
  },
}))
export const SMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
  },
}))
export const SChannelList = styled(List)(({ theme }) => ({
  padding: `${theme.spacing(0.75)}px 0`,
  overflowY: "auto",
}))

export const SSelect = styled(Select)(() => ({
  textAlign: 'left'
}))

export const SListItem = styled('div')(({ theme }) => ({
  position: 'relative',
 }))