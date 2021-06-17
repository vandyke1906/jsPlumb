import React, { useState, useEffect, useRef } from "react";
import { jsPlumb } from "jsplumb";
import classJsPlumb from "utils/jsplumb";

//css
import "./jsPlumbMain.scss";

const JsPlumbMain = () => {
  const [currentJsPlumbInstance, setCurrentJsPlumbInstance] = useState(undefined);
  const [endPoints, setEndPoints] = useState([]);
  const [currentEndPoint, setCurrentEndPoint] = useState({});
  const [parentContainer, setParentContainer] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [maxValue, setMaxValue] = useState(1);

  const currentTop = useRef(10);
  const currentLeft = useRef(10);
  const countControls = useRef(1);

  // let currentTop,
  //   currentLeft = 50;
  // let countControls = 0;

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
    instance.registerConnectionTypes({
      "connector-style": {
        paintStyle: { stroke: "gray", strokeWidth: 2 },
        hoverPaintStyle: { stroke: "gray", strokeWidth: 5 },
      },
    });
    setCurrentJsPlumbInstance(instance);

    //test class
    const testClass = new classJsPlumb();
    console.log("class", testClass);
  }, []);

  useEffect(() => {
    if (currentJsPlumbInstance) {
      currentJsPlumbInstance.bind("connection", function (params) {
        // console.log("params connection", params.connection);
        // console.log(params.connection.getParameters());
        const parameters = params.connection.getParameters();
        for (let p in parameters) {
          // console.log(p);
          if (p.includes("info")) parameters[p]();
        }
      });

      // currentJsPlumbInstance.bind("click", function (component, event) {
      //   if (component.hasClass("jtk-connector")) {
      //     console.log(component);
      //   }
      // });
    }
  }, [currentJsPlumbInstance]);

  useEffect(() => {
    if (Object.entries(currentEndPoint).length === 0) return;
    const { elementId, controlName, maxConnection } = currentEndPoint;
    const divControl = createElement("div", null, elementId, "control");
    // divControl.style.top = `${Math.round(Math.random() * 600)}px`;
    // divControl.style.left = `${Math.round(Math.random() * 400)}px`;

    divControl.style.top = `${currentTop.current}px`;
    divControl.style.left = `${currentLeft.current}px`;

    currentLeft.current += 300;

    if (countControls.current % 4 === 0) {
      currentLeft.current = 0;
      currentTop.current += 250;
    }

    countControls.current += 1;

    divControl.onmouseover = () => setCurrentEP(elementId); //set current ep
    divControl.onmouseout = () => setCurrentEP(null); //set current ep

    const divTitle = createElement("div", `Name: ${controlName}`, null, "title");
    const divMaxConnection = createElement("div", `Max Connection: ${maxConnection}`, null, "title");

    const divDeleteControl = createElement("button", "Delete Control", null, "delete");
    divDeleteControl.className = "btn-link";
    divDeleteControl.onclick = () => {
      const currentElement = document.getElementById(elementId);
      currentElement.remove();
      currentJsPlumbInstance.removeAllEndpoints(elementId);
    };

    const divDragContent = `Toggle Draggable`;
    const divDrag = createElement("button", divDragContent, null, "drag");
    divDrag.className = "btn-link";
    divDrag.onclick = () => {
      const setDraggable = currentJsPlumbInstance.toggleDraggable(elementId);
      const currentElement = document.getElementById(elementId);
      currentElement.classList.remove("not_draggable");
      if (setDraggable) currentElement.classList.add("draggable");
      else {
        currentElement.classList.add("not_draggable");
      }
    };

    const divRemoveConnection = createElement("button", "Remove Connection", null, "remove");
    divRemoveConnection.className = "btn-link";
    divRemoveConnection.onclick = () => {
      console.log(currentJsPlumbInstance.getAllConnections());
      const allConnections = currentJsPlumbInstance.getAllConnections();
      const currentConnections = allConnections.filter((c) => c.source.id === elementId || c.target.id === elementId);
      for (let conn of currentConnections) {
        currentJsPlumbInstance.deleteConnection(conn);
      }
    };

    divControl.appendChild(divTitle);
    divControl.appendChild(divMaxConnection);
    divControl.appendChild(divDeleteControl);
    divControl.appendChild(divDrag);
    divControl.appendChild(divRemoveConnection);

    parentContainer.appendChild(divControl);

    /* for js plumb */
    const parameters = {};
    parameters[`${elementId}_name`] = controlName;
    parameters[`${elementId}_maxConnection`] = maxConnection;
    parameters[`${elementId}_info`] = () =>
      console.log(`Name of ${controlName} has maximum connection of ${maxConnection}`);

    addJsPlumbEndPoint(currentJsPlumbInstance, elementId, maxConnection, parameters);
    currentJsPlumbInstance.draggable(elementId, { containment: true });
    /* for js plumb */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endPoints]);

  // useEffect(() => {
  //   currentJsPlumbInstance?.draggable(draggableElements, { containment: true });
  //   console.log("draggableElements", draggableElements);
  // }, [draggableElements]);

  const setCurrentEP = (elementId) => {
    let currentEP = null;
    if (elementId) currentEP = endPoints.find((ep) => ep.elementId === elementId);
    setCurrentEndPoint(currentEP);
    // console.log("set current ep", currentEP);
  };

  const addJsPlumbEndPoint = (jsPlumbInstance, elementId, maxConnections = 1, parameters = {}) => {
    jsPlumbInstance.addEndpoint(elementId, {
      endpoint: "Dot",
      anchor: "BottomCenter",
      isTarget: true,
      isSource: true,
      maxConnections: maxConnections,
      onMaxConnections: function (params) {
        alert(`Max connection allowed is only ${params.maxConnections}`);
      },
      parameters: parameters,
      connectionType: "connector-style",
    });
  };

  const addNewEndPoint = (e) => {
    if (inputValue === "") {
      alert("Error! Endpoint is empty");
      return;
    }

    const id = new Date().getTime().toString();

    const endPoint = {
      controlName: inputValue,
      elementId: id,
      maxConnection: maxValue,
    };

    setEndPoints((oldEndPoints) => [...oldEndPoints, endPoint]);
    setCurrentEndPoint(endPoint);

    //clear input
    setInputValue("");
    setMaxValue(1);
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
        <label htmlFor='endpoint'>New Endpoint:</label>{" "}
        <input
          type='text'
          id='endpoint'
          name='endpoint'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />{" "}
        <label htmlFor='connection'>Max Connection:</label>{" "}
        <input
          type='number'
          id='connection'
          name='connection'
          min='1'
          value={maxValue}
          onChange={(e) => setMaxValue(e.target.value)}
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
