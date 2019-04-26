import React, { Component, Fragment } from 'react';
import CanvasMap from './canvasmap';
import {getCanvasKey, mapObject} from '../utils';

class GroupMap extends Component {
  getImageUrl(group) {
    var asset = null;

    if (group.ascendancyName) {
      const key = "Classes" + group.ascendencyName;
      asset = this.props.treeData.assets[key];
    } else if (group.oo[3]) {
      asset = this.props.treeData.assets.PSGroupBackground3;
    } else if (group.oo[2]) {
      asset = this.props.treeData.assets.PSGroupBackground2;
    } else if (group.oo[1]) {
      asset = this.props.treeData.assets.PSGroupBackground1;
    }
    if (asset) {
      return asset[0.3835];
    }
    return null;
  }

  drawGroupMap() {
    // Draw the group backgrounds
    const canvases = this.refs.GroupMapCanvasMap.getAllCanvases();
    const tileW = canvases[0].width;
    const tileH = canvases[0].height;
    var canvasMap = {};
    var groupMap = {};
    var i = 0, j = 0;
    var offscreenCanvas = new OffscreenCanvas(1, 1);
    var didOffscreenDraw = false;
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
    console.log(canvasMap);
    var count = 0;
    const startTime = new Date();
    Object.entries(this.props.treeData.groups).forEach(groupItem => {
      const group = groupItem[1];
      const filename = this.getImageUrl(group);
      if (filename) {
        var img = this.props.getAssetByUrl(filename);
        var w = img.naturalWidth;
        var h = img.naturalWidth;
        var x = group.x - w - this.props.treeData.min_x + 500;
        var y = group.y - h - this.props.treeData.min_y + 500;

        if (group.oo[3]) {
          y -= h / 4;
          x -= w / 4;
          h *= 1.25;
          w *= 1.25;
        } else {
          h *= 2;
        }
        w *= 2;

        count += mapObject(img, x, y, w, h, tileW, tileH, canvasMap, groupMap);

        if (group.oo[3]) {
          if (!didOffscreenDraw) {
            // do transform render in fbo for sampling
            offscreenCanvas.width = w;
            offscreenCanvas.height = h;
            var ctx = offscreenCanvas.getContext("2d");
            ctx.translate(0, h);
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, 0, w, h);
            ctx.restore();
          }
          count += mapObject(offscreenCanvas, x, y + h, w, h, tileW, tileH, canvasMap, groupMap);
        }
      }
    });
    console.log("graphed " + count + " group draws");
    count = 0;
    canvases.forEach(canvas => {
      const cx = parseInt(canvas.style.left, 10);
      const cy = parseInt(canvas.style.top, 10);
      const ctx = canvas.getContext("2d");
      groupMap[getCanvasKey(canvas)].forEach(info => {
        count++;
         //if (!(cx < info.x + info.w && cy < info.y + info.h && cx + tileW > info.x && cy + tileH > info.y)) {
          //console.error("bug!", info);
        //}
        ctx.drawImage(info.img, info.x - cx, info.y - cy, info.w, info.h);
      });
    });
    const endTime = new Date();
    console.log("performed " + count + " group draws in " + (endTime - startTime) / 1000 + "s");
  }


  componentDidMount() {
    this.drawGroupMap();
  }

  render() {
    console.log("GroupMap render");

    return (
      <Fragment>
        <CanvasMap width={this.props.width + 1000} height={this.props.height + 1000} name="GroupMap" ref="GroupMapCanvasMap" />
      </Fragment>
    );
  }
}


export default GroupMap;
