import React from "react";
import * as d3 from "d3";
import { _3d } from "d3-3d";

const TestChart = () => {

  const svg = d3.select("#dataVisualization").append("svg");

  const data3D = [
    [
      [0, -1, 0],
      [-1, 1, 0],
      [1, 1, 0],
    ],
  ];

  const triangles3D = _3d()
    .scale(100)
    .origin([480, 250])
    .shape('TRIANGLE');

  const projectedData = triangles3D(data3D);

  const triangles = svg.selectAll("path").data(projectedData);



  return (
    <div>
      Hello World!
      <div id="dataVisualization"></div>
    </div>
  );
};

export default TestChart;