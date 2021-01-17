import { Tooltip, withStyles } from "@material-ui/core";

export const CustomTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      boxShadow: theme.shadows[5],
      fontSize: 12,
      padding: theme.spacing(1),
      fontFamily: 'Fira Code',
      border: `1px solid ${theme.palette.primary.light}`
    },
  }))(Tooltip);