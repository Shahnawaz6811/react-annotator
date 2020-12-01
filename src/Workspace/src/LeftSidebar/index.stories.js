import React from "react"
import RightSidebar from "."
import SidebarBox from "../SidebarBox"
import FeaturedVideoIcon from "@material-ui/icons/FeaturedVideo"

export default {
  title: "RightSidebar",
  component: RightSidebar,
}

export const Basic = () => (
  <RightSidebar>
    <SidebarBox icon={<FeaturedVideoIcon />} title="Region Selector">
      Content inside sidebar box
    </SidebarBox>
    <SidebarBox icon={<FeaturedVideoIcon />} title="Region Selector">
      Content inside sidebar box
    </SidebarBox>
  </RightSidebar>
)
