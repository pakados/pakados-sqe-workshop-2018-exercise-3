import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {generateGraph} from '../src/js/dotGraphGeneratore.js';
import {paintCfg} from '../src/js/graphPainter';
import * as esgraph from 'esgraph/lib';


const code1 = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';

const dot1 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let a = x + 1\n' + 'let b = a + y\n' + 'let c = 0", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="b < z", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="c = c + 5", xlabel=2, shape=rectangle]\n' + ' n3 [label="return c", xlabel=3, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n4 [label="b < z * 2", xlabel=4, shape=diamond,style = filled, fillcolor = green ]\n' + ' n5 [label="c = c + x + 5", xlabel=5, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n6 [label="c = c + z + 5", xlabel=6, shape=rectangle]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n4 [label="false"]\n' + ' n2 -> n3 []\n' + ' n4 -> n5 [label="true"]\n' + ' n4 -> n6 [label="false"]\n' + ' n5 -> n3 []\n' + ' n6 -> n3 []\n' + ' }';

const code2 = 'function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' + '       c = a + b;\n' + '       z = c * 2;\n' + '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n';

const dot2 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let a = x + 1\n' + 'let b = a + y\n' + 'let c = 0", xlabel=0, shape=rectangle]\n' + ' n1 [label="a < z", xlabel=1, shape=diamond]\n' + ' n2 [label="c = a + b\n' + 'z = c * 2\n' + 'a++", xlabel=2, shape=rectangle]\n' + ' n3 [label="return z", xlabel=3, shape=rectangle]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n3 [label="false"]\n' + ' n2 -> n1 []\n' + ' }';

const code3 = 'function addArrays(arr1,arr2){\n' + '   let x= 0;\n' + '   let ans = [];\n' + '   while (x < arr1.lengt){\n' + '        ans.push(arr1[x]+arr1[2]);\n' + '        x++;\n' + '   }\n' + '   return ans;\n' + '}\n';

const dot3 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let x = 0\n' + 'let ans = []", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="x < arr1.lengt", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="ans.push(arr1[x] + arr1[2])\n' + 'x++", xlabel=2, shape=rectangle]\n' + ' n3 [label="return ans", xlabel=3, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n3 [label="false"]\n' + ' n2 -> n1 []\n' + ' }';

const code4 = 'function range(min,max){\n' + '   let x= min;\n' + '   let ans = [];\n' + '   while (x <= max){\n' + '        ans.push(x);\n' + '        x++;\n' + '   }\n' + '   return ans;\n' + '}\n';

const dot4 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let x = min\n' + 'let ans = []", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="x <= max", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="ans.push(x)\n' + 'x++", xlabel=2, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n3 [label="return ans", xlabel=3, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n3 [label="false"]\n' + ' n2 -> n1 []\n' + ' }';

const code5 = 'function Sort(arr){\n' + '   let i =0;\n' + '   let j =0;\n' + '   while(i<arr.length){\n' + '      j =0;\n' + '      while(j<arr.length){\n' + '         if (arr[j]>arr[j+1]){\n' + '             let temp = arr[j];\n' + '             arr[j]=arr[j+1];\n' + '             arr[j+1]=temp;\n' + '          }\n' + '         j++;\n' + '       }\n' + '    i++;\n' + '   }\n' + '   return arr;\n' + '}';

const dot5 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let i = 0\n' + 'let j = 0", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="i < arr.length", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="j = 0", xlabel=2, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n3 [label="j < arr.length", xlabel=3, shape=diamond,style = filled, fillcolor = green ]\n' + ' n4 [label="arr[j] > arr[j + 1]", xlabel=4, shape=diamond,style = filled, fillcolor = green ]\n' + ' n5 [label="let temp = arr[j]\n' + 'arr[j] = arr[j + 1]\n' + 'arr[j + 1] = temp", xlabel=5, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n6 [label="j++", xlabel=6, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n7 [label="i++", xlabel=7, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n8 [label="return arr", xlabel=8, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n8 [label="false"]\n' + ' n2 -> n3 []\n' + ' n3 -> n4 [label="true"]\n' + ' n3 -> n7 [label="false"]\n' + ' n4 -> n5 [label="true"]\n' + ' n4 -> n6 [label="false"]\n' + ' n5 -> n6 []\n' + ' n6 -> n3 []\n' + ' n7 -> n1 []\n' + ' }';

