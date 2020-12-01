import React from "react"
import { styled } from "@material-ui/core/styles"
import Footer from "../Header"
import TopSidebar from "../Toolbar"
import LeftSidebar from "../LeftSidebar"
import WorkContainer from "../WorkContainer"
import useDimensions from "react-use-dimensions"
import { IconDictionaryContext } from "../icon-dictionary.js"

const emptyAr = []
const emptyObj = {}


const RightWorkContainer = styled("div")({
  position: "relative",
  height: "100%",
  width: '50%',
  // backgroundColor: grey[50],
  overflowY: "auto",
})

const Container = styled("div")({
  display: "flex",
  width: "80%",
  flexDirection: "column",
  paddingTop: '60px',
  height: "100vh",
  overflow: "hidden",
  border: '2px solid green',
  margin: '0 auto'
})
const SidebarsAndContent = styled("div")({
  display: "flex",
  justifyContent: 'flex-end',
  height: "100%",
  overflow: "hidden",
})

export default ({
  style = emptyObj,
  iconSidebarItems = emptyAr,
  selectedTools = ["select"],
  headerItems = emptyAr,
  rightSidebarItems = emptyAr,
  onClickHeaderItem,
  onFilterValueUpdate,
  onClickIconSidebarItem,
  activeImage,
  headerLeftSide = null,
  iconDictionary = emptyObj,
  children,
}) => {
  const [workContainerRef, workContainerSize] = useDimensions()
  return (
    <IconDictionaryContext.Provider value={iconDictionary}>
      <Container style={style}>

        <SidebarsAndContent>
          {rightSidebarItems.length === 0 ? null : (
            <LeftSidebar height={workContainerSize.height || 0}>
              {/* {rightSidebarItems} */}
              <div style={{height:'300px'}}>
              <h4 style={{color:'red',margin:'10px'}}>Labels</h4>
              </div>
              <div style={{height:'300px',borderTop:'1px solid gray'}}>
              <h4 style={{color:'red',margin:'10px'}}>Objects</h4>
              </div>
            </LeftSidebar>
          )}
          <RightWorkContainer>
            {iconSidebarItems.length === 0 ? null : (
              <TopSidebar
                onClickItem={onClickIconSidebarItem}
                selectedTools={selectedTools}
                items={iconSidebarItems}
                activeImage={activeImage}
                onFilterValueUpdate={onFilterValueUpdate}
              />
            )}
            <WorkContainer ref={workContainerRef}>{children}</WorkContainer>
            <Footer
          leftSideContent={headerLeftSide}
          onClickItem={onClickHeaderItem}
          items={headerItems}
        />
          </RightWorkContainer>

        </SidebarsAndContent>
        
      </Container>
    </IconDictionaryContext.Provider>
  )
}
