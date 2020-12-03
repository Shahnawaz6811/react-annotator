// @flow

import React, { useRef, useCallback,useState } from "react"
import type { Node } from "react"
import { makeStyles, styled } from "@material-ui/core/styles"
import ImageCanvas from "../ImageCanvas"
import styles from "./styles"
import type { MainLayoutState, Action } from "./types"
import useKey from "use-key-hook"
import classnames from "classnames"
import { useSettings } from "../SettingsProvider"
import SettingsDialog from "../SettingsDialog"
// import Fullscreen from "../Fullscreen"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import getActiveImage from "../Annotator/reducers/get-active-image"
import useImpliedVideoRegions from "./use-implied-video-regions"
import { useDispatchHotkeyHandlers } from "../ShortcutsManager"
import { withHotKeys } from "react-hotkeys"
import iconDictionary from "./icon-dictionary"
import KeyframeTimeline from "../KeyframeTimeline"
import Workspace from "../../../Workspace/src/Workspace/"
import DebugBox from "../DebugSidebarBox"
import TagsSidebarBox from "../TagsSidebarBox"
import KeyframesSelector from "../KeyframesSelectorSidebarBox"
import TaskDescription from "../TaskDescriptionSidebarBox"
import RegionSelector from "../RegionSelectorSidebarBox"
import ImageSelector from "../ImageSelectorSidebarBox"
import HistorySidebarBox from "../HistorySidebarBox"
import useEventCallback from "use-event-callback"

const emptyArr = []
const useStyles = makeStyles(styles)

const HotkeyDiv = withHotKeys(({ hotKeys, children, divRef, ...props }) => (
  <div {...{ ...hotKeys, ...props }} ref={divRef}>
    {children}
  </div>
))

const FullScreenContainer = styled("div")({
  width: "100%",
  height: "100%",
  "& .fullscreen": {
    width: "100%",
    height: "100%",
  },
})

type Props = {
  state: MainLayoutState,
  RegionEditLabel?: Node,
  dispatch: (Action) => any,
  alwaysShowNextButton?: boolean,
  alwaysShowPrevButton?: boolean,
  onRegionClassAdded: () => {},
}

