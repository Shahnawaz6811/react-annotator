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
import {Link } from 'react-router-dom';

const useStyles = makeStyles({
  img: { width: 170, height: 40, marginLeft:30, borderRadius: 8 },
})

export const ImageSelectorSidebarBox = ({ images, onSelect,state,useHistory }) => {
  const classes = useStyles()
  // console.log("Selected", images);
  const history = useHistory();
  const jobName = state.jobName;
  // console.log("history: ", history);
  const { location: { pathname } } = history;



  useLayoutEffect(() => {
    // console.log("history: ", history);
    if (pathname) {
      let imageName = pathname.split('/')[2];
      if (imageName) {
        let imageIndex = images.findIndex(image => image.name === imageName);

        if (imageIndex > 0) {
          setTimeout(() => {
            onSelect(images[imageIndex], imageIndex)
          }, 2);
        } else {
          // Invalid image
          history.push(images[0].name)
        }
      }
      else {
        const job = pathname.split('/')[1];
        // console.log('JOb',job)
        if (job) {
          history.push(images[0].name)
        } else {
          history.push(`${jobName}/${images[0].name}`)
        }
      }
    }
  },[])

  useEffect(() => {

    const { location: { pathname } } = history;

    // console.log("History: ", history.location);
    history.listen(() => {
      // console.log("Listeningg",history.location.key);
      // console.log("Listeningg", history.location);
      const { location: { pathname } } = history;
      // console.log("Path: ", pathname);
      if (pathname) {
        let imageName = pathname.split('/')[2];
        if (imageName) {
          // Check if we have image of given name
          let imageIndex = images.findIndex(image => image.name === imageName);
          // console.log('INdex: ', imageIndex);
          if (imageIndex > 0) {
          // console.log("Exis:", imageIndex);
           onSelect(images[imageIndex], imageIndex)
          }

        } else {
          const job = pathname.split('/')[1];
          if (job) {
            history.push(images[0].name)
            onSelect(images[0], 0)
          }else{
          history.push(`${jobName}/${images[0].name}`)

          }
        }
      }

    })
  }, []);


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

              to={`${jobName}/${img.name}`}
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
