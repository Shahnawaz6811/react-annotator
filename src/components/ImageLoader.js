import React from 'react'
import LoadingOverlay from 'react-loading-overlay';
import PuffLoader from 'react-spinners/PuffLoader';
const ImageLoader = (props) => {
	return (
		<LoadingOverlay
			className="loadingOverlay"
			active={props.loading === false ? false:true}
        	styles={{
				overlay: (base) => ({
					...base,
					background: 'rgba(238, 226, 226, 0.5)',
				}),
			}}
			spinner={<PuffLoader color='red'  />}
		>
		</LoadingOverlay>
	)
}

export default ImageLoader
