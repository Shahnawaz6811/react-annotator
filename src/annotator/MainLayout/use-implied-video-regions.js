// @flow

import { useMemo } from "react"
import type { MainLayoutVideoAnnotationState } from "./types"
import getImpliedVideoRegions from "../reducers/get-implied-video-regions"

const emptyArr = []

export default (state: MainLayoutVideoAnnotationState) => {
  if (state.annotationType !== "video") return emptyArr
  const { keyframes, currentVideoTime = 0 } = state
  // TODO memoize
  return useMemo(() => getImpliedVideoRegions(keyframes, currentVideoTime), [
    keyframes,
    currentVideoTime,
  ])
}
