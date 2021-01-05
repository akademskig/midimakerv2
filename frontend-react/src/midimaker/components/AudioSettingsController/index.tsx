import { Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemIcon, makeStyles, MenuItem, Paper, Select, Tooltip } from '@material-ui/core'
import { AccessTime, ColorLens, MusicNote, PlayArrow, Stop } from '@material-ui/icons'
import{ ChromePicker, ColorResult } from 'react-color'
import React, { ReactElement, useCallback, useContext, useState, MouseEvent, ChangeEvent } from 'react'
import { AudioStateProviderContext } from '../../providers/AudioStateProvider/AudioStateProvider'

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
            overflow: 'hidden',
            position: 'relative',
        },
        listItemIcon: {
            minWidth: 'auto'

        },
        popoverPaper: {
            position: 'fixed',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
          },
        tooltip: {
            marginBottom: 0
        },
        colorPicker: {
            'MuiFormControl-root':{
                width: 'auto'
            },
            'MuiInputBase-root':{
                display: 'none'
            },
            'label + .MuiInput-formControl':{
                margin: '0.2em',

            }

        }
    }))

    export const settingItems = [
        {
            name: "Tempo",
            icon:'tempo'
        },
        {
            name: "Channel color",
            icon:'color'
        },
        {
            name: "Note range",
            icon:'music'
        }
    ]
    const getIcon = (icon: string) => {
        switch (icon) {
            case 'tempo':
                return <AccessTime/>
            case 'color':
                return <ColorLens/>
            default:
                return <MusicNote />
        }
    }
const durationOptions = [
    {
        label: '1/16',
        value: 0.0625
    },
    {
        label: '1/8',
        value: 0.125
    }, {
        label: '1/4',
        value: 0.25
    },
    {
        label: '1/2',
        value: 0.5
    },
    {
        label: '1',
        value: 1
    }
]

type TTempoPickerProps = {
    value: number,
    onChange: React.Dispatch<React.SetStateAction<number>>,
    classes: Record<string,string>
}
function renderTempoPicker({ value, onChange, classes }: TTempoPickerProps){
    const onTempoChange = (event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>)=> {
        onChange(typeof event.target.value ==='number' ? event.target.value: value)
    }
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="select-tempo">Set Tempo</InputLabel>
            <Select
                labelId="select-tempo"
                type='color-picker'
                id="select-tempo"
                value={value}
                onChange={onTempoChange}
            >
                { 
                    durationOptions.map(({ value, label}, idx)=> {
                       return  <MenuItem key={idx} value={value}>{label}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}
type TColorPickerProps = {
    value: string,
    onChange: React.Dispatch<React.SetStateAction<string>>,
    classes: Record<string,string>
}
function renderColorPicker({ value, onChange, classes }: TColorPickerProps){
    const onColorChange = (color: ColorResult)=> {
        onChange(color.hex)
    }
    return (
            <ChromePicker
                className={classes.colorPicker}
                color={value}
                onChange={onColorChange}/>
    )
}
function AudioSettingsController(): ReactElement{
    const { noteDuration, setNoteDuration, channelColor, setChannelColor } = useContext(AudioStateProviderContext)
    const [itemOpened, setItemOpened] = useState<string >('')
    const [anchorEl, setAnchorEl] = useState<{x: number, y: number }>({ x: 0, y: 0})
    const classes = useStyles()
    const handleClick = useCallback((e: MouseEvent, item: string)=> {
        e.stopPropagation()
        const { x, width, y } = e.currentTarget.getBoundingClientRect()
        setAnchorEl({x: x + width, y: y});
        setItemOpened(itemOpened===item ? '': item)
    }, [ itemOpened])
   
    return(
        <Drawer
            variant="permanent"
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            >
            <Divider />
                <List>
                    {settingItems.map((item, index) => (
                        <div>
                            <Tooltip title={item.name} placement='top-end' className={classes.tooltip}>
                                <ListItem button key={index} onClick={(e) => handleClick(e, item.name)}>
                                    <ListItemIcon className={classes.listItemIcon}>{getIcon(item.icon)}</ListItemIcon>
                                </ListItem>
                            </Tooltip>
                            { item.name===itemOpened && 
                                <Paper className={classes.popoverPaper} style={{left: `${anchorEl.x}px`, top: `${anchorEl.y}px`}}>
                                    { 
                                        item.name ==='Tempo' && renderTempoPicker({ value: noteDuration, onChange: setNoteDuration, classes })
                                    }
                                    { 
                                        item.name ==='Channel color' && renderColorPicker({ value: channelColor, onChange: setChannelColor, classes })
                                    }
                                </Paper>
                                
                                }
                                </div>
                    ))}
                </List>
            <Divider />
        </Drawer>
    )
}


export default AudioSettingsController