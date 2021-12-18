import { useCallback } from "react"
import {
  convertRequest,
  deleteMidiByIdRequest,
  getAllByUserRequest,
  getFilenamesRequest,
  getMidiFileRequest,
  IUpdateMidiFileParams,
  saveCanvasImageRequest,
  saveMidiFileRequest,
  updateMidiFileRequest,
  uploadFileRequest,
} from "../api/protected/midiFile"

export default function useMidiFileApi() {
  const saveMidiFile = useCallback((params) => {
    return saveMidiFileRequest(params)
  }, [])
  const saveCanvasImage = useCallback(
    (params: { id: string; canvasImgBlob: Blob }) => {
      return saveCanvasImageRequest(params)
    },
    []
  )
  const updateMidiFile = useCallback((params: IUpdateMidiFileParams) => {
    return updateMidiFileRequest(params)
  }, [])

  const getMidiFile = useCallback(async ({ id }: { id: string }) => {
    return getMidiFileRequest({ id })
  }, [])
  const getFilenames = useCallback(() => {
    return getFilenamesRequest()
  }, [])

  const getAllByUser = useCallback(async () => {
    return getAllByUserRequest()
  }, [])
  const deleteMidiById = useCallback(async (id: string) => {
    return deleteMidiByIdRequest(id)
  }, [])

  const convert = useCallback(
    async ({ id, ext }: { id: string; ext: string }) => {
      return convertRequest({ id, ext })
    },
    []
  )
  const uploadFile = useCallback(async (file: File) => {
    return uploadFileRequest(file)
  }, [])
  return {
    saveMidiFile,
    getMidiFile,
    getFilenames,
    updateMidiFile,
    getAllByUser,
    deleteMidiById,
    convert,
    saveCanvasImage,
    uploadFile,
  }
}
