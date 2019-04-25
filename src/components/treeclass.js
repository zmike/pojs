import React, { Component, Fragment } from "react";
import AssetImage from "./assetimage";

class TreeClass extends Component {
  state = {
    curClassId: Number(this.props.curClassId),
    classArt: [],
  }

  componentDidMount() {
    let classArt = [];
    // Hack to draw class background art, the position data doesn't seem to be in the tree JSON yet
    for (var i = 1; i < 7; i++) {
      var pos = [];
      var asset = null;

      switch (i) {
        case 1:
          pos = [-2750, 1600]
          asset = this.props.treeData.assets.BackgroundStr;
          break;
        case 2:
          pos = [2550, 1600]
          asset = this.props.treeData.assets.BackgroundDex;
          break;
        case 3:
          pos = [-250, -2200]
          asset = this.props.treeData.assets.BackgroundInt;
          break;
        case 4:
          pos = [-150, 2350]
          asset = this.props.treeData.assets.BackgroundStrDex;
          break;
        case 5:
          pos = [-2100, -1500]
          asset = this.props.treeData.assets.BackgroundStrInt;
          break;
        case 6:
          pos = [2350, -1950]
          asset = this.props.treeData.assets.BackgroundDexInt;
          break;
        default:
          continue;
      }

      //const visibility = i === this.state.curClassId ? 'block' : 'none';
      const visibility = 'block';
      const left = pos[0];
      const top = pos[1];
      const key = "classArt" + i;
      const art = <AssetImage key={key} img={asset} left={left} top={top} treeData={this.props.treeData} visibility={visibility} zIndex="0" />;

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
      <Fragment>
        {this.state.classArt}
      </Fragment>
    );
  }
}

export default TreeClass;
