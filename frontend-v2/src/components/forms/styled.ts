import { Button, FormGroup } from "@mui/material"
import { styled } from "@mui/system"

export const SForm = styled("form")`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
export const SFormGroup = styled(FormGroup)(
  ({ theme }) => `
  width: 100%;
  margin: ${theme.spacing(1.5)};
  flex-direction: column;
  justify-content: space-between;
`
)
export const SEyeButton = styled(Button)(
  ({ theme }) => `
    min-width: auto;
    padding: ${theme.spacing(0.5)};
    color: ${theme.palette.secondary.dark};
`
)
export const SSubmitButton = styled(Button)(
  ({ theme }) => `
  width: 80%;
  margin-top: ${theme.spacing(2)};
`
)
