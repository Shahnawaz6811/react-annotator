import React from 'react'
import Annotator from '../Annotator/src/Annotator/index'
import {images,labels} from './images'
const AppAnnotator = () => {
    return (
        <div>
            <Annotator images={images} regionClsList={labels} onSubmit={ () => console.log('Submit: ')}/>
        </div>
    )
}

export default AppAnnotator
