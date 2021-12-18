import { Slider } from "@mui/material"
import { styled } from "@mui/material/styles"
import { MUIStyledCommonProps } from "@mui/system"
import { CANVAS_BACKGROUND, RECT_COLOR } from "./constants"

type NotesGridProps = {
  height: number
  $playing: boolean
  $paused: boolean
}
export const SCanvasContainer = styled("div")(() => ({
  position: "relative",
  display: "flex",
  flexDirection: "row",
  background: RECT_COLOR,
  flexGrow: 1,
  width: "200px",
}))

export const SNotesListCanvas = styled("div")(() => ({
  background: "rgba(4,32,55)",
  outline: "none",
  padding: "1px 0",
  zIndex: 1,
  borderTop: "none",
  fontFamily: "Fira Code",
}))

export const SGridCanvasContainer = styled("div")(
  ({ height }: MUIStyledCommonProps<any> & Pick<NotesGridProps, "height">) => ({
    height: `${height - 220}px`,
    background: CANVAS_BACKGROUND,
    padding: "1px",
    position: "relative",
  })
)

export const SCanvasAndTimerContainer = styled("div")(() => ({
  width: "fit-content",
}))

export const SCanvas = styled("canvas")(() => ({
  cursor: "pointer",
  background: RECT_COLOR,
  outline: "none",
}))

export const STimerCanvas = styled("canvas", {
  shouldForwardProp: (prop: string) => prop[0] !== "$",
})(
  ({
    $playing,
    $paused,
  }: MUIStyledCommonProps<any> & Omit<NotesGridProps, "height">) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: !$playing && !$paused ? -1 : 2,
    background: "transparent",
  })
)

export const SNotesCanvas = styled("canvas")(() => ({
  outline: "none",
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  background: "transparent",
  cursor: "pointer",
}))

export const STimerSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.light,
  height: "4px",
  marginTop: "-2px",
  padding: `${theme.spacing(0)}px  0`,
  "& .MuiSlider-markLabel": {
    top: "2px",
    color: theme.palette.primary.light,
  },
}))
