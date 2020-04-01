import React from 'react';
import { EmailField } from 'react-admin';
import { List, Datagrid, TextField, Create, SimpleForm, ReferenceInput, SelectInput, TextInput, Edit, Filter } from 'react-admin';
export const UserList =( props: any) => (
    <List filters={<UserFilter/>}{...props}>
        <Datagrid rowClick="edit">
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="userGroup" />
        </Datagrid>
    </List>
);
export const UserCreate  = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" /></ReferenceInput>
            <TextInput source="title" />
            <TextInput multiline source="body" />
        </SimpleForm>
    </Create>
);

const UserTitle = ({record}:{record?: any}) =>{
    return <span>User {record ? `"${record.username}"`: ''}</span>
}
export const UserEdit = (props: any) => (
    <Edit title={<UserTitle/>}{...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput  source="username" />
            <TextInput  source="email" />
            <TextInput  source="password" />
        </SimpleForm>
    </Edit>
);


const UserFilter = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="id" reference="users" allowEmpty>
            <SelectInput optionText="username" />
        </ReferenceInput>
    </Filter>
);
