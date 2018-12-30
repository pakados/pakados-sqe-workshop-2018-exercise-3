import * as escodegen from 'escodegen';


function paintCfg(cfg, valueMap) {
    paintNode(cfg[0].normal,valueMap);
}

function paintNode(node, valueMap) {
    if(node.type != 'exit' ){
        node.paint = true;
        if(node.normal){
            valueMap.push(escodegen.generate(node.astNode)+';');
            paintNode(node.normal,valueMap);
        }
        else{
            paintCondition(node, valueMap);
        }
    }
}

function paintCondition(node, valueMap) {
    if(eval(valueMap.join(';') + escodegen.generate(node.astNode) + ';')){
        paintNode(node.true, valueMap);
    }
    else{
        paintNode(node.false, valueMap);
    }
}

export {paintCfg};