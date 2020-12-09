import React from "react" 
import FooterButton from "../FooterButton"
import Button from '@material-ui/core/Button';
import { styled } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';



const Container = styled("div")({
  width: "75%",
  display: "flex",
  backgroundColor: "#fff",
  borderBottom: "1px solid #ccc",
  alignItems: "center",
  justifyContent:'space-around',
  flexShrink: 1,
  margin:'0 auto',
  boxSizing: "border-box",
})

type Props = {|
  leftSideContent?: ?React.Node,
  onClickItem?: Function,
  items: Array<{|
    name: string,
    icon?: ?React.Node,
    onClick?: Function,
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
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
     
      
    <Container>
     
      <FooterButton
          onClick={() => dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "Undo",
          })}
          name="Undo"
          showLabel={true}
          disabled={!activeRegions}
        />

      <FooterButton
          onClick={() => dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "redo",
          })}
          showLabel={true}
          name="Redo"
          disabled={historyCache ? Array.isArray(historyCache) && historyCache.length === 0 : true}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={!activeRegions}
          onClick={() => dispatch({type: "FOOTER_BUTTON_CLICKED",buttonName: "reset" })}
          >
          Reset
      </Button>
        
        <Button variant="contained"
          color="primary"
          disabled={!activeRegions}
          onClick={() => dispatch({type: "FOOTER_BUTTON_CLICKED",buttonName: "save" })}
          >
        Save
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            checked={activeImage.shouldLabel ? true: false}
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
          onClick={() => dispatch({type: "FOOTER_BUTTON_CLICKED",buttonName: "submit" })}
          disabled={!activeRegions} color="primary"
          >
        Submit
      </Button>

      
      </Container>
    </div>
      
  )
}

export default Footer
