import React from 'react';
import { getImagePath } from '../../../../util/helpers';

const Assembly = React.memo(() => {
  return (
    <figure className="guide-figure">
      <img alt="CO2 assembly" src={getImagePath('co2-assembly.jpg')} />
      <figcaption>Connect the <b>Grove CO Sensor</b> to <b>SLX Grove Shield I2C 2</b>, as shown on the image.</figcaption>
    </figure>
  )
});

export default Assembly;
