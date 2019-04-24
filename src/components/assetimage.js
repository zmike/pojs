import React, { Component, Fragment } from "react";

class AssetImage extends Component {
  state = {
    style: {
      display: this.props.visibility,
    },
    style2: {
      display: this.props.visibility,
    }
  }
  handleAssetLoad2 = () => {
    var assetimage = this.refs.assetimage;
    var width, height;
    var left;
    var top;
    width = Math.round(assetimage.naturalWidth * 2);
    height = Math.round(assetimage.naturalHeight * 2);
    left = (2 * this.props.left) - this.props.treeData.min_x - width + 500;
    top = (2 * this.props.top) - this.props.treeData.min_y - height + 500;
    var state = this.state;
    state.style2 = {
      position: 'absolute',
      left: left + "px",
      top: top + "px",
      width: width + "px",
      height: height + "px",
      border: "none",
      display: this.props.visibility,
      zIndex: this.props.zIndex,
      transform: "scaleY(-1)",
    };
    this.setState(state);
  }

  handleAssetLoad = () => {
    var assetimage = this.refs.assetimage;
    var width, height;
    var left;
    var top;
    width = Math.round(assetimage.naturalWidth * 2);
    height = Math.round(assetimage.naturalHeight * 2);
    left = (2 * this.props.left) - this.props.treeData.min_x - width + 500;
    top = (2 * this.props.top) - this.props.treeData.min_y - height + 500;
    if (this.props.double === 1) {
      top -= height;
    }
    var state = this.state;
    state.style = {
      position: 'absolute',
      left: left + "px",
      top: top + "px",
      width: width + "px",
      height: height + "px",
      border: "none",
      display: this.props.visibility,
      zIndex: this.props.zIndex,
    };
    this.setState(state);
  }

  render() {
    var assetName;
    assetName = this.props.img[0.3835];
    if (this.props.double) {
      return(
        <Fragment>
          <img alt="" ref="assetimage" src={assetName} onLoad={this.handleAssetLoad} style={this.state.style} />
          <img alt="" ref="assetimage2" src={assetName} onLoad={this.handleAssetLoad2} style={this.state.style2} />
        </Fragment>
      );
    } else {
      return(
        <img alt="" ref="assetimage" src={assetName} onLoad={this.handleAssetLoad} style={this.state.style} />
      );
    }
  }
}

export default AssetImage;

