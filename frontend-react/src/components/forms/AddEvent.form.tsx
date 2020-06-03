import React, { useState, Dispatch, SetStateAction } from 'react';
import { useForm } from "react-hook-form";
import { Button, FormGroup, TextField, InputAdornment, makeStyles, createStyles, Theme, IconButton, Tooltip } from '@material-ui/core';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import { useHistory } from 'react-router-dom';
import { addNewItem } from '../../redux/crud/crud.actions';
import { useDispatch } from 'react-redux';
import GoogleMapC from '../googleMap/GoogleMapC';

const useStyles = makeStyles((theme: Theme) => createStyles({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing() * 3,
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
    formGroupLoc: {
        width: '100%',
        margin: theme.spacing() * 1.5,
        justifyContent: 'space-between'
    },
    submitButton: {
        width: '80%',
        marginTop: theme.spacing() * 2,
    },

    notification: {
        minWidth: 'auto'
    }
}));

export default function AddEventForm({ modalClose }: { modalClose: Dispatch<SetStateAction<boolean>>}) {
    const [name, setName] = useState('');
    const [locationName, setLocationName] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date().toLocaleString());
    const [mapOpen, setMapOpen] = useState(false);
    const [duration, setDuration] = useState('');
    const dispatch = useDispatch()
    const [coords, setCoords] = useState({ lat: 0, lng: 0 })
    const { handleSubmit, register, errors} = useForm();
    const [locationError, setLocationError] = useState(false)
    const classes = useStyles()
    const onSubmit = (values: any) => {
        if(!coords.lat && !coords.lng){
            setLocationError(true)
            return
        }
      
        if (values.length) return
        const location ={
            name: locationName,
            latitude: coords.lat,
            longitude: coords.lng
        }
        dispatch(addNewItem({ meta: { resource: 'events' }, data: { events: { name, startTime, endTime, location } } }))
        modalClose(false)
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
                    variant='outlined'
                    defaultValue={name}
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
                    variant='outlined'
                    error={!!errors.startTime}
                    label="Start Time"
                    id="startTime"
                    color="secondary"
                    name="startTime"
                    defaultValue={startTime}
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
                    name="endTime"
                    variant='outlined'
                    color="secondary"
                    label="End Time"
                    id="endTime"
                    defaultValue={endTime}
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
            <FormGroup className={classes.formGroupLoc}>
                <TextField
                    type="text"
                    required
                    variant='outlined'
                    error={!!errors.locationName}
                    name="locationName"
                    color="secondary"
                    label="Location name"
                    id="locationName"
                    defaultValue={locationName}
                    onChange={(e: any) => setLocationName(e.target.value)}
                    helperText={errors.locationName && errors.locationName.message}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'Location name is required'
                            },
                        })
                    }
                    InputProps={{
                        endAdornment: (
                            <Tooltip title="Add Location" aria-label="Add Location">
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setMapOpen(true)}>
                                        <AddLocationIcon> </AddLocationIcon>
                                    </IconButton>
                                </InputAdornment>
                            </Tooltip>
                        )
                    }}/>

                { locationError && <p>Location not set!</p>}
            </FormGroup>

            {mapOpen && <GoogleMapC {...{ coords, setCoords, mapOpen,setMapOpen }} />}
            <Button type="submit" color="secondary" variant="contained" className={classes.submitButton}>Add event</Button>
            <Button type="button" color="secondary" variant="contained" onClick={() => modalClose(false)} className={classes.submitButton}>Close</Button>
        </form>
    )
}