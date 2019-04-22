import React, { Component, Fragment } from "react";
import AssetImage from "./assetimage";

class TreeClass extends Component {
  state = {
    curClassId: Number(this.props.curClassId),
    classArt: [],
  }

  haveTreeData = (treeData, ascendencyData) => {
    let classArt = [];
    // Hack to draw class background art, the position data doesn't seem to be in the tree JSON yet
    for (var i = 1; i < 7; i++) {
      var pos = [];
      var asset = null;

      switch (i) {
        case 1:
          pos = [-2750, 1600]
          asset = treeData.assets.BackgroundStr;
          break;
        case 2:
          pos = [2550, 1600]
          asset = treeData.assets.BackgroundDex;
          break;
        case 3:
          pos = [-250, -2200]
          asset = treeData.assets.BackgroundInt;
          break;
        case 4:
          pos = [-150, 2350]
          asset = treeData.assets.BackgroundStrDex;
          break;
        case 5:
          pos = [-2100, -1500]
          asset = treeData.assets.BackgroundStrInt;
          break;
        case 6:
          pos = [2350, -1950]
          asset = treeData.assets.BackgroundDexInt;
          break;
        default:
          continue;
      }

      const visibility = i === this.state.curClassId ? 'inline' : 'none';
      const left = pos[0] - treeData.min_x;
      const top = pos[1] - treeData.min_y;
      const key = "classArt" + i;
      const art = <AssetImage key={key} asset={asset} left={left} top={top} visibility={visibility} />;

      classArt.push(art);
    }
    this.setState({
      curClassId: this.state.curClassId,
      classArt: classArt,
    });
  }

  render() {

    console.log("TreeClass render");
    return(
      <>
        {this.state.classArt}
      </>
    );
  }
}

export default TreeClass;
