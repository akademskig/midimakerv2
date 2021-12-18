import NavigationDrawer from "./NavigationDrawer"
import { MainRoutes } from "../../../routes"

const MainLayout = () => {
  return (
    <NavigationDrawer>
      <MainRoutes />
    </NavigationDrawer>
  )
}

export default MainLayout
