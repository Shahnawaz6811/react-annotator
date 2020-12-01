import React from "react"
import HeaderButton from "../HeaderButton"
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



export const Header = ({
  leftSideContent = null,
  items,
  onClickItem,
}: Props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{display:'flex'}}>
      <HeaderButton
          key={items[0].name}
          onClick={() => onClickItem(items[0])}
          {...items[0]}
      />
       <HeaderButton
          key={items[1].name}
          onClick={() => onClickItem(items[1])}
          {...items[1]}
      />
      </div>
      
    <Container>
      {/* <Box flexGrow={1}>{leftSideContent}</Box> */}
      {/* {items.map((item) => (
        <HeaderButton
          key={item.name}
          onClick={() => onClickItem(item)}
          {...item}
        />
      ))} */}
      <HeaderButton
          key={items[2].name}
          onClick={() => onClickItem(items[2])}
          {...items[2]}
      />
      <HeaderButton
          key={items[3].name}
          onClick={() => onClickItem(items[3])}
          {...items[3]}
        />
      <Button variant="outlined" color="primary" style={{borderColor:'green',color:'green',marginRight:'20px'}}>
        Reset
      </Button>
      <Button variant="outlined" color="primary" style={{borderColor:'green',color:'green',marginRight:'20px'}}>
        Save
      </Button>
      <FormControlLabel
        control={
          <Checkbox
            checked={true}
            onChange={()=>console.log("Checked")}
            name="checkedB"
            color="primary"
          />
        }
        label="Nothing to label"
      />
      <Button variant="outlined" color="primary" style={{borderColor:'green',color:'green'}}>
        Submit
      </Button>

      
      </Container>
    </div>
      
  )
}

export default Header
