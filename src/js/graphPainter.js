import * as escodegen from 'escodegen';


function paintCfg(cfg, valueMap) {
    paintNode(cfg[0].normal,valueMap);
}

function isDeceleration(code) {
    return (code.includes('let') || (code.includes('var')));
}

function paintNode(node, valueMap) {
    if(node.type != 'exit' ){
        node.paint = true;
        if(node.normal){
            let codeToAdd = escodegen.generate(node.astNode);
            if ( isDeceleration(codeToAdd)&& valueMap.includes(codeToAdd + ';')){
                codeToAdd= codeToAdd.substring(3);
            }
            valueMap.push(codeToAdd+';');
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