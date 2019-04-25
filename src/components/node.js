import React, { Component } from 'react';
//import AssetImage from "./assetimage";

class Node extends Component {
  constructor(props) {
    super(props);

    var state = {};

    if (this.props.node.spc[0]) {
      state.type = "ClassStart"
    } else if (this.props.node.isAscendancyStart) {
      state.type = "AscendClassStart"
    } else if (this.props.node.m) {
      state.type = "Mastery"
    } else if (this.props.node.isJewelSocket) {
      state.type = "Socket"
    } else if (this.props.node.ks) {
      state.type = "Keystone"
    } else if (this.props.node["not"]) {
      state.type = "Notable"
    } else
      state.type = "Normal"
/*
      //Parse node modifier lines
      node.mods = { }
      node.modKey = ""
      var i = 1
      if (node.passivePointsGranted > 0) {
        node.sd.concat(["Grants " + node.passivePointsGranted + " Passive Skill Point" + (node.passivePointsGranted > 1  "s" : "")]);
      }
      while (node.sd[i]) {
        if (node.sd[i].search("\n")) {
          const fullDescription = node.sd[i].replace("\n", " ");
          var line = node.sd[i]
          var il = i
          t_remove(node.sd, i)
          for line in line:gmatch("[^\n]+") {
            t_insert(node.sd, il, line)
            il = il + 1
          }
        }
        var line = node.sd[i]
        var list, extra = modLib.parseMod[targetVersion](line)
        if (!list || extra) {
          //Try to combine it with one or more of the lines that follow this one
          var endI = i + 1
          while node.sd[endI] {
            var comb = line
            for ci = i + 1, endI {
              comb = comb .. " " .. node.sd[ci]
            }
            list, extra = modLib.parseMod[targetVersion](comb, true)
            if (list and not extra) {
              //Success, add dummy mod lists to the other lines that were combined with this one
              for ci = i + 1, endI {
                node.mods[ci] = { list = { } }
              }
              break
            }
            endI = endI + 1
          }
        }
        if (!list) {
          //Parser had no idea how to read this modifier
          node.unknown = true
        } else if (extra) {
          //Parser recognised this as a modifier but couldn't understand all of it
          node.extra = true
        } else {
          for _, mod in ipairs(list) {
            node.modKey = node.modKey.."["..modLib.formatMod(mod).."]"
          }
        }
        node.mods[i] = { list = list, extra = extra }
        i = i + 1
        while node.mods[i] {
          //Skip any lines with dummy lists added by the line combining code
          i = i + 1
        }
      }

      //Build unified list of modifiers from all recognised modifier lines
      node.modList = new("ModList")
      for _, mod in pairs(node.mods) {
        if ( mod.list and not mod.extra) {
          for i, mod in ipairs(mod.list) {
            mod.source = "Tree:"..node.id
            if ( type(mod.value) == "table" and mod.value.mod) {
              mod.value.mod.source = mod.source
            }
            node.modList:AddMod(mod)
          }
        }
      }
      if ( node.type == "Keystone") {
        node.keystoneMod = modLib.createMod("Keystone", "LIST", node.dn, "Tree"..node.id)
      }
    }
*/
    state.overlay = null;
    state.alloc = false;
    state.base = null;
    state.z = 0;
    this.state = state;
  }

  nodeUpdate = () => {
    var state = this.state;
    var base = null;
    var overlay = null;
    var z = 2;

    switch (this.state.type) {
    case "ClassStart":
      overlay = this.state.alloc ? this.props.node.startArt : "PSStartNodeBackgroundInactive"
      break;
    case "AscendClassStart":
      overlay = "PassiveSkillScreenAscendancyMiddle"
      break;
    case "Mastery":
      // This is the icon that appears in the center of many groups
      z = 1;
      base = this.props.node.sprites.mastery;
      break;
    default:
      var allocString;
      if (this.state.alloc) {
      //if (self.showHeatMap || node.alloc || node === hoverNode || (self.traceMode && node === self.tracePath[#self.tracePath]) {
         // Show node as allocatedif (it is being hovered over
         // Alsoif (the heat map is turned on (makes the nodes more visible)
         allocString = "alloc"
       //} else if (hoverPath && hoverPath[node]) {
         //allocString = "path"
      } else {
        allocString = "unalloc"
      }
      if (this.state.type === "Socket") {
         // Node is a jewel socket, retrieve the socketed jewel (if present) so we can display the correct art
         base = this.props.treeData.assets[this.props.node.overlay[allocString]];
         //var socket, jewel = build.itemsTab:GetSocketAndJewelForNodeID(nodeId)
         //if (this.state.alloc && jewel) {
           //if (jewel.baseName === "Crimson Jewel") {
              //overlay = "JewelSocketActiveRed"
            //} else if (jewel.baseName === "Viridian Jewel") {
              //overlay = "JewelSocketActiveGreen"
            //} else if (jewel.baseName === "Cobalt Jewel") {
              //overlay = "JewelSocketActiveBlue"
            //} else if (jewel.baseName === "Prismatic Jewel") {
              //overlay = "JewelSocketActivePrismatic"
            //} else if (jewel.baseName:match("Eye Jewel$")) {
              //overlay = "JewelSocketActiveAbyss"
            //}
          //}
       } else {
         // Normal node (includes keystones && notables)
         base = this.props.node.sprites[this.state.type.toLowerCase() + (this.state.alloc ? "Active" : "Inactive")];
         overlay = this.props.node.overlay[allocString + (this.props.node.ascendancyName ? "Ascend" : "")]
       }
       break;
    }

    state.base = base;
    state.overlay = overlay;
    state.z = z;
    this.setState(state);
  }
  
  componentDidMount() {
    this.nodeUpdate();
  }

  getImage = () => {
    return this.state.base;
  }

  render() {
    return(null);
  }
  //render() {
    //if (this.state.base) {
      //return(
        //<AssetImage asset={this.state.base} left={this.props.node.x}
          //top={this.props.node.y} visibility="inline" zIndex={this.state.z}
          //treeData={this.props.treeData} />
      //);
    //} else {
      //return(null);
    //}
  //}
}

export default Node;

