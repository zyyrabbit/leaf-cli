const path = require('path');
const merge = require('deepmerge');
const resolve = require('resolve');
const fs = require('fs');
const ejs = require('ejs');
const isString = val => typeof val === 'string';
const isObject = val => val && typeof val === 'object';
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));

class GeneratorAPI {
  /**
   * @param {string} id - Id of the owner plugin
   * @param {Generator} generator - The invoking Generator instance
   * @param {object} options - generator options passed to this plugin
   * @param {object} rootOptions - root options (the entire preset)
   */
  constructor (id, generator, options, rootOptions) {
    this.id = id;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;
  }

  /**
   * @param {string} _path - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  resolve (_path) {
    return path.resolve(this.generator.context, _path);
  }

  _resolveData (additionalData) {
    return Object.assign({
      options: this.options,
      rootOptions: this.rootOptions,
      plugins: this.pluginsData
    }, additionalData)
  }

  _injectFileMiddleware (middleware) {
    this.generator.fileMiddlewares.push(middleware);
  }

  /**
   * @param {object | () => object} fields
   * @param {boolean} forceNewVersion
   */
  extendPackage (fields, forceNewVersion) {
    const pkg = this.generator.pkg;
    const toMerge = fields;
    for (const key in toMerge) {
      const value = toMerge[key];
      const existing = pkg[key];
      if (isObject(value) && (key === 'dependencies' || key === 'devDependencies')) {
        pkg[key] = merge(
          this.id,
          existing || {},
          value,
          this.generator.depSources,
          forceNewVersion
        );
      } else if (!(key in pkg)) {
        pkg[key] = value;
      } else if (Array.isArray(value) && Array.isArray(existing)) {
        pkg[key] = mergeArrayWithDedupe(existing, value);
      } else if (isObject(value) && isObject(existing)) {
        pkg[key] = merge(existing, value, { arrayMerge: mergeArrayWithDedupe });
      } else {
        pkg[key] = value;
      }
    }
  }

   /**
   * Render template files into the virtual files tree object.
   *
   * @param {string | object | FileMiddleware} source -
   *   Can be one of:
   *   - relative path to a directory;
   *   - Object hash of { sourceTemplate: targetFile } mappings;
   *   - a custom file middleware function.
   * @param {object} [additionalData] - additional data available to templates.
   * @param {object} [ejsOptions] - options for ejs.
   */
  render (source, additionalData = {}, ejsOptions = {}) {
   
    const baseDir = extractCallDir();
    if (isString(source)) {
      source = path.resolve(baseDir, source)
      this._injectFileMiddleware(async (files) => {
        const data = this._resolveData(additionalData);
        const globby = require('globby');
        const _files = await globby(['**/*'], { cwd: source });
      
        for (const rawPath of _files) {
          const sourcePath = path.resolve(source, rawPath);
          const content = renderFile(sourcePath, data, ejsOptions);
          // only set file if it's not all whitespace, or is a Buffer (binary files)
          if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[rawPath] = content;
          }
        }
      })
    }
  }

}


 // extract api.render() callsite file location using error stack
function extractCallDir () {
  const obj = {};
  Error.captureStackTrace(obj);
  const callSite = obj.stack.split('\n')[3];
  const fileName = callSite.match(/\s\((.*):\d+:\d+\)$/)[1];
  return path.dirname(fileName);
}

const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;

function renderFile (name, data, ejsOptions) {
  const template = fs.readFileSync(name, 'utf-8');

  // custom template inheritance via yaml front matter.
  // ---
  // extend: 'source-file'
  // replace: !!js/regexp /some-regex/
  // OR
  // replace:
  //   - !!js/regexp /foo/
  //   - !!js/regexp /bar/
  // ---
  const yaml = require('yaml-front-matter');
  const parsed = yaml.loadFront(template);
  const content = parsed.__content;
  let finalTemplate = content.trim() + `\n`;

  if (parsed.when) {
    finalTemplate = (
      `<%_ if (${parsed.when}) { _%>` +
        finalTemplate +
      `<%_ } _%>`
    );

    // use ejs.render to test the conditional expression
    // if evaluated to falsy value, return early to avoid extra cost for extend expression
    const result = ejs.render(finalTemplate, data, ejsOptions);
    if (!result) {
      return '';
    };
  };

  if (parsed.extend) {
    const extendPath = path.isAbsolute(parsed.extend)
      ? parsed.extend
      : resolve.sync(parsed.extend, { basedir: __dirname });
    finalTemplate = fs.readFileSync(extendPath, 'utf-8');
    if (parsed.replace) {
      if (Array.isArray(parsed.replace)) {
        const replaceMatch = content.match(replaceBlockRE);
        if (replaceMatch) {
          const replaces = replaceMatch.map(m => {
            return m.replace(replaceBlockRE, '$1').trim()
          });
          parsed.replace.forEach((r, i) => {
            finalTemplate = finalTemplate.replace(r, replaces[i]);
          });
        }
      } else {
        finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
      }
    }
  }

  return ejs.render(finalTemplate, data, ejsOptions);
}

module.exports = GeneratorAPI;
