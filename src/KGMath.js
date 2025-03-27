function Floyd(G) { //传入一个图
	var ShortPathTable = []; //二维数组 表示顶点到顶点的最短路径权值和的矩阵
	var Gmaxvex = G.vertexs.length;
	for (let v = 0; v < Gmaxvex; ++v) { //初始化 Pathmatirx ShortPathTable
		ShortPathTable[v] = [];
		for (let w = 0; w < Gmaxvex; ++w) {
			if (G["arc"]["data"][v][w] == Infinity || G["arc"]["data"][v][w] == 0) {
				ShortPathTable[v][w] = G["arc"]["data"][v][w];
			} else {
				ShortPathTable[v][w] = 1;
			}
		}
	}
	for (let k = 0; k < Gmaxvex; ++k) {
		for (let v = 0; v < Gmaxvex; ++v) {
			for (let w = 0; w < Gmaxvex; ++w) {
				if (ShortPathTable[v][w] > (ShortPathTable[v][k] + ShortPathTable[k][w])) {
					//如果经过下标为k顶点路径比原两点间路径更短，当前两点间权值设为更小的一个
					ShortPathTable[v][w] = ShortPathTable[v][k] + ShortPathTable[k][w];
				}
			}
		}
	}
	return ShortPathTable;
}
export{
	Floyd
}
