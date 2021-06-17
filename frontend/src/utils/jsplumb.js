import { jsPlumb } from "jsplumb";

class JsPlumb {
  constructor(containerId) {
    // //if already created instance - dont created again instead call previous instance #for singleton
    // if (JsPlumb.instance instanceof JsPlumb) {
    //   return JsPlumb.instance;
    // }
    // Object.freeze(this); //cant modified the instance that created #for singleton
    // JsPlumb.instance = this; //global - key #for singleton

    this.jsPlumbObject = {
      jsPlumbInstance: null,
    };

    this.init(containerId);
  }

  init(containerId) {
    this.set(
      "jsPlumbInstance",
      jsPlumb.getInstance({
        Container: containerId,
      })
    );
    console.log("initialized...");
  }

  /**
   *
   * @param {String} key
   * @returns
   */
  get(key) {
    return this.jsPlumbObject[key];
  }

  /**
   *
   * @param {String} key
   * @param {Any Type} value
   */
  set(key, value) {
    this.jsPlumbObject[key] = value;
  }

  // /**
  //  *
  //  * @param {String} containerId
  //  */
  // getContainer(containerId) {
  //   this.get("jsPlumbInstance").getContainer(containerId);
  // }

  /**
   *
   * @param {String} controllerId
   * @param {Boolean} containment
   */
  setControllerDraggable(controllerId, containment = true) {
    this.get("jsPlumbInstance").draggable(controllerId, { containment: containment });
  }

  setEndPointOptions(controllerId, endPointOptions = {}) {
    this.get("jsPlumbInstance").addEndpoint(controllerId, endPointOptions);
  }

  addEndPoint(controllerId, endPointOptions = {}) {
    this.get("jsPlumbInstance").addEndpoint(controllerId, endPointOptions);
  }
}

export default JsPlumb;
