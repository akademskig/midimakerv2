// in src/users.js
import React from 'react';
import { List, Datagrid, TextField, EmailField } from 'react-admin';
import UrlField from './fields/url.field';

export const UserList =( props: any) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="address.street" />
            <TextField source="phone" />
            <UrlField  source="website" />
            <TextField source="company.name" />
        </Datagrid>
    </List>
);