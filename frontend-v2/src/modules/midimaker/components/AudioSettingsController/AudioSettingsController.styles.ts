import {
  Drawer,
  FormControl,
  InputLabel,
  ListItem,
  ListItemIcon,
  MenuItem,
  Paper,
  Slider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { CustomTooltip } from "../shared/Tooltip/CustomTooltip"

export const SDrawer = styled(Drawer)(({ theme }) => ({
  transition: theme?.transitions.create("width", {
    easing: theme?.transitions.easing.sharp,
    duration: theme?.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: theme.spacing(7) + 1,
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(7.5) + 1,
  },
  "> .MuiPaper-root": {
    backgroundColor: theme.palette.primary.main,
    overflow: "hidden",
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
export const SListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "auto",
}))
export const SListItemButton = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    cursor: 'pointer',
    "& svg": {
      color: theme.palette.secondary.light,
    },
  },
}))
export const SPopoverPaper = styled(Paper)(({ theme }) => ({
  position: "fixed",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  boxShadow: theme.shadows[5],
  fontFamily: "Fira Code !important",
  " > .MuiPaper-root": {
    backgroundColor: theme.palette.primary.main,
    overflow: "hidden",
    "& svg": {
      color: theme.palette.primary.contrastText,
    },
  },
}))
export const SFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiInput-root, .MuiInput-root:after": {
    color: theme.palette.primary.contrastText,
    fontSize: "1em",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.light,
    },
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
  minWidth: 130,
  display: "block",
  "& .MuiInputBase-root": {
    width: "100%",
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    textAlign: "left",
  },
}))
export const SInputLabel = styled(InputLabel)(({theme}) => ({
  display: "table-caption",
  textAlign: 'left',
  left:0,
  position: "relative",
  color: theme.palette.primary.contrastText,
  fontSize: "1em",
}))
export const SSelectMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
  },
}))
export const STooltip = styled(CustomTooltip)(({ theme }) => ({
  marginBottom: 0,
}))
export const SDurationSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.secondary.light,
}))
