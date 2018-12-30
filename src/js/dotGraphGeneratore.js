import * as escodegen from 'escodegen';

const generateGraph = (cfg)=>{
    let cfgNodes = cfg[2];
    removeUnnecessaryNodesAndAdages(cfgNodes);
    generateLabelsForNodes(cfgNodes);
    mergeNodes(cfgNodes);
    let dotNodes = generateNodesInDotFormat(cfgNodes);
    let dotEdges = generateEdgesInDotFormat(cfgNodes);
    let dotGraph = dotNodes.concat(dotEdges).join(' ');
    return`digraph cfg { forcelabels=true\n ${dotGraph} }`;
};


//this function removes the entry and exit nodes and deletes the exception if exist
const removeUnnecessaryNodesAndAdages = (cfgNodes)=>{
    cfgNodes.splice(cfgNodes.length-1,1); // deleting the exit node
    cfgNodes.splice(0,1); // deleting the entry node
    cfgNodes.forEach(x=>{
        delete x.exception;
    }
    );

};

//this function change the label of all the nodes into the code itself
const generateLabelsForNodes = (cfgNodes)=>{
    cfgNodes.forEach(x=>{
        x.label = removeSemiColonIfNeeded(escodegen.generate(x.astNode)) ;
    });
};

//removes semi colons from labels if needed
const removeSemiColonIfNeeded = (label)=>{
    if(label.endsWith(';')){
        return label.substring(0,label.length-1);
    }
    else
        return label;
};

//this function change the label of all the nodes into the code itself
const mergeNodes = (cfgNodes)=>{
    for(let i = 0;i<cfgNodes.length;i++){
        let currNode = cfgNodes[i];
        while(currNode.normal && currNode.normal.normal && currNode.normal.prev.length == 1 ){
            cfgNodes.splice(cfgNodes.indexOf(currNode.normal), 1);  //removing the next node
            currNode.label = currNode.label+ '\n' + currNode.normal.label; // adding the label of the deleted node to the
            currNode.next = currNode.normal.next; // updating the next node
            currNode.normal = currNode.normal.normal; // updating the normal node
        }
    }
};

const generateNodesInDotFormat = (cfgNodes)=>{
    let nodesInDotFormat = [];
    for (let i =0;i<cfgNodes.length;i++){
        let currNode = cfgNodes[i];
        let nodeDotString = 'n' + i + ' [label="' + currNode.label + '", xlabel=' + i;
        if(currNode.true && currNode.false){
            nodeDotString = nodeDotString + ', shape=diamond';
        }
        else{
            nodeDotString = nodeDotString + ', shape=rectangle';
        }
        if(currNode.paint){
            nodeDotString = nodeDotString + ',style = filled, fillcolor = green ';
        }
        nodeDotString = nodeDotString + ']\n';
        nodesInDotFormat.push(nodeDotString);
    }
    return nodesInDotFormat;
};

const addEdgeToArray = (from,to,label,edgesInDotFormat)=>{
    if (to >= 0){
        edgesInDotFormat.push('n' + from + ' -> n' + to + ' '+ label +'\n');
    }
};

const generateEdgesInDotFormat = (cfgNodes)=>{
    let edgesInDotFormat = [];
    for (let i =0;i<cfgNodes.length;i++){
        let currNode = cfgNodes[i];
        if(currNode.normal){
            addEdgeToArray(i,cfgNodes.indexOf(currNode.normal),'[]',edgesInDotFormat);
        }
        if(currNode.true) {
            addEdgeToArray(i,cfgNodes.indexOf(currNode.true), '[label="true"]', edgesInDotFormat);
        }
        if(currNode.false) {
            addEdgeToArray(i,cfgNodes.indexOf(currNode.false), '[label="false"]', edgesInDotFormat);
        }
    }
    return edgesInDotFormat;
};

export {generateGraph};
