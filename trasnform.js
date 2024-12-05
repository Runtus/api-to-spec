

const MarkTypes = ['area', 'box', 'boxplot', 'cell', 'chord', 'density', 'gauge', 'heatmap', 'image', 'interval', 'line', 'lineX', 'lineY', 'link', 'liquid', 'point', 'polygon', 'range', 'rangeX', 'rangeY', 'rect', 'shape', 'text', 'vector', 'wordCloud']
/**
 *
 * @param {Array} funcs_call
 */
function reduceSameNameFunc(funcs_call) {
  let map = new Map(), childrenMap = new Map();
  funcs_call = funcs_call.filter((func) => func.name !== "render");
  // debugger
  funcs_call.forEach((func) => {
    let { name, args } = func;
    if (MarkTypes.includes(name)) {
      console.log("name", name)
      // 说明暂时是没有children的嵌套类型的
      if (!map.has("children") && childrenMap.size === 0) {
          childrenMap.set("type", name);
      } else {
        const obj = {};
        childrenMap.forEach((value, key) => {
          obj[key] = value;
        });
        // 说明有children的嵌套类型，需要将本次children做记录
        map.set("children", [...(map.get("children") || []), { ...obj }]);
        childrenMap.clear();
        childrenMap.set("type", name);
      }
      
    } else if (name === 'data') {
      map.set(name, args[0])
    }
    // spec为数组形式的type
    else if (name === "transform") {
      let obj = [...args];
      childrenMap.set(name, [...(childrenMap.get(name) || []), ...obj]);
    // spec为对象形式的type
    } else {
      let obj = {};
      if (args.length === 2) {
        obj[args[0]] = args[1];
      } else {
        obj = args[0];
      }
      childrenMap.set(name, { ...(childrenMap.get(name) || {}), ...obj });
    }
  });

  if (map.has("children")) {
    const obj = {};
    childrenMap.forEach((value, key) => {
      obj[key] = value;
    });
    map.set("children", [...(map.get("children")), { ...obj }]);
  } else {
    childrenMap.forEach((value, key) => {
      map.set(key, value);
    })
  }
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
export function apiToSpec(str) {
  str = str
    .split("\n")
    .filter((line) => !line.includes("@antv/g2"))
    .join("\n");

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
  console.log(formatMap)
  const newOptions = getOptions(formatMap);

  console.log("chartOptions", _options);
  console.log("newOptions", newOptions);

  return {
    options: _options,
    newOptions,
  };
}
