import React, { Component, Fragment } from 'react';
import Node from './node';
import CanvasMap from './canvasmap';

class NodeMap extends Component {
  state = {
    nodes: {},
    treeData: {},
    ascendencyData: {},
    spriteMap: {},
    width: 0,
    height: 0,
  };

  buildNodeMap = (treeData, ascendencyData, width, height) => {
    var state = this.state;
    console.log("assembling class map", ascendencyData);
    var ascendNameMap = {};
    Object.values(ascendencyData).forEach(classObj => {
      classObj.classes[0] = {
        name: "None"
      };
      Object.entries(classObj.classes).forEach(ascendency => {
        ascendNameMap[ascendency[1].name] = {
          ascendClassId: ascendency[0],
          ascendClass: ascendency[1]
        }
      });
    });

    var spriteMap = { }
    var spriteSheets = { }
    Object.entries(treeData.skillSprites).forEach(skillSprite => {
      var maxZoom = skillSprite[1][Object.values(skillSprite[1]).length - 1]
      var sheet;
      
      if (!spriteSheets[maxZoom.filename]) {
        sheet = {
          filename: treeData.imageRoot + "build-gen/passive-skill-sprite/" + maxZoom.filename,
        }
        spriteSheets[maxZoom.filename] = sheet;
      }
      sheet = spriteSheets[maxZoom.filename];
      Object.entries(maxZoom.coords).forEach(coords => {
        if (!spriteMap[coords[0]]) {
          spriteMap[coords[0]] = { }
        }
        spriteMap[coords[0]][skillSprite[0]] = {
          filename: sheet.filename,
          coords: coords[1],
        }
      });
    });

    var classArt = [
      "centerscion",
      "centermarauder",
      "centerranger",
      "centerwitch",
      "centerduelist",
      "centertemplar",
      "centershadow"
    ];
    var nodeOverlay = {
      Normal: {
        artWidth: 40,
        alloc: "PSSkillFrameActive",
        path: "PSSkillFrameHighlighted",
        unalloc: "PSSkillFrame",
        allocAscend: "PassiveSkillScreenAscendancyFrameSmallAllocated",
        pathAscend: "PassiveSkillScreenAscendancyFrameSmallCanAllocate",
        unallocAscend: "PassiveSkillScreenAscendancyFrameSmallNormal"
      },
      Notable: {
        artWidth: 58,
        alloc: "NotableFrameAllocated",
        path: "NotableFrameCanAllocate",
        unalloc: "NotableFrameUnallocated",
        allocAscend: "PassiveSkillScreenAscendancyFrameLargeAllocated",
        pathAscend: "PassiveSkillScreenAscendancyFrameLargeCanAllocate",
        unallocAscend: "PassiveSkillScreenAscendancyFrameLargeNormal"
      },
      Keystone: { 
        artWidth: 84,
        alloc: "KeystoneFrameAllocated",
        path: "KeystoneFrameCanAllocate",
        unalloc: "KeystoneFrameUnallocated"
      },
      Socket: {
        artWidth: 58, 
        alloc: "JewelFrameAllocated",
        path: "JewelFrameCanAllocate",
        unalloc: "JewelFrameUnallocated"
      }
    }
    Object.values(nodeOverlay).forEach(data => {
      var size = data.artWidth * 1.33;
      data.size = size;
      data.rsq = size * size;
    });

    console.log("assembling node map");
    var nodeMap = {};
    var sockets = {};
    var keystoneMap = {};
    Object.values(treeData.nodes).forEach(node => {
      if (node.spc[0]) {
         const classObj = ascendencyData[node.spc[0]];
         classObj.startNodeId = node.id
         node.startArt = classArt[node.spc[0] - 1]
      } else if (node.isAscendancyStart) {
        var ascendClass = ascendNameMap[node.ascendancyName].ascendClass;
        ascendClass.startNodeId = node.id
      } else if (node.isJewelSocket) {
        sockets[node.id] = node
      } else if (node.ks) {
        keystoneMap[node.dn] = node
      }

      if (!spriteMap[node.icon]) {
        spriteMap[node.icon] = { }
      }
      node.sprites = spriteMap[node.icon];
      if (nodeOverlay[node.type]) {
        node.overlay = nodeOverlay[node.type];
        node.rsq = node.overlay.rsq
        node.size = node.overlay.size
      } else {
         node.overlay = {}
      }

      var group = treeData.groups[node.g]
      group.ascendancyName = node.ascendancyName
      if (node.isAscendancyStart) {
        group.isAscendancyStart = true
      }
      const orbitMult = [ 0, Math.PI / 3, Math.PI / 6, Math.PI / 6, Math.PI / 20 ];
	     const orbitDist = [ 0, 82, 162, 335, 493 ];
      node.group = group
      node.angle = node.oidx * orbitMult[node.o]
      const dist = orbitDist[node.o]
      node.x = group.x + Math.sin(node.angle) * dist
      node.y = group.y - Math.cos(node.angle) * dist

      nodeMap[node.id] = node;
    });
    console.log(Object.keys(nodeMap).length + " nodes");

    state.nodes = nodeMap;
    state.treeData = treeData;
    state.ascendencyData = ascendencyData;
    state.width = width;
    state.height = height;
    this.setState(state);
  }

  haveTreeData = (treeData, ascendency, width, height) => {
    this.buildNodeMap(treeData, ascendency, width, height);
  }

  getSpriteSheet = (name) => {
     return this.refs[name];
  }

  getCanvasMap = () => {
     return this.refs.NodeMapCanvasMap;
  }

  render() {
    console.log("nodemap render");
    if (this.state.treeData && Object.entries(this.state.nodes).length) {
      var nodes = [];
      var sprites = [];
      var map = {};

      Object.values(this.state.treeData.skillSprites).forEach(spriteSheet => {
        var maxZoom = spriteSheet[Object.values(spriteSheet).length - 1];
        var filename = this.state.treeData.imageRoot + "build-gen/passive-skill-sprite/" + maxZoom.filename;
        if (!map[filename]) {
          map[filename] = sprites.push(<img alt="" src={filename} style={{display: 'none'}} ref={filename} key={filename} />);
        }
      });

      Object.entries(this.state.nodes).forEach(node => {
         nodes.push(<Node node={node[1]} treeData={this.state.treeData} ref={node[0]} key={node[0]} getCanvasMap={this.getCanvasMap} getSpriteSheet={this.getSpriteSheet} />);
      });
      //var node = Object.entries(this.state.nodes)[1];
      //console.log(node);
      //nodes.push(<Node node={node[1]} treeData={this.state.treeData} ref={node[0]} key={node[0]} getCanvasMap={this.getCanvasMap} getSpriteSheet={this.getSpriteSheet} />);
      
      return(
       <Fragment>
        {sprites}
        <CanvasMap width={this.state.width + 1000} height={this.state.height + 1000} name="NodeMapCanvasMap" ref="NodeMapCanvasMap" />
        {nodes}
       </Fragment>
      );
    } else {
      return(null);
    }
  }
}

export default NodeMap;
