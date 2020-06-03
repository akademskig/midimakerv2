import { useDispatch, useSelector } from 'react-redux';
import { fetchList } from '../../redux/crud/crud.actions';
import EventItem from './event.item';
import React from 'react';
import { selectDataList } from '../../redux/crud/crud.selectors';

export default function EventsList() {

    const dispatch = useDispatch()
    dispatch(fetchList({ meta: { resource: 'events' } }))

    let events = useSelector(selectDataList('events'))
    return (
        events && events.map((e: any) => <EventItem event={e} />)

    )
}