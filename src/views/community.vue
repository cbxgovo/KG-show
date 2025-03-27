<template>
    
    <el-container style="height: 100%">
        <el-aside width="800px" height="1200px">
            <el-table
                :data="tableData"
                height="100%"
                border
                style="width: 100%">
                <el-table-column
                prop="name"
                label="社区名称"
                width="80">
                </el-table-column>

                <el-table-column
                prop="node_num"
                label="节点数"
                width="70">
                </el-table-column>

                <el-table-column
                prop="edge_count"
                label="边数"
                width="70">
                </el-table-column>

                <el-table-column
                prop="category"
                label="社区类型"
                width="140">
                </el-table-column>

                <el-table-column
                prop="max_node"
                label="最大节点"
                width="135">
                </el-table-column>

                <el-table-column
                prop="degree_centrality_center_node"
                label="基于度中心性的中心节点"
                width="135">
                </el-table-column>
                
                <el-table-column
                prop="intermediate_centrality_center_node"
                label="基于介数中心性的中心节点"
                width="135">
                </el-table-column>

                <el-table-column
                prop="proximity_centrality_center_node"
                label="基于接近度中心性的中心节点"
                width="135">
                </el-table-column>

                <el-table-column
                prop="feature_vector_center_node"
                label="基于特征向量中心性的中心节点"
                width="135">
                </el-table-column>

                <el-table-column
                prop="density"
                label="社区内部密度"
                width="90">
                </el-table-column>

                <el-table-column
                prop="num_connected_components"
                label="连通分量数量"
                width="90">
                </el-table-column>

                <el-table-column
                prop="avg_degree"
                label="内部节点平均度数"
                width="90">
                </el-table-column>
            </el-table>
            <el-table
                :data="similarityTableData"
                height="100%"
                border
                style="width: 100%">
                <el-table-column
                prop="similarity"
                label="相似度"
                width="80">
                </el-table-column>
                <el-table-column v-for="(column,index) in dynamicColumns" :key="index" :prop="column.prop" :label="column.label" width="100">
                </el-table-column>
            </el-table>
            
        </el-aside>

        <el-main>
            <div id="myecharts" style="height:100%;width:100%;"></div>
        </el-main>
    </el-container>

        <el-button id="export_Community_Info" type="success" @click="export_Community_Info">导出社区信息
        </el-button>
        
                    <el-button id="export_Community_Relationship" type="success" @click="export_Community_Relationship_Matrix">导出社区相似度矩阵
        </el-button>
        



</template>
<script>
import * as echarts from "echarts";
import $ from 'jquery'
import * as XLSX from "xlsx";
import {
  sheet2blob,
  workbook2blob,
  s2ab,
  openDownloadDialog,
} from "./../Getexcel.js";

