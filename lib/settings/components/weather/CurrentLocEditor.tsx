import React, { useEffect, useState } from 'react';
import CoordsEditor from './CoordsEditor';

const CurrentLocEditor: React.SFC = () => {
  const [ lat, setLat ] = useState('');
  const [ lon, setLon ] = useState('');
  const [ error, setError ] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Your browser does not support detecting your current location'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude.toPrecision(7));
        setLon(coords.longitude.toPrecision(7));
      },
      () => setError(new Error('Unable to detect your current location')),
    );
  });

  return (<>
      {error && <aside>{error.toString()}</aside>}
      <CoordsEditor lat={lat} lon={lon} editable={false} />
  </>);
};

export default CurrentLocEditor;
