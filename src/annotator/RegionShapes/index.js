// @flow

import React, { memo,useEffect } from "react"
import colorAlpha from "color-alpha"

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

const RegionComponents = {

  polygon: memo(({ region, iw, ih, fullSegmentationMode }) => {
    const Component = region.open ? "polyline" : "polygon"
    const alphaBase = fullSegmentationMode ? 0.5 : 1
    return (
      <Component
        points={region.points
          .map(([x, y]) => [x * iw, y * ih])
          .map((a) => a.join(" "))
          .join(" ")}
        strokeWidth={0}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    )
  })
}

export const WrappedRegionList = memo(
  ({ regions, keypointDefinitions, iw, ih, fullSegmentationMode }) => {
    return regions
      .filter((r) => r.visible !== false)
      .map((r) => {
        const Component = RegionComponents[r.type]
        return (
          <Component
            key={r.id}
            region={r}
            iw={iw}
            ih={ih}
            keypointDefinitions={keypointDefinitions}
            fullSegmentationMode={fullSegmentationMode}
          />
        )
      })
  },
  (n, p) => n.regions === p.regions && n.iw === p.iw && n.ih === p.ih
)

export const RegionShapes = ({
  mat,
  imagePosition,
  regions = [],
  keypointDefinitions,
  fullSegmentationMode,
  onRegionChange,
}) => {
  const svgRef = React.useRef(null);
  const svg = svgRef.current;
  const iw = imagePosition.bottomRight.x - imagePosition.topLeft.x
  const ih = imagePosition.bottomRight.y - imagePosition.topLeft.y
  useEffect(() => {
    if (svg) {
      //Do this when image regions are changed
      /**
       * 1.Clone svg dom node. (regions are drawn as svg's path)
       * 2.Reset top and left set by pan control to 0
       * 3.Serialize and encode cloned node to string
       * 4.Persist encoded svg data to store
       *  */
      var newSvg = svg.cloneNode(true);
      newSvg.style.top= '0px'
      newSvg.style.left = '0px'
      var s = new XMLSerializer().serializeToString(newSvg);
      var encodedData = window.btoa(s);
      onRegionChange(encodedData);
    }
  },[regions]);

  if (isNaN(iw) || isNaN(ih)) return null



  return (
    <svg
      ref={svgRef}
      width={iw}
      height={ih}
      style={{
        position: "absolute",
        zIndex: 2,
        left: imagePosition.topLeft.x,
        top: imagePosition.topLeft.y,
        pointerEvents: "none",
        width: iw,
        height: ih,
      }}
    >
      <WrappedRegionList
        key="wrapped-region-list"
        regions={regions}
        iw={iw}
        ih={ih}
        keypointDefinitions={keypointDefinitions}
        fullSegmentationMode={fullSegmentationMode}
      />
    </svg>
  )
}

export default RegionShapes
