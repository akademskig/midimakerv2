import React from "react"
import RingLoader from "react-spinners/RingLoader"
import { CANVAS_BACKGROUND, RECT_COLOR } from "../../NotesGrid/constants"
import { styled } from "@mui/material/styles"

const SLoaderRoot = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  position: "absolute",
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  alignItems: "center",
  height: "inherit",
  flexGrow: 1,
  zIndex: 10,
  backgroundColor: RECT_COLOR,
}))

function Loader() {
  return (
    <SLoaderRoot>
      <RingLoader size={100} color={CANVAS_BACKGROUND} />
    </SLoaderRoot>
  )
}

export default Loader
