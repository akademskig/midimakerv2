import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/ClearAllOutlined'
import EyeIcon from '@mui/icons-material/Visibility'
import { styled } from '@mui/system';

export const UsernameField = ({ username, setUsername }: any) => {
    return (
        <TextField
            name="username"
            color="secondary"
            type="text"
            label="Username"
            id="username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setUsername('')}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}

export const EmailField = ({ email, setEmail, errors, register }: any) => {
    return (
        <TextField
            required
            error={!!errors.email}
            label="Email"
            id="email"
            color="secondary"
            name="email"
            value={email}
            autoComplete={'true'}
            onChange={(e) => { setEmail(e.target.value) }}
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
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={() => setEmail('')}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}

const EyeIconStyled = styled(EyeIcon)`
    min-width: auto;
    padding: ${({ theme }) => Number(theme.spacing()) * 0.5};
    color: ${({ theme }) => theme.palette.primary.light};
`
export const PasswordField = ({ name, label, password, setPassword, errors, register }: any) => {
    const [passwordType, setPasswordType] = useState('password')
    return (
        <TextField
            size="small"
            required
            autoComplete="password"
            error={!!errors[name]}
            name={name}
            color="secondary"
            type={passwordType}
            label={label}
            fullWidth
            id={name}
            defaultValue={password}
            onChange={(e: any) => setPassword(e.target.value)}
            helperText={errors[name] && errors[name].message}
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
                        <IconButton
                            onMouseDown={() => setPasswordType('text')}
                            onMouseUp={() => setPasswordType('password')}
                            onMouseLeave={() => setPasswordType('password')}
                        >
                            <EyeIconStyled />

                        </IconButton>
                        <IconButton onClick={() => setPassword('')}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}