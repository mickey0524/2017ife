
var element = document.getElementsByClassName('tree')[0];
var data = [ {name: "父节点1", children: [ {name: "子节点1", children: [{name: '子节点11'}]}, {name: "子节点2"} ]}, {name: "父节点2", children: [ {name: "子节点3"}, {name: "子节点4", children:[ {name:"子节点5"} ]} ]} ];
var tree = new Tree(element, data);