import React from "react"
import { styled } from "@material-ui/core/styles"
import Footer from "./components/Footer"
import Toolbar from "./components/Toolbar"
import LeftSidebar from "./LeftSidebar"
import WorkContainer from "./WorkContainer"
import ImageSwitcher from "./components/ImageSwitcher"
import useDimensions from "react-use-dimensions"


const emptyAr = []
const emptyObj = {}



const RightWorkContainer = styled("div")({
  position: "relative",
  height: "100%",
  width: '100%',
  padding:'0 20px',
  // backgroundColor: grey[50],
  overflowY: "auto",
})

const Container = styled("div")({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  padding: '5px',
  // height: "100vh",
  margin:'0 auto',
  overflow: "hidden"
})
const SidebarsAndContent = styled("div")({
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
})

const Workspace = ({
  style = emptyObj,
  toolbarItems = emptyAr,
  selectedTools = ["select"],
  footerItems = emptyAr,
  imageSelector = emptyAr,
  onClickFooterItem,
  onFilterValueUpdate,
  onClickToolbarItem,
  activeImage,
  state,
  useHistory,
  dispatch,
  onSubmit,
  onClickLabel,
  onSelectLabel,
  onChangeLabel,
  onSelectObject,
  onDeleteObject,
  onChangeObject,
  headerLeftSide = null,
  children,
}) => {
  const [workContainerRef, workContainerSize] = useDimensions()

  return (

      <div style={{display:'flex'}}>
      <Container style={style}>
        <SidebarsAndContent  className="dpfContainer">
         {imageSelector}

            <LeftSidebar
              className="dpfLeftsidebar"
              state={state}
                onSelectLabel={onSelectLabel}
                onDeleteObject={onDeleteObject}
                onChangeLabel={onChangeLabel}
                onChangeObject={onChangeObject}
                onSelectObject={onSelectObject}
                height={workContainerSize.height || 0}/>

            <RightWorkContainer
              className="drawContainer"
            >
              <div>

            {toolbarItems.length === 0 ? null : (
              <Toolbar
                onClickItem={onClickToolbarItem}
                selectedTools={selectedTools}
                items={toolbarItems}
                  activeImage={activeImage}
                  width={workContainerSize.width || 0}
                onFilterValueUpdate={onFilterValueUpdate}
              />
            )}
              <WorkContainer ref={workContainerRef}>{children}</WorkContainer>
              <ImageSwitcher dispatch={dispatch} useHistory={useHistory} state={state}  />

            <Footer
                state={state}
                dispatch={dispatch}
                items={footerItems}

        />
            </div>
          </RightWorkContainer>

        </SidebarsAndContent>

      </Container>
      </div>
  )
}


export default Workspace;
