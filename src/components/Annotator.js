import React from 'react'
// import Annotator from '@rediminds/image-video-annotator'
import Annotator from '../Annotator/src/Annotator'; 
import { images, labels } from './images'
import { Route, useHistory, useParams } from 'react-router-dom';

const AppAnnotator = (props) => {
    const history = useHistory();

    return (
        <div>
            <Annotator images={images}
                regionClsList={labels}
                jobName="Dr-John-De"
                renderError={(error) => {}}
                useHistory={()=> history}
                onSave={(selectedImage, encodedData) => {}}
                onSubmit={(state) => {}} 
            />
        </div>
    )
}

export default AppAnnotator