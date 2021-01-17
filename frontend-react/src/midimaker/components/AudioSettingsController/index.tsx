import React, { ReactElement, useCallback, useContext, useState, MouseEvent, ChangeEvent } from 'react'
import { Divider, Drawer, FormControl, InputLabel, List, ListItem, ListItemIcon, makeStyles, MenuItem, Paper, Select, Slider, Theme } from '@material-ui/core'
import { AccessTime, SettingsEthernet, Timelapse } from '@material-ui/icons'
import { MidiNumbers } from 'react-piano'
import { CustomTooltip } from '../shared/loader/CustomTooltip'
import { AudioStateProviderContext, TNoteRange } from '../../providers/AudioStateProvider/AudioStateProvider'

const useStyles = makeStyles((theme: Theme) =>
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
    listItemIcon: {
        minWidth: 'auto',
    },
    listItem: {
        '&:hover': {
            '& svg': {
                color: theme.palette.secondary.light
            }
        }
    },
    popoverPaper: {
        position: 'fixed',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        boxShadow: theme.shadows[5],
        fontFamily: 'Fira Code !important',
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
        minWidth: 130,
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
    tooltip: {
        marginBottom: 0,
    },
    colorPicker: {
        'MuiFormControl-root': {
            width: 'auto'
        },
        'MuiInputBase-root': {
            display: 'none'
        },
        'label + .MuiInput-formControl': {
            margin: '0.2em',

        }

    },
    durationSlider: {
        color: theme.palette.secondary.light
    }
}))

export const settingItems = [
    {
        label: "Set base note duration",
        value: 'tempo',
        icon: 'tempo'
    },
    {
        label: "Note range",
        value: 'noteRange',
        icon: 'noteRange'
    },
    {
        label: "Composition duration",
        value: 'compositionDuration',
        icon: 'compositionDuration'
    }
]
const getIcon = (icon: string) => {
    switch (icon) {
        case 'tempo':
            return <Timelapse />
        case 'noteRange':
            return <SettingsEthernet />
        case 'compositionDuration':
            return  <AccessTime />
        default:
            return <SettingsEthernet />
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
    classes: Record<string, string>
}
function renderTempoPicker({ value, onChange, classes }: TTempoPickerProps) {
    const onTempoChange = (event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        onChange(typeof event.target.value === 'number' ? event.target.value : value)
    }
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="select-tempo">Set note duration</InputLabel>
            <Select
                labelId="select-tempo"
                type='color-picker'
                id="select-tempo"
                value={value}
                onChange={onTempoChange}
            >
                {
                    durationOptions.map(({ value, label }, idx) => {
                        return <MenuItem className={classes.selectMenuItem} key={idx} value={value}>{label}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    )
}
type TNoteRangePickerProps = {
    value: TNoteRange,
    onChange: React.Dispatch<React.SetStateAction<TNoteRange>>,
    classes: Record<string, string>
}
const noteOptions = MidiNumbers.NATURAL_MIDI_NUMBERS.map((number: number) => MidiNumbers.getAttributes(number))
function renderNoteRangePicker({ value, onChange, classes }: TNoteRangePickerProps) {
    const onNoteFirstChange = (event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {

        onChange({
            first: typeof event?.target?.value === 'number' ?
                event.target.value : value.first, last: value.last
        })
    }
    const onNoteLastChange = (event: ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        onChange({
            first: value.first, last: typeof event?.target?.value === 'number' ?
                event.target.value : value.last
        })
    }
    return (
        <>
            <FormControl className={classes.formControl}>
                <InputLabel shrink id="select-tempo">Set first note</InputLabel>
                <Select
                    labelId="select-range-first"
                    type='select-range-first'
                    id="select-range-first"
                    value={value.first}
                    onChange={onNoteFirstChange}
                    classes={{ root: classes.selectMenuItem }}
                >
                    {
                        noteOptions.map(({ midiNumber, note }: { midiNumber: string, note: string }, idx: number) => {
                            return <MenuItem className={classes.selectMenuItem} key={idx} value={midiNumber}>{note}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
                <InputLabel shrink id="select-tempo">Set last note</InputLabel>
                <Select
                    labelId="select-range-last"
                    type='select-range-last'
                    id="select-range-last"
                    value={value.last}
                    onChange={onNoteLastChange}
                >
                    {
                        noteOptions.map(({ midiNumber, note }: { midiNumber: string, note: string }, idx: number) => {
                            return <MenuItem className={classes.selectMenuItem} key={idx} value={midiNumber}>{note}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        </>
    )
}

type TCompositionDurationProps = {
    value: number,
    onChange: React.Dispatch<React.SetStateAction<number>>,
    classes: Record<string, string>
}
export function renderCompositionDurationPicker({ value, onChange, classes }: TCompositionDurationProps) {

    const onDurationChange = (event: React.ChangeEvent<{}>, changeValue: number | number[]) => {
        onChange(!Array.isArray(changeValue) ? changeValue : value)
    }
    return (
        <FormControl className={classes.formControl}>
            <InputLabel shrink id="set-composition-duration">Set composition duration</InputLabel>
            <Slider
                step={20}
                id="set-composition-duration"
                className={classes.durationSlider}
                value={value}
                aria-labelledby="set-composition-duration"
                onChange={onDurationChange}
                max={200}
                min={10}
            />
        </FormControl>
    )
}


function AudioSettingsController({ left = false }): ReactElement {
    const { noteDuration, setNoteDuration,
        noteRange, setNoteRange, compositionDuration, setCompositionDuration } = useContext(AudioStateProviderContext)
    const [itemOpened, setItemOpened] = useState<string>('')
    const [anchorEl, setAnchorEl] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const classes = useStyles()
    const handleClick = useCallback((e: MouseEvent, item: string) => {
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
            <Divider />
            <List>
                {settingItems.map((item, index) => (
                    <div>
                        <CustomTooltip title={item.label} placement='top-end' className={classes.tooltip}>
                            <ListItem button className={classes.listItem} key={index} onClick={(e) => handleClick(e, item.value)}>
                                <ListItemIcon className={classes.listItemIcon}>{getIcon(item.icon)}</ListItemIcon>
                            </ListItem>
                        </CustomTooltip>
                        { item.value === itemOpened &&
                            <Paper className={classes.popoverPaper} style={{ left: `${anchorEl.x - (!left ? (item.value === 'color' ? 290 : 200) : 0)}px`, top: `${anchorEl.y}px` }}>
                                {
                                    item.value === 'tempo' && renderTempoPicker({ value: noteDuration, onChange: setNoteDuration, classes })
                                }
                                {
                                    item.value === 'noteRange' && renderNoteRangePicker({ value: noteRange, onChange: setNoteRange, classes })
                                }
                                {
                                    item.value === 'compositionDuration' && renderCompositionDurationPicker({ value: compositionDuration, onChange: setCompositionDuration, classes })
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