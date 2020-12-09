// @flow
import type { MainLayoutState, Action } from "../../MainLayout/types"
import { moveRegion } from "../../ImageCanvas/region-tools.js"
import Immutable,{ getIn, setIn, updateIn } from "seamless-immutable"
import moment from "moment"
import isEqual from "lodash/isEqual"
import getActiveImage from "./get-active-image"
import { saveToHistory } from "./history-handler.js"
import colors from "../../colors"
import fixTwisted from "./fix-twisted"
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon"
import clamp from "clamp"

import getLandmarksWithTransform from "../../utils/get-landmarks-with-transform"

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
    return setIn(
      setIn(state, ["selectedImage"], index),
      ["selectedImageFrameTime"],
      frameTime
    )
  }

  switch (action.type) {
    case "@@INIT": {
      return setIn(state, ['initState'], state);
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image, action.imageIndex)
    }
    
    case 'SELECT_LABEL': {
      // console.log("State: ", state);
      const selectedLabel = action.selectedLabel;
      // console.log(selectedLabel);
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
      console.log("Data: ", regionData);

      return state;
    }
    

    case 'CHANGE_REGION_DATA': {
      const { regionData } = action;
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
    case "BEGIN_MOVE_POINT": {
      state = closeEditors(state)
      return setIn(state, ["mode"], {
        mode: "MOVE_REGION",
        regionId: action.point.id,
      })
    }
    case "BEGIN_BOX_TRANSFORM": {
      const { box, directions } = action
      state = closeEditors(state)
      if (directions[0] === 0 && directions[1] === 0) {
        return setIn(state, ["mode"], { mode: "MOVE_REGION", regionId: box.id })
      } else {
        return setIn(state, ["mode"], {
          mode: "RESIZE_BOX",
          regionId: box.id,
          freedom: directions,
          original: { x: box.x, y: box.y, w: box.w, h: box.h },
        })
      }
    }
    case "BEGIN_MOVE_POLYGON_POINT": {

      const { polygon, pointIndex } = action
      // console.log('Pindex: ', polygon);

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
    case "BEGIN_MOVE_KEYPOINT": {
      const { region, keypointId } = action
      state = closeEditors(state)
      state = saveToHistory(state, "Move Keypoint")
      return setIn(state, ["mode"], {
        mode: "MOVE_KEYPOINT",
        regionId: region.id,
        keypointId,
      })
    }
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
        case "MOVE_KEYPOINT": {
          const { keypointId, regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              keypointId,
            ],
            { ...(region: any).points[keypointId], x, y }
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
        case "RESIZE_BOX": {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh },
          } = state.mode

          const dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox
          const dw =
            xFree === 0
              ? ow
              : xFree === -1
              ? ow + (ox - dx)
              : Math.max(0, ow + (x - ox - ow))
          const dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy
          const dh =
            yFree === 0
              ? oh
              : yFree === -1
              ? oh + (oy - dy)
              : Math.max(0, oh + (y - oy - oh))

          // determine if we should switch the freedom
          if (dw <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree])
          }
          if (dh <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1])
          }

          if (regionId === "$$allowed_area") {
            return setIn(state, ["allowedArea"], {
              x: dx,
              w: dw,
              y: dy,
              h: dh,
            })
          }

          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          const box = activeImage.regions[regionIndex]

          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...box,
            x: dx,
            w: dw,
            y: dy,
            h: dh,
          })
        }
        case "RESIZE_KEYPOINTS": {
          const { regionId, landmarks, centerX, centerY } = state.mode
          const distFromCenter = Math.sqrt(
            (centerX - x) ** 2 + (centerY - y) ** 2
          )
          const scale = distFromCenter / 0.15
          return modifyRegion(regionId, {
            points: getLandmarksWithTransform({
              landmarks,
              center: { x: centerX, y: centerY },
              scale,
            }),
          })
        }
        case "DRAW_POLYGON": {
          // console.log('Draw pol')
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
        case "DRAW_EXPANDING_LINE": {
          const { regionId } = state.mode
          const [expandingLine, regionIndex] = getRegion(regionId)
          if (!expandingLine) return state
          const isMouseDown = Boolean(state.mouseDownAt)
          if (isMouseDown) {
            // If the mouse is down, set width/angle
            const lastPoint = expandingLine.points.slice(-1)[0]
            const mouseDistFromLastPoint = Math.sqrt(
              (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
            )
            if (mouseDistFromLastPoint < 0.002 && !lastPoint.width) return state

            const newState = setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex, "points"],
              expandingLine.points.slice(0, -1).concat([
                {
                  ...lastPoint,
                  width: mouseDistFromLastPoint * 2,
                  angle: Math.atan2(lastPoint.x - x, lastPoint.y - y),
                },
              ])
            )
            return newState
          } else {
            // If mouse is up, move the next candidate point
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex],
              {
                ...expandingLine,
                candidatePoint: { x, y },
              }
            )
          }

          return state
        }
        case "SET_EXPANDING_LINE_WIDTH": {
          const { regionId } = state.mode
          const [expandingLine, regionIndex] = getRegion(regionId)
          if (!expandingLine) return state
          const lastPoint = expandingLine.points.slice(-1)[0]
          const { mouseDownAt } = state
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex, "expandingWidth"],
            Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2)
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
          case "DRAW_EXPANDING_LINE": {
            const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
            if (!expandingLine) break
            const lastPoint = expandingLine.points.slice(-1)[0]
            if (
              expandingLine.points.length > 1 &&
              Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2) < 0.002
            ) {
              if (!lastPoint.width) {
                return setIn(state, ["mode"], {
                  mode: "SET_EXPANDING_LINE_WIDTH",
                  regionId: state.mode.regionId,
                })
              } else {
                return state
                  .setIn(
                    [...pathToActiveImage, "regions", regionIndex],
                    convertExpandingLineToPolygon(expandingLine)
                  )
                  .setIn(["mode"], null)
              }
            }

            // Create new point
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex, "points"],
              expandingLine.points.concat([{ x, y, angle: null, width: null }])
            )
          }
          case "SET_EXPANDING_LINE_WIDTH": {
            const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
            if (!expandingLine) break
            const { expandingWidth } = expandingLine
            return state
              .setIn(
                [...pathToActiveImage, "regions", regionIndex],
                convertExpandingLineToPolygon({
                  ...expandingLine,
                  points: expandingLine.points.map((p) =>
                    p.width ? p : { ...p, width: expandingWidth }
                  ),
                  expandingWidth: undefined,
                })
              )
              .setIn(["mode"], null)
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
      // if (activeImage && (activeImage.regions || []).length > 0) {
      //   defaultRegionCls = activeImage.regions.slice(-1)[0].cls
      //   const clsIndex = (state.regionClsList || []).indexOf(defaultRegionCls)
      //   if (clsIndex !== -1) {
      //     defaultRegionColor = colors[clsIndex % colors.length]
      //   }
      // }

      switch (state.selectedTool) {
        case "create-point": {
          state = saveToHistory(state, "Create Point")
          newRegion = {
            type: "point",
            x,
            y,
            highlighted: true,
            editingLabels: true,
            color: defaultRegionColor,
            id: getRandomId(),
            cls: defaultRegionCls,
          }
          break
        }
        case "create-box": {
          state = saveToHistory(state, "Create Box")
          newRegion = {
            type: "box",
            x: x,
            y: y,
            w: 0,
            h: 0,
            highlighted: true,
            editingLabels: false,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            editLabelEditorAfter: true,
            regionId: newRegion.id,
            freedom: [1, 1],
            original: { x, y, w: newRegion.w, h: newRegion.h },
            isNew: true,
          })
          break
        }
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
        case "create-expanding-line": {
          state = saveToHistory(state, "Create Expanding Line")
          newRegion = {
            type: "expanding-line",
            unfinished: true,
            points: [{ x, y, angle: null, width: null }],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_EXPANDING_LINE",
            regionId: newRegion.id,
          })
          break
        }
        case "create-keypoints": {
          state = saveToHistory(state, "Create Keypoints")
          const [
            [keypointsDefinitionId, { landmarks, connections }],
          ] = (Object.entries(state.keypointDefinitions): any)

          newRegion = {
            type: "keypoints",
            keypointsDefinitionId,
            points: getLandmarksWithTransform({
              landmarks,
              center: { x, y },
              scale: 1,
            }),
            highlighted: true,
            editingLabels: false,
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "RESIZE_KEYPOINTS",
            landmarks,
            centerX: x,
            centerY: y,
            regionId: newRegion.id,
            isNew: true,
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
        case "RESIZE_BOX": {
          if (state.mode.isNew) {
            if (
              Math.abs(state.mode.original.x - x) < 0.002 ||
              Math.abs(state.mode.original.y - y) < 0.002
            ) {
              return setIn(
                modifyRegion(state.mode.regionId, null),
                ["mode"],
                null
              )
            }
          }
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null,
            }
          }
        }
        case "MOVE_REGION":
        case "RESIZE_KEYPOINTS":
        case "MOVE_POLYGON_POINT": {
          // console.log("Moveee")
          return { ...state, mode: null }
        }
        case "MOVE_KEYPOINT": {
          return { ...state, mode: null }
        }
        case "CREATE_POINT_LINE": {
          return state
        }
        case "DRAW_EXPANDING_LINE": {
          // console.log("Drawinggg");
          const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
          if (!expandingLine) return state
          let newExpandingLine = expandingLine
          const lastPoint =
            expandingLine.points.length !== 0
              ? expandingLine.points.slice(-1)[0]
              : mouseDownAt
          let jointStart
          if (expandingLine.points.length > 1) {
            jointStart = expandingLine.points.slice(-2)[0]
          } else {
            jointStart = lastPoint
          }
          const mouseDistFromLastPoint = Math.sqrt(
            (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
          )
          if (mouseDistFromLastPoint > 0.002) {
            // The user is drawing has drawn the width for the last point
            const newPoints = [...expandingLine.points]
            for (let i = 0; i < newPoints.length - 1; i++) {
              if (newPoints[i].width) continue
              newPoints[i] = {
                ...newPoints[i],
                width: lastPoint.width,
              }
            }
            newExpandingLine = setIn(
              expandingLine,
              ["points"],
              fixTwisted(newPoints)
            )
          } else {
            return state
          }
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex],
            newExpandingLine
          )
        }
        default:
          return state
      }
    }

    case "UPDATE_IMAGE_CANVAS": {
      return setNewImage(
        state.images[action.payload.position],
        action.payload.position
      )
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
      console.log("Label", label);
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
          
          // console.log("Original State: ", state);
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
          const label = state.images[currentImageIndex].label;
      return setIn(
        state,
        ["images", currentImageIndex, "label"],
        !label
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
      // console.log("Action,", action);
      if(action.selectedTool === 'inverse') {
       let filter = getIn( state,
        [...pathToActiveImage, "filter"])
       if(!filter){
         filter = {};
         filter.inverse = 0;
       }
      return  setIn(
        state,
        [...pathToActiveImage, "filter"],
        {...filter,inverse: filter.inverse == 0 ? 100:0}
      )      
      }
    
       if (action.selectedTool === "zoom-in") {
        return setIn(state, ["zoomOut"], !state.zoomOut)
      }
      if (action.selectedTool === "modify-allowed-area" && !state.allowedArea) {
        state = setIn(state, ["allowedArea"], { x: 0, y: 0, w: 1, h: 1 })
      }
      state = setIn(state, ["mode"], null)
      return setIn(state, ["selectedTool"], action.selectedTool)
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