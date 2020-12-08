import React from 'react'
// import Annotator from '@rediminds/image-video-annotator'
import Annotator from '../Annotator/src/Annotator'; 
import {images,labels} from './images'
const AppAnnotator = () => {
    
    return (
        <div>
            <Annotator images={images}
                regionClsList={labels}
                onSave={(selectedImage) => console.log('selectedImage: ',selectedImage)}
                onSubmit={(state) => console.log('Submit: ',state)} />
        </div>
    )
}

export default AppAnnotator
