<template>
    
    <el-container style="height: 100%">
        <el-aside width="800px" height="1200px">
            <el-table
                :data="strengthTableData"
                height="100%"
                border
                style="width: 100%">
                <el-table-column
                prop="strength"
                label="边数"
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

    <el-button id="export_Community_Info" type="success" @click="export_Community_Strength_Matrix">导出社区强度矩阵</el-button>
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
        strengthTableData: [],
        dynamicColumns: [],
        isFrash: true,
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
            // const hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
            // const days = ['Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
            // // prettier-ignore
            // const data = [[0, 0, 5], [0, 1, 1], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 2], [0, 12, 4], [0, 13, 1], [0, 14, 1], [0, 15, 3], [0, 16, 4], [0, 17, 6], [0, 18, 4], [0, 19, 4], [0, 20, 3], [0, 21, 3], [0, 22, 2], [0, 23, 5], [1, 0, 7], [1, 1, 0], [1, 2, 0], [1, 3, 0], [1, 4, 0], [1, 5, 0], [1, 6, 0], [1, 7, 0], [1, 8, 0], [1, 9, 0], [1, 10, 5], [1, 11, 2], [1, 12, 2], [1, 13, 6], [1, 14, 9], [1, 15, 11], [1, 16, 6], [1, 17, 7], [1, 18, 8], [1, 19, 12], [1, 20, 5], [1, 21, 5], [1, 22, 7], [1, 23, 2], [2, 0, 1], [2, 1, 1], [2, 2, 0], [2, 3, 0], [2, 4, 0], [2, 5, 0], [2, 6, 0], [2, 7, 0], [2, 8, 0], [2, 9, 0], [2, 10, 3], [2, 11, 2], [2, 12, 1], [2, 13, 9], [2, 14, 8], [2, 15, 10], [2, 16, 6], [2, 17, 5], [2, 18, 5], [2, 19, 5], [2, 20, 7], [2, 21, 4], [2, 22, 2], [2, 23, 4], [3, 0, 7], [3, 1, 3], [3, 2, 0], [3, 3, 0], [3, 4, 0], [3, 5, 0], [3, 6, 0], [3, 7, 0], [3, 8, 1], [3, 9, 0], [3, 10, 5], [3, 11, 4], [3, 12, 7], [3, 13, 14], [3, 14, 13], [3, 15, 12], [3, 16, 9], [3, 17, 5], [3, 18, 5], [3, 19, 10], [3, 20, 6], [3, 21, 4], [3, 22, 4], [3, 23, 1], [4, 0, 1], [4, 1, 3], [4, 2, 0], [4, 3, 0], [4, 4, 0], [4, 5, 1], [4, 6, 0], [4, 7, 0], [4, 8, 0], [4, 9, 2], [4, 10, 4], [4, 11, 4], [4, 12, 2], [4, 13, 4], [4, 14, 4], [4, 15, 14], [4, 16, 12], [4, 17, 1], [4, 18, 8], [4, 19, 5], [4, 20, 3], [4, 21, 7], [4, 22, 3], [4, 23, 0], [5, 0, 2], [5, 1, 1], [5, 2, 0], [5, 3, 3], [5, 4, 0], [5, 5, 0], [5, 6, 0], [5, 7, 0], [5, 8, 2], [5, 9, 0], [5, 10, 4], [5, 11, 1], [5, 12, 5], [5, 13, 10], [5, 14, 5], [5, 15, 7], [5, 16, 11], [5, 17, 6], [5, 18, 0], [5, 19, 5], [5, 20, 3], [5, 21, 4], [5, 22, 2], [5, 23, 0], [6, 0, 1], [6, 1, 0], [6, 2, 0], [6, 3, 0], [6, 4, 0], [6, 5, 0], [6, 6, 0], [6, 7, 0], [6, 8, 0], [6, 9, 0], [6, 10, 1], [6, 11, 0], [6, 12, 2], [6, 13, 1], [6, 14, 3], [6, 15, 4], [6, 16, 0], [6, 17, 0], [6, 18, 0], [6, 19, 0], [6, 20, 1], [6, 21, 2], [6, 22, 2], [6, 23, 6]].map(function (item) { return [item[1], item[0], item[2] || '-']; });
            // var  option = { tooltip: { position: 'top' }, grid: { height: '100%', width: '50%', top: '50%' }, xAxis: { type: 'category', data: hours, splitArea: { show: true } }, yAxis: { type: 'category', data: days, splitArea: { show: true } }, visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '15%' }, series: [{ name: 'Punch Card', type: 'heatmap', data: data, label: { show: true }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' } } }] };
            var myChart = echarts.init(document.getElementById('myecharts'));

            // console.log(this.$route.parathis)
            // console.log(option)
            var myoption = JSON.parse(localStorage.getItem("msg"))
            myoption['tooltip'] = {
                  formatter: function (params) {
                    var result = ''
                    var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                    var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                    if (params.dataType == 'node') {
                      result += dotHtml + params.data.name + "</br>" + dotHtml2 + '社区大小：' + params.data.realSymbolSize
                    }
                    if (params.dataType == 'edge') {
                      result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系频率：' + params.data.width
                    }
                    return result
                  }
                },
            myChart.setOption(myoption);
            for (let i in myoption.community_info) {
                myoption.community_info[i].community_strength['strength'] = '社区' + (parseInt(i)+1)
                this.strengthTableData.push(myoption.community_info[i].community_strength)
            }
        },
        export_Community_Strength_Matrix() {
            var myoption = JSON.parse(localStorage.getItem("msg"))

            var workbook1 = {
              SheetNames: ["社区强度"],
              Sheets: {},
            };
            var aoa = [];             
            var head = ['边数'];
            for (let i in myoption.community_info) {
                head.push('社区' + (parseInt(i)+1))
            }
            aoa.push(head)

            for (let i in myoption.community_info) {
                // 提取键到数组中并排序
                var sortedKeys = Object.keys(myoption.community_info[i].community_strength).sort(function(a, b) {
                    var indexA = parseInt(a.replace('community', ''));
                    var indexB = parseInt(b.replace('community', ''));
                    return indexA - indexB;
                });
                // 创建一个新的有序对象
                var sortedObj = {};
                for (var j = 0; j < sortedKeys.length; j++) {
                  var key = sortedKeys[j];
                  sortedObj[key] = myoption.community_info[i].community_strength[key];
                }
                var tempColumn = Object.values(sortedObj)
                tempColumn.unshift("社区"+(parseInt(i) + 1)) 
                aoa.push(tempColumn)
            }
            console.log(aoa)
            var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
            workbook1.Sheets["社区强度"] = sheet_i;
            openDownloadDialog(sheet2blob(workbook1), "社区强度矩阵图.xlsx");
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