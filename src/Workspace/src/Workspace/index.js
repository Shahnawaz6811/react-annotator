import React from "react"
import { styled } from "@material-ui/core/styles"
import Footer from "../Footer"
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
  padding: '0 30px',
  height: "100vh",
  margin:'0 auto',
  overflow: "hidden",
  border: '2px solid green',
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
  footerItems = emptyAr,
  rightSidebarItems = emptyAr,
  onClickFooterItem,
  onFilterValueUpdate,
  onClickIconSidebarItem,
  activeImage,
  state,
  onSelectLabel,
  onChangeLabel,
  onSelectObject,
  onDeleteObject,
  onChangeObject,
  headerLeftSide = null,
  iconDictionary = emptyObj,
  children,
}) => {
  // console.log('Right',rightSidebarItems)
  const [workContainerRef, workContainerSize] = useDimensions()
  return (
    <IconDictionaryContext.Provider value={iconDictionary}>
      <div style={{display:'flex'}}>
      <Container style={style}>
      
        <SidebarsAndContent>
         {/* {rightSidebarItems} */}
          {rightSidebarItems.length === 0 ? null : (
              <LeftSidebar state={state}
                onSelectLabel={onSelectLabel}
                onDeleteObject={onDeleteObject}
                onChangeLabel={onChangeLabel}
                onChangeObject={onChangeObject}
                onSelectObject={onSelectObject}
                height={workContainerSize.height || 0}> </LeftSidebar>
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
            state={state}
          leftSideContent={headerLeftSide}
          onClickItem={onClickFooterItem}
          items={footerItems}
        />
          </RightWorkContainer>

        </SidebarsAndContent>
        
      </Container>
      </div>

      
    </IconDictionaryContext.Provider>
  )
}
