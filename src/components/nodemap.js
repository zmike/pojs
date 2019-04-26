import React, { Component, Fragment } from 'react';
import Node from './node';
import CanvasMap from './canvasmap';
import {getCanvasKey, getNodeType, mapObject} from '../utils';

class NodeMap extends Component {
  state = {
    nodes: {},
    spriteSheets: {},
    spriteSheetCount: 0,
    spriteSheetLoaded: 0,
  };

  buildNodeMap() {
    var state = this.state;
    console.log("assembling class map");
    var ascendNameMap = {};
    Object.values(this.props.ascendencyData).forEach(classObj => {
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
    Object.entries(this.props.treeData.skillSprites).forEach(skillSprite => {
      var maxZoom = skillSprite[1][Object.values(skillSprite[1]).length - 1]
      var sheet;
      
      if (!spriteSheets[maxZoom.filename]) {
        sheet = {
          filename: this.props.treeData.imageRoot + "build-gen/passive-skill-sprite/" + maxZoom.filename,
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
    const nodeOverlay = {
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
    Object.values(this.props.treeData.nodes).forEach(node => {
      const nodeType = getNodeType(node)
      if (node.spc[0]) {
         const classObj = this.props.ascendencyData[node.spc[0]];
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
      if (nodeOverlay[nodeType]) {
        node.overlay = nodeOverlay[nodeType];
        node.rsq = node.overlay.rsq
        node.size = node.overlay.size
      } else {
         node.overlay = {};
      }

      var group = this.props.treeData.groups[node.g]
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

    var imageMap = {};

    Object.values(this.props.treeData.skillSprites).forEach(spriteSheet => {
      var maxZoom = spriteSheet[Object.values(spriteSheet).length - 1];
      var filename = this.props.treeData.imageRoot + "build-gen/passive-skill-sprite/" + maxZoom.filename;
      if (!imageMap[filename]) {
          var img = new Image();
          imageMap[filename] = img;
          img.onload = this.handleSpriteSheetLoad;
          img.onerror = this.handleSpriteSheetError;
          img.src=filename;
      }
    });

    state.nodes = nodeMap;
    state.spriteSheets = imageMap;
    state.spriteSheetCount = Object.values(spriteSheets).length;
    console.log("detected " + state.spriteSheetCount + " spritesheets");
    this.setState(state);
  }

  componentDidMount() {
    this.buildNodeMap();
  }

  getSpriteSheet = (name) => {
     return this.state.spriteSheets[name];
  }

  getCanvasMap = () => {
     return this.refs.NodeMapCanvasMap;
  }

  drawNodeMap() {
    console.log("graphing nodemap");
    const canvases = this.refs.NodeMapCanvasMap.getAllCanvases();
    const tileW = canvases[0].width;
    const tileH = canvases[0].height;
    var canvasMap = {};
    var groupMap = {};
    var i = 0, j = 0;
    canvasMap[i] = {};
    canvases.forEach(canvas => {
      canvasMap[i][j] = canvas;
      j++;
      if (j === 4) {
        j = 0;
        i++;
        canvasMap[i] = {};
      }
      groupMap[getCanvasKey(canvas)] = [];
    });
    var count = 0;
    const startTime = new Date();
    Object.entries(this.props.treeData.nodes).forEach(nodeItem => {
      const node = nodeItem[1];
      var base = this.refs[nodeItem[0]].getImage();
      if (base) {
        var w, h, img, bx = 0, by = 0;
        // socket
        if (base.coords === undefined) {
          img = this.props.getAssetByUrl(base[0.3835]);
          w = img.naturalWidth;
          h = img.naturalHeight;
        } else {
          img = this.getSpriteSheet(base.filename);
          bx = base.coords.x;
          by = base.coords.y;
          w = base.coords.w;
          h = base.coords.h;
        }
        const x = node.x - w - this.props.treeData.min_x + 500;
        const y = node.y - h - this.props.treeData.min_y + 500;

        h *= 2;
        w *= 2;

        count += mapObject(img, x, y, w, h, tileW, tileH, canvasMap, groupMap, bx, by);
      }
    });
    console.log("graphed " + count + " node draws");

    count = 0;
    canvases.forEach(canvas => {
      const cx = parseInt(canvas.style.left, 10);
      const cy = parseInt(canvas.style.top, 10);
      const ctx = canvas.getContext("2d");
      groupMap[getCanvasKey(canvas)].forEach(info => {
        count++;
        ctx.drawImage(info.img,
          info.bx,
          info.by,
          info.w / 2,
          info.h / 2,
          info.x - cx,
          info.y - cy,
          info.w,
          info.h
        );
      });
    });
    const endTime = new Date();
    console.log("performed " + count + " node draws in " + (endTime - startTime) / 1000 + "s");
  }

  componentDidUpdate() {
   console.log("nodemap update");
    if (this.state.spriteSheetCount === this.state.spriteSheetLoaded) {
      this.drawNodeMap();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
     return this.state.spriteSheetCount === nextState.spriteSheetLoaded;
  }

  handleSpriteSheetLoad = () => {
   console.log("spritesheet loaded!");
    var state = this.state;
    state.spriteSheetLoaded++;
    this.setState(state);
  }
  handleSpriteSheetError = () => {
    var state = this.state;
    state.spriteSheetLoaded++;
    this.setState(state);
  }

  render() {
    console.log("nodemap render");
    var nodes = [];

    Object.entries(this.state.nodes).forEach(node => {
       nodes.push(<Node node={node[1]} treeData={this.props.treeData}
         ref={node[0]} key={node[0]} getCanvasMap={this.getCanvasMap} getSpriteSheet={this.getSpriteSheet} />);
    });
    //var node = Object.entries(this.state.nodes)[1];
    //console.log(node);
    //nodes.push(<Node node={node[1]} treeData={this.props.treeData} ref={node[0]} key={node[0]} getCanvasMap={this.getCanvasMap} getSpriteSheet={this.getSpriteSheet} />);
    console.log("created nodes");
    return(
     <Fragment>
      <CanvasMap width={this.props.width + 1000} height={this.props.height + 1000} name="NodeMapCanvasMap" ref="NodeMapCanvasMap" />
      {nodes}
     </Fragment>
    );
  }
}

export default NodeMap;
