import React from 'react'
// import Annotator from '@rediminds/image-video-annotator'
import Annotator from '../Annotator/src/Annotator'; 
import { images, labels } from './images'
import { useHistory } from 'react-router-dom';
const AppAnnotator = (props) => {
    const history = useHistory();
    return (
        <Annotator
            images={images}
                regionClsList={labels}
                jobName="Dr-John-De"            
                renderError={(error) => {
                    // Message.error(error)
                }}

                useHistory={()=> history}
                onSave={(selectedImage, encodedData) => {
                    // console.log('Encoded data', encodedData);
                    // alert('Changes saved successfully.')

                }}
                onSubmit={(state) => {
                    
                }} />
            
    )
}

export default AppAnnotator
