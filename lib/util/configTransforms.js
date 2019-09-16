

const { loadModule } = require('./module');
const merge = require('deepmerge');
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));
const mergeOptions = {
  arrayMerge: mergeArrayWithDedupe
};

function stringifyJS (value) {
  const { stringify } = require('javascript-stringify');
  return stringify(value, (val, indent, stringify) => {
    if (val && val.__expression) {
      return val.__expression;
    }
    return stringify(val);
  }, 2);
}


const transformJS = {
  read: ({ filename, context }) => {
    try {
      return loadModule(`./${filename}`, context, true)
    } catch (e) {
      return null
    }
  },
  write: ({ value, existing, source }) => {
    return `module.exports = ${stringifyJS(value, null, 2)}`;
  }
}

const transformJSON = {
  read: ({ source }) => JSON.parse(source),
  write: ({ value, existing }) => {
    return JSON.stringify(merge(existing, value, mergeOptions), null, 2);
  }
}

const transformLines = {
  read: ({ source }) => source.split('\n'),
  write: ({ value, existing }) => {
    if (existing) {
      value = existing.concat(value);
      // Dedupe
      value = value.filter((item, index) => value.indexOf(item) === index);
    }
    return value.join('\n')
  }
}

exports.transforms = {
  js: transformJS,
  json: transformJSON,
  lines: transformLines
}
