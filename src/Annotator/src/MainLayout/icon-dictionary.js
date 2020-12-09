// @flow

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMousePointer,
  faDrawPolygon,
  faGripLines,
  faTag,
  faSun,
  faPencilAlt,
  faArrowsAlt,
  faTint,
  faCrosshairs,
  faSearchPlus,
  faSearchMinus,
  faVectorSquare,
  faAdjust,
  faSearch,
  faMask,
  faEdit,
} from "@fortawesome/free-solid-svg-icons"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import AccessibilityNewIcon from "@material-ui/icons/AccessibilityNew"

const faStyle = { marginTop: 4, width: 20, height: 20, marginBottom: 4,color:'green' }

export const iconDictionary = {
  pan: () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faArrowsAlt} />
  ),
  "zoom-in": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faSearchPlus} />
  ),
  "zoom-out": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faSearchMinus} />
  ),
  "brightness": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faSun} />
  ),
  "contrast": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faAdjust} />
  ),
  "inverse": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faTint} />
  ),
  "polygon": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faDrawPolygon} />
  ),
  "draw": () => (
    <FontAwesomeIcon style={faStyle} size="sm" fixedWidth icon={faPencilAlt} />
  ),
  
  
  select: () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faMousePointer}
    />
  ),
  zoom: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faSearch} />
  ),
  "show-tags": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faTag} />
  ),
  "create-point": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faCrosshairs} />
  ),
  "create-box": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faVectorSquare}
    />
  ),
  "create-polygon": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faDrawPolygon}
    />
  ),
  "create-expanding-line": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faGripLines} />
  ),
  "show-mask": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faMask} />
  ),
  "modify-allowed-area": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faEdit} />
  ),
  "create-keypoints": AccessibilityNewIcon,
  window: FullscreenIcon,
}

export default iconDictionary
