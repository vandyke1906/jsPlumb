import { jsPlumb } from "jsplumb";

class JsPlumb {
  constructor(containerId) {
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

  /**
   *
   * @param {String} containerId
   */
  getContainer(containerId) {
    this.get("jsPlumbInstance").getContainer(containerId);
  }

  /**
   *
   * @param {String} elementId
   * @param {Boolean} containment
   */
  setElementDraggable(elementId) {
    this.get("jsPlumbInstance").draggable(elementId, { containment: true });
  }

  /**
   *
   * @param {String} elementId
   * returns current draggable state
   */
  toggleElementDraggable(elementId) {
    return this.get("jsPlumbInstance").toggleDraggable(elementId);
  }

  /**
   *
   * @param {String} elementId
   * returns current draggable state
   */
  addEndPoint(elementId, endPointOptions = {}) {
    return this.get("jsPlumbInstance").addEndpoint(elementId, endPointOptions);
  }

  removeAllEnpoints(elementId) {
    this.get("jsPlumbInstance").removeAllEndpoints(elementId);
  }
}

export default JsPlumb;
