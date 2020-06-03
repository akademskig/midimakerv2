// @ts-nocheck
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalC from '../common/ModalC';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing() * 3,
        border: `solid 1px ${theme.palette.grey[300]}`,
        borderRadius: theme.shape.borderRadius
    },
    map: {
        width: '90%',
        top: '10px',
        left: '10px',
        right: '10px',
        zIndex: 1000,
    },

}))

const containerStyle = {
    position: 'absolute',
    top: '5%',
    left: '5%',
    right: '5%',
    width: '90%',
    height: '90%',
    zIndex: 2,
}
const mapStyle = {
    width: '100%',
    margin: 'auto'
}
export function GoogleMapC({ coords, setCoords, google, mapOpen, setMapOpen }: GoogleMapCProps) {


    function onMarkerClick() {

    }
    function onInfoWindowClose() {

    }

    function onMapInit() {
        if (coords.lat && coords.lng) {
            return
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords
            setCoords({ lat: latitude, lng: longitude })
        })
    }


    function moveMarker(props, marker, e) {
        setCoords({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        })
    }

    return (
        <ModalC open={mapOpen} setOpen={setMapOpen} disableBackdropClick={false}>
            <Map
                onReady={onMapInit}
                containerStyle={containerStyle}
                style={mapStyle}
                google={google}
                zoom={14}
                initialCenter={{
                    lat: coords.lat,
                    lng: coords.lng
                }}
                center={{
                    lat: coords.lat,
                    lng: coords.lng
                }}
            >

                <Marker onClick={onMarkerClick}
                    name={'Current location'}
                    position={{
                        lat: coords.lat,
                        lng: coords.lng
                    }}
                    draggable={true}
                    onDragend={moveMarker}
                />

                <InfoWindow onClose={onInfoWindowClose}>
                   
                </InfoWindow>
            </Map>
        </ModalC>
    );
}

type GoogleMapCProps = {
    google: any,
    mapOpen,
    setMapOpen,
    coords: {
        lat: number,
        lng: number
    },
    setCoords: Dispatch<SetStateAction<{ lat: number; lng: number; }>>
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyDQLXDPewgtqt4mBUy_kPMzFEl6mce6mLg')
})(GoogleMapC)