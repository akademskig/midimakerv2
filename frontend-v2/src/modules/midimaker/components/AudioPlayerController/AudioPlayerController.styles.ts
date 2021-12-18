import { IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SContainer = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "0.5em",
  height: "61px",
  width: "100%",
  backgroundColor: theme.palette.primary.main,
  justifyContent: "space-between",
}))
export const SAudioControlButtons = styled("div")(() => ({
  display: "flex",
}))
export const SAudioButton = styled(IconButton)(({ theme }) => ({
  ".MuiSvgIcon-root": {
    color: theme.palette.primary.contrastText,
  },
  padding: "0.2em 0.5em",
  "&.active": {
    color: "red",
  },
  "&:hover": {
    "& svg": {
      color: theme.palette.secondary.light,
    },
  },
}))
export const SFSControllerButtons = styled('div')(() => ({
  display: "flex",
}))
export const SFileList = styled(IconButton)(() => ({
  maxHeight: "300px",
  overflowY: "auto",
}))
