<template>
  <div class="common-layout" style="height: 100%">
    <el-container style="height: 100%">
      <el-header class="iheader">斑岩铜矿知识图谱</el-header>
      <el-container>
        <el-aside width="400px">
          <el-container class="aside-box">
            <el-row>
              <el-check-tag
                class="relTypeButton"
                size="mini"
                v-for="item in relTypes"
                :key="item.name"
                @change="onChange(item.id)"
                :checked="item.use"
                >{{ item.name }}</el-check-tag
              >
            </el-row>
          </el-container>
          <div class="slider-box">
            <div class="slider-p">节点大小</div>
            <el-slider
              v-model="insSizeFilter"
              @change="holdInsFilter"
              range
              show-stops
              :max="maxSize"
            >
            </el-slider>
            <div class="slider-p">关系强弱</div>
            <el-slider
              v-model="relSizeFilter"
              @change="holdRelFilter"
              range
              show-stops
              :max="maxWidth"
            >
            </el-slider>
          </div>
          <el-container class="aside-box">
            <el-switch
              v-model="fixNodes"
              active-text="锁定布局"
              inactive-text="流动布局"
              @change="holdFixChange"
            >
            </el-switch>
            <el-switch
              v-model="autoSave"
              active-text="自动保存"
              inactive-text="手动保存"
              @change="holdsaveChange"
            >
            </el-switch>
          </el-container>
          <el-container class="aside-box">
            <el-row>
              <el-select
                v-model="node1Id"
                filterable
                placeholder="实体1"
                @change="selectNode1"
                class="select-box"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="node2Id"
                filterable
                placeholder="实体2"
                @change="selectNode2"
                class="select-box"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button
                class="select-button"
                type="success"
                @click="mergeNodes"
                >合并</el-button
              >
              <el-select
                v-model="relTypeNow"
                filterable
                placeholder="关系类型"
                class="select-box"
              >
                <el-option
                  v-for="item in relIdMap"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="relValueNow"
                filterable
                placeholder="关系权重"
                class="select-box"
              >
                <el-option
                  v-for="item in relValues"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-button class="select-button" type="success" @click="addRel"
                >新建</el-button
              >
              <el-button class="button-label" type="primary" plain>{{ insNameNow }}</el-button>
              <el-select
                v-model="insValueNow"
                filterable
                placeholder="实体类型"
                class="select-box"
              >
                <el-option
                  v-for="item in insIdMap"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-button class="select-button" type="success" @click="changeIns"
                >修改</el-button
              >
            </el-row>
          </el-container>
          <el-container class="aside-box">
            <el-button class="select-button" type="success" @click="saveData"
              >保存</el-button
            >
            <input id="file" type="file" accept=".json" />
            <el-button class="select-button" type="success" @click="importJson"
              >上传</el-button
            >
          </el-container>
        </el-aside>
        <el-main>
          <div id="main"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/> -->
</template>

