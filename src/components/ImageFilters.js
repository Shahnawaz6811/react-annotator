import React,{useState} from 'react';
// import './filters.css';
const data = {
  brightness: '1%',
  contrast: '100%',
  invert:'0%'
}
  

const Filters = ({onChange,filters}) => {

  const updateFilterValue = (name,onChange) => {
    switch (name) {
      case 'contrast':
        return (<input type="range" step="1" min="0" max="200" id={name}
        onChange={onChange} defaultValue={filters[name]} />)
      
        case 'brightness': return (<input type="range" step="1" min="0" max="200" id={name} onChange={onChange} defaultValue={filters[name]}  />)
      
        case 'invert': return (<input type="range" step="1" min="0" max="100" id={name} onChange={onChange} defaultValue={filters[name]}  />)
    
        default: return (<input type="range"/>)
        
       } 
   }

     return(
       <div className="contentWrap">
       <div className="sidebar">
         <div className="title">Filters</div>
         {Object.keys(filters).map((name => {     
              
           return(  
            <div className="setting">
               <label className="filterName">
                 <div>{name}</div>
                 <div>{filters[name]}</div>
                 </ label>
               {updateFilterValue(name,onChange)}
            </div>
           )
         }))}
         </div>
       <Image url='https://www.w3schools.com/w3images/sound.jpg' filters={filters} />
       </div>
       )
   }
  

const Image = (props) => {
       var imgStyle = {
        filter: `contrast(${props.filters['contrast']}) brightness(${props.filters["brightness"]}) invert(${props.filters['invert']})`
   ,
        backgroundImage:`url(${props.url})`
       }
      return(
        <div className="imageContainer"><img className="guitar" style={imgStyle}  /> </div>
      )
    }
  
  const ImageEditor  = (props) => {
     const [filterState, setFilterState] = useState(data);
    
    const handleChange = (e) => {
        var value = e.target.value;
      setFilterState(state => {
        return ({...state,[e.target.id]: value + '%'})
      })
      }
      return(
          <div className="settings">         
            <Filters filters={filterState}  onChange={handleChange}/>
            
            </div>
        )
    }
    
    


  ImageEditor.defaultProps = {
    data : data
  }
  
  
  
export default ImageEditor;
//   ReactDOM.render(<ImageEditor/>,document.getElementById("root"));