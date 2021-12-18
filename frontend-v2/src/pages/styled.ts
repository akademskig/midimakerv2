import { Container, IconButton, Paper, Tab } from "@mui/material"
import { styled } from "@mui/system"

export const SContainer = styled(Container)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-content: center;
    height: 100vh;
    justify-content: center;
    [Paper]{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${theme.spacing(3)};
      border: solid 1px ${theme.palette.grey[300]};
      border-radius: theme.shape.borderRadius;
    }
    [Button]{
      padding: ${theme.spacing(2)};
      text-align: center;
      border: solid 1px ${theme.palette.secondary.dark};
      border-radius:50%;
      width: 73px;
      box-sizing: border-box;
    }
  `
)
export const SPaper = styled(Paper)(
  ({ theme }) => `
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${theme.spacing(3)};
    border: solid 1px ${theme.palette.grey[300]};
    border-radius: ${theme.shape.borderRadius};
`
)
export const SIconButton = styled(IconButton)(
  ({ theme }) => `
  padding: ${theme.spacing(2)};
  text-align: center;
  border: solid 1px ${theme.palette.secondary.dark};
  border-radius:50%;
  width: 73px;
  box-sizing: border-box;
`
)
