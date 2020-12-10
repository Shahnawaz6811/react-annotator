import React from 'react'
import FooterButton from "../FooterButton"

const ImageSwitcher = (props) => {
    const { dispatch,state } = props;
    return (
        <div className="imgSwitcher">
        
        <FooterButton

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
