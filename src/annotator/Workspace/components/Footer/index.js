import React from "react"
import Button from '@material-ui/core/Button';
import { styled } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getIcon } from "../../icon-mapping.js"



export const FooterButton = ({ name, disabled, onClick }) => {

  return (
    <div onClick={onClick} className="imgNavigation">
      {getIcon(name, disabled)}
    </div>
  )
}


const Container = styled("div")({
  width: "93%",
  display: "flex",
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: 'space-between',
  flexShrink: 1,
  margin: '0 auto',
  boxSizing: "border-box",
})

type Props = {|
  leftSideContent?: ?React.Node,
    onClickItem ?: Function,
    items: Array < {|
      name: string,
        icon ?: ? React.Node,
        onClick ?: Function,
  |}>,
|}



export const Footer = ({
  items,
  state,
  dispatch,
}: Props) => {

  let currentImageIndex = state.selectedImage;
  let activeImage = state.images[currentImageIndex];
  let activeRegions = activeImage.regions.length > 0;
  let historyCache = state.historyCache[activeImage.name];
  const ifJobHasInValidAsset = state.images.filter(image =>
    image.nothingToLabel !== true && image.regions.length === 0).length === 0;
  let shouldEnableSubmitBtn = currentImageIndex === state.images.length - 1 && ifJobHasInValidAsset;


  return (
    <div className="canvasNavigation" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>


      <Container>

        <FooterButton
          onClick={() => {
            if (!activeRegions) {
              return
            }
            dispatch({
              type: "FOOTER_BUTTON_CLICKED",
              buttonName: "Undo",
            })
          }

          }
          name="Undo"
          disabled={!activeRegions}
        />

        <FooterButton
          onClick={() => {
            const disabled = historyCache ? Array.isArray(historyCache) && historyCache.length === 0 : true;
            if (disabled) {
              return
            }
            dispatch({
              type: "FOOTER_BUTTON_CLICKED",
              buttonName: "redo",
            })
          }
          }
          name="Redo"
          disabled={historyCache ? Array.isArray(historyCache) && historyCache.length === 0 : true}
        />

        <Button
          variant="contained"
          color="primary"
          className={activeRegions ? "dpfBtn" : 'dpfBtn dpfBtnDisabled'}
          disabled={!activeRegions}
          onClick={() => dispatch({ type: "FOOTER_BUTTON_CLICKED", buttonName: "reset" })}
        >
          Reset
      </Button>

        <Button variant="contained"
          color="primary"
          className={!!activeImage.nothingToLabel ? "dpfBtn" : !activeRegions ? 'dpfBtn dpfBtnDisabled' : 'dpfBtn'}
          disabled={!!activeImage.nothingToLabel ? false : !activeRegions}
          onClick={() => dispatch({ type: "FOOTER_BUTTON_CLICKED", buttonName: "save" })}
        >
          Save
      </Button>
        <FormControlLabel
          control={
            <Checkbox
              className="dpfDrawLabel"

              checked={activeImage.nothingToLabel ? true : false}
              onChange={() => dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "nolabel",
              })}
              name="checkedB"
              color="primary"
            />
          }
          label="Nothing to label"
        />
        <Button variant="contained"
          // className="dpfSubmitbtn"
          className={shouldEnableSubmitBtn ? "dpfBtn" : 'dpfBtnDisabled'}
          onClick={() => dispatch({ type: "FOOTER_BUTTON_CLICKED", buttonName: "submit" })}
          disabled={!shouldEnableSubmitBtn}
          color="primary"
        >
          Submit
      </Button>


      </Container>
    </div>

  )
}

export default Footer
