import React from 'react'
import Annotator from '@rediminds/image-video-annotator'
// import Annotator from '../Annotator/src/Annotator'; 
import { images, labels } from './images'

const AppAnnotator = () => {
    
    return (
        <div>
            <Annotator images={images}
                regionClsList={labels}
                jobName="Dr John De"
                renderError={(error) => {
                    // Message.error(error)
                }}
                onSave={(selectedImage, encodedData) => {
                    console.log(encodedData);
                    alert('Changes saved successfully.')

                }}
                onSubmit={(state) => console.log('Submit: ',state)} />
        </div>
    )
}

export default AppAnnotator
