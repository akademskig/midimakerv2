import { getToken } from "../../providers/AuthProvider/Auth.provider";
import checkError from "../utils/checkError";

const baseUrl = `http://localhost:4000`;

export interface IUpdateMidiFileParams {
  id: string;
  name: string;
  midiChannels: any[];
  canvasImgBlob?: Blob | undefined | null;
}

export const saveMidiFileRequest = async ({
  name,
  midiChannels,
}: {
  name: string;
  midiChannels: any[]; //change
}) => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([JSON.stringify(midiChannels, null, 3)], {
      type: "application/json",
    })
  );

  return fetch(`${baseUrl}/midi-file/save/${name}`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}` 
    }
  })
    .then((res) => res.json())
    .then(checkError);
};
export const saveCanvasImageRequest = ({
  id,
  canvasImgBlob,
}: {
  id: string;
  canvasImgBlob: Blob;
}) => {
  const formData = new FormData();
  formData.append("file", canvasImgBlob, "canvasImage");
  return fetch(`${baseUrl}/midi-file/img/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}` ,
      contentType: "application/json",
      responseType: "blob",
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then(checkError)
};

export const updateMidiFileRequest = async ({
  id,
  name,
  midiChannels,
}: IUpdateMidiFileParams) => {
  const formData = new FormData();
  formData.append(
    "file",
    new Blob([JSON.stringify(midiChannels, null, 3)], {
      type: "application/json",
    })
  );
  formData.append("name", name);
  return fetch(`${baseUrl}/midi-file/update/${id}`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Authorization: `Bearer ${getToken()}` ,
      contentType: "application/json",
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then(checkError)
};
export const getMidiFileRequest = async ({ id }: { id: string }) => {
  return fetch(`${baseUrl}/midi-file/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then(checkError)
};
export const getFilenamesRequest = async () => {
  return fetch(`${baseUrl}/midi-file/filenames`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then(checkError)
};
export const getAllByUserRequest = async () => {
  return fetch(`${baseUrl}/midi-file/all`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })
    .then((res) => res.json())
    .then(checkError)
};
export const deleteMidiByIdRequest = async (id: string) => {
  return fetch(`${baseUrl}/midi-file/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .then(checkError)
};
export const convertRequest = async ({
  id,
  ext,
}: {
  id: string;
  ext: string;
}) => {
  return fetch(`${baseUrl}/midi-file/convert/${id}/${ext}`, {
    method: "POST",
    headers: {
      contentType: "application/json",
      responseType: "blob",
      Authorization: `Bearer ${getToken()}`,
    },
  })
    .then((res) => res.blob())
    .then((res) => new Blob([res], { type: "audio/mpeg" }))
    .then(checkError)
};
export const uploadFileRequest = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return fetch(`${baseUrl}/midi-file/upload`, {
    method: "POST",
    headers: {
      contentType: "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then(checkError);
};
