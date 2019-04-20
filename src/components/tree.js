import React, { Component } from "react";
import { passiveSkillTreeData, opts} from './treedata.js';

class Tree extends Component {
  //state = {
    //treedata: this.props.treedata || null
  //};
  //setTreedata = () => {
    //console.log("test");
    //var request = new XMLHttpRequest();
    //request.overrideMimeType("application/json");
    //request.open("GET", "../tree.json", true);
    //request.onreadystatechange = function() {
      //if (request.readyState == 4 && request.status == "200") {
        //console.log("test2");
        //console.log(request.responseText);
        //this.setState(
          //{
            //treedata: JSON.parse(request.responseText)
          //},
          //() => console.info(`${this.props.treedata}`)
        //);
      //}
    //};
    //request.send(null);
  //};
  render() {
    //if (!this.props.treedata) {
      //this.setTreedata();
    //}
    console.log(passiveSkillTreeData);
    console.log(opts);
    return null;
  }
}

export default Tree;
