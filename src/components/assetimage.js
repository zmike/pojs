import React, { Component } from "react";

class AssetImage extends Component {
  state = {
    style: {
      display: this.props.visibility,
    }
  }
  handleAssetLoad = () => {
    var assetimage = this.refs.assetimage;
    var width, height;
    var left;
    var top;
    width = Math.round(assetimage.naturalWidth * 2);
    height = Math.round(assetimage.naturalHeight * 2);
    left = this.props.left - this.props.treeData.min_x - width;
    top = this.props.top - this.props.treeData.min_y - height;
    var state = {
      style: {
        position: 'absolute',
        left: left + "px",
        top: top + "px",
        width: width + "px",
        height: height + "px",
        border: "none",
        display: this.props.visibility,
        zIndex: this.props.zIndex,
        clip: "auto",
      }
    };
    this.setState(state);
  }

  render() {
    var assetName;
    if (this.props.img) {
      assetName = this.props.img[0.3835];
    } else {
      assetName = this.props.asset.filename;
    }
    return(
      <img alt="" ref="assetimage" src={assetName} onLoad={this.handleAssetLoad} style={this.state.style} />
    );
  }
}

export default AssetImage;

