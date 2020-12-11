// @flow

import  React,{ useReducer, useEffect } from "react"
import type { Node } from "react"
import MainLayout from "../MainLayout"
import type {
  ToolEnum,
  Image,
  Mode,
  MainLayoutState,
  Action,
} from "../MainLayout/types"
import type { KeypointsDefinition } from "../ImageCanvas/region-tools"
import SettingsProvider from "../SettingsProvider"

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
  onSave: (Object) => any,
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
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = true,
  history,
  enabledTools = [
    "pan",
    "zoom-in",
    "polygon",
    "show-mask",
    "free-hand"
  ],
  renderError,
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
      // console.log('Footer');
      if (action.buttonName === "submit") {
        return onSubmit(without(state, "history"))
      }

     
      else if (action.buttonName === "save") {
        
        const image = state.images[state.selectedImage];
        // console.log("Image: ", image)
        
        //Create white canvas with original image dimen
        var canvas = document.createElement("canvas");
        canvas.width = image.pixelSize.w
        canvas.height = image.pixelSize.h
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // console.log("Canvas Dimen", canvas.width, canvas.height);



        if (!image.region_data || image.nothingToLabel) {
          // console.log("No data");
          //return blank canvas data if image has no regions.
          return onSave(image,canvas.toDataURL("image/png"))
        }
       
        // Draw image on canvas 
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + image.region_data);
        
        img.onload = function () {
          ctx.drawImage(img, 0, 0,canvas.width,canvas.height);
          // console.log('ImageData', canvas.toDataURL("image/png"))
          return onSave(image,canvas.toDataURL("image/png"))
         };
      }
        //   return onNextImage(without(state, "history"))
        // }
      // else if (action.buttonName === "Next" && onNextImage) {
      //   return onNextImage(without(state, "history"))
      // } else if (action.buttonName === "Prev" && onPrevImage) {
      //   return onPrevImage(without(state, "history"))
      // }
    }
    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  // useEffect(() => {
  //   if (selectedImage === undefined) return
  //   dispatchToReducer({
  //     type: "SELECT_IMAGE",
  //     imageIndex: selectedImage,
  //     image: state.images[selectedImage],
  //   })
  // }, [selectedImage])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'

  return (
    <SettingsProvider>
      <MainLayout
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        history={history}
        renderError={renderError}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
      />
    </SettingsProvider>
  )
}

export default Annotator
