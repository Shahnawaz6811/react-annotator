// @flow
import type { MainLayoutState, Action } from "../../MainLayout/types"
import { moveRegion } from "../ImageCanvas/region-tools.js"
import Immutable,{ getIn, setIn, updateIn } from "seamless-immutable"
import moment from "moment"
import isEqual from "lodash/isEqual"
import getActiveImage from "./get-active-image"
import { saveToHistory } from "./history-handler.js"
import colors from "../colors"
import fixTwisted from "./fix-twisted"
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon"
import clamp from "clamp"

import getLandmarksWithTransform from "../utils/get-landmarks-with-transform"

const getRandomId = () => Math.random().toString().split(".")[1]

const generalReducer = (state, action) => {
  if (
    state.allowedArea &&
    state.selectedTool !== "modify-allowed-area" &&
    ["MOUSE_DOWN", "MOUSE_UP", "MOUSE_MOVE"].includes(action.type)
  ) {
    const aa = state.allowedArea
    action.x = clamp(action.x, aa.x, aa.x + aa.w)
    action.y = clamp(action.y, aa.y, aa.y + aa.h)
  }

  if (action.type === "ON_CLS_ADDED" && action.cls && action.cls !== "") {
    const oldRegionClsList = state.regionClsList
    const newState = {
      ...state,
      regionClsList: oldRegionClsList.concat(action.cls),
    }
    return newState
  }

  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - ((state: any).lastMouseMoveCall || 0) < 16) return state
    state = setIn(state, ["lastMouseMoveCall"], Date.now())
  }
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action)
  }

  const { currentImageIndex, pathToActiveImage, activeImage } = getActiveImage(
    state
  )

  const getRegionIndex = (region) => {
    const regionId =
      typeof region === "string" || typeof region === "number"
        ? region
        : region.id
    if (!activeImage) return null
    const regionIndex = (activeImage.regions || []).findIndex(
      (r) => r.id === regionId
    )
    return regionIndex === -1 ? null : regionIndex
  }
  const getRegion = (regionId) => {
    if (!activeImage) return null
    const regionIndex = getRegionIndex(regionId)
    if (regionIndex === null) return [null, null]
    const region = activeImage.regions[regionIndex]
    return [region, regionIndex]
  }
  const modifyRegion = (regionId, obj) => {
    const [region, regionIndex] = getRegion(regionId)
    if (!region) return state
    if (obj !== null) {
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...region,
        ...obj,
      })
    } else {
      // delete region
      const regions = activeImage.regions
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (regions || []).filter((r) => r.id !== region.id)
      )
    }
  }
  const unselectRegions = (state: MainLayoutState) => {
    if (!activeImage) return state
    return setIn(
      state,
      [...pathToActiveImage, "regions"],
      (activeImage.regions || []).map((r) => ({
        ...r,
        highlighted: false,
      }))
    )
  }

  const closeEditors = (state: MainLayoutState) => {
    if (currentImageIndex === null) return state
    return setIn(
      state,
      [...pathToActiveImage, "regions"],
      (activeImage.regions || []).map((r) => ({
        ...r,
        editingLabels: false,
      }))
    )
  }

  const setNewImage = (img: string | Object, index: number) => {
    let { src, frameTime } = typeof img === "object" ? img : { src: img }
    state=  setIn(
      setIn(state, ["selectedImage"], index),
      ["selectedImageFrameTime"],
      frameTime
    )
      return state;
  }

  switch (action.type) {
    case "@@INIT": {
      return setIn(state, ['initState'], state);
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image, action.imageIndex)
    }

    case "UPDATE_IMAGE_REGIONS": {
      const {regions} = action;
      return setIn(
        state,
        ['images', currentImageIndex, 'regions'],regions
      )
    }

    case 'SELECT_LABEL': {

      const selectedLabel = action.selectedLabel;
      return setIn(
        state,
        ['images', state.selectedImage, 'label'],selectedLabel
      )
    }

    case "CHANGE_REGION": {
      // console.log("ActionRegion:", action.region);
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const oldRegion = activeImage.regions[regionIndex]
      // console.log('OldRegion,', oldRegion);
      // console.log('NewRegion,', action.region);
      if (oldRegion.cls !== action.region.cls) {
        state = saveToHistory(state, "Change Region Classification")
        const clsIndex = state.regionClsList.indexOf(action.region.cls)
        if (clsIndex !== -1) {
          action.region.color = colors[clsIndex % colors.length]
        }
      }
      if (!isEqual(oldRegion.tags, action.region.tags)) {
        state = saveToHistory(state, "Change Region Tags")
      }
      return setIn(
        state,
        [...pathToActiveImage, "regions", regionIndex],
        action.region
      )
    }

    case 'SUBMIT': {

      const regionData = getIn(state, [...pathToActiveImage, "region_data"])

      return state;
    }

    case 'IMAGE_LOADED': {
      const { loading } = action;
      state = setIn(state, [...pathToActiveImage, "loading"], loading)
      return state;
    }


    case 'CHANGE_REGION_DATA': {
      // Set svg encoded data of drawn regions as regionData for current image
      const regionData = action.payload;
       return setIn(state, [...pathToActiveImage, "region_data"], regionData)
      }
    case "CHANGE_LABEL": {
      const label = action.label;
      if (!label || activeImage.regions.length === 0) {
        return state;
      }


      // Check if image has regions associated to this label
      const hasRegions = [...(activeImage.regions || [])].find((r) => r.cls === label.cls);
      if (!hasRegions) {
        return state;
      }


      const regions = [...(activeImage.regions || [])].map((r) => {
        if (r.cls === label.cls) {
          return ({
            ...r,
            visible: label.visible,
            locked: label.locked
          })
        }
        return r;
      })

     state = setIn(state, ['regionClsList'], state.regionClsList.map(regionLabel => {
        if (regionLabel.cls === label.cls) {
          return ({
            ...regionLabel,
            visible: label.visible,
            locked: label.locked

          })
        }
       return regionLabel;
      }));


      return setIn(state, [...pathToActiveImage, "regions"], regions)

    }
    case "CHANGE_IMAGE": {
      if (!activeImage) return state
      const { delta } = action
      for (const key of Object.keys(delta)) {
        if (key === "cls") saveToHistory(state, "Change Image Class")
        if (key === "tags") saveToHistory(state, "Change Image Tags")
        state = setIn(state, [...pathToActiveImage, key], delta[key])
      }
      return state
    }
    case "SELECT_REGION": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const regions = [...(activeImage.regions || [])].map((r) => ({
        ...r,
        highlighted: r.id === region.id,
        editingLabels: r.id === region.id,
      }))
      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }


    case "BEGIN_MOVE_POLYGON_POINT": {
      const { polygon, pointIndex } = action
      state = closeEditors(state)
      if (
        state.mode &&
        state.mode.mode === "DRAW_POLYGON" &&
        pointIndex === 0
      ) {
        return setIn(
          modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false,
          }),
          ["mode"],
          null
        )
      }
      // else {
      //   state = saveToHistory(state, "Move Polygon Point")
      // }
      return setIn(state, ["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon.id,
        pointIndex,
      })
    }

    // Add new polygon point on its edge
    case "ADD_POLYGON_POINT": {
      const { polygon, point, pointIndex } = action
      const regionIndex = getRegionIndex(polygon)
      // console.log("regionIndex", regionIndex);
      if (regionIndex === null) return state
      const points = [...polygon.points]
      points.splice(pointIndex, 0, point)
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...polygon,
        points,
      })
    }
    case "MOUSE_MOVE": {
      const { x, y } = action

      if (!state.mode) return state
      if (!activeImage) return state
      const { mouseDownAt } = state
      switch (state.mode.mode) {
        case "MOVE_POLYGON_POINT": {
          const { pointIndex, regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              pointIndex,
            ],
            [x, y]
          )
        }

        case "MOVE_REGION": {
          const { regionId } = state.mode
          if (regionId === "$$allowed_area") {
            const {
              allowedArea: { w, h },
            } = state
            return setIn(state, ["allowedArea"], {
              x: x - w / 2,
              y: y - h / 2,
              w,
              h,
            })
          }
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex],
            moveRegion(activeImage.regions[regionIndex], x, y)
          )
        }


        case "DRAW_POLYGON": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              (region: any).points.length - 1,
            ],
            [x, y]
          )
        }

        default:
          return state
      }
    }
    case "MOUSE_DOWN": {
      if (!activeImage) return state
      const { x, y } = action

      state = setIn(state, ["mouseDownAt"], { x, y })
      if (state.mode) {
        switch (state.mode.mode) {
          case "DRAW_POLYGON": {
            const [polygon, regionIndex] = getRegion(state.mode.regionId)
            if (!polygon) break
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex],
              { ...polygon, points: polygon.points.concat([[x, y]]) }
            )
          }

          default:
            break
        }
      }

      let newRegion
      if (!activeImage.label) {
        return state;
      }
      let defaultRegionCls = activeImage.label.cls,
        defaultRegionColor = activeImage.label.color
      switch (state.selectedTool) {

        case "polygon": {

          if (state.mode && state.mode.mode === "DRAW_POLYGON") break
          state = saveToHistory(state, "Create Polygon")
          newRegion = {
            type: "polygon",
            points: [
              [x, y],
              [x, y],
            ],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_POLYGON",
            regionId: newRegion.id,
          })
          break
        }

        default:
          break
      }

      const regions = [...(getIn(state, pathToActiveImage).regions || [])]
        .map((r) =>
          setIn(r, ["editingLabels"], false).setIn(["highlighted"], false)
        )
        .concat(newRegion ? [newRegion] : [])

      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "MOUSE_UP": {
      const { x, y } = action

      const { mouseDownAt = { x, y } } = state
      if (!state.mode) return state
      state = setIn(state, ["mouseDownAt"], null)
      switch (state.mode.mode) {

        case "MOVE_POLYGON_POINT": {
          return { ...state, mode: null }
        }

        default:
          return state
      }
    }


    case "OPEN_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const newRegions = setIn(
        activeImage.regions.map((r) => ({
          ...r,
          highlighted: false,
          editingLabels: false,
        })),
        [regionIndex],
        {
          ...(activeImage.regions || [])[regionIndex],
          highlighted: true,
          editingLabels: true,
        }
      )
      return setIn(state, [...pathToActiveImage, "regions"], newRegions)
    }
    case "CLOSE_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...(activeImage.regions || [])[regionIndex],
        editingLabels: false,
      })
    }

    case 'CLICK_LABEL': {
      const label = state.images[currentImageIndex].label;
      return setIn(
        state,
        ["images", currentImageIndex, "label"],
        !label
      )
    }
    case "DELETE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const region = action.region;


      state =  setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => r.id !== action.region.id)
      )

      let historyCacheForActiveImage = getIn(state, ['historyCache', activeImage.name]);
      if (historyCacheForActiveImage) {
        historyCacheForActiveImage = Immutable.asMutable(historyCacheForActiveImage);
        historyCacheForActiveImage.push(region)
      } else {
        historyCacheForActiveImage = [];
        historyCacheForActiveImage.push(region)
      }
      return setIn(state, ['historyCache', activeImage.name], historyCacheForActiveImage);

    }
    case "DELETE_SELECTED_REGION": {
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => !r.highlighted)
      )
    }
    case "FOOTER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase()
      switch (buttonName) {
        case "undo": {


          // Check if current image has active regions to undo
          if (activeImage.regions && activeImage.regions.length > 0) {

            // get last region inserted to active image
           let lastRegionAddedToActiveImage = getIn(state,
            [...pathToActiveImage, "regions",activeImage.regions.length - 1])


            //Remove last region inserted to active image
            state =
            setIn(state,[...pathToActiveImage, "regions"], activeImage.regions.filter((element, index) => index < activeImage.regions.length - 1))

             // Cache last active image region to historyCache
            let historyCacheForActiveImage = getIn(state, ['historyCache', activeImage.name]);
            if (historyCacheForActiveImage) {
              historyCacheForActiveImage = Immutable.asMutable(historyCacheForActiveImage);
              historyCacheForActiveImage.push(lastRegionAddedToActiveImage)
            } else {
              historyCacheForActiveImage = [];
              historyCacheForActiveImage.push(lastRegionAddedToActiveImage)
            }
            state =  setIn(state, ['historyCache', activeImage.name], historyCacheForActiveImage);

          }
          return state;
        }
        case "redo": {

          // Check if we have regions in cache  to redo
          if (state.historyCache && state.historyCache[activeImage.name] && state.historyCache[activeImage.name].length > 0) {

            // get last item inserted to history cache
            // let lastRegionAddedToCache = getIn(state,
            //   ["historyCache", state.historyCache.length - 1]);
            let lastRegionAddedToCache = state.historyCache[activeImage.name][state.historyCache[activeImage.name].length - 1];

            // remove last item from history cache.
            state =
              setIn(state, ['historyCache', activeImage.name], state.historyCache[activeImage.name].filter((element, index) => index < state.historyCache[activeImage.name].length - 1))


            // console.log("lastRegionAddedToCache", lastRegionAddedToCache)
            // redo active image regions with last item popped from history cache
            state =
            setIn(state,[...pathToActiveImage, "regions",activeImage.regions.length],  lastRegionAddedToCache)
            // return state.historyCache[0];
            // console.log("After redoing regions ", state);

          }
          return state;

        }
        case 'reset': {
          // console.log('Before reset: ', state);
          if (activeImage.regions && activeImage.regions.length > 0) {
            let historyCacheForActiveImage = getIn(state, ['historyCache', activeImage.name]);
            if (historyCacheForActiveImage && historyCacheForActiveImage.length > 0) {
             // clear history cache for current image.
            state =
              setIn(state,['historyCache',activeImage.name], [])
            }
            state =
              setIn(state,['historyCache',activeImage.name], activeImage.regions)

            state =
              setIn(state,
                [...pathToActiveImage, "regions"],
                [])
          }

            // state = setIn(state.history[state.history.length - 1].state, ['history'], []);
            // console.log("After reset", state);


          return state;
        }
        case "prev": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === 0) return state
          return setNewImage(
            state.images[currentImageIndex - 1],
            currentImageIndex - 1
          )
        }
        case "next": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setNewImage(
            state.images[currentImageIndex + 1],
            currentImageIndex + 1
          )
        }

        case "save": {
          return state
        }

        case 'nolabel': {
          const nothingToLabel = state.images[currentImageIndex].nothingToLabel;
      return setIn(
        state,
        ["images", currentImageIndex, "nothingToLabel"],
        !nothingToLabel
      )
        }

        case "clone": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setIn(
            setNewImage(
              state.images[currentImageIndex + 1],
              currentImageIndex + 1
            ),
            ["images", currentImageIndex + 1, "regions"],
            activeImage.regions
          )
        }
        case "settings": {
          return setIn(state, ["settingsOpen"], !state.settingsOpen)
        }
        case "help": {
          return state
        }
        case "fullscreen": {
          return setIn(state, ["fullScreen"], true)
        }
        case "exit fullscreen":
        case "window": {
          return setIn(state, ["fullScreen"], false)
        }
        case "hotkeys": {
          return state
        }
        case "exit":
        case "done": {
          return state
        }
        default:
          return state
      }
      break;
    }

    case "UPDATE_FILTER": {

      // return setIn(state, ["zoomOut"], !state.zoomOut)
      // console.log('Action:',action.payload.value);
      let filter = getIn( state,
        [...pathToActiveImage, "filter"])
        if(!filter){
          filter = {};
          // filter['brightness'] = action.payload.value;
       }
      //  console.log('Payliad: ',filter);

      const newState =  setIn(
        state,
        [...pathToActiveImage, "filter"],
        {...filter,[action.payload.name]: action.payload.value}
      )

      return newState;

    }
    case "SELECT_TOOL": {
      state = setIn(state, ["selectedTool"], action.selectedTool)
      if(action.selectedTool === 'inverse') {
       let filter = getIn( state,
        [...pathToActiveImage, "filter"])
       if(!filter){
         filter = {};
         filter.inverse = 0;
       }
      state =  setIn(
        state,
        [...pathToActiveImage, "filter"],
        {...filter,inverse: filter.inverse == 0 ? 100:0}
      )
      }

       if (action.selectedTool === "zoom-in") {
        state =  setIn(state, ["zoomOut"], !state.zoomOut)
      }
      if (action.selectedTool === "modify-allowed-area" && !state.allowedArea) {
        state = setIn(state, ["allowedArea"], { x: 0, y: 0, w: 1, h: 1 })
      }
      return setIn(state, ["mode"], null)
    }
    case "CANCEL": {
      const { mode } = state
      if (mode) {
        switch (mode.mode) {
          case "DRAW_EXPANDING_LINE":
          case "SET_EXPANDING_LINE_WIDTH":
          case "DRAW_POLYGON": {
            const { regionId } = mode
            return modifyRegion(regionId, null)
          }
          case "MOVE_POLYGON_POINT":
          case "RESIZE_BOX":
          case "MOVE_REGION": {
            return setIn(state, ["mode"], null)
          }
          default:
            return state
        }
      }
      // Close any open boxes
      const regions: any = activeImage.regions
      if (regions && regions.some((r) => r.editingLabels)) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            editingLabels: false,
          }))
        )
      } else if (regions) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            highlighted: false,
          }))
        )
      }
      break
    }
    default:
      break
  }
  return state
}


export default generalReducer;
