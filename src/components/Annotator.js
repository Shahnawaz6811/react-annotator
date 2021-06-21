import React from 'react'
import Annotator from '../annotator';
import { images, labels } from './images'
import { Route, useHistory, useParams } from 'react-router-dom';
import ImageLoader from './ImageLoader';
const AppAnnotator = (props) => {
    const history = useHistory();
    const params = useParams();

   let imageIndex = images.findIndex(image => image.name === params.asset);

    return (
        <div>
            <Annotator
                images={images}
                loader={ImageLoader}
                regionClsList={labels}
                jobName="Dr-John-De"
                renderError={(error) => {}}
                selectedImage={imageIndex >=0 ? imageIndex : 0}
                useHistory={()=> history}
                onSave={(selectedImage, encodedData) => {}}
                onSubmit={(state) => {}}
            />
        </div>
    )
}

export default AppAnnotator
