// @flow

import  React,{ useReducer, useEffect } from "react"
import type { Node } from "react"
import MainLayout from "./MainLayout"
import type {
  ToolEnum,
  Image,
  Mode,
  MainLayoutState,
  Action,
} from "./MainLayout/types"
import type { KeypointsDefinition } from "./ImageCanvas/region-tools"

import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import imageReducer from "./reducers/image-reducer.js"
import videoReducer from "./reducers/video-reducer.js"
import historyHandler from "./reducers/history-handler.js"

import useEventCallback from "use-event-callback"
import makeImmutable, { without } from "seamless-immutable"

type Props = {
  taskDescription?: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionTagList?: Array<string>,
  regionClsList?: Array<string>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  enabledTools?: Array<string>,
  selectedTool?: String,
  showTags?: boolean,
  selectedImage?: string | number,
  images?: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  RegionEditLabel?: Node,
  onSubmit: (MainLayoutState) => any,
  onSave: (Image,string) => any,
  useHistory: () => Object,
  renderError: () => any,
  jobName?:string,
  videoTime?: number,
  videoSrc?: string,
  keyframes?: Object,
  videoName?: string,
  keypointDefinitions: KeypointsDefinition,
  fullImageSegmentationMode?: boolean,
  autoSegmentationOptions?:
    | {| type: "simple" |}
    | {| type: "autoseg", maxClusters?: number, slicWeightFactor?: number |},
}

export const Annotator = ({
  images,
  loader,
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = true,
  history,
  enabledTools = [
    "pan",
    "zoom-in",
    "zoom-out",
    "brightness",
    "contrast",
    "inverse",
    "polygon",
    "draw"
  ],
  selectedTool = "pan",
  jobName="",
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  keyframes = {},
  taskDescription = "",
  fullImageSegmentationMode = false,
  RegionEditLabel,
  videoSrc,
  videoTime = 0,
  videoName,
  onSubmit,
  onSave,
  renderError,
  useHistory,
  onNextImage,
  onPrevImage,
  keypointDefinitions,
  autoSegmentationOptions = { type: "autoseg" },
}: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video"
  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      jobName,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      fullImageSegmentationMode: fullImageSegmentationMode,
      autoSegmentationOptions,
      mode: null,
      taskDescription,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history,
      historyCache:{},
      videoName,
      keypointDefinitions,
      ...(annotationType === "image"
        ? {
            selectedImage,
            images,
            selectedImageFrameTime:
              images && images.length > 0 ? images[0].frameTime : undefined,
          }
        : {
            videoSrc,
            keyframes,
          }),
    })
  )

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "FOOTER_BUTTON_CLICKED") {
      // Handle Footer button events

      if (action.buttonName === "submit") {
        //Handle event when submit is clicked
        return onSubmit(without(state, "history"))
      }

      else if (action.buttonName === "save") {
        // Handle event when save is clicked
        const image = state.images[state.selectedImage];

        //Create white canvas with original image dimen
        var canvas = document.createElement("canvas");
        canvas.width = image.pixelSize.w
        canvas.height = image.pixelSize.h
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!image.region_data || image.nothingToLabel) {

          /**
           * Return blank canvas data if.
           * 1. if image has no regions
           * 2. if image has nothing to label
           */
          return onSave(image,canvas.toDataURL("image/png"))
        }

        // Create image with region data.
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + image.region_data);

        img.onload = function () {
          //  Draw image on white canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          return onSave(image,canvas.toDataURL("image/png"))
         };
      }

    }
    // Dispatch action except handled above to reducer
    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
  }, [selectedImage])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'

  return (

      <MainLayout
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        loader={loader}
        useHistory={useHistory}
        renderError={renderError}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
      />
  )
}

export default Annotator
