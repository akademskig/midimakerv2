import { Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"

export const CustomTooltip = styled(Tooltip)(({ theme }) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    boxShadow: theme.shadows[5],
    fontSize: 12,
    padding: theme.spacing(1),
    fontFamily: "Fira Code",
    border: `1px solid ${theme.palette.primary.light}`,
  },
}))
