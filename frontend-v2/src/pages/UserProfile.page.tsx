import LockIcon from "@mui/icons-material/Lock"
import { SContainer } from "./styled"
import { Button } from "@mui/material"


const UserProfile = () => {
  return (
    <SContainer>
      <Button>
        <LockIcon color="secondary" fontSize="large" />
      </Button>
    </SContainer>
  )
}

export default UserProfile
