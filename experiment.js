//最终目标， 写一个工具，把源码经过处理，生成一个文件，这个文件里面拥有下面的内容

/*
modules = {
  0: function(require, exports) {
    let action = require('./action.js').action;
    let name = require('./name').name;

    let message = `${name} is ${action}`;
    console.log( message );
  },

  1: function(require, exports) {
    let action = 'making webpack';

    exports.action = action;
  },

  2: function(require, exports) {
    let familyName = require('./family-name.js').name;

    exports.name = `${familyName} Ruoyu`;
  },

  3: function(require, exports) {
    exports.name = 'Jirengu';
  }
}

//执行模块，返回结果
function exec(id) {
  let fn = modules[id];
  let  exports =  {};

  fn(require, exports);

  function require(path) {
    //todo...
    //根据模块路径，返回模块执行的结果
  }

}

exec(0)

*/


// 需要达成的目标如下：实现require函数，将每个模块的内容变为modules中的内容，
// 其中function中的函数体就是每个模块的内容，而对象记录的是该模块所需要依赖的模块。
// 以下实现可以在node环境和浏览器环境直接执行
// 此处只是描绘出源码打包之后代码的逻辑结构，并未实现打包工具进行自动构建。
/*
modules = {
    0: [function (require, exports, module) {
        let action = require('./action.js').action;
        let name = require('./name.js').name;

        let message = `${name} is ${action}`;
        console.log(message);
    },
    {
        './action.js': 1,
        './name.js': 2
    }
    ],

    1: [function (require, exports, module) {
        let action = 'making webpack';

        exports.action = action;
    },
    {

    }
    ],

    2: [function (require, exports, module) {
        let familyName = require('./family-name.js').name;

        exports.name = `${familyName} Ruoyu`;
    },
    {
        './family-name.js': 3
    }
    ],

    3: [function (require, exports, module) {
        exports.name = 'Jirengu';
    },
    {

    }
    ]
}

//执行模块，返回结果
function exec(id) {
    let [fn, mapping] = modules[id];
    console.log(fn, mapping)
    let exports = {};

    fn && fn(require, exports);

    function require(path) {
        //根据模块路径，返回模块执行的结果
        return exec(mapping[path]);
    }

    return exports;
}

exec(0)
*/

// 接下来需要使用Node.js 去对源码进行解析，分析依赖。

// 首先解析文件内容中所依赖的包名,简单的通过正则进行解析
// 正则表达式： ```let reg = /require\(['"](.+?)['"]\)/g``` 匹配的是"require('"和"')"之间的内容
// 利用while循环实现所有内容的匹配，将匹配的内容放到数组中，以下内容能在node环境中正常运行

/*
const fs = require('fs')

let fileContent = fs.readFileSync('./index.js', 'utf-8');

function getDependencies(str) {
  let reg = /require\(['"](.+?)['"]\)/g;
  let result = null;
  let dependencies = [];
  while (result = reg.exec(str)) {
    dependencies.push(result[1]);
  }
  return dependencies;
}

console.log(getDependencies(fileContent))
*/

// createAsset函数实现的内容是解析一个模块中的内容，
// 提取该模块中的内容为字符串，对该字符串进行封装解析，解析为一个对象：
// 该对象的主要形式为：
// {
//   id: id,
//   filename: filename,
//   dependencies: getDependencies(fileContent),
//   code: `function(require, exports, module) { 
//       ${fileContent}
//   }`
// }

const fs = require('fs');

let ID = 0;

function getDependencies(str) {
  let reg = /require\(['"](.+?)['"]\)/g;
  let result = null;
  let dependencies = [];
  while (result = reg.exec(str)) {
    dependencies.push(result[1]);
  }
  return dependencies;
}

function createAsset(filename) {
  let fileContent = fs.readFileSync(filename, 'utf-8');
  const id = ID++;
  return {
    id: id,
    filename: filename,
    dependencies: getDependencies(fileContent),
    code: `function(require, exports, module) { 
        ${fileContent}
    }`
  }
}

let result = createAsset('./index.js');
console.log(result)