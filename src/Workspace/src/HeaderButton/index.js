// @flow

import React from "react"
import Button from "@material-ui/core/Button"
import { styled } from "@material-ui/core/styles"
import { useIconDictionary } from "../icon-dictionary.js"
import { iconMapping } from "../icon-mapping.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import {
  faUndo,
  faRedo,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
const emptyObj = {}
const faStyle = { marginTop: 4, width: 20, height: 20, marginBottom: 4,color:'green' }
const defaultNameIconMapping = iconMapping


const getIcon = (name, customIconMapping) => {
  const Icon =
    customIconMapping[name.toLowerCase()] ||
    defaultNameIconMapping[name.toLowerCase()] ||
    defaultNameIconMapping.help
  return <Icon />
}

const StyledButton = styled(Button)({
  textTransform: "none",
  width: 30,

})
const ButtonInnerContent = styled("div")({
  display: "flex",
  flexDirection: "column",
})
const IconContainer = styled("div")({})
const Text = styled("div")({
  fontWeight: "bold",
  lineHeight: 1,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const Icon = (name) => {
  switch (name) {
    case 'Undo':
      return faUndo;
    case 'Redo':
      return faRedo;
      case 'Prev':
      return faChevronLeft;
      case 'Next':
        return faChevronRight;
    
  }
}


export const HeaderButton = ({ name, icon, disabled, onClick }) => {
  const customIconMapping = useIconDictionary()
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      <ButtonInnerContent>
      <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={Icon(name)} />
        <Text>
          <div>{name}</div>
        </Text>
      </ButtonInnerContent>
    </StyledButton>
  )
}

export default HeaderButton
