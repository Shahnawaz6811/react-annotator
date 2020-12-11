import React from 'react'
// import Annotator from '@rediminds/image-video-annotator'
import Annotator from '../Annotator/src/Annotator'; 
import { images, labels } from './images'
import { Route,useHistory,useParams } from 'react-router-dom';
const AppAnnotator = (props) => {
    const history = useHistory();
    const params = useParams();
    // console.log("Props:", params);

    return (
        // <Route path={`/:job/:asset/`} exact >

        <div>
            <Annotator images={images}
                regionClsList={labels}
                jobName="Dr-John-De"
                renderError={(error) => {
                    // Message.error(error)
                }}
                history={history}
                onSave={(selectedImage, encodedData) => {
                    // console.log('Encoded data', encodedData);
                    // alert('Changes saved successfully.')

                }}
                onSubmit={(state) => console.log('Submit: ',state)} />
            </div>
        // </Route>
            
    )
}

export default AppAnnotator
