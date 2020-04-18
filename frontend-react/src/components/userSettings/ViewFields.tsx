import { Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components'

const ViewFieldStyled = styled.div`

`
export const ViewField = ({ label, value }: any) => {
    return (
        <ViewFieldStyled>
            <Typography>{label}</Typography>
            <span>{value}</span>
        </ViewFieldStyled>
    )
}