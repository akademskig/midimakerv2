import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import useNotify from '../utils/notifications';

import { Button, Container, FormGroup, Paper, TextField, InputAdornment, makeStyles, createStyles, Theme, useTheme } from '@material-ui/core';
import EyeIcon from '@material-ui/icons/RemoveRedEyeOutlined';
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

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleSubmit, register, errors } = useForm();
    // const login = useLogin();
    const notify = useNotify();
    const classes = useStyles()
    const [passwordType, setPasswordType] = useState('password')
    const onSubmit = (values: any) => {
        // if (values.length) return
        // login({ email, password })
        //   .catch((err: Error) => { notify('error', err) });
    };
    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <FormGroup className={classes.formGroup}>
                <TextField
                    required
                    error={!!errors.email}
                    label="Email"
                    id="email"
                    color="secondary"
                    name="email"
                    value={email}
                    onChange={(e) => { console.log(e.target); setEmail(e.target.value) }}
                    helperText={errors.email && errors.email.message}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'Email is required'
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Invalid email"
                            }
                        })
                    }
                />
            </FormGroup>
            <FormGroup className={classes.formGroup}>
                <TextField
                    required
                    error={!!errors.password}
                    name="password"
                    color="secondary"
                    type={passwordType}
                    label="Password"
                    id="password"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    helperText={errors.password && errors.password.message}
                    inputRef={
                        register({
                            required: {
                                value: true,
                                message: 'Password is required'
                            },
                            minLength: {
                                value: 8,
                                message: "Password should consist of at least 8 characters"
                            }
                        })
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button
                                    onMouseDown={() => setPasswordType('text')}
                                    onMouseUp={() => setPasswordType('password')}
                                    onMouseLeave={() => setPasswordType('password')}
                                    className={classes.eyeButton}
                                >
                                    <EyeIcon />

                                </Button>
                            </InputAdornment>
                        )
                    }}
                />
            </FormGroup>
            <Button type="submit" color="secondary" variant="contained" className={classes.submitButton}>LOGIN</Button>
        </form>
    )
}

export default LoginForm