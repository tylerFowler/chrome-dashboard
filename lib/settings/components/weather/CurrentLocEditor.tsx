import React, { useEffect, useContext } from 'react';
import CoordsEditor from './CoordsEditor';
import LocationEditorDispatch from './locationEditorDispatch';

export interface CurrentLocEditorProps {
  readonly lat: string;
  readonly lon: string;
}

const CurrentLocEditor: React.SFC<CurrentLocEditorProps> = ({ lat, lon }) => {
  const dispatch = useContext(LocationEditorDispatch);

  useEffect(() => {
    if (!navigator.geolocation) {
      dispatch({
        type: 'setError',
        payload: new Error('Your browser does not support detecting your current location'),
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        dispatch({
          type: 'updateCoords',
          payload: { lat: coords.latitude, lon: coords.longitude },
        });

        dispatch({ type: 'waiting', payload: false });
        dispatch({ type: 'unsetError' });
      }, () => {
        dispatch({ type: 'waiting', payload: false });
        dispatch({
          type: 'setError',
          payload: new Error('Unable to detect your current location'),
        });
      },
    );

    dispatch({ type: 'waiting', payload: true });

    // ensure that errors are cleared when unmounting, assumption here is that
    // any errors created by other components should also be cleared as it means
    // we're switching location types or exiting the settings altogether
    return () => dispatch({ type: 'unsetError' });
  }, []);

  return <CoordsEditor lat={lat} lon={lon} editable={false} />;
};

export default CurrentLocEditor;
