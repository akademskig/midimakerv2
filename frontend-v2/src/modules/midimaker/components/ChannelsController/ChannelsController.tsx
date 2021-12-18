import React, {
  ReactElement,
  useCallback,
  useContext,
  MouseEvent,
  useState,
  useEffect,
  createRef,
  Dispatch,
  SetStateAction,
} from "react"
import {
  Divider,
  List,
  Theme,
  useTheme,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import classnames from "classnames"
import { AudioStateProviderContext } from "../../providers/AudioStateProvider/AudioStateProvider"
import {
  getInstrumentLabel,
  isClickedOutside,
} from "../AudioSettingsController/utils"
import { TChannel } from "../../providers/SoundfontProvider/SoundFontProvider.types"
import { SoundfontProviderContext } from "../../providers/SoundfontProvider/SoundfontProvider"
import { useAudioController } from "../../controllers/AudioController"
import {
  Delete,
  ColorLens,
  LibraryMusic,
  SettingsEthernet,
} from "@mui/icons-material"
import { ChromePicker, ColorResult } from "react-color"
import { makeInstrumentList } from "../AudioSettingsController/utils"
import {
  SChannelList,
  SDeleteButton,
  SDrawer,
  SFiberManualRecord,
  SFormControl,
  SListItemChannel,
} from "./ChannelsController.styles"
import {
  SInputLabel,
  SListItemButton,
  SListItemIcon,
  SPopoverPaper,
  SSelectMenuItem,
  STooltip,
} from "../AudioSettingsController/AudioSettingsController.styles"

type TChannelEditor = {
  theme: Theme
  onClick: (e: MouseEvent) => void
  key: number
}
const renderChannelEditor = ({ onClick }: TChannelEditor) => {
  return (
    <div>
      <SDeleteButton onClick={onClick}>
        <Delete />
      </SDeleteButton>
    </div>
  )
}
type TChannelListProps = {
  channels: TChannel[]
  onClick: (selectedItem: string) => void
  currentInstrumentName: string
}
const ChannelList = ({ channels, onClick }: TChannelListProps) => {
  const [anchorEl, setAnchorEl] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [opened, setOpened] = useState(-1)
  const theme = useTheme()
  const { removeChannel } = useAudioController()
  const { currentChannel } = useContext(AudioStateProviderContext)
  const onRemoveClick = useCallback(
    (e, idx) => {
      removeChannel(channels[idx].id)
    },
    [channels, removeChannel]
  )

  const closeOnClick = useCallback(() => {
    setOpened(-1)
    window.removeEventListener("click", closeOnClick)
  }, [setOpened])

  const onChannelRightClick = useCallback(
    (e: MouseEvent, idx: number) => {
      e.preventDefault()
      const { x, width, y } = e.currentTarget.getBoundingClientRect()
      setAnchorEl({ x: x + width + 10, y: y - 5 })
      setOpened(idx)
      window.addEventListener("click", closeOnClick)
    },
    [closeOnClick]
  )

  return (
    <SChannelList>
      {channels.map((channel: TChannel, idx: number) => {
        return (
          <div key={idx}>
            <STooltip
              title={getInstrumentLabel(channel.instrumentName)}
              placement="top-end"
            >
              <SListItemChannel
                disableGutters
                className={classnames({
                  active: currentChannel?.id === channel.id,
                })}
                onClick={() => onClick(channel.id)}
                value={channel.id}
                onContextMenu={(e) => onChannelRightClick(e, idx)}
              >
                <SFiberManualRecord
                  fontSize="large"
                  style={{ color: channel.color }}
                />
              </SListItemChannel>
            </STooltip>
            <SPopoverPaper
              style={{
                left: `${anchorEl.x - 110}px`,
                top: `${anchorEl.y + 6}px`,
              }}
            >
              {opened === idx &&
                renderChannelEditor({
                  theme,
                  key: idx,
                  onClick: (e) => onRemoveClick(e, idx),
                })}
            </SPopoverPaper>
          </div>
        )
      })}
    </SChannelList>
  )
}
export const settingItems = [
  {
    label: "Add new channel",
    value: "instrument",
    icon: "instrument",
  },
  {
    label: "Set channel color",
    value: "color",
    icon: "color",
  },
]
const getIcon = (icon: string) => {
  switch (icon) {
    case "color":
      return <ColorLens />
    case "instrument":
      return <LibraryMusic />
    default:
      return <SettingsEthernet />
  }
}
type TColorPickerProps = {
  value: string
  onChange: React.Dispatch<React.SetStateAction<string>>
}

export function renderColorPicker({ value, onChange }: TColorPickerProps) {
  const onColorChange = (color: ColorResult) => {
    onChange(color.hex)
  }
  return <ChromePicker color={value} onChange={onColorChange} />
}
type TInstrumentPickerProps = {
  value: string
  onChange: (InstrumentName: string) => void
  setSelectOpened: Dispatch<SetStateAction<boolean>>
}

export function renderInstrumentPicker({
  value,
  onChange,
  setSelectOpened,
}: TInstrumentPickerProps) {
  const onInstrumentChange = (event: SelectChangeEvent<string>) => {
    onChange(
      event?.target?.value && typeof event?.target?.value === "string"
        ? event?.target?.value
        : ""
    )
  }
  return (
    <SFormControl variant="standard">
      <SInputLabel shrink id="select-instrument">
        Add new channel
      </SInputLabel>
      <Select
        onClose={() => setSelectOpened(false)}
        onOpen={() => setSelectOpened(true)}
        sx={{ textAlign: "left" }}
        labelId="select-instrument"
        type="select-instrument"
        id="select-instrument"
        value={value}
        onChange={onInstrumentChange}
      >
        {makeInstrumentList().map(
          ({ value, label }: { value: string; label: string }, idx: number) => {
            return (
              <SSelectMenuItem key={idx} value={value}>
                {label}
              </SSelectMenuItem>
            )
          }
        )}
      </Select>
    </SFormControl>
  )
}

function ChannelsController({ left = false }): ReactElement {
  const { channels, channelColor, setChannelColor } = useContext(
    AudioStateProviderContext
  )
  const { currentInstrumentName } = useContext(SoundfontProviderContext)
  const { switchChannel, selectInstrument } = useAudioController()
  const [itemOpened, setItemOpened] = useState<string>("")
  const [selectOpened, setSelectOpened] = useState(false)
  const [anchorEl, setAnchorEl] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const paperRef = createRef<HTMLDivElement>()

  const handleChannelClick = useCallback(
    (channelId: string) => {
      switchChannel(channelId)
    },
    [switchChannel]
  )
  const handleChannelRightClick = useCallback(
    (e: MouseEvent, item: string) => {
      e.stopPropagation()
      const { x, width, y } = e.currentTarget.getBoundingClientRect()
      setAnchorEl({ x: x + width, y: y })
      setItemOpened(itemOpened === item ? "" : item)
    },
    [itemOpened]
  )
  const checkClick = useCallback(
    (e: any) => {
      if (isClickedOutside(e, paperRef) && !selectOpened) {
        setItemOpened("")
      }
    },
    [paperRef, selectOpened]
  )

  useEffect(() => {
    window.addEventListener("mousedown", checkClick)
    return () => window.removeEventListener("mousedown", checkClick)
  }, [checkClick])
  return (
    <SDrawer anchor={"right"} variant="permanent">
      <Divider />
      <List>
        {settingItems.map((item, index) => (
          <div key={index}>
            <STooltip title={item.label} placement="top-end">
              <SListItemButton
                key={index}
                onClick={(e) => handleChannelRightClick(e, item.value)}
              >
                <SListItemIcon>{getIcon(item.icon)}</SListItemIcon>
              </SListItemButton>
            </STooltip>
            {item.value === itemOpened && (
              <SPopoverPaper
                ref={paperRef}
                style={{
                  left: `${
                    anchorEl.x -
                    (!left ? (item.value === "color" ? 286 : 296) : 0)
                  }px`,
                  top: `${anchorEl.y}px`,
                }}
              >
                {item.value === "color" &&
                  renderColorPicker({
                    value: channelColor,
                    onChange: setChannelColor,
                  })}
                {item.value === "instrument" &&
                  renderInstrumentPicker({
                    setSelectOpened,
                    value: currentInstrumentName,
                    onChange: selectInstrument,
                  })}
              </SPopoverPaper>
            )}
          </div>
        ))}
      </List>
      <Divider />
      {!!channels.length && (
        <ChannelList
          {...{
            channels,
            onClick: handleChannelClick,
            currentInstrumentName,
          }}
        />
      )}
      <Divider />
    </SDrawer>
  )
}

export default ChannelsController
