'use client';

import React from 'react';

function Callback(
 ) {
 
 console.log('Callback render');
  return (
    <div>
     
    </div>
  );
}


const Callbacks = React.memo(Callback);

export default Callbacks;

