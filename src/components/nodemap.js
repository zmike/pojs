import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Node from './node';

class NodeMap extends Component {
  state = {
    nodes: null
  };
  nodes = null;

  shouldComponentUpdate() {
     return !this.state.nodes;
  }

  buildNodeMap = (treeData, ascendencyData) => {

    console.log("assembling class map");
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
          filename: "https://web.poecdn.com" + treeData.imageRoot + "build-gen/passive-skill-sprite/" + maxZoom.filename,
        }
        spriteSheets[maxZoom.filename] = sheet
      }
      sheet = spriteSheets[maxZoom.filename];
      Object.entries(maxZoom.coords).forEach(coords => {
        if (!spriteMap[coords[0]]) {
          spriteMap[coords[0]] = { }
        }
        spriteMap[coords[0]][skillSprite[0]] = {
          filename: sheet.filename,
          width: coords[1].w,
          height: coords[1].h,
          vertices: [
            coords[1].x / sheet.width, 
            coords[1].y / sheet.height, 
            (coords[1].x + coords[1].w) / sheet.width,
            (coords[1].y + coords[1].h) / sheet.height
          ]
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
      const noderef = "node" + node.id;

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

      nodeMap[node.id] = <Node node={node} canvas={this.refs.canvas} ref={noderef}/>;
    });

    this.nodes = nodeMap;
  }

  componentDidUpdate() {
     if (this.nodes !== this.state.nodes) {
       this.setState({
         nodes: this.nodes,
       });
     }
  }

  haveTreeData = (treeData, ascendency) => {
    this.buildNodeMap(treeData, ascendency);
  }

  render() {
    console.log("nodemap render");
    return (null
    );
  }
}

NodeMap.propTypes = {
  getTreeData: PropTypes.func,
  getAscendencyData: PropTypes.func,
};
NodeMap.defaultProps = {
  getTreeData: null,
  getAscendencyData: null,
};

export default NodeMap;
