import React, { useReducer, useEffect, useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import ButtonBase from "@material-ui/core/ButtonBase"
import ExpandIcon from "@material-ui/icons/KeyboardArrowLeft"
import ContractIcon from "@material-ui/icons/KeyboardArrowRight"
import { grey } from "@material-ui/core/colors"

const Container = styled("div")({
  width: 300,
  display: "flex",
  flexDirection: "column",
  height: '80%',
  padding:'0 20px',
  marginRight:'20px',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2)',
  transition: '0.3s',
  marginTop:'30px',
  "&.expanded": {
    width: 300,
  },
})


const InnerSliderContent = styled("div")({
  width: 300,
})

const getInitialExpandedState = () => {
  return Boolean(window.__REACT_WORKSPACE_LAYOUT_EXPANDED_STATE)
}

export const RightSidebar = ({ children, initialExpandedState, height }) => {
  const [expanded, toggleExpanded] = useReducer(
    (state) => !state,
    initialExpandedState === undefined
      ? getInitialExpandedState()
      : initialExpandedState
  )

  useEffect(() => {
    if (initialExpandedState !== undefined) {
      window.__REACT_WORKSPACE_LAYOUT_EXPANDED_STATE = expanded
    }
  }, [initialExpandedState, expanded])

  const containerStyle = useMemo(() => ({ height: height || "100%" }), [height])

  return (
    <Container>
        <InnerSliderContent>{children}</InnerSliderContent>      
    </Container>
  )
}

export default RightSidebar
