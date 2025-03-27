<template>
  <div class="common-layout" style="height: 100%">
    <el-container style="height: 100%">
      <el-header class="iheader">斑岩铜矿知识图谱</el-header>
      <el-container>
        <el-aside width="400px">
          <el-scrollbar style="height: 1003px">
            <el-collapse v-model="activeNames" @change="handleChange" accordion>
              <el-collapse-item title="&nbsp&nbsp&nbsp数据选择" name="1">
                <el-row>
                    <el-select v-model="currentDataPattern" filterable placeholder="标记数据"  class="datamode-select-box" >
                      <el-option v-for="item in dataPattern" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <el-button class="datamode-select-button" type="success" @click="databaseChange">确定
                   </el-button>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp筛选模式" name="2">
                <el-row>
                  <!-- :style="'background:' + item.color" -->
                  <el-check-tag class="relTypeButton" size="mini" v-for="item in relTypes" :key="item.name"
                    @change="onChange(item.id)" :checked="item.use">{{ item.name }}
                  </el-check-tag>
                </el-row>
                <el-row>
                  <!-- :style="'background:' + item.color" -->
                  <el-check-tag class="relTypeButton" size="mini" v-for="item in insTypes" :key="item.name"
                    @change="onChange(item.id)" :checked="item.use">{{ item.name }}
                  </el-check-tag>
                </el-row>

                <el-form>
                  <el-scrollbar style="height: 150px" class="filter-scrollbar">
                    <el-row>
                      <el-col :span="8" class="slider-row-left">
                        <el-input-number v-model="insSizeFilter[0]" :min="1" :max="maxNodeValue" label="描述文字"
                          :controls="false"></el-input-number>
                      </el-col>
                      <el-col :span="8">
                        <div class="slider-p" style="font-size: 11px ">节点大小</div>
                        <el-slider v-model="insSizeFilter" range :key="componentKey" :max="maxNodeValue" :no-swapping="true">
                        </el-slider>
                      </el-col>
                      <el-col :span="8" class="slider-row-right">
                        <el-input-number v-model="insSizeFilter[1]" :min="5" :max="maxNodeValue" label="描述文字" size="large"
                        :controls="false"></el-input-number>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="8" class="slider-row-left">
                        <el-input-number v-model="relSizeFilter[0]" :min="1" :max="maxEdgeValue" label="描述文字"
                        :controls="false"></el-input-number>
                      </el-col>
                      <el-col :span="8">
                        <div class="slider-p" style="font-size: 11px ">关系强弱</div>
                        <el-slider v-model="relSizeFilter" range :key="componentKey" :max="maxEdgeValue" :no-swapping="true">
                        </el-slider>
                      </el-col>
                      <el-col :span="8" class="slider-row-right">
                        <el-input-number v-model="relSizeFilter[1]" :min="1" :max="maxEdgeValue" label="描述文字" size="large"
                        :controls="false"></el-input-number>
                      </el-col>
                    </el-row>

                    <el-row v-for="item in categories" :key="item.category">
                      <el-col :span="8" class="slider-row-left">
                        <el-input-number v-model="item.sliderRange[0]" :min="1" :max="item.maxpoint" label="描述文字"
                        :controls="false"></el-input-number>
                      </el-col>
                      <el-col :span="8">
                        <div class="slider-p" style="font-size: 11px ">{{ item.category }}</div>
                        <el-slider v-model="item.sliderRange" range :key="componentKey" :max="item.maxpoint"> </el-slider>
                      </el-col>
                      <el-col :span="8" class="slider-row-right">
                        <el-input-number v-model="item.sliderRange[1]" :min="1" :max="item.maxpoint" label="描述文字"
                          size="large" :controls="false"></el-input-number>
                      </el-col>
                    </el-row>

                    <el-row>
                        <el-button class="select-button" id="submitfilter" type="success" @click="submitFilter">提交筛选
                        </el-button>
                    </el-row>
                  </el-scrollbar>
                </el-form>

                <el-button class="select-button" id="showdistributionmap" type="success"
                  @click="requestTotalNodeNum">展示节点分布图
                </el-button>
                <el-button class="select-button" id="showdistributionmaplogarithmic" type="success"
                  @click="ShowDistributionMapLogarithmic">展示节点分布图（对数坐标）
                </el-button>
                <div class="custom-timeout-div">输入超时时间: </div>
                <el-input-number v-model="this.customTimeOut" :min="1" :max="1000000" label="超时时间"
                  controls-position="right" class="custom-timeout-input"></el-input-number>
                <el-button class="custom-timeout-button" type="success" @click="setTimeOut">
                  设置</el-button>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp构建模式" name="3">
                <el-container class="aside-box">
                  <el-switch v-model="fixNodes" active-text="锁定布局" inactive-text="流动布局" @change="holdFixChange">
                  </el-switch>
                  <el-switch v-model="autoSave" active-text="自动保存" inactive-text="手动保存" @change="holdsaveChange">
                  </el-switch>
                </el-container>
                <el-container class="aside-box">
                  <el-switch v-model="queryMode" active-text="推理模式" inactive-text="构建模式" @change="holdModeChange">
                  </el-switch>
                </el-container>
                <el-container class="aside-box">
                  <el-row>
                    <el-select v-model="node1Id" filterable placeholder="实体1" @change="selectNode1" class="select-box">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="node2Id" filterable placeholder="实体2" @change="selectNode2" class="select-box">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="select-button-1" type="success" @click="mergeNodes" :disabled="queryMode">合并
                    </el-button>
                    <el-select v-model="relTypeNow" filterable placeholder="关系类型" class="select-box"
                      :disabled="queryMode">
                      <el-option v-for="item in relIdMap" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <el-select v-model="relValueNow" filterable placeholder="关系权重" class="select-box"
                      :disabled="queryMode">
                      <el-option v-for="item in relValues" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <el-button class="select-button-1" type="success" @click="addRel" :disabled="queryMode">新建</el-button>
                    <el-button class="button-label" type="primary" :disabled="queryMode" plain>
                      {{ insNameNow }}
                    </el-button>
                    <el-select v-model="insValueNow" filterable placeholder="实体类型" class="select-box"
                      :disabled="queryMode">
                      <el-option v-for="item in insIdMap" :key="item" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <el-button class="select-button-1" type="success" @click="changeIns" :disabled="queryMode">修改
                    </el-button>
                    <el-button class="button-source" type="primary" :disabled="queryMode" plain>
                      {{ customEdgeSource }}
                    </el-button>
                    <div class="div-arrow">—></div>
                    <el-button class="button-target" type="primary" :disabled="queryMode" plain>
                      {{ customEdgeTarget }}
                    </el-button>
                    <div class="div-widthFactor">单线宽系数：</div>
                    <el-select v-model="edgeWidthFactorSingle" filterable placeholder="线宽系数"
                      class="sel-widthfactor-single" :disabled="queryMode">
                      <el-option v-for="item in edgeWidthFactorOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-widthfactor-single" type="success" @click="changeEdgeWidthSingle"
                      :disabled="queryMode">修改
                    </el-button>
                    <div class="div-widthFactor">总线宽系数：</div>
                    <el-select v-model="edgeWidthFactorWhole" filterable placeholder="线宽系数" class="sel-widthFactor"
                      :disabled="queryMode">
                      <el-option v-for="item in edgeWidthFactorOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-widthFactor" type="success" @click="changeEdgeWidthWhole"
                      :disabled="queryMode">修改
                    </el-button>
                    <div class="div-fontsize">字体大小：</div>
                    <el-select v-model="customFontSize" filterable placeholder="字体大小" class="sel-fontsize"
                      :disabled="queryMode">
                      <el-option v-for="item in fontSizeOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-fontsize" type="success" @click="changeCustomFontSize"
                      :disabled="queryMode">修改
                    </el-button>
                  </el-row>
                </el-container>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp全局推理" name="4">
                <div class="query">
                  <el-row>
                    <el-switch v-model="sortMode" active-text="按名称排序" inactive-text="按频率排序" @change="sortModeChange">
                    </el-switch>
                  </el-row>
                  <el-row>
                    <div class="mark-text">节点 A:</div>
                    <el-select ref="sel1" v-model="node1Id" filterable remote :remote-method="remoteMethod"
                      :loading="remoteLoading" placeholder="实体1" @change="remoteSelectNode1" class="select-box"
                      id="node1">
                      <el-option v-for="item in remoteOptions" :key="item.value" :label="item.label" :value="item.value"
                        :fre="item.fre">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fre }}</span>
                      </el-option>
                    </el-select>
                    <el-button class="search-button-1" type="success" @click="getDataByButton1">
                      搜索</el-button>
                    <div class="mark-text">B:</div>
                    <el-select ref="sel2" v-model="node2Id" filterable remote :remote-method="remoteMethod"
                      :loading="remoteLoading" placeholder="实体2" @change="remoteSelectNode2" class="select-box"
                      id="node2">
                      <el-option v-for="item in remoteOptions" :key="item.value" :label="item.label" :fre="item.fre"
                        :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fre }}</span>
                      </el-option>
                    </el-select>
                    <el-button class="search-button-2" type="success" @click="getDataByButton2">
                      搜索</el-button>
                    <div></div>
                    <div class="mark-text">节点 C:</div>
                    <el-select ref="sel3" v-model="node3Id" filterable remote :remote-method="remoteMethod"
                      :loading="remoteLoading" placeholder="实体3" @change="remoteSelectNode3" class="select-box"
                      id="node3">
                      <el-option v-for="item in remoteOptions" :key="item.value" :label="item.label" :fre="item.fre"
                        :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.fre }}</span>
                      </el-option>
                    </el-select>
                    <el-button class="search-button-3" type="success" @click="getDataByButton3">
                      搜索</el-button>
                    <div class="mark-text">N:</div>
                    <el-select v-model="limit" filterable placeholder="限制条数" @change="selectLimit" class="select-box">
                      <el-option v-for="item in limitOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="mark-text">区间 L:</div>
                    <el-select v-model="jumpFrom" filterable placeholder="跳" @change="selectJumpFrom" class="select-box">
                      <el-option v-for="item in jumpOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="mark-text">R:</div>
                    <el-select v-model="jumpTo" filterable placeholder="跳2" @change="selectJumpTo" class="select-box">
                      <el-option v-for="item in jumpOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-row>
                  <el-row>
                    <el-button class="select-button" type="success" @click="queryAtoB" :disabled="!queryMode">A和B在L-R 跳
                      的 n 条 路 径</el-button>
                      <el-button class="select-button" type="success" @click="queryAtoBNoCircle" :disabled="!queryMode">
                      A和B在L-R跳的n条无环路径</el-button>
 

                    <el-button class="select-button" type="success" @click="queryAtoBShortest" :disabled="!queryMode">
                      A和B在L-R跳的 最 短 路 径</el-button>
                    <el-button class="select-button" type="success" @click="queryAtoBLongest" :disabled="!queryMode">
                      A和B在L-R 跳的 最 长 路 径</el-button>
                    <el-button class="select-button" type="success" @click="queryAtoBPassC" :disabled="!queryMode">
                      A和B过C在L-R跳的n条路径</el-button>
                      <el-button class="select-button" type="success" @click="queryMaxWeightPath" :disabled="!queryMode">
                      A和B在L-R跳的最大 权路径</el-button>

                    <el-input class="select-button" v-model="inputSQLStatements" placeholder="输入任意sql语句"
                      @change="queryInputSQL" :disabled="!queryMode" />
                  </el-row>

                  <el-row>
                    <el-button class="button-result-source" type="primary" :disabled="!queryMode" plain>
                      {{ resultEdgeSource }}
                    </el-button>
                    <div class="div-arrow">—></div>
                    <el-button class="button-target" type="primary" :disabled="!queryMode" plain>
                      {{ resultEdgeTarget }}
                    </el-button>
                    <div class="div-widthFactor">单线宽系数：</div>
                    <el-select v-model="resultEdgeWidthFactorSingle" filterable placeholder="线宽系数"
                      class="sel-widthfactor-single" :disabled="!queryMode">
                      <el-option v-for="item in edgeWidthFactorOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-widthfactor-single" type="success" @click="changeResultEdgeWidthSingle"
                      :disabled="!queryMode">修改
                    </el-button>
                    <div class="div-widthFactor">总线宽系数：</div>
                    <el-select v-model="resultEdgeWidthFactorWhole" filterable placeholder="线宽系数" class="sel-widthFactor"
                      :disabled="!queryMode">
                      <el-option v-for="item in edgeWidthFactorOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-widthFactor" type="success" @click="changeResultEdgeWidthWhole"
                      :disabled="!queryMode">修改
                    </el-button>
                    <div class="div-fontsize">字体大小：</div>
                    <el-select v-model="resultFontSize" filterable placeholder="字体大小" class="sel-fontsize"
                      :disabled="!queryMode">
                      <el-option v-for="item in fontSizeOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="button-fontsize" type="success" @click="changeResultFontSize"
                      :disabled="!queryMode">修改
                    </el-button>
                  </el-row>
                </div>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp子图推理" name="5">
                <div class="query">
                  <el-row>
                    <div class="mark-text">节点 A:</div>
                    <el-select v-model="subGnode1Id" filterable placeholder="实体1" @change="selectNode1"
                      class="select-box">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="mark-text">B:</div>
                    <el-select v-model="subGnode2Id" filterable placeholder="实体2" @change="selectNode2"
                      class="select-box">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>

                    
                    <!--
                      <div class="mark-text">节点 C:</div>
                      <el-select v-model="subGnode3Id" filterable placeholder="实体3" @change="selectNode3"
                      class="select-box">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    -->
                    <div class="mark-text">区间 L:</div>
                    <el-select v-model="jumpFrom" filterable placeholder="跳" @change="selectJumpFrom" class="select-box">
                      <el-option v-for="item in jumpOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="mark-text">R:</div>
                    <el-select v-model="jumpTo" filterable placeholder="跳2" @change="selectJumpTo" class="select-box">
                      <el-option v-for="item in jumpOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <div class="mark-text">N:</div>
                    <el-select v-model="limit" filterable placeholder="限制条数" @change="selectLimit" class="subgraph-select-box">
                      <el-option v-for="item in limitOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <el-button class="subgraph-button" type="success" @click="submitSubGraph">查询子图</el-button>
                  </el-row>
                </div>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp文件保存" name="6">
                <el-container class="aside-box">
                  <el-button class="select-button" type="success" @click="saveData">保存</el-button>

                  <!--<input id="file" type="file" accept=".json" :disabled="queryMode" />
                  <el-button class="select-button" type="success" @click="importJson"
                    :disabled="queryMode">上传</el-button>-->
                  <el-button type="success" class="select-button" @click="saveExcel">下载表格</el-button>
                </el-container>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp PCA处理" name="7">
                <el-select v-model="Matrix_type" placeholder="矩阵类型" class="select-box" @change="selectMatrix"
                  id="matrix_select">
                  <el-option v-for="item in Matrix_types" :key="item" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button class="select-button" id="showheapmap" type="success" @click="ShowHotHeap">展示热力图
                </el-button>
                <el-select v-model="MyPCA_D_Value" placeholder="PCA维数" class="select-box" @change="selectPCADima"
                  id="PCA_select">
                  <el-option v-for="item in MyPCA_D" :key="item" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-button class="select-button" id="search_PCA" type="success" @click="showOneDimensionPCA">查询PCA
                </el-button>
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp 社区发现" name="8">
                  <el-scrollbar style="height: 150px" class="filter-scrollbar">
                    <el-row>
                      <el-col :span="8" class="slider-row-left">
                        <el-input-number v-model="communityInsSizeFilter[0]" :min="1" :max="maxNodeValue" label="描述文字"
                          :controls="false"></el-input-number>
                      </el-col>
                      <el-col :span="8">
                        <div class="slider-p" style="font-size: 11px ">节点大小</div>
                        <el-slider v-model="communityInsSizeFilter" range :key="componentKey" :max="maxNodeValue">
                        </el-slider>
                      </el-col>
                      <el-col :span="8" class="slider-row-right">
                        <el-input-number v-model="communityInsSizeFilter[1]" :min="5" :max="maxNodeValue" label="描述文字" size="large"
                        :controls="false"></el-input-number>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="8" class="slider-row-left">
                        <el-input-number v-model="communityRelSizeFilter[0]" :min="1" :max="maxEdgeValue" label="描述文字"
                        :controls="false"></el-input-number>
                      </el-col>
                      <el-col :span="8">
                        <div class="slider-p" style="font-size: 11px ">关系强弱</div>
                        <el-slider v-model="communityRelSizeFilter" range :key="componentKey" :max="maxEdgeValue">
                        </el-slider>
                      </el-col>
                      <el-col :span="8" class="slider-row-right">
                        <el-input-number v-model="communityRelSizeFilter[1]" :min="1" :max="maxEdgeValue" label="描述文字" size="large"
                        :controls="false"></el-input-number>
                      </el-col>
                    </el-row>
                  </el-scrollbar>


                <el-select v-model="communityDiscoveryAlgorithm" filterable placeholder="Louvain算法" @change="algorithmChange" class="algorithm-select-box">
                      <el-option v-for="item in algorithmOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                </el-select>

                <el-button class="algorithm-select-button" id="community_Dection" type="success" @click="community_Dection">社区发现
                </el-button>

                <el-button class="select-button" id="export_Community_Dection" type="success"
                  @click="export_Community_Dection">导出社区
                </el-button>

                <el-button id="relationship_Network_Graph" type="success" @click="show_Relationship_Network_Graph">社区关系网络图
                </el-button>

                <el-button id="relationship_Heatmap" type="success" @click="show_Relationship_Heatmap">社区关系热力图
                </el-button>
               
              </el-collapse-item>
              <el-collapse-item title="&nbsp&nbsp&nbsp自定义形状" name="9">
                <div class="query">
                  <el-row>
                    <div class="symbol-mark-text">ROCK</div>
                    <el-select v-model="ROCKShape" filterable placeholder="ROCK" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">TECT</div>
                    <el-select v-model="TECTShape" filterable placeholder="TECT" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">ALTE </div>
                    <el-select v-model="ALTEShape" filterable placeholder="ALTE" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">PHYS</div>
                    <el-select v-model="PHYSShape" filterable placeholder="PHYS" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">CHEM</div>
                    <el-select v-model="CHEMShape" filterable placeholder="CHEM" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">CHRO</div>
                    <el-select v-model="CHROShape" filterable placeholder="CHRO" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">MINE </div>
                    <el-select v-model="MINEShape" filterable placeholder="MINE" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">DEPO</div>
                    <el-select v-model="DEPOShape" filterable placeholder="DEPO" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">DEEP</div>
                    <el-select v-model="DEEPShape" filterable placeholder="DEEP" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">ELEM</div>
                    <el-select v-model="ELEMShape" filterable placeholder="ELEM" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">MEMO</div>
                    <el-select v-model="MEMOShape" filterable placeholder="MEMO" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                    <div class="symbol-mark-text">DATA</div>
                    <el-select v-model="DATAShape" filterable placeholder="DATA" class="symbol-select-box">
                      <el-option v-for="item in symbolOptions" :key="item.index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </el-row>

                  <el-button class="symbol-select-button" type="success" @click="changeShape">设置形状
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>
        </el-aside>

        <el-dialog v-model="showHotHeap" width="30%" center>
          <div id="hotheap"></div>
        </el-dialog>
        <el-main>
          <div id="main" v-loading="loading" element-loading-text="数据库搜索中"
            element-loading-background="rgba(0, 0, 0, 0.8)"></div>
        </el-main>
        <!-- 弹窗 -->
        <div id="myModal" class="modal">
          <!-- 弹窗内容 -->
          <div class="modal-content">
            <span class="close">&times;</span>
            <div id="myProgress">
              <div id="myBar">10%</div>
            </div>
            <br />
          </div>
        </div>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->

       
        <div>
    <el-dialog v-model="loginDialogVisible" title="登录" class="custom-login-dialog" :close-on-click-modal="false">
      <el-form :model="loginForm" :rules="rules" label-width="80px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
      <el-form-item v-if="show_login_fail" class="login-failure-message">
          登录失败
        </el-form-item>
    </el-dialog>
  </div>

      </el-container>
      <!-- <el-button type="text" @click="open">点击打开 Message Box</el-button> -->
    </el-container>
  </div>
  <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
