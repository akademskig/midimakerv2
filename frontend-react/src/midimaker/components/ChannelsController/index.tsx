import React, { ReactElement, useCallback, useContext, MouseEvent, useState, ChangeEvent } from 'react'
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, makeStyles, Paper, Theme, Tooltip, useTheme,FormControl, InputLabel,MenuItem,Select  } from '@material-ui/core'
import classnames from 'classnames'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'
import { getInstrumentLabel } from '../AudioSettingsController/utils'
import { TChannel } from '../../providers/SoundfontProvider/SoundFontProvider.types'
import { SoundfontProviderContext } from '../../providers/SoundfontProvider/SoundfontProvider'
import { useAudioController } from '../../controllers/AudioController'
import { Delete,ColorLens, LibraryMusic, SettingsEthernet } from '@material-ui/icons'
import { ChromePicker, ColorResult } from 'react-color'
import { makeInstrumentList } from '../AudioSettingsController/utils'

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
            cursor: 'pointer',
            '& svg': {
                color: theme.palette.secondary.light
            }
        },
    },
    listItemChannel: {
        paddingTop:theme.spacing(0.5),
        paddingBottom: theme.spacing(0.5),
        display: 'flex',
        justifyContent: 'center',
        '&:hover': {
            cursor: 'pointer',
            '& svg': {
                color: theme.palette.secondary.light
            },
            '& div': {
                border: '2px solid #ffffff'
            }
        },
        '&.active': {
            '& div': {
                border: '2px solid #ffffff'
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
        width: 32,
        height: 20,
        boxSizing: 'content-box',
        borderRadius: '2px',
    },
    deleteButton: {
        '& :hover': {
            color: theme.palette.secondary.light
        }
    },
    listItemIcon: {
        minWidth: 'auto',
    },
    tooltip: {
        marginBottom: 0,
    },
    formControl: {
        '& .MuiInput-root, .MuiFormLabel-root': {
            color: theme.palette.primary.contrastText,
        },
        '& .MuiInput-underline, .MuiInput-underline:hover': {
            '&:before': {
                borderColor: theme.palette.secondary.light,
            },
            '& svg': {
                color: theme.palette.secondary.light,
            }
        },
        margin: theme.spacing(1),
        minWidth: 178,
        display: 'block',
        '& .MuiInputBase-root': {
            width: '100%',
            marginTop: theme.spacing(0.5)
        },
        '& .MuiFormLabel-root': {
            position: 'relative'
        }
    },
    selectMenuItem: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.secondary.light
        },
    },
    channelsList: {
        padding: theme.spacing(0.75)
    }
}))

type TChannelEditor = {
    classes: Record<string, string>,
    theme: Theme,
    onClick: (e: MouseEvent) => void,
    key: number
}
const renderChannelEditor = ({ classes, onClick }: TChannelEditor) => {
    return (
        <div>
            <IconButton className={classes.deleteButton} onClick={onClick}>
                <Delete />
            </IconButton>
        </div>
    )
}
type TChannelListProps = {
    channels: TChannel[],
    classes: Record<string, string>,
    onClick: ((selectedItem: string) => void),
    currentInstrumentName: string,
}
const ChannelList = ({ channels, classes, onClick, currentInstrumentName }: TChannelListProps) => {
    const [anchorEl, setAnchorEl] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [opened, setOpened] = useState(-1)
    const theme = useTheme()
    const { removeChannel } = useAudioController()
    const onRemoveClick = useCallback((e, idx) => {
        removeChannel(channels[idx].instrumentName)
    }, [channels, removeChannel])

    const closeOnClick = useCallback(() => {
        setOpened(-1)
        window.removeEventListener('click', closeOnClick)
    }, [setOpened])

    const onChannelRightClick = useCallback((e: MouseEvent, idx: number) => {
        e.preventDefault()
        const { x, width, y } = e.currentTarget.getBoundingClientRect()
        setAnchorEl({ x: x + width, y: y });
        setOpened(idx)
        window.addEventListener('click', closeOnClick)
    }, [closeOnClick])

    return (
        <List className={classes.channelsList}>
            { channels.map((channel: TChannel, idx: number) => {
                return (
                    <div key={idx}>
                        <Tooltip title={getInstrumentLabel(channel.instrumentName)} placement='top-end' className={classes.tooltip}>
                            <ListItem
                                disableGutters
                                className={classnames(classes.listItemChannel, { active: currentInstrumentName === channel.instrumentName })}
                                onClick={() => onClick(channel.instrumentName)}
                                value={channel.instrumentName}
                                onContextMenu={(e) => onChannelRightClick(e, idx)}
                            >
                                <div className={classes.listItemDiv} style={{ backgroundColor: channel.color }}></div>
                            </ListItem>
                        </Tooltip>
                        <Paper className={classes.popoverPaper} style={{ left: `${anchorEl.x - 110}px`, top: `${anchorEl.y + 6}px` }}>
                            {
                                opened === idx && renderChannelEditor({ classes, theme, key: idx, onClick: (e) => onRemoveClick(e, idx) })
                            }
                        </Paper>
                    </div>
                )

            })}
        </List>
    )
}
export const settingItems = [
    {
        label: "Add new channel",
        value: 'instrument',
        icon: 'instrument'
    },
    {
        label: "Set channel color",
        value: 'color',
        icon: 'color'
    },
   
]
const getIcon = (icon: string) => {
    switch (icon) {
        case 'color':
            return <ColorLens />
        case 'instrument':
            return <LibraryMusic />
        default:
            return <SettingsEthernet />
    }
}
type TColorPickerProps = {
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>,
    classes: Record<string, string>
}

