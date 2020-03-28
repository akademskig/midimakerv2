import React from 'react';
import { EmailField } from 'react-admin';
import { List, Datagrid, TextField } from 'react-admin';
export const UserList =( props: any) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="userGroup" />
        </Datagrid>
    </List>
);
