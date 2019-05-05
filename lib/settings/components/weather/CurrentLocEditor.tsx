import React, { useEffect, useState, useContext } from 'react';
import { Error as ErrorAlert } from 'lib/styled/Alert';
import styled from 'lib/styled-components';
import CoordsEditor from './CoordsEditor';
import LocationEditorDispatch from './locationEditorDispatch';

export interface CurrentLocEditorProps {
  readonly lat: string;
  readonly lon: string;
}

const ErrorContainer = styled.div`
  flex-basis: 100%;
  flex-shrink: 0;

  margin: .25em auto 1em;
`;

const CurrentLocEditor: React.SFC<CurrentLocEditorProps> = ({ lat, lon }) => {
  const dispatch = useContext(LocationEditorDispatch);

  const [ error, setError ] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Your browser does not support detecting your current location'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const fmtCoord = (c: number) => c.toPrecision(7);
        dispatch({
          type: 'updateCoords',
          payload: `${fmtCoord(coords.latitude)},${fmtCoord(coords.longitude)}`,
        });

        dispatch({ type: 'waiting', payload: false });
      }, () => {
        setError(new Error('Unable to detect your current location'));
        dispatch({ type: 'waiting', payload: false });
      },
    );

    dispatch({ type: 'waiting', payload: true });
  }, []);

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
