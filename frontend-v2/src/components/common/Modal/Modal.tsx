import React from "react"
import { Backdrop, Fade, Modal, Paper } from "@mui/material"
import { styled } from "@mui/system"

const SModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const SPaper = styled(Paper)(
  ({ theme }) => `
    backgroundColor: ${theme.palette.background.paper};
    boxShadow: ${(theme.shadows as Record<number, string>)[5]};
    padding: ${theme.spacing(2, 4, 3)};
`
)
export default function CustomModal({
  open,
  setOpen,
  children,
  disableBackdropClick,
}: {
  open: boolean
  setOpen: (opened: boolean) => void
  children: any
  disableBackdropClick?: boolean
}) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <SModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <SPaper elevation={2}>{children}</SPaper>
        </Fade>
      </SModal>
    </div>
  )
}
