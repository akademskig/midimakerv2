import { useContext } from "react"
import { AuthCtx } from "../providers/AuthProvider"
const useAuth = () => useContext(AuthCtx)
export default useAuth
