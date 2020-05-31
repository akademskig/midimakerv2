import React, { useState } from 'react';
import { useForm } from "react-hook-form";

import { Theme, List, IconButton, Divider } from '@material-ui/core';
import styled from 'styled-components';
import { EmailField, UsernameField } from './FormFields'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/auth.selectors';
import { ChangePasswordForm } from './ChangePassword.form';
import ChangeUserDataForm from './ChangeUserData.form';

const FormContainer = styled.div`
    ul{
        li{
        max-width: 400px;

            padding:  1em;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .buttonEdit{
                    background-color: ${({ theme }: { theme: Theme }) => theme.palette.primary.light};
                    svg{
                        color: white;
                    }
                }
            span.actionButtons{
                display:inline-flex;
                padding:0.75em;
                .buttonSave{
                    background-color: ${({ theme }: { theme: Theme }) => theme.palette.primary.light};
                    svg{
                        color: white;
                    }
                };
                .buttonCancel{
                    background-color: ${({ theme }: { theme: Theme }) => theme.palette.error.light};
                    svg{
                        color: white;
                    }
                };
              
                >:first-child{
                    margin-right: 0.2em;
                }
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
    const [usernameEdit, setUsernameEdit] = useState(false);
    const [emailEdit, setEmailEdit] = useState(false);
    const [passwordEdit, setPasswordEdit] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const { register, errors } = useForm({ mode: "onChange" });

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
                {
                    usernameEdit ?
                        <ListItem>
                            <ChangeUserDataForm {...{ field: "username", value: username, handleFieldCancel, setEdit: setUsernameEdit }}>
                                <UsernameField  {...{ username, setUsername, errors, register }} />
                            </ChangeUserDataForm>
                        </ListItem> :
                        <ListItem>
                            <ListItemText primary="Username" secondary={username} />
                            <ListItemAvatar>
                                <Avatar className="buttonEdit">
                                    <IconButton color="primary" onClick={() => setUsernameEdit(true)}>
                                        <EditIcon />
                                    </IconButton>
                                </Avatar>
                            </ListItemAvatar>
                        </ListItem>
                }
                {
                    emailEdit ?
                        <ListItem>
                            <ChangeUserDataForm {...{ field: "email", value: email, handleFieldCancel, setEdit: setEmailEdit }}>
                                <EmailField  {...{ email, setEmail, errors, register }} />
                            </ChangeUserDataForm>
                        </ListItem> :
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
                }
                <Divider />
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