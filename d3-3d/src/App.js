import React, { useRef, useEffect } from "react";
import * as d3 from "d3"; // Make sure to import d3 library
import { _3d } from "d3-3d";

const App = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const origin = [480, 300];
    const j = 10;
    const scale = 20;
    let scatter = [];
    let yLine = [];
    let xGrid = [];
    let beta = 0;
    let alpha = 0;
    const startAngle = Math.PI / 4;
    let mx, my, mouseX, mouseY;

    const svg = d3
      .select(svgRef.current)
      .call(
        d3.drag().on("drag", dragged).on("start", dragStart).on("end", dragEnd)
      );

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const grid3d = d3
_3d
      .shape("GRID", 20)
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const point3d = d3
      ._3d()
      .x((d) => d.x)
      .y((d) => d.y)
      .z((d) => d.z)
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

    const yScale3d = d3
      ._3d()
      .shape("LINE_STRIP")
      .origin(origin)
      .rotateY(startAngle)
      .rotateX(-startAngle)
      .scale(scale);

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

      d3.selectAll("._3d").sort(d3._3d().sort);
    }

    function posPointX(d) {
      return d.projected.x;
    }

    function posPointY(d) {
      return d.projected.y;
    }

    function init() {
      let cnt = 0;
      xGrid = [];
      scatter = [];
      yLine = [];
      for (let z = -j; z < j; z++) {
        for (let x = -j; x < j; x++) {
          xGrid.push([x, 1, z]);
          scatter.push({
            x: x,
            y: d3.randomUniform(0, -10)(),
            z: z,
            id: "point_" + cnt++,
          });
        }
      }

      d3.range(-1, 11, 1).forEach((d) => {
        yLine.push([-j, -d, -j]);
      });

      const data = [grid3d(xGrid), point3d(scatter), yScale3d([yLine])];
      processData(data, 1000);
    }

    function dragStart() {
      mx = d3.event.x;
      my = d3.event.y;
    }

    function dragged() {
      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = ((d3.event.x - mx + mouseX) * Math.PI) / 230;
      alpha = (((d3.event.y - my + mouseY) * Math.PI) / 230) * -1;
      const data = [
        grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
        point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
        yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([
          yLine,
        ]),
      ];
      processData(data, 0);
    }

    function dragEnd() {
      mouseX = d3.event.x - mx + mouseX;
      mouseY = d3.event.y - my + mouseY;
    }

    d3.selectAll("button").on("click", init);

    init();
  }, []);

  return (
    <div>
      <button>Initialize</button>
      <svg ref={svgRef} width="960" height="600"></svg>
    </div>
  );
};

export default App;