const code6 = 'function selectionSort(arr,stamString){\n' + '    let  minIdx =0;\n' + '    let temp = 0;\n' + '    let len = arr.length;\n' + '    let i =0;\n' + '    let j =0;\n' + '    while(i < len){\n' + '        minIdx = i;\n' + '        j = i+1;\n' + '        while( j<len){\n' + '            if(arr[j]<arr[minIdx]){\n' + '                minIdx = j;\n' + '            }\n' + '            j++;\n' + '        }\n' + '        temp = arr[i];\n' + '        arr[i] = arr[minIdx];\n' + '        arr[minIdx] = temp;\n' + '        i++;\n' + '    }\n' + '    return arr;\n' + '};';

const dot6 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let minIdx = 0\n' + 'let temp = 0\n' + 'let len = arr.length\n' + 'let i = 0\n' + 'let j = 0", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="i < len", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="minIdx = i\n' + 'j = i + 1", xlabel=2, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n3 [label="j < len", xlabel=3, shape=diamond,style = filled, fillcolor = green ]\n' + ' n4 [label="arr[j] < arr[minIdx]", xlabel=4, shape=diamond,style = filled, fillcolor = green ]\n' + ' n5 [label="minIdx = j", xlabel=5, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n6 [label="j++", xlabel=6, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n7 [label="temp = arr[i]\n' + 'arr[i] = arr[minIdx]\n' + 'arr[minIdx] = temp\n' + 'i++", xlabel=7, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n8 [label="return arr", xlabel=8, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n8 [label="false"]\n' + ' n2 -> n3 []\n' + ' n3 -> n4 [label="true"]\n' + ' n3 -> n7 [label="false"]\n' + ' n4 -> n5 [label="true"]\n' + ' n4 -> n6 [label="false"]\n' + ' n5 -> n6 []\n' + ' n6 -> n3 []\n' + ' n7 -> n1 []\n' + ' }';

const code7 = 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        if(c = 5){\n' + '           c = 0; \n' + '           if(b = 3){\n' + '               b = 12; \n' + '           }\n' + '        }        \n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '    }\n' + '    \n' + '    return c;\n' + '}\n';

const dot7 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let a = x + 1\n' + 'let b = a + y\n' + 'let c = 0", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="b < z", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="c = c + 5", xlabel=2, shape=rectangle]\n' + ' n3 [label="c = 5", xlabel=3, shape=diamond]\n' + ' n4 [label="c = 0", xlabel=4, shape=rectangle]\n' + ' n5 [label="b = 3", xlabel=5, shape=diamond]\n' + ' n6 [label="b = 12", xlabel=6, shape=rectangle]\n' + ' n7 [label="return c", xlabel=7, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n8 [label="b < z * 2", xlabel=8, shape=diamond,style = filled, fillcolor = green ]\n' + ' n9 [label="c = c + x + 5", xlabel=9, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n10 [label="c = c + z + 5", xlabel=10, shape=rectangle]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n8 [label="false"]\n' + ' n2 -> n3 []\n' + ' n3 -> n4 [label="true"]\n' + ' n3 -> n7 [label="false"]\n' + ' n4 -> n5 []\n' + ' n5 -> n6 [label="true"]\n' + ' n5 -> n7 [label="false"]\n' + ' n6 -> n7 []\n' + ' n8 -> n9 [label="true"]\n' + ' n8 -> n10 [label="false"]\n' + ' n9 -> n7 []\n' + ' n10 -> n7 []\n' + ' }';

