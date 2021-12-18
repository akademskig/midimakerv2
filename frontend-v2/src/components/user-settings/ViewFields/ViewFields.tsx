import React from 'react';
import { Typography } from '@mui/material';


export const ViewField = ({ label, value }: any) => {
    return (
        <div>
            <Typography>{label}</Typography>
            <span>{value}</span>
        </div>
    )
}