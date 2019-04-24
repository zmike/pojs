import React, { Component, Fragment } from "react";

class CanvasMap extends Component {
  state = {
    width: this.props.width,
    height: this.props.height,
    tileW: Math.ceil(this.props.width / 4) + (4 - (Math.ceil(this.props.width / 4) % 4)),
    tileH: Math.ceil(this.props.height / 4) + (4 - (Math.ceil(this.props.height / 4) % 4)),
  };

  setupCanvases() {
    var canvases = [];

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var ref = "canvasMap" + i + j + this.props.name;
        var style = {
          position: 'absolute',
          left: (this.state.tileW * i),
          top: (this.state.tileH * j),
          border: "none",
        };
        canvases.push(<canvas ref={ref} key={ref} width={this.state.tileW} height={this.state.tileH} style={style} />);
      }
    }
    return canvases;
  }

  getCanvases = (x, y, w, h) => {
    var canvases = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var ref = "canvasMap" + i + j + this.props.name;
        var posX = this.state.tileW * i;
        var posY = this.state.tileH * j;
        
        if (posX < x + w && posY < y + h && posX + this.state.tileW > x && posY + this.state.tileH > y) {
          canvases.push(this.refs[ref]);
        }
      }
    }
    return canvases;
  }

  getAllCanvases = () => {
    var canvases = [];
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var ref = "canvasMap" + i + j + this.props.name;
        canvases.push(this.refs[ref]);
      }
    }
    return canvases;
  }

  render() {
    return (
      <Fragment>
        {this.setupCanvases()}
      </Fragment>
    );
  }
}

export default CanvasMap;
