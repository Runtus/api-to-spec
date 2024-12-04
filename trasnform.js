const testAPIData = `
import { Chart } from '@antv/g2';
const data = [
  { year: '1951 年', sales: 38 },
  { year: '1952 年', sales: 52 },
  { year: '1956 年', sales: 61 },
  { year: '1957 年', sales: 145 },
  { year: '1958 年', sales: 48 },
  { year: '1959 年', sales: 38 },
  { year: '1960 年', sales: 38 },
  { year: '1962 年', sales: 38 },
];

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart
  .interval()
  .coordinate({ transform: [{ type: 'transpose' }] })
  .data(data)
  .encode('x', 'year')
  .encode('y', 'sales');

chart.render();`;
const data = [
  { year: "1951 年", sales: 38 },
  { year: "1952 年", sales: 52 },
  { year: "1956 年", sales: 61 },
  { year: "1957 年", sales: 145 },
  { year: "1958 年", sales: 48 },
  { year: "1959 年", sales: 38 },
  { year: "1960 年", sales: 38 },
  { year: "1962 年", sales: 38 },
];

// // 替换g2的Chart用的
// class Chart {
//   _origin = {};
//   _originOptions;
//   _funcCall = []

//   constructor(options = {}) {
//     this._originOptions = options;
//   }

//   getProxyObj() {
//     const that = this;

//   }

//   getFuncCall() {
//     return this._funcCall;
//   }
// }

/**
 *
 * @param {Array} funcs_call
 */
function reduceSameNameFunc(funcs_call) {
  const map = new Map();

  funcs_call = funcs_call.filter((func) => func.name !== "render");

  funcs_call.forEach((func) => {
    let { name, args } = func;
  
    if (args.length === 0 && name !== "render") {
      args = [name];
      name = "type";
    }
    let obj = {};
    if (args.length === 2) {
      obj[args[0]] = args[1];
    } else {
      obj = args[0];
    }
    if (map.has(name)) {
      map.set(name, { ...map.get(name), ...obj });
    } else {
      map.set(name, obj);
    }
  });

  return map;
}

function getOptions(map) {
  let options = {};
  for (let [key, value] of map) {
    options[key] = value;
  }
  return options;
}
/**
 *
 * @param {string} str
 */
function apiToSpec(str) {
  str = str
    .split("\n")
    .filter((line) => !line.includes("@antv/g2"))
    .join("\n");
  str = str + "proxyObj = chart";

  const _funcCall = [];
  const _origin = {};
  let _options = {};

  function Chart(options) {
    _options = options;
    const proxy = new Proxy(_origin, {
      // TODO 在这里去做调用的拦截，并用map做记录
      get(target, prop) {
        _funcCall.push({
          name: prop,
          args: [],
        });

        return function (...args) {
          _funcCall[_funcCall.length - 1].args = args;
          return proxy;
        };
      },
    });
    return proxy;
  }

  eval(str);

  const formatMap = reduceSameNameFunc(_funcCall);
  const newOptions = getOptions(formatMap);

  console.log('chartOptions', _options)
  console.log("newOptions", newOptions)
  

  // const formatMap = reduceSameNameFunc(app.getFuncCall())

  // const options = getOptions(formatMap);

  // console.log(options)
}

apiToSpec(testAPIData);
