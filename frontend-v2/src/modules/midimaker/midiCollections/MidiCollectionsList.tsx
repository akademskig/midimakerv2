import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material"
import { Delete, MusicNote, Radio, CloudDownload } from "@mui/icons-material"
import React, { useState, useCallback, useMemo } from "react"
import Loader from "../components/shared/loader/Loader"
import { getInstrumentLabel } from "../components/AudioSettingsController/utils"
import { TChannel } from "../providers/SoundfontProvider/SoundFontProvider.types"
import useMidiCollectionsController from "./MidiCollectionsController"
import EmptyListDisplay from "./EmptyListDisplay"
import useMidiFileApi from "../../../hooks/useMidiFile"
import { formatDuration } from "../components/NotesGrid/utils"
import {
  SExpandLessIcon,
  SExpandMoreIcon,
  SList,
  SListItem,
} from "./MidiCollectionsList.styles"
import { SPaper } from "../../../pages/styled"

type TMidiFile = {
  id: string
  name: string
  midiChannels: TChannel[]
  canvasImgBlob: Buffer
  createdAt: string
}

interface IMidiCollectionsItem {
  key: number
  midiFile: TMidiFile
  onDeleteClick: (midiId: string) => void
  convert: (values: { id: string; ext: string }) => Promise<Blob>
}
const MidiCollectionsItem = ({
  midiFile,
  key,
  onDeleteClick,
  convert,
}: IMidiCollectionsItem) => {
  const [open, setOpen] = useState(false)
  const [midiUrl, setMidiUrl] = useState<{ name: string; url: any } | null>()
  const handleItemClick = useCallback(() => {
    setOpen(!open)
  }, [open])
  const duration = useMemo(() => {
    const totalDuration = midiFile.midiChannels.reduce(
      (acc, curr) => (curr.duration > acc ? curr.duration : acc),
      0
    )
    return formatDuration(totalDuration)
  }, [midiFile.midiChannels])

  const handleConvertClick = useCallback(
    (id: string) => {
      convert({ id, ext: "mp3" })
        .then((blob) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setMidiUrl({
              name: "file.mp3",
              url: reader.result,
            })
          }
          reader.readAsDataURL(blob)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    [convert, setMidiUrl]
  )
  console.log(midiUrl)
  return (
    <SListItem key={key}>
      <ListItem onClick={handleItemClick}>
        <ListItemText>{midiFile?.name}</ListItemText>
        {open ? <SExpandLessIcon /> : <SExpandMoreIcon />}

        <IconButton onClick={() => onDeleteClick(midiFile.id)}>
          <Delete color={"error"}></Delete>
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Divider />
        <ListItem>
          <ListItemText>{`Duration: ${duration} m`}</ListItemText>
        </ListItem>
        <List>
          {midiFile.midiChannels.map((channel) => (
            <ListItem>
              <ListItemIcon style={{ color: channel.color }}>
                <MusicNote />
              </ListItemIcon>
              <ListItemText>
                {getInstrumentLabel(channel.instrumentName)}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <ListItem button>
          <ListItemIcon onClick={() => handleConvertClick(midiFile.id)}>
            <Radio />
          </ListItemIcon>
          {midiUrl && (
            <ListItemIcon>
              <a
                href={midiUrl.url}
                onClick={() => setMidiUrl(null)}
                download={midiUrl.name}
              >
                <IconButton title="Download">
                  <CloudDownload />
                </IconButton>
              </a>
            </ListItemIcon>
          )}
        </ListItem>
      </Collapse>
    </SListItem>
  )
}

const MidiCollectionsList = () => {
  const { midiFiles, loading, onDeleteClick } = useMidiCollectionsController()
  const { convert } = useMidiFileApi()
  return (
    <>
      {loading && <Loader />}
      {midiFiles.length > 0 ? (
        <SList>
          {midiFiles.map((midiFile: TMidiFile, key: number) => {
            return (
              <>
                <MidiCollectionsItem
                  midiFile={midiFile}
                  key={key}
                  onDeleteClick={onDeleteClick}
                  convert={convert}
                />
              </>
            )
          })}
        </SList>
      ) : (
        <EmptyListDisplay />
      )}
    </>
  )
}

export default MidiCollectionsList
