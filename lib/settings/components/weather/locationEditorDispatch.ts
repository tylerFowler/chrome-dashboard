import React from 'react';

// this is in a separate file to avoid the circular dependency warning from
// rollup, albeit a harmless warning
export default React.createContext(null);
