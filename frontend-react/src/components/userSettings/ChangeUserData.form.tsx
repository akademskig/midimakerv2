import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useUpdateUser } from '../../api/protected/users';
import useNotify from '../../utils/notifications';
import { updateUserOk, logout, updateUserStart } from '../../redux/auth/auth.actions';
import { selectUser } from '../../redux/auth/auth.selectors';
import { requestStart } from '../../redux/global/global.actions';
import { getError } from '../../redux/global/global.selectors';
import { crudUpdateStart } from '../../redux/crud/crud.actions';

const ChangeUserDataForm = ({ field, value, handleFieldCancel, children, setEdit }: any) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const { handleSubmit } = useForm({ mode: "onChange" });
    const updateUser = useUpdateUser();
    const notify = useNotify();
    const onSubmit = (values: any) => {
        if (values.length) return
        dispatch(crudUpdateStart({ meta:{ resource: 'users', endpoint: '/'},  data: { userId: user.id, [field]: value } }))
        setEdit(false)
        // updateUser({ userId: user.id, [field]: value})
        //     .then(user => {
        //         dispatch(updateUserOk(user))
        //         
        //         notify("ok", `Account for ${user.username} updated successfully!`)
        //     })
        //     .catch((err: any) => { 
        //         console.log(err)
        //         if(err.statusCode === 401 ||err.statusCode === 403)
        //         dispatch(logout());
        //         notify('error', err.message) 
        //     });
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