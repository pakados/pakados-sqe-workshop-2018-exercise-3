import $ from 'jquery';
import * as esgraph from 'esgraph';
import Viz from 'viz.js';
import {Module,render} from 'viz.js/full.render.js';
import {paintCfg} from './graphPainter.js';


import {parseCode} from './code-analyzer';
import {generateGraph} from './dotGraphGeneratore';

const getParametersStringsFromInput = (parsedCode,input)=>{
    let mapOfValues=[];
    let parametersValue = eval('[' + input + ']');
    let parameters = parsedCode.body[0].params;
    for (let i =0;i<parameters.length;i++){
        mapOfValues.push('let '+ parameters[i].name + ' = ' + JSON.stringify(parametersValue[i]) + ';');
    }
    return mapOfValues;
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parameters = getParametersStringsFromInput(parsedCode, $('#parametersHolder').val());
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg, parameters);
        let dotGraph = generateGraph(cfg);
        let viz = new Viz({Module,render});
        viz.renderSVGElement(dotGraph)
            .then(function (element) {
                $('#parsedCode').innerHTML = '';
                $('#parsedCode').find('*').remove();
                $('#parsedCode').append(element);
            });
    });
});


