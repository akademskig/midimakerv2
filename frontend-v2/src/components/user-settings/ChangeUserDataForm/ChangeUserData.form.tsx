import React, { useContext } from "react"
import { isEmpty } from "lodash"
import { useForm } from "react-hook-form"
import { AuthCtx } from "../../../providers/AuthProvider"
import { Avatar, IconButton } from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import CancelIcon from "@mui/icons-material/Cancel"
import { styled } from "@mui/system"
import useNotify from "../../../hooks/useNotify"
import useUser from "../../../hooks/useUser"

const SForm = styled("form")`
  display: "flex";
`
const ActionButtons = styled("span")(
  ({ theme }) => `
  display: flex;
  width: 85px;
  justify-content: space-between;
  align-items: center;
  color: ${theme.palette.primary.contrastText};
`
)
const SIconButton = styled(IconButton)(
  ({ theme }) => `
  color: ${theme.palette.error.light};
`
)
const ChangeUserDataForm = ({
  field,
  value,
  handleFieldCancel,
  children,
  errors,
}: any) => {
  const { updateUser } = useUser()
  const { user } = useContext(AuthCtx)
  const notify = useNotify()
  const { handleSubmit } = useForm({ mode: "onChange" })
  const onSubmit = (values: any) => {
    if (values.length || !user?.id) {
      return handleFieldCancel(field)
    }
    updateUser({ userId: user.id, [field]: value })
      .then(() => notify("success", "User updated"))
      .catch(() => notify("error", "An error occurred."))
    handleFieldCancel(field)
  }
  return (
    <SForm noValidate onSubmit={handleSubmit(onSubmit)}>
      {children}
      <ActionButtons>
        <Avatar>
          <SIconButton disabled={!isEmpty(errors[field])} type="submit">
            <SaveIcon />
          </SIconButton>
        </Avatar>
        <Avatar>
          <IconButton
            onClick={() => handleFieldCancel(field)}
            className="buttonCancel"
          >
            <CancelIcon />
          </IconButton>
        </Avatar>
      </ActionButtons>
    </SForm>
  )
}

export default ChangeUserDataForm
