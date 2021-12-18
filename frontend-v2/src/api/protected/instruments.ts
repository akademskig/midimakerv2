import { Player } from "soundfont-player"
import parseError from "../utils/parseError"

const baseUrl = `http://localhost:4000`

export const parseInstrument = ({
  name,
  player,
}: {
  name: string
  player: any
}) => {
  const playerData = Buffer.from(player)
  console.log(JSON.parse(playerData.toString("utf-8")))
  return {
    name,
    player: JSON.parse(""),
  }
}
export const saveInstrument = async ({
  name,
  player,
}: {
  name: string
  player: Player
}) => {
  const formData = new FormData()
  formData.append(
    "file",
    new Blob([JSON.stringify(player, null, 3)], { type: "application/json" })
  )
  formData.append("name", name)
  return fetch(`${baseUrl}/instruments/${name}`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => {
      throw parseError(error)
    })
}
export const getInstrument = async ({ name }: { name: string }) => {
  return fetch(`${baseUrl}/instruments/${name}`)
    .then((res) => res.json())
    .then((res) => parseInstrument(res.data))
    .catch((error) => {
      console.error(error)
      throw parseError(error)
    })
}
