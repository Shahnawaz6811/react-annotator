import React from 'react'
import Annotator from '../Annotator/src/Annotator/index'
import {images,labels} from './images'
const AppAnnotator = () => {
    return (
        <div>
            <Annotator images={ images} regionClsList={labels}/>
        </div>
    )
}

export default AppAnnotator
