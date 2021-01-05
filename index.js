let action = require('./action.js').action;
let name = require('./name.js').name;

let message = `${name} is ${action}`;
console.log(message);
// 该index.js中的内容主要通过模块化方式完成，能成功在node环境中运行，但不能在浏览器环境中运行，此时就是需要一个大包工具将这些代码进行大包，翻译为浏览器能运行的语句。

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