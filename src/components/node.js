import React, { Component } from 'react';

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
    this.state = state;
  }
  shouldComponentUpdate() {
     return false;
  }
  render() {
    return(null);
  }
}

export default Node;

