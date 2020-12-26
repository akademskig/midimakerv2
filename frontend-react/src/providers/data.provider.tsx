import React, { createContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from 'react'
import { JsxElement } from 'typescript'

type TLocation = {
    name: string,
    latitude: number,
    longitude: number
}
export type TEvent = {
    id?: string,
    name: string,
    location: TLocation;
    startTime: Date;
    duration?: number;
    endTime: Date;
    owner?: string;
    participants?: string[]
}

interface IDataProvider {
    children: ReactNode
}
interface IDataProviderCtxValue {
    events: TEvent[]
    setEvents: Dispatch<React.SetStateAction<TEvent[]>>
}
const initialValue = {
    events: [],
    setEvents: (sa: SetStateAction<TEvent[]>) => (value: TEvent[]) => value,
}
export const DataCtx = createContext<IDataProviderCtxValue>(initialValue)

export default function DataProvider({children}: IDataProvider): JSX.Element {
    const [events, setEvents ] = useState<TEvent[]>([])

    const ctxValue = useMemo(() => ({
        events,
        setEvents
    }), [ events, setEvents ])
    return (
        <DataCtx.Provider value={ctxValue}>
            {children}
        </DataCtx.Provider>
    )

    
}