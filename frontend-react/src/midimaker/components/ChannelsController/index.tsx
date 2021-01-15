import React, { ReactElement, useCallback, useContext, MouseEvent, useState } from 'react'
import { Button, Divider, Drawer, IconButton, List, ListItem, makeStyles, Paper, Theme, Tooltip, useTheme } from '@material-ui/core'
import classnames from 'classnames'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { getInstrumentLabel } from '../AudioSettingsController/utils'
import { TChannel } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import { SoundfontProviderContext } from '../../providers/SoundfontProvider/SoundfontProvider'
import { Delete } from '@material-ui/icons'
import { useAudioController } from '../../controllers/AudioController'

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
        // position: 'fixed',
        // right: 0,
        // top: '125px',
        // display: 'flex',
        // bottom: '61px'
    },
    drawerPaper: {
        backgroundColor: theme.palette.primary.main,
        overflow: 'hidden',
        position: 'relative',
        '& svg': {
            color: theme.palette.primary.contrastText,
        },
        '&.MuiDrawer-paperAnchorDockedRight': {
            borderLeft: '1px solid rgba(0,0,0, 0.5)'
        },
        '&.MuiDrawer-paperAnchorDockedLeft': {
            borderRight: '1px solid rgba(0,0,0, 0.5)'
        }
    },
    listItem: {
        paddingTop: '0.75em',
        paddingBottom: '0.75em',
        '&:hover': {
            cursor: 'pointer'
        },
        '&.active': {
            // backgroundColor: theme.palette.primary.light,
            '& div': {
                border: '2px groove #d9e9fb'
            }
        }

    },
    popoverPaper: {
        position: 'fixed',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[5],
    },
    listItemDiv: {
        width: 28,
        height: 28,
        borderRadius: '3px',
    },
    deleteButton: {
        '& :hover': {
            color: theme.palette.secondary.light
        }
    }
}))

export const settingItems = [
    {
        name: "Add Channel",
        icon: 'addNote'
    },
]

type TChannelEditor = {
    classes: Record<string, string>,
    theme: Theme,
    onClick: (e: MouseEvent)=> void
}
const renderChannelEditor = ({ classes, theme, onClick }: TChannelEditor) => {
    return (
        <div>
            <IconButton className={classes.deleteButton} onClick={onClick}>
                <Delete/>
            </IconButton>
        </div>
    )
}
type TChannelListProps = {
    channels: TChannel[],
    classes: Record<string, string>,
    onClick: ((selectedItem: string) => void),
    currentInstrumentName: string
}
const ChannelList = ({ channels, classes, onClick, currentInstrumentName }: TChannelListProps) => {
    const [anchorEl, setAnchorEl] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [opened, setOpened] = useState(false)
    const theme = useTheme()
    const { removeChannel } = useAudioController()
    const onRemoveClick = useCallback((instrumentName)=> {
        removeChannel(instrumentName)
    }, [removeChannel])

    const closeOnClick = useCallback(() => {
        setOpened(false)
        window.removeEventListener('click', closeOnClick)
    }, [ setOpened ])

    const onChannelRightClick = useCallback((e: MouseEvent, channelInstrument: string) => {
        e.preventDefault()
        const { x, width, y } = e.currentTarget.getBoundingClientRect()
        setAnchorEl({ x: x + width, y: y });
        setOpened(true)
        window.addEventListener('click',closeOnClick)
    }, [closeOnClick])

    return (
        <List>
            { channels.map((channel: TChannel) => {
                return (
                    <>
                        <Tooltip title={getInstrumentLabel(channel.instrumentName)} placement='top-end' className={classes.tooltip}>
                            <ListItem
                                className={classnames(classes.listItem, { active: currentInstrumentName === channel.instrumentName })}
                                onClick={() => onClick(channel.instrumentName)}
                                value={channel.instrumentName}
                                onContextMenu={(e) => onChannelRightClick(e, channel.instrumentName)}
                            >
                                <div className={classes.listItemDiv} style={{ backgroundColor: channel.color }}></div>
                            </ListItem>
                        </Tooltip>
                        <Paper className={classes.popoverPaper} style={{ left: `${anchorEl.x - 110}px`, top: `${anchorEl.y + 6}px` }}>
                            {
                                opened && renderChannelEditor({ classes, theme, onClick: () => onRemoveClick(channel.instrumentName) })
                            }
                        </Paper>
                    </>
                )

            })}
        </List>
    )
}

function ChannelsController({ left = false }): ReactElement {
    const { channels } = useContext(AudioStateProviderContext)
    const { setCurrentInstrumentName, currentInstrumentName } = useContext(SoundfontProviderContext)
    const classes = useStyles()
    const handleClick = useCallback((selectedChannelInstrumentName: string) => {
        setCurrentInstrumentName(selectedChannelInstrumentName)
    }, [setCurrentInstrumentName])

    return (
        <Drawer
            anchor={left ? 'left' : 'right'}
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Divider />
            { !!channels.length && <ChannelList {...{ channels, classes, onClick: handleClick, currentInstrumentName }} />}
            <Divider />
        </Drawer>
    )
}


export default ChannelsController