import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  TextField,
} from "@mui/material"
import {
  Save,
  LayersClearSharp,
  FolderOpenOutlined,
  CloudUpload,
} from "@mui/icons-material"
import React, { ReactElement, useContext, useState, useCallback } from "react"
import { sample } from "lodash"
import { AudioStateProviderContext } from "../../providers/AudioStateProvider/AudioStateProvider"
import { NotesGridControllerCtx } from "../NotesGrid/NotesGridController"
import { CustomTooltip } from "../shared/Tooltip/CustomTooltip"
import { defaultColors } from "../NotesGrid/constants"
import { TChannel } from "../../providers/SoundfontProvider/SoundFontProvider.types"
import { useAudioController } from "../../controllers/AudioController"
import useMidiFileApi from "../../../../hooks/useMidiFile"
import useNotify from "../../../../hooks/useNotify"
import {
  SButton,
  SContainer,
  SFileList,
  SIconButton,
} from "./FsController.styles"
import { DropzoneDialog } from "react-mui-dropzone"

type TMidiFile = {
  name: string
  id: string
}

function FsController(): ReactElement {
  // const { renderPlay, stopPlayRender } = useContext(CanvasContext)
  const { channels, setChannels, updateGridSetup, setAudioStateLoading } =
    useContext(AudioStateProviderContext)
  const { updateChannels } = useContext(NotesGridControllerCtx)
  const {
    saveMidiFile,
    getFilenames,
    getMidiFile,
    updateMidiFile,
    uploadFile,
  } = useMidiFileApi()
  const notify = useNotify()
  const [open, setOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectFileOpen, setSelectFileOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<TMidiFile | null>()
  const [files, setFiles] = useState<TMidiFile[]>([])
  const [midiName, setMidiName] = useState("test")
  const { loadInstruments } = useAudioController()

  const onSaveClick = useCallback(async () => {
    if (selectedFile) {
      updateMidiFile({ ...selectedFile, midiChannels: channels })
        .then((res) => notify("success", "Midi saved."))
        .catch((error) => notify("error", "An error occurred."))
    } else {
      setOpen(true)
    }
  }, [selectedFile, updateMidiFile, channels, notify])

  const onNameSetClick = useCallback(async () => {
    saveMidiFile({ name: midiName, midiChannels: channels })
      .then(({ id, name, midiChannels }) => {
        setSelectedFile({ id, name })
        setChannels(midiChannels)
        notify("success", "Midi saved.")
        setOpen(false)
      })
      .catch((error) => notify("info", error.message))
  }, [saveMidiFile, midiName, channels, setChannels, notify])

  const onSelectFileClick = useCallback(async () => {
    const files = await getFilenames()
    setFiles(files)
    setSelectFileOpen(true)
  }, [getFilenames])

  const onFileSelectClick = useCallback(
    async (file) => {
      setAudioStateLoading(true)
      setSelectFileOpen(false)
      const { midiChannels } = await getMidiFile({ id: file.id })
      if (midiChannels) {
        const channels = midiChannels.map((d: TChannel) => ({
          ...d,
          color: sample(defaultColors),
        }))
        const updatedChannels = updateChannels(channels)
        loadInstruments(channels)
        setChannels(updatedChannels)
        updateGridSetup(channels)
        setSelectedFile(file)
      }
      setAudioStateLoading(false)
    },
    [
      getMidiFile,
      loadInstruments,
      setAudioStateLoading,
      setChannels,
      updateChannels,
      updateGridSetup,
    ]
  )

  const onUploadFileClick = useCallback(() => {
    setUploadOpen(true)
  }, [])

  const onUploadFileDone = useCallback(
    async (files: any[]) => {
      setUploadOpen(false)
      if (files.length > 0) {
        setAudioStateLoading(true)
        uploadFile(files[0])
          .then((data) => {
            console.log(data)
            const channels = data.map((d: TChannel) => ({
              ...d,
              color: sample(defaultColors),
            }))
            loadInstruments(channels)
            setChannels(updateChannels(channels))
            updateGridSetup(channels)
          })
          .catch((error) => notify("error", error.message))
          .finally(() => {
            setAudioStateLoading(false)
          })
      }
    },
    [
      loadInstruments,
      notify,
      setAudioStateLoading,
      setChannels,
      updateChannels,
      updateGridSetup,
      uploadFile,
    ]
  )

  const onNewMidiClick = useCallback(() => {
    setChannels([])
    setSelectedFile(null)
  }, [setChannels])

  return (
    <>
      <SContainer>
        <SButton>{selectedFile?.name || ""}</SButton>
        <SIconButton>
          <CloudUpload onClick={onUploadFileClick} />
        </SIconButton>
        <CustomTooltip title={"Save"} placement="top-end">
          <SIconButton onClick={onSaveClick}>
            <Save />
          </SIconButton>
        </CustomTooltip>
        <CustomTooltip title={"Load from database"} placement="top-end">
          <SIconButton onClick={onSelectFileClick}>
            <FolderOpenOutlined />
          </SIconButton>
        </CustomTooltip>
        <CustomTooltip title={"Clear grid"} placement="top-end">
          <SIconButton onClick={onNewMidiClick}>
            <LayersClearSharp />
          </SIconButton>
        </CustomTooltip>
      </SContainer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Save midi</DialogTitle>
        <DialogContent>
          <TextField
            value={midiName}
            onChange={(e) => setMidiName(e.target.value)}
            autoFocus
            margin="dense"
            id="name"
            label="Midi name"
            type="text"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => onNameSetClick()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={selectFileOpen}
        onClose={() => setSelectFileOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Select file...</DialogTitle>
        <DialogContent>
          <SFileList>
            {files.map((file) => (
              <ListItem>
                <Button
                  onClick={() => onFileSelectClick(file)}
                  color="secondary"
                >
                  {file.name}
                </Button>
              </ListItem>
            ))}
          </SFileList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectFileOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <DropzoneDialog
        acceptedFiles={[".mid"]}
        onSave={onUploadFileDone}
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        maxFileSize={10000000}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload File</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectFileOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </DropzoneDialog>
    </>
  )
}

export default FsController
