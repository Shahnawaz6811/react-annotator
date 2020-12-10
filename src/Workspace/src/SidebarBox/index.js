// @flow

import React, { useState, memo } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import ExpandIcon from "@material-ui/icons/ExpandMore"
import IconButton from "@material-ui/core/IconButton"
import Collapse from "@material-ui/core/Collapse"
import { grey } from "@material-ui/core/colors"
import classnames from "classnames"
import useEventCallback from "use-event-callback"
import Typography from "@material-ui/core/Typography"
import { useIconDictionary } from "../icon-dictionary.js"

const useStyles = makeStyles({
  
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    paddingRight: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    flexGrow: 1,
    paddingLeft: 8,
    color: grey[800],
    "& span": {
      color: grey[600],
      fontSize: 12,
    },
  },
  expandButton: {
    padding: 0,
    width: 30,
    height: 30,
    "& .icon": {
      marginTop: -6,
      width: 20,
      height: 20,
      transition: "500ms transform",
      "&.expanded": {
        transform: "rotate(180deg)",
      },
    },
  },
  expandedContent: {
    // maxHeight: 300,
    // overflowY: "auto",
    "&.noScroll": {
      overflowY: "visible",
      overflow: "visible",
    },
  },
})

export const SidebarBox = ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault = false,
}) => {
  const classes = useStyles()
  const content = (
    <div
      className={classnames(classes.expandedContent, noScroll && "noScroll")}
    >
      {children}
    </div>
  )

  const [expanded, changeExpanded] = useState(expandedByDefault)
  const toggleExpanded = useEventCallback(() => changeExpanded(!expanded))
  const customIconMapping = useIconDictionary()
  const TitleIcon = customIconMapping[title.toLowerCase()]
  return (
    <div className="dpfSidebar">
      <div className="listHeader">
        {icon || <TitleIcon />}
        <Typography className="">
          {title} <span>{subTitle}</span>
        </Typography>
        {/* <IconButton onClick={toggleExpanded} className={classes.expandButton}>
          <ExpandIcon className={classnames("icon", expanded && "expanded")} />
        </IconButton> */}
      </div>
      {
        content
      }
      {/* {noScroll ? (
        expanded ? (
          content
        ) : null
      ) : (
        <Collapse in={expanded}>{content}</Collapse>
      )} */}
    </div>
  )
}

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
