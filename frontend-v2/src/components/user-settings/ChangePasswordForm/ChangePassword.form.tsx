import { PasswordField } from "../FormFields/FormFields"
import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { AuthCtx } from "../../../providers/AuthProvider"
import { styled } from "@mui/system"
import { Button, ListItem, Theme, Typography } from "@mui/material"
import AlertIcon from '@mui/icons-material/Warning'
import useNotify from "../../../hooks/useNotify"
import useUser from "../../../hooks/useUser"

const ChangePasswordFormStyled = styled('div')(({theme})=>`
  padding: 1em 0;
  .title {
    svg {
      color: ${({ theme }: { theme: Theme }) => theme.palette.error.light};
    }
    display: flex;
    padding-left: 1em;
  }
  .submitButton {
    background-color: ${theme.palette.error.light};
    color: ${theme.palette.error.contrastText};
  }
  .passwordButtons {
    width: 100%;
    display: flex;
    > :first-child {
      margin-right: 1em;
    }
    svg {
      margin-right: 0.2em;
    }
  }
`)

const ChangePasswordForm = ({ setPasswordEdit }: any) => {
  const { changePassword } = useUser()
  const notify = useNotify()
  const [newPassword, setNewPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const { handleSubmit, register, formState: { errors, isValid } } = useForm({
    mode: "onChange",
  })
  const { user } = useContext(AuthCtx)

  const onChangePassword = async (values: any) => {
    if (values.length || !user?.id) return
    changePassword({ userId: user.id, oldPassword, newPassword })
      .then(() => notify("success", "User updated"))
      .catch((error) => notify("error", error.message))
    setPasswordEdit(false)
  }

  return (
    <ChangePasswordFormStyled>
      <div className="title">
        <Typography variant="button">Change password</Typography>
      </div>
      <form
        noValidate
        onSubmit={handleSubmit(onChangePassword)}
        className="change-password-form"
      >
        <ListItem>
          <PasswordField
            {...{
              name: "newPassword",
              label: "New password",
              password: newPassword,
              setPassword: setNewPassword,
              errors,
              register,
            }}
          />
        </ListItem>
        <ListItem>
          <PasswordField
            {...{
              name: "oldPassword",
              label: "Old password",
              password: oldPassword,
              setPassword: setOldPassword,
              errors,
              register,
            }}
          />
        </ListItem>
        <ListItem>
          <span className="passwordButtons">
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              disabled={!isValid}
            >
              <AlertIcon />
              Change
            </Button>
            <Button
              type="submit"
              variant="outlined"
              className="cancelButton"
              color="primary"
              onClick={() => setPasswordEdit(false)}
            >
              Cancel
            </Button>
          </span>
        </ListItem>
      </form>
    </ChangePasswordFormStyled>
  )
}
export default ChangePasswordForm