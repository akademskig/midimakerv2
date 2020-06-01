import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectUser } from '../../redux/auth/auth.selectors';
import { crudUpdateStart } from '../../redux/crud/crud.actions';

const ChangeUserDataForm = ({ field, value, handleFieldCancel, children, setEdit }: any) => {
    const user = useSelector(selectUser)
    const dispatch = useDispatch()
    const { handleSubmit } = useForm({ mode: "onChange" });
    const onSubmit = (values: any) => {
        if (values.length) return
        dispatch(crudUpdateStart({ meta:{ resource: 'users', endpoint: '/'},  data: { userId: user.id, [field]: value } }))
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