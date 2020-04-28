import styled from "styled-components"
import { Typography, Theme, Button } from "@material-ui/core"
import ListItem from '@material-ui/core/ListItem';
import { PasswordField } from './FormFields';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { selectUser } from '../../redux/auth/auth.selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useChangePassword } from '../../api/protected/users';
import useNotify from '../../utils/notifications';
import AlertIcon from '@material-ui/icons/Warning'
import { logout } from '../../redux/auth/auth.actions';


const ChangePasswordFormStyled = styled.div`
    padding: 1em 0;
    .title{
        svg{
            color: ${({ theme }: { theme: Theme }) => theme.palette.error.light}
        }
        p{
        }
        display: flex;
        padding-left: 1em;
    }
    .submitButton{
        background-color: ${({ theme }: { theme: Theme }) => theme.palette.error.light};
        color: ${({ theme }: { theme: Theme }) => theme.palette.error.contrastText}
    }
    .passwordButtons{
        width: 100%;
        display: flex;
        >:first-child{
            margin-right: 1em;
        }
        /* justify-content: space-between; */

        svg{
            margin-right: 0.2em;
        }
}
`

export const ChangePasswordForm = ({ setPasswordEdit }: any) => {
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const { handleSubmit, register, errors, formState } = useForm({ mode: "onChange" });
    const { isValid } = formState
    const user = useSelector(selectUser)
    const changePassword = useChangePassword()
    const notify = useNotify()
    const dispatch = useDispatch()
    const onChangePassword = (values: any) => {
        if (values.length) return
        changePassword({ userId: user.id, oldPassword, newPassword })
            .then(() => {
                setPasswordEdit(false)
                notify("ok", `Account for ${user.username} updated successfully!`)
            })
            .catch((err: any) => { 
                if(err.statusCode === 401 ||err.statusCode === 403){
                    dispatch(logout());}
                notify('error', err.message) 
            });

    }
    return (
        <ChangePasswordFormStyled>
            <div className="title">
                <Typography variant="button">Change password</Typography>
            </div>
            <form noValidate onSubmit={handleSubmit(onChangePassword)} className="change-password-form">
                <ListItem>
                    <PasswordField  {...{ name: "newPassword", label: "New password", password: newPassword, setPassword: setNewPassword, errors, register }} />
                </ListItem>
                <ListItem>
                    <PasswordField  {...{ name: "oldPassword", label: "Old password", password: oldPassword, setPassword: setOldPassword, errors, register }} />
                </ListItem>
                <ListItem>
                    <span className="passwordButtons">
                        <Button type="submit" variant="outlined" color="secondary" disabled={!isValid}>
                            <AlertIcon />
                            Change
                            </Button>
                        <Button type="submit" variant="outlined" className="cancelButton" color="primary" onClick={() => setPasswordEdit(false)}>
                            Cancel
                            </Button>
                    </span>
                </ListItem>
            </form>
        </ChangePasswordFormStyled>

    )
}