export const MainLayout = ({
  state,
  dispatch,
  alwaysShowNextButton = false,
  alwaysShowPrevButton = false,
  RegionEditLabel,
  onRegionClassAdded,
}: Props) => {
  const classes = useStyles()
  const settings = useSettings()
  const fullScreenHandle = useFullScreenHandle()
  const [mouseEvents, setMouseEvents] = useState();

  const memoizedActionFns = useRef({})
  const action = (type: string, ...params: Array<string>) => {
    const fnKey = `${type}(${params.join(",")})`
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey]

    const fn = (...args: any) =>
      params.length > 0
        ? dispatch(
            ({
              type,
              ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
            }: any)
          )
        : dispatch({ type, ...args[0] })
    memoizedActionFns.current[fnKey] = fn
    return fn
  }

  const { currentImageIndex, activeImage } = getActiveImage(state)
  let nextImage
  if (currentImageIndex !== null) {
    nextImage = state.images[currentImageIndex + 1]
  }
  // console.log('ActiveImage: ',activeImage)
  useKey(() => dispatch({ type: "CANCEL" }), {
    detectKeys: [27],
  })

  const isAVideoFrame = activeImage && activeImage.frameTime !== undefined
  const innerContainerRef = useRef()
  const hotkeyHandlers = useDispatchHotkeyHandlers({ dispatch })

  let impliedVideoRegions = useImpliedVideoRegions(state)

  const refocusOnMouseEvent = useCallback((e) => {
    if (!innerContainerRef.current) return
    if (innerContainerRef.current.contains(document.activeElement)) return
    if (innerContainerRef.current.contains(e.target)) {
      innerContainerRef.current.focus()
      e.target.focus()
    }
  }, [])

  const canvas = (
    <ImageCanvas
      {...settings}
      showCrosshairs={
        settings.showCrosshairs &&
        !["select", "pan", "zoom"].includes(state.selectedTool)
      }
      key={state.selectedImage}
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={state.showTags}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={state.regionClsList}
      regionTagList={state.regionTagList}
      regions={
        state.annotationType === "image"
          ? activeImage.regions || []
          : impliedVideoRegions
      }
      activeImage={activeImage}
      realSize={activeImage ? activeImage.realSize : undefined}
      videoPlaying={state.videoPlaying}
      onNewImageLoaded={(events) =>setMouseEvents(events)}
      imageSrc={state.annotationType === "image" ? activeImage.src : null}
      videoSrc={state.annotationType === "video" ? state.videoSrc : null}
      pointDistancePrecision={state.pointDistancePrecision}
      createWithPrimary={state.selectedTool.includes("create")}
      dragWithPrimary={state.selectedTool === "pan"}
      zoomWithPrimary={state.selectedTool === "zoom"}
      showPointDistances={state.showPointDistances}
      videoTime={
        state.annotationType === "image"
          ? state.selectedImageFrameTime
          : state.currentVideoTime
      }
      selectedTool={state.selectedTool}
      keypointDefinitions={state.keypointDefinitions}
      onMouseMove={action("MOUSE_MOVE")}
      onMouseDown={action("MOUSE_DOWN")}
      onMouseUp={action("MOUSE_UP")}
      onChangeRegion={action("CHANGE_REGION", "region")}
      onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
      onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
      onDeleteRegion={action("DELETE_REGION", "region")}
      onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "box", "directions")}
      onBeginMovePolygonPoint={action(
        "BEGIN_MOVE_POLYGON_POINT",
        "polygon",
        "pointIndex"
      )}
      onBeginMoveKeypoint={action(
        "BEGIN_MOVE_KEYPOINT",
        "region",
        "keypointId"
      )}
      onAddPolygonPoint={action(
        "ADD_POLYGON_POINT",
        "polygon",
        "point",
        "pointIndex"
      )}
      onSelectRegion={action("SELECT_REGION", "region")}
      onBeginMovePoint={action("BEGIN_MOVE_POINT", "point")}
      onImageLoaded={action("IMAGE_LOADED", "image")}
      RegionEditLabel={RegionEditLabel}
      onImageOrVideoLoaded={action("IMAGE_OR_VIDEO_LOADED", "metadata")}
      onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
      onChangeVideoPlaying={action("CHANGE_VIDEO_PLAYING", "isPlaying")}
      onRegionClassAdded={onRegionClassAdded}
    />
  )

const onClickIconSidebarItem = useEventCallback((item) => {
  // console.log('item ', mouseEvents, item);
  if (mouseEvents) {
    if (item.name === 'zoom-in') {
      mouseEvents.onWheel({deltaY:-0.25})
    } else if(item.name === 'zoom-out'){
      mouseEvents.onWheel({deltaY:0.25})
    }
  }
  
    dispatch({ type: "SELECT_TOOL", selectedTool: item.name })
  })


const onSelectLabel = useEventCallback((r) => {
  // console.log('R: ', r);
  dispatch({ type: "SELECT_LABEL", selectedLabel: r })
})
const onChangeObject = useEventCallback((r) => {
  // console.log('R: ', r);
  dispatch({ type: "CHANGE_REGION", region: r })
})

const onSelectObject = useEventCallback((r) => {
    // console.log('R: ', r);
    dispatch({ type: "SELECT_REGION", region: r })
})
const onDeleteObject = useEventCallback((r) => {
  // console.log('R: ', r);
  dispatch({ type: "SELECT_LABEL", selectedLabel: r })
})
const onChangeLabel = useEventCallback((r) => {
  // console.log('R: ', r);
  dispatch({ type: "SELECT_LABEL", selectedLabel: r })
})