<script>
import * as echarts from "echarts";
import { ref } from "vue";
import FileSaver from "file-saver";
export default {
  name: "App",
  data() {
    return {
      graph: [],
      nodes: [],
      links: [],
      filtedLinks: [],
      filtedNodes: [],
      options: ref([]),
      history: [],
      chart: {},
      option: {},
      node1: {},
      node2: {},
      node1Id: ref(""),
      node2Id: ref(""),
      relTypeNow: ref(""),
      relValueNow: ref(""),
      insNameNow: ref(""),
      insValueNow: ref(""),
      fixNodes: false,
      nodeSwitch: 1,
      autoSave: true,
      relValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      relIdMap: [
        "Cause-Effect",
        "Instrument-Agency",
        "Message-Topic",
        "Product-Producer",
        "Member-Collection",
        "Entity-Origin",
        "Entity-Destination",
        "Component-Whole",
        "Content-Container",
      ],
      insIdMap: [
        "ROCK",
        "TECT",
        "ALTE",
        "PHYS",
        "CHEM",
        "CHRO",
        "MINE",
        "DEPO",
        "DEEP",
        "ELEM",
      ],
      insSizeFilter: [4, 78], // 1-373训练 1-2080测试
      relSizeFilter: [1, 12], // 1-10训练 1-277测试
      insSizeTable: [
        5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
        95, 100, 105, 110,
      ],
      relSizeTable: [],
      maxSize: 98,
      maxWidth: 10,
      relTypes: [
        {
          name: "Cause-Effect",
          color: "#626aef",
          use: false,
          id: 0,
        },
        {
          name: "Instrument-Agency",
          color: "#626aef",
          use: false,
          id: 1,
        },
        {
          name: "Message-Topic",
          color: "#626aef",
          use: false,
          id: 2,
        },
        {
          name: "Product-Producer",
          color: "#626aef",
          use: false,
          id: 3,
        },
        {
          name: "Member-Collection",
          color: "#626aef",
          use: true,
          id: 4,
        },
        {
          name: "Entity-Origin",
          color: "#626aef",
          use: false,
          id: 5,
        },
        {
          name: "Entity-Destination",
          color: "#626aef",
          use: true,
          id: 6,
        },
        {
          name: "Component-Whole",
          color: "#626aef",
          use: false,
          id: 7,
        },
        {
          name: "Content-Container",
          color: "#626aef",
          use: true,
          id: 8,
        },
      ],
      rel_color_map: {
        "Instrument-Agency": "#ea7070",
        "Cause-Effect": "#fdc4b6",
        "Product-Producer": "#e59572",
        "Content-Container": "#2694ab",
        "Entity-Origin": "#a8dba8",
        "Entity-Destination": "#f6d04d",
        "Component-Whole": "#d0d9e0",
        "Member-Collection": "#a696c8",
        "Message-Topic": "#004d61",
      },
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.initGraph();
  },
  methods: {
    initData() {
      var graph = require("./datas/echart_use_data_predict_last.json"); //首先获取初始文件
      this.graph = graph;
      this.nodes = graph.nodes;
      this.links = graph.links;
      this.maxSize = graph.maxSize;
      this.maxWidth = graph.maxWidth;

      // 添加改变大小和颜色的前端映射
      for (var node of this.nodes) {
        // 创建option
        var option = {
          value: node.id,
          label: node.name,
        };
        this.options.push(option);
      }

      this.options.sort(function (a, b) {
        return ("" + a.label).localeCompare(b.label);
      });
    },
    initGraph() {
      let main = echarts.init(document.getElementById("main"), "dark"); // 一键切换神色模式，有点给劲哦
      this.chart = main;
      this.option = {
        title: {
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {},
        legend: [
          {
            data: this.graph.categories.map(function (a) {
              return a.name;
            }),
          },
        ],
        animationDuration: 1500,
        animationEasingUpdate: "quinticInOut",
        series: [
          {
            labelLayout: {
              hideOverlap: true, // 标签重叠自动隐藏
            },
            selectedMode: true,
            draggable: true,
            edgeSymbol: ["circle", "arrow"], // 设置箭头
            edgeSymbolSize: [1, 6], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "force",
            force: {
              repulsion: 200,
              gravity: 0.1,
              edgeLength: [150, 300],
            },
            data: this.filtedNodes,
            links: this.filtedLinks,
            categories: this.graph.categories,
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
            },
            lineStyle: {
              // color: "source",
              curveness: 0.3,
            },
            select: {},
            emphasis: {
              focus: "adjacency",
              lineStyle: {
                width: 10,
              },
            },
          },
        ],
      };
      this.filter();
      main.setOption(this.option);
      var _this = this; // 让响应函数也能访问到vue
      main.on("click", { dataType: "node" }, function (data) {
        if (_this.nodeSwitch == 1) {
          _this.node1Id = data.data.id;
          _this.node1.name = data.data.name;
          _this.nodeSwitch = 2;
        } else {
          _this.node2Id = data.data.id;
          _this.node2.name = data.data.name;
          _this.nodeSwitch = 1;
        }
        _this.insValueNow = data.data.value;
        _this.insNameNow = data.data.name;
      });
      main.on("dblclick", { dataType: "node" }, function (data) {
        console.log(data);

        // 删除节点
        for (let i = 0; i < _this.nodes.length; i++) {
          if (_this.nodes[i].id == data.data.id) {
            _this.nodes.splice(i, 1);
            break;
          }
        }

        // 删除与之相连的关系
        for (let i = 0; i < _this.links.length; i++) {
          if (
            _this.links[i].source == data.data.id ||
            _this.links[i].target == data.data.id
          ) {
            _this.links.splice(i, 1);
          }
        }

        // 删除option选项
        for (let i = 0; i < _this.options.length; i++) {
          if (_this.options[i].value == data.data.id) {
            _this.options.splice(i, 1);
            break;
          }
        }
        _this.node1Id = null;
        _this.node1.name = null;
        _this.node2Id = null;
        _this.node2.name = null;

        // 保存历史记录
        let his = {
          type: "delIns",
          name: data.data.name,
          category: data.data.category,
          symbolSize: data.data.symbolSize,
          id: data.data.id,
          value: data.data.value,
        };
        _this.history.push(his);
        // 这里会接连调用dbclick边，不知道是bug还是细节
        _this.updateGraph();
      });
      main.on("mouseup", { dataType: "node" }, function () {
        _this.updateGraph();
      });
      main.on("dblclick", { dataType: "edge" }, function (data) {
        console.log("deleteRel", data);
        for (var i = 0; i < _this.links.length; i++) {
          if (data.dataType == "node") {
            console.log("发生传递");
            break;
          }
          if (data.data.source == _this.links[i].source) {
            if (data.data.target == _this.links[i].target) {
              if (data.data.value == _this.links[i].value) {
                let a = null;
                let b = null;
                for (var j = 0; j < _this.options.length; j++) {
                  if (_this.options[j].value == _this.links[i].source) {
                    a = _this.options[j].label;
                  }
                  if (_this.options[j].value == _this.links[i].target) {
                    b = _this.options[j].label;
                  }
                  if (a && b) {
                    break;
                  }
                }
                var ct = 0;
                for (j = 0; j < _this.nodes.length; j++) {
                  if (
                    _this.nodes[j].id == _this.links[i].source ||
                    _this.nodes[j].id == _this.links[i].target
                  ) {
                    console.log(_this.links[i].source, _this.links[i].target);
                    _this.nodes[j].symbolSize -= _this.links[i].lineStyle.width;
                    console.log(_this.nodes[j]);
                    ct += 1;
                  }
                  if (ct == 2) {
                    break;
                  }
                }
                let his = {
                  type: "delRel",
                  node1Name: a,
                  node2Name: b,
                  relType: _this.links[i].value,
                };
                _this.links.splice(i, 1);
                _this.history.push(his);
                break;
              }
            }
          }
        }
        if (_this.autoSave) {
          _this.saveData();
          
        }
        _this.updateGraph();
      });
    },
    updateGraph() {
      this.filter();
      let main = echarts.init(document.getElementById("main"), "dark"); // 不懂这样为社么更快，但是确实更快
      main.setOption(this.option);
    },
    filter() {
      this.filtedLinks.splice(0);
      this.filtedNodes.splice(0);

      for (let node of this.nodes) {
        // 是否显示节点标签
        node.label = {
          show: node.symbolSize > 13,
        };

        // 锁定解锁节点
        if (this.fixNodes) {
          node.fixed = true;
        } else {
          node.fixed = false;
        }

        let newNode = JSON.parse(JSON.stringify(node));

        // 过滤大小
        if (
          node.symbolSize < this.insSizeFilter[0] ||
          node.symbolSize > this.insSizeFilter[1]
        ) {
          if (
            node.symbolSize > this.maxSize &&
            this.insSizeFilter[1] == this.maxSize
          ) {
            if (node.symbolSize > 100) {
              newNode.symbolSize =
                2 + 40 * (2 + Math.log10(node.symbolSize / 100));
            }
            this.filtedNodes.push(newNode);
          }
          continue;
        }
        newNode.symbolSize = 2 + 40 * (2 + Math.log10(node.symbolSize / 100));
        this.filtedNodes.push(newNode);
      }
      for (let link of this.links) {
        link.lineStyle.color = this.rel_color_map[link.value];
        let newLink = JSON.parse(JSON.stringify(link));
        // 过滤选定连接
        if (
          link.lineStyle.width < this.relSizeFilter[0] ||
          link.lineStyle.width > this.relSizeFilter[1]
        ) {
          if (
            link.lineStyle.width > this.maxWidth &&
            this.relSizeFilter[1] == this.maxWidth
          ) {
            if (link.lineStyle.width > 30) {
              newLink.lineStyle.width = 35;
            }
            this.filtedLinks.push(newLink);
          }
          continue;
        }
        if (this.relTypes[this.relIdMap.indexOf(link.value)].use) {
          if (link.lineStyle.width > 30) {
            newLink.lineStyle.width = 35;
          }
          this.filtedLinks.push(newLink);
        }
      }
    },
    onChange(id) {
      if (this.relTypes[id].use == true) {
        this.relTypes[id].use = false;
      } else {
        this.relTypes[id].use = true;
      }
      this.updateGraph();
    },
    mergeNodes() {
      // 合并两个节点
      console.log(("merge", this.node1.name, this.node2.name));
      let his = {
        type: "merge",
        node1Name: this.node1.name,
        node2Name: this.node2.name,
        relType: "NA",
      };
      this.history.push(his);
      var map1 = new Map();
      for (let i = 0; i < this.links.length; i++) {
        if (this.links[i].source == this.node1Id) {
          this.links[i].source = this.node2Id;
        } else if (this.links[i].target == this.node1Id) {
          this.links[i].target = this.node2Id;
        }
        var label =
          this.links[i].source +
          "@@@" +
          this.links[i].target +
          "@@@" +
          this.links[i].value;
        if (map1.has(label)) {
          map1.set(label, map1.get(label) + this.links[i].lineStyle.width);
        } else {
          map1.set(label, this.links[i].lineStyle.width);
        }
      }
      this.links.splice(0);
      for (let temp of map1) {
        var a = temp[0].split("@@@");
        let s = a[0];
        let t = a[1];
        let c = a[2];
        let link = {
          source: s,
          target: t,
          value: c,
          lineStyle: {
            color: this.rel_color_map[c],
            width: temp[1],
          },
          label: {
            formatter: "{c}",
          },
        };
        this.links.push(link);
      }

      // 删除节点,更新节点大小
      var node1Size = 0;
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].id == this.node1Id) {
          node1Size = this.nodes[i].symbolSize;
          this.nodes.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].id == this.node2Id) {
          this.nodes[i].symbolSize = this.nodes[i].symbolSize + node1Size;
          break;
        }
      }
      // 删除option中对应节点
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.node1Id) {
          this.options.splice(i, 1);
          this.node1Id = null;
          this.node1.name = null;
          break;
        }
      }
      if (this.autoSave) {
        this.saveData();
      }
      this.updateGraph();
    },
    selectNode1(v) {
      this.node1Id = v;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.node1Id) {
          this.node1.name = this.options[i].label;
          break;
        }
      }
      console.log(this.node1.name)
      this.chart.dispatchAction({
        type: "highlight",
        name: this.node1.name,
      });
    },
    selectNode2(v) {
      this.node2Id = v;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.node2Id) {
          this.node2.name = this.options[i].label;
          break;
        }
      }
    },
    changeIns() {
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].name == this.insNameNow) {
          this.nodes[i].value = this.insValueNow;
          this.nodes[i].category = this.insIdMap.indexOf(this.insValueNow)
          break;
        }
      }
      let his = {
        name: this.insNameNow,
        value: this.insValueNow,
      };
      this.history.push(his);
      if (this.autoSave) {
        this.saveData();
      }
      this.updateGraph();
    },
    addRel() {
      let newLink = {
        source: this.node1Id,
        target: this.node2Id,
        value: this.relTypeNow,
        lineStyle: {
          color: this.rel_color_map[this.relTypeNow],
          width: this.relValueNow,
        },
        labe: {
          formatter: "{c}",
        },
      };
      this.links.push(newLink);
      var ct = 0;
      for (var i = 0; i < this.nodes.length; i++) {
        if (
          this.nodes[i].id == this.node1Id ||
          this.nodes[i].id == this.node2Id
        ) {
          this.nodes[i].symbolSize += this.relValueNow;
          ct += 1;
        }
        if (ct == 2) {
          break;
        }
      }
      let his = {
        type: "addRel",
        node1Name: this.node1.name,
        node2Name: this.node2.name,
        relType: this.relTypeNow,
        relValue: this.relValueNow,
      };
      this.history.push(his);
      if (this.autoSave) {
        console.log("addrel");
        this.saveData();
      }
      this.updateGraph();
    },
    holdFixChange(value) {
      this.fixNodes = value;
      this.updateGraph();
    },
    holdsaveChange(value) {
      this.autoSave = value;
    },
    holdInsFilter() {
      this.filter();
      this.updateGraph();
    },
    holdRelFilter() {
      this.filter();
      this.updateGraph();
    },
    saveData() {
      let save = {
        nodes: this.nodes,
        links: this.links,
        categories: this.graph.categories,
        history: this.history,
      };
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      var fileName =
        yy + "-" + mm + "-" + dd + "-" + hh + "-" + mf + "-" + ss + ".json";
      const data = JSON.stringify(save);
      const blob = new Blob([data], { type: "" });
      FileSaver.saveAs(blob, fileName);
    },
    importJson() {
      const file = document.getElementById("file").files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      const _this = this;
      reader.onload = function () {
        _this.graph = JSON.parse(this.result); //转成json对象
        _this.nodes = _this.graph.nodes;
        _this.links = _this.graph.links;
        _this.categories = _this.graph.categories;
        _this.history = _this.graph.history;
        _this.options.splice(0);
        for (var node of _this.nodes) {
          var option = {
            value: node.id,
            label: node.name,
          };
          _this.options.push(option);
        }
        _this.options.sort(function (a, b) {
          return ("" + a.label).localeCompare(b.label);
        });
        _this.updateGraph();
      };
    },
  },
};
</script>
<style>
html {
  height: 100%;
}
#file {
  outline-style: none;
  border-radius: 4px;
  padding: 8px;
  color: rgb(255, 255, 255);
  background-color: #67c23a;
  margin-left: 5px;
  margin-bottom: 5px;
}

#file-upload-button {
  color: white !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
#main {
  width: 100%;
  height: 100%;
}
#joinWord {
  font-size: 5px;
}
.slider-p {
  margin: 0px !important;
  height: 20px !important;
  text-align: center;
  line-height: 20px;
}
.slider-box {
  padding: 10px 50px;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 100px;
  padding-top: 10px;
}

.el-switch {
  margin-left: 10px;
}
.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  padding: 0px !important;
  text-align: center;
  line-height: 160px;
}

.aside-box {
  padding: 20px 15px 10px 15px;
}

.relTypeButton {
  margin-left: 5px !important;
  margin-bottom: 5px !important;
}

.select-box {
  width: 140px;
  margin-left: 5px;
  margin-bottom: 5px;
}
.button-label{
  width: 140px;
  margin-left: 5px !important;
  margin-bottom: 5px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left !important;
  padding: 12px 15px !important;
}
.iheader {
  color: white;
  background-color: #150f38ce;
}
.select-button {
  margin-left: 5px !important;
  margin-bottom: 5px !important;
}

body {
  margin: 0px;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