export function renderColorPicker({ value, onChange, classes }: TColorPickerProps) {

    const onColorChange = (color: ColorResult) => {
        onChange(color.hex)
    }
    return (
        <ChromePicker
            className={classes.colorPicker}
            color={value}
            onChange={onColorChange} />
    )
}
type TInstrumentPickerProps = {
    value: string,
    onChange: (InstrumentName: string) => void
    classes: Record<string, string>
}

export function renderInstrumentPicker({ value, onChange, classes }: TInstrumentPickerProps) {

    const onInstrumentChange = (event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        onChange(event?.target?.value && typeof event?.target?.value === 'string' ? event?.target?.value : '')
    }
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="select-instrument">Add new channel</InputLabel>
            <Select
                labelId="select-instrument"
                type='select-instrument'
                id="select-instrument"
                value={value}
                onChange={onInstrumentChange}
            >
                {
                    makeInstrumentList().map(({ value, label }: { value: string, label: string }, idx: number) => {
                        return <MenuItem className={classes.selectMenuItem} key={idx} value={value}>{label}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}

function ChannelsController({ left = false }): ReactElement {
    const { channels, channelColor, setChannelColor } = useContext(AudioStateProviderContext)
    const { currentInstrumentName } = useContext(SoundfontProviderContext)
    const { switchChannel, selectInstrument } = useAudioController()
    const classes = useStyles()
    const [itemOpened, setItemOpened] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

    const handleChannelClick = useCallback((selectedChannelInstrumentName: string) => {
        switchChannel(selectedChannelInstrumentName)
    }, [switchChannel])
    const handleChannelRightClick = useCallback((e: MouseEvent, item: string) => {
        e.stopPropagation()
        const { x, width, y } = e.currentTarget.getBoundingClientRect()
        setAnchorEl({ x: x + width, y: y });
        setItemOpened(itemOpened === item ? '' : item)
    }, [itemOpened])

    return (
        <Drawer
            anchor={left ? 'left' : 'right'}
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Divider/>
            {settingItems.map((item, index) => (
                    <div>
                        <Tooltip title={item.label} placement='top-end' className={classes.tooltip}>
                            <ListItem button className={classes.listItem} key={index} onClick={(e) => handleChannelRightClick(e, item.value)}>
                                <ListItemIcon className={classes.listItemIcon}>{getIcon(item.icon)}</ListItemIcon>
                            </ListItem>
                        </Tooltip>
                        { item.value === itemOpened &&
                            <Paper className={classes.popoverPaper} style={{ left: `${anchorEl.x - (!left ? (item.value === 'color' ? 290 : 258) : 0)}px`, top: `${anchorEl.y}px` }}>
                                {
                                    item.value === 'color' && renderColorPicker({ value: channelColor, onChange: setChannelColor, classes })
                                }
                                {
                                    item.value === 'instrument' && renderInstrumentPicker({ value: currentInstrumentName, onChange: selectInstrument, classes })
                                }
                            </Paper>
                        }
                    </div>
                ))}
            <Divider />
            { !!channels.length && <ChannelList {...{ channels, classes, onClick: handleChannelClick, currentInstrumentName }} />}
            <Divider />
        </Drawer>
    )
}


export default ChannelsController