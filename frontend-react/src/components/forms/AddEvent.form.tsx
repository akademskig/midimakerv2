import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, FormGroup, TextField, InputAdornment, makeStyles, createStyles, Theme } from '@material-ui/core';
import EyeIcon from '@material-ui/icons/RemoveRedEyeOutlined';
import { useHistory } from 'react-router-dom';
import { addNewItem } from '../../redux/crud/crud.actions';
import { useDispatch } from 'react-redux';
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
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    formGroup: {
        width: '100%',
        margin: theme.spacing() * 1.5,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    submitButton: {
        width: '80%',
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

export default function AddEventForm() {
    const [name, setName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date().toLocaleString());
    console.log(endTime)
    const [duration, setDuration] = useState('');
    const dispatch = useDispatch()
    const { handleSubmit, register, errors } = useForm();
    const history = useHistory()
    const classes = useStyles()
    const onSubmit = (values: any) => {
        if (values.length) return
        dispatch(addNewItem({ meta: { resource: 'events'}, data: { events: {name, startTime, endTime} } }))
    };
    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <FormGroup className={classes.formGroup}>
                <TextField
                    name="name"
                    color="secondary"
                    type="text"
                    error={!!errors.name}
                    label="Name"
                    id="name"
                    value={name}
                    helperText={errors.name && errors.name.message}
                    onChange={(e: any) => setName(e.target.value)}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'Name is required'
                            },
                        })
                    }
                />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
                <TextField
                    type="datetime-local"
                    required
                    error={!!errors.startTime}
                    label="Start Time"
                    id="startTime"
                    color="secondary"
                    name="startTime"
                    value={startTime}
                    onChange={(e: any) => { setStartTime(e.target.value) }}
                    helperText={errors.startTime && errors.startTime.message}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'Date is required'
                            },
                        })
                    }
                    InputLabelProps={{
                        shrink: true,
                      }}
                />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
                <TextField
                    type="datetime-local"
                    required
                    error={!!errors.endTime}
                    name="endtime"
                    color="secondary"
                    label="End Time"
                    id="endTime"
                    value={endTime}
                    onChange={(e: any) => setEndTime(e.target.value)}
                    helperText={errors.endTime && errors.endTime.message}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'End time is required'
                            },
                        })
                    }
                    InputLabelProps={{
                        shrink: true,
                      }}

                />
            </FormGroup>
            <Button type="submit" color="secondary" variant="contained" className={classes.submitButton}>Add event</Button>
        </form>
    )
}