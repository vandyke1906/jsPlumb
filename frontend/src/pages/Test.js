import React, { Component } from "react";
import PropTypes from "prop-types";

class Test extends Component {
  render() {
    return <div></div>;
  }
}
Test.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Test;
