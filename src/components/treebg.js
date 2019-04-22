import React, { Component, Fragment } from "react";

class TreeBackground extends Component {
  state = {
    Background1: "",
    width: 0,
    height: 0,
  };

  setupCanvases() {
    var canvases = [];
    var tileW = this.state.width / 4;
    var tileH = this.state.height / 4;
    tileW += 4 - (tileW % 4)
    tileH += 4 - (tileH % 4);

    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        var ref = "bgcanvas" + x + y;
        var style = {
          position: 'absolute',
          left: (tileW * x),
          top: (tileH * y),
          border: "none",
        };
        var canvas = this.refs[ref];
        canvases.push(<canvas ref={ref} key={ref} width={tileW} height={tileH} style={style} />);
      }
    }
    return canvases;
  }

  setBackground = (Background1, width, height) => {
   console.log("setBackground");
     this.setState({
       Background1: "https://web.poecdn.com" + Background1,
       width: width,
       height: height,
     });
  }

  drawBackground(canvas) {
     const ctx = canvas.getContext("2d")
     const Background1 = this.refs.Background1
     var pat = ctx.createPattern(Background1, "repeat");
     console.log("tiling "+Background1.width+"x"+Background1.height+" over "+canvas.width+"x"+canvas.height);
     ctx.rect(0, 0, canvas.width, canvas.height);
     ctx.fillStyle = pat;
     ctx.fill();
  }

  handleLoad = () => {
   console.log("loaded", this.refs.Background1);
     if (this.state.Background1) {
       console.log("reload");
       this.setState(this.state);
     }
  }

  handleError = () => {
     console.log(this.refs.Background1);
  }

  componentDidUpdate() {
    console.log(this.state.Background1, this.refs.Background1.complete);
    if (!this.state.Background1 || !this.refs.Background1.complete) {
      console.log("hit");
      return;
    }
    for (var x = 0; x < 4; x++) {
      for (var y = 0; y < 4; y++) {
        var ref = "bgcanvas" + x + y;
        this.drawBackground(this.refs[ref]);
      }
    }
  }

  render() {
    console.log("TreeBackground render");
    return (
      <>
        <img ref="Background1" src={this.state.Background1}
             style={{display: 'none'}} onLoad={this.handleLoad} onError={this.handleError} />
        {this.setupCanvases()}
      </>
    );
  }
}

export default TreeBackground;
