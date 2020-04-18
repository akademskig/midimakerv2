import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import useNotify from '../../utils/notifications';

import { makeStyles, createStyles, Theme, List, IconButton, Divider } from '@material-ui/core';
import styled from 'styled-components';
import { EmailField, UsernameField } from './FormFields'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import LockIcon from '@material-ui/icons/Lock';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/auth/auth.selectors';
import { useUpdateUser } from '../../api/protected/users';
import { updateOk } from '../../redux/auth/auth.actions';
import { ChangePasswordForm } from './ChangePassword.form';

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing() * 3,
        border: `solid 1px ${theme.palette.grey[300]}`,
        borderRadius: theme.shape.borderRadius
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    formGroup: {
        margin: theme.spacing() * 1.5,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    submitButton: {
        width: '100px',
        marginTop: theme.spacing() * 2,
    },
    eyeButton: {
        minWidth: 'auto',
        padding: theme.spacing() * 0.5,
        color: theme.palette.secondary.dark
    },
    notification: {
        minWidth: 'auto'
    }
}));



const FormContainer = styled.div`
    ul{
        li{
        max-width: 400px;

            padding:  1em;
            display: flex;
            align-items: center;
            justify-content: space-between;
            span.actionButtons{
                display:inline-flex;
                padding:1em;
            }
        }
    }

    .edit-field{
        display: flex;
        align-items: center;
    }
`
const UserSettings = () => {
    const user = useSelector(selectUser)
    const [email, setEmail] = useState(user.email);

    const dispatch = useDispatch()
    const [usernameEdit, setUsernameEdit] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [username, setUsername] = useState(user.username);
    const { handleSubmit, register, errors } = useForm({ mode: "onChange" });
    const updateUser = useUpdateUser();
    const notify = useNotify();
    const classes = useStyles()
    const onSubmit = (values: any) => {
        if (values.length) return
        updateUser({ userId: user.id, email, username })
            .then(user => {
                console.log(user)
                setEmailEdit(false)
                setUsernameEdit(false)
                dispatch(updateOk(user))
                notify("ok", `Account for ${user.username} updated successfully!`)
            })
            .catch((err: Error) => { notify('error', err.message) });
    };


    const handleFieldCancel = (field: string) => {
        switch (field) {
            case "username": {
                setUsername(user.username)
                setUsernameEdit(false)
                break
            }
            case "email": {
                setEmail(user.email)
                setEmailEdit(false)
                break
            }
            default: break
        }
    }
    return (
        <FormContainer>
            <List>
                <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form} >
                    {
                        usernameEdit ?
                            <ListItem>
                                <UsernameField  {...{ username, setUsername, errors, register }} />
                                <span className="actionButtons">
                                    <Avatar>
                                        <IconButton type="submit" >
                                            <SaveIcon />
                                        </IconButton>
                                    </Avatar>
                                    <Avatar>
                                        <IconButton onClick={() => handleFieldCancel('username')}>
                                            <CancelIcon />
                                        </IconButton>
                                    </Avatar>
                                </span>
                            </ListItem> :
                            <ListItem>
                                <ListItemText primary="Username" secondary={username} />
                                <ListItemAvatar>
                                    <Avatar>
                                        <IconButton onClick={() => setUsernameEdit(true)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Avatar>
                                </ListItemAvatar>
                            </ListItem>
                    }
                    {
                        emailEdit ?
                            <ListItem>
                                <EmailField  {...{ email, setEmail, errors, register }} />
                                <span className="actionButtons">
                                    <Avatar>
                                        <IconButton type="submit" >
                                            <SaveIcon />
                                        </IconButton>
                                    </Avatar>
                                    <Avatar>
                                        <IconButton onClick={() => handleFieldCancel('email')}>
                                            <CancelIcon />
                                        </IconButton>
                                    </Avatar>
                                </span>

                            </ListItem> :
                            <ListItem>
                                <ListItemText primary="Email" secondary={email} />
                                <ListItemAvatar>
                                    <Avatar>
                                        <IconButton onClick={() => setEmailEdit(true)}>
                                            <EditIcon />
                                        </IconButton>
                                    </Avatar>
                                </ListItemAvatar>
                            </ListItem>
                    }
                    <Divider />
                </form>
                {
                    passwordEdit ?
                        <ChangePasswordForm {...{ setPasswordEdit }}></ChangePasswordForm>
                        :
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
                }
            </List>

        </FormContainer>
    )
}

export default UserSettings