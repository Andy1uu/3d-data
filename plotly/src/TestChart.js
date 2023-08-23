import React, {useState} from "react";
import Plot from "react-plotly.js";

const TestChart = () => {

  const [currPoints, setCurrPoints] = useState(0);

  const xData = [
    0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1,
  ];
  const yData = [
    1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, -1, 0,
  ];
  const zData = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const getSubArray = () => {

    console.log(currPoints);

    const xDataSubArray = [
      xData[currPoints - 1],
      xData[currPoints],
      xData[currPoints + 1],
    ];

    console.log(xDataSubArray);

    const yDataSubArray = [
      yData[currPoints - 1],
      yData[currPoints],
      yData[currPoints + 1],
    ];

    const zDataSubArray = [
      zData[currPoints - 1],
      zData[currPoints],
      zData[currPoints + 1],
    ];
    
    return {
      x: xDataSubArray,
      y: yDataSubArray,
      z: zDataSubArray,
      type: "scatter3d",
      mode: "markers",
      marker: { color: "blue" },
    };
  };

  return (
    <div>
      <div>
        <input
          type="range"
          id="volume"
          name="volume"
          min="1"
          max="19"
          onChange={e => setCurrPoints(Number(e.target.value))}
        />
        <label for="volume">Points: {currPoints}</label>
      </div>
      <Plot
        data={[
          {
            x: xData,
            y: yData,
            z: zData,
            type: "scatter3d",
            mode: "lines",
            marker: { color: "red" },
          },
          getSubArray(),
        ]}
        layout={{ width: 1000, height: 500, title: "A Fancy Plot" }}
      />
    </div>
  );
};

export default TestChart;
