import { useLocation } from "react-router-dom"
import TabPanel from "../components/common/TabPanel"
import UserSettings from "../components/user-settings/UserSettings/UserSettings"
import { Container, Tab, Tabs } from "@mui/material"
import { styled } from "@mui/system"

export const SContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  height: "100vh",
  paddingTop: theme.spacing(2),
}))

const SettingsPage = () => {
  const getTabIndex = (hash: string) => {
    switch (hash) {
      case "#user":
        return 0
      case "#preferences":
        return 1
      default:
        return 0
    }
  }
  const { hash } = useLocation()
  return (
    <SContainer>
      <Tabs
        value={getTabIndex(hash)}
        indicatorColor="secondary"
        color="secondary"
        aria-label="User settings tabs"
      >
        <Tab label="USER" href="#user" />
        <Tab label="PREFERENCES" href="#preferences" />
      </Tabs>
      <TabPanel value={getTabIndex(hash)} index={0}>
        <UserSettings />
      </TabPanel>
      <TabPanel value={getTabIndex(hash)} index={1}></TabPanel>
    </SContainer>
  )
}

export default SettingsPage
