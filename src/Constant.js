	const relValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	const relIdMap = [
		"Cause_Effect",
		"Instrument_Agency",
		"Message_Topic",
		"Product_Producer",
		"Member_Collection",
		"Entity_Origin",
		"Entity_Destination",
		"Component_Whole",
		"Content_Container",
	]
	const Matrix_types = [
		{
			label : '条件概率矩阵',
			value : 1
		},
		{
			label : '距离矩阵',
			value : 2
		}
	]
	const insIdMap = [
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
		"DATA",
		"MEMO"
	]
	const relTypes = [{
			name: "Cause_Effect",
			color: "#fdc4b6",
			use: true,
			id: 0,
		},
		{
			name: "Instrument_Agency",
			color: "#ea7070",
			use: false,
			id: 1,
		},
		{
			name: "Message_Topic",
			color: "#004d61",
			use: true,
			id: 2,
		},
		{
			name: "Product_Producer",
			color: "#e59572",
			use: false,
			id: 3,
		},
		{
			name: "Member_Collection",
			color: "#a696c8",
			use: true,
			id: 4,
		},
		{
			name: "Entity_Origin",
			color: "#a8dba8",
			use: false,
			id: 5,
		},
		{
			name: "Entity_Destination",
			color: "#f6d04d",
			use: true,
			id: 6,
		},
		{
			name: "Component_Whole",
			color: "#66cdaa",
			use: false,
			id: 7,
		},
		{
			name: "Content_Container",
			color: "#2694ab",
			use: false,
			id: 8,
		},
	]
	// 关系显示颜色的映射表
	const rel_color_map = {
		'Instrument_Agency': "#ea7070",
		'Cause_Effect': "#fdc4b6",
		"Product_Producer": "#e59572",
		"Content_Container": "#2694ab",
		"Entity_Origin": "#a8dba8",
		"Entity_Destination": "#f6d04d",
		"Component_Whole": "#66cdaa",
		"Member_Collection": "#a696c8",
		"Message_Topic": "#004d61",
	}
	
	const categories= [
        {
          "category": "ROCK",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "TECT",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "ALTE",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "PHYS",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "CHEM",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "CHRO",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "MINE",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "DEPO",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "DEEP",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "ELEM",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "MEMO",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
        {
          "category": "DATA",
          "show": true,
          "maxpoint": 20000,
          "sliderRange": [0, 20000]
        },
      ]
	
export {
	relValues,relIdMap,insIdMap,relTypes,rel_color_map,Matrix_types,categories
}