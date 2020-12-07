import React,{useState} from "react"
import { styled } from "@material-ui/core/styles"
import IconButton from "@material-ui/core/IconButton"
import { iconMapping } from "../icon-mapping.js"
import { useIconDictionary } from "../icon-dictionary"
import Tooltip from "@material-ui/core/Tooltip"
import Slider from './Slider';
import { mapping } from './icon_mapping'
const Container = styled("div")({
  display: "flex",
  width:'100%',
  justifyContent:'space-around',
})

type Props = {
  items: Array<{|
    name: string,
    helperText: string,
    icon?: ?React.Node,
    onClick: Function,
  |}>,
}


const RenderButton = (props) => {
  const [showSlider, setShowSlider] = useState(false);
  const NameIcon = props.NameIcon;
  return (
    <div>
      <img
        src={mapping[props.item.name]}
      key={props.item.name}
      style={{cursor:'pointer'}}
      // color={
      //   props.item.selected || props.selectedTools.includes(props.item.name.toLowerCase())
      //     ? "primary"
      //     : "default"
      // }
      disabled={Boolean(props.item.disabled)}
        onClick={() => {

          const name = props.item.name;
          if (name === 'brightness' || name === 'contrast') {
           setShowSlider(show => !show);
          }
         return props.item.onClick ? props.item.onClick : props.onClickItem(props.item)}
      } 
    />
      {/* {props.item.icon || <NameIcon />}<br />  */}
      
        
     {showSlider && <Slider id={props.item.name} activeImage={props.activeImage} onChange={props.handleSlide}/> }   
    </div>
      
      
  )
}

export const IconSidebar = ({
  items = [],
  onClickItem,
  selectedTools,
  activeImage,
  onFilterValueUpdate,
}: Props) => {
  const customIconMapping = useIconDictionary()
  return (
    <Container>
      {items.map((item) => {
        let NameIcon =
          customIconMapping[item.name.toLowerCase()] ||
          iconMapping[item.name.toLowerCase()] ||
          iconMapping["help"]
        

        if (!item.helperText) return <RenderButton activeImage={activeImage} item={item}  NameIcon={NameIcon} onClickItem={onClickItem} selectedTools={selectedTools}/>

        return (
          <Tooltip key={item.name}  title={item.helperText} placement="right">
            <RenderButton activeImage={activeImage} handleSlide={(e) =>onFilterValueUpdate({name:e.target.ariaLabel,value:e.target.value})} NameIcon={NameIcon} item={item} onClickItem={onClickItem} selectedTools={selectedTools}/>
          </Tooltip>
        )
      })}
    </Container>
  )
}

export default IconSidebar
