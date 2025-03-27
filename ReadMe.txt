佳欢哥6月7日给的Vue文件，结合show3.0得到
1 rem = 256px
1 px = 1/256

第一次尝试增加  postcss-px2rem及px2rem-loader
https://blog.csdn.net/huihuiliu_/article/details/114696863?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-3-114696863-blog-121848542.pc_relevant_3mothn_strategy_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-3-114696863-blog-121848542.pc_relevant_3mothn_strategy_recovery&utm_relevant_index=5

第二项尝试通过 postcss-plugin-px2rem
https://blog.csdn.net/StoneVivi/article/details/106794310?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-106794310-blog-120876602.pc_relevant_layerdownloadsortv1&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-106794310-blog-120876602.pc_relevant_layerdownloadsortv1&utm_relevant_index=1



########10月11 todo
1、寻找基于子图的neo4j的查询方法
10月12日找到基于子图查询的cphyer方法
案例
match p = (a{name:"H 2 o"})-[*..3]->(b{name:"Mineral deposit"}) with p limit 10 match p1 = (a{name:"H 2 o"})-[*..3]->(b{name:"Ti"}) return p1 limit 2


源代码
match (a)-[p]->(b) 
    where ( (a:ROCK) or (a:TECT) or (a:ALTE) or (a:PHYS) or (a:CHEM) or (a:CHRO) or (a:MINE) or (a:DEPO) or (a:ELEM) or (a:DATA) or (a:MEMO) )  
    and  (  (b: ROCK) or  (b: TECT) or  (b: ALTE) or  (b: PHYS) or  (b: CHEM) or  (b: CHRO) or  (b: MINE) or  (b: DEPO) or  (b: ELEM) or  (b: DATA) or  (b: MEMO) )  
    and  ( ( p:Cause_Effect )  or ( p:Message_Topic )  or ( p:Member_Collection )  or ( p:Entity_Destination )  )  
    and toInteger(a.symbolSize) >= 500 
    and toInteger(a.symbolSize) <= 600 
    and toInteger(b.symbolSize) >= 500 
    and toInteger(b.symbolSize) <= 600 
    and toInteger(p.width) >= 0 
    and toInteger(p.width) <= 28 
    with collect(a) as a ,collect(b) as b,p with a + b as c,p unwind c as nodes with collect(distinct nodes) as nodes,collect(distinct p) as links return nodes ,links


推理部分
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























2、在新的页面中弹出查询的图表


河北省石家庄市栾城县窦妪镇回乡人才中心第二支部委员会