const onClickFooterItem = useEventCallback((item) => {
  
    dispatch({ type: "HEADER_BUTTON_CLICKED", buttonName: item.name })
  })

  const debugModeOn = Boolean(window.localStorage.$ANNOTATE_DEBUG_MODE && state)
  const nextImageHasRegions =
    !nextImage || (nextImage.regions && nextImage.regions.length > 0)

  return (
    <FullScreenContainer>    
          <Workspace
            iconDictionary={iconDictionary}
        activeImage={activeImage}
        onSelectLabel={onSelectLabel}
        onDeleteObject={onDeleteObject}
                onChangeLabel={onChangeLabel}
                onChangeObject={onChangeObject}
                onSelectObject={onSelectObject}
            state={state}
            footerItems={[
              { name: "Prev" },
              { name: "Next" },
              { name: "Undo" },
              { name: "Redo" },
              // state.annotationType !== "video"
              //   ? null
              //   : !state.videoPlaying
              //   ? { name: "Play" }
              //   : { name: "Pause" },
              // !nextImageHasRegions && activeImage.regions && { name: "Clone" },
              // { name: "Settings" },
              // state.fullScreen ? { name: "Window" } : { name: "Fullscreen" },
              // { name: "Save" },
            ].filter(Boolean)}
            onClickFooterItem={onClickFooterItem}
        onClickIconSidebarItem={onClickIconSidebarItem}
        onFilterValueUpdate={(filter)=>dispatch({type:'UPDATE_FILTER',payload:filter})}
            selectedTools={[
              state.selectedTool,
              state.showTags && "show-tags",
              state.showMask && "show-mask",
            ].filter(Boolean)}
        iconSidebarItems={[
            {
                name: "pan",
                helperText: "Drag/Pan",
                alwaysShowing: true,
              },
              {
                name: "zoom-in",
                helperText: "Zoom In",
                alwaysShowing: true,
              },
              
              {
                name: "zoom-out",
                helperText: "Zoom Out",
                alwaysShowing: true,
              },
              {
                name: "brightness",
                helperText: "Brightness",
                alwaysShowing: true,
              },
              {
                name: "contrast",
                helperText: "Contrast",
                alwaysShowing: true,
             },
             {
                name: "inverse",
                helperText: "Inverse",
                alwaysShowing: true,
              },
              {
                name: "polygon",
                helperText: "Polygon",
                alwaysShowing: true,
              },
              {
                name: "draw",
                helperText: "Free Hand",
                alwaysShowing: true,
              },
              // {
              //   name: "create-expanding-line",
              //   helperText: "Add Expanding Line",
              // },
              // {
              //   name: "create-keypoints",
              //   helperText: "Add Keypoints (Pose)",
              // },
              // state.fullImageSegmentationMode && {
              //   name: "show-mask",
              //   alwaysShowing: true,
              //   helperText: "Show / Hide Mask",
              // },
              // {
              //   name: "modify-allowed-area",
              //   helperText: "Modify Allowed Area",
              // },
            ]
              .filter(Boolean)
              .filter(
                (a) => a.alwaysShowing || state.enabledTools.includes(a.name)
              )}
            rightSidebarItems={[
              // debugModeOn && (
              //   <DebugBox state={debugModeOn} lastAction={state.lastAction} />
              // ),
              // state.taskDescription && (
              //   <TaskDescription description={state.taskDescription} />
              // ),
              // state.labelImages && (
              //   <TagsSidebarBox
              //     currentImage={activeImage}
              //     imageClsList={state.imageClsList}
              //     imageTagList={state.imageTagList}
              //     onChangeImage={action("CHANGE_IMAGE", "delta")}
              //     expandedByDefault
              //   />
              // ),
((state.images && state.images.length) || 0) > 1 && (
                <ImageSelector
                key={3}
                  state={state}
                  onSelect={(img, position) => {
                    dispatch({
                      type: "UPDATE_IMAGE_CANVAS",
                      payload: { img, position },
                    })
                  }}
                  images={state.images}
                />
              ),
              // <RegionSelector
              //   regions={activeImage ? activeImage.regions : emptyArr}
              //   onSelectRegion={action("SELECT_REGION", "region")}
              //   onDeleteRegion={action("DELETE_REGION", "region")}
              //   onChangeRegion={action("CHANGE_REGION", "region")}
              // />,
              // state.keyframes && (
              //   <KeyframesSelector
              //     onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
              //     onDeleteKeyframe={action("DELETE_KEYFRAME", "time")}
              //     onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
              //     currentTime={state.currentVideoTime}
              //     duration={state.videoDuration}
              //     keyframes={state.keyframes}
              //   />
              // ),
              // <HistorySidebarBox
              //   history={state.history}
              //   onRestoreHistory={action("RESTORE_HISTORY")}
              // />,
            ].filter(Boolean)}
          >
            {canvas}
          </Workspace>
          <SettingsDialog
            open={state.settingsOpen}
            onClose={() =>
              dispatch({
                type: "HEADER_BUTTON_CLICKED",
                buttonName: "Settings",
              })
            }
          />
    </FullScreenContainer>
  )
}

export default MainLayout
