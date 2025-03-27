const { start } = require("echart");
const { resultProps } = require("element-plus");

class QueryCQL{
	constructor(queryStruct){
		//生成query语句
		var queryStr = ""
		var matchstr = "match (a)-[p]->(b) "
		
		var nodeTypeStr = "";
		var nodeTypeStr1 = "";
		for(var i = 0 ; i < queryStruct["nodeTypes"].length ; i++){
			if (i == 0 ){
				nodeTypeStr += " ( "
				nodeTypeStr1 += " ( "
			}
			nodeTypeStr += "((a:";
			nodeTypeStr1 += " ((b: ";
			nodeTypeStr += queryStruct["nodeTypes"][i];
			nodeTypeStr1 += queryStruct["nodeTypes"][i];
			nodeTypeStr += ") and ( toInteger (a.symbolSize) >= ";
			nodeTypeStr1 += ") and ( toInteger (b.symbolSize) >= ";
			nodeTypeStr += queryStruct["categories"][i]["sliderRange"][0] ;
			nodeTypeStr1 += queryStruct["categories"][i]["sliderRange"][0] ;
			nodeTypeStr += " ) and ( toInteger (a.symbolSize) <= " ;
			nodeTypeStr1 += " ) and (  toInteger (b.symbolSize) <= " ;
			nodeTypeStr += queryStruct["categories"][i]["sliderRange"][1] ;
			nodeTypeStr1 += queryStruct["categories"][i]["sliderRange"][1] ;
			nodeTypeStr += " )) " ;
			nodeTypeStr1 += " )) " ;
			if (i == queryStruct["nodeTypes"].length - 1 ) {
				nodeTypeStr += " ) "
				nodeTypeStr1 += " ) "
			}else {
				nodeTypeStr += " or "
				nodeTypeStr1 += " or "
			}
		}
		if ( queryStruct["nodeTypes"].length == 0 ) {
			nodeTypeStr = "and (( a:ELEM ) and (a: ROCK) and (a: TECT))"
			nodeTypeStr1 = " (( b:ELEM ) and (b: ROCK) and (b: TECT))"
		}
		// queryStr += nodeTypeStr + " and " + nodeTypeStr1;
		
		var linkTypeStr = "";
		for(var j = 0 ; j < queryStruct["linkTypes"].length ; j++){
			if (j == 0 ){
				linkTypeStr += " ( "
			}
			linkTypeStr += "( p:";
			linkTypeStr += queryStruct["linkTypes"][j];
			linkTypeStr += " ) ";
			if (j == queryStruct["linkTypes"].length - 1 ) {
				linkTypeStr += " ) "
			}else{
				linkTypeStr += " or "
			}
		}
		
		if ( queryStruct["linkTypes"].length == 0 ) {
			linkTypeStr += "((p:Cause_Effect) and (p:Instrument_Agency)) "
		}
		// queryStr += linkTypeStr;
		
		//删除边
		var deleteLinkStr = "" ;
		for(var k = 0 ; k < queryStruct["deletelinks"].length ; k++ ) {
			if (k == 0 ) {
				deleteLinkStr += " ( "
			}
			deleteLinkStr += "( not ( a = ";
			deleteLinkStr += queryStruct["deletelinks"][k]["source"];
			deleteLinkStr += " and b = ";
			deleteLinkStr += queryStruct["deletelinks"][k]["target"];
			deleteLinkStr += "))" 
			if (k == queryStruct["deletelinks"].length - 1 ) {
				deleteLinkStr += " ) " ;
			}else {
				deleteLinkStr += " and " ;
			}
		}
		// queryStr += deleteLinkStr ;
		//删除节点
		
		var deleteNodeStr = "";
		for(var m = 0 ; m < queryStruct["deletenodes"].length ; m++ ) {
			if (m == 0 ) {
				deleteNodeStr += " ( ";
			}
			deleteNodeStr += "( a.name <> \"";
			deleteNodeStr += queryStruct["deletenodes"][m];
			deleteNodeStr += "\" and b.name <> \"";
			deleteNodeStr += queryStruct["deletenodes"][m];
			deleteNodeStr += "\")";
			if (m == queryStruct["deletenodes"].length - 1 ) {
				deleteNodeStr += " ) "
			} else{
				deleteNodeStr += " and "
			}
		}
		var sourceNodeSection = " and toInteger(a.symbolSize) >= " + queryStruct["nodeSizeSection"][0] + " and toInteger(a.symbolSize) <= " + queryStruct["nodeSizeSection"][1] ;
		var targetNodeSection = " and toInteger(b.symbolSize) >= " + queryStruct["nodeSizeSection"][0] + " and toInteger(b.symbolSize) <= " + queryStruct["nodeSizeSection"][1] ;
		var linkSection = " and toInteger(p.width) >= " + queryStruct["linkSizeSection"][0] + " and toInteger(p.width) <= " + queryStruct["linkSizeSection"][1] ;
		var itemcollect = " with collect(a) as a ,collect(b) as b,p with a + b as c,p unwind c as nodes with collect(distinct nodes) as nodes,collect(distinct p) as links " ;
		var result = "return nodes ,links";
		this.matchstr = matchstr;
		this.nodeTypeStr = nodeTypeStr;
		this.nodeTypeStr1 = nodeTypeStr1;
		this.linkTypeStr = linkTypeStr;
		this.deleteLinkStr = deleteLinkStr;
		this.deleteNodeStr = deleteNodeStr;
		this.sourceNodeSection = sourceNodeSection;
		this.targetNodeSection = targetNodeSection ;
		this.linkSection = linkSection ;
		this.itemcollect = itemcollect ;
		this.result = result ;
		this.nameorder = true ;
		return queryStr;
	}
	onlyFilter(queryStruct){
		var queryStr = ""
		queryStr +=  this.matchstr
		if(queryStruct["nodeTypes"].length > 0 || queryStruct["linkTypes"].length > 0 || queryStruct["deletenodes"].length > 0
		 || queryStruct["deletelinks"].length > 0 ){
			 queryStr += "where"
		 }
		 queryStr +=  this.nodeTypeStr + " and " +this.nodeTypeStr1 
		 if ( queryStruct["linkTypes"].length >= 0) {
		 	queryStr += " and ";
		 }
		 queryStr +=  this.linkTypeStr
		 if ( queryStruct["deletelinks"].length > 0 ) {
		 	queryStr += " and "
		 }
		 queryStr +=  this.deleteLinkStr 
		 if ( queryStruct["deletenodes"].length > 0 ) {
		 	queryStr += " and "
		 }
		 // if (this.nameorder){
			//  this.result = "return DISTINCT a+b as nodes,links"
		 // }
		 queryStr +=  this.deleteNodeStr 
		queryStr +=this.sourceNodeSection + this.targetNodeSection 
		+this.linkSection + this.itemcollect + this.result ;
		return queryStr ; 
	}
	getSortedNodes(queryStruct){
		var queryStr = ""
		queryStr +=  this.matchstr
		if(queryStruct["nodeTypes"].length > 0 || queryStruct["linkTypes"].length > 0 || queryStruct["deletenodes"].length > 0
		 || queryStruct["deletelinks"].length > 0 ){
			 queryStr += "where"
		 }
		 queryStr +=  this.nodeTypeStr + " and " +this.nodeTypeStr1 
		 if ( queryStruct["linkTypes"].length > 0) {
		 	queryStr += " and ";
		 }
		 queryStr +=  this.linkTypeStr
		 if ( queryStruct["deletelinks"].length > 0 ) {
		 	queryStr += " and "
		 }
		 queryStr +=  this.deleteLinkStr 
		 if ( queryStruct["deletenodes"].length > 0 ) {
		 	queryStr += " and "
		 }
		 var sourceNodeSection = " and toInteger(a.symbolSize) >= " + queryStruct["nodeSizeSection"][0] + " and toInteger(a.symbolSize) <= " + queryStruct["nodeSizeSection"][1] ;
		 var targetNodeSection = " and toInteger(b.symbolSize) >= " + queryStruct["nodeSizeSection"][0] + " and toInteger(b.symbolSize) <= " + queryStruct["nodeSizeSection"][1] ;
		 var linkSection = " and toInteger(p.width) >= " + queryStruct["linkSizeSection"][0] + " and toInteger(p.width) <= " + queryStruct["linkSizeSection"][1] ;
		 queryStr +=  this.deleteNodeStr
		 queryStr += this.sourceNodeSection + this.targetNodeSection 
		 +this.linkSection ;
		 var myresult = " with collect(a) as a,collect(b) as b unwind a+b as mynode with mynode order by mynode.name return collect(distinct mynode)"
		 queryStr += myresult
		 return queryStr;
	}
}
export{
	QueryCQL
}