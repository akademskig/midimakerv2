import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../../redux/crud/crud.actions';
import EventItem from './event.item';
import React from 'react';
import { selectDataList } from '../../redux/crud/crud.selectors';
import { Length } from 'class-validator';

export default function EventsList() {

    const dispatch = useDispatch()

    let events = useSelector(selectDataList('events'))
    if(!events.length){
        dispatch(fetchList({ meta: { resource: 'events' } }))
    }
    return (
        events && events.map((e: any) => <EventItem key={e.id}event={e} />)

    )
}