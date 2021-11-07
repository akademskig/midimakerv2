import React, { useContext, useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"

import { List, IconButton, Divider } from "@material-ui/core"
import { EmailField, UsernameField } from "./FormFields"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import EditIcon from "@material-ui/icons/Edit"
import LockIcon from "@material-ui/icons/Lock"
import { ChangePasswordForm } from "./ChangePassword.form"
import ChangeUserDataForm from "./ChangeUserData.form"
import { AuthCtx } from "../../providers/auth.provider"

const UserSettings = () => {
  const { user } = useContext(AuthCtx)
  const [usernameEdit, setUsernameEdit] = useState(false)
  const [emailEdit, setEmailEdit] = useState(false)
  const [passwordEdit, setPasswordEdit] = useState(false)
  const [email, setEmail] = useState(user && user.email)
  const [username, setUsername] = useState(user && user.username)
  const { register, errors } = useForm({ mode: "onChange" })

  useEffect(() => {
    setUsername(user?.username || "")
    setEmail(user?.email || "")
  }, [user])

  const handleFieldCancel = useCallback(
    (field: string) => {
      switch (field) {
        case "username": {
          setUsername(user?.username || username)
          setUsernameEdit(false)
          break
        }
        case "email": {
          setEmail(user?.email || email)
          setEmailEdit(false)
          break
        }
        default:
          break
      }
    },
    [user, email, username]
  )
  return (
    <div>
      <List>
        {usernameEdit ? (
          <ListItem>
            <ChangeUserDataForm
              {...{
                field: "username",
                value: username,
                handleFieldCancel,
                errors,
              }}
            >
              <UsernameField {...{ username, setUsername, errors, register }} />
            </ChangeUserDataForm>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText primary="Username" secondary={username} />
            <ListItemAvatar>
              <Avatar className="buttonEdit">
                <IconButton
                  color="primary"
                  onClick={() => setUsernameEdit(true)}
                >
                  <EditIcon />
                </IconButton>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        )}
        {emailEdit ? (
          <ListItem>
            <ChangeUserDataForm
              {...{ field: "email", value: email, handleFieldCancel, errors }}
            >
              <EmailField {...{ email, setEmail, errors, register }} />
            </ChangeUserDataForm>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText primary="Email" secondary={email} />
            <ListItemAvatar>
              <Avatar className="buttonEdit">
                <IconButton onClick={() => setEmailEdit(true)}>
                  <EditIcon />
                </IconButton>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        )}
        <Divider />
        {passwordEdit ? (
          <ChangePasswordForm {...{ setPasswordEdit }}></ChangePasswordForm>
        ) : (
          <ListItem>
            <ListItemText primary="Password" secondary="*********" />
            <ListItemAvatar>
              <IconButton onClick={() => setPasswordEdit(true)}>
                <Avatar>
                  <LockIcon />
                </Avatar>
              </IconButton>
            </ListItemAvatar>
          </ListItem>
        )}
      </List>
    </div>
  )
}

export default UserSettings
