import { Button, IconButton, List } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SContainer = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "0.5em",
  width: "100%",
  backgroundColor: theme.palette.primary.main,
  justifyContent: "space-between",
}))
export const SIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
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
export const SButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
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
export const SFileList = styled(List)(() => ({
  maxHeight: "300px",
  overflowY: "auto",
}))
export const SInput = styled('input')({
  display: 'none',
});