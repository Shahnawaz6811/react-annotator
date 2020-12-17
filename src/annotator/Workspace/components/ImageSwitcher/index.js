import React from 'react'
import {FooterButton} from "../Footer"

const ImageSwitcher = (props) => {
    const { dispatch, state, useHistory } = props;
    const currentImageIndex = state.selectedImage;

    const history = useHistory();
    return (
        <div className="imgSwitcher">

        <FooterButton

                name="Prev"
                disabled={currentImageIndex === 0}
                onClick={() => {

                    dispatch({
                        type: "FOOTER_BUTTON_CLICKED",
                        buttonName: "Prev",
                    })
                    if (currentImageIndex > 0) {
                        history.push(`${state.images[currentImageIndex - 1].name}`)
                    }
                }
            }
        />
        {
            <p>{`${state.selectedImage+1}/${state.images.length} `}</p>
        }
         <FooterButton
                name="Next"
                disabled={currentImageIndex === state.images.length - 1}
                onClick={() => {
                    dispatch({
                type: "FOOTER_BUTTON_CLICKED",
                buttonName: "Next",
                    })
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
