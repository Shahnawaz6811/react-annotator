import './App.css';
import Annotator from './components/Annotator';
import { SnackbarProvider, withSnackbar } from 'notistack'
import Message from './components/message';
import React,{useEffect} from 'react'

function AppCore(props) {
  useEffect(() => {
    Message.registerNotistakEnqueueSnackbar(
      props.enqueueSnackbar
    )
  }, []);
  return (
      <Annotator />
  );
}



const App  = (props) => {

    const AppWithSnackbar = withSnackbar(AppCore)

    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
      >
        <AppWithSnackbar {...props} />
      </SnackbarProvider>
    )
}
export default App;



