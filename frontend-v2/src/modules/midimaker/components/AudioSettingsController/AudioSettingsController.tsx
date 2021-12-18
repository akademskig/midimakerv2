import React, {
  ReactElement,
  useCallback,
  useContext,
  useState,
  MouseEvent,
  useEffect,
  createRef,
} from "react"
import { Divider, List, Select, SelectChangeEvent } from "@mui/material"
import {
  AccessTime,
  SettingsBackupRestoreSharp,
  SettingsEthernet,
  Timelapse,
} from "@mui/icons-material"
import { MidiNumbers } from "react-piano"
import {
  AudioStateProviderContext,
  TNoteRange,
} from "../../providers/AudioStateProvider/AudioStateProvider"
import {
  SDrawer,
  SDurationSlider,
  SFormControl,
  SInputLabel,
  SListItemButton,
  SListItemIcon,
  SPopoverPaper,
  SSelectMenuItem,
  STooltip,
} from "./AudioSettingsController.styles"
import { isClickedOutside } from "./utils"

export const settingItems = [
  {
    label: "Set base note duration",
    value: "tempo",
    icon: "tempo",
  },
  {
    label: "Note range",
    value: "noteRange",
    icon: "noteRange",
  },
  {
    label: "Composition duration",
    value: "compositionDuration",
    icon: "compositionDuration",
  },
  {
    label: "Reset grid",
    value: "resetGrid",
    icon: "resetGrid",
  },
]
const getIcon = (icon: string) => {
  switch (icon) {
    case "tempo":
      return <Timelapse />
    case "noteRange":
      return <SettingsEthernet />
    case "compositionDuration":
      return <AccessTime />
    case "resetGrid":
      return <SettingsBackupRestoreSharp />
    default:
      return <SettingsEthernet />
  }
}
const durationOptions = [
  {
    label: "1/16",
    value: 0.0625,
  },
  {
    label: "1/8",
    value: 0.125,
  },
  {
    label: "1/4",
    value: 0.25,
  },
  {
    label: "1/2",
    value: 0.5,
  },
  {
    label: "1",
    value: 1,
  },
]

type TTempoPickerProps = {
  value: number
  onChange: React.Dispatch<React.SetStateAction<number>>
}
function renderTempoPicker({ value, onChange }: TTempoPickerProps) {
  const onTempoChange = (event: SelectChangeEvent<number>) => {
    onChange(
      typeof event.target.value === "number" ? event.target.value : value
    )
  }
  return (
    <SFormControl variant="standard">
      <SInputLabel shrink id="select-tempo">
        Set note duration
      </SInputLabel>
      <Select
        labelId="select-tempo"
        type="color-picker"
        id="select-tempo"
        value={value}
        onChange={onTempoChange}
      >
        {durationOptions.map(({ value, label }, idx) => {
          return (
            <SSelectMenuItem key={idx} value={value}>
              {label}
            </SSelectMenuItem>
          )
        })}
      </Select>
    </SFormControl>
  )
}
type TNoteRangePickerProps = {
  value: TNoteRange
  onChange: React.Dispatch<React.SetStateAction<TNoteRange>>
}
const noteOptions = MidiNumbers.NATURAL_MIDI_NUMBERS.map((number: number) =>
  MidiNumbers.getAttributes(number)
)
function renderNoteRangePicker({ value, onChange }: TNoteRangePickerProps) {
  const onNoteFirstChange = (event: SelectChangeEvent<number>) => {
    onChange({
      first:
        typeof event?.target?.value === "number"
          ? event.target.value
          : value.first,
      last: value.last,
    })
  }
  const onNoteLastChange = (event: SelectChangeEvent<number>) => {
    onChange({
      first: value.first,
      last:
        typeof event?.target?.value === "number"
          ? event.target.value
          : value.last,
    })
  }
  return (
    <>
      <SFormControl variant="standard">
        <SInputLabel shrink id="select-tempo">
          Set first note
        </SInputLabel>
        <Select
          labelId="select-range-first"
          type="select-range-first"
          id="select-range-first"
          value={value.first}
          onChange={onNoteFirstChange}
        >
          {noteOptions.map(
            (
              { midiNumber, note }: { midiNumber: string; note: string },
              idx: number
            ) => {
              return (
                <SSelectMenuItem key={idx} value={midiNumber}>
                  {note}
                </SSelectMenuItem>
              )
            }
          )}
        </Select>
      </SFormControl>
      <SFormControl variant="standard">
        <SInputLabel shrink id="select-tempo">
          Set last note
        </SInputLabel>
        <Select
          labelId="select-range-last"
          type="select-range-last"
          id="select-range-last"
          value={value.last}
          onChange={onNoteLastChange}
        >
          {noteOptions.map(
            (
              { midiNumber, note }: { midiNumber: string; note: string },
              idx: number
            ) => {
              return (
                <SSelectMenuItem key={idx} value={midiNumber}>
                  {note}
                </SSelectMenuItem>
              )
            }
          )}
        </Select>
      </SFormControl>
    </>
  )
}

