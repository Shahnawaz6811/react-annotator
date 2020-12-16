// @flow

import React, { memo,useEffect,useLayoutEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import SidebarBoxContainer from "../SidebarBoxContainer"
import CollectionsIcon from "@material-ui/icons/Folder"
import { grey,red } from "@material-ui/core/colors"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import isEqual from "lodash/isEqual"
import {Link,useParams,useLocation } from 'react-router-dom';

const useStyles = makeStyles({
  img: { width: 170, height: 40, marginLeft:30, borderRadius: 8 },
})

export const ImageSelectorSidebarBox = ({ images, onSelect,state,useHistory }) => {
  const history = useHistory();
  const jobName = state.jobName;
  const {job,asset} = useParams();


  const handleRouteChange = () => {
      if (asset) {
        // Check if we have given asset in images store
        let imageIndex = images.findIndex(image => image.name === asset);

        if (imageIndex >= 0) {
          // Update current asset to asset matched
          setTimeout(() => {
            onSelect(images[imageIndex], imageIndex)
          }, 0);
        } else {
          // No asset found in images store, fallback to 1st image.
          history.push(images[0].name)
        }
      }
      else {
        // No asset is given, fallback to 1st image
        history.push(images[0].name)
      }
  }

  useEffect(() => {
    /**
       * Do this once just before component is mounted.
       * 1. Check if annotator has asset in search params
       * 2. Set the annotator selected image to matched image.
       * 3.Otherwise fallback to set first image
       * 4.Set first image of annotator as selected image if no asset name is given.
       *  */
    handleRouteChange();

    // Listen for back button navigation
    history.listen(() => {
       const { location: { pathname } } = history;
      let assetName = pathname.split('/')[3];
      if(assetName) {
        let imageIndex = images.findIndex(image => image.name === assetName);
        if(imageIndex >= 0) {
          onSelect(images[imageIndex], imageIndex)
        }else{
          onSelect(images[0], 0)
        }
      }
    });
  },[])



  return (
    <SidebarBoxContainer
      title={jobName || 'Job Name'}
      subTitle={`(${images.length})`}
      icon={<CollectionsIcon style={{ color: red[700] }} />}
    >
      <div>
        <ul className="dpfSidelist">
          {images.map((img, i) => (
            <Link

              to={`/annotate/${jobName}/${img.name}`}
              className={
                `imageListItem ${i === state.selectedImage ? 'imageSelectItem' : ''}`
              }
              onClick={() => onSelect(img, i)}
              key={i}>
              {/* <img className={classes.img} src={img.src} /> */}
              <ListItemText
                primary={img.name}
              />
            </Link>
          ))}
        </ul>
      </div>
    </SidebarBoxContainer>
  )
}

const mapUsedImageProps = (a) => [a.name, (a.regions || []).length, a.src]

// export default ImageSelectorSidebarBox;
export default memo(ImageSelectorSidebarBox, (prevProps, nextProps) => {

  return isEqual(
    prevProps.images.map(mapUsedImageProps),
    nextProps.images.map(mapUsedImageProps),
  ) && isEqual(
    prevProps.state.selectedImage,
    nextProps.state.selectedImage,
  )
 }

)
