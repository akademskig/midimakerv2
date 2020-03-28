import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles({
    link: {
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        width: '0.5em',
        paddingLeft: 2,
    },
});

const UrlField = ({ record = {}, source }: {record?: {[source: string]: string}, source: string}) => {
    const classes = useStyles();
    return (
        <a href={record[source]} className={classes.link}>
            {record[source]}
            <LaunchIcon className={classes.icon} />
        </a>
    );
}

export default UrlField;