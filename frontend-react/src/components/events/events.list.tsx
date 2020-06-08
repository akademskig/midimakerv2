import { useDispatch, useSelector, connect } from 'react-redux';
import { fetchList } from '../../redux/crud/crud.actions';
import EventItem from './event.item';
import React, { Component, Dispatch } from 'react';
import { selectDataList } from '../../redux/crud/crud.selectors';

class EventsList extends Component<any> {

    componentDidMount() {
        const { fetchEvents } = this.props
        fetchEvents()
    }
    render() {
        const { events } = this.props
        return (
            events && events.map((e: any) => <EventItem key={e.id} event={e} />)
        )
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    fetchEvents: () => dispatch(fetchList({ meta: { resource: 'events' }, params: { include: "owner, location" } }))
})

const mapStateToProps = (state: any) => ({
    events: selectDataList('events')(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(EventsList)