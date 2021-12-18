import React from "react"
import { Box, styled } from "@mui/system"
import { Typography } from "@mui/material"

const SBox = styled(Box)`
  padding: 0;
`
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <SBox p={2}>{children}</SBox>}
    </Typography>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

export default TabPanel
