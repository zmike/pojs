import React, { Component, Fragment } from "react";

class AssetImage extends Component {
  state = {
    style: {
      display: this.props.visibility,
    },
    rendered: 0,
  }
  handleAssetLoad = () => {
    var assetimage = this.refs.assetimage;
    var width = assetimage.naturalWidth;
    var height = assetimage.naturalHeight;
    var state = {
      style: {
        position: 'absolute',
        left: this.props.left - width + "px",
        top: this.props.top - height + "px",
        width: width * 2 + "px",
        height: height * 2 + "px",
        border: "none",
        display: this.props.visibility,
      },
      rendered: 0,
    };
    this.setState(state);
  }
  shouldComponentUpdate() {
     return !this.state.style || !this.state.rendered;
  }
  componentDidUpdate() {
    if (!this.state.rendered && this.state.style) {
      var state = {
        style: this.state.style,
        rendered: 1,
      };
      this.setState(state);
    }
  }
  render() {
    var assetName = "https://web.poecdn.com" + (this.props.asset[0.3835] ? this.props.asset[0.3835] : this.props.asset[1]);

    return(
      <img ref="assetimage" src={assetName} onLoad={this.handleAssetLoad} style={this.state.style} />
    );
  }
}

export default AssetImage;

