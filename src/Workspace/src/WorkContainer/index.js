import React from "react"
import { styled } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"

const Container = styled("div")({
  position: "relative",
  height: "60%",
  width:'100%',
  // backgroundColor: grey[50],
  overflowY: "auto",
})
const ShadowOverlay = styled("div")({
  content: "' '",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: "none",
  
})

export const WorkContainer = React.forwardRef(({ children }, ref) => {
  return (
    <Container ref={ref}>
      {children}
      <ShadowOverlay />
    </Container>
  )
})

export default WorkContainer
