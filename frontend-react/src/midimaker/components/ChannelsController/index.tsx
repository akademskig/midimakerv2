import React, { ReactElement, useCallback, useContext } from 'react'
import { Divider, Drawer, List, ListItem, makeStyles, Tooltip } from '@material-ui/core'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { getInstrumentLabel } from '../AudioSettingsController/utils'
import { TChannel } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import { SoundfontProviderContext } from '../../providers/SoundfontProvider/SoundfontProvider'

const useStyles = makeStyles((theme: any) =>
    ({
        drawer: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(7.5) + 1,
            },
        },
        drawerPaper: {
            backgroundColor: theme.palette.primary.main,
            overflow: 'hidden',
            position: 'relative',
            '& svg':{
                color: theme.palette.primary.contrastText,
            },
            '&.MuiDrawer-paperAnchorDockedRight':{
                borderLeft: '1px solid rgba(0,0,0, 0.5)'
            },
            '&.MuiDrawer-paperAnchorDockedLeft':{
                borderRight: '1px solid rgba(0,0,0, 0.5)'
            }
        },
        listItem: {
            '&:hover': {
                cursor: 'pointer'
            }
        },
        listItemDiv: {
            width: 28, 
            height: 28,
            borderRadius: '2px'
        }
    }))

    export const settingItems = [
        {
            name: "Add Channel",
            icon:'addNote'
        },
    ]
type TChannelListProps = {
    channels: TChannel[],
    classes: Record<string, string>,
    onClick: ((selectedItem: string) => void) 
}
const renderChannelList = ({ channels, classes, onClick }: TChannelListProps) => {

    return(
        channels.map((channel: TChannel)=> {
            return(
                <List>
                     <Tooltip title={getInstrumentLabel(channel.instrumentName)} placement='top-end' className={classes.tooltip}>
                        <ListItem className={classes.listItem} onClick={() => onClick(channel.instrumentName)} value={channel.instrumentName}>
                            <div className={classes.listItemDiv}style={{backgroundColor: channel.color }}></div>
                        </ListItem>
                    </Tooltip>
                </List>
            )
        })
    )
}

function ChannelsController({ left = false}): ReactElement{
    const { channels } = useContext(AudioStateProviderContext)
    const { setCurrentInstrumentName } = useContext(SoundfontProviderContext)
    const classes = useStyles()
    const handleClick = useCallback((selectedChannelInstrumentName: string)=> {
        setCurrentInstrumentName(selectedChannelInstrumentName)
    }, [ setCurrentInstrumentName ])

    return(
        <Drawer
            anchor={left ? 'left': 'right'}
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            >
            <Divider />
                    { !!channels.length && renderChannelList({channels, classes, onClick:handleClick})}
            <Divider />
        </Drawer>
    )
}


export default ChannelsController