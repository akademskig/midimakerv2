
import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { Button, Container, FormGroup, Paper, TextField, InputAdornment } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import EyeIcon from '@material-ui/icons/RemoveRedEyeOutlined';
import { useForm, } from "react-hook-form";
import { makeStyles, createStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    height: '100vh',
    justifyContent: 'center',
  },
  box: {
    padding: theme.spacing() * 2,
    textAlign: 'center',
    border: `solid 1px ${theme.palette.primary.dark}`,
    borderRadius: '50%',
    width: '73px',
    boxSizing: 'border-box'
  },
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
    padding: theme.spacing() * 0.5
  },
  notification: {
    minWidth: 'auto'
  }
}));

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSubmit, register, errors } = useForm();
  const login = useLogin();
  const notify = useNotify();
  const classes = useStyles()
  const theme = useTheme()
  const [passwordType, setPasswordType] = useState('password')
  const onSubmit = (values: any) => {
    if (values.length) return
    login({ email, password })
      .catch((err: Error) => { notify(err, 'error') });
  };
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs" className={classes.container}>
        <Paper className={classes.paper}>
          <Button className={classes.box}>
            <LockIcon color="primary" fontSize="large"></LockIcon>
          </Button>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <FormGroup className={classes.formGroup}>
              <TextField
                required
                error={!!errors.email}
                label="Email"
                id="email"
                name="email"
                onChange={(e) => { console.log(e.target);setEmail(e.target.value)}}
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
                type={passwordType}
                label="Password"
                id="password"
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
            <Button type="submit" color="primary" variant="contained" className={classes.submitButton}>LOGIN</Button>
          </form>
          <Notification className={classes.notification} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AuthPage