</template>
<script>
import * as echarts from "echarts";
import { ref } from "vue";
import { QueryCQL } from "./../GetQueryCQL.js";
import {
  relValues,
  relIdMap,
  insIdMap,
  relTypes,
  rel_color_map,
  categories,
  Matrix_types,
} from "./../Constant.js";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import {
  sheet2blob,
  workbook2blob,
  s2ab,
  openDownloadDialog,
} from "./../Getexcel.js";
import { Floyd } from "./../KGMath.js";
export default {
  name: "App",
  data() {
    return {
      // 测试用临时变量
      slidertest: [2, 102],
      //避免页面闪烁定义的工具变量
      componentKey: -10000,
      maxNodeValue: 10000,
      maxEdgeValue: 100,
      remoteOptions: [], // 远程返回的结果
      remoteSearchQuery: '',//
      remoteLoading: false, // 是否正在从远程获取数据
      // 
      graph: [], // 初始图数据
      nodes: [], // 初始节点数据
      links: [], // 初始边数据
      filtedNodes: [], // 过滤后的节点数据
      filtedLinks: [], // 过滤后的边数据
      options: ref([]), // 实体节点下拉选择框依赖的数据
      history: [], // 修改历史
      option: ref([]), // echart图的配置项参数
      node1: {},
      node2: {},
      communityMatrix: {},
      Matrix: {},
      timer: 0,
      S_Matrix: {},
      node3: {},
      modeStatusMemory: {}, //状态寄存
      node1Id: ref(""),
      node2Id: ref(""),
      node3Id: ref(""),
      subGnode1Id: ref(""),
      subGnode2Id: ref(""),
      subGnode3Id: ref(""),
      responseData: [],
      relTypeNow: ref(""),
      relValueNow: ref(""),
      insNameNow: ref(""),
      insValueNow: ref(""),
      fixNodes: false, //false为锁定布局，true为流动布局
      sortMode: false,//排序方式
      queryMode: false, //false为构建模式，true为推理模式
      enterqueryMode: false, //刚刚进入推理模式
      nodeSwitch: 1,
      autoSave: false,
      queryStruct: {
        //保存当前的筛选结果,
        nodeTypes: [
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
          "MEMO",
          "DATA",

        ],
        linkTypes: [],
        deletenodes: [],
        deletelinks: [],
        nodeSizeSection: [300, 10000],
        linkSizeSection: [0, 28],
      },
      relValues: relValues,
      relIdMap: relIdMap,
      categories: categories,
      insIdMap: insIdMap,
      Matrix_types: ref(""),
      MyPCA_D: [],
      MyPCA_D_Value: ref(""),
      HeatMapData: [],
      PCAshadow: [],
      Matrix_type: "",
      insSizeFilter: [30, 50], // 1-373训练 1-2080测试
      relSizeFilter: [1, 28], // 1-10训练 1_277测试
      maxSize: 13000,
      maxWidth: 28,
      relTypes: relTypes,
      // // 关系显示颜色的映射表
      rel_color_map: rel_color_map,
      loading: false,
      inputSQLStatements: ref(""),
      jumpOptions: [],
      limitOptions: [],
      jumpFrom: 0,
      jumpTo: 0,
      limit: 1,
      highlightNameList: [],
      notNeedUpdate: false,
      showHotHeap: false,
      showDisMap: true,
      totalNodeNum: 0,
      symbolSizeArray: [],
      percentArray: [],
      symbolSizeLogarithmicArray: [],
      nodeNumLogarithmicArray: [],
      customShapes: [], //自定义形状
      customFontSize: 11,
      resultFontSize: 11,
      resultEdgeSource: "",
      resultEdgeTarget: "",
      customEdgeSource: "",
      customEdgeTarget: "",
      fontSizeOptions: [],
      edgeWidthFactorWhole: 1,
      edgeWidthFactorSingle: 1,
      resultEdgeWidthFactorWhole: 1,
      resultEdgeWidthFactorSingle: 1,
      edgeWidthFactorOptions: [],
      symbolOptions: ["circle", "rect", "triangle", "diamond"], //形状数组
      ROCKShape: "circle",
      TECTShape: "rect",
      ALTEShape: "triangle",
      PHYSShape: "diamond",
      CHEMShape: "circle",
      CHROShape: "rect",
      MINEShape: "triangle",
      DEPOShape: "diamond",
      DEEPShape: "circle",
      ELEMShape: "rect",
      MEMOShape: "triangle",
      DATAShape: "diamond",
      customTimeOut: 500000,
      communityDiscoveryAlgorithm: "Louvain算法",
      algorithmOptions: ["Louvain算法","Infomap算法","CNM算法"],
      communityNodes: {},
      communityLinks: {},
      communityDectionResult: {},
      communityDone: false,
      currentDataPattern: "标记数据",
      dataPattern: ["标记数据", "新数据", "大实体数据"],
      currentDatabaseLink: "http://39.105.230.175:8005/db/neo4j/tx/commit",
      loginDialogVisible: true, // 页面加载时自动显示登录弹窗
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      show_login_fail: false,
      communityInsSizeFilter: [30,50],
      communityRelSizeFilter: [1,28],
      communtiyFiltedNodes: [],
      communtiyFiltedLinks: [],
    };
  },
  mounted() {
    this.initAxios();
    this.initData();
    this.initGraph();
    window.onresize = () => {
      console.log("调用屏幕放缩");
      this.handleScreen();
    };
    // this.mytest();
  },
  watch: {
    insSizeFilter(newVal, oldVal) {
      this.communityDone = false
      if(this.currentDataPattern == '标记数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.insSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '旧数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 2000) {
          // 限制差值在50以内
          this.insSizeFilter = [newVal[0], oldVal[0] + 2000];
        }
      }
      if(this.currentDataPattern == '新数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.insSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '大节点数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 3000) {
          // 限制差值在50以内
          this.insSizeFilter = [newVal[0], oldVal[0] + 3000];
        }
      }
    },
    relSizeFilter(newVal, oldVal) {
      this.communityDone = false
      if(this.currentDataPattern == '标记数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.relSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '旧数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 200) {
          // 限制差值在50以内
          this.relSizeFilter = [newVal[0], oldVal[0] + 200];
        }
      }
      if(this.currentDataPattern == '新数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 100) {
          // 限制差值在50以内
          this.relSizeFilter = [newVal[0], oldVal[0] + 100];
        }
      }
      if(this.currentDataPattern == '大节点数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 100) {
          // 限制差值在50以内
          this.relSizeFilter = [newVal[0], oldVal[0] + 100];
        }
      }
    },
    communityRelSizeFilter(newVal, oldVal) {
      this.communityDone = false
      if(this.currentDataPattern == '标记数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.communityRelSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '旧数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 200) {
          // 限制差值在50以内
          this.communityRelSizeFilter = [newVal[0], oldVal[0] + 200];
        }
      }
      if(this.currentDataPattern == '新数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 100) {
          // 限制差值在50以内
          this.communityRelSizeFilter = [newVal[0], oldVal[0] + 100];
        }
      }
      if(this.currentDataPattern == '大节点数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 100) {
          // 限制差值在50以内
          this.communityRelSizeFilter = [newVal[0], oldVal[0] + 200];
        }
      }
    },
    communityInsSizeFilter(newVal, oldVal) { 
      this.communityDone = false
      if(this.currentDataPattern == '标记数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.communityInsSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '旧数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 2000) {
          // 限制差值在50以内
          this.communityInsSizeFilter = [newVal[0], oldVal[0] + 2000];
        }
      }
      if(this.currentDataPattern == '新数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 50) {
          // 限制差值在50以内
          this.communityInsSizeFilter = [newVal[0], oldVal[0] + 50];
        }
      }
      if(this.currentDataPattern == '大节点数据') {
        // 当滑块范围变化时，检查差值是否大于50
        if (newVal[1] - newVal[0] > 3000) {
          // 限制差值在50以内
          this.communityInsSizeFilter = [newVal[0], oldVal[0] + 3000];
        }
      }
    },
  },
  methods: {
    login() {
        var statements = {
          username: this.loginForm.username,
          password: this.loginForm.password
        };
        const req = this.axios.create({
          baseURL: "",
          headers: {},
          timeout: 10000,
          method: "post",
        });
        req
          .post("http://39.105.230.175:8110/login", {
            statements: statements,
          })
          .then((response) => {
            console.log(response.data['login_success'])
            if(response.data['login_success']) {
              this.loginDialogVisible = false
            }
            else {
              this.show_login_fail = true
            }
          });
    },
    detectZoom() {
      console.log("显示屏幕");
      let ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
      console.log("显示屏幕");
      console.log(screen);
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      if (ratio) {
        ratio = Math.round(ratio * 100);
      }
      return ratio;
    },
    handleScreen() {
      const m = this.detectZoom();
      console.log("handleScreen");
      document.body.style.zoom = 100 / Number(m);
    },
    initAxios() {
      const req = this.axios.create({
        baseURL: "",
        headers: {
          // Accept: 'application/json',
          // charset:'utf-8',
        },
        // 认证用的属性
        auth: {
          username: "neo4j",
          password: "12345678",
          // 12345678
        },
        timeout: 500000,
        method: "post",
      });
      this.ax = req;
    },
    initData() {
      var graph = require("./../datas/2022-1-4-17-29-55.json");

      this.graph = graph;
      this.nodes = graph.nodes;
      this.links = graph.links;
      this.history = graph.history;
      this.customShapes = graph.categories;
      // 初始化下拉框
      if(this.jumpOptions.length == 0) {
        for (var i = 0; i <= 20; i++) {
        var op = {
          value: i,
          label: i,
        };
        this.jumpOptions.push(op);
       }
      }
      if(this.MyPCA_D.length == 0) {
      for (i = 0; i <= 20; i++) {
        op = {
          value: i,
          label: "P" + i,
        };
        this.MyPCA_D.push(op);
      }
    }
    if(this.limitOptions.length == 0) {
      for (i = 1; i <= 200; i++) {
        op = {
          value: i,
          label: i,
        };
        this.limitOptions.push(op);
      }
    }
    if(this.fontSizeOptions.length == 0) {
      for (i = 10; i <= 30; i++) {
        op = {
          value: i,
          label: i,
        };
        this.fontSizeOptions.push(op);
      }

      }
      if(this.edgeWidthFactorOptions.length == 0) {
      for (i = 0.5; i <= 2.6; i += 0.1) {
        op = {
          value: i.toFixed(1),
          label: i.toFixed(1),
        };
        this.edgeWidthFactorOptions.push(op);
      }
    }
      this.Matrix_types = Matrix_types;
      // 初始化分类筛选数据，获取各类实体大小的最大值
      let statements = [
        {
          statement: "MATCH (n) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "match (a)-[p]-(b) return max(toInteger(p.width))",
        },
        {
          statement: "MATCH (n:ROCK) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:TECT) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:ALTE) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:PHYS) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:CHEM) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:CHRO) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:MINE) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:DEPO) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:DEEP) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:ELEM) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:MEMO) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n:DATA) RETURN max(toInteger(n.symbolSize))",
        },
        {
          statement: "MATCH (n) RETURN n"
        }
      ];
      this.loading = true;
      console.log("发送请求")
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.loading = false;
          this.maxNodeValue = response.data.results[0].data[0].row[0];
          this.maxEdgeValue = response.data.results[1].data[0].row[0];
          for (var i = 0; i < 12; i++) {
            this.categories[i]["maxpoint"] = response.data.results[i + 2].data[0].row[0];
            this.categories[i]["sliderRange"] = [0, this.categories[i]["maxpoint"]]
          }
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
      console.log("请求结束")
    },
    initGraph() {
      this.option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {},
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            selectedMode: true,
            draggable: true,
            edgeSymbol: ["circle", "arrow"], // 设置箭头
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "force",
            force: {
              //力导布局参数
              initLayout: "",
              repulsion: 600,
              gravity: 0.1,
              edgeLength: [100, 500],
              friction: 0.6,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
              fontSize: 11,
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

      // this.queryFilter();
      // 设置图的配置项完成初始化

      // 配置相应函数
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' });
      //根据父盒子的尺寸调整echarts的大小
      var _this = this;
      //在构建模式下，单击节点，将节点选入下拉框
      main.on(
        "click",
        {
          dataType: "node",
        },
        function (data) {
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
        }
      );
      main.on(
        "click",
        {
          dataType: "edge",
        },
        function (data) {
          _this.customEdgeSource = data.data.name1;
          _this.customEdgeTarget = data.data.name2;
        }
      );
      main.on(
        "dblclick",
        {
          dataType: "node",
        },
        function (data) {
          console.log(data);
          // 删除节点
          for (let i = 0; i < _this.filtedNodes.length; i++) {
            if (_this.filtedNodes[i].id == data.data.id) {
              _this.filtedNodes.splice(i, 1);
              _this.queryStruct.deletenodes.push(_this.filtedNodes[i].name);
              break;
            }
          }

          // 删除与之相连的关系
          for (let i = 0; i < _this.filtedLinks.length; i++) {
            if (
              _this.filtedLinks[i].source == data.data.id ||
              _this.filtedLinks[i].target == data.data.id
            ) {
              _this.filtedLinks.splice(i, 1);
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
          let main = echarts.init(document.getElementById("main"));
          main.setOption(_this.option);
        }
      );
      main.on(
        "dblclick",
        {
          dataType: "edge",
        },
        function (data) {
          // if (_this.queryMode) {
          //   return; // 如果是查询模式直接返回
          // }
          console.log("deleteRel", data);
          for (var i = 0; i < _this.filtedLinks.length; i++) {
            if (data.dataType == "node") {
              console.log("发生传递");
              break;
            }
            if (data.data.source == _this.filtedLinks[i].source) {
              if (data.data.target == _this.filtedLinks[i].target) {
                {
                  _this.queryStruct.deletelinks.push([
                    data.data.source,
                    data.data.target,
                  ]);
                  let a = null;
                  let b = null;
                  for (var j = 0; j < _this.options.length; j++) {
                    if (_this.options[j].value == _this.filtedLinks[i].source) {
                      a = _this.options[j].label;
                    }
                    if (_this.options[j].value == _this.filtedLinks[i].target) {
                      b = _this.options[j].label;
                    }
                    if (a && b) {
                      break;
                    }
                  }
                  var ct = 0;
                  //减小起点和终点的大小
                  for (j = 0; j < _this.filtedNodes.length; j++) {
                    if (
                      _this.filtedNodes[j].id == _this.filtedLinks[i].source ||
                      _this.filtedNodes[j].id == _this.filtedLinks[i].target
                    ) {
                      console.log(
                        _this.filtedLinks[i].source,
                        _this.filtedLinks[i].target
                      );
                      _this.filtedNodes[j].symbolSize -=
                        _this.filtedLinks[i].lineStyle.width;
                      console.log(_this.filtedNodes[j]);
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
                    relType: _this.filtedLinks[i].value,
                  };
                  _this.filtedLinks.splice(i, 1);
                  _this.history.push(his);
                  //break;
                }
              }
            }
          }
          if (_this.autoSave) {
            _this.saveData();
          }
          let main = echarts.init(document.getElementById("main"));
          main.setOption(_this.option);
        }
      );
      main.on(
        'legendselectchanged', function (params) {
          console.log("已选节点标签")
          console.log(params);
        }
      );
    },
    // 根据是否筛选isfiltered，更新下拉框，
    // updateDropDownBox(isfiltered) {
    // 	if (isfiltered) {

    // 	} else {

    // 	}
    // },
    remoteMethod(query) {
      this.remoteSearchQuery = query;
    },
    getDataByButton1() {
      console.log("远程搜索");
      this.remoteOptions.splice(0);
      document.getElementById("node1").placeholder = this.remoteSearchQuery;
      try {
        clearTimeout(a)
      } catch (e) {
        console.log("catch 1")
      }
      var a = setTimeout(() => {
        this.remoteLoading = true
        if (this.remoteSearchQuery.length > 0) {
          var mystr = "match (n) where toLower(n.name) starts with toLower(\"" + this.remoteSearchQuery + "\") return n"
          this.ax
            .post(this.currentDatabaseLink, {
              statements: [{ statement: mystr }],
            })
            .then((response) => {
              var nameSortArray = new Array();
              for (let node of response.data.results[0].data) {
                var newNode = node.row[0];
                var option = {
                  value: newNode.id,
                  label: newNode.name,
                  fre: newNode.symbolSize,
                };
                nameSortArray.push(option.label);
                this.remoteOptions.push(option);
              }
              if (this.sortMode) {
                //true是按名称排序
                this.remoteOptions.sort(function (a, b) {
                  var nameA = a.label.toUpperCase();
                  var nameB = b.label.toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              } else {
                //false是按频率排序
                this.remoteOptions.sort(function (a, b) {
                  return -(parseInt(a.fre) - parseInt(b.fre));
                });
              }
              this.remoteLoading = false;
              this.$refs.sel1.visible = true;
            })
            .catch((reason) => {
              this.remoteLoading = false
              this.$message({
                message: "出错了 " + reason,
                type: "error",
              });
            });
        }
        else {
          this.remoteLoading = false
          this.remoteOptions = [{
            label: "注意至少填写1位",
            value: ""
          }];
        }
      }, 300);
    },
    getDataByButton2() {
      console.log("远程搜索");
      this.remoteOptions.splice(0);
      document.getElementById("node2").placeholder = this.remoteSearchQuery;
      try {
        clearTimeout(a)
      } catch (e) {
        console.log("catch 1")
      }
      var a = setTimeout(() => {
        this.remoteLoading = true
        if (this.remoteSearchQuery.length > 0) {
          var mystr = "match (n) where toLower(n.name) starts with toLower(\"" + this.remoteSearchQuery + "\") return n"
          this.ax
            .post(this.currentDatabaseLink, {
              statements: [{ statement: mystr }],
            })
            .then((response) => {
              var nameSortArray = new Array();
              for (let node of response.data.results[0].data) {
                var newNode = node.row[0];
                var option = {
                  value: newNode.id,
                  label: newNode.name,
                  fre: newNode.symbolSize,
                };
                nameSortArray.push(option.label);
                this.remoteOptions.push(option);
              }
              if (this.sortMode) {
                //true是按名称排序
                this.remoteOptions.sort(function (a, b) {
                  var nameA = a.label.toUpperCase();
                  var nameB = b.label.toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              } else {
                //false是按频率排序
                this.remoteOptions.sort(function (a, b) {
                  return -(parseInt(a.fre) - parseInt(b.fre));
                });
              }
              this.remoteLoading = false;
              this.$refs.sel2.visible = true;
            })
            .catch((reason) => {
              this.remoteLoading = false
              this.$message({
                message: "出错了 " + reason,
                type: "error",
              });
            });
        }
        else {
          this.remoteLoading = false
          this.remoteOptions = [{
            label: "注意至少填写1位",
            value: ""
          }];
        }
      }, 300);
    },
    getDataByButton3() {
      console.log("远程搜索");
      this.remoteOptions.splice(0);
      document.getElementById("node3").placeholder = this.remoteSearchQuery;
      try {
        clearTimeout(a)
      } catch (e) {
        console.log("catch 1")
      }
      var a = setTimeout(() => {
        this.remoteLoading = true
        if (this.remoteSearchQuery.length > 0) {
          var mystr = "match (n) where toLower(n.name) starts with toLower(\"" + this.remoteSearchQuery + "\") return n"
          this.ax
            .post(this.currentDatabaseLink, {
              statements: [{ statement: mystr }],
            })
            .then((response) => {
              var nameSortArray = new Array();
              for (let node of response.data.results[0].data) {
                var newNode = node.row[0];
                var option = {
                  value: newNode.id,
                  label: newNode.name,
                  fre: newNode.symbolSize,
                };
                nameSortArray.push(option.label);
                this.remoteOptions.push(option);
              }
              if (this.sortMode) {
                //true是按名称排序
                this.remoteOptions.sort(function (a, b) {
                  var nameA = a.label.toUpperCase();
                  var nameB = b.label.toUpperCase();
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  return 0;
                });
              } else {
                //false是按频率排序
                this.remoteOptions.sort(function (a, b) {
                  return -(parseInt(a.fre) - parseInt(b.fre));
                });
              }
              this.remoteLoading = false;
              this.$refs.sel3.visible = true;
            })
            .catch((reason) => {
              this.remoteLoading = false
              this.$message({
                message: "出错了 " + reason,
                type: "error",
              });
            });
        }
        else {
          this.remoteLoading = false
          this.remoteOptions = [{
            label: "注意至少填写1位",
            value: ""
          }];
        }
      }, 300);
    },
    sortModeChange(value) {
      this.sortMode = value;
    },
    AutoMerge() {
      console.log("自动合并开始");
      let cnt1 = 0;
      for (let his of this.history) {
        if (his.type == "merge") {
          let node1Id = -1;
          let node2Id = -1;

          for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].name == his.node1Name) {
              node1Id = this.nodes[i].id;
              break;
            }
          }

          for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].name == his.node2Name) {
              node2Id = this.nodes[i].id;
              break;
            }
          }

          // 如果没有找到两个节点
          if (node1Id == -1 || node2Id == -1) {
            continue;
          }

          cnt1 += 1;

          // 合并节点的关系，重复的关系线要变粗
          var map1 = new Map();
          for (let i = 0; i < this.links.length; i++) {
            // 替换边实体
            if (this.links[i].source == node1Id) {
              this.links[i].source = node2Id;
            } else if (this.links[i].target == node1Id) {
              this.links[i].target = node2Id;
            }
            // 记录map,用于为边加粗
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
            if (this.nodes[i].id == node1Id) {
              node1Size = this.nodes[i].symbolSize;
              this.nodes.splice(i, 1);
              break;
            }
          }
          for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].id == node2Id) {
              this.nodes[i].symbolSize = this.nodes[i].symbolSize + node1Size;
              break;
            }
          }
        }
      }
      console.log("共和并边数：", cnt1);
      console.log("自动合并结束");
    },
    filter() {
      this.queryStruct.linkSizeSection[0] = this.relSizeFilter[0];
      this.queryStruct.linkSizeSection[1] = this.relSizeFilter[1];
      this.queryStruct.nodeSizeSection[0] = this.insSizeFilter[0];
      this.queryStruct.nodeSizeSection[1] = this.insSizeFilter[1];

      this.queryStruct.linkTypes.splice(0);
      for (var linktype of this.relTypes) {
        if (linktype.use == true) {
          this.queryStruct.linkTypes.push(linktype.name);
        }
      }
      this.queryFilter();
      this.options.splice(0);
      this.querySortedNodes();
      // 如果不需要更新
      if (this.notNeedUpdate) {
        // 下次需要更新
        this.notNeedUpdate = false;
      } else {
        this.node1 = {};
        this.node2 = {};
        this.node3 = {};
        this.node1Id = "";
        this.node2Id = "";
        this.node3Id = "";
      }
    },
    submitFilter() {
      this.filterSizeChange();
      this.updateGraph();
    },
    // 动态改变滑块上下限的范围，设置滑块的不可使用
    filterSizeChange() {
      this.componentKey += 1;
      this.updateGraph();
    },
    // 利用一个数组更新下拉框的内容
    updateGraph() {
      this.Matrix_type = "";
      //this.loading = true;
      var _this = this;
      //this.chart.showLoading();
      var myoption = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.customShapes.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
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
      if (this.queryMode) {
        if (this.enterqueryMode) {
          this.enterqueryMode = false;
          // this.enterqueryFilter();
          var myChart = echarts.getInstanceByDom(
            document.getElementById("main")
          );
          myChart.clear();
          myChart.dispose();
          document.getElementById("main").removeAttribute("_echarts_instance_");
          document.getElementById("main").innerHTML = "";
          // console.log("更新数据完成");
          let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
          main.setOption(myoption, true);
          // main.on('finished', function() {
          // 	_this.loading = false;
          // 	var modal = document.getElementById('myModal');
          // 	modal.style.display = "none";
          // })
          return;
        } else {
          this.queryFilter();
          let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
          main.setOption(myoption, true);
          // main.on('finished', function() {
          // 	_this.loading = false;
          // 	var modal = document.getElementById('myModal');
          // 	modal.style.display = "none";
          // })
          this.allowNodedraggle(main);
          return;
        }
      } else {
        console.log("数据库")
        this.filter();
      }
      this.communityDone = false;
      console.log(myoption)
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
      main.setOption(this.option, true);
    },
    enterqueryFilter() {
      this.options.splice(0);
      // 如果不需要更新
      if (this.notNeedUpdate) {
        // 下次需要更新
        this.notNeedUpdate = false;
      } else {
        this.node1 = {};
        this.node2 = {};
        this.node3 = {};
        this.node1Id = "";
        this.node2Id = "";
        this.node3Id = "";
      }
      // 过滤节点状态
      for (let node of this.nodes) {
        let newNode = JSON.parse(JSON.stringify(node));
        this.node1 = {};
        this.node2 = {};
        this.node3 = {};
        this.node1Id = "";
        this.node2Id = "";
        this.node3Id = "";
      }
      // 过滤节点状态
      for (let node of this.nodes) {
        let newNode = JSON.parse(JSON.stringify(node));
        // 过滤节点大小
        if (
          node.symbolSize < this.insSizeFilter[0] ||
          node.symbolSize > this.insSizeFilter[1]
        ) {
          if (
            node.symbolSize > this.maxSize &&
            this.insSizeFilter[1] == this.maxSize
          ) {
            var option = {
              value: newNode.id,
              label: newNode.name,
            };
            this.options.push(option);
          }
          continue;
        }
        option = {
          value: newNode.id,
          label: newNode.name,
        };
        this.options.push(option);
      }
      this.filtedLinks.splice(0);
      this.filtedNodes.splice(0);
      // 对 options 进行排序
      this.options.sort(function (a, b) {
        return ("" + a.label).localeCompare(b.label);
      });
      console.log("enterqueryFilter执行完毕");
      // 补充显示参数，过滤边
    },
    queryDataHelper(filter) {
      var queryNodes = new Map();
      var queryLinks = new Map();
      if (this.responseData.length == 0) {
        this.$message({
          message: "没有查询到结果",
          type: "error",
        });
      }
      console.log("数据库查询结果");
      console.log(this.responseData);
      if (filter == "weight") {
        let maxIndex = 0;
        let max = 0;
        for (let key in this.responseData) {
          let path = this.responseData[key];
          const entitys = path.row[0];
          let sum = 0;
          let count = 0;
          for (let entity of entitys) {
            // 计算权重
            if (entity.id == null) {
              count += 1;
              sum += Number(entity.width);
            }
          }
          let value = sum / count;
          console.log(value);
          if (value > max) {
            // 如果更大则记录
            max = value;
            maxIndex = key;
          }
        }
        let foo = this.responseData[maxIndex];
        this.responseData.splice(0);
        this.responseData.push(foo);
      }
      var dic = new Array();
      var dy = [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6];
      var y = 600;
      var x = 200;
      var cnt_i = 0;
      this.responseData.sort(function (a, b) {
        return -(a.row[0].length - b.row[0].length);
      });
      for (let path of this.responseData) {
        const entitys = path.row[0];
        var cur_y = y + dy[cnt_i] * 300;
        var cnt_x = 0;
        for (var entity of entitys) {
          if (entity.id != null) {
            var la = entity.name + "@@@" + entity.id;
            if (!queryNodes.has(la)) {
              queryNodes.set(la, entity);
            }
            if (!dic[entity.id]) {
              entity.x = cnt_x * 300 + x;
              entity.y = cur_y;
              cnt_x++;
              dic[entity.id] = cur_y;
            } else {
              cnt_x++;
            }
          } else {
            if (entity.target in dic) {
              entity.value = 10;
            } else {
              entity.value = 100;
            }
            la =
              entity.source + "@@@" + entity.target + "@@@" + entity.relation;
            if (!queryLinks.has(la)) {
              queryLinks.set(la, entity);
            }
          }
        }
        cnt_i++;
      }

      // 清空列表数据
      this.filtedLinks.splice(0);
      this.filtedNodes.splice(0);

      for (let key of queryNodes) {
        var node = key[1];
        node.category = Number(node.category);
        node.realSymbolSize = node.symbolSize
        node.rawSymbolSize = 50 + (Number(node.symbolSize) / 2000) * 30;
        node.symbolSize = 50 + ((node.symbolSize) / 20000) * 200;

        // node.rawSymbolSize = 10;
        // node.symbolSize = 10;
        node.fixed = this.fixNodes;
        this.filtedNodes.push(node);
      }

      for (let key of queryLinks) {
        let link = key[1];
        link.value = link.relation;
        link.lineStyle = {
          color: this.rel_color_map[link.value],
          width: link.width * 2,
        };
        link.label = {
          formatter: "{c}",
        };
        this.filtedLinks.push(link);
      }

      //为节点分配坐标
      // console.log("我要为节点分配坐标啦")
      //----------------------------------------------覆盖原图
      this.nodes = [];
      this.links = [];

      this.options.splice(0)
      for (let node of this.filtedNodes) {
        this.nodes.push(node);
        var myoption = {
          value: node.id,
          label: node.name
        }
        this.options.push(myoption)
      }

      for (let link of this.filtedLinks) {
        this.links.push(link);
      }
      echarts.getInstanceByDom(document.getElementById("main")).clear();
      let myChart = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快

      // 这是推理子图中的两点之间的关系
      var option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            force: {
              repulsion: 300,
              edgeLength: 200,
              gravity: 0.01,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
            },
            lineStyle: {
              // color: "source",myModal
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
      myChart.setOption(option, true);
      var _this = this;
      myChart.on("finished", function () {
        _this.loading = false;
        var modal = document.getElementById("");
        //modal.style.display = "none";
      });
      myChart.on(
        "dblclick",
        {
          dataType: "node",
        },
        function (data) {
          console.log("deletenode", data);
          console.log(data);
          // 删除节点
          for (let i = 0; i < _this.filtedNodes.length; i++) {
            if (_this.filtedNodes[i].id == data.data.id) {
              _this.filtedNodes.splice(i, 1);
              break;
            }
          }

          // 删除与之相连的关系
          for (let i = 0; i < _this.filtedLinks.length; i++) {
            if (
              _this.filtedLinks[i].source == data.data.id ||
              _this.filtedLinks[i].target == data.data.id
            ) {
              _this.filtedLinks.splice(i, 1);
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
          let main = echarts.init(document.getElementById("main"));
          _this.option["series"][0]["layout"] = "none";
          main.setOption(_this.option);
        }
      );
      myChart.on(
        "click",
        {
          dataType: "edge",
        },
        function (data) {
          _this.resultEdgeSource = data.data.name1;
          _this.resultEdgeTarget = data.data.name2;
        }
      );
      myChart.on(
        "dblclick",
        {
          dataType: "edge",
        },
        function (data) {
          // if (_this.queryMode) {
          //   return; // 如果是查询模式直接返回
          // }
          console.log("deleteRel", data);
          for (var i = 0; i < _this.filtedLinks.length; i++) {
            if (data.dataType == "node") {
              console.log("发生传递");
              break;
            }
            if (data.data.source == _this.filtedLinks[i].source) {
              if (data.data.target == _this.filtedLinks[i].target) {
                {
                  _this.queryStruct.deletelinks.push([
                    data.data.source,
                    data.data.target,
                  ]);
                  let a = null;
                  let b = null;
                  for (var j = 0; j < _this.options.length; j++) {
                    if (_this.options[j].value == _this.filtedLinks[i].source) {
                      a = _this.options[j].label;
                    }
                    if (_this.options[j].value == _this.filtedLinks[i].target) {
                      b = _this.options[j].label;
                    }
                    if (a && b) {
                      break;
                    }
                  }
                  var ct = 0;
                  //减小起点和终点的大小
                  for (j = 0; j < _this.filtedNodes.length; j++) {
                    if (
                      _this.filtedNodes[j].id == _this.filtedLinks[i].source ||
                      _this.filtedNodes[j].id == _this.filtedLinks[i].target
                    ) {
                      console.log(
                        _this.filtedLinks[i].source,
                        _this.filtedLinks[i].target
                      );
                      _this.filtedNodes[j].symbolSize -=
                        _this.filtedLinks[i].lineStyle.width;
                      console.log(_this.filtedNodes[j]);
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
                    relType: _this.filtedLinks[i].value,
                  };
                  _this.filtedLinks.splice(i, 1);
                  _this.history.push(his);
                  //break;
                }
              }
            }
          }
          if (_this.autoSave) {
            _this.saveData();
          }
          let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' });
          _this.option["series"][0]["layout"] = "none";
          console.log(_this.option);
          main.setOption(_this.option);
        }
      );
    },
    allowNodedraggle() {
      var myChart = echarts.init(document.getElementById("main"), "dark");
      var option = echarts
        .getInstanceByDom(document.getElementById("main"))
        .getOption();
      myChart.setOption({
        graphic: echarts.util.map(
          echarts.getInstanceByDom(document.getElementById("main")).getOption()
            .series[0].data,
          function (item, dataIndex) {
            //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
            var tmpPos = myChart.convertToPixel(
              {
                seriesIndex: 0,
              },
              [item.x, item.y - 50]
            );
            return {
              type: "circle",
              id: String(item.id),
              position: tmpPos,
              shape: {
                cx: 0,
                cy: 0,
                r: 20,
              },
              // silent:true,
              invisible: true,
              draggable: true,
              properties: item.properties,
              nodeType: item.type,
              dataIndex,
              ondrag: echarts.util.curry(onPointDragging, dataIndex),
              z: 100, //使图层在最高层
            };
          }
        ),
      });
      window.addEventListener("resize", updatePosition);
      myChart.on("dataZoom", updatePosition);
      myChart.on("graphRoam", updatePosition);

      function updatePosition() {
        //更新节点定位的函数
        myChart.setOption({
          graphic: echarts.util.map(
            echarts
              .getInstanceByDom(document.getElementById("main"))
              .getOption().series[0].data,
            function (item, dataIndex) {
              var tmpPos = myChart.convertToPixel(
                {
                  seriesIndex: 0,
                },
                [item.x, item.y]
              );
              return {
                position: tmpPos,
              };
            }
          ),
        });
      }

      function onPointDragging(dataIndex) {
        //节点上图层拖拽执行的函数
        var tmpPos = myChart.convertFromPixel(
          {
            seriesIndex: 0,
          },
          this.position
        );
        option.series[0].data[dataIndex].x = tmpPos[0];
        option.series[0].data[dataIndex].y = tmpPos[1];
        //var option1 = echarts.getInstanceByDom(document.getElementById("main")).getOption();
        myChart.setOption(option);
        updatePosition();
      }
    },
    queryRequest(statements, filter) {
      this.loading = true;
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.loading = false;
          console.log(response)
          this.responseData = response.data.results[0].data;
          this.queryDataHelper(filter);
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
    },
    queryReturnResult(statements, myfunc) {
      this.loading = true;
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.loading = false;
          this.responseData = response.data.results[0].data;
          console.log(this.responseData);
          for (var node of this.responseData) {
            if (node[0] && node[1]) {
              var option = {
                value: node[0],
                label: node[1],
              };
              this.options.push(option);
            }
          }
          console.log("test");
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
    },
    // 查询数据库中的节点数量
    queryDBNodes() {
      let statements = [
        {
          statement: "match (n) return n.name,n.id order by n.name",
        },
      ];
      this.queryReturnResult(statements);
    },
    queryAtoB() {
      let lr = "*" + this.jumpFrom + ".." + this.jumpTo;
      let statements = [
        {
          statement:
            "match (from{name:$name1}),(to{name:$name2}), p=(from)-[" +
            lr +
            "]->(to) return p LIMIT $lim",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            lim: this.limit,
          },
        },
      ];
      console.log(
        this.node1.name,
        this.node2.name,
        this.jumpFrom,
        this.jumpTo,
        this.limit
      );
      this.queryRequest(statements);
    },
    queryAtoBNoCircle() {
      let lr = "*" + this.jumpFrom + ".." + this.jumpTo;
      let statements = [
        {
          statement:
            "match (from{name:$name1}),(to{name:$name2}) MATCH path = (from)-[" +
            lr +
            "]->(to) WHERE SIZE(apoc.coll.toSet(NODES(path))) = LENGTH(path) + 1 RETURN path limit $lim",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            lim: this.limit,
          },
        },
      ];
      this.queryRequest(statements);
    },
    queryAtoBShortest() {
      let lr = "*1.." + this.jumpTo;
      let statements = [
        {
          statement:
            "Match (from{name:$name1}),(to{name:$name2}), p = shortestpath((from)-[" +
            lr +
            "]->(to)) return p limit $lim",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            lim: this.limit,
          },
        },
      ];
      this.queryRequest(statements);
    },
    //这次编辑
    queryAtoBLongest() {
      let lr = "*" + this.jumpFrom + ".." + this.jumpTo;
      let statements = [
        {
          statement:
            "Match (from{name:$name1}),(to{name:$name2}), p = (from)-[" +
            lr +
            "]->(to) return Max(p)",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            lim: this.limit,
          },
        },
      ];
      this.queryRequest(statements);
    },
    queryFilter() {
      var _this = this;
      this.queryStruct["categories"] = this.categories
      console.log("queryFilter")
      console.log(this.queryStruct)
      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.onlyFilter(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]);
      this.loading = true;
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.filtedNodes.splice(0);
          this.filtedLinks.splice(0);
          this.loading = false;
          console.log(this.currentDatabaseLink)
          console.log(response.data);
          var responseData0 = response.data.results[0].data;
          for (var node of responseData0[0].row[0]) {
            node["category"] = parseInt(node["category"]);
            node["realSymbolSize"] = node["symbolSize"]
            node["symbolSize"] = (node["symbolSize"] / 20000) * 200 + 50;
            this.filtedNodes.push(node);
          }
          for (var link of responseData0[0].row[1]) {
            link["lineStyle"] = {
              color: link["color"],
              width: Math.ceil((link["width"]) / 2),
            };
            link["label"] = {
              formatter: "{c}",
            };
            this.filtedLinks.push(link);
          }

          let main = echarts.init(document.getElementById("main"), "dark"); // 不懂这样为社么更快，但是确实更快
          main.setOption(this.option);
          // console.log(this.option);
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 queryfilted" + reason,
            type: "error",
          });
        });
    },
    queryAtoBPassC() {
      let lr = "*" + this.jumpFrom + ".." + this.jumpTo;
      let statements = [
        {
          statement:
            "Match (from{name:$name1}),(to{name:$name2}),(pass{name:$name3}),p = (from)-[" +
            lr +
            "]->(pass)-[" +
            lr +
            "]->(to) return p limit $lim",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            name3: this.node3.name,
            lim: this.limit,
          },
        },
      ];
      this.queryRequest(statements);
    },
    queryMaxWeightPath() {
      let lr = "*" + this.jumpFrom + ".." + this.jumpTo;
      let statements = [
        {
          statement:
            "match (from{name:$name1}),(to{name:$name2}), p=(from)-[" +
            lr +
            "]->(to) return p LIMIT $lim",
          parameters: {
            name1: this.node1.name,
            name2: this.node2.name,
            lim: this.limit,
          },
        },
      ];
      this.queryRequest(statements, "weight");
    },
    querySortedNodes() {

      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.getSortedNodes(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]);
      this.loading = true;
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.loading = false;
          var responseData0 = response.data.results[0].data;
          for (let node of responseData0[0].row[0]) {
            var option = {
              label: node.name,
              value: node.id,
            };
            this.options.push(option);
          }
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 sortednodes" + reason,
            type: "error",
          });
        });
    },
    queryInputSQL() {
      let statements = [
        {
          statement: this.inputSQLStatements,
          parameters: {},
        },
      ];
      this.queryRequestCQL(statements);
    },
    queryRequestCQL(statements, filter) {
      this.loading = true;
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.loading = false;
          this.responseData = response.data.results[0].data;
          this.queryDataHelperCQL(filter);
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
    },
    queryDataHelperCQL(filter) {
      console.log('queryDataHelperCQL')
      this.filtedNodes.splice(0)
      this.filtedLinks.splice(0)
      for (let key in this.responseData) {
        var node = this.responseData[key]['row'];
        node[0].x = 300 + key * 200
        node[0].y = 500
        node[0].category = Number(node[0].category);
        node[0].rawSymbolSize = 50 + (Number(node[0].symbolSize) / 2000) * 30;
        node[0].symbolSize = 50 + (Number(node[0].symbolSize) / 10000) * 30;
        // node.rawSymbolSize = 10;
        // node.symbolSize = 10;
        node[0].fixed = this.fixNodes;
        this.filtedNodes.push(node[0])
      }
      console.log(this.filtedNodes)
      echarts.getInstanceByDom(document.getElementById("main")).clear();
      let myChart = echarts.init(document.getElementById("main"), "dark"); // 不懂这样为社么更快，但是确实更快
      var option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "png",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            force: {
              repulsion: 300,
              edgeLength: 200,
              gravity: 0.01,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
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
      myChart.setOption(option, true);
    },
    onChange(id) {
      if (this.relTypes[id].use == true) {
        this.relTypes[id].use = false;
        var index = this.queryStruct.linkTypes.indexOf(this.relTypes[id].name);
        if (index > -1) {
          this.queryStruct.linkTypes.splice(index, 1);
          console.log(this.queryStruct.linkTypes[index]);
        }
      } else {
        this.relTypes[id].use = true;
        this.queryStruct.linkTypes.push(this.relTypes[id].name);
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

      // 合并节点的关系，重复的关系线要变粗
      var map1 = new Map();
      for (let i = 0; i < this.filtedLinks.length; i++) {
        if (this.filtedLinks[i].source == this.node1Id) {
          this.filtedLinks[i].source = this.node2Id;
        } else if (this.filtedLinks[i].target == this.node1Id) {
          this.filtedLinks[i].target = this.node2Id;
        }
        var label =
          this.filtedLinks[i].source +
          "@@@" +
          this.filtedLinks[i].target +
          "@@@" +
          this.filtedLinks[i].value;
        if (map1.has(label)) {
          map1.set(
            label,
            map1.get(label) + this.filtedLinks[i].lineStyle.width
          );
        } else {
          map1.set(label, this.filtedLinks[i].lineStyle.width);
        }
      }
      this.filtedLinks.splice(0);
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
        this.filtedLinks.push(link);
      }

      // 删除节点,更新节点大小
      var node1Size = 0;
      for (let i = 0; i < this.filtedNodes.length; i++) {
        if (this.filtedNodes[i].id == this.node1Id) {
          node1Size = this.filtedNodes[i].symbolSize;
          this.filtedNodes.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.filtedNodes.length; i++) {
        if (this.filtedNodes[i].id == this.node2Id) {
          this.filtedNodes[i].symbolSize =
            this.filtedNodes[i].symbolSize + node1Size;
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
      let main = echarts.init(document.getElementById("main"), "dark"); // 不懂这样为社么更快，但是确实更快
      main.setOption(this.option);
    },
    selectNode1(v) {
      this.subGnode1Id = v;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.subGnode1Id) {
          this.node1.name = this.options[i].label;
          break;
        }
      }
      var mychart = echarts.getInstanceByDom(document.getElementById("main"));
      mychart.dispatchAction({
        type: "highlight",
        name: this.node1.name,
      });
    },
    selectNode2(v) {
      this.subGnode2Id = v;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.SubGnode2Id) {
          this.node2.name = this.options[i].label;
          break;
        }
      }
    },
    selectNode3(v) {
      this.subGnode3Id = v;
      for (var i = 0; i < this.options.length; i++) {
        if (this.options[i].value == this.subGnode3Id) {
          this.node3.name = this.options[i].label;
          break;
        }
      }
    },
    remoteSelectNode1(v) {
      this.node1Id = v;
      for (var i = 0; i < this.remoteOptions.length; i++) {
        if (this.remoteOptions[i].value == this.node1Id) {
          this.node1.name = this.remoteOptions[i].label;
          break;
        }
      }
      console.log("节点1为")
      console.log(this.node1.name);
      var mychart = echarts.getInstanceByDom(document.getElementById("main"));
      mychart.dispatchAction({
        type: "highlight",
        name: this.node1.name,
      });
    },
    remoteSelectNode2(v) {
      this.node2Id = v;
      for (var i = 0; i < this.remoteOptions.length; i++) {
        if (this.remoteOptions[i].value == this.node2Id) {
          this.node2.name = this.remoteOptions[i].label;
          break;
        }
      }
      console.log("节点2为")
      console.log(this.node2.name);
      var mychart = echarts.getInstanceByDom(document.getElementById("main"));
      mychart.dispatchAction({
        type: "highlight",
        name: this.node2.name,
      });
    },
    remoteSelectNode3(v) {
      this.node3Id = v;
      for (var i = 0; i < this.remoteOptions.length; i++) {
        if (this.remoteOptions[i].value == this.node3Id) {
          this.node3.name = this.remoteOptions[i].label;
          break;
        }
      }
      console.log("节点3为")
      console.log(this.node3.name);
      var mychart = echarts.getInstanceByDom(document.getElementById("main"));
      mychart.dispatchAction({
        type: "highlight",
        name: this.node3.name,
      });
    },
    selectJumpFrom(v) {
      console.log(v);
    },
    selectJumpTo(v) {
      console.log(v);
    },
    changeCustomFontSize() {
      this.option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {},
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            selectedMode: true,
            draggable: true,
            edgeSymbol: ["circle", "arrow"], // 设置箭头
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "force",
            force: {
              //力导布局参数
              initLayout: "",
              repulsion: 600,
              gravity: 0.1,
              edgeLength: [100, 500],
              friction: 0.6,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
              fontSize: this.customFontSize,
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
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
      main.setOption(this.option, true);
    },
    changeResultFontSize() {
      this.option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            console.log(params)
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            force: {
              repulsion: 300,
              edgeLength: 200,
              gravity: 0.01,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
              fontSize: this.resultFontSize,
            },
            lineStyle: {
              // color: "source",myModal
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
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
      main.setOption(this.option, true);
    },
    changeEdgeWidthSingle() {
      for (var link of this.filtedLinks) {
        if (link.name1 == this.customEdgeSource && link.name2 == this.customEdgeTarget) {
          link["lineStyle"] = {
            color: link["color"],
            width: (Math.ceil((link["width"]) / 2)) * parseFloat(this.edgeWidthFactorSingle),
          };
          link["label"] = {
            formatter: "{c}",
          };
        }
      }
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' });
      main.setOption(this.option, true);
    },
    changeEdgeWidthWhole() {
      for (var link of this.filtedLinks) {
        link["lineStyle"] = {
          color: link["color"],
          width: (Math.ceil((link["width"]) / 2)) * parseFloat(this.edgeWidthFactorWhole),
        };
        link["label"] = {
          formatter: "{c}",
        };
      }
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' });
      main.setOption(this.option, true);
    },
    changeResultEdgeWidthSingle() {
      for (var link of this.filtedLinks) {
        if (link.name1 == this.resultEdgeSource && link.name2 == this.resultEdgeTarget) {
          link["lineStyle"] = {
            color: link["color"],
            width: (link["width"]) * parseFloat(this.resultEdgeWidthFactorSingle),
          };
          link["label"] = {
            formatter: "{c}",
          };
        }
      }
      var option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            console.log(params)
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            force: {
              repulsion: 300,
              edgeLength: 200,
              gravity: 0.01,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
            },
            lineStyle: {
              // color: "source",myModal
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
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
      main.setOption(option, true);
    },
    changeResultEdgeWidthWhole() {
      for (var link of this.filtedLinks) {
        link["lineStyle"] = {
          color: link["color"],
          width: (link["width"]) * parseFloat(this.resultEdgeWidthFactorWhole),
        };
        link["label"] = {
          formatter: "{c}",
        };
      }
      var option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {
          formatter: function (params) {
            console.log(params)
            var result = ''
            var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
            var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
            if (params.dataType == 'node') {
              result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
            }
            if (params.dataType == 'edge') {
              result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
            }
            return result
          }
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },
        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.graph.categories.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "none",
            force: {
              repulsion: 300,
              edgeLength: 200,
              gravity: 0.01,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.graph.categories, // 分类
            roam: true,
            label: {
              position: "right",
              formatter: "{b}",
              show: true, // 显示标签文字
            },
            lineStyle: {
              // color: "source",myModal
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
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' }); // 不懂这样为社么更快，但是确实更快
      main.setOption(option, true);
    },
    selectLimit(v) {
      console.log(v);
    },
    SearchPCA() { },
    selectMatrix(v) {
      if (this.filtedNodes.length > 40) {
        this.openmap();
        return;
      }
      this.GetMatrix();
      var statements = {
        Matrix_type: this.Matrix_type,
        MyPCA_D_Value: this.MyPCA_D_Value,
        graph: this.Matrix,
      };
      const req = this.axios.create({
        baseURL: "",
        headers: {},
        timeout: 20000,
        method: "post",
      });
      req
        .post("http://39.105.230.175:8110/test", {
          statements: statements,
        })
        .then((response) => {
          console.log(response);
          this.HeatMapData = response.data.heatmap;
          this.PCAshadow = response.data.PCAshadow;
        })
        .catch((reason) => {
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
    },
    ShowHotHeap() {
      const hours = this.Matrix.vertexs.map(function (item) {
        return item.name;
      });
      // prettier-ignore
      const days = hours;
      // prettier-ignore
      const data = this.HeatMapData
        .map(function (item) {
          return [item[1], item[0], item[2] || '-'];
        });
      var mapTitle = "条件概率矩阵热力图";
      if (this.Matrix_type == 1) {
        mapTitle = "条件概率矩阵热力图";
      } else if (this.Matrix_type == 2) {
        mapTitle = "距离矩阵热力图";
      }
      const hotHeapOption = {
        title: {
          text: mapTitle,
        },
        tooltip: {
          position: "top",
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 300,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "png",
              lang: ["点击保存"],
            },
          },
        },
        grid: {
          height: "80%",
          weight: "70%",
          top: "10%",
          bottom: "30%",
          margin: "10%"
        },
        xAxis: [
          {
            type: "category",
            data: hours,
            splitArea: {
              show: true,
            },
            axisPointer: {
              show: true,
              type: "line",
            },
            axisLabel: {
              interval: 0, //代表显示所有x轴标签显示
              rotate: 10, //代表逆时针旋转45度
            },
          },
        ],
        yAxis: {
          type: "category",
          data: days,
          splitArea: {
            show: true,
          },
          axisLabel: {
            interval: 0, //代表显示所有x轴标签显示
            // rotate:45, //代表逆时针旋转45度
          },
        },
        dataZoom: [
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "95%",
            start: 0,
            end: 40,
          },
          {
            show: true,
            yAxisIndex: [0, 1],
            type: "slider",
            right: "8%",
            start: 50,
            end: 100,
          },
        ],
        visualMap: {
          min: 0,
          max: 1,
          calculable: true,
          orient: "vertical",
          left: "right",
          bottom: "55%",
        },
        series: [
          {
            name: "Node Message",
            type: "heatmap",
            data: data,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.showHotHeap = false;
      let newPromise = new Promise((resolve) => {
        resolve();
      });
      //然后异步执行echarts的初始化函数
      newPromise.then(() => {
        let routeUrl = this.$router.resolve({
          path: "/home",
          query: {
            id: 2
          }
        });
        localStorage.setItem("msg", JSON.stringify(hotHeapOption));
        window.open(routeUrl.href, '_blank');
      });
    },
    //选择一个维度，展示直方图
    showOneDimensionPCA() {
      const hours = this.Matrix.vertexs.map(function (item) {
        return item.name;
      });
      console.log(hours);
      var shadowOption = {
        title: {
          text: "PCA分析直方图",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 300,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "png",
              lang: ["点击保存"],
            },
          },
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: hours,
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0, //代表显示所有x轴标签显示
              rotate: 45, //代表逆时针旋转45度
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        dataZoom: [
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "90%",
            start: 0,
            end: 40,
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.PCAshadow[this.MyPCA_D_Value],
          },
        ],
      };
      this.showHotHeap = false;
      let newPromise = new Promise((resolve) => {
        resolve();
      });
      //然后异步执行echarts的初始化函数
      newPromise.then(() => {
        let routeUrl = this.$router.resolve({
          path: "/home",
          query: {
            id: 3
          }
        });
        localStorage.setItem("msg", JSON.stringify(shadowOption));
        window.open(routeUrl.href, '_blank');
      });
    },

    GetCommunityResultMatrix() {
      //邻接矩阵
      //maxvex:顶点数
      //arcnum:边数
      function arc(maxvex, arcnum) {
        this.maxvex = maxvex;
        this.arcnum = arcnum;
        this.data = new Array(maxvex);
        for (var i = 0; i < this.data.length; i++) {
          this.data[i] = new Array(maxvex);
          for (var j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = Infinity;
            if (i == j) {
              this.data[i][j] = 0;
            }
          }
        }
      }
      //图
      function Mgraph(maxvex, arcnum, vertexs) {
        this.arc = new arc(maxvex, arcnum);
        this.vertexs = vertexs;
      }
      Mgraph.prototype.addArc = function (start, end, link) {
        var i = this.vertexs.indexOf(start);
        var j = this.vertexs.indexOf(end);
        this.arc.data[i][j] = link;
      };
      var vertexs = [];
      var id_to_pos = {};
      for (var i = 0; i < this.communtiyFiltedNodes.length; i++) {
        var node = this.communtiyFiltedNodes[i];
        vertexs.push(node);
        id_to_pos[node.id] = i;
      }
      var mgraph = new Mgraph(
        this.communtiyFiltedNodes.length,
        this.communtiyFiltedLinks.length,
        vertexs
      );
      for (var i1 = 0; i1 < this.communtiyFiltedLinks.length; i1++) {
        var link = this.communtiyFiltedLinks[i1];
        if (link.source in id_to_pos) {
          if (link.target in id_to_pos) {
            mgraph.addArc(
              vertexs[id_to_pos[link.source]],
              vertexs[id_to_pos[link.target]],
              link
            );
          }
        }
      }
      this.Matrix = mgraph;
    },


    community_Dection_Filter() {
      this.queryStruct.linkSizeSection[0] = this.communityRelSizeFilter[0];
      this.queryStruct.linkSizeSection[1] = this.communityRelSizeFilter[1];
      this.queryStruct.nodeSizeSection[0] = this.communityInsSizeFilter[0];
      this.queryStruct.nodeSizeSection[1] = this.communityInsSizeFilter[1];

      this.queryStruct.linkTypes.splice(0);
      for (var linktype of this.relTypes) {
        if (linktype.use == true) {
          this.queryStruct.linkTypes.push(linktype.name);
        }
      }
      this.community_Query_Filter();
    },
    community_Query_Filter() {
      var _this = this;
      this.queryStruct["categories"] = this.categories
      console.log("queryFilter")
      console.log(this.queryStruct)
      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.onlyFilter(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]); 
      console.log(this.currentDatabaseLink); 
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.communtiyFiltedLinks.splice(0);
          this.communtiyFiltedNodes.splice(0);
          var responseData0 = response.data.results[0].data;
          for (var node of responseData0[0].row[0]) {
            node["category"] = parseInt(node["category"]);
            node["realSymbolSize"] = node["symbolSize"]
            node["symbolSize"] = (node["symbolSize"] / 20000) * 200 + 50;
            this.communtiyFiltedNodes.push(node);
          }
          if (this.communtiyFiltedNodes.length > 1000) {
          this.openmap();
          return;
        }
          for (var link of responseData0[0].row[1]) {
            link["lineStyle"] = {
              color: link["color"],
              width: Math.ceil((link["width"]) / 2),
            };
            link["label"] = {
              formatter: "{c}",
            };
            this.communtiyFiltedLinks.push(link);
          }
          this.GetCommunityResultMatrix();
          var statements = {
            Matrix_type: this.Matrix_type,
            MyPCA_D_Value: this.MyPCA_D_Value,
            graph: this.Matrix,
            algorithm: this.communityDiscoveryAlgorithm,
            currentDataPattern: this.currentDataPattern
          };
          console.log(statements)
          const req = this.axios.create({
            baseURL: "",
            headers: {},
            timeout: 10000,
            method: "post",
          });
          req
            .post("http://39.105.230.175:8110/community_Detection", {
          statements: statements,
          })
            .then((response) => {
              console.log(response.data)
          console.log("数据");
          this.communityDectionResult = response;
          let copiedArray = JSON.parse(JSON.stringify(this.communtiyFiltedNodes));
          var category_num = new Array(1000).fill(-1);
          var max = 0 ;
          for (let i = 0; i < copiedArray.length; i++) {
            const nodeId = copiedArray[i].id;
            copiedArray[i].category = response.data.partition[nodeId];
            if (category_num[copiedArray[i].category]!=-1) {
              if (copiedArray[i].category > max) {
                max = copiedArray[i].category;
              }
              category_num[copiedArray[i].category] = 1;
            } {
              category_num[copiedArray[i].category] += 1;
            }
          }   
          var communityInfo = this.communityDectionResult.data.community_info
          let community_info_array = []
          for (const key of Object.keys(communityInfo)) {
            let community_info_item = {
              name: "社区" + (parseInt(key) + 1),
              symbol: this.symbolOptions[key % 4],
            }
            community_info_array.push(community_info_item)
          }
          var copy_category = Array.from(community_info_array)
          for (var i = 0; i < copy_category.length; i++) {
              if (i <= max) {
                copy_category[i].name = "社区" + (i + 1); // 修改name属性
              } else {
                  // 如果超过max个对象，从列表中删除对象
                  copy_category.splice(i, 1);
                  i--; // 减小索引以避免跳过下一个对象
              }
          }
          let community_Dection_links= JSON.parse(JSON.stringify(this.communtiyFiltedLinks));
          var community_count = {};
          // 统计社区之间关系的强度
          for (var m=0;m<community_Dection_links.length;m++){
            if (response.data.partition[community_Dection_links[m].source]!=response.data.partition[community_Dection_links[m].target]){
              if (response.data.partition[community_Dection_links[m].source] in community_count){
                community_count[response.data.partition[community_Dection_links[m].source]].out += community_Dection_links[m].lineStyle.width
              } else {
                  var s_dgree = {
                  "out":community_Dection_links[m].lineStyle.width,
                  "in":0
                  }
                    community_count[response.data.partition[community_Dection_links[m].source]] = s_dgree
              }
              if (response.data.partition[community_Dection_links[m].target] in community_count){
                community_count[response.data.partition[community_Dection_links[m].target]].in+= community_Dection_links[m].lineStyle.width
              } else {
                  var t_dgree = {
                  "out":community_Dection_links[m].lineStyle.width,
                  "in":0
                  }
                    community_count[response.data.partition[community_Dection_links[m].target]] = t_dgree
              }
            }
          }
          let filter_result = community_Dection_links.filter(item => response.data.partition[item.source]==response.data.partition[item.target]);
          

          copiedArray.forEach((dict1) => {
            this.customShapes.forEach((dict2) => {
              if (dict2['name'] === dict1['value']) {
                dict1['symbol'] = dict2['symbol']
              }
            })
          });

          var community_Dection_graph = {
            partition: response.data.partition,
            community_relationship: response.data.community_relationship,
            community_info: response.data.community_info,
            community_count_dgree:community_count,      
            title: {
              text: '社区发现',
              subtext: 'Default layout',
              top: 'bottom',
              left: 'right'
            },
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.SymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            toolbox: {
              //echart保存为图片
              show: true,
              left: 20,
              feature: {
                mark: {
                  show: true,
                },
                restore: {
                  show: true,
                },
                saveAsImage: {
                  show: true,
                  pixelRatio: 1,
                  title: "保存为图片",
                  type: "png",
                  lang: ["点击保存"],
                },
              },
            },
            legend: [
              {
                // selectedMode: 'single',
                data: community_info_array.map(function (a) {
                  return a.name;
                })
              }
            ],
            series: [
              {
                name: '社区发现',
                type: 'graph',
                layout: 'force',
                data: copiedArray,
                links: filter_result,
                categories: copy_category,
                roam: true,
                label: {
                  position: "right",
                  formatter: "{b}",
                  show: true, // 显示标签文字
                },
                lineStyle: {
                  // color: "source",myModal
                  curveness: 0.3,
                },
                select: {},
                emphasis: {
                  focus: "adjacency",
                  lineStyle: {
                    width: 10,
                  },
                },
                force: {
                  //力导布局参数
                  initLayout: "",
                  repulsion: 500,
                  gravity: 0.05,
                  edgeLength: [100, 500],
                  friction: 0.6,

                },
                draggable: true
              }
            ]
          };
          let newPromise = new Promise((resolve) => {
            resolve();
          });
          //然后异步执行echarts的初始化函数
          newPromise.then(() => {
            let routeUrl = this.$router.resolve({
              path: "/community",
              query: {
                id: 4
              }
            });
            console.log(community_Dection_graph)
            localStorage.setItem("msg", JSON.stringify(community_Dection_graph));
            console.log("传输新图的数据")
            window.open(routeUrl.href, '_blank');
          });
        })
            .catch((reason) => {
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
          this.communityDone = true;
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 queryfilted" + reason,
            type: "error",
          });
        });
    },
    community_Dection() {
      if(!this.communityDone) {
        this.community_Dection_Filter();
      } 
      else {
        let copiedArray = JSON.parse(JSON.stringify(this.communtiyFiltedNodes));
        var category_num = new Array(1000).fill(-1);
        var max = 0 ;
        for (let i = 0; i < copiedArray.length; i++) {
          const nodeId = copiedArray[i].id;
          copiedArray[i].category = this.communityDectionResult.data.partition[nodeId];
          if (category_num[copiedArray[i].category]!=-1) {
            if (copiedArray[i].category > max) {
              max = copiedArray[i].category;
            }
            category_num[copiedArray[i].category] = 1;
          } {
            category_num[copiedArray[i].category] += 1;
          }
        }   
        var communityInfo = this.communityDectionResult.data.community_info
        let community_info_array = []
        for (const key of Object.keys(communityInfo)) {
          let community_info_item = {
            name: "社区" + (parseInt(key) + 1),
            symbol: this.symbolOptions[key % 4],
          }
          community_info_array.push(community_info_item)
        }
        var copy_category = Array.from(community_info_array)
        for (var i = 0; i < copy_category.length; i++) {
            if (i <= max) {
              copy_category[i].name = "社区" + (i + 1); // 修改name属性
            } else {
                // 如果超过max个对象，从列表中删除对象
                copy_category.splice(i, 1);
                i--; // 减小索引以避免跳过下一个对象
            }
        }
        let community_Dection_links= JSON.parse(JSON.stringify(this.communtiyFiltedLinks));
        var community_count = {};
        // 统计社区之间关系的强度
        for (var m=0;m<community_Dection_links.length;m++){
          if (this.communityDectionResult.data.partition[community_Dection_links[m].source]!=this.communityDectionResult.data.partition[community_Dection_links[m].target]){
            if (this.communityDectionResult.data.partition[community_Dection_links[m].source] in community_count){
              community_count[this.communityDectionResult.data.partition[community_Dection_links[m].source]].out += community_Dection_links[m].lineStyle.width
            } else {
                var s_dgree = {
                "out":community_Dection_links[m].lineStyle.width,
                "in":0
                }
                  community_count[this.communityDectionResult.data.partition[community_Dection_links[m].source]] = s_dgree
            }
            if (this.communityDectionResult.data.partition[community_Dection_links[m].target] in community_count){
              community_count[this.communityDectionResult.data.partition[community_Dection_links[m].target]].in+= community_Dection_links[m].lineStyle.width
            } else {
                var t_dgree = {
                "out":community_Dection_links[m].lineStyle.width,
                "in":0
                }
                  community_count[this.communityDectionResult.data.partition[community_Dection_links[m].target]] = t_dgree
            }
          }
        }

        let filter_result = community_Dection_links.filter(item => this.communityDectionResult.data.partition[item.source]==this.communityDectionResult.data.partition[item.target]);
        copiedArray.forEach((dict1) => {
            this.customShapes.forEach((dict2) => {
              if (dict2['name'] === dict1['value']) {
                dict1['symbol'] = dict2['symbol']
              }
            })
          });
        var community_Dection_graph = {
          partition: this.communityDectionResult.data.partition,
          community_relationship: this.communityDectionResult.data.community_relationship,
          community_info: this.communityDectionResult.data.community_info,
          community_count_dgree:community_count,      
          title: {
            text: '社区发现',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
          },
          tooltip: {
            formatter: function (params) {
              var result = ''
              var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
              var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
              if (params.dataType == 'node') {
                result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.SymbolSize
              }
              if (params.dataType == 'edge') {
                result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
              }
              return result
            }
          },
          toolbox: {
            //echart保存为图片
            show: true,
            left: 20,
            feature: {
              mark: {
                show: true,
              },
              restore: {
                show: true,
              },
              saveAsImage: {
                show: true,
                pixelRatio: 1,
                title: "保存为图片",
                type: "png",
                lang: ["点击保存"],
              },
            },
          },
          legend: [
            {
              // selectedMode: 'single',
              data: community_info_array.map(function (a) {
                  return a.name;
              })
            }
          ],
          series: [
            {
              name: '社区发现',
              type: 'graph',
              layout: 'force',
              data: copiedArray,
              links: filter_result,
              categories: copy_category,
              roam: true,
              label: {
                position: "right",
                formatter: "{b}",
                show: true, // 显示标签文字
              },
              lineStyle: {
                // color: "source",myModal
                curveness: 0.3,
              },
              select: {},
              emphasis: {
                focus: "adjacency",
                lineStyle: {
                  width: 10,
                },
              },
              force: {
                //力导布局参数
                initLayout: "",
                repulsion: 500,
                gravity: 0.05,
                edgeLength: [100, 500],
                friction: 0.6
              },
              draggable: true
            }
          ]
        };
        let newPromise = new Promise((resolve) => {
          resolve();
        });
        //然后异步执行echarts的初始化函数
        newPromise.then(() => {
          let routeUrl = this.$router.resolve({
            path: "/community",
            query: {
              id: 4
            }
          });
          localStorage.setItem("msg", JSON.stringify(community_Dection_graph));
          console.log("传输新图的数据")
          console.log(community_Dection_graph)
          window.open(routeUrl.href, '_blank');
        });
      }
    },


    export_Community_Dection_Filter() {
      this.queryStruct.linkSizeSection[0] = this.communityRelSizeFilter[0];
      this.queryStruct.linkSizeSection[1] = this.communityRelSizeFilter[1];
      this.queryStruct.nodeSizeSection[0] = this.communityInsSizeFilter[0];
      this.queryStruct.nodeSizeSection[1] = this.communityInsSizeFilter[1];

      this.queryStruct.linkTypes.splice(0);
      for (var linktype of this.relTypes) {
        if (linktype.use == true) {
          this.queryStruct.linkTypes.push(linktype.name);
        }
      }
      this.export_Community_Query_Filter();
    },
    export_Community_Query_Filter() {
      var _this = this;
      this.queryStruct["categories"] = this.categories
      console.log("queryFilter")
      console.log(this.queryStruct)
      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.onlyFilter(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]); 
      console.log(this.currentDatabaseLink); 
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.communtiyFiltedLinks.splice(0);
          this.communtiyFiltedNodes.splice(0);
          var responseData0 = response.data.results[0].data;
          for (var node of responseData0[0].row[0]) {
            node["category"] = parseInt(node["category"]);
            node["realSymbolSize"] = node["symbolSize"]
            node["symbolSize"] = (node["symbolSize"] / 20000) * 200 + 50;
            this.communtiyFiltedNodes.push(node);
          }
          if (this.communtiyFiltedNodes.length > 1000) {
          this.openmap();
          return;
        }
          for (var link of responseData0[0].row[1]) {
            link["lineStyle"] = {
              color: link["color"],
              width: Math.ceil((link["width"]) / 2),
            };
            link["label"] = {
              formatter: "{c}",
            };
            this.communtiyFiltedLinks.push(link);
          }
          this.GetCommunityResultMatrix();
        var statements = {
          Matrix_type: this.Matrix_type,
          MyPCA_D_Value: this.MyPCA_D_Value,
          graph: this.Matrix,
          algorithm: this.communityDiscoveryAlgorithm,
          currentDataPattern: this.currentDataPattern
        };
        const req = this.axios.create({
          baseURL: "",
          headers: {},
          timeout: 10000,
          method: "post",
        });
        req
          .post("http://39.105.230.175:8110/community_Detection", {
            statements: statements,
          })
          .then((response) => {
            console.log("数据");
            this.communityDectionResult = response;
            //得到communityNodes，一个字典，key值是社区，value值是该社区对应的节点列表
            let categorizedDict = {};
            this.communityNodes = {};
            this.communityLinks = {};
            for (let key in response.data.partition) {
              let value = response.data.partition[key];
              if (!categorizedDict[value]) {
                  categorizedDict[value] = [key];
              } else {
                  categorizedDict[value].push(key);
              }
            }
            for (let key in categorizedDict) {
              let nodeIds = categorizedDict[key];
              let nodes = [];
              for (let nodeId of nodeIds) {
                let node = this.communtiyFiltedNodes.find(node => node.id === nodeId);
                if (node) {
                  nodes.push(node);
                }
              }
              this.communityNodes[key] = nodes;
            }
            //得到communityLinks，一个字典，key值是社区，value值是该社区对应的边列表
            for (let community in Object.keys(this.communityNodes)) {
              let edges = [];
              for (let edge of this.communtiyFiltedLinks) {
                // 检查边的两个节点是否属于同一社区
                let node1 = edge.source;
                let node2 = edge.target;
                if (response.data.partition[node1] == community && response.data.partition[node2] == community) {
                  edges.push(edge);
                }
              }
              this.communityLinks[community] = edges;         
            }

            let copiedArray = JSON.parse(JSON.stringify(this.communtiyFiltedNodes));
            var category_num = new Array(1000).fill(-1);
            var max = 0 ;
            for (let i = 0; i < copiedArray.length; i++) {
              const nodeId = copiedArray[i].id;
              copiedArray[i].category = response.data.partition[nodeId];
              if (category_num[copiedArray[i].category]!=-1) {
                if (copiedArray[i].category > max) {
                  max = copiedArray[i].category;
                }
                category_num[copiedArray[i].category] = 1;
              } {
                category_num[copiedArray[i].category] += 1;
              }
            }
            var copy_category = Array.from(this.graph.categories)
            for (var i = 0; i < copy_category.length; i++) {
                if (i <= max) {
                  copy_category[i].name = "社区" + (i + 1); // 修改name属性
                } else {
                    // 如果超过max个对象，从列表中删除对象
                    copy_category.splice(i, 1);
                    i--; // 减小索引以避免跳过下一个对象
                }
            }
            let community_Dection_links= JSON.parse(JSON.stringify(this.communtiyFiltedLinks));
            var community_count = {};
            // 统计社区之间关系的强度
            for (var m=0;m<community_Dection_links.length;m++){
              if (response.data.partition[community_Dection_links[m].source]!=response.data.partition[community_Dection_links[m].target]){
                if (response.data.partition[community_Dection_links[m].source] in community_count){
                  community_count[response.data.partition[community_Dection_links[m].source]].out += community_Dection_links[m].lineStyle.width
                } else {
                    var s_dgree = {
                    "out":community_Dection_links[m].lineStyle.width,
                    "in":0
                    }
                    community_count[response.data.partition[community_Dection_links[m].source]] = s_dgree
                }
                if (response.data.partition[community_Dection_links[m].target] in community_count){
                  community_count[response.data.partition[community_Dection_links[m].target]].in+= community_Dection_links[m].lineStyle.width
                } else {
                    var t_dgree = {
                    "out":community_Dection_links[m].lineStyle.width,
                    "in":0
                    }
                      community_count[response.data.partition[community_Dection_links[m].target]] = t_dgree
                }
              }
            }


            var workbook1 = {
              SheetNames: ["距离矩阵", "关系类型矩阵", "关系强度矩阵"],
              Sheets: {},
            };
            for (var x = 0; x <= 2; x++) {
              var aoa = [];
              for(let i = 0; i < Object.keys(this.communityNodes).length; i++) {               
                this.GetCommunityMatrix(i,this.communityNodes[i],this.communityLinks[i]);
                if (this.communityNodes[i].length > 400) {
                  this.open();
                  return;
                }
                let ShortPathTable = Floyd(this.communityMatrix[i]);   
                var communityTitle = [];
                var head = ["实体", "实体类型", "实体频次"];
                var row = [];
                for (var k = 0; k < this.communityNodes[i].length + 3; k++) {
                  if (k == 0) {
                  for (var j = 0; j < this.communityNodes[i].length + 3; j++) {
                    var mystr = "社区" + (i + 1);      
                    communityTitle.push(mystr)         
                  }
                  aoa.push(communityTitle);
                  } 
                  else if(k == 1) {
                    for (var e = 0; e < this.communityNodes[i].length; e++) {
                      var mystr2 = "";
                      if (x == 0) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2);
                      } else if (x == 1) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2); 
                      } else if (x == 2) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2);
                      }
                    }
                    aoa.push(head);
                  }
                  else if(k >=2 && k < this.communityNodes[i].length + 2){
                  row = [];
                  row.push(this.communityNodes[i][k - 2].name);
                  row.push(this.communityNodes[i][k - 2].value);
                  row.push(Math.round(this.communityNodes[i][k - 2].symbolSize));
                  for (var j1 = 0; j1 < this.communityNodes[i].length; j1++) {
                    if (j1 == k - 2) {
                      if (x == 0) {
                        row.push("0");
                      } else if (x == 1) {
                        row.push("Null");
                      } else if (x == 2) {
                        row.push("Null");
                      }
                    } else {
                      if (x == 0) {
                        /*console.log(ShortPathTable)
                        console.log(k-2)
                        console.log(j1)
                        console.log(ShortPathTable[k - 2][j1])*/
                        row.push(ShortPathTable[k - 2][j1] + "");
                      }
                      if (
                        this.communityMatrix[i]["arc"]["data"][k - 2][j1] != Infinity &&
                        this.communityMatrix[i]["arc"]["data"][k - 2][j1] != 0
                      ) {
                        if (x == 1) {
                          row.push(this.communityMatrix[i]["arc"]["data"][k - 2][j1].relation);
                        } else if (x == 2) {
                          row.push(this.communityMatrix[i]["arc"]["data"][k - 2][j1].width);
                        }
                      } else {
                        if (x == 1) {
                          row.push("Null");
                        } else if (x == 2) {
                          row.push("Null");
                        }
                      }
                    }
                  }
                  aoa.push(row);
                  }
                  else{
                    for (var d = 0; d < this.communityNodes[i].length + 3; d++) {
                      var mystr1 = "";               
                    }
                    aoa.push(mystr1);
                  }
                }
              }  
              var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
              if (x == 0) {
                workbook1.Sheets["距离矩阵"] = sheet_i;
              } else if (x == 2) {
                workbook1.Sheets["关系强度矩阵"] = sheet_i;
              } else if (x == 1) {
                workbook1.Sheets["关系类型矩阵"] = sheet_i;
              }
            }
            console.log(aoa)
            openDownloadDialog(sheet2blob(workbook1), "社区导出子图.xlsx");
          })
          this.communityDone = true;

        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 queryfilted" + reason,
            type: "error",
          });
        });
    },
    export_Community_Dection() {
      //先计算社区，如果之前没有被计算过
      if(!this.communityDone) {
        this.export_Community_Dection_Filter();
      }  
      else {
        let categorizedDict = {};
        for (let key in this.communityDectionResult.data.partition) {
          let value = this.communityDectionResult.data.partition[key];
          if (!categorizedDict[value]) {
              categorizedDict[value] = [key];
          } else {
              categorizedDict[value].push(key);
          }
        }
        for (let key in categorizedDict) {
          let nodeIds = categorizedDict[key];
          let nodes = [];
          for (let nodeId of nodeIds) {
            let node = this.filtedNodes.find(node => node.id === nodeId);
            if (node) {
              nodes.push(node);
            }
          }
          this.communityNodes[key] = nodes;
        }
        //得到communityLinks，一个字典，key值是社区，value值是该社区对应的边列表
        for (let community in Object.keys(this.communityNodes)) {
          let edges = [];
          for (let edge of this.filtedLinks) {
            // 检查边的两个节点是否属于同一社区
            let node1 = edge.source;
            let node2 = edge.target;
            if (this.communityDectionResult.data.partition[node1] == community && this.communityDectionResult.data.partition[node2] == community) {
              edges.push(edge);
            }
          }
          this.communityLinks[community] = edges;         
        }


        let copiedArray = JSON.parse(JSON.stringify(this.communtiyFiltedNodes));
        var category_num = new Array(1000).fill(-1);
        var max = 0 ;
        for (let i = 0; i < copiedArray.length; i++) {
          const nodeId = copiedArray[i].id;
          copiedArray[i].category = this.communityDectionResult.data.partition[nodeId];
          if (category_num[copiedArray[i].category]!=-1) {
            if (copiedArray[i].category > max) {
              max = copiedArray[i].category;
            }
            category_num[copiedArray[i].category] = 1;
          } {
            category_num[copiedArray[i].category] += 1;
          }
        }
        var copy_category = Array.from(this.graph.categories)
        for (var i = 0; i < copy_category.length; i++) {
            if (i <= max) {
              copy_category[i].name = "社区" + (i + 1); // 修改name属性
            } else {
                // 如果超过max个对象，从列表中删除对象
                copy_category.splice(i, 1);
                i--; // 减小索引以避免跳过下一个对象
            }
        }
        let community_Dection_links= JSON.parse(JSON.stringify(this.communtiyFiltedLinks));
        var community_count = {};
        // 统计社区之间关系的强度
        for (var m=0;m<community_Dection_links.length;m++){
          if (this.communityDectionResult.data.partition[community_Dection_links[m].source]!=this.communityDectionResult.data.partition[community_Dection_links[m].target]){
            if (this.communityDectionResult.data.partition[community_Dection_links[m].source] in community_count){
              community_count[this.communityDectionResult.data.partition[community_Dection_links[m].source]].out += community_Dection_links[m].lineStyle.width
            } else {
                var s_dgree = {
                "out":community_Dection_links[m].lineStyle.width,
                "in":0
                }
                community_count[this.communityDectionResult.data.partition[community_Dection_links[m].source]] = s_dgree
            }
            if (this.communityDectionResult.data.partition[community_Dection_links[m].target] in community_count){
              community_count[this.communityDectionResult.data.partition[community_Dection_links[m].target]].in+= community_Dection_links[m].lineStyle.width
            } else {
                var t_dgree = {
                "out":community_Dection_links[m].lineStyle.width,
                "in":0
                }
                  community_count[this.communityDectionResult.data.partition[community_Dection_links[m].target]] = t_dgree
            }
          }
        }

        var workbook1 = {
              SheetNames: ["距离矩阵", "关系类型矩阵", "关系强度矩阵"],
              Sheets: {},
            };
            for (var x = 0; x <= 2; x++) {
              var aoa = [];
              for(let i = 0; i < Object.keys(this.communityNodes).length; i++) {               
                this.GetCommunityMatrix(i,this.communityNodes[i],this.communityLinks[i]);
                if (this.communityNodes[i].length > 400) {
                  this.open();
                  return;
                }
                let ShortPathTable = Floyd(this.communityMatrix[i]);   
                var communityTitle = [];
                var head = ["实体", "实体类型", "实体频次"];
                var row = [];
                for (var k = 0; k < this.communityNodes[i].length + 3; k++) {
                  if (k == 0) {
                  for (var j = 0; j < this.communityNodes[i].length + 3; j++) {
                    var mystr = "社区" + (i + 1);      
                    communityTitle.push(mystr)         
                  }
                  aoa.push(communityTitle);
                  } 
                  else if(k == 1) {
                    for (var e = 0; e < this.communityNodes[i].length; e++) {
                      var mystr2 = "";
                      if (x == 0) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2);
                      } else if (x == 1) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2); 
                      } else if (x == 2) {
                        mystr2 = this.communityNodes[i][e].name;
                        head.push(mystr2);
                      }
                    }
                    aoa.push(head);
                  }
                  else if(k >=2 && k < this.communityNodes[i].length + 2){
                  row = [];
                  row.push(this.communityNodes[i][k - 2].name);
                  row.push(this.communityNodes[i][k - 2].value);
                  row.push(Math.round(this.communityNodes[i][k - 2].symbolSize));
                  for (var j1 = 0; j1 < this.communityNodes[i].length; j1++) {
                    if (j1 == k - 2) {
                      if (x == 0) {
                        row.push("0");
                      } else if (x == 1) {
                        row.push("Null");
                      } else if (x == 2) {
                        row.push("Null");
                      }
                    } else {
                      if (x == 0) {
                        /*console.log(ShortPathTable)
                        console.log(k-2)
                        console.log(j1)
                        console.log(ShortPathTable[k - 2][j1])*/
                        row.push(ShortPathTable[k - 2][j1] + "");
                      }
                      if (
                        this.communityMatrix[i]["arc"]["data"][k - 2][j1] != Infinity &&
                        this.communityMatrix[i]["arc"]["data"][k - 2][j1] != 0
                      ) {
                        if (x == 1) {
                          row.push(this.communityMatrix[i]["arc"]["data"][k - 2][j1].relation);
                        } else if (x == 2) {
                          row.push(this.communityMatrix[i]["arc"]["data"][k - 2][j1].width);
                        }
                      } else {
                        if (x == 1) {
                          row.push("Null");
                        } else if (x == 2) {
                          row.push("Null");
                        }
                      }
                    }
                  }
                  aoa.push(row);
                  }
                  else{
                    for (var d = 0; d < this.communityNodes[i].length + 3; d++) {
                      var mystr1 = "";               
                    }
                    aoa.push(mystr1);
                  }
                }
              }  
              var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
              if (x == 0) {
                workbook1.Sheets["距离矩阵"] = sheet_i;
              } else if (x == 2) {
                workbook1.Sheets["关系强度矩阵"] = sheet_i;
              } else if (x == 1) {
                workbook1.Sheets["关系类型矩阵"] = sheet_i;
              }
            }
            openDownloadDialog(sheet2blob(workbook1), "社区导出子图.xlsx");
      } 
    },



 
    community_Dection_Relationship_Network_Filter() {
      this.queryStruct.linkSizeSection[0] = this.communityRelSizeFilter[0];
      this.queryStruct.linkSizeSection[1] = this.communityRelSizeFilter[1];
      this.queryStruct.nodeSizeSection[0] = this.communityInsSizeFilter[0];
      this.queryStruct.nodeSizeSection[1] = this.communityInsSizeFilter[1];

      this.queryStruct.linkTypes.splice(0);
      for (var linktype of this.relTypes) {
        if (linktype.use == true) {
          this.queryStruct.linkTypes.push(linktype.name);
        }
      }
      this.community_Query_Relationship_Network_Filter();
    },
    community_Query_Relationship_Network_Filter() {
      var _this = this;
      this.queryStruct["categories"] = this.categories
      console.log("queryFilter")
      console.log(this.queryStruct)
      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.onlyFilter(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]); 
      console.log(this.currentDatabaseLink); 
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.communtiyFiltedLinks.splice(0);
          this.communtiyFiltedNodes.splice(0);
          var responseData0 = response.data.results[0].data;
          for (var node of responseData0[0].row[0]) {
            node["category"] = parseInt(node["category"]);
            node["realSymbolSize"] = node["symbolSize"]
            node["symbolSize"] = (node["symbolSize"] / 20000) * 200 + 50;
            this.communtiyFiltedNodes.push(node);
          }
          if (this.communtiyFiltedNodes.length > 1000) {
          this.openmap();
          return;
        }
          for (var link of responseData0[0].row[1]) {
            link["lineStyle"] = {
              color: link["color"],
              width: Math.ceil((link["width"]) / 2),
            };
            link["label"] = {
              formatter: "{c}",
            };
            this.communtiyFiltedLinks.push(link);
          }
          this.GetCommunityResultMatrix();
        var statements = {
        Matrix_type: this.Matrix_type,
        MyPCA_D_Value: this.MyPCA_D_Value,
        graph: this.Matrix,
        algorithm: this.communityDiscoveryAlgorithm,
        currentDataPattern: this.currentDataPattern
        };
        const req = this.axios.create({
        baseURL: "",
        headers: {},
        timeout: 10000,
        method: "post",
      });
        req
          .post("http://39.105.230.175:8110/community_Detection", {
          statements: statements,
        })
          .then((response) => {

            console.log(response)
              this.communityDectionResult = response
              var community_relationship = this.communityDectionResult.data.community_relationship

              let community_info_array = []
              let copiedArray = JSON.parse(JSON.stringify(community_relationship['nodes']));
              var category_num = new Array(1000).fill(-1);
              var max = 0 ;
              for (const key of Object.keys(this.communityDectionResult.data.community_info)) {
                  let community_info_item = {
                    name: "社区" + (parseInt(key) + 1),
                    symbol: this.symbolOptions[key % 4],
                  }
                  community_info_array.push(community_info_item)
              }
              for (let i = 0; i < copiedArray.length; i++) {
                const nodeId = copiedArray[i].id;
                copiedArray[i].category = this.communityDectionResult.data.partition[nodeId];
                if (category_num[copiedArray[i].category]!=-1) {
                  if (copiedArray[i].category > max) {
                    max = copiedArray[i].category;
                  }
                  category_num[copiedArray[i].category] = 1;
                } {
                  category_num[copiedArray[i].category] += 1;
                }
              }

              var relationship_network_graph = {
                community_info: response.data.community_info,
                title: {
                  text: '社区关系网络图',
                  subtext: 'Default layout',
                  top: 'bottom',
                  left: 'right'
                },
                toolbox: {
                  //echart保存为图片
                  show: true,
                  left: 20,
                  feature: {
                    mark: {
                      show: true,
                    },
                    restore: {
                      show: true,
                    },
                    saveAsImage: {
                      show: true,
                      pixelRatio: 1,
                      title: "保存为图片",
                      type: "png",
                      lang: ["点击保存"],
                    },
                  },
                },
                legend: [
                  {
                    // selectedMode: 'single',
                    data: community_info_array.map(function (a) {
                      var m = {
                        name: a.name,
                        icon: a.symbol,
                      };
                      return m;
                    })
                  }
                ],
                series: [
                  {
                    labelLayout: {
                      hideOverlap: true, // 标签重叠自动隐藏
                    },
                    selectedMode: true,
                    draggable: true,
                    edgeSymbol: ["circle", "arrow"], // 设置箭头
                    edgeSymbolSize: [1, 8], // 设置箭头的大小
                    name: "社区发现",
                    type: "graph",
                    layout: "force",
                    data: community_relationship['nodes'],
                    // 实际用到的数据是过滤后的节点
                    links: community_relationship['links'], // 过滤后的关系
                    categories: community_info_array, // 分类
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
                    force: {
                      //力导布局参数
                      initLayout: "",
                      repulsion: 500,
                      gravity: 0.05,
                      edgeLength: [100, 500],
                      friction: 0.6,
                    },
                  },
                ],
              };

              console.log(relationship_network_graph)
              let newPromise = new Promise((resolve) => {
                  resolve();
              });
              //然后异步执行echarts的初始化函数
              newPromise.then(() => {

                  let routeUrl = this.$router.resolve({
                    path: "/communityNetwork",
                    query: {
                      id: 1
                    }
                  });
                  localStorage.setItem("msg", JSON.stringify(relationship_network_graph));
                  window.open(routeUrl.href, '_blank');
                });
              });
        this.communityDone = true;
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 queryfilted" + reason,
            type: "error",
          });
        });
    },
    show_Relationship_Network_Graph() {
      if(!this.communityDone) {
        this.community_Dection_Relationship_Network_Filter();
      } 
      else {
        var community_relationship = this.communityDectionResult.data.community_relationship
        let community_info_array = []
        let copiedArray = JSON.parse(JSON.stringify(community_relationship['nodes']));
        var category_num = new Array(1000).fill(-1);
        var max = 0 ;
        for (const key of Object.keys(this.communityDectionResult.data.community_info)) {
            let community_info_item = {
              name: "社区" + (parseInt(key) + 1),
              symbol: this.symbolOptions[key % 4],
            }
            community_info_array.push(community_info_item)
        }
        for (let i = 0; i < copiedArray.length; i++) {
          const nodeId = copiedArray[i].id;
          copiedArray[i].category = this.communityDectionResult.data.partition[nodeId];
          if (category_num[copiedArray[i].category]!=-1) {
            if (copiedArray[i].category > max) {
              max = copiedArray[i].category;
            }
            category_num[copiedArray[i].category] = 1;
          } {
            category_num[copiedArray[i].category] += 1;
          }
        }
        var relationship_network_graph = {
          community_info: this.communityDectionResult.data.community_info,
                title: {
                  text: '社区关系网络图',
                  subtext: 'Default layout',
                  top: 'bottom',
                  left: 'right'
                },
                toolbox: {
                  //echart保存为图片
                  show: true,
                  left: 20,
                  feature: {
                    mark: {
                      show: true,
                    },
                    restore: {
                      show: true,
                    },
                    saveAsImage: {
                      show: true,
                      pixelRatio: 1,
                      title: "保存为图片",
                      type: "png",
                      lang: ["点击保存"],
                    },
                  },
                },
                legend: [
                  {
                    // selectedMode: 'single',
                    data: community_info_array.map(function (a) {
                      var m = {
                        name: a.name,
                        icon: a.symbol,
                      };
                      return m;
                    })
                  }
                ],
                series: [
                  {
                    labelLayout: {
                      hideOverlap: true, // 标签重叠自动隐藏
                    },
                    selectedMode: true,
                    draggable: true,
                    edgeSymbol: ["circle", "arrow"], // 设置箭头
                    edgeSymbolSize: [1, 8], // 设置箭头的大小
                    name: "社区发现",
                    type: "graph",
                    layout: "force",
                    data: community_relationship['nodes'],
                    // 实际用到的数据是过滤后的节点
                    links: community_relationship['links'], // 过滤后的关系
                    categories: community_info_array, // 分类
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
                    force: {
                      //力导布局参数
                      initLayout: "",
                      repulsion: 500,
                      gravity: 0.05,
                      edgeLength: [100, 500],
                      friction: 0.6,
                    },
                  },
                ],
        };
        console.log(relationship_network_graph)
        let newPromise = new Promise((resolve) => {
                  resolve();
        });
        //然后异步执行echarts的初始化函数
        newPromise.then(() => {
          let routeUrl = this.$router.resolve({
            path: "/communityNetwork",
            query: {
              id: 2
            }
          });
          localStorage.setItem("msg", JSON.stringify(relationship_network_graph));
          window.open(routeUrl.href, '_blank');
        });
      }
    },



    community_Dection_Relationship_Heatmap_Filter() {
      this.queryStruct.linkSizeSection[0] = this.communityRelSizeFilter[0];
      this.queryStruct.linkSizeSection[1] = this.communityRelSizeFilter[1];
      this.queryStruct.nodeSizeSection[0] = this.communityInsSizeFilter[0];
      this.queryStruct.nodeSizeSection[1] = this.communityInsSizeFilter[1];

      this.queryStruct.linkTypes.splice(0);
      for (var linktype of this.relTypes) {
        if (linktype.use == true) {
          this.queryStruct.linkTypes.push(linktype.name);
        }
      }
      this.community_Query_Relationship_Heatmap_Filter();
    },
    community_Query_Relationship_Heatmap_Filter() {
      var _this = this;
      this.queryStruct["categories"] = this.categories
      console.log("queryFilter")
      console.log(this.queryStruct)
      let myCQL = new QueryCQL(this.queryStruct);
      let statements = [
        {
          statement: myCQL.onlyFilter(this.queryStruct),
        },
      ];
      console.log(statements[0]["statement"]); 
      console.log(this.currentDatabaseLink); 
      this.ax
        .post(this.currentDatabaseLink, {
          statements: statements,
        })
        .then((response) => {
          this.communtiyFiltedLinks.splice(0);
          this.communtiyFiltedNodes.splice(0);
          var responseData0 = response.data.results[0].data;
          for (var node of responseData0[0].row[0]) {
            node["category"] = parseInt(node["category"]);
            node["realSymbolSize"] = node["symbolSize"]
            node["symbolSize"] = (node["symbolSize"] / 20000) * 200 + 50;
            this.communtiyFiltedNodes.push(node);
          }
          if (this.communtiyFiltedNodes.length > 1000) {
          this.openmap();
          return;
          }
          for (var link of responseData0[0].row[1]) {
            link["lineStyle"] = {
              color: link["color"],
              width: Math.ceil((link["width"]) / 2),
            };
            link["label"] = {
              formatter: "{c}",
            };
            this.communtiyFiltedLinks.push(link);
          }
          this.GetCommunityResultMatrix();
        var statements = {
        Matrix_type: this.Matrix_type,
        MyPCA_D_Value: this.MyPCA_D_Value,
        graph: this.Matrix,
        algorithm: this.communityDiscoveryAlgorithm,
        currentDataPattern: this.currentDataPattern
        };
        const req = this.axios.create({
        baseURL: "",
        headers: {},
        timeout: 10000,
        method: "post",
      });
        req
          .post("http://39.105.230.175:8110/community_Detection", {
          statements: statements,
        })
          .then((response) => {
          this.communityDectionResult = response
          var community_name = []
          var community_id = Object.keys(response.data.community_info);
          for(var id in community_id) {
            var id_name = '社区' + (parseInt(id)+1)
            community_name.push(id_name)
          }
          var heatmapArray = this.communityDectionResult.data.heatmapArray
          const hours = community_name
          // prettier-ignore
          const days = hours;
          // prettier-ignore
          const data = heatmapArray.map(function (item) {
              return [item[1], item[0], item[2] || '-'];
            });
            console.log(hours)
            console.log(data)
          const heatMapOption = {
            title: {
              text: "社区关系热力图",
            },
            tooltip: {
              position: "top",
            },
            toolbox: {
              //echart保存为图片
              show: true,
              left: 300,
              feature: {
                mark: {
                  show: true,
                },
                restore: {
                  show: true,
                },
                saveAsImage: {
                  show: true,
                  pixelRatio: 1,
                  title: "保存为图片",
                  type: "png",
                  lang: ["点击保存"],
                },
              },
            },
            grid: {
              height: "80%",
              weight: "70%",
              top: "10%",
              bottom: "30%",
              margin: "10%"
            },
            xAxis: [
              {
                type: "category",
                data: hours,
                splitArea: {
                  show: true,
                },
                axisPointer: {
                  show: true,
                  type: "line",
                },
                axisLabel: {
                  interval: 0, //代表显示所有x轴标签显示
                  rotate: 10, //代表逆时针旋转45度
                },
              },
            ],
            yAxis: {
              type: "category",
              data: days,
              splitArea: {
                show: true,
              },
              axisLabel: {
                interval: 0, //代表显示所有x轴标签显示
                // rotate:45, //代表逆时针旋转45度
              },
            },
            dataZoom: [
              {
                show: true,
                xAxisIndex: [0, 1],
                type: "slider",
                top: "95%",
                start: 0,
                end: 40,
              },
              {
                show: true,
                yAxisIndex: [0, 1],
                type: "slider",
                right: "8%",
                start: 50,
                end: 100,
              },
            ],
            visualMap: {
              min: 0,
              max: 20,
              calculable: true,
              orient: "vertical",
              left: "right",
              bottom: "55%",
            },
            series: [
              {
                name: "Node Message",
                type: "heatmap",
                data: data,
                label: {
                  show: true,
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          let newPromise = new Promise((resolve) => {
            resolve();
          });
          //然后异步执行echarts的初始化函数
          newPromise.then(() => {
            let routeUrl = this.$router.resolve({
              path: "/communityHeatmap",
              query: {
                id: 1
              }
            });
            localStorage.setItem("msg", JSON.stringify(heatMapOption));
            window.open(routeUrl.href, '_blank');
          });
        })
          .catch((reason) => {
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
        this.communityDone = true;
        })
        .catch((reason) => {
          this.loading = false;
          this.$message({
            message: "出错了 queryfilted" + reason,
            type: "error",
          });
        });
    },
    show_Relationship_Heatmap() {
      if(!this.communityDone) {
        this.community_Dection_Relationship_Heatmap_Filter();
      } 
      else {
          var community_name = []
          var community_id = Object.keys(this.communityDectionResult.data.community_info);
          for(var id in community_id) {
            var id_name = '社区' + (parseInt(id)+1)
            community_name.push(id_name)
          }
          var heatmapArray = this.communityDectionResult.data.heatmapArray
          const hours = community_name
          // prettier-ignore
          const days = hours;
          // prettier-ignore
          const data = heatmapArray.map(function (item) {
              return [item[1], item[0], item[2] || '-'];
            });
            console.log(hours)
            console.log(data)
          const heatMapOption = {
            title: {
              text: "社区关系热力图",
            },
            tooltip: {
              position: "top",
            },
            toolbox: {
              //echart保存为图片
              show: true,
              left: 300,
              feature: {
                mark: {
                  show: true,
                },
                restore: {
                  show: true,
                },
                saveAsImage: {
                  show: true,
                  pixelRatio: 1,
                  title: "保存为图片",
                  type: "png",
                  lang: ["点击保存"],
                },
              },
            },
            grid: {
              height: "80%",
              weight: "70%",
              top: "10%",
              bottom: "30%",
              margin: "10%"
            },
            xAxis: [
              {
                type: "category",
                data: hours,
                splitArea: {
                  show: true,
                },
                axisPointer: {
                  show: true,
                  type: "line",
                },
                axisLabel: {
                  interval: 0, //代表显示所有x轴标签显示
                  rotate: 10, //代表逆时针旋转45度
                },
              },
            ],
            yAxis: {
              type: "category",
              data: days,
              splitArea: {
                show: true,
              },
              axisLabel: {
                interval: 0, //代表显示所有x轴标签显示
                // rotate:45, //代表逆时针旋转45度
              },
            },
            dataZoom: [
              {
                show: true,
                xAxisIndex: [0, 1],
                type: "slider",
                top: "95%",
                start: 0,
                end: 40,
              },
              {
                show: true,
                yAxisIndex: [0, 1],
                type: "slider",
                right: "8%",
                start: 50,
                end: 100,
              },
            ],
            visualMap: {
              min: 0,
              max: 20,
              calculable: true,
              orient: "vertical",
              left: "right",
              bottom: "55%",
            },
            series: [
              {
                name: "Node Message",
                type: "heatmap",
                data: data,
                label: {
                  show: true,
                },
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          let newPromise = new Promise((resolve) => {
            resolve();
          });
          //然后异步执行echarts的初始化函数
          newPromise.then(() => {
            let routeUrl = this.$router.resolve({
              path: "/communityHeatmap",
              query: {
                id: 2
              }
            });
            localStorage.setItem("msg", JSON.stringify(heatMapOption));
            window.open(routeUrl.href, '_blank');
          });
      }
    },


    algorithmChange() {
      this.communityDone = false;
    },
    submitSubGraph() {
      var statements = {
        nodeList: this.filtedNodes,
        linkList: this.filtedLinks,
        start: this.subGnode1Id,
        end: this.subGnode2Id,
        L: this.jumpFrom,
        R: this.jumpTo,
        N: this.limit
      };
      console.log(statements)
      const req = this.axios.create({
        baseURL: "",
        headers: {},
        timeout: 20000,
        method: "post",
      });
      req
        .post("http://39.105.230.175:8110/pathFinding", {
          statements: statements,
        })
        .then((response) => {
          console.log(response);
          var subGraphnodes = response.data.filternodes
          var subGraphlinks = response.data.filterlinks
          var mychart = echarts.init(document.getElementById('main'), "dark")
          mychart.clear()
          mychart.dispose()
          var mychart1 = echarts.init(document.getElementById('main'), "dark")
          var myoption = {
            title: {
              // 图标题
              text: "实体与关系",
              subtext: "Default layout",
              top: "bottom",
              left: "right",
            },
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.SymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            toolbox: {
              //echart保存为图片
              show: true,
              left: 20,
              feature: {
                mark: {
                  show: true,
                },
                restore: {
                  show: true,
                },
                saveAsImage: {
                  show: true,
                  pixelRatio: 1,
                  title: "保存为图片",
                  type: "png",
                  lang: ["点击保存"],
                },
              },
            },
            legend: [
              // 图正上方的实体类别选择按钮
              {
                data: this.graph.categories.map(function (a) {
                  var m = {
                    name: a.name,
                    icon: a.symbol,
                  };
                  return m;
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
                edgeSymbolSize: [1, 8], // 设置箭头的大小
                name: "实体与关系",
                type: "graph",
                // force: {
                //   //力导布局参数
                //   initLayout: "",
                //   repulsion: 200,
                //   gravity: 0.1,
                //   edgeLength: [100, 500],
                //   friction: 0.6,
                // },
                layout: "none",
                data: subGraphnodes, // 实际用到的数据是过滤后的节点
                links: subGraphlinks, // 过滤后的关系
                categories: this.graph.categories, // 分类
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
          console.log(myoption)
          mychart1.setOption(myoption, true)
        })
        .catch((reason) => {
          this.$message({
            message: "出错了 " + reason,
            type: "error",
          });
        });
    },
    requestTotalNodeNum() {
      if (this.showDisMap) {
        let statements = [
          {
            statement:
              "match (n) return count(*)",
          },
        ];
        this.ax
          .post(this.currentDatabaseLink, {
            statements: statements,
          })
          .then((response) => {
            this.symbolSizeArray = []
            this.percentArray = []
            this.loading = false;
            this.totalNodeNum = response.data.results[0].data[0].row[0];
            let data = require("./../datas/records.json");
            if(this.currentDataPattern == "旧数据") {
              data = require("./../datas/records.json");
            }
            else if(this.currentDataPattern == "标记数据") {
              data = require("./../datas/records2.json");
            } 
            else if(this.currentDataPattern == "新数据") {
              data = require("./../datas/records3.json");
            }
            else if(this.currentDataPattern == "大实体数据") {
              data = require("./../datas/records4.json");
            }
            for (let onedata of data) {
              this.symbolSizeArray.push(onedata.x);
              let percent = ((onedata.res / this.totalNodeNum) * 100).toFixed(2);
              this.percentArray.push(percent);
            }
            this.ShowDistributionMap();
          })
          .catch((reason) => {
            this.loading = false;
            this.$message({
              message: "出错了 " + reason,
              type: "error",
            });
          });
      }
      else {
        this.ShowDistributionMap();
      }
    },
    ShowDistributionMap() {
      const distributionMapOption = {
        title: {
          text: "节点大小百分比分布图",
          left: "center"
        },
        tooltip: {
          position: "top",
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 300,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "png",
              lang: ["点击保存"],
            },
          },
        },
        grid: {
          height: "80%",
          weight: "70%",
          top: "10%",
          bottom: "30%",
          margin: "10%"
        },
        xAxis: [
          {
            type: "category",
            name: "节点大小",
            data: this.symbolSizeArray,
            splitArea: {
              show: true,
            },
            axisPointer: {
              show: true,
              type: "line",
            },
            axisLabel: {
              interval: 5, //代表显示所有x轴标签显示
              rotate: 0, //代表逆时针旋转45度
            },
          },
        ],
        yAxis: {
          type: "value",
          name: "节点大小占比 %"
        },
        dataZoom: [
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "90%",
            start: 0,
            end: 10,
          },
        ],
        series: [
          {
            name: "percent",
            type: "line",
            data: this.percentArray,
            label: {
              show: true,
            },
            smooth: true,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.showDisMap = false;
      let newPromise = new Promise((resolve) => {
        resolve();
      });
      //然后异步执行echarts的初始化函数
      newPromise.then(() => {
        localStorage.removeItem("msg");
        let routeUrl = this.$router.resolve({
          path: "/home",
          query: {
            id: 3
          }
        });
        localStorage.setItem("msg", JSON.stringify(distributionMapOption));
        window.open(routeUrl.href, '_blank');
      });
    },
    ShowDistributionMapLogarithmic() {
      this.symbolSizeLogarithmicArray = []
      this.nodeNumLogarithmicArray = []
      this.loading = false;
      let data = require("./../datas/records.json");
      if(this.currentDataPattern == "旧数据") {
        data = require("./../datas/records.json");
      }
      else if(this.currentDataPattern == "标记数据") {
        data = require("./../datas/records2.json");
      } 
      else if(this.currentDataPattern == "新数据") {
        data = require("./../datas/records3.json");
      }
      else if(this.currentDataPattern == "大实体数据") {
        data = require("./../datas/records4.json");
      }
      if (this.symbolSizeLogarithmicArray.length == 0) {
        for (let onedata of data) {
          if(onedata.x == 0) {
            this.symbolSizeLogarithmicArray.push(0);
          }
          else {
            this.symbolSizeLogarithmicArray.push(Math.log10(onedata.x).toFixed(2));
          }
        }
      }
      if (this.nodeNumLogarithmicArray.length == 0) {
        for (let onedata of data) {
          if(onedata.res == 0) {
            this.nodeNumLogarithmicArray.push(0);
          }
          else {
            this.nodeNumLogarithmicArray.push(Math.log10(onedata.res).toFixed(2));
          }
        }
      }
      const distributionMapLogarithmicOption = {
        title: {
          text: "节点大小分布图",
          left: "center"
        },
        tooltip: {
          position: "top",
        },
        toolbox: {
          //echart保存为图片
          show: true,
          left: 300,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "png",
              lang: ["点击保存"],
            },
          },
        },
        grid: {
          height: "80%",
          weight: "70%",
          top: "10%",
          bottom: "30%",
          margin: "10%"
        },
        xAxis: [
          {
            type: "category",
            name: "节点大小",
            data: this.symbolSizeLogarithmicArray,
            splitArea: {
              show: true,
            },
            axisPointer: {
              show: true,
              type: "line",
            },
            axisLabel: {
              interval: 5, //代表显示所有x轴标签显示
              rotate: 0, //代表逆时针旋转45度
            },
          },
        ],
        yAxis: {
          type: "value",
          name: "节点大小个数"
        },
        dataZoom: [
          {
            show: true,
            xAxisIndex: [0, 1],
            type: "slider",
            top: "90%",
            start: 0,
            end: 10,
          },
        ],
        series: [
          {
            name: "nodeNum",
            type: "line",
            data: this.nodeNumLogarithmicArray,
            label: {
              show: true,
            },
            smooth: true,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      let newPromise = new Promise((resolve) => {
        resolve();
      });
      //然后异步执行echarts的初始化函数
      newPromise.then(() => {
        localStorage.removeItem("msg");
        let routeUrl = this.$router.resolve({
          path: "/home",
          query: {
            id: 5
          }
        });
        localStorage.setItem("msg", JSON.stringify(distributionMapLogarithmicOption));
        window.open(routeUrl.href, '_blank');
      });
    },
    // to do
    changeIns() {
      for (let i = 0; i < this.filtedNodes.length; i++) {
        if (this.filtedNodes[i].name == this.insNameNow) {
          this.filtedNodes[i].value = this.insValueNow;
          this.filtedNodes[i].category = this.insIdMap.indexOf(
            this.insValueNow
          );
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
      let main = echarts.init(document.getElementById("main"), "dark");
      main.setOption(this.option);
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
      this.filtedLinks.push(newLink);
      var ct = 0;
      for (var i = 0; i < this.filtedNodes.length; i++) {
        if (
          this.filtedNodes[i].id == this.node1Id ||
          this.filtedNodes[i].id == this.node2Id
        ) {
          this.filtedNodes[i].symbolSize += this.relValueNow;
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
      let main = echarts.init(document.getElementById("main"), "dark");
      main.setOption(this.option);
    },
    holdFixChange(value) {
      if (this.queryMode) {
        if (value) {
          this.allowNodedraggle();
        } else {
          var myChart = echarts.init(document.getElementById("main"), "dark");
          var myoption = {
            title: {
              // 图标题
              text: "实体与关系",
              subtext: "Default layout",
              top: "bottom",
              left: "right",
            },
            graphic: [],
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            toolbox: {
              //echart保存为图片
              show: true,
              left: 20,
              feature: {
                mark: {
                  show: true,
                },
                restore: {
                  show: true,
                },
                saveAsImage: {
                  show: true,
                  pixelRatio: 1,
                  title: "保存为图片",
                  type: "png",
                  lang: ["点击保存"],
                },
              },
            },
            legend: [
              // 图正上方的实体类别选择按钮
              {
                data: this.graph.categories.map(function (a) {
                  var m = {
                    name: a.name,
                    icon: a.symbol,
                  };
                  return m;
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
                edgeSymbolSize: [1, 8], // 设置箭头的大小
                name: "实体与关系",
                type: "graph",
                layout: "none",
                force: {
                  //力导布局参数
                  initLayout: "",
                  repulsion: 600,
                  gravity: 0.1,
                  edgeLength: [100, 500],
                  friction: 0.6,
                },
                data: this.filtedNodes, // 实际用到的数据是过滤后的节点
                links: this.filtedLinks, // 过滤后的关系
                categories: this.graph.categories, // 分类
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
          myChart.setOption(myoption, true);
        }
      } else {
        this.fixNodes = value;
      }
    },
    holdsaveChange(value) {
      this.autoSave = value;
    },
    GetMatrix() {
      //邻接矩阵
      //maxvex:顶点数
      //arcnum:边数
      function arc(maxvex, arcnum) {
        this.maxvex = maxvex;
        this.arcnum = arcnum;
        this.data = new Array(maxvex);
        for (var i = 0; i < this.data.length; i++) {
          this.data[i] = new Array(maxvex);
          for (var j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = Infinity;
            if (i == j) {
              this.data[i][j] = 0;
            }
          }
        }
      }
      //图
      function Mgraph(maxvex, arcnum, vertexs) {
        this.arc = new arc(maxvex, arcnum);
        this.vertexs = vertexs;
      }
      Mgraph.prototype.addArc = function (start, end, link) {
        var i = this.vertexs.indexOf(start);
        var j = this.vertexs.indexOf(end);
        this.arc.data[i][j] = link;
      };
      var vertexs = [];
      var id_to_pos = {};
      for (var i = 0; i < this.filtedNodes.length; i++) {
        var node = this.filtedNodes[i];
        vertexs.push(node);
        id_to_pos[node.id] = i;
      }
      var mgraph = new Mgraph(
        this.filtedNodes.length,
        this.filtedLinks.length,
        vertexs
      );
      for (var i1 = 0; i1 < this.filtedLinks.length; i1++) {
        var link = this.filtedLinks[i1];
        if (link.source in id_to_pos) {
          if (link.target in id_to_pos) {
            mgraph.addArc(
              vertexs[id_to_pos[link.source]],
              vertexs[id_to_pos[link.target]],
              link
            );
          }
        }
      }
      this.Matrix = mgraph;
    },
    GetCommunityMatrix(a,nodes,edges) {
      //邻接矩阵
      //maxvex:顶点数
      //arcnum:边数
      function arc(maxvex, arcnum) {
        this.maxvex = maxvex;
        this.arcnum = arcnum;
        this.data = new Array(maxvex);
        for (var i = 0; i < this.data.length; i++) {
          this.data[i] = new Array(maxvex);
          for (var j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = Infinity;
            if (i == j) {
              this.data[i][j] = 0;
            }
          }
        }
      }
      //图
      function Mgraph(maxvex, arcnum, vertexs) {
        this.arc = new arc(maxvex, arcnum);
        this.vertexs = vertexs;
      }
      Mgraph.prototype.addArc = function (start, end, link) {
        var i = this.vertexs.indexOf(start);
        var j = this.vertexs.indexOf(end);
        this.arc.data[i][j] = link;
      };
      var vertexs = [];
      var id_to_pos = {};
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        vertexs.push(node);
        id_to_pos[node.id] = i;
      }
      var mgraph = new Mgraph(
        nodes.length,
        edges.length,
        vertexs
      );
      for (var i1 = 0; i1 < edges.length; i1++) {
        var link = edges[i1];
        if (link.source in id_to_pos) {
          if (link.target in id_to_pos) {
            mgraph.addArc(
              vertexs[id_to_pos[link.source]],
              vertexs[id_to_pos[link.target]],
              link
            );
          }
        }
      }
      this.communityMatrix[a] = mgraph;
    },
    S_GetMatrix() {
      //邻接矩阵
      //maxvex:顶点数
      //arcnum:边数
      var vex = 200;

      function arc(maxvex, arcnum) {
        this.maxvex = maxvex;
        this.arcnum = arcnum;
        this.data = new Array(maxvex);
        for (var i = 0; i < this.data.length; i++) {
          this.data[i] = new Array(maxvex);
          for (var j = 0; j < this.data[i].length; j++) {
            this.data[i][j] = Infinity;
            if (i == j) {
              this.data[i][j] = 0;
            }
          }
        }
      }
      //图
      function Mgraph(maxvex, arcnum, vertexs) {
        this.arc = new arc(maxvex, arcnum);
        this.vertexs = vertexs;
      }
      Mgraph.prototype.addArc = function (start, end, link) {
        var i = this.vertexs.indexOf(start);
        var j = this.vertexs.indexOf(end);
        this.arc.data[i][j] = link;
      };
      var vertexs = [];
      var id_to_pos = {};
      this.filtedNodes.sort(function (a, b) {
        return -(a.symbolSize - b.symbolSize);
      });
      for (var i = 0; i < vex; i++) {
        var node = this.filtedNodes[i];
        console.log(node.symbolSize);
        vertexs.push(node);
        id_to_pos[node.id] = i;
      }
      var mgraph = new Mgraph(vex, this.filtedLinks.length, vertexs);
      for (var i1 = 0; i1 < this.filtedLinks.length; i1++) {
        var link = this.filtedLinks[i1];
        if (link.source in id_to_pos) {
          if (link.target in id_to_pos) {
            mgraph.addArc(
              vertexs[id_to_pos[link.source]],
              vertexs[id_to_pos[link.target]],
              link
            );
          }
        }
      }
      this.S_Matrix = mgraph;
    },
    saveExcel() {
      this.GetMatrix();
      console.log(this.Matrix)
      if (this.filtedNodes.length > 400) {
        this.open();
        return;
      }
      let ShortPathTable = Floyd(this.Matrix);
      var workbook = {
        SheetNames: ["距离矩阵", "关系类型矩阵", "关系强度矩阵"],
        Sheets: {},
      };
      for (var x = 0; x <= 2; x++) {

        var head = ["实体", "实体类型", "实体频次"];
        var row = [];
        var aoa = [];
        for (var i = 0; i < this.filtedNodes.length + 1; i++) {
          if (i == 0) {
            for (var j = 0; j < this.filtedNodes.length; j++) {
              var mystr = "";
              if (x == 0) {
                mystr = this.filtedNodes[j].name;
                head.push(mystr);
              } else if (x == 1) {
                mystr = this.filtedNodes[j].name;
                head.push(mystr); 
              } else if (x == 2) {
                mystr = this.filtedNodes[j].name;
                head.push(mystr);
              }
            }
            aoa.push(head);
          } else {
            row = [];
            row.push(this.filtedNodes[i - 1].name);
            row.push(this.filtedNodes[i - 1].value);
            row.push(Math.round(this.filtedNodes[i - 1].symbolSize));
            for (var j1 = 0; j1 < this.filtedNodes.length; j1++) {
              if (j1 == i - 1) {
                if (x == 0) {
                  row.push("0");
                } else if (x == 1) {
                  row.push("Null");
                } else if (x == 2) {
                  row.push("Null");
                }
              } else {
                if (x == 0) {
                  row.push(ShortPathTable[i - 1][j1] + "");
                }
                if (
                  this.Matrix["arc"]["data"][i - 1][j1] != Infinity &&
                  this.Matrix["arc"]["data"][i - 1][j1] != 0
                ) {
                  if (x == 1) {
                    row.push(this.Matrix["arc"]["data"][i - 1][j1].relation);
                  } else if (x == 2) {
                    row.push(this.Matrix["arc"]["data"][i - 1][j1].width);
                  }
                } else {
                  if (x == 1) {
                    row.push("Null");
                  } else if (x == 2) {
                    row.push("Null");
                  }
                }
              }
            }
            aoa.push(row);
          }
        }
        var sheet_i = XLSX.utils.aoa_to_sheet(aoa);
        if (x == 0) {
          workbook.Sheets["距离矩阵"] = sheet_i;
        } else if (x == 2) {
          workbook.Sheets["关系强度矩阵"] = sheet_i;
        } else if (x == 1) {
          workbook.Sheets["关系类型矩阵"] = sheet_i;
        }
      }
      openDownloadDialog(sheet2blob(workbook), "斑岩铜矿知识图谱导出子图.xlsx");
    },
    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    open() {
      this.$confirm("节点数量不应多于400个!", "提示", {
        confirmButtonText: "取消下载",
        //cancelButtonText: '取消',
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "取消下载EXCEL!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "当前节点数量过多，无法下载！",
          });
        });
    },
    openmap() {
      this.$confirm("节点数量不应多于1000个!", "提示", {
        confirmButtonText: "取消展示",
        //cancelButtonText: '取消',
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "当前节点数量过多，请重新进行筛选",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "当前节点数量过多，请重新进行筛选",
          });
        });
    },
    holdModeChange(value) {
      this.queryMode = value;
      if (value == true) {
        // 如果进入推理模式
        // 首先存储之前的模式
        let status = {
          relStatus: [],
          insFilterStatus: this.insSizeFilter,
          relFilterStatus: this.relSizeFilter,
          fixNodes: this.fixNodes,
          nodes: [],
          links: [],
        };
        for (let foo of this.relTypes) {
          status.relStatus.push(foo.use);
          foo.use = true;
        }
        for (let node of this.nodes) {
          status.nodes.push(node);
        }
        for (let link of this.links) {
          status.links.push(link);
        }
        this.modeStatusMemory = status;

        // 修改参数状态
        this.fixNodes = false;
        this.insSizeFilter = [0, this.maxSize];
        this.relSizeFilter = [0, this.maxWidth];
        this.filtedLinks.splice(0);
        this.filtedNodes.splice(0);
        this.enterqueryMode = true;
      } else {
        // 进行状态的恢复
        this.nodes.splice(0);
        this.links.splice(0);
        for (let key in this.relTypes) {
          this.relTypes[key].use = this.modeStatusMemory["relStatus"][key];
        }
        for (let node of this.modeStatusMemory["nodes"]) {
          this.nodes.push(node);
        }
        for (let link of this.modeStatusMemory["links"]) {
          this.links.push(link);
        }
        this.insSizeFilter = this.modeStatusMemory["insFilterStatus"];
        this.relSizeFilter = this.modeStatusMemory["relFilterStatus"];
        this.fixNodes = this.modeStatusMemory["fixNodes"];
      }
      this.updateGraph();
    },
    process_bar() {
      // 获取弹窗
      var modal = document.getElementById("myModal");
      // 获取 <span> 元素，用于关闭弹窗
      var span = document.querySelector(".close");
      // 点击按钮打开弹窗
      modal.style.display = "block";
      move();

      function move() {
        var elem = document.getElementById("myBar");
        var width = 10;
        var id = setInterval(frame, 10); //frame是要执行的代码，10是10毫秒
        function frame() {
          if (width >= 100) {
            clearInterval(id);
          } else {
            width++;
            elem.style.width = width + "%";
            elem.innerHTML = width * 1 + "%";
          }
        }
      }
      // 点击 <span> (x), 关闭弹窗
      span.onclick = function () {
        modal.style.display = "none";
      };
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
      // 在用户点击其他地方时，关闭弹窗
    },
    saveData() {
      let save = {
        nodes: this.nodes,
        links: this.links,
        categories: this.graph.categories,
        history: this.history,
      };

      // 如果是推理模式则只保留过滤后的节点
      if (this.queryMode) {
        for (let node of this.filtedNodes) {
          node.symbolSize = node.rawSymbolSize;
        }
        for (let link of this.filtedLinks) {
          link.lineStyle.width = link.lineStyle.width / 2;
        }
        save = {
          nodes: this.filtedNodes,
          links: this.filtedLinks,
          categories: this.graph.categories,
          history: [],
        };
      }

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
      const blob = new Blob([data], {
        type: "",
      });
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
    changeShape() {
      this.customShapes.splice(0);
      this.customShapes.push({ name: "ROCK", symbol: this.ROCKShape });
      this.customShapes.push({ name: "TECT", symbol: this.TECTShape });
      this.customShapes.push({ name: "ALTE", symbol: this.ALTEShape });
      this.customShapes.push({ name: "PHYS", symbol: this.PHYSShape });
      this.customShapes.push({ name: "CHEM", symbol: this.CHEMShape });
      this.customShapes.push({ name: "CHRO", symbol: this.CHROShape });
      this.customShapes.push({ name: "MINE", symbol: this.MINEShape });
      this.customShapes.push({ name: "DEPO", symbol: this.DEPOShape });
      this.customShapes.push({ name: "DEEP", symbol: this.DEEPShape });
      this.customShapes.push({ name: "ELEM", symbol: this.ELEMShape });
      this.customShapes.push({ name: "MEMO", symbol: this.MEMOShape });
      this.customShapes.push({ name: "DATA", symbol: this.DATAShape });

      this.option = {
        title: {
          // 图标题
          text: "实体与关系",
          subtext: "Default layout",
          top: "bottom",
          left: "right",
        },
        tooltip: {},
        toolbox: {
          //echart保存为图片
          show: true,
          left: 20,
          feature: {
            mark: {
              show: true,
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
              pixelRatio: 1,
              title: "保存为图片",
              type: "svg",
              lang: ["点击保存"],
            },
          },
        },

        legend: [
          // 图正上方的实体类别选择按钮
          {
            data: this.customShapes.map(function (a) {
              var m = {
                name: a.name,
                icon: a.symbol,
              };
              return m;
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
            tooltip: {
              formatter: function (params) {
                var result = ''
                var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#0090ff"></span>'
                var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ff7800"></span>'
                if (params.dataType == 'node') {
                  result += params.data.name + "</br>" + dotHtml + '节点类型：' + insIdMap[params.data.category] + "</br>" + dotHtml2 + '节点大小：' + params.data.realSymbolSize
                }
                if (params.dataType == 'edge') {
                  result += params.data.name1 + " --> " + params.data.name2 + "</br>" + dotHtml + '关系类型：' + params.data.relation + "</br>" + dotHtml2 + '关系频率：' + params.data.width
                }
                return result
              }
            },
            selectedMode: true,
            draggable: true,
            edgeSymbol: ["circle", "arrow"], // 设置箭头
            edgeSymbolSize: [1, 8], // 设置箭头的大小
            name: "实体与关系",
            type: "graph",
            layout: "force",
            force: {
              //力导布局参数
              initLayout: "",
              repulsion: 600,
              gravity: 0.1,
              edgeLength: [100, 500],
              friction: 0.6,
            },
            data: this.filtedNodes, // 实际用到的数据是过滤后的节点
            links: this.filtedLinks, // 过滤后的关系
            categories: this.customShapes, // 分类
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

      var myChart = echarts.getInstanceByDom(
        document.getElementById("main")
      );
      myChart.clear();
      myChart.dispose();
      document.getElementById("main").removeAttribute("_echarts_instance_");
      document.getElementById("main").innerHTML = "";
      //this.filter();
      let main = echarts.init(document.getElementById("main"), "dark", { renderer: 'svg' });
      main.setOption(this.option, true);
    },
    setTimeOut() {
      const req = this.axios.create({
        baseURL: "",
        headers: {
          // Accept: 'application/json',
          // charset:'utf-8',
        },
        // 认证用的属性
        auth: {
          username: "neo4j",
          password: "12345678",
          // 12345678
        },
        timeout: this.customTimeOut,
        method: "post",
      });
      this.ax = req;
      console.log(this.customTimeOut);
    },
    databaseChange() {
      if(this.currentDataPattern == "旧数据") {
        this.currentDatabaseLink = "http://39.105.230.175:7474/db/neo4j/tx/commit"
        this.relSizeFilter[0] = 1
        this.relSizeFilter[1] = 28
        this.insSizeFilter[0] = 2000
        this.insSizeFilter[1] = 10000
        this.communityInsSizeFilter[0] = 2000
        this.communityInsSizeFilter[1] = 10000
        this.communityRelSizeFilter[0] = 1
        this.communityRelSizeFilter[1] = 28
      }
      if(this.currentDataPattern == "新数据") {
        this.currentDatabaseLink = "http://39.105.230.175:8007/db/neo4j/tx/commit"
        this.relSizeFilter[0] = 1
        this.relSizeFilter[1] = 18
        this.insSizeFilter[0] = 20
        this.insSizeFilter[1] = 30
        this.communityInsSizeFilter[0] = 20
        this.communityInsSizeFilter[1] = 30
        this.communityRelSizeFilter[0] = 1
        this.communityRelSizeFilter[1] = 18
      }
      if(this.currentDataPattern == "大实体数据") {
        this.currentDatabaseLink = "http://39.105.230.175:8009/db/neo4j/tx/commit"
        this.relSizeFilter[0] = 1
        this.relSizeFilter[1] = 28
        this.insSizeFilter[0] = 500
        this.insSizeFilter[1] = 700
        this.communityInsSizeFilter[0] = 500
        this.communityInsSizeFilter[1] = 700
        this.communityRelSizeFilter[0] = 1
        this.communityRelSizeFilter[1] = 28
      }
      if(this.currentDataPattern == "标记数据") {
        this.currentDatabaseLink = "http://39.105.230.175:8005/db/neo4j/tx/commit"
        this.relSizeFilter[0] = 1
        this.relSizeFilter[1] = 28
        this.insSizeFilter[0] = 30
        this.insSizeFilter[1] = 50 
        this.communityInsSizeFilter[0] = 30
        this.communityInsSizeFilter[1] = 50
        this.communityRelSizeFilter[0] = 1
        this.communityRelSizeFilter[1] = 28
      }
      this.initData();
      this.updateGraph();

      this.showDisMap = true;
    }
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
  position: relative;
  top: 20px;
  height: 0px !important;
  text-align: center;
  line-height: 10px;
  padding-bottom: -10px !important;
}

.el-slider {
  width: 180px;
  margin-left: -30px;
  padding-top: 23px;
}

.slider-box {
  padding: 0px 40px;
}

.el-inp .el-slider {
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 10px;
}

.el-input {
  text-align: right;
  margin-top: 25px;
  margin-bottom: 5px;
}

.el-form {
  margin-top: 20px;
}


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
  padding: 10px 15px 5px 15px;
}

.query {
  padding: 10px 15px 5px 15px;
}

.relTypeButton {
  margin-left: 5px !important;
  margin-bottom: 5px !important;
  width: 150px;
  color: #2c3e50;
}

.el-input-number {
  width: 90px;
}


.slider-row-left {
  padding-left: 5px;
  text-align: left !important;
}

.filter-scrollbar {
  margin-left: 2px;
  margin-right: 2px;
  background-color: #bbd1eb;
}

.slider-row-right {
  padding-left: 30px;
  text-align: left !important;
}

.select-box {
  width: 140px;
  margin-left: 5px;
  margin-bottom: 5px;
}

.symbol-select-box {
  position: relative;
  float: left;
  width: 110px;
  padding-right: 25px;
}

.button-label {
  width: 140px;
  margin-left: 5px !important;
  margin-bottom: 10px !important;
  margin-top: 25px;
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

#matrix_select {
  margin-left: -30px !important;
  width: 190px;
}

#showheapmap {
  width: 120px;
  margin-left: 40px !important;
}

#PCA_select {
  margin-left: -30px !important;
  width: 190px;
}

#search_PCA {
  width: 120px;

  margin-left: 40px !important;
}

#community_Dection {
  margin-top: 10px;
  width: 160px;
  top: 100px;
}

#export_Community_Dection {
  margin-top: 10px;
  top: 100px;
  width: 160px;
  margin-left: 20px !important;
}

#showdistributionmap {
  width: 240px;
  margin-left: 75px !important;
  margin-top: 20px;
  display: block;
}

#showdistributionmaplogarithmic {
  width: 240px;
  margin-left: 75px !important;
  margin-top: 20px;
  display: block;
}

#submitfilter {
  width: 140px;
  margin-left: 115px !important;
  margin-top: 20px;
  display: block;
}

.select-button {
  margin-left: 5px !important;
  margin-bottom: 5px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
}

.symbol-select-button {
  margin-left: 5px !important;
  margin-bottom: 5px !important;
  margin-top: 20px;
  padding-left: 2px !important;
  padding-right: 2px !important;
  width: 200px;
}

.select-button-1 {
  height: 40 !important;
  margin-left: 5px !important;
  margin-bottom: 10px !important;
  margin-top: 25px !important;
  padding-left: 2px !important;
  padding-right: 2px !important;
}

.search-button-1 {
  position: absolute;
  width: 40px;
  height: 10px;
  left: 155px;
  top: 25px;
  padding-inline: inherit;
}

.search-button-2 {
  position: absolute;
  width: 40px;
  height: 10px;
  left: 318px;
  top: 25px;
  padding-inline: inherit;
}

.search-button-3 {
  position: absolute;
  width: 40px;
  height: 10px;
  left: 155px;
  top: 100px;
  padding-inline: inherit;
}



.mark-text {
  height: 40px;
  text-align: center;
  line-height: 40px;
  margin: 0px 0px 0px 5px;
  color: #303133;
  font-size: 14px;
}

.symbol-mark-text {
  float: left;
  width: 50px;
  height: 20px;
  text-align: center;
  line-height: 40px;
  margin: 25px 0px 0px 0px;
  color: #303133;
  font-size: 14px;
}

.el-collapse-item__content {
  background-color: #d3dce6;
}

.el-collapse-item__header {
  background-color: #d3dce6 !important;
  font-size: larger;
}

.el-input__inner {
  padding-left: 5px !important;
  padding-right: 40px !important;
}

body {
  margin: 0px;
  height: 100%;
}

body>.el-container {
  margin-bottom: 40px;
}

/* 弹窗 (background) */
.modal {
  display: none;
  /* 默认隐藏 */
  position: fixed;
  /* 固定定位 */
  z-index: 1;
  /* 设置在顶层 */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

#myProgress {
  width: 100%;
  background-color: #ddd;
}

#myBar {
  width: 10%;
  height: 30px;
  background-color: #4caf50;
  text-align: center;
  line-height: 30px;
  color: white;
}

/* 弹窗内容 */
.modal-content {
  /* background-color: #fefefe; */
  margin: 15% auto;
  padding: 30px;
  border: 1px solid #888;
  width: 50%;
}

/* 关闭按钮 */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin: -6% -4%;
}

#hotheap {
  left: 15%;
  width: 75%;
  height: 20rem;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.custom-timeout-div {
  width: 120px;
  font-size: 18px;
  margin-top: 40px;
  margin-left: 20px;
  float: left;
}

.custom-timeout-input {
  width: 120px;
  position: relative;
  margin-top: 10px;
}

.custom-timeout-button {
  margin-left: 25px;
}

.div-fontsize {
  font-size: 15px;
  margin-left: 15px;
  margin-top: 40px;
}

.sel-fontsize {
  width: 150px;
  height: 50px;
  margin-top: 7px;
  margin-left: 29px;
}

.button-fontsize {
  height: 20px;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 20px;
  margin-top: 32px;
}

.div-widthFactor {
  font-size: 15px;
  margin-left: 15px;
  margin-top: 40px;
}

.sel-widthFactor {
  width: 150px;
  height: 50px;
  margin-top: 7px;
  margin-left: 15px;
}

.button-widthFactor {
  height: 20px;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 20px;
  margin-top: 32px;
}

.button-source {
  width: 140px;
  height: 30px;
  margin-top: 25px;
  margin-right: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.div-arrow {
  margin-top: 32px;
  font-family: fangsong;
}

.button-target {
  width: 140px;
  height: 30px;
  margin-top: 25px;
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sel-widthfactor-single {
  width: 150px;
  margin-left: 15px;
  margin-top: 5px;
}

.button-widthfactor-single {
  height: 20px;
  padding-left: 2px;
  padding-right: 2px;
  margin-left: 20px;
  margin-top: 30px;
}

.button-result-source {
  width: 140px;
  height: 30px;
  margin-top: 25px;
  margin-right: 5px;
  margin-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.algorithm-select-box {
  width: 280px;
  padding-right: 50px;
  margin-left: 40px;
  margin-bottom: 10px;
}

.algorithm-select-button {
  width: 100px;
}                                                                                                                   

.el-input-number__increase {
  margin-top: 20px;
}
.datamode-select-box {
  width: 150px;
  margin-left: 50px;
}
.datamode-select-button {
  width: 90px;
  height: 40px;
  margin-left: 40px;
  margin-top: 25px;
}
#relationship_Network_Graph {
  margin-top: 20px;
  top: 100px;
  width: 160px;
  margin-left: 0px;
}
#relationship_Heatmap {
  margin-top: 20px;
  top: 100px;
  width: 160px;
  margin-left: 20px !important;
}
.subgraph-button {
  width: 100px !important;
  height: 25px;
  margin-left: 35px;
  margin-top: 25px;
}
.subgraph-select-box {
  margin-left: 35px !important;
  width: 140px;
}
.el-dialog{
  /* 设置弹窗的最大宽度 */
  max-width: 600px !important;
}

/* 自定义弹窗标题的样式 */
.custom-login-dialog .el-dialog__title {
  background-color: #333;
  color: #fff;
}

/* 自定义弹窗内容区域的样式 */
.custom-login-dialog .el-dialog__body {
  padding: 20px;
}

/* 自定义表单项的样式 */
.custom-login-dialog .el-form-item {
  margin-bottom: 15px;
}

/* 自定义按钮的样式 */
.custom-login-dialog .el-button {
  width: 100%;
  background-color: #007BFF;
  color: #fff;
}

/* 自定义按钮的悬停样式 */
.custom-login-dialog .el-button:hover {
  background-color: #0056b3;
}
.el-dialog__headerbtn {
  display: none;
}
.login-failure-message {
  color: red;
  margin-top: 10px;
}
</style>
<!-- <style scoped>
.el-input-number >>> .is-controls-right >>> .el-input-number__increase{

}
</style> -->
