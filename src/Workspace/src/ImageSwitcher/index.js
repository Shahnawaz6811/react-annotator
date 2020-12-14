import React from 'react'
import FooterButton from "../FooterButton"

const ImageSwitcher = (props) => {
    const { dispatch, state, useHistory } = props;
    const history = useHistory();
    return (
        <div className="imgSwitcher">
        
        <FooterButton

                name="Prev"
                onClick={() => {
                   
                    dispatch({
                        type: "FOOTER_BUTTON_CLICKED",
                        buttonName: "Prev",
                    })
                    const currentImage = state.selectedImage;
                    if (currentImage > 0) {
                        history.push(`${state.images[currentImage - 1].name}`)      
                    }
                }
            }
        />
        {
            <p>{`${state.selectedImage+1}/${state.images.length} `}</p>
        }
         <FooterButton
            name="Next"
                onClick={() => {
                    dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "Next",
                    })
                    const currentImageIndex = state.selectedImage;
                    if (currentImageIndex < state.images.length - 1) {
                        history.push(`${state.images[currentImageIndex + 1].name}`)      

                    }
                }
                    
            } 
        />
        </div>
    )
}

export default ImageSwitcher;