type TCompositionDurationProps = {
  value: number
  onChange: React.Dispatch<React.SetStateAction<number>>
}
export function renderCompositionDurationPicker({
  value,
  onChange,
}: TCompositionDurationProps) {
  const onDurationChange = (event: Event, changeValue: number | number[]) => {
    onChange(!Array.isArray(changeValue) ? changeValue : value)
  }
  return (
    <>
      <SFormControl variant="standard">
        <SInputLabel shrink id="set-duration">
          Set composition duration
        </SInputLabel>
        <SDurationSlider
          step={20}
          id="set-composition-duration"
          value={value}
          aria-labelledby="set-composition-duration"
          onChange={onDurationChange}
          max={200}
          min={10}
        />
      </SFormControl>
    </>
  )
}

function AudioSettingsController({ left }: { left?: boolean }): ReactElement {
  const {
    noteDuration,
    setNoteDuration,
    noteRange,
    setNoteRange,
    compositionDuration,
    setCompositionDuration,
    resetGrid,
  } = useContext(AudioStateProviderContext)
  const [itemOpened, setItemOpened] = useState<string>("")
  const [anchorEl, setAnchorEl] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const paperRef = createRef<HTMLDivElement>()
  const handleClick = useCallback(
    (e: MouseEvent, item: string) => {
      e.stopPropagation()
      if (item === "resetGrid") {
        return resetGrid()
      }
      const { x, width, y } = e.currentTarget.getBoundingClientRect()
      setAnchorEl({ x: x + width, y: y })
      setItemOpened(itemOpened === item ? "" : item)
    },
    [itemOpened, resetGrid]
  )

  const checkClick = useCallback((e: any) => {
    e.preventDefault()
    if (isClickedOutside(e, paperRef)) {
      setItemOpened("")
    }
  }, [paperRef])
  
  useEffect(() => {
    window.addEventListener("mousedown", checkClick)
    return () => window.removeEventListener("mousedown", checkClick)
  }, [checkClick])

  return (
    <SDrawer anchor={left ? "left" : "right"} variant="permanent">
      <Divider />
      <List>
        {settingItems.map((item, index) => (
          <div key={index}>
            <STooltip title={item.label} placement="top-end">
              <SListItemButton onClick={(e) => handleClick(e, item.value)}>
                <SListItemIcon>{getIcon(item.icon)}</SListItemIcon>
              </SListItemButton>
            </STooltip>
            {item.value === itemOpened && (
              <SPopoverPaper
                ref={paperRef}
                style={{
                  left: `${
                    anchorEl.x -
                    (!left ? (item.value === "color" ? 290 : 200) : 0)
                  }px`,
                  top: `${anchorEl.y}px`,
                }}
              >
                {item.value === "tempo" &&
                  renderTempoPicker({
                    value: noteDuration,
                    onChange: setNoteDuration,
                  })}
                {item.value === "noteRange" &&
                  renderNoteRangePicker({
                    value: noteRange,
                    onChange: setNoteRange,
                  })}
                {item.value === "compositionDuration" &&
                  renderCompositionDurationPicker({
                    value: compositionDuration,
                    onChange: setCompositionDuration,
                  })}
              </SPopoverPaper>
            )}
          </div>
        ))}
      </List>
      <Divider />
    </SDrawer>
  )
}

export default AudioSettingsController
