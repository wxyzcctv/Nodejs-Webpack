let action = require('./action.js').action;
let name = require('./name.js').name;

let message = `${name} is ${action}`;
console.log(message);
// 该index.js中的内容主要通过模块化方式完成，能成功在node环境中运行，但不能在浏览器环境中运行，此时就是需要一个大包工具将这些代码进行大包，翻译为浏览器能运行的语句。

