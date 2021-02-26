import React, { useState } from 'react';
import GraphChart from './GraphChart';
import ChartHeader from './ChartHeader';

var props = {
  "data": {
    "cf6d5f56-a3e0-4a70-0d04-d2cabf49fbec-Report": {
      "name": "Magnet strength [µT]",
      "id": "a9549c65-8ccf-4fdf-3fe6-dfebd26af0c0",
      "type": "Report",
      "valueId": "cf6d5f56-a3e0-4a70-0d04-d2cabf49fbec",
      "isNumber": true,
      "isBoolean": false,
      "data": [
        {
          "time": "2021-02-25T08:18:00Z",
          "avg": 13.8973333333333,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:19:00Z",
          "avg": 13.8472530120482,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:20:00Z",
          "avg": 13.674243902439,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:21:00Z",
          "avg": 13.6715,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:22:00Z",
          "avg": 13.7396818181818,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:23:00Z",
          "avg": 13.7889450549451,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:24:00Z",
          "avg": 13.6570769230769,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:25:00Z",
          "avg": 13.6167586206897,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:26:00Z",
          "avg": 13.5987058823529,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:27:00Z",
          "avg": 13.6911428571429,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:28:00Z",
          "avg": 13.7154814814815,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:29:00Z",
          "avg": 13.8056666666667,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:30:00Z",
          "avg": 13.8111084337349,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:31:00Z",
          "avg": 13.785875,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:32:00Z",
          "avg": 13.7169411764706,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:33:00Z",
          "avg": 13.5623333333333,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:34:00Z",
          "avg": 13.3002921348315,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:35:00Z",
          "avg": 13.3834318181818,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:36:00Z",
          "avg": 13.4015824175824,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:37:00Z",
          "avg": 13.3145882352941,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:38:00Z",
          "avg": 13.3975294117647,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:39:00Z",
          "avg": 13.3430361445783,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:40:00Z",
          "avg": 13.1856666666667,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:41:00Z",
          "avg": 13.2236551724138,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:42:00Z",
          "avg": 13.2271034482759,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:43:00Z",
          "avg": 13.1311590909091,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:44:00Z",
          "avg": 13.2886511627907,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:45:00Z",
          "avg": 13.2633103448276,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:46:00Z",
          "avg": 13.2514157303371,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:47:00Z",
          "avg": 13.2037802197802,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:48:00Z",
          "avg": 13.2664175824176,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:49:00Z",
          "avg": 14.2587058823529,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:50:00Z",
          "avg": 14.1379325842697,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:51:00Z",
          "avg": 14.1112727272727,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:52:00Z",
          "avg": 14.1891724137931,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:53:00Z",
          "avg": 14.1653253012048,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:54:00Z",
          "avg": 14.1492173913043,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:55:00Z",
          "avg": 14.0411428571429,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:56:00Z",
          "avg": 14.0281860465116,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:57:00Z",
          "avg": 14.0098241758242,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:58:00Z",
          "avg": 14.015976744186,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T08:59:00Z",
          "avg": 14.1572558139535,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:00:00Z",
          "avg": 13.984,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:01:00Z",
          "avg": 14.064,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:02:00Z",
          "avg": 14.0408965517241,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:03:00Z",
          "avg": 13.8615280898876,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:04:00Z",
          "avg": 14.3955384615385,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:05:00Z",
          "avg": 14.8008604651163,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:06:00Z",
          "avg": 14.7433406593407,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:07:00Z",
          "avg": 14.875935483871,
          "name": "Magnet x [µT]",
          "isPoint": false
        },
        {
          "time": "2021-02-25T09:08:00Z",
          "avg": 14.8194166666667,
          "name": "Magnet x [µT]",
          "isPoint": false
        }
      ],
      "status": "success"
    }
  },
  "options": {
    "end": "2021-02-25T15:13:58.000Z",
    "start": "2021-02-25T00:13:58.000Z",
    "selectedTime": "hour",
    "selectedTimeCount": 15,
    "group_by": "minute",
    "operation": "avg"
  }
}

const LogScreen = React.memo(() => {
  const [ options, setOptions ] = useState();
  return (
    <ChartHeader options={options} setOptions={setOptions}>
      <GraphChart {...props}/>
    </ChartHeader>
  )
});

export default LogScreen;
