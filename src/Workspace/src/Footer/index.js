import React from "react" 
import HeaderButton from "../FooterButton"
import Box from "@material-ui/core/Box"
import Button from '@material-ui/core/Button';
import { styled } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  leftSideContent = null,
  items,
  state,
  onClickItem,
  onClickLabel,
  onSubmit,
}: Props) => {

  let currentImageIndex = state.selectedImage;
  let activeImage = state.images[currentImageIndex];
  let activeRegions = activeImage.regions.length > 0;
  let historyCache = state.historyCache[activeImage.name];
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        
      <HeaderButton
          key={items[0].name}
          showLabel={false}
          onClick={() => onClickItem(items[0])}
          {...items[0]}
      />
      {
        <p>{`${currentImageIndex+1}/${state.images.length} `}</p>
      }
       <HeaderButton
          key={items[1].name}
          showLabel={false}
          onClick={() => onClickItem(items[1])}
          {...items[1]}
      />
      </div>
      
    <Container>
     
      <HeaderButton
          key={items[2].name}
          onClick={() => onClickItem(items[2])}
          {...items[2]}
          showLabel={true}
          disabled={!activeRegions}
        />
        {/* redo */}
      <HeaderButton
          key={items[3].name}
          onClick={() => onClickItem(items[3])}
          {...items[3]}
          showLabel={true}
          disabled={historyCache ? Array.isArray(historyCache) && historyCache.length === 0 : true}
        />
      <Button variant="outlined" color="primary" disabled={!activeRegions}   onClick={() => onClickItem({name:'Reset'})}
 style={
         activeRegions ? { borderColor: 'green', color: 'green',marginRight:'20px' }: { borderColor: 'gray', color: 'gray',marginRight:'20px' }}>
        Reset
      </Button>
      <Button variant="outlined"  color="primary"  disabled={!activeRegions} style={
         activeRegions ? { borderColor: 'green', color: 'green',marginRight:'20px' }: { borderColor: 'gray', color: 'gray',marginRight:'20px' }}>
        Save
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            checked={activeImage.label}
            onChange={onClickLabel}
            name="checkedB"
            color="primary"
          />
        }
        label="Nothing to label"
      />
        <Button variant="outlined" onClick={onSubmit} disabled={!activeRegions} color="primary" style={
         activeRegions ? { borderColor: 'green', color: 'green' }: { borderColor: 'gray', color: 'gray' }}>
        Submit
      </Button>

      
      </Container>
    </div>
      
  )
}

export default Footer
