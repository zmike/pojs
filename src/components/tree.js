import React, { Component } from "react";
import NodeMap from "./nodemap"
import GroupMap from "./groupmap"
import TreeClass from "./treeclass"
import TreeBackground from "./treebg"

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treedata: null,
      ascendency: null,
      width: 0,
      height: 0,
    };
    this.scale = 1.0;
    console.log("parsing tree data");
    fetch("treedata.txt")
      .then(response => {
        response.text().then(data => {
          const treeData = data;
          var treedata_search = "var passiveSkillTreeData = ";
          var start_treedata =
            treeData.search(treedata_search) + treedata_search.length;
          var end_treedata = treeData.slice(start_treedata).search(";");

          var opts_search = "ascClasses: ";
          var opts_end_search = "zoomLevels";
          var start_opts =
            treeData.slice(end_treedata).search(opts_search) +
            end_treedata +
            opts_search.length;
          var end_opts = treeData.slice(start_opts).search(opts_end_search);
          var opts_len = treeData.slice(start_opts, start_opts + end_opts).trimEnd()
            .length;
          const treedata = JSON.parse(treeData.slice(start_treedata, start_treedata + end_treedata));
          const ascendency = JSON.parse(treeData.slice(start_opts, start_opts + opts_len - 1));

          const width = treedata.max_x - treedata.min_x;
          const height = treedata.max_y - treedata.min_y;

          this.refs.treeBackground.setBackground(treedata.assets.Background1[0.3835], width, height);
          this.refs.treeClass.haveTreeData(treedata, ascendency);
          this.refs.groupMap.haveTreeData(treedata, ascendency, width, height);
          this.refs.nodeMap.haveTreeData(treedata, ascendency, width, height);

          this.state = {
            treedata: treedata,
            ascendency: ascendency,
            width: width,
            height: height,
          };
        })
      })
  }

  handleWheel = (event) => {
    if (event.getModifierState("Control")) {
       event.preventDefault();

       var style = this.refs.canvasdiv.style;
       var scale = this.scale;
       if (event.deltaY < 0) {
         // Zoom in
         scale += 0.05;
       } else {
         // Zoom out
         scale -= 0.05;
       }
       // Restrict scale
       scale = Math.min(Math.max(.05, scale), 2);
       scale = Math.round(scale * 100) / 100;
       this.scale = scale;
    }
  }

  handleLoad = () => {
     this.refs.canvasdiv.addEventListener("wheel", this.handleWheel, {passive: false});
  }

  render() {
    console.log("tree render");
    return (
     <div ref="canvasdiv" style={{position: "absolute"}} onLoad={this.handleLoad}>
      <TreeBackground ref="treeBackground" style={{position: "absolute"}} />
      <TreeClass ref="treeClass" curClassId="1" style={{position: "absolute"}}/>
      <GroupMap ref="groupMap" style={{position: "absolute"}}/>
      <NodeMap ref="nodeMap" style={{position: "absolute"}}/>
     </div>
    );
  }
}

export default Tree;
