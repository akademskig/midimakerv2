import LoginForm from "../components/forms/LoginForm/LoginForm"
import { useLocation } from "react-router-dom"
import RegisterForm from "../components/forms/RegisterForm/RegisterForm"
import TabPanel from "../components/common/TabPanel/TabPanel"
import { Tab, Tabs } from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"
import { SContainer, SIconButton, SPaper } from "./styled"

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     container: {
//       display: "flex",
//       flexDirection: "column",
//       alignContent: "center",
//       height: "100vh",
//       justifyContent: "center",
//     },
//     box: {
//       padding: Number(theme.spacing()) * 2,
//       textAlign: "center",
//       border: `solid 1px ${theme.palette.secondary.dark}`,
//       borderRadius: "50%",
//       width: "73px",
//       boxSizing: "border-box",
//     },
//     paper: {
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       padding: Number(theme.spacing()) * 3,
//       border: `solid 1px ${theme.palette.grey[300]}`,
//       borderRadius: theme.shape.borderRadius,
//     },
//     notification: {
//       minWidth: "auto",
//     },
//     tab: {
//       width: "50%",
//     },
//   })
// )

const getTabIndex = (hash: string) => {
  switch (hash) {
    case "#login":
      return 0
    case "#register":
      return 1
    default:
      return 0
  }
}
const AuthPage = () => {
  const { hash } = useLocation()

  return (
    <SContainer maxWidth="xs">
      <Tabs
        value={getTabIndex(hash)}
        indicatorColor="secondary"
        color="secondary"
        aria-label="Authentication tabs"
        variant="fullWidth"
      >
        <Tab label="LOGIN" href="/auth#login" />
        <Tab label="REGISTER" href="/auth#register" />
      </Tabs>
      <SPaper>
        <SIconButton>
          <LockIcon color="secondary" fontSize="large" />
        </SIconButton>
        <TabPanel value={getTabIndex(hash)} index={0}>
          <LoginForm />
        </TabPanel>
        <TabPanel value={getTabIndex(hash)} index={1}>
          <RegisterForm />
        </TabPanel>
      </SPaper>
    </SContainer>
  )
}

export default AuthPage
