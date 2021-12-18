import { styled } from "@mui/system"
import robotImage from "../../../assets/images/icons8-box.svg"

const SRoot = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  justifyContent: "center",
  height: "inherit",
  "& img": {
    width: "230px",
  },
}))

const EmptyListDisplay = () => {
  return (
    <SRoot>
      <img src={robotImage} alt={"emptyList"}></img>
    </SRoot>
  )
}

export default EmptyListDisplay
