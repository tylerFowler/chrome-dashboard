import { useState, useEffect } from 'react';

export interface LocationDetails {
  refreshing: boolean;
  coordinates: Coordinates;
  error?: Error|PositionError;
}

// useCurrentPosition uses the browser's navigation API to attempt to locate the
// user's current position, returning any resulting errors and providing intermediate
// loading state.
export default function useCurrentPosition(): LocationDetails {
  const [ refreshing, setRefreshing ] = useState(false);
  const [ coordinates, setCoordinates ] = useState<Coordinates>(null);
  const [ error, setError ] = useState<Error|PositionError>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Your browser does not support detecting your current location'));
      return;
    }

    setRefreshing(true);
    navigator.geolocation.getCurrentPosition(result => {
      setRefreshing(false);
      setCoordinates(result.coords);
    }, positionError => {
      setRefreshing(false);
      setError(positionError);
    });
  });

  return { refreshing, coordinates, error };
}
