import React from 'react'
import Annotator from '../Annotator/src/Annotator/index'
import {images} from './images'
const AppAnnotator = () => {
    return (
        <div>
        
            <Annotator images={ images}/>
        </div>
    )
}

export default AppAnnotator
