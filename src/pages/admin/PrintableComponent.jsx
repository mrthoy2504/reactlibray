// PrintableComponent.js
import React, { forwardRef } from 'react';

const PrintableComponent = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <h1>Printable Content</h1>
      <p>This is the content that will be printed.</p>
    </div>
  );
});

export default PrintableComponent;
