import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { _3d } from "d3-3d";

const TestChart = () => {
  const svgRef = useRef(null);
  const scatter = useRef([]);
  const xGrid = useRef([]);
  const yLine = useRef([]);
  const lines = useRef([]);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const alpha = useRef(0);
  const beta = useRef(0);

  var origin = [480, 300],
    j = 10,
    scale = 20,
    key = (d) => {
      return d.id;
    },
    startAngle = Math.PI / 4;

  var mx, my;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const grid3d = _3d()
    .shape("GRID", 20)
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const point3d = _3d()
    .x((d) => d.x)
    .y((d) => d.y)
    .z((d) => d.z)
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const yScale3d = _3d()
    .shape("LINE_STRIP")
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const lines3d = _3d()
    .shape("LINE_STRIP")
    .origin(origin)
    .rotateY(startAngle)
    .rotateX(-startAngle)
    .scale(scale);

  const posPointX = (d) => {
    return d.projected.x;
  };

  const posPointY = (d) => {
    return d.projected.y;
  };

  const dragStart = (event) => {
    mx = event.x;
    my = event.y;
  };

  const dragEnd = (event) => {
    mouseX.current = event.x - mx + mouseX.current;
    mouseY.current = event.y - my + mouseY.current;
  };

  useEffect(() => {
    const dragged = (event) => {
      mouseX.current = mouseX.current || 0;
      mouseY.current = mouseY.current || 0;
      beta.current = ((event.x - mx + mouseX.current) * Math.PI) / 230;
      alpha.current = (((event.y - my + mouseY.current) * Math.PI) / 230) * -1;
      const data = [
        grid3d
          .rotateY(beta.current + startAngle)
          .rotateX(alpha.current - startAngle)(xGrid.current),
        point3d
          .rotateY(beta.current + startAngle)
          .rotateX(alpha.current - startAngle)(scatter.current),
        yScale3d
          .rotateY(beta.current + startAngle)
          .rotateX(alpha.current - startAngle)([yLine.current]),
        lines3d
          .rotateY(beta.current + startAngle)
          .rotateX(alpha.current - startAngle)([lines.current]),
      ];

     processData(data, 0);
    };

    const svg = d3
      .select(svgRef.current)
      .call(
        d3.drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      );

    function processData(data, tt) {
      /* ----------- GRID ----------- */
      const xGridSelection = svg.selectAll("path.grid").data(data[0], key);

      xGridSelection
        .enter()
        .append("path")
        .attr("class", "_3d grid")
        .merge(xGridSelection)
        .attr("stroke", "black")
        .attr("stroke-width", 0.3)
        .attr("fill", (d) => (d.ccw ? "lightgrey" : "#717171"))
        .attr("fill-opacity", 0.9)
        .attr("d", grid3d.draw);

      xGridSelection.exit().remove();

      /* ----------- POINTS ----------- */
      const pointsSelection = svg.selectAll("circle").data(data[1], key);

      pointsSelection
        .enter()
        .append("circle")
        .attr("class", "_3d")
        .attr("opacity", 0)
        .attr("cx", posPointX)
        .attr("cy", posPointY)
        .merge(pointsSelection)
        .transition()
        .duration(tt)
        .attr("r", 3)
        .attr("stroke", (d) => d3.color(color(d.id)).darker(3))
        .attr("fill", (d) => color(d.id))
        .attr("opacity", 1)
        .attr("cx", posPointX)
        .attr("cy", posPointY);

      pointsSelection.exit().remove();

      /* ----------- y-Scale ----------- */
      const yScaleSelection = svg.selectAll("path.yScale").data(data[2]);

      yScaleSelection
        .enter()
        .append("path")
        .attr("class", "_3d yScale")
        .merge(yScaleSelection)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("d", yScale3d.draw);

      yScaleSelection.exit().remove();

      /* ----------- y-Scale Text ----------- */
      const yTextSelection = svg.selectAll("text.yText").data(data[2][0]);

      yTextSelection
        .enter()
        .append("text")
        .attr("class", "_3d yText")
        .attr("dx", ".3em")
        .merge(yTextSelection)
        .each((d) => {
          d.centroid = { x: d.rotated.x, y: d.rotated.y, z: d.rotated.z };
        })
        .attr("x", (d) => d.projected.x)
        .attr("y", (d) => d.projected.y)
        .text((d) => (d[1] <= 0 ? d[1] : ""));

      yTextSelection.exit().remove();

      /* ----------- LINES ----------- */
      const linesSelection = svg.selectAll("path.line").data(data[3]);

      linesSelection
        .enter()
        .append("path")
        .attr("class", "_3d line")
        .merge(linesSelection)
        .attr("stroke", "black")
        .attr("fill-opacity", 0)
        .attr("d", lines3d.draw);

      linesSelection.exit().remove();

      d3.selectAll("._3d").sort(_3d().sort);
    }

    const init = () => {
      let cnt = 0;
      xGrid.current = [];
      scatter.current = [];
      yLine.current = [];
      lines.current = [];

      for (let z = -j; z < j; z++) {
        for (let x = -j; x < j; x++) {
          let y = d3.randomUniform(0, -10)();
          console.log(y);
          xGrid.current.push([x, 1, z]);
          scatter.current.push({
            x: x,
            y: y,
            z: z,
            id: "point_" + cnt++,
          });
          lines.current.push([x, y, z]);
        }
      }

      d3.range(-1, 11, 1).forEach((d) => {
        yLine.current.push([-j, -d, -j]);
      });


      const data = [
        grid3d(xGrid.current),
        point3d(scatter.current),
        yScale3d([yLine.current]),
        lines3d([lines.current]),
      ];

      processData(data, 1000);
    };

    d3.selectAll("button").on("click", init);

    init();
  });

  return (
    <div>
      <button>Initialize</button>
      <svg ref={svgRef} width="960" height="600"></svg>
    </div>
  );
};

export default TestChart;