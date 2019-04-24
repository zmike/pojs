import React, { Component } from "react";
import NodeMap from "./nodemap"
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

  render() {
    console.log("tree render");
    return (
     <div ref="canvasdiv" style={{position: "absolute"}}>
      <TreeBackground ref="treeBackground" style={{position: "absolute"}} />
      <TreeClass ref="treeClass" curClassId="1" style={{position: "absolute"}}/>
      <NodeMap ref="nodeMap" style={{position: "absolute"}}/>
     </div>
    );
  }
}

export default Tree;
