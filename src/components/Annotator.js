import React from 'react'
import Annotator from '@rediminds/image-video-annotator'
// import Annotator from '../Annotator/src/Annotator'; 
import { images, labels } from './images'
import Message from './message';
const AppAnnotator = () => {
    
    return (
        <div>
            <Annotator images={images}
                regionClsList={labels}
                jobName="Dr John De"
                renderError={(error) => {
                    Message.error(error)
                }}
                onSave={(selectedImage, encodedData) => {
                    console.log(encodedData);
                    Message.success('Changes saved successfully.')
                    //                   Message.error('Your user account does not have permission to perform this operation. Please contact your Administrator.')


                }}
                onSubmit={(state) => console.log('Submit: ',state)} />
        </div>
    )
}

export default AppAnnotator
