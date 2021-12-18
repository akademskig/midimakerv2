import { ExpandLess, ExpandMore } from "@mui/icons-material"
import { ListItemButton, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

export const SPaper = styled(Paper)(({ theme }) => ({
  padding: 0,
  borderRadius: 0,
  position: "relative",
  margin: theme.spacing(1),
  width: '100%'
}))

export const SListItem = styled(ListItemButton)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  flexDirection: 'column',
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(1),
  padding: 0,
  '.MuiCollapse-root': {
    width: '100%',
    borderTop: theme.palette.common.black
  }
}))
export const SImage = styled("img")(({ theme }) => ({
  width: "200px",
  height: "200px",
}))
export const SList = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: 'inherit'
}))
export const SExpandMoreIcon = styled(ExpandMore)(({ theme }) => ({
  color: theme.palette.secondary.dark,
}))
export const SExpandLessIcon = styled(ExpandLess)(({ theme }) => ({
  color: theme.palette.secondary.dark,
}))
