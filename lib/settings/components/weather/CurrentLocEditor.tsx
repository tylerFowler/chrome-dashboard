import React, { useEffect, useState } from 'react';
import { Error as ErrorAlert } from 'lib/styled/Alert';
import styled from 'lib/styled-components';
import CoordsEditor from './CoordsEditor';

const ErrorContainer = styled.div`
  flex-basis: 100%;
  flex-shrink: 0;

  margin: .25em auto 1em;
`;

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
      {error &&
        <ErrorContainer>
          <ErrorAlert>{error.toString()}</ErrorAlert>
        </ErrorContainer>
      }

      <CoordsEditor lat={lat} lon={lon} editable={false} />
  </>);
};

export default CurrentLocEditor;
