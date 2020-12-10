import React,{useState} from "react"
import { styled } from "@material-ui/core/styles"
import { iconMapping,getIcon } from "../icon-mapping.js"
import Slider from './Slider';




const Container = styled("div")({
  display: "flex",
  width:"100%",
  justifyContent: 'space-between',
  margin: ' auto',
  paddingBottom: '10PX'
  
})

type Props = {
  items: Array<{|
    name: string,
    helperText: string,
    icon?: ?React.Node,
    onClick: Function,
  |}>,
}




const RenderButton = ({item,onClickItem,activeImage,handleSlide,selectedTools}) => {
  const [showSlider, setShowSlider] = useState(false);
  return (
    <div key={item.name}
       onClick={() => {
          const name = item.name;
          if (name === 'brightness' || name === 'contrast') {
           setShowSlider(show => !show);
          }
         return item.onClick ? item.onClick : onClickItem(item)}
      } 
      className={
      selectedTools.includes(item.name.toLowerCase())
        ? "selectedTool"
        : ""
    }>
      
      {getIcon(item.name,selectedTools.includes(item.name.toLowerCase())
        )}
        
     {showSlider && <Slider id={item.name} activeImage={activeImage} onChange={handleSlide}/> }   
    </div>
    
  )
}

export const Toolbar = ({
  items = [],
  onClickItem,
  selectedTools,
  activeImage,
  width,
  onFilterValueUpdate,
}: Props) => {

  return (
    <Container width={width} className="dpfToolbar">
      {items.map((item) => {
        let NameIcon =
          iconMapping[item.name.toLowerCase()] ||
          iconMapping["help"]

        if (!item.helperText) return <RenderButton
          activeImage={activeImage}
          item={item} NameIcon={NameIcon}
          onClickItem={onClickItem}
          selectedTools={selectedTools} />

        return (
         
          <RenderButton
            key={item.name}
            activeImage={activeImage}
            handleSlide={(e) => onFilterValueUpdate({ name: e.target.ariaLabel, value: e.target.value })}
            item={item}
            onClickItem={onClickItem}
            selectedTools={selectedTools} />
        )
      })}
    </Container>
  )
}

export default Toolbar
