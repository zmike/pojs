import React, { Component } from "react";
import NodeMap from "./nodemap"
import GroupMap from "./groupmap"
import TreeClass from "./treeclass"
import TreeBackground from "./treebg"

class Tree extends Component {
  state = {
    treedata: null,
    ascendency: null,
    width: 0,
    height: 0,
    assetMap: {},
    assetMapByUrl: {},
    assetsLoaded: 0,
    assetCount: 0,
  };

  handleWheel = (event) => {
    if (event.getModifierState("Control")) {
       event.preventDefault();

       var style = this.refs.canvasdiv.style;
       var scale = this.scale;
       var incr = scale >= 1.0 ? 0.1 : 0.02;
       if (event.deltaY < 0) {
         // Zoom in
         scale += incr;
       } else {
         // Zoom out
         scale -= incr;
       }
       // Restrict scale
       scale = Math.min(Math.max(.05, scale), 2);
       scale = Math.round(scale * 100) / 100;
       this.scale = scale;
       style.transform = "scale(" + this.scale + ")";
    }
  }

  handleLoad = () => {
     this.refs.canvasdiv.addEventListener("wheel", this.handleWheel, {passive: false});
  }


  shouldComponentUpdate(nextProps, nextState) {
     return this.state.assetCount === nextState.assetsLoaded;
  }

  handleAssetLoad = () => {
    var state = this.state;
    state.assetsLoaded++;
    this.setState(state);
  }

  handleAssetError = () => {
    var state = this.state;
    state.assetsLoaded++;
    this.setState(state);
  }

  componentDidMount() {
    console.log("parsing tree data");
    this.scale = 0.1;
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

          var assetMap = {};
          var assetMapByUrl = {};
          var assetCount = 0;

          Object.entries(treedata.assets).forEach(asset => {
            var img = new Image();
            img.src = asset[1][0.3835];
            if (img.src === undefined) {
              img.src = asset[1][1];
            }
            assetMap[asset[0]] = img;
            assetMapByUrl[img.src] = img;
            assetCount++;
          });

          this.setState({
            treedata: treedata,
            ascendency: ascendency,
            assetMap: assetMap,
            assetMapByUrl: assetMapByUrl,
            assetCount: assetCount,
            assetsLoaded: 0,
            width: width,
            height: height,
          });
        });
      });
  }
  getAsset = (name) => {
    return this.state.assetMap[name];
  }

  getAssetByUrl = (url) => {
    return this.state.assetMapByUrl[url];
  }

  render() {
    if (!this.state.treedata) {
      return(null);
    }

    console.log("tree render");
    return (
     <div ref="canvasdiv" style={{position: "absolute", transform: "scale(" + this.scale + ")"}} onLoad={this.handleLoad}>
      <TreeBackground ref="treeBackground" style={{position: "absolute"}}
        Background1={this.state.treedata.assets.Background1[0.3835]}
        width={this.state.width} height={this.state.height}/>
      {/*
      <TreeClass ref="treeClass" curClassId="1" style={{position: "absolute"}}
        treeData={this.state.treedata} ascendencyData={this.state.ascendency}/>
        */}
      <GroupMap ref="groupMap" style={{position: "absolute"}}
        treeData={this.state.treedata} ascendencyData={this.state.ascendency}
        width={this.state.width} height={this.state.height} getAsset={this.getAsset} getAssetByUrl={this.getAssetByUrl}/>
      <NodeMap ref="nodeMap" style={{position: "absolute"}}
        treeData={this.state.treedata} ascendencyData={this.state.ascendency}
        width={this.state.width} height={this.state.height} getAsset={this.getAsset} getAssetByUrl={this.getAssetByUrl}/>
     </div>
    );
  }
}

export default Tree;
