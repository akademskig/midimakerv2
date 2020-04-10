import React from 'react';
import { EmailField } from 'react-admin';
import { List, Datagrid, TextField, Create, SimpleForm, ReferenceInput, SelectInput, TextInput, Edit, Filter, required, minLength, email, Show, SimpleShowLayout, DateField } from 'react-admin';
export const UserList = (props: any) => (
    <List filters={<UserFilter />}{...props}>
        <Datagrid rowClick="show">
            <TextField source="username" />
            <EmailField source="email" />
            <TextField source="role" />
            <TextField source="company" />
        </Datagrid>
    </List>
);
export const UserCreate = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="username" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="password" validate={[required(), minLength(8)]} />
            <SelectInput source="role" optionText="name" validate={[required()]} choices={[{ id: 'admin', name: "Admin" }, { id: 'regular', name: 'Regular' }]} />
            <TextInput source="company" />
        </SimpleForm>
    </Create>
);

const UserTitle = ({ record }: { record?: any }) => {
    return <span>User {record ? `"${record.username}"` : ''}</span>
}
export const UserEdit = (props: any) => (
    <Edit title={<UserTitle />}{...props}>
        <SimpleForm>
            <TextInput required source="username" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <SelectInput source="role" optionText="name" validate={[required()]} choices={[{ id: 'admin', name: "Admin" }, { id: 'regular', name: 'Regular' }]} />
            <TextInput source="company" />
        </SimpleForm>
    </Edit>
);


const UserFilter = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn resettable />
        <ReferenceInput label="User" source="id" reference="users" allowEmpty>
            <SelectInput optionText="username" />
        </ReferenceInput>
    </Filter>
);

export const UserShow = (props: any) => (
    <Show  title={<UserTitle />}{...props}>
        <SimpleShowLayout>
            <TextField source="username" />
            <TextField source="email" />
            <TextField source="role" />
            <TextField source="company" />
            <DateField locales="de-DE" source="createdAt" showTime />
            <DateField locales="de-DE" label="Last updated" source="updatedAt" showTime />
        </SimpleShowLayout>
    </Show>
);