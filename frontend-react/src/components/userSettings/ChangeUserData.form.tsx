import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AuthCtx } from '../../providers/auth.provider';
import usersApi from '../../api/protected/users'

const ChangeUserDataForm = ({ field, value, handleFieldCancel, children, setEdit }: any) => {
    const { updateUser } = usersApi
    const { user } = useContext(AuthCtx)

    const { handleSubmit } = useForm({ mode: "onChange" });
    const onSubmit = async (values: any) => {
        if (values.length || !user?.id) return
        await updateUser({ userId: user.id, [field]: value })
        setEdit(false)
    };
    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}  >
            {children}
            <span className="actionButtons">
                <Avatar className="buttonSave">
                    <IconButton type="submit" >
                        <SaveIcon />
                    </IconButton>
                </Avatar>
                <Avatar className="buttonCancel">
                    <IconButton onClick={() => handleFieldCancel(field)}>
                        <CancelIcon />
                    </IconButton>
                </Avatar>
            </span>
        </form>
    )
}

export default ChangeUserDataForm