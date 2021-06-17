import React, { useState, useEffect } from "react";
import { jsPlumb } from "jsplumb";
// import JsPlumb from "utils/jsplumb";

//css
import "./jsPlumbMain.scss";

const JsPlumbMain = () => {
  const [draggableElements, setDraggableElements] = useState([]);
  const [currentJsPlumbInstance, setCurrentJsPlumbInstance] = useState(undefined);
  const [endPoints, setEndPoints] = useState([]);
  const [currentEndPoint, setCurrentEndPoint] = useState({});
  const [parentContainer, setParentContainer] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // .repaintEverything();

  // useEffect(() => {
  //   let instance = jsPlumb.getInstance();
  //   setFirstInstance(instance);
  //   firstInstance.getContainer("diagram");

  //   //draggable controllers
  //   firstInstance.draggable(["control1", "control2"], { containment: true });
  //   // firstInstance.draggable("control2", { containment: true });

  //   //first endpoint
  //   firstInstance.addEndpoint("control1", {
  //     endpoint: "Dot",
  //     anchor: "BottomCenter",
  //     isTarget: true,
  //     isSource: true,
  //     parameters: {
  //       p1: "parameter 1 in controller 1",
  //       p2: "parameter 2 in controller 1",
  //       p3: function () {
  //         console.log("i am p3");
  //       },
  //     },
  //   });
  //   //second endpoint
  //   firstInstance.addEndpoint("control2", {
  //     endpoint: "Dot",
  //     anchor: "BottomCenter",
  //     isTarget: true,
  //     isSource: true,
  //     parameters: {
  //       p4: "parameter 2 in controller 2",
  //       p5: function () {
  //         console.log("i am p3 in controller 2");
  //       },
  //     },
  //   });

  //   firstInstance.bind("connection", function (params) {
  //     console.log("params connection", params.connection.getParameters());
  //   });
  //   // }); //bind ready
  // }, []);

  useEffect(() => {
    const containerId = document.getElementById("diagram");
    // jsPlumb.setContainer(containerId);
    setParentContainer(containerId);
    const instance = jsPlumb.getInstance({ Container: "diagram" });
    setCurrentJsPlumbInstance(instance);
  }, []);

  useEffect(() => {
    if (currentJsPlumbInstance) {
      currentJsPlumbInstance.bind("connection", function (params) {
        console.log("params connection", params);
      });

      currentJsPlumbInstance.bind("click", function (component, event) {
        if (component.hasClass("jtk-connector")) {
          console.log(component);
        }
      });
    }
  }, [currentJsPlumbInstance]);

  useEffect(() => {
    if (Object.entries(currentEndPoint).length === 0) return;
    const { elementId, controlName } = currentEndPoint;
    const divControl = createElement("div", null, elementId, "control");

    divControl.onmouseover = () => setCurrentEP(elementId); //set current ep
    divControl.onmouseout = () => setCurrentEP(null); //set current ep

    const divTitle = createElement("div", controlName, null, "title");

    const divDragContent = `Toggle Draggable`;
    const divDrag = createElement("button", divDragContent, null, "drag");
    divDrag.onclick = () => currentJsPlumbInstance.toggleDraggable(elementId);

    const divRemoveConnection = createElement("button", "Remove Connection", null, "remove");
    divRemoveConnection.onclick = () => {
      console.log(currentJsPlumbInstance.getAllConnections());
      const allConnections = currentJsPlumbInstance.getAllConnections();
      const currentConnections = allConnections.filter((c) => c.source.id === elementId || c.target.id === elementId);
      for (let conn of currentConnections) {
        currentJsPlumbInstance.deleteConnection(conn);
      }
    };

    const divDeleteControl = createElement("button", "Delete Control", null, "delete");
    divDeleteControl.onclick = () => {
      const currentElement = document.getElementById(elementId);
      currentElement.remove();
      currentJsPlumbInstance.removeAllEndpoints(elementId);
    };

    divControl.appendChild(divTitle);
    divControl.appendChild(divDrag);
    divControl.appendChild(divRemoveConnection);
    divControl.appendChild(divDeleteControl);

    parentContainer.appendChild(divControl);

    /* for js plumb */
    addJsPlumbEndPoint(currentJsPlumbInstance, elementId);
    currentJsPlumbInstance.draggable(draggableElements, { containment: true });
    /* for js plumb */
  }, [endPoints]);

  // useEffect(() => {
  //   currentJsPlumbInstance?.draggable(draggableElements, { containment: true });
  //   console.log("draggableElements", draggableElements);
  // }, [draggableElements]);

  const isDraggable = (elementId) => {
    return draggableElements.includes(elementId);
  };

  const setCurrentEP = (elementId) => {
    let currentEP = null;
    if (elementId) currentEP = endPoints.find((ep) => ep.elementId === elementId);
    setCurrentEndPoint(currentEP);
    console.log("set current ep", currentEP);
  };

  const addJsPlumbEndPoint = (jsPlumbInstance, elementId) => {
    jsPlumbInstance.addEndpoint(elementId, {
      endpoint: "Dot",
      anchor: "BottomCenter",
      isTarget: true,
      isSource: true,
      maxConnections: 2,
      onMaxConnections: function (params, originalEvent) {
        // params contains:
        // {
        //    endpoint:..
        //    connection:...
        //    maxConnections:N
        // }
        //
        console.log("error connection", params.maxConnections);
      },
      parameters: {
        p1: "parameter 1 in controller 1",
        p2: "parameter 2 in controller 1",
        p3: function () {
          console.log("i am p3");
        },
      },
    });
  };

  const addNewEndPoint = () => {
    const id = new Date().getTime().toString();

    const endPoint = {
      controlName: inputValue,
      elementId: id,
    };

    setEndPoints((oldEndPoints) => [...oldEndPoints, endPoint]);
    setCurrentEndPoint(endPoint);
    setDraggableElements((oldIds) => [...oldIds, id]);
    //clear input
    setInputValue("");
  };

  const resetAll = () => {
    currentJsPlumbInstance.reset();
    const diagramElement = document.getElementById("diagram");
    diagramElement.innerHTML = "";
  };

  const createElement = (type, content, id, classText) => {
    let div = document.createElement(type);
    if (id) div.id = id;
    if (classText) div.className = classText;
    if (content) div.innerHTML = content;
    return div;
  };

  return (
    <div className='container-fluid'>
      <div id='top-content'>
        <label htmlFor='username'>New Endpoint:</label>{" "}
        <input
          type='text'
          id='username'
          name='username'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />{" "}
        <input type='button' value='Add' onClick={addNewEndPoint} />{" "}
        <input type='button' value='Reset' onClick={resetAll} />
        <br />
      </div>
      {/* diagram */}
      <div id='diagram'>
        {/* <div id='control1' className='control'>
          <div className='title'>Control 1</div>
          <div className='drag'>Test Dragging</div>
          <div className='remove'>Remove Connection</div>
        </div> */}
        {/*
        <div id='control2' className='control'>
          <div className='title'>Control 2</div>
          <div className='drag'>{!isDraggable("control2") ? "Enable" : "Disable"} Dragging</div>
          <div className='remove'>Remove Connection</div>
        </div> */}
      </div>
    </div>
  );
};

export default JsPlumbMain;
