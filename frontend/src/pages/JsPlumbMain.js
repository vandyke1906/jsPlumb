import React, { useEffect } from "react";
import { jsPlumb } from "jsplumb";
import JsPlumb from "utils/jsplumb";

//css
import "./jsPlumbMain.scss";

const JsPlumbMain = ({ name }) => {
  useEffect(() => {
    const myplumb = new JsPlumb("diagram");

    let firstInstance = jsPlumb.getInstance();
    firstInstance.getContainer("diagram");
    // firstInstance.bind("ready", () => {
    //connections
    // firstInstance.registerConnectionTypes({
    //   "red-connection": {
    //     paintSyle:
    //   }
    // })

    //draggable controllers
    firstInstance.draggable("control1", { containment: true });
    firstInstance.draggable("control2", { containment: true });
    //first endpoint
    firstInstance.addEndpoint("control1", {
      endpoint: "Dot",
      anchor: "BottomCenter",
      isTarget: true,
      isSource: true,
      // paintStyle: { fill: "gray", outlineStroke: "black", outlineWidth: 1 },
      // hoverPaintStyle: { fill: "red" },
      // connectorPaintStyle: { stroke: "blue", strokeWidth: 10 },
      // connectorHoverPaintStyle: { stroke: "red", outlineStroke: "yellow", outlineWidth: 1 },
      parameters: {
        p1: "parameter 1 in controller 1",
        p2: "parameter 2 in controller 1",
        p3: function () {
          console.log("i am p3");
        },
      },
    });
    //second endpoint
    firstInstance.addEndpoint("control2", {
      endpoint: "Dot",
      anchor: "BottomCenter",
      isTarget: true,
      isSource: true,
      // paintStyle: { fill: "gray", outlineStroke: "black", outlineWidth: 1 },
      // hoverPaintStyle: { fill: "red" },
      // connectorPaintStyle: { stroke: "blue", strokeWidth: 10 },
      // connectorHoverPaintStyle: { stroke: "red", outlineStroke: "yellow", outlineWidth: 1 },
      parameters: {
        p4: "parameter 2 in controller 2",
        p5: function () {
          console.log("i am p3 in controller 2");
        },
      },
    });

    firstInstance.bind("connection", function (params) {
      console.log("params connection", params.connection.getParameters());
    });
    // }); //bind ready
  }, []);
  return (
    <div className='container-fluid'>
      <div id='top-content'>
        <label htmlFor='username'>New Endpoint:</label>
        <input type='text' id='username' name='username' /> <input type='button' value='Add'></input>
        <br />
      </div>
      {/* diagram */}
      <div id='diagram'>
        <div id='control1' className='control'>
          <div className='title'>Control 1</div>
          <div className='drag'>Disable Dragging</div>
          <div className='remove'>Remove Connection</div>
        </div>
        <div id='control2' className='control'>
          <div className='title'>Control 2</div>
          <div className='drag'>Disable Dragging</div>
          <div className='remove'>Remove Connection</div>
        </div>
      </div>
    </div>
  );
};

export default JsPlumbMain;