const code8 = 'function addArrays(arr1,arr2){\n' + '   let x= 0;\n' + '   let ans = [];\n' + '   while (x < arr1.length){\n' + '        let z = 3;\n' + '        ans.push(arr1[x]+arr1[2]);\n' + '        x++;\n' + '   }\n' + '   return ans;\n' + '}';

const dot8 = 'digraph cfg { forcelabels=true\n' + ' n0 [label="let x = 0\n' + 'let ans = []", xlabel=0, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n1 [label="x < arr1.length", xlabel=1, shape=diamond,style = filled, fillcolor = green ]\n' + ' n2 [label="let z = 3\n' + 'ans.push(arr1[x] + arr1[2])\n' + 'x++", xlabel=2, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n3 [label="return ans", xlabel=3, shape=rectangle,style = filled, fillcolor = green ]\n' + ' n0 -> n1 []\n' + ' n1 -> n2 [label="true"]\n' + ' n1 -> n3 [label="false"]\n' + ' n2 -> n1 []\n' + ' }';

describe('graph painter1', () => {
    it('graph painter1', () => {
        let parsedCode = parseCode(code1);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let x = 1;', 'let y = 2;','let z = 3;']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            7
        );
    });
});


describe('graph dots1', () => {
    it('graph dots1', () => {
        let parsedCode = parseCode(code1);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let x = 1;', 'let y = 2;','let z = 3;']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot1
        );
    });
});

describe('graph dots2', () => {
    it('graph dots2', () => {
        let parsedCode = parseCode(code2);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot2
        );
    });
});

describe('graph dots3', () => {
    it('graph dots3', () => {
        let parsedCode = parseCode(code3);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr1 = [1,2,3];', 'let arr2 = [1,2,3];']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot3
        );
    });
});

describe('graph painter3', () => {
    it('graph painter3', () => {
        let parsedCode = parseCode(code3);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr1 = [1,2,3];', 'let arr2 = [1,2,3];']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            4
        );
    });
});

describe('graph dots4', () => {
    it('graph dots4', () => {
        let parsedCode = parseCode(code4);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let min = 0;', 'let max = 100;']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot4
        );
    });
});


describe('graph painter4', () => {
    it('graph painter4', () => {
        let parsedCode = parseCode(code4);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let min = 0;', 'let max = 100;']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            6
        );
    });
});

describe('graph painter5', () => {
    it('graph painter5', () => {
        let parsedCode = parseCode(code5);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr = [1,4,3];']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            12
        );
    });
});



describe('graph dots5', () => {
    it('graph dots5', () => {
        let parsedCode = parseCode(code5);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr = [1,4,3];']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot5
        );
    });
});


describe('graph painter6', () => {
    it('graph painter6', () => {
        let parsedCode = parseCode(code6);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr = [3,2,1];','let stamString = "wowowowo";']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            17
        );
    });
});

describe('graph dots6', () => {
    it('graph dots6', () => {
        let parsedCode = parseCode(code6);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr = [3,2,1];','let stamString = "wowowowo";']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot6
        );
    });
});

describe('graph painter7', () => {
    it('graph painter7', () => {
        let parsedCode = parseCode(code7);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let x = 1;', 'let y = 2;','let z = 3;']);
        assert.equal(
            cfg[2].filter(x=>{
                return x.paint;
            }).length
            ,
            7
        );
    });
});

describe('graph dots7', () => {
    it('graph dots7', () => {
        let parsedCode = parseCode(code7);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let x = 1;', 'let y = 2;','let z = 3;']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot7
        );
    });
});


describe('graph painter8', () => {
    it('graph painter8', () => {
        let parsedCode = parseCode(code8);
        let cfg = esgraph(parsedCode['body'][0]['body']);
        paintCfg(cfg,['let arr1 = [1,2,3];', 'let arr2 = [1,2,3];']);
        let dotGraph = generateGraph(cfg);
        assert.equal(
            dotGraph
            ,
            dot8
        );
    });
});

