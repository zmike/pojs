import React, { Component } from "react";
import NodeMap from "./nodemap"

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treedata: null,
      ascendency: null,
      width: 0,
      height: 0,
    };
    console.log("parsing tree data");
    fetch("treedata.txt")
      .then(response => {
        response.text().then(data => {
          const TreeData = data;
          var treedata_search = "var passiveSkillTreeData = ";
          var start_treedata =
            TreeData.search(treedata_search) + treedata_search.length;
          var end_treedata = TreeData.slice(start_treedata).search(";");

          var opts_search = "ascClasses: ";
          var opts_end_search = "zoomLevels";
          var start_opts =
            TreeData.slice(end_treedata).search(opts_search) +
            end_treedata +
            opts_search.length;
          var end_opts = TreeData.slice(start_opts).search(opts_end_search);
          var opts_len = TreeData.slice(start_opts, start_opts + end_opts).trimEnd()
            .length;
          this.state = {
            treedata: JSON.parse(
              TreeData.slice(start_treedata, start_treedata + end_treedata)
            ),
            ascendency: JSON.parse(
              TreeData.slice(start_opts, start_opts + opts_len - 1)
            ),
          };
          const Background1 = this.refs.Background1
          Background1.src = "https://web.poecdn.com" + this.state.treedata.assets.Background1[0.3835];
        })
      })
  }
  //drawImageScaled(img, ctx) {
   //var canvas = ctx.canvas ;
   //var hRatio = canvas.width  / img.width    ;
   //var vRatio =  canvas.height / img.height  ;
   //var ratio  = Math.min ( hRatio, vRatio );
   //var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
   //var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
   //ctx.clearRect(0,0,canvas.width, canvas.height);
   //ctx.drawImage(img, 0,0, img.width, img.height,
                      //centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
  //}
  drawBackground() {
     if (!this.state.treedata) {
        return
     }
     const canvas = this.refs.canvas
     const ctx = canvas.getContext("2d")
     const Background1 = this.refs.Background1
     var pat = ctx.createPattern(Background1, "repeat");

     console.log("tiling "+Background1.width+"x"+Background1.height+" over "+canvas.width+"x"+canvas.height);
     ctx.rect(0, 0, canvas.width, canvas.height);
     ctx.fillStyle = pat;
     ctx.fill();

   this.setState({
      width: canvas.width,
      height: canvas.height,
   })
  }

  shouldComponentUpdate() {
    return this.state.width !== window.innerWidth ||
           this.state.height !== window.innerHeight;
  }

  componentDidMount() {
    const canvas = this.refs.canvas
    const Background1 = this.refs.Background1

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (Background1.current && Background1.current.complete) {
       this.drawBackground()
    }
    Background1.onload = () => {
       this.drawBackground()
    }
  }

  render() {
    console.log(this.state);
    return (
     <div ref="canvasdiv" className="canvas">
      <canvas ref="canvas" />
      <img ref="Background1" src="http://i.imgur.com/tJaBJjl.gif"
           style={{display: 'none'}} />
     </div>
    );
  }
}

export default Tree;
