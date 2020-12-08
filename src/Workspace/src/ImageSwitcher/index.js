import React from 'react'
import FooterButton from "../FooterButton"

const ImageSwitcher = (props) => {
    const { dispatch,state } = props;
    return (
        <div style={{ display: 'flex', alignItems: 'center',justifyContent:'center' }}>
        
        <FooterButton
                key={1}
                name="Prev"
            onClick={() => dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "Prev",
              })}
        />
        {
            <p>{`${state.selectedImage+1}/${state.images.length} `}</p>
        }
         <FooterButton
            key={2}
            name="Next"
            onClick={() => dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "Next",
              })}
        />
        </div>
    )
}

export default ImageSwitcher;
