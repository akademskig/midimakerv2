import React from 'react';
import { Typography, createStyles, Theme, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
 
const useStyles = makeStyles((theme: Theme) => createStyles({
    tabPanelBox:{
      padding: `${theme.spacing() * 2}px 0`,
    },
    typography:{
        width: '82%'
    }
  }));
 const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles()
    return (
      <Typography
        className={classes.typography}
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box className={classes.tabPanelBox} p={2}>{children}</Box>}
      </Typography>
    );
  }

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

  export default TabPanel