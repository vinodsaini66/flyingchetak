import React, { useEffect, useState } from 'react';
// @ts-ignore
import {CanvasJSChart} from 'canvasjs-react-charts';
import { click } from '@testing-library/user-event/dist/click';

// const CanvasJSChart:any = CanvasJS.CanvasJSChart;

export const Graph = ({x}:any) => {
  const [dps, setDps] = useState<any[]>([{x:0,y:0}]);

  const options = {
    backgroundColor: "#16142a",
    title: {
      text: `${x? x.toFixed(2):0}x`,
      dockInsidePlotArea: true,
      verticalAlign: "center",
      fontSize: 100,
    },
    theme: "dark1",
    axisX: {
      gridThickness: 0,
      tickLength: 0,
      labelFontSize: 20,
      labelFormatter: function (e: any) {
        return ".";
      },
    },
    axisY: {
      gridThickness: 0,
      tickLength: 0,
      margin: 10,
      lineThickness: 1,
      labelFontSize: 20,
      labelFormatter: function (e: any) {
        return ".";
      },
    },
    data: [
      {
        background: "red",
        markerSize: 0,
        fillOpacity: 0.3,
        lineThickness: 4,
        type: "area",
        markerImageUrl: "../../img/horse-running.gif",
        dataPoints: dps,
      },
    ],
  };

  const positionMarkerImage = (imageMarker: any, index: number) => {
    const pixelX = chartRef.current?.axisX[0].convertValueToPixel(options?.data[0]?.dataPoints[index]?.x) || 0;
    const pixelY = chartRef.current?.axisY[0].convertValueToPixel(options?.data[0]?.dataPoints[index]?.y) || 0;
    console.log("pixels===>>>",pixelX,pixelY)
    imageMarker.style.position = 'absolute';
    imageMarker.style.display = 'block';
    imageMarker.style.width = "20vw" 
    // imageMarker.style.marginTop = "17%" 
    // imageMarker.style.marginLeft = "20%"
    // imageMarker.style.height = "50vh" 
    imageMarker.style.top = `${(pixelY)}px`;
    imageMarker.style.left = `${(pixelX)}px`;

  };

  useEffect(() => {
    let xVal = Math.abs(x)
    const yVal = xVal*2;
    setDps((prevDps) => [...prevDps, { x: xVal, y: yVal }]);
  }, [x]);

  const chartRef: any = React.useRef(null);

  return (
    <>
    {!x ? <CanvasJSChart options={options}  style={{width:"100%",height:"2000px !important"}} />:
    <div>
      <CanvasJSChart  style={{position:"absolute"}}  id="chartContainer" options={options} onRef={(ref:any) => (chartRef.current = ref)} />
      <img
        ref={(img) => img && positionMarkerImage(img, options.data[0]?.dataPoints?.length - 1)}
        src={options?.data[0]?.markerImageUrl}
        // style={{ display: 'none', top: dps[dps.length-1].y + 'px', width:"100px", height:"100px",position:"relative",
        // left: dps[dps.length-1].x + 'px'}}
      />
    </div>}
    </>
  );
};

