import React from "react"
import { Paper } from "@mui/material"
import { styled } from "@mui/system"

const SPaper = styled(Paper)(
  ({ theme }) => `
  display: flex;
  flexDirection: column;
  alignItems: center;
  padding: ${theme.spacing(3)};
  border: solid 1px  ${theme.palette.grey[300]};
  border-radius: ${theme.shape.borderRadius};
`
)

const MainPage = () => {
  return <SPaper />
}

export default MainPage
