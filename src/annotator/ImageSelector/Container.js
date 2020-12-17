// @flow

import React, { useState, memo } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"
import classnames from "classnames"
import useEventCallback from "use-event-callback"
import Typography from "@material-ui/core/Typography"

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


  return (
    <div className="dpfSidebar">
      <div className="listHeader">
        {icon }
        <Typography className="">
          {title} <span>{subTitle}</span>
        </Typography>

      </div>
      {
        content
      }

    </div>
  )
}

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
