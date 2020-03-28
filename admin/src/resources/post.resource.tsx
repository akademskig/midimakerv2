import React from 'react';
import { ReferenceInput, SelectInput, TextInput, SimpleForm, Create, Edit } from 'react-admin';
import { List, Datagrid, TextField, ReferenceField, EditButton, Filter} from 'react-admin';

export const PostList = (props: any) => (
    <List filters={<PostFilter/>}{...props}>
        <Datagrid >
            <TextField source="id" />
            <ReferenceField source="userId" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <TextField source="title" />
            <EditButton/>
        </Datagrid>
    </List>
);


export const PostCreate  = (props: any) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" /></ReferenceInput>
            <TextInput source="title" />
            <TextInput multiline source="body" />
        </SimpleForm>
    </Create>
);

const PostTitle = ({record}:{record?: any}) =>{
    return <span>Post {record ? `"${record.title}"`: ''}</span>
}
export const PostEdit = (props: any) => (
    <Edit title={<PostTitle/>}{...props}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" /></ReferenceInput>
            <TextInput source="title" />
            <TextInput multiline source="body" />
        </SimpleForm>
    </Edit>
);


const PostFilter = (props: any) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);