export default {
    data() {
      return {
        tableData: [{
          category: 'ELEM',
          name: '社区1',
          max_node: 'Porphyry Cu deposit',
          node_num: 10,
        }, {
          category: 'CHRO',
          name: '社区2',
          max_node: 'Au Deposite',
          node_num: 10,
        }, {
          category: 'MEMO',
          name: '社区2',
          max_node: 'Ag Deposite',
          node_num: 10,
        },],
        similarityTableData: [],
        dynamicColumns: [],
        isFrash: true,
        symbolOptions: ["circle", "rect", "triangle", "diamond"],
      }
    },
    mounted() {
        this.initGraph();
    },
    created() {
      if(this.isFrash) {
        var myoption = JSON.parse(localStorage.getItem("msg"))
        // 在 created 钩子中生成动态列的配置
        for (let i in myoption.community_info) { 
            var column = {prop: 'community'+ (parseInt(i)+1), label: '社区'+ (parseInt(i)+1)}
            this.dynamicColumns.push(column)
        }
        this.isFrash = false
      }
    },
    methods: {
        initGraph() {
            var myChart = echarts.init(document.getElementById('myecharts'));

            var myoption = JSON.parse(localStorage.getItem("msg"))

            myChart.setOption(myoption);
            this.tableData = []           
            var category = [
	            {
	                "name": "ROCK",
	                "symbol": "circle"
	            },
	            {
	                "name": "TECT",
	                "symbol": "rect"
	            },
	            {
	                "name": "ALTE",
	                "symbol": "triangle"
	            },
	            {
	                "name": "PHYS",
	                "symbol": "diamond"
	            },
	            {
	                "name": "CHEM",
	                "symbol": "circle"
	            },
	            {
	                "name": "CHRO",
	                "symbol": "rect"
	            },
	            {
	                "name": "MINE",
	                "symbol": "triangle"
	            },
	            {
	                "name": "DEPO",
	                "symbol": "diamond"
	            },
	            {
	                "name": "DEEP",
	                "symbol": "circle"
	            },
	            {
	                "name": "ELEM",
	                "symbol": "rect"
	            },
	            {
	                "name": "MEMO",
	                "symbol": "triangle"
	            },
	            {
	                "name": "DATA",
	                "symbol": "diamond"
	            }
	          ]
            for ( let i in myoption.community_info) {
                var node_types = "";
                for (let j in myoption.community_info[i].node_types) {
                    node_types += category[parseInt(j)].name;
                    node_types += ","
                }
                var temp = {
                    name:"社区"+(parseInt(i) + 1),
                    category: node_types ,
                    max_node:myoption.community_info[i].max_node,
                    node_num:myoption.community_info[i].node_count,
                    edge_count:myoption.community_info[i].edge_count,

                    degree_centrality_center_node:myoption.community_info[i].degree_centrality_center_node,
                    intermediate_centrality_center_node:myoption.community_info[i].intermediate_centrality_center_node,
                    proximity_centrality_center_node:myoption.community_info[i].proximity_centrality_center_node,
                    feature_vector_center_node:myoption.community_info[i].feature_vector_center_node,

                    density:myoption.community_info[i].density,
                    num_connected_components:myoption.community_info[i].num_connected_components,
                    avg_degree:myoption.community_info[i].avg_degree,
                }
                this.tableData.push(temp)
            }
            for (let i in myoption.community_info) {
                //myoption.community_info[i].community_similarity.unshift("社区" + (parseInt(i)+1))
                myoption.community_info[i].community_similarity['similarity'] = '社区' + (parseInt(i)+1)
                this.similarityTableData.push(myoption.community_info[i].community_similarity)
            }
        },
        export_Community_Info() {
            var workbook1 = {
              SheetNames: ["社区信息"],
              Sheets: {},
            };
            var aoa = [];             
            var head = ["社区名称", "节点数", "边数", "社区类型", "最大节点", "基于度中心性的中心节点", "基于介数中心性的中心节点", "基于接近度中心性的中心节点", "基于特征向量中心性的中心节点", "社区内部密度", "连通分量数量", "内部节点平均度数"];
            aoa.push(head)
            var myChart = echarts.init(document.getElementById('myecharts'));
            var myoption = JSON.parse(localStorage.getItem("msg"))
            myChart.setOption(myoption);
            var category = [
	            {
	                "name": "ROCK",
	                "symbol": "circle"
	            },
	            {
	                "name": "TECT",
	                "symbol": "rect"
	            },
	            {
	                "name": "ALTE",
	                "symbol": "triangle"
	            },
	            {
	                "name": "PHYS",
	                "symbol": "diamond"
	            },
	            {
	                "name": "CHEM",
	                "symbol": "circle"
	            },
	            {
	                "name": "CHRO",
	                "symbol": "rect"
	            },
	            {
	                "name": "MINE",
	                "symbol": "triangle"
	            },
	            {
	                "name": "DEPO",
	                "symbol": "diamond"
	            },
	            {
	                "name": "DEEP",
	                "symbol": "circle"
	            },
	            {
	                "name": "ELEM",
	                "symbol": "rect"
	            },
	            {
	                "name": "MEMO",
	                "symbol": "triangle"
	            },
	            {
	                "name": "DATA",
	                "symbol": "diamond"
	            }
	          ]
            for ( let i in myoption.community_info) {
                var node_types = "";
                for (let j in myoption.community_info[i].node_types) {
                    node_types += category[parseInt(j)].name;
                    node_types += ","
                }
                var temp = [
                    "社区"+(parseInt(i) + 1),
                    myoption.community_info[i].node_count,
                    myoption.community_info[i].edge_count,
                    node_types,
                    myoption.community_info[i].max_node,
                    myoption.community_info[i].degree_centrality_center_node,
                    myoption.community_info[i].intermediate_centrality_center_node,
                    myoption.community_info[i].proximity_centrality_center_node,
                    myoption.community_info[i].feature_vector_center_node,
                    myoption.community_info[i].density,
                    myoption.community_info[i].num_connected_components,
                    myoption.community_info[i].avg_degree,
                ]
                aoa.push(temp)
            }
            console.log(aoa)
            var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
            workbook1.Sheets["社区信息"] = sheet_i;
            openDownloadDialog(sheet2blob(workbook1), "社区信息图.xlsx");
        },
        export_Community_Relationship_Matrix() {
            var myoption = JSON.parse(localStorage.getItem("msg"))

            var workbook1 = {
              SheetNames: ["社区关系"],
              Sheets: {},
            };
            var aoa = [];             
            var head = ['相似度'];
            for (let i in myoption.community_info) {
                head.push('社区' + (parseInt(i)+1))
            }
            aoa.push(head)

            for (let i in myoption.community_info) {
                // 提取键到数组中并排序
                var sortedKeys = Object.keys(myoption.community_info[i].community_similarity).sort(function(a, b) {
                    var indexA = parseInt(a.replace('community', ''));
                    var indexB = parseInt(b.replace('community', ''));
                    return indexA - indexB;
                });
                // 创建一个新的有序对象
                var sortedObj = {};
                for (var j = 0; j < sortedKeys.length; j++) {
                  var key = sortedKeys[j];
                  sortedObj[key] = myoption.community_info[i].community_similarity[key];
                }
                console.log(sortedObj)
                var tempColumn = Object.values(sortedObj)
                tempColumn.unshift("社区"+(parseInt(i) + 1)) 
                console.log(tempColumn)
                aoa.push(tempColumn)
            }

            var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
            workbook1.Sheets["社区关系"] = sheet_i;
            openDownloadDialog(sheet2blob(workbook1), "社区关系矩阵图.xlsx");
        },
    }
}
</script>
<style>
html {
    height: 100%;
}

body {
    margin: 10px;
    height: 80%;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}

#export_Community_Info {
    margin-top: 20px;
    margin-left: -150px;
}

#export_Community_Relationship {
  margin-left: 50px;
}

#relationship_Network_Graph {
  margin-left: 650px;
}

#relationship_Heatmap {
  margin-left: 50px;
}
</style>