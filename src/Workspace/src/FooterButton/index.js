// @flow

import React from "react"
import { getIcon } from "../icon-mapping.js"


export const FooterButton = ({ name, disabled, onClick }) => {

  return (
    <div onClick={onClick}  className="imgNavigation">
      {getIcon(name,disabled)}
    </div>
  )
}

export default FooterButton
