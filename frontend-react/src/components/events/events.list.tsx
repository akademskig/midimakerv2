import EventItem from './event.item';
import React, { Component, Dispatch, useState, useEffect, useContext } from 'react';
import { useEvents } from '../../api/protected/events'
import { DataCtx, TEvent } from '../../providers/data.provider';

const EventsList = () => {
    const { fetchList, events } = useEvents()
   
    useEffect(() => {
        fetchList({ params: { include: "owner, location" } })
    }, [ ])
    console.log(events)
    return (
        <>
        {Array.isArray(events) && events.map((e: TEvent) => <EventItem key={e.id} event={e} />)}
        </>
    )
}

export default EventsList