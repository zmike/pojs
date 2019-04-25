import React, { Component, Fragment } from "react";
import CanvasMap from "./canvasmap";

class TreeBackground extends Component {

  drawBackground(canvas) {
     const ctx = canvas.getContext("2d", {alpha: false});
     const Background1 = this.refs.Background1
     var pat = ctx.createPattern(Background1, "repeat");
     console.log("drawing");
     ctx.rect(0, 0, canvas.width, canvas.height);
     ctx.fillStyle = pat;
     ctx.fill();
  }

  updateBackground() {
    var canvases = this.refs.TreeBackgroundCanvasMap.getAllCanvases();
    var that = this;
    canvases.forEach(function(canvas) {
      that.drawBackground(canvas);
    });
  }

  handleLoad = () => {
   console.log("bg loaded");
    this.updateBackground();
  }

  handleError = () => {
     console.log(this.refs.Background1);
  }

  componentDidUpdate() {
    if (this.refs.Background1.complete) {
      this.updateBackground();
    }
  }

  render() {
    console.log("TreeBackground render");
    return (
      <Fragment>
        <img alt="" ref="Background1" src={this.props.Background1}
             style={{display: 'none'}} onLoad={this.handleLoad} onError={this.handleError} />
        <CanvasMap width={this.props.width + 1000} height={this.props.height + 1000} name="TreeBackground" ref="TreeBackgroundCanvasMap" />
      </Fragment>
    );
  }
}

export default TreeBackground;
