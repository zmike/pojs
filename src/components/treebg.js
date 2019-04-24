import React, { Component, Fragment } from "react";
import CanvasMap from "./canvasmap";

class TreeBackground extends Component {
  state = {
    Background1: "",
    width: 0,
    height: 0,
  };

  setBackground = (Background1, width, height) => {
     this.setState({
       Background1: Background1,
       width: width,
       height: height,
     });
  }

  drawBackground(canvas) {
     const ctx = canvas.getContext("2d");
     const Background1 = this.refs.Background1
     var pat = ctx.createPattern(Background1, "repeat");
     ctx.rect(0, 0, canvas.width, canvas.height);
     ctx.fillStyle = pat;
     ctx.fill();
  }

  handleLoad = () => {
     if (this.state.Background1) {
       this.setState(this.state);
     }
  }

  handleError = () => {
     console.log(this.refs.Background1);
  }

  componentDidUpdate() {
    if (!this.state.Background1 || !this.refs.Background1.complete) {
      return;
    }
    var canvases = this.refs.TreeBackgroundCanvasMap.getAllCanvases();
    var that = this;
    canvases.forEach(function(canvas) {
      that.drawBackground(canvas);
    });
  }

  render() {
    console.log("TreeBackground render");
    var canvasMap = this.state.Background1 ?
      <CanvasMap width={this.state.width + 1000} height={this.state.height + 1000} name="TreeBackground" ref="TreeBackgroundCanvasMap" />
      :
      null;
    return (
      <Fragment>
        <img alt="" ref="Background1" src={this.state.Background1}
             style={{display: 'none'}} onLoad={this.handleLoad} onError={this.handleError} />
        {canvasMap}
      </Fragment>
    );
  }
}

export default TreeBackground;
