import { useState } from "react"
import { useForm } from "react-hook-form"

import { TextField, InputAdornment } from "@mui/material"
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined"
import { signIn } from "../../../api/auth"
import { useNavigate } from "react-router-dom"
import useNotify from "../../../hooks/useNotify"
import useAuth from "../../../hooks/useAuth"
import { SEyeButton, SForm, SFormGroup, SSubmitButton } from "../styled"

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const notify = useNotify()
  const { setAuthData } = useAuth()
  const navigate = useNavigate()

  const [passwordType, setPasswordType] = useState("password")
  const onSubmit = (values: any) => {
    if (values.length) return
    signIn(values)
      .then((authData: any) => {
        setAuthData(authData)
        navigate("/")
      })
      .catch((err: Error) => {
        notify("error", err.message)
      })
  }
  return (
    <SForm noValidate onSubmit={handleSubmit(onSubmit)}>
      <SFormGroup>
        <TextField
          required
          error={!!errors.email}
          label="Email"
          id="email"
          color="secondary"
          helperText={errors.email && errors.email.message}
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email",
            },
          })}
        />
      </SFormGroup>
      <SFormGroup>
        <TextField
          required
          error={!!errors.password}
          color="secondary"
          type={passwordType}
          label="Password"
          id="password"
          helperText={errors.password && errors.password.message}
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 8,
              message: "Password should consist of at least 8 characters",
            },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SEyeButton
                  onMouseDown={() => setPasswordType("text")}
                  onMouseUp={() => setPasswordType("password")}
                  onMouseLeave={() => setPasswordType("password")}
                >
                  <EyeIcon />
                </SEyeButton>
              </InputAdornment>
            ),
          }}
        />
      </SFormGroup>
      <SSubmitButton type="submit" color="secondary" variant="contained">
        LOGIN
      </SSubmitButton>
    </SForm>
  )
}

export default LoginForm
