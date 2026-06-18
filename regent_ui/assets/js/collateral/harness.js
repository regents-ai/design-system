var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../design-system/regent_ui/assets/vendor/anime.esm.js
function getNodeList(v2) {
  const n2 = isStr(v2) ? scope.root.querySelectorAll(v2) : v2;
  if (n2 instanceof NodeList || n2 instanceof HTMLCollection) return n2;
}
function parseTargets(targets) {
  if (isNil(targets)) return (
    /** @type {TargetsArray} */
    []
  );
  if (!isBrowser) return (
    /** @type {JSTargetsArray} */
    isArr(targets) && targets.flat(Infinity) || [targets]
  );
  if (isArr(targets)) {
    const flattened = targets.flat(Infinity);
    const parsed = [];
    for (let i2 = 0, l2 = flattened.length; i2 < l2; i2++) {
      const item = flattened[i2];
      if (!isNil(item)) {
        const nodeList2 = getNodeList(item);
        if (nodeList2) {
          for (let j = 0, jl = nodeList2.length; j < jl; j++) {
            const subItem = nodeList2[j];
            if (!isNil(subItem)) {
              let isDuplicate = false;
              for (let k = 0, kl = parsed.length; k < kl; k++) {
                if (parsed[k] === subItem) {
                  isDuplicate = true;
                  break;
                }
              }
              if (!isDuplicate) {
                parsed.push(subItem);
              }
            }
          }
        } else {
          let isDuplicate = false;
          for (let j = 0, jl = parsed.length; j < jl; j++) {
            if (parsed[j] === item) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            parsed.push(item);
          }
        }
      }
    }
    return parsed;
  }
  const nodeList = getNodeList(targets);
  if (nodeList) return (
    /** @type {DOMTargetsArray} */
    Array.from(nodeList)
  );
  return (
    /** @type {TargetsArray} */
    [targets]
  );
}
function registerTargets(targets) {
  const parsedTargetsArray = parseTargets(targets);
  const parsedTargetsLength = parsedTargetsArray.length;
  if (parsedTargetsLength) {
    for (let i2 = 0; i2 < parsedTargetsLength; i2++) {
      const target = parsedTargetsArray[i2];
      if (!target[isRegisteredTargetSymbol]) {
        target[isRegisteredTargetSymbol] = true;
        const isSvgType = isSvg(target);
        const isDom = (
          /** @type {DOMTarget} */
          target.nodeType || isSvgType
        );
        if (isDom) {
          target[isDomSymbol] = true;
          target[isSvgSymbol] = isSvgType;
          target[transformsSymbol] = {};
        }
      }
    }
  }
  return parsedTargetsArray;
}
function get(targetSelector, propName, unit) {
  const targets = registerTargets(targetSelector);
  if (!targets.length) return;
  const [target] = targets;
  const tweenType = getTweenType(target, propName);
  const normalizePropName = sanitizePropertyName(propName, target, tweenType);
  let originalValue = getOriginalAnimatableValue(target, normalizePropName);
  if (isUnd(unit)) {
    return originalValue;
  } else {
    decomposeRawValue(originalValue, decomposedOriginalValue);
    if (decomposedOriginalValue.t === valueTypes.NUMBER || decomposedOriginalValue.t === valueTypes.UNIT) {
      if (unit === false) {
        return decomposedOriginalValue.n;
      } else {
        const convertedValue = convertValueUnit(
          /** @type {DOMTarget} */
          target,
          decomposedOriginalValue,
          /** @type {String} */
          unit,
          false
        );
        return `${round$1(convertedValue.n, globals.precision)}${convertedValue.u}`;
      }
    }
  }
}
function getTimelineTotalDuration(tl) {
  return clampInfinity((tl.iterationDuration + tl._loopDelay) * tl.iterationCount - tl._loopDelay) || minValue;
}
function addTlChild(childParams, tl, timePosition, targets, index, length) {
  const isSetter = isNum(childParams.duration) && /** @type {Number} */
  childParams.duration <= minValue;
  const adjustedPosition = isSetter ? timePosition - minValue : timePosition;
  if (tl.composition) tick(tl, adjustedPosition, 1, 1, tickModes.AUTO);
  const tlChild = targets ? new JSAnimation(
    targets,
    /** @type {AnimationParams} */
    childParams,
    tl,
    adjustedPosition,
    false,
    index,
    length
  ) : new Timer(
    /** @type {TimerParams} */
    childParams,
    tl,
    adjustedPosition
  );
  if (tl.composition) tlChild.init(true);
  addChild(tl, tlChild);
  forEachChildren(tl, (child) => {
    const childTLOffset = child._offset + child._delay;
    const childDur = childTLOffset + child.duration;
    if (childDur > tl.iterationDuration) tl.iterationDuration = childDur;
  });
  tl.duration = getTimelineTotalDuration(tl);
  return tl;
}
var isBrowser, win, doc, tweenTypes, valueTypes, tickModes, compositionTypes, isRegisteredTargetSymbol, isDomSymbol, isSvgSymbol, transformsSymbol, morphPointsSymbol, proxyTargetSymbol, minValue, maxValue, K, maxFps, emptyString, cssVarPrefix, shortTransforms, validTransforms, transformsFragmentStrings, noop, validRgbHslRgx, hexTestRgx, rgbExecRgx, rgbaExecRgx, hslExecRgx, hslaExecRgx, digitWithExponentRgx, unitsExecRgx, lowerCaseRgx, transformsExecRgx, relativeValuesExecRgx, cssVariableMatchRgx, defaults, scope, globals, devTools, globalVersions, toLowerCase, stringStartsWith, now, isArr, isObj, isNum, isStr, isFnc, isUnd, isNil, isSvg, isHex, isRgb, isHsl, isCol, isKey, svgCssReservedProperties, isValidSVGAttribute, parseNumber, pow, sqrt, sin, cos, abs, floor, asin, max, PI, _round, clamp$1, powCache, round$1, snap$1, lerp$1, clampInfinity, normalizeTime, cloneArray, mergeObjects, forEachChildren, removeChild, addChild, parseInlineTransforms, rgbToRgba, hexToRgba, hue2rgb, hslToRgba, convertColorStringValuesToRgbaArray, setValue, getFunctionValue, getTweenType, getCSSValue, getOriginalAnimatableValue, getRelativeValue, createDecomposedValueTargetObject, decomposeRawValue, decomposeTweenValue, decomposedOriginalValue, render, tick, propertyNamesCache, sanitizePropertyName, cleanInlineStyles, Clock, additive, addAdditiveAnimation, engineTickMethod, engineCancelMethod, Engine, engine, tickEngine, killEngine, lookups, getTweenSiblings, addTweenSortMethod, overrideTween, composeTween, removeTweenSliblings, removeTargetsFromJSAnimation, removeTargetsFromRenderable, resetTimerProperties, reviveTimer, timerId, Timer, angleUnitsMap, convertedValuesCache, convertValueUnit, none, easeInPower, easeTypes, halfPI, doublePI, easeInFunctions, eases, easesLookups, parseEaseString, deprecated, parseEase, fromTargetObject, toTargetObject, inlineStylesStore, toFunctionStore, fromFunctionStore, keyframesTargetArray, fastSetValuesArray, keyObjectTarget, tweenId, JSAnimationId, keyframes, key, generateKeyframes, JSAnimation, animate, WAAPIAnimationsLookups, removeWAAPIAnimation, set, remove, getPrevChildOffset, parseTimelinePosition, TLId, Timeline, createTimeline, roundPad$1, padStart$1, padEnd$1, wrap$1, mapRange$1, degToRad$1, radToDeg$1, damp$1, numberImports, maxSpringParamValue, sync, keepTime, transformsShorthands, commonDefaultPXProperties, numberUtils, chainables, curry, chain, makeChainable, roundPad, padStart, padEnd, wrap, mapRange, degToRad, radToDeg, snap, clamp, round, lerp, damp, random, _seed, createSeededRandom, randomPick, shuffle, stagger, index$2, segmenter;
var init_anime_esm = __esm({
  "../../design-system/regent_ui/assets/vendor/anime.esm.js"() {
    isBrowser = typeof window !== "undefined";
    win = isBrowser ? (
      /** @type {AnimeJSWindow} */
      /** @type {unknown} */
      window
    ) : null;
    doc = isBrowser ? document : null;
    tweenTypes = {
      OBJECT: 0,
      ATTRIBUTE: 1,
      CSS: 2,
      TRANSFORM: 3,
      CSS_VAR: 4
    };
    valueTypes = {
      NUMBER: 0,
      UNIT: 1,
      COLOR: 2,
      COMPLEX: 3
    };
    tickModes = {
      NONE: 0,
      AUTO: 1,
      FORCE: 2
    };
    compositionTypes = {
      replace: 0,
      none: 1,
      blend: 2
    };
    isRegisteredTargetSymbol = Symbol();
    isDomSymbol = Symbol();
    isSvgSymbol = Symbol();
    transformsSymbol = Symbol();
    morphPointsSymbol = Symbol();
    proxyTargetSymbol = Symbol();
    minValue = 1e-11;
    maxValue = 1e12;
    K = 1e3;
    maxFps = 240;
    emptyString = "";
    cssVarPrefix = "var(";
    shortTransforms = /* @__PURE__ */ (() => {
      const map = /* @__PURE__ */ new Map();
      map.set("x", "translateX");
      map.set("y", "translateY");
      map.set("z", "translateZ");
      return map;
    })();
    validTransforms = [
      "translateX",
      "translateY",
      "translateZ",
      "rotate",
      "rotateX",
      "rotateY",
      "rotateZ",
      "scale",
      "scaleX",
      "scaleY",
      "scaleZ",
      "skew",
      "skewX",
      "skewY",
      "matrix",
      "matrix3d",
      "perspective"
    ];
    transformsFragmentStrings = /* @__PURE__ */ validTransforms.reduce((a2, v2) => ({ ...a2, [v2]: v2 + "(" }), {});
    noop = () => {
    };
    validRgbHslRgx = /\)\s*[-.\d]/;
    hexTestRgx = /(^#([\da-f]{3}){1,2}$)|(^#([\da-f]{4}){1,2}$)/i;
    rgbExecRgx = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i;
    rgbaExecRgx = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
    hslExecRgx = /hsl\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*\)/i;
    hslaExecRgx = /hsla\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)\s*\)/i;
    digitWithExponentRgx = /[-+]?\d*\.?\d+(?:e[-+]?\d)?/gi;
    unitsExecRgx = /^([-+]?\d*\.?\d+(?:e[-+]?\d+)?)([a-z]+|%)$/i;
    lowerCaseRgx = /([a-z])([A-Z])/g;
    transformsExecRgx = /(\w+)(\([^)]+\)+)/g;
    relativeValuesExecRgx = /(\*=|\+=|-=)/;
    cssVariableMatchRgx = /var\(\s*(--[\w-]+)(?:\s*,\s*([^)]+))?\s*\)/;
    defaults = {
      id: null,
      keyframes: null,
      playbackEase: null,
      playbackRate: 1,
      frameRate: maxFps,
      loop: 0,
      reversed: false,
      alternate: false,
      autoplay: true,
      persist: false,
      duration: K,
      delay: 0,
      loopDelay: 0,
      ease: "out(2)",
      composition: compositionTypes.replace,
      modifier: (v2) => v2,
      onBegin: noop,
      onBeforeUpdate: noop,
      onUpdate: noop,
      onLoop: noop,
      onPause: noop,
      onComplete: noop,
      onRender: noop
    };
    scope = {
      /** @type {Scope} */
      current: null,
      /** @type {Document|DOMTarget} */
      root: doc
    };
    globals = {
      /** @type {DefaultsParams} */
      defaults,
      /** @type {Number} */
      precision: 4,
      /** @type {Number} equals 1 in ms mode, 0.001 in s mode */
      timeScale: 1,
      /** @type {Number} */
      tickThreshold: 200
    };
    devTools = isBrowser && win.AnimeJSDevTools;
    globalVersions = { version: "4.3.5", engine: null };
    if (isBrowser) {
      if (!win.AnimeJS) win.AnimeJS = [];
      win.AnimeJS.push(globalVersions);
    }
    toLowerCase = (str) => str.replace(lowerCaseRgx, "$1-$2").toLowerCase();
    stringStartsWith = (str, sub) => str.indexOf(sub) === 0;
    now = Date.now;
    isArr = Array.isArray;
    isObj = (a2) => a2 && a2.constructor === Object;
    isNum = (a2) => typeof a2 === "number" && !isNaN(a2);
    isStr = (a2) => typeof a2 === "string";
    isFnc = (a2) => typeof a2 === "function";
    isUnd = (a2) => typeof a2 === "undefined";
    isNil = (a2) => isUnd(a2) || a2 === null;
    isSvg = (a2) => isBrowser && a2 instanceof SVGElement;
    isHex = (a2) => hexTestRgx.test(a2);
    isRgb = (a2) => stringStartsWith(a2, "rgb");
    isHsl = (a2) => stringStartsWith(a2, "hsl");
    isCol = (a2) => isHex(a2) || (isRgb(a2) || isHsl(a2)) && (a2[a2.length - 1] === ")" || !validRgbHslRgx.test(a2));
    isKey = (a2) => !globals.defaults.hasOwnProperty(a2);
    svgCssReservedProperties = ["opacity", "rotate", "overflow", "color"];
    isValidSVGAttribute = (el, propertyName) => {
      if (svgCssReservedProperties.includes(propertyName)) return false;
      if (el.getAttribute(propertyName) || propertyName in el) {
        if (propertyName === "scale") {
          const elParentNode = (
            /** @type {SVGGeometryElement} */
            /** @type {DOMTarget} */
            el.parentNode
          );
          return elParentNode && elParentNode.tagName === "filter";
        }
        return true;
      }
    };
    parseNumber = (str) => isStr(str) ? parseFloat(
      /** @type {String} */
      str
    ) : (
      /** @type {Number} */
      str
    );
    pow = Math.pow;
    sqrt = Math.sqrt;
    sin = Math.sin;
    cos = Math.cos;
    abs = Math.abs;
    floor = Math.floor;
    asin = Math.asin;
    max = Math.max;
    PI = Math.PI;
    _round = Math.round;
    clamp$1 = (v2, min, max2) => v2 < min ? min : v2 > max2 ? max2 : v2;
    powCache = {};
    round$1 = (v2, decimalLength) => {
      if (decimalLength < 0) return v2;
      if (!decimalLength) return _round(v2);
      let p2 = powCache[decimalLength];
      if (!p2) p2 = powCache[decimalLength] = 10 ** decimalLength;
      return _round(v2 * p2) / p2;
    };
    snap$1 = (v2, increment) => isArr(increment) ? increment.reduce((closest, cv) => abs(cv - v2) < abs(closest - v2) ? cv : closest) : increment ? _round(v2 / increment) * increment : v2;
    lerp$1 = (start, end, factor) => start + (end - start) * factor;
    clampInfinity = (v2) => v2 === Infinity ? maxValue : v2 === -Infinity ? -maxValue : v2;
    normalizeTime = (v2) => v2 <= minValue ? minValue : clampInfinity(round$1(v2, 11));
    cloneArray = (a2) => isArr(a2) ? [...a2] : a2;
    mergeObjects = (o1, o2) => {
      const merged = (
        /** @type {T & U} */
        { ...o1 }
      );
      for (let p2 in o2) {
        const o1p = (
          /** @type {T & U} */
          o1[p2]
        );
        merged[p2] = isUnd(o1p) ? (
          /** @type {T & U} */
          o2[p2]
        ) : o1p;
      }
      return merged;
    };
    forEachChildren = (parent, callback, reverse, prevProp = "_prev", nextProp = "_next") => {
      let next = parent._head;
      let adjustedNextProp = nextProp;
      if (reverse) {
        next = parent._tail;
        adjustedNextProp = prevProp;
      }
      while (next) {
        const currentNext = next[adjustedNextProp];
        callback(next);
        next = currentNext;
      }
    };
    removeChild = (parent, child, prevProp = "_prev", nextProp = "_next") => {
      const prev = child[prevProp];
      const next = child[nextProp];
      prev ? prev[nextProp] = next : parent._head = next;
      next ? next[prevProp] = prev : parent._tail = prev;
      child[prevProp] = null;
      child[nextProp] = null;
    };
    addChild = (parent, child, sortMethod, prevProp = "_prev", nextProp = "_next") => {
      let prev = parent._tail;
      while (prev && sortMethod && sortMethod(prev, child)) prev = prev[prevProp];
      const next = prev ? prev[nextProp] : parent._head;
      prev ? prev[nextProp] = child : parent._head = child;
      next ? next[prevProp] = child : parent._tail = child;
      child[prevProp] = prev;
      child[nextProp] = next;
    };
    parseInlineTransforms = (target, propName, animationInlineStyles) => {
      const inlineTransforms = target.style.transform;
      let inlinedStylesPropertyValue;
      if (inlineTransforms) {
        const cachedTransforms = target[transformsSymbol];
        let t2;
        while (t2 = transformsExecRgx.exec(inlineTransforms)) {
          const inlinePropertyName = t2[1];
          const inlinePropertyValue = t2[2].slice(1, -1);
          cachedTransforms[inlinePropertyName] = inlinePropertyValue;
          if (inlinePropertyName === propName) {
            inlinedStylesPropertyValue = inlinePropertyValue;
            if (animationInlineStyles) {
              animationInlineStyles[propName] = inlinePropertyValue;
            }
          }
        }
      }
      return inlineTransforms && !isUnd(inlinedStylesPropertyValue) ? inlinedStylesPropertyValue : stringStartsWith(propName, "scale") ? "1" : stringStartsWith(propName, "rotate") || stringStartsWith(propName, "skew") ? "0deg" : "0px";
    };
    rgbToRgba = (rgbValue) => {
      const rgba = rgbExecRgx.exec(rgbValue) || rgbaExecRgx.exec(rgbValue);
      const a2 = !isUnd(rgba[4]) ? +rgba[4] : 1;
      return [
        +rgba[1],
        +rgba[2],
        +rgba[3],
        a2
      ];
    };
    hexToRgba = (hexValue) => {
      const hexLength = hexValue.length;
      const isShort = hexLength === 4 || hexLength === 5;
      return [
        +("0x" + hexValue[1] + hexValue[isShort ? 1 : 2]),
        +("0x" + hexValue[isShort ? 2 : 3] + hexValue[isShort ? 2 : 4]),
        +("0x" + hexValue[isShort ? 3 : 5] + hexValue[isShort ? 3 : 6]),
        hexLength === 5 || hexLength === 9 ? +(+("0x" + hexValue[isShort ? 4 : 7] + hexValue[isShort ? 4 : 8]) / 255).toFixed(3) : 1
      ];
    };
    hue2rgb = (p2, q, t2) => {
      if (t2 < 0) t2 += 1;
      if (t2 > 1) t2 -= 1;
      return t2 < 1 / 6 ? p2 + (q - p2) * 6 * t2 : t2 < 1 / 2 ? q : t2 < 2 / 3 ? p2 + (q - p2) * (2 / 3 - t2) * 6 : p2;
    };
    hslToRgba = (hslValue) => {
      const hsla = hslExecRgx.exec(hslValue) || hslaExecRgx.exec(hslValue);
      const h2 = +hsla[1] / 360;
      const s2 = +hsla[2] / 100;
      const l2 = +hsla[3] / 100;
      const a2 = !isUnd(hsla[4]) ? +hsla[4] : 1;
      let r2, g2, b2;
      if (s2 === 0) {
        r2 = g2 = b2 = l2;
      } else {
        const q = l2 < 0.5 ? l2 * (1 + s2) : l2 + s2 - l2 * s2;
        const p2 = 2 * l2 - q;
        r2 = round$1(hue2rgb(p2, q, h2 + 1 / 3) * 255, 0);
        g2 = round$1(hue2rgb(p2, q, h2) * 255, 0);
        b2 = round$1(hue2rgb(p2, q, h2 - 1 / 3) * 255, 0);
      }
      return [r2, g2, b2, a2];
    };
    convertColorStringValuesToRgbaArray = (colorString) => {
      return isRgb(colorString) ? rgbToRgba(colorString) : isHex(colorString) ? hexToRgba(colorString) : isHsl(colorString) ? hslToRgba(colorString) : [0, 0, 0, 1];
    };
    setValue = (targetValue, defaultValue) => {
      return isUnd(targetValue) ? defaultValue : targetValue;
    };
    getFunctionValue = (value, target, index, total, store) => {
      let func;
      if (isFnc(value)) {
        func = () => {
          const computed = (
            /** @type {Function} */
            value(target, index, total)
          );
          return !isNaN(+computed) ? +computed : computed || 0;
        };
      } else if (isStr(value) && stringStartsWith(value, cssVarPrefix)) {
        func = () => {
          const match = value.match(cssVariableMatchRgx);
          const cssVarName = match[1];
          const fallbackValue = match[2];
          let computed = getComputedStyle(
            /** @type {HTMLElement} */
            target
          )?.getPropertyValue(cssVarName);
          if ((!computed || computed.trim() === emptyString) && fallbackValue) {
            computed = fallbackValue.trim();
          }
          return computed || 0;
        };
      } else {
        return value;
      }
      if (store) store.func = func;
      return func();
    };
    getTweenType = (target, prop) => {
      return !target[isDomSymbol] ? tweenTypes.OBJECT : (
        // Handle SVG attributes
        target[isSvgSymbol] && isValidSVGAttribute(target, prop) ? tweenTypes.ATTRIBUTE : (
          // Handle CSS Transform properties differently than CSS to allow individual animations
          validTransforms.includes(prop) || shortTransforms.get(prop) ? tweenTypes.TRANSFORM : (
            // CSS variables
            stringStartsWith(prop, "--") ? tweenTypes.CSS_VAR : (
              // All other CSS properties
              prop in /** @type {DOMTarget} */
              target.style ? tweenTypes.CSS : (
                // Handle other DOM Attributes
                prop in target ? tweenTypes.OBJECT : tweenTypes.ATTRIBUTE
              )
            )
          )
        )
      );
    };
    getCSSValue = (target, propName, animationInlineStyles) => {
      const inlineStyles = target.style[propName];
      if (inlineStyles && animationInlineStyles) {
        animationInlineStyles[propName] = inlineStyles;
      }
      const value = inlineStyles || getComputedStyle(target[proxyTargetSymbol] || target).getPropertyValue(propName);
      return value === "auto" ? "0" : value;
    };
    getOriginalAnimatableValue = (target, propName, tweenType, animationInlineStyles) => {
      const type = !isUnd(tweenType) ? tweenType : getTweenType(target, propName);
      return type === tweenTypes.OBJECT ? target[propName] || 0 : type === tweenTypes.ATTRIBUTE ? (
        /** @type {DOMTarget} */
        target.getAttribute(propName)
      ) : type === tweenTypes.TRANSFORM ? parseInlineTransforms(
        /** @type {DOMTarget} */
        target,
        propName,
        animationInlineStyles
      ) : type === tweenTypes.CSS_VAR ? getCSSValue(
        /** @type {DOMTarget} */
        target,
        propName,
        animationInlineStyles
      ).trimStart() : getCSSValue(
        /** @type {DOMTarget} */
        target,
        propName,
        animationInlineStyles
      );
    };
    getRelativeValue = (x2, y2, operator) => {
      return operator === "-" ? x2 - y2 : operator === "+" ? x2 + y2 : x2 * y2;
    };
    createDecomposedValueTargetObject = () => {
      return {
        /** @type {valueTypes} */
        t: valueTypes.NUMBER,
        n: 0,
        u: null,
        o: null,
        d: null,
        s: null
      };
    };
    decomposeRawValue = (rawValue, targetObject) => {
      targetObject.t = valueTypes.NUMBER;
      targetObject.n = 0;
      targetObject.u = null;
      targetObject.o = null;
      targetObject.d = null;
      targetObject.s = null;
      if (!rawValue) return targetObject;
      const num = +rawValue;
      if (!isNaN(num)) {
        targetObject.n = num;
        return targetObject;
      } else {
        let str = (
          /** @type {String} */
          rawValue
        );
        if (str[1] === "=") {
          targetObject.o = str[0];
          str = str.slice(2);
        }
        const unitMatch = str.includes(" ") ? false : unitsExecRgx.exec(str);
        if (unitMatch) {
          targetObject.t = valueTypes.UNIT;
          targetObject.n = +unitMatch[1];
          targetObject.u = unitMatch[2];
          return targetObject;
        } else if (targetObject.o) {
          targetObject.n = +str;
          return targetObject;
        } else if (isCol(str)) {
          targetObject.t = valueTypes.COLOR;
          targetObject.d = convertColorStringValuesToRgbaArray(str);
          return targetObject;
        } else {
          const matchedNumbers = str.match(digitWithExponentRgx);
          targetObject.t = valueTypes.COMPLEX;
          targetObject.d = matchedNumbers ? matchedNumbers.map(Number) : [];
          targetObject.s = str.split(digitWithExponentRgx) || [];
          return targetObject;
        }
      }
    };
    decomposeTweenValue = (tween, targetObject) => {
      targetObject.t = tween._valueType;
      targetObject.n = tween._toNumber;
      targetObject.u = tween._unit;
      targetObject.o = null;
      targetObject.d = cloneArray(tween._toNumbers);
      targetObject.s = cloneArray(tween._strings);
      return targetObject;
    };
    decomposedOriginalValue = createDecomposedValueTargetObject();
    render = (tickable, time, muteCallbacks, internalRender, tickMode) => {
      const parent = tickable.parent;
      const duration = tickable.duration;
      const completed = tickable.completed;
      const iterationDuration = tickable.iterationDuration;
      const iterationCount = tickable.iterationCount;
      const _currentIteration = tickable._currentIteration;
      const _loopDelay = tickable._loopDelay;
      const _reversed = tickable._reversed;
      const _alternate = tickable._alternate;
      const _hasChildren = tickable._hasChildren;
      const tickableDelay = tickable._delay;
      const tickablePrevAbsoluteTime = tickable._currentTime;
      const tickableEndTime = tickableDelay + iterationDuration;
      const tickableAbsoluteTime = time - tickableDelay;
      const tickablePrevTime = clamp$1(tickablePrevAbsoluteTime, -tickableDelay, duration);
      const tickableCurrentTime = clamp$1(tickableAbsoluteTime, -tickableDelay, duration);
      const deltaTime = tickableAbsoluteTime - tickablePrevAbsoluteTime;
      const isCurrentTimeAboveZero = tickableCurrentTime > 0;
      const isCurrentTimeEqualOrAboveDuration = tickableCurrentTime >= duration;
      const isSetter = duration <= minValue;
      const forcedTick = tickMode === tickModes.FORCE;
      let isOdd = 0;
      let iterationElapsedTime = tickableAbsoluteTime;
      let hasRendered = 0;
      if (iterationCount > 1) {
        const currentIteration = ~~(tickableCurrentTime / (iterationDuration + (isCurrentTimeEqualOrAboveDuration ? 0 : _loopDelay)));
        tickable._currentIteration = clamp$1(currentIteration, 0, iterationCount);
        if (isCurrentTimeEqualOrAboveDuration) tickable._currentIteration--;
        isOdd = tickable._currentIteration % 2;
        iterationElapsedTime = tickableCurrentTime % (iterationDuration + _loopDelay) || 0;
      }
      const isReversed = _reversed ^ (_alternate && isOdd);
      const _ease = (
        /** @type {Renderable} */
        tickable._ease
      );
      let iterationTime = isCurrentTimeEqualOrAboveDuration ? isReversed ? 0 : duration : isReversed ? iterationDuration - iterationElapsedTime : iterationElapsedTime;
      if (_ease) iterationTime = iterationDuration * _ease(iterationTime / iterationDuration) || 0;
      const isRunningBackwards = (parent ? parent.backwards : tickableAbsoluteTime < tickablePrevAbsoluteTime) ? !isReversed : !!isReversed;
      tickable._currentTime = tickableAbsoluteTime;
      tickable._iterationTime = iterationTime;
      tickable.backwards = isRunningBackwards;
      if (isCurrentTimeAboveZero && !tickable.began) {
        tickable.began = true;
        if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
          tickable.onBegin(
            /** @type {CallbackArgument} */
            tickable
          );
        }
      } else if (tickableAbsoluteTime <= 0) {
        tickable.began = false;
      }
      if (!muteCallbacks && !_hasChildren && isCurrentTimeAboveZero && tickable._currentIteration !== _currentIteration) {
        tickable.onLoop(
          /** @type {CallbackArgument} */
          tickable
        );
      }
      if (forcedTick || tickMode === tickModes.AUTO && (time >= tickableDelay && time <= tickableEndTime || // Normal render
      time <= tickableDelay && tickablePrevTime > tickableDelay || // Playhead is before the animation start time so make sure the animation is at its initial state
      time >= tickableEndTime && tickablePrevTime !== duration) || iterationTime >= tickableEndTime && tickablePrevTime !== duration || iterationTime <= tickableDelay && tickablePrevTime > 0 || time <= tickablePrevTime && tickablePrevTime === duration && completed || // Force a render if a seek occurs on an completed animation
      isCurrentTimeEqualOrAboveDuration && !completed && isSetter) {
        if (isCurrentTimeAboveZero) {
          tickable.computeDeltaTime(tickablePrevTime);
          if (!muteCallbacks) tickable.onBeforeUpdate(
            /** @type {CallbackArgument} */
            tickable
          );
        }
        if (!_hasChildren) {
          const forcedRender = forcedTick || (isRunningBackwards ? deltaTime * -1 : deltaTime) >= globals.tickThreshold;
          const absoluteTime = tickable._offset + (parent ? parent._offset : 0) + tickableDelay + iterationTime;
          let tween = (
            /** @type {Tween} */
            /** @type {JSAnimation} */
            tickable._head
          );
          let tweenTarget;
          let tweenStyle;
          let tweenTargetTransforms;
          let tweenTargetTransformsProperties;
          let tweenTransformsNeedUpdate = 0;
          while (tween) {
            const tweenComposition = tween._composition;
            const tweenCurrentTime = tween._currentTime;
            const tweenChangeDuration = tween._changeDuration;
            const tweenAbsEndTime = tween._absoluteStartTime + tween._changeDuration;
            const tweenNextRep = tween._nextRep;
            const tweenPrevRep = tween._prevRep;
            const tweenHasComposition = tweenComposition !== compositionTypes.none;
            if ((forcedRender || (tweenCurrentTime !== tweenChangeDuration || absoluteTime <= tweenAbsEndTime + (tweenNextRep ? tweenNextRep._delay : 0)) && (tweenCurrentTime !== 0 || absoluteTime >= tween._absoluteStartTime)) && (!tweenHasComposition || !tween._isOverridden && (!tween._isOverlapped || absoluteTime <= tweenAbsEndTime) && (!tweenNextRep || (tweenNextRep._isOverridden || absoluteTime <= tweenNextRep._absoluteStartTime)) && (!tweenPrevRep || (tweenPrevRep._isOverridden || absoluteTime >= tweenPrevRep._absoluteStartTime + tweenPrevRep._changeDuration + tween._delay)))) {
              const tweenNewTime = tween._currentTime = clamp$1(iterationTime - tween._startTime, 0, tweenChangeDuration);
              const tweenProgress = tween._ease(tweenNewTime / tween._updateDuration);
              const tweenModifier = tween._modifier;
              const tweenValueType = tween._valueType;
              const tweenType = tween._tweenType;
              const tweenIsObject = tweenType === tweenTypes.OBJECT;
              const tweenIsNumber = tweenValueType === valueTypes.NUMBER;
              const tweenPrecision = tweenIsNumber && tweenIsObject || tweenProgress === 0 || tweenProgress === 1 ? -1 : globals.precision;
              let value;
              let number;
              if (tweenIsNumber) {
                value = number = /** @type {Number} */
                tweenModifier(round$1(lerp$1(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
              } else if (tweenValueType === valueTypes.UNIT) {
                number = /** @type {Number} */
                tweenModifier(round$1(lerp$1(tween._fromNumber, tween._toNumber, tweenProgress), tweenPrecision));
                value = `${number}${tween._unit}`;
              } else if (tweenValueType === valueTypes.COLOR) {
                const fn = tween._fromNumbers;
                const tn = tween._toNumbers;
                const r2 = round$1(clamp$1(
                  /** @type {Number} */
                  tweenModifier(lerp$1(fn[0], tn[0], tweenProgress)),
                  0,
                  255
                ), 0);
                const g2 = round$1(clamp$1(
                  /** @type {Number} */
                  tweenModifier(lerp$1(fn[1], tn[1], tweenProgress)),
                  0,
                  255
                ), 0);
                const b2 = round$1(clamp$1(
                  /** @type {Number} */
                  tweenModifier(lerp$1(fn[2], tn[2], tweenProgress)),
                  0,
                  255
                ), 0);
                const a2 = clamp$1(
                  /** @type {Number} */
                  tweenModifier(round$1(lerp$1(fn[3], tn[3], tweenProgress), tweenPrecision)),
                  0,
                  1
                );
                value = `rgba(${r2},${g2},${b2},${a2})`;
                if (tweenHasComposition) {
                  const ns = tween._numbers;
                  ns[0] = r2;
                  ns[1] = g2;
                  ns[2] = b2;
                  ns[3] = a2;
                }
              } else if (tweenValueType === valueTypes.COMPLEX) {
                value = tween._strings[0];
                for (let j = 0, l2 = tween._toNumbers.length; j < l2; j++) {
                  const n2 = (
                    /** @type {Number} */
                    tweenModifier(round$1(lerp$1(tween._fromNumbers[j], tween._toNumbers[j], tweenProgress), tweenPrecision))
                  );
                  const s2 = tween._strings[j + 1];
                  value += `${s2 ? n2 + s2 : n2}`;
                  if (tweenHasComposition) {
                    tween._numbers[j] = n2;
                  }
                }
              }
              if (tweenHasComposition) {
                tween._number = number;
              }
              if (!internalRender && tweenComposition !== compositionTypes.blend) {
                const tweenProperty = tween.property;
                tweenTarget = tween.target;
                if (tweenIsObject) {
                  tweenTarget[tweenProperty] = value;
                } else if (tweenType === tweenTypes.ATTRIBUTE) {
                  tweenTarget.setAttribute(
                    tweenProperty,
                    /** @type {String} */
                    value
                  );
                } else {
                  tweenStyle = /** @type {DOMTarget} */
                  tweenTarget.style;
                  if (tweenType === tweenTypes.TRANSFORM) {
                    if (tweenTarget !== tweenTargetTransforms) {
                      tweenTargetTransforms = tweenTarget;
                      tweenTargetTransformsProperties = tweenTarget[transformsSymbol];
                    }
                    tweenTargetTransformsProperties[tweenProperty] = value;
                    tweenTransformsNeedUpdate = 1;
                  } else if (tweenType === tweenTypes.CSS) {
                    tweenStyle[tweenProperty] = value;
                  } else if (tweenType === tweenTypes.CSS_VAR) {
                    tweenStyle.setProperty(
                      tweenProperty,
                      /** @type {String} */
                      value
                    );
                  }
                }
                if (isCurrentTimeAboveZero) hasRendered = 1;
              } else {
                tween._value = value;
              }
            }
            if (tweenTransformsNeedUpdate && tween._renderTransforms) {
              let str = emptyString;
              for (let key2 in tweenTargetTransformsProperties) {
                str += `${transformsFragmentStrings[key2]}${tweenTargetTransformsProperties[key2]}) `;
              }
              tweenStyle.transform = str;
              tweenTransformsNeedUpdate = 0;
            }
            tween = tween._next;
          }
          if (!muteCallbacks && hasRendered) {
            tickable.onRender(
              /** @type {JSAnimation} */
              tickable
            );
          }
        }
        if (!muteCallbacks && isCurrentTimeAboveZero) {
          tickable.onUpdate(
            /** @type {CallbackArgument} */
            tickable
          );
        }
      }
      if (parent && isSetter) {
        if (!muteCallbacks && // (tickableAbsoluteTime > 0 instead) of (tickableAbsoluteTime >= duration) to prevent floating point precision issues
        // see: https://github.com/juliangarnier/anime/issues/1088
        (parent.began && !isRunningBackwards && tickableAbsoluteTime > 0 && !completed || isRunningBackwards && tickableAbsoluteTime <= minValue && completed)) {
          tickable.onComplete(
            /** @type {CallbackArgument} */
            tickable
          );
          tickable.completed = !isRunningBackwards;
        }
      } else if (isCurrentTimeAboveZero && isCurrentTimeEqualOrAboveDuration) {
        if (iterationCount === Infinity) {
          tickable._startTime += tickable.duration;
        } else if (tickable._currentIteration >= iterationCount - 1) {
          tickable.paused = true;
          if (!completed && !_hasChildren) {
            tickable.completed = true;
            if (!muteCallbacks && !(parent && (isRunningBackwards || !parent.began))) {
              tickable.onComplete(
                /** @type {CallbackArgument} */
                tickable
              );
              tickable._resolve(
                /** @type {CallbackArgument} */
                tickable
              );
            }
          }
        }
      } else {
        tickable.completed = false;
      }
      return hasRendered;
    };
    tick = (tickable, time, muteCallbacks, internalRender, tickMode) => {
      const _currentIteration = tickable._currentIteration;
      render(tickable, time, muteCallbacks, internalRender, tickMode);
      if (tickable._hasChildren) {
        const tl = (
          /** @type {Timeline} */
          tickable
        );
        const tlIsRunningBackwards = tl.backwards;
        const tlChildrenTime = internalRender ? time : tl._iterationTime;
        const tlCildrenTickTime = now();
        let tlChildrenHasRendered = 0;
        let tlChildrenHaveCompleted = true;
        if (!internalRender && tl._currentIteration !== _currentIteration) {
          const tlIterationDuration = tl.iterationDuration;
          forEachChildren(tl, (child) => {
            if (!tlIsRunningBackwards) {
              if (!child.completed && !child.backwards && child._currentTime < child.iterationDuration) {
                render(child, tlIterationDuration, muteCallbacks, 1, tickModes.FORCE);
              }
              child.began = false;
              child.completed = false;
            } else {
              const childDuration = child.duration;
              const childStartTime = child._offset + child._delay;
              const childEndTime = childStartTime + childDuration;
              if (!muteCallbacks && childDuration <= minValue && (!childStartTime || childEndTime === tlIterationDuration)) {
                child.onComplete(child);
              }
            }
          });
          if (!muteCallbacks) tl.onLoop(
            /** @type {CallbackArgument} */
            tl
          );
        }
        forEachChildren(tl, (child) => {
          const childTime = round$1((tlChildrenTime - child._offset) * child._speed, 12);
          const childTickMode = child._fps < tl._fps ? child.requestTick(tlCildrenTickTime) : tickMode;
          tlChildrenHasRendered += render(child, childTime, muteCallbacks, internalRender, childTickMode);
          if (!child.completed && tlChildrenHaveCompleted) tlChildrenHaveCompleted = false;
        }, tlIsRunningBackwards);
        if (!muteCallbacks && tlChildrenHasRendered) tl.onRender(
          /** @type {CallbackArgument} */
          tl
        );
        if ((tlChildrenHaveCompleted || tlIsRunningBackwards) && tl._currentTime >= tl.duration) {
          tl.paused = true;
          if (!tl.completed) {
            tl.completed = true;
            if (!muteCallbacks) {
              tl.onComplete(
                /** @type {CallbackArgument} */
                tl
              );
              tl._resolve(
                /** @type {CallbackArgument} */
                tl
              );
            }
          }
        }
      }
    };
    propertyNamesCache = {};
    sanitizePropertyName = (propertyName, target, tweenType) => {
      if (tweenType === tweenTypes.TRANSFORM) {
        const t2 = shortTransforms.get(propertyName);
        return t2 ? t2 : propertyName;
      } else if (tweenType === tweenTypes.CSS || // Handle special cases where properties like "strokeDashoffset" needs to be set as "stroke-dashoffset"
      // but properties like "baseFrequency" should stay in lowerCamelCase
      tweenType === tweenTypes.ATTRIBUTE && (isSvg(target) && propertyName in /** @type {DOMTarget} */
      target.style)) {
        const cachedPropertyName = propertyNamesCache[propertyName];
        if (cachedPropertyName) {
          return cachedPropertyName;
        } else {
          const lowerCaseName = propertyName ? toLowerCase(propertyName) : propertyName;
          propertyNamesCache[propertyName] = lowerCaseName;
          return lowerCaseName;
        }
      } else {
        return propertyName;
      }
    };
    cleanInlineStyles = (renderable) => {
      if (renderable._hasChildren) {
        forEachChildren(renderable, cleanInlineStyles, true);
      } else {
        const animation = (
          /** @type {JSAnimation} */
          renderable
        );
        animation.pause();
        forEachChildren(animation, (tween) => {
          const tweenProperty = tween.property;
          const tweenTarget = tween.target;
          if (tweenTarget[isDomSymbol]) {
            const targetStyle = (
              /** @type {DOMTarget} */
              tweenTarget.style
            );
            const originalInlinedValue = tween._inlineValue;
            const tweenHadNoInlineValue = isNil(originalInlinedValue) || originalInlinedValue === emptyString;
            if (tween._tweenType === tweenTypes.TRANSFORM) {
              const cachedTransforms = tweenTarget[transformsSymbol];
              if (tweenHadNoInlineValue) {
                delete cachedTransforms[tweenProperty];
              } else {
                cachedTransforms[tweenProperty] = originalInlinedValue;
              }
              if (tween._renderTransforms) {
                if (!Object.keys(cachedTransforms).length) {
                  targetStyle.removeProperty("transform");
                } else {
                  let str = emptyString;
                  for (let key2 in cachedTransforms) {
                    str += transformsFragmentStrings[key2] + cachedTransforms[key2] + ") ";
                  }
                  targetStyle.transform = str;
                }
              }
            } else {
              if (tweenHadNoInlineValue) {
                targetStyle.removeProperty(toLowerCase(tweenProperty));
              } else {
                targetStyle[tweenProperty] = originalInlinedValue;
              }
            }
            if (animation._tail === tween) {
              animation.targets.forEach((t2) => {
                if (t2.getAttribute && t2.getAttribute("style") === emptyString) {
                  t2.removeAttribute("style");
                }
              });
            }
          }
        });
      }
      return renderable;
    };
    Clock = class {
      /** @param {Number} [initTime] */
      constructor(initTime = 0) {
        this.deltaTime = 0;
        this._currentTime = initTime;
        this._lastTickTime = initTime;
        this._startTime = initTime;
        this._lastTime = initTime;
        this._scheduledTime = 0;
        this._frameDuration = K / maxFps;
        this._fps = maxFps;
        this._speed = 1;
        this._hasChildren = false;
        this._head = null;
        this._tail = null;
      }
      get fps() {
        return this._fps;
      }
      set fps(frameRate) {
        const previousFrameDuration = this._frameDuration;
        const fr = +frameRate;
        const fps = fr < minValue ? minValue : fr;
        const frameDuration = K / fps;
        if (fps > defaults.frameRate) defaults.frameRate = fps;
        this._fps = fps;
        this._frameDuration = frameDuration;
        this._scheduledTime += frameDuration - previousFrameDuration;
      }
      get speed() {
        return this._speed;
      }
      set speed(playbackRate) {
        const pbr = +playbackRate;
        this._speed = pbr < minValue ? minValue : pbr;
      }
      /**
       * @param  {Number} time
       * @return {tickModes}
       */
      requestTick(time) {
        const scheduledTime = this._scheduledTime;
        this._lastTickTime = time;
        if (time < scheduledTime) return tickModes.NONE;
        const frameDuration = this._frameDuration;
        const frameDelta = time - scheduledTime;
        this._scheduledTime += frameDelta < frameDuration ? frameDuration : frameDelta;
        return tickModes.AUTO;
      }
      /**
       * @param  {Number} time
       * @return {Number}
       */
      computeDeltaTime(time) {
        const delta = time - this._lastTime;
        this.deltaTime = delta;
        this._lastTime = time;
        return delta;
      }
    };
    additive = {
      animation: null,
      update: noop
    };
    addAdditiveAnimation = (lookups2) => {
      let animation = additive.animation;
      if (!animation) {
        animation = {
          duration: minValue,
          computeDeltaTime: noop,
          _offset: 0,
          _delay: 0,
          _head: null,
          _tail: null
        };
        additive.animation = animation;
        additive.update = () => {
          lookups2.forEach((propertyAnimation) => {
            for (let propertyName in propertyAnimation) {
              const tweens = propertyAnimation[propertyName];
              const lookupTween = tweens._head;
              if (lookupTween) {
                const valueType = lookupTween._valueType;
                const additiveValues = valueType === valueTypes.COMPLEX || valueType === valueTypes.COLOR ? cloneArray(lookupTween._fromNumbers) : null;
                let additiveValue = lookupTween._fromNumber;
                let tween = tweens._tail;
                while (tween && tween !== lookupTween) {
                  if (additiveValues) {
                    for (let i2 = 0, l2 = tween._numbers.length; i2 < l2; i2++) additiveValues[i2] += tween._numbers[i2];
                  } else {
                    additiveValue += tween._number;
                  }
                  tween = tween._prevAdd;
                }
                lookupTween._toNumber = additiveValue;
                lookupTween._toNumbers = additiveValues;
              }
            }
          });
          render(animation, 1, 1, 0, tickModes.FORCE);
        };
      }
      return animation;
    };
    engineTickMethod = /* @__PURE__ */ (() => isBrowser ? requestAnimationFrame : setImmediate)();
    engineCancelMethod = /* @__PURE__ */ (() => isBrowser ? cancelAnimationFrame : clearImmediate)();
    Engine = class extends Clock {
      /** @param {Number} [initTime] */
      constructor(initTime) {
        super(initTime);
        this.useDefaultMainLoop = true;
        this.pauseOnDocumentHidden = true;
        this.defaults = defaults;
        this.paused = true;
        this.reqId = 0;
      }
      update() {
        const time = this._currentTime = now();
        if (this.requestTick(time)) {
          this.computeDeltaTime(time);
          const engineSpeed = this._speed;
          const engineFps = this._fps;
          let activeTickable = (
            /** @type {Tickable} */
            this._head
          );
          while (activeTickable) {
            const nextTickable = activeTickable._next;
            if (!activeTickable.paused) {
              tick(
                activeTickable,
                (time - activeTickable._startTime) * activeTickable._speed * engineSpeed,
                0,
                // !muteCallbacks
                0,
                // !internalRender
                activeTickable._fps < engineFps ? activeTickable.requestTick(time) : tickModes.AUTO
              );
            } else {
              removeChild(this, activeTickable);
              this._hasChildren = !!this._tail;
              activeTickable._running = false;
              if (activeTickable.completed && !activeTickable._cancelled) {
                activeTickable.cancel();
              }
            }
            activeTickable = nextTickable;
          }
          additive.update();
        }
      }
      wake() {
        if (this.useDefaultMainLoop && !this.reqId) {
          this.requestTick(now());
          this.reqId = engineTickMethod(tickEngine);
        }
        return this;
      }
      pause() {
        if (!this.reqId) return;
        this.paused = true;
        return killEngine();
      }
      resume() {
        if (!this.paused) return;
        this.paused = false;
        forEachChildren(this, (child) => child.resetTime());
        return this.wake();
      }
      // Getter and setter for speed
      get speed() {
        return this._speed * (globals.timeScale === 1 ? 1 : K);
      }
      set speed(playbackRate) {
        this._speed = playbackRate * globals.timeScale;
        forEachChildren(this, (child) => child.speed = child._speed);
      }
      // Getter and setter for timeUnit
      get timeUnit() {
        return globals.timeScale === 1 ? "ms" : "s";
      }
      set timeUnit(unit) {
        const secondsScale = 1e-3;
        const isSecond = unit === "s";
        const newScale = isSecond ? secondsScale : 1;
        if (globals.timeScale !== newScale) {
          globals.timeScale = newScale;
          globals.tickThreshold = 200 * newScale;
          const scaleFactor = isSecond ? secondsScale : K;
          this.defaults.duration *= scaleFactor;
          this._speed *= scaleFactor;
        }
      }
      // Getter and setter for precision
      get precision() {
        return globals.precision;
      }
      set precision(precision) {
        globals.precision = precision;
      }
    };
    engine = /* @__PURE__ */ (() => {
      const engine2 = new Engine(now());
      if (isBrowser) {
        globalVersions.engine = engine2;
        doc.addEventListener("visibilitychange", () => {
          if (!engine2.pauseOnDocumentHidden) return;
          doc.hidden ? engine2.pause() : engine2.resume();
        });
      }
      return engine2;
    })();
    tickEngine = () => {
      if (engine._head) {
        engine.reqId = engineTickMethod(tickEngine);
        engine.update();
      } else {
        engine.reqId = 0;
      }
    };
    killEngine = () => {
      engineCancelMethod(
        /** @type {NodeJS.Immediate & Number} */
        engine.reqId
      );
      engine.reqId = 0;
      return engine;
    };
    lookups = {
      /** @type {TweenReplaceLookups} */
      _rep: /* @__PURE__ */ new WeakMap(),
      /** @type {TweenAdditiveLookups} */
      _add: /* @__PURE__ */ new Map()
    };
    getTweenSiblings = (target, property, lookup = "_rep") => {
      const lookupMap = lookups[lookup];
      let targetLookup = lookupMap.get(target);
      if (!targetLookup) {
        targetLookup = {};
        lookupMap.set(target, targetLookup);
      }
      return targetLookup[property] ? targetLookup[property] : targetLookup[property] = {
        _head: null,
        _tail: null
      };
    };
    addTweenSortMethod = (p2, c2) => {
      return p2._isOverridden || p2._absoluteStartTime > c2._absoluteStartTime;
    };
    overrideTween = (tween) => {
      tween._isOverlapped = 1;
      tween._isOverridden = 1;
      tween._changeDuration = minValue;
      tween._currentTime = minValue;
    };
    composeTween = (tween, siblings) => {
      const tweenCompositionType = tween._composition;
      if (tweenCompositionType === compositionTypes.replace) {
        const tweenAbsStartTime = tween._absoluteStartTime;
        addChild(siblings, tween, addTweenSortMethod, "_prevRep", "_nextRep");
        const prevSibling = tween._prevRep;
        if (prevSibling) {
          const prevParent = prevSibling.parent;
          const prevAbsEndTime = prevSibling._absoluteStartTime + prevSibling._changeDuration;
          if (
            // Check if the previous tween is from a different animation
            tween.parent.id !== prevParent.id && // Check if the animation has loops
            prevParent.iterationCount > 1 && // Check if _absoluteChangeEndTime of last loop overlaps the current tween
            prevAbsEndTime + (prevParent.duration - prevParent.iterationDuration) > tweenAbsStartTime
          ) {
            overrideTween(prevSibling);
            let prevPrevSibling = prevSibling._prevRep;
            while (prevPrevSibling && prevPrevSibling.parent.id === prevParent.id) {
              overrideTween(prevPrevSibling);
              prevPrevSibling = prevPrevSibling._prevRep;
            }
          }
          const absoluteUpdateStartTime = tweenAbsStartTime - tween._delay;
          if (prevAbsEndTime > absoluteUpdateStartTime) {
            const prevChangeStartTime = prevSibling._startTime;
            const prevTLOffset = prevAbsEndTime - (prevChangeStartTime + prevSibling._updateDuration);
            const updatedPrevChangeDuration = round$1(absoluteUpdateStartTime - prevTLOffset - prevChangeStartTime, 12);
            prevSibling._changeDuration = updatedPrevChangeDuration;
            prevSibling._currentTime = updatedPrevChangeDuration;
            prevSibling._isOverlapped = 1;
            if (updatedPrevChangeDuration < minValue) {
              overrideTween(prevSibling);
            }
          }
          let pausePrevParentAnimation = true;
          forEachChildren(prevParent, (t2) => {
            if (!t2._isOverlapped) pausePrevParentAnimation = false;
          });
          if (pausePrevParentAnimation) {
            const prevParentTL = prevParent.parent;
            if (prevParentTL) {
              let pausePrevParentTL = true;
              forEachChildren(prevParentTL, (a2) => {
                if (a2 !== prevParent) {
                  forEachChildren(a2, (t2) => {
                    if (!t2._isOverlapped) pausePrevParentTL = false;
                  });
                }
              });
              if (pausePrevParentTL) {
                prevParentTL.cancel();
              }
            } else {
              prevParent.cancel();
            }
          }
        }
      } else if (tweenCompositionType === compositionTypes.blend) {
        const additiveTweenSiblings = getTweenSiblings(tween.target, tween.property, "_add");
        const additiveAnimation = addAdditiveAnimation(lookups._add);
        let lookupTween = additiveTweenSiblings._head;
        if (!lookupTween) {
          lookupTween = { ...tween };
          lookupTween._composition = compositionTypes.replace;
          lookupTween._updateDuration = minValue;
          lookupTween._startTime = 0;
          lookupTween._numbers = cloneArray(tween._fromNumbers);
          lookupTween._number = 0;
          lookupTween._next = null;
          lookupTween._prev = null;
          addChild(additiveTweenSiblings, lookupTween);
          addChild(additiveAnimation, lookupTween);
        }
        const toNumber = tween._toNumber;
        tween._fromNumber = lookupTween._fromNumber - toNumber;
        tween._toNumber = 0;
        tween._numbers = cloneArray(tween._fromNumbers);
        tween._number = 0;
        lookupTween._fromNumber = toNumber;
        if (tween._toNumbers) {
          const toNumbers = cloneArray(tween._toNumbers);
          if (toNumbers) {
            toNumbers.forEach((value, i2) => {
              tween._fromNumbers[i2] = lookupTween._fromNumbers[i2] - value;
              tween._toNumbers[i2] = 0;
            });
          }
          lookupTween._fromNumbers = toNumbers;
        }
        addChild(additiveTweenSiblings, tween, null, "_prevAdd", "_nextAdd");
      }
      return tween;
    };
    removeTweenSliblings = (tween) => {
      const tweenComposition = tween._composition;
      if (tweenComposition !== compositionTypes.none) {
        const tweenTarget = tween.target;
        const tweenProperty = tween.property;
        const replaceTweensLookup = lookups._rep;
        const replaceTargetProps = replaceTweensLookup.get(tweenTarget);
        const tweenReplaceSiblings = replaceTargetProps[tweenProperty];
        removeChild(tweenReplaceSiblings, tween, "_prevRep", "_nextRep");
        if (tweenComposition === compositionTypes.blend) {
          const addTweensLookup = lookups._add;
          const addTargetProps = addTweensLookup.get(tweenTarget);
          if (!addTargetProps) return;
          const additiveTweenSiblings = addTargetProps[tweenProperty];
          const additiveAnimation = additive.animation;
          removeChild(additiveTweenSiblings, tween, "_prevAdd", "_nextAdd");
          const lookupTween = additiveTweenSiblings._head;
          if (lookupTween && lookupTween === additiveTweenSiblings._tail) {
            removeChild(additiveTweenSiblings, lookupTween, "_prevAdd", "_nextAdd");
            removeChild(additiveAnimation, lookupTween);
            let shouldClean = true;
            for (let prop in addTargetProps) {
              if (addTargetProps[prop]._head) {
                shouldClean = false;
                break;
              }
            }
            if (shouldClean) {
              addTweensLookup.delete(tweenTarget);
            }
          }
        }
      }
      return tween;
    };
    removeTargetsFromJSAnimation = (targetsArray, animation, propertyName) => {
      let tweensMatchesTargets = false;
      forEachChildren(animation, (tween) => {
        const tweenTarget = tween.target;
        if (targetsArray.includes(tweenTarget)) {
          const tweenName = tween.property;
          const tweenType = tween._tweenType;
          const normalizePropName = sanitizePropertyName(propertyName, tweenTarget, tweenType);
          if (!normalizePropName || normalizePropName && normalizePropName === tweenName) {
            if (tween.parent._tail === tween && tween._tweenType === tweenTypes.TRANSFORM && tween._prev && tween._prev._tweenType === tweenTypes.TRANSFORM) {
              tween._prev._renderTransforms = 1;
            }
            removeChild(animation, tween);
            removeTweenSliblings(tween);
            tweensMatchesTargets = true;
          }
        }
      }, true);
      return tweensMatchesTargets;
    };
    removeTargetsFromRenderable = (targetsArray, renderable, propertyName) => {
      const parent = (
        /** @type {Renderable|typeof engine} **/
        renderable ? renderable : engine
      );
      let removeMatches;
      if (parent._hasChildren) {
        let iterationDuration = 0;
        forEachChildren(parent, (child) => {
          if (!child._hasChildren) {
            removeMatches = removeTargetsFromJSAnimation(
              targetsArray,
              /** @type {JSAnimation} */
              child,
              propertyName
            );
            if (removeMatches && !child._head) {
              child.cancel();
              removeChild(parent, child);
            } else {
              const childTLOffset = child._offset + child._delay;
              const childDur = childTLOffset + child.duration;
              if (childDur > iterationDuration) {
                iterationDuration = childDur;
              }
            }
          }
          if (child._head) {
            removeTargetsFromRenderable(targetsArray, child, propertyName);
          } else {
            child._hasChildren = false;
          }
        }, true);
        if (!isUnd(
          /** @type {Renderable} */
          parent.iterationDuration
        )) {
          parent.iterationDuration = iterationDuration;
        }
      } else {
        removeMatches = removeTargetsFromJSAnimation(
          targetsArray,
          /** @type {JSAnimation} */
          parent,
          propertyName
        );
      }
      if (removeMatches && !parent._head) {
        parent._hasChildren = false;
        if (
          /** @type {Renderable} */
          parent.cancel
        ) parent.cancel();
      }
    };
    resetTimerProperties = (timer) => {
      timer.paused = true;
      timer.began = false;
      timer.completed = false;
      return timer;
    };
    reviveTimer = (timer) => {
      if (!timer._cancelled) return timer;
      if (timer._hasChildren) {
        forEachChildren(timer, reviveTimer);
      } else {
        forEachChildren(timer, (tween) => {
          if (tween._composition !== compositionTypes.none) {
            composeTween(tween, getTweenSiblings(tween.target, tween.property));
          }
        });
      }
      timer._cancelled = 0;
      return timer;
    };
    timerId = 0;
    Timer = class extends Clock {
      /**
       * @param {TimerParams} [parameters]
       * @param {Timeline} [parent]
       * @param {Number} [parentPosition]
       */
      constructor(parameters = {}, parent = null, parentPosition = 0) {
        super(0);
        ++timerId;
        const {
          id,
          delay,
          duration,
          reversed,
          alternate,
          loop,
          loopDelay,
          autoplay,
          frameRate,
          playbackRate,
          onComplete,
          onLoop,
          onPause,
          onBegin,
          onBeforeUpdate,
          onUpdate
        } = parameters;
        if (scope.current) scope.current.register(this);
        const timerInitTime = parent ? 0 : engine._lastTickTime;
        const timerDefaults = parent ? parent.defaults : globals.defaults;
        const timerDelay = (
          /** @type {Number} */
          isFnc(delay) || isUnd(delay) ? timerDefaults.delay : +delay
        );
        const timerDuration = isFnc(duration) || isUnd(duration) ? Infinity : +duration;
        const timerLoop = setValue(loop, timerDefaults.loop);
        const timerLoopDelay = setValue(loopDelay, timerDefaults.loopDelay);
        let timerIterationCount = timerLoop === true || timerLoop === Infinity || /** @type {Number} */
        timerLoop < 0 ? Infinity : (
          /** @type {Number} */
          timerLoop + 1
        );
        if (devTools) {
          const isInfinite = timerIterationCount === Infinity;
          const registered = devTools.register(this, parameters, isInfinite);
          if (registered && isInfinite) {
            const minIterations = alternate ? 2 : 1;
            const iterations = parent ? devTools.maxNestedInfiniteLoops : devTools.maxInfiniteLoops;
            timerIterationCount = Math.max(iterations, minIterations);
          }
        }
        let offsetPosition = 0;
        if (parent) {
          offsetPosition = parentPosition;
        } else {
          if (!engine.reqId) engine.requestTick(now());
          offsetPosition = (engine._lastTickTime - engine._startTime) * globals.timeScale;
        }
        this.id = !isUnd(id) ? id : timerId;
        this.parent = parent;
        this.duration = clampInfinity((timerDuration + timerLoopDelay) * timerIterationCount - timerLoopDelay) || minValue;
        this.backwards = false;
        this.paused = true;
        this.began = false;
        this.completed = false;
        this.onBegin = onBegin || timerDefaults.onBegin;
        this.onBeforeUpdate = onBeforeUpdate || timerDefaults.onBeforeUpdate;
        this.onUpdate = onUpdate || timerDefaults.onUpdate;
        this.onLoop = onLoop || timerDefaults.onLoop;
        this.onPause = onPause || timerDefaults.onPause;
        this.onComplete = onComplete || timerDefaults.onComplete;
        this.iterationDuration = timerDuration;
        this.iterationCount = timerIterationCount;
        this._autoplay = parent ? false : setValue(autoplay, timerDefaults.autoplay);
        this._offset = offsetPosition;
        this._delay = timerDelay;
        this._loopDelay = timerLoopDelay;
        this._iterationTime = 0;
        this._currentIteration = 0;
        this._resolve = noop;
        this._running = false;
        this._reversed = +setValue(reversed, timerDefaults.reversed);
        this._reverse = this._reversed;
        this._cancelled = 0;
        this._alternate = setValue(alternate, timerDefaults.alternate);
        this._prev = null;
        this._next = null;
        this._lastTickTime = timerInitTime;
        this._startTime = timerInitTime;
        this._lastTime = timerInitTime;
        this._fps = setValue(frameRate, timerDefaults.frameRate);
        this._speed = setValue(playbackRate, timerDefaults.playbackRate);
      }
      get cancelled() {
        return !!this._cancelled;
      }
      set cancelled(cancelled) {
        cancelled ? this.cancel() : this.reset(true).play();
      }
      get currentTime() {
        return clamp$1(round$1(this._currentTime, globals.precision), -this._delay, this.duration);
      }
      set currentTime(time) {
        const paused = this.paused;
        this.pause().seek(+time);
        if (!paused) this.resume();
      }
      get iterationCurrentTime() {
        return clamp$1(round$1(this._iterationTime, globals.precision), 0, this.iterationDuration);
      }
      set iterationCurrentTime(time) {
        this.currentTime = this.iterationDuration * this._currentIteration + time;
      }
      get progress() {
        return clamp$1(round$1(this._currentTime / this.duration, 10), 0, 1);
      }
      set progress(progress) {
        this.currentTime = this.duration * progress;
      }
      get iterationProgress() {
        return clamp$1(round$1(this._iterationTime / this.iterationDuration, 10), 0, 1);
      }
      set iterationProgress(progress) {
        const iterationDuration = this.iterationDuration;
        this.currentTime = iterationDuration * this._currentIteration + iterationDuration * progress;
      }
      get currentIteration() {
        return this._currentIteration;
      }
      set currentIteration(iterationCount) {
        this.currentTime = this.iterationDuration * clamp$1(+iterationCount, 0, this.iterationCount - 1);
      }
      get reversed() {
        return !!this._reversed;
      }
      set reversed(reverse) {
        reverse ? this.reverse() : this.play();
      }
      get speed() {
        return super.speed;
      }
      set speed(playbackRate) {
        super.speed = playbackRate;
        this.resetTime();
      }
      /**
       * @param  {Boolean} [softReset]
       * @return {this}
       */
      reset(softReset = false) {
        reviveTimer(this);
        if (this._reversed && !this._reverse) this.reversed = false;
        this._iterationTime = this.iterationDuration;
        tick(this, 0, 1, ~~softReset, tickModes.FORCE);
        resetTimerProperties(this);
        if (this._hasChildren) {
          forEachChildren(this, resetTimerProperties);
        }
        return this;
      }
      /**
       * @param  {Boolean} internalRender
       * @return {this}
       */
      init(internalRender = false) {
        this.fps = this._fps;
        this.speed = this._speed;
        if (!internalRender && this._hasChildren) {
          tick(this, this.duration, 1, ~~internalRender, tickModes.FORCE);
        }
        this.reset(internalRender);
        const autoplay = this._autoplay;
        if (autoplay === true) {
          this.resume();
        } else if (autoplay && !isUnd(
          /** @type {ScrollObserver} */
          autoplay.linked
        )) {
          autoplay.link(this);
        }
        return this;
      }
      /** @return {this} */
      resetTime() {
        const timeScale = 1 / (this._speed * engine._speed);
        this._startTime = now() - (this._currentTime + this._delay) * timeScale;
        return this;
      }
      /** @return {this} */
      pause() {
        if (this.paused) return this;
        this.paused = true;
        this.onPause(this);
        return this;
      }
      /** @return {this} */
      resume() {
        if (!this.paused) return this;
        this.paused = false;
        if (this.duration <= minValue && !this._hasChildren) {
          tick(this, minValue, 0, 0, tickModes.FORCE);
        } else {
          if (!this._running) {
            addChild(engine, this);
            engine._hasChildren = true;
            this._running = true;
          }
          this.resetTime();
          this._startTime -= 12;
          engine.wake();
        }
        return this;
      }
      /** @return {this} */
      restart() {
        return this.reset().resume();
      }
      /**
       * @param  {Number} time
       * @param  {Boolean|Number} [muteCallbacks]
       * @param  {Boolean|Number} [internalRender]
       * @return {this}
       */
      seek(time, muteCallbacks = 0, internalRender = 0) {
        reviveTimer(this);
        this.completed = false;
        const isPaused = this.paused;
        this.paused = true;
        tick(this, time + this._delay, ~~muteCallbacks, ~~internalRender, tickModes.AUTO);
        return isPaused ? this : this.resume();
      }
      /** @return {this} */
      alternate() {
        const reversed = this._reversed;
        const count = this.iterationCount;
        const duration = this.iterationDuration;
        const iterations = count === Infinity ? floor(maxValue / duration) : count;
        this._reversed = +(this._alternate && !(iterations % 2) ? reversed : !reversed);
        if (count === Infinity) {
          this.iterationProgress = this._reversed ? 1 - this.iterationProgress : this.iterationProgress;
        } else {
          this.seek(duration * iterations - this._currentTime);
        }
        this.resetTime();
        return this;
      }
      /** @return {this} */
      play() {
        if (this._reversed) this.alternate();
        return this.resume();
      }
      /** @return {this} */
      reverse() {
        if (!this._reversed) this.alternate();
        return this.resume();
      }
      // TODO: Move all the animation / tweens / children related code to Animation / Timeline
      /** @return {this} */
      cancel() {
        if (this._hasChildren) {
          forEachChildren(this, (child) => child.cancel(), true);
        } else {
          forEachChildren(this, removeTweenSliblings);
        }
        this._cancelled = 1;
        return this.pause();
      }
      /**
       * @param  {Number} newDuration
       * @return {this}
       */
      stretch(newDuration) {
        const currentDuration = this.duration;
        const normlizedDuration = normalizeTime(newDuration);
        if (currentDuration === normlizedDuration) return this;
        const timeScale = newDuration / currentDuration;
        const isSetter = newDuration <= minValue;
        this.duration = isSetter ? minValue : normlizedDuration;
        this.iterationDuration = isSetter ? minValue : normalizeTime(this.iterationDuration * timeScale);
        this._offset *= timeScale;
        this._delay *= timeScale;
        this._loopDelay *= timeScale;
        return this;
      }
      /**
        * Cancels the timer by seeking it back to 0 and reverting the attached scroller if necessary
        * @return {this}
        */
      revert() {
        tick(this, 0, 1, 0, tickModes.AUTO);
        const ap = (
          /** @type {ScrollObserver} */
          this._autoplay
        );
        if (ap && ap.linked && ap.linked === this) ap.revert();
        return this.cancel();
      }
      /**
        * Imediatly completes the timer, cancels it and triggers the onComplete callback
        * @param  {Boolean|Number} [muteCallbacks]
        * @return {this}
        */
      complete(muteCallbacks = 0) {
        return this.seek(this.duration, muteCallbacks).cancel();
      }
      /**
       * @typedef {this & {then: null}} ResolvedTimer
       */
      /**
       * @param  {Callback<ResolvedTimer>} [callback]
       * @return Promise<this>
       */
      then(callback = noop) {
        const then = this.then;
        const onResolve = () => {
          this.then = null;
          callback(
            /** @type {ResolvedTimer} */
            this
          );
          this.then = then;
          this._resolve = noop;
        };
        return new Promise((r2) => {
          this._resolve = () => r2(onResolve());
          if (this.completed) this._resolve();
          return this;
        });
      }
    };
    angleUnitsMap = { "deg": 1, "rad": 180 / PI, "turn": 360 };
    convertedValuesCache = {};
    convertValueUnit = (el, decomposedValue, unit, force = false) => {
      const currentUnit = decomposedValue.u;
      const currentNumber = decomposedValue.n;
      if (decomposedValue.t === valueTypes.UNIT && currentUnit === unit) {
        return decomposedValue;
      }
      const cachedKey = currentNumber + currentUnit + unit;
      const cached = convertedValuesCache[cachedKey];
      if (!isUnd(cached) && !force) {
        decomposedValue.n = cached;
      } else {
        let convertedValue;
        if (currentUnit in angleUnitsMap) {
          convertedValue = currentNumber * angleUnitsMap[currentUnit] / angleUnitsMap[unit];
        } else {
          const baseline = 100;
          const tempEl = (
            /** @type {DOMTarget} */
            el.cloneNode()
          );
          const parentNode = el.parentNode;
          const parentEl = parentNode && parentNode !== doc ? parentNode : doc.body;
          parentEl.appendChild(tempEl);
          const elStyle = tempEl.style;
          elStyle.width = baseline + currentUnit;
          const currentUnitWidth = (
            /** @type {HTMLElement} */
            tempEl.offsetWidth || baseline
          );
          elStyle.width = baseline + unit;
          const newUnitWidth = (
            /** @type {HTMLElement} */
            tempEl.offsetWidth || baseline
          );
          const factor = currentUnitWidth / newUnitWidth;
          parentEl.removeChild(tempEl);
          convertedValue = factor * currentNumber;
        }
        decomposedValue.n = convertedValue;
        convertedValuesCache[cachedKey] = convertedValue;
      }
      decomposedValue.t === valueTypes.UNIT;
      decomposedValue.u = unit;
      return decomposedValue;
    };
    none = (t2) => t2;
    easeInPower = (p2 = 1.68) => (t2) => pow(t2, +p2);
    easeTypes = {
      in: (easeIn) => (t2) => easeIn(t2),
      out: (easeIn) => (t2) => 1 - easeIn(1 - t2),
      inOut: (easeIn) => (t2) => t2 < 0.5 ? easeIn(t2 * 2) / 2 : 1 - easeIn(t2 * -2 + 2) / 2,
      outIn: (easeIn) => (t2) => t2 < 0.5 ? (1 - easeIn(1 - t2 * 2)) / 2 : (easeIn(t2 * 2 - 1) + 1) / 2
    };
    halfPI = PI / 2;
    doublePI = PI * 2;
    easeInFunctions = {
      [emptyString]: easeInPower,
      Quad: easeInPower(2),
      Cubic: easeInPower(3),
      Quart: easeInPower(4),
      Quint: easeInPower(5),
      /** @type {EasingFunction} */
      Sine: (t2) => 1 - cos(t2 * halfPI),
      /** @type {EasingFunction} */
      Circ: (t2) => 1 - sqrt(1 - t2 * t2),
      /** @type {EasingFunction} */
      Expo: (t2) => t2 ? pow(2, 10 * t2 - 10) : 0,
      /** @type {EasingFunction} */
      Bounce: (t2) => {
        let pow2, b2 = 4;
        while (t2 < ((pow2 = pow(2, --b2)) - 1) / 11) ;
        return 1 / pow(4, 3 - b2) - 7.5625 * pow((pow2 * 3 - 2) / 22 - t2, 2);
      },
      /** @type {BackEasing} */
      Back: (overshoot = 1.7) => (t2) => (+overshoot + 1) * t2 * t2 * t2 - +overshoot * t2 * t2,
      /** @type {ElasticEasing} */
      Elastic: (amplitude = 1, period = 0.3) => {
        const a2 = clamp$1(+amplitude, 1, 10);
        const p2 = clamp$1(+period, minValue, 2);
        const s2 = p2 / doublePI * asin(1 / a2);
        const e4 = doublePI / p2;
        return (t2) => t2 === 0 || t2 === 1 ? t2 : -a2 * pow(2, -10 * (1 - t2)) * sin((1 - t2 - s2) * e4);
      }
    };
    eases = /* @__PURE__ */ (() => {
      const list = { linear: none, none };
      for (let type in easeTypes) {
        for (let name in easeInFunctions) {
          const easeIn = easeInFunctions[name];
          const easeType = easeTypes[type];
          list[type + name] = /** @type {EasingFunctionWithParams|EasingFunction} */
          name === emptyString || name === "Back" || name === "Elastic" ? (a2, b2) => easeType(
            /** @type {EasingFunctionWithParams} */
            easeIn(a2, b2)
          ) : easeType(
            /** @type {EasingFunction} */
            easeIn
          );
        }
      }
      return (
        /** @type {EasesFunctions} */
        list
      );
    })();
    easesLookups = { linear: none, none };
    parseEaseString = (string) => {
      if (easesLookups[string]) return easesLookups[string];
      if (string.indexOf("(") <= -1) {
        const hasParams = easeTypes[string] || string.includes("Back") || string.includes("Elastic");
        const parsedFn = (
          /** @type {EasingFunction} */
          hasParams ? (
            /** @type {EasingFunctionWithParams} */
            eases[string]()
          ) : eases[string]
        );
        return parsedFn ? easesLookups[string] = parsedFn : none;
      } else {
        const split = string.slice(0, -1).split("(");
        const parsedFn = (
          /** @type {EasingFunctionWithParams} */
          eases[split[0]]
        );
        return parsedFn ? easesLookups[string] = parsedFn(...split[1].split(",")) : none;
      }
    };
    deprecated = ["steps(", "irregular(", "linear(", "cubicBezier("];
    parseEase = (ease) => {
      if (isStr(ease)) {
        for (let i2 = 0, l2 = deprecated.length; i2 < l2; i2++) {
          if (stringStartsWith(ease, deprecated[i2])) {
            console.warn(`String syntax for \`ease: "${ease}"\` has been removed from the core and replaced by importing and passing the easing function directly: \`ease: ${ease}\``);
            return none;
          }
        }
      }
      const easeFunc = isFnc(ease) ? ease : isStr(ease) ? parseEaseString(
        /** @type {String} */
        ease
      ) : none;
      return easeFunc;
    };
    fromTargetObject = createDecomposedValueTargetObject();
    toTargetObject = createDecomposedValueTargetObject();
    inlineStylesStore = {};
    toFunctionStore = { func: null };
    fromFunctionStore = { func: null };
    keyframesTargetArray = [null];
    fastSetValuesArray = [null, null];
    keyObjectTarget = { to: null };
    tweenId = 0;
    JSAnimationId = 0;
    generateKeyframes = (keyframes2, parameters) => {
      const properties = {};
      if (isArr(keyframes2)) {
        const propertyNames = [].concat(.../** @type {DurationKeyframes} */
        keyframes2.map((key2) => Object.keys(key2))).filter(isKey);
        for (let i2 = 0, l2 = propertyNames.length; i2 < l2; i2++) {
          const propName = propertyNames[i2];
          const propArray = (
            /** @type {DurationKeyframes} */
            keyframes2.map((key2) => {
              const newKey = {};
              for (let p2 in key2) {
                const keyValue = (
                  /** @type {TweenPropValue} */
                  key2[p2]
                );
                if (isKey(p2)) {
                  if (p2 === propName) {
                    newKey.to = keyValue;
                  }
                } else {
                  newKey[p2] = keyValue;
                }
              }
              return newKey;
            })
          );
          properties[propName] = /** @type {ArraySyntaxValue} */
          propArray;
        }
      } else {
        const totalDuration = (
          /** @type {Number} */
          setValue(parameters.duration, globals.defaults.duration)
        );
        const keys = Object.keys(keyframes2).map((key2) => {
          return { o: parseFloat(key2) / 100, p: keyframes2[key2] };
        }).sort((a2, b2) => a2.o - b2.o);
        keys.forEach((key2) => {
          const offset = key2.o;
          const prop = key2.p;
          for (let name in prop) {
            if (isKey(name)) {
              let propArray = (
                /** @type {Array} */
                properties[name]
              );
              if (!propArray) propArray = properties[name] = [];
              const duration = offset * totalDuration;
              let length = propArray.length;
              let prevKey = propArray[length - 1];
              const keyObj = { to: prop[name] };
              let durProgress = 0;
              for (let i2 = 0; i2 < length; i2++) {
                durProgress += propArray[i2].duration;
              }
              if (length === 1) {
                keyObj.from = prevKey.to;
              }
              if (prop.ease) {
                keyObj.ease = prop.ease;
              }
              keyObj.duration = duration - (length ? durProgress : 0);
              propArray.push(keyObj);
            }
          }
          return key2;
        });
        for (let name in properties) {
          const propArray = (
            /** @type {Array} */
            properties[name]
          );
          let prevEase;
          for (let i2 = 0, l2 = propArray.length; i2 < l2; i2++) {
            const prop = propArray[i2];
            const currentEase = prop.ease;
            prop.ease = prevEase ? prevEase : void 0;
            prevEase = currentEase;
          }
          if (!propArray[0].duration) {
            propArray.shift();
          }
        }
      }
      return properties;
    };
    JSAnimation = class extends Timer {
      /**
       * @param {TargetsParam} targets
       * @param {AnimationParams} parameters
       * @param {Timeline} [parent]
       * @param {Number} [parentPosition]
       * @param {Boolean} [fastSet=false]
       * @param {Number} [index=0]
       * @param {Number} [length=0]
       */
      constructor(targets, parameters, parent, parentPosition, fastSet = false, index = 0, length = 0) {
        super(
          /** @type {TimerParams & AnimationParams} */
          parameters,
          parent,
          parentPosition
        );
        ++JSAnimationId;
        const parsedTargets = registerTargets(targets);
        const targetsLength = parsedTargets.length;
        const kfParams = (
          /** @type {AnimationParams} */
          parameters.keyframes
        );
        const params = (
          /** @type {AnimationParams} */
          kfParams ? mergeObjects(generateKeyframes(
            /** @type {DurationKeyframes} */
            kfParams,
            parameters
          ), parameters) : parameters
        );
        const {
          id,
          delay,
          duration,
          ease,
          playbackEase,
          modifier,
          composition,
          onRender
        } = params;
        const animDefaults = parent ? parent.defaults : globals.defaults;
        const animEase = setValue(ease, animDefaults.ease);
        const animPlaybackEase = setValue(playbackEase, animDefaults.playbackEase);
        const parsedAnimPlaybackEase = animPlaybackEase ? parseEase(animPlaybackEase) : null;
        const hasSpring = !isUnd(
          /** @type {Spring} */
          animEase.ease
        );
        const tEasing = hasSpring ? (
          /** @type {Spring} */
          animEase.ease
        ) : setValue(ease, parsedAnimPlaybackEase ? "linear" : animDefaults.ease);
        const tDuration = hasSpring ? (
          /** @type {Spring} */
          animEase.settlingDuration
        ) : setValue(duration, animDefaults.duration);
        const tDelay = setValue(delay, animDefaults.delay);
        const tModifier = modifier || animDefaults.modifier;
        const tComposition = isUnd(composition) && targetsLength >= K ? compositionTypes.none : !isUnd(composition) ? composition : animDefaults.composition;
        const absoluteOffsetTime = this._offset + (parent ? parent._offset : 0);
        if (hasSpring) animEase.parent = this;
        let iterationDuration = NaN;
        let iterationDelay = NaN;
        let animationAnimationLength = 0;
        let shouldTriggerRender = 0;
        for (let targetIndex = 0; targetIndex < targetsLength; targetIndex++) {
          const target = parsedTargets[targetIndex];
          const ti = index || targetIndex;
          const tl = length || targetsLength;
          let lastTransformGroupIndex = NaN;
          let lastTransformGroupLength = NaN;
          for (let p2 in params) {
            if (isKey(p2)) {
              const tweenType = getTweenType(target, p2);
              const propName = sanitizePropertyName(p2, target, tweenType);
              let propValue = params[p2];
              const isPropValueArray = isArr(propValue);
              if (fastSet && !isPropValueArray) {
                fastSetValuesArray[0] = propValue;
                fastSetValuesArray[1] = propValue;
                propValue = fastSetValuesArray;
              }
              if (isPropValueArray) {
                const arrayLength = (
                  /** @type {Array} */
                  propValue.length
                );
                const isNotObjectValue = !isObj(propValue[0]);
                if (arrayLength === 2 && isNotObjectValue) {
                  keyObjectTarget.to = /** @type {TweenParamValue} */
                  /** @type {unknown} */
                  propValue;
                  keyframesTargetArray[0] = keyObjectTarget;
                  keyframes = keyframesTargetArray;
                } else if (arrayLength > 2 && isNotObjectValue) {
                  keyframes = [];
                  propValue.forEach((v2, i2) => {
                    if (!i2) {
                      fastSetValuesArray[0] = v2;
                    } else if (i2 === 1) {
                      fastSetValuesArray[1] = v2;
                      keyframes.push(fastSetValuesArray);
                    } else {
                      keyframes.push(v2);
                    }
                  });
                } else {
                  keyframes = /** @type {Array.<TweenKeyValue>} */
                  propValue;
                }
              } else {
                keyframesTargetArray[0] = propValue;
                keyframes = keyframesTargetArray;
              }
              let siblings = null;
              let prevTween = null;
              let firstTweenChangeStartTime = NaN;
              let lastTweenChangeEndTime = 0;
              let tweenIndex = 0;
              for (let l2 = keyframes.length; tweenIndex < l2; tweenIndex++) {
                const keyframe = keyframes[tweenIndex];
                if (isObj(keyframe)) {
                  key = keyframe;
                } else {
                  keyObjectTarget.to = /** @type {TweenParamValue} */
                  keyframe;
                  key = keyObjectTarget;
                }
                toFunctionStore.func = null;
                fromFunctionStore.func = null;
                const computedToValue = getFunctionValue(key.to, target, ti, tl, toFunctionStore);
                let tweenToValue;
                if (isObj(computedToValue) && !isUnd(computedToValue.to)) {
                  key = computedToValue;
                  tweenToValue = computedToValue.to;
                } else {
                  tweenToValue = computedToValue;
                }
                const tweenFromValue = getFunctionValue(key.from, target, ti, tl);
                const easeToParse = key.ease || tEasing;
                const easeFunctionResult = getFunctionValue(easeToParse, target, ti, tl);
                const keyEasing = isFnc(easeFunctionResult) || isStr(easeFunctionResult) ? easeFunctionResult : easeToParse;
                const hasSpring2 = !isUnd(keyEasing) && !isUnd(
                  /** @type {Spring} */
                  keyEasing.ease
                );
                const tweenEasing = hasSpring2 ? (
                  /** @type {Spring} */
                  keyEasing.ease
                ) : keyEasing;
                const tweenDuration = hasSpring2 ? (
                  /** @type {Spring} */
                  keyEasing.settlingDuration
                ) : getFunctionValue(setValue(key.duration, l2 > 1 ? getFunctionValue(tDuration, target, ti, tl) / l2 : tDuration), target, ti, tl);
                const tweenDelay = getFunctionValue(setValue(key.delay, !tweenIndex ? tDelay : 0), target, ti, tl);
                const computedComposition = getFunctionValue(setValue(key.composition, tComposition), target, ti, tl);
                const tweenComposition = isNum(computedComposition) ? computedComposition : compositionTypes[computedComposition];
                const tweenModifier = key.modifier || tModifier;
                const hasFromvalue = !isUnd(tweenFromValue);
                const hasToValue = !isUnd(tweenToValue);
                const isFromToArray = isArr(tweenToValue);
                const isFromToValue = isFromToArray || hasFromvalue && hasToValue;
                const tweenStartTime = prevTween ? lastTweenChangeEndTime + tweenDelay : tweenDelay;
                const absoluteStartTime = round$1(absoluteOffsetTime + tweenStartTime, 12);
                if (!shouldTriggerRender && (hasFromvalue || isFromToArray)) shouldTriggerRender = 1;
                let prevSibling = prevTween;
                if (tweenComposition !== compositionTypes.none) {
                  if (!siblings) siblings = getTweenSiblings(target, propName);
                  let nextSibling = siblings._head;
                  while (nextSibling && !nextSibling._isOverridden && nextSibling._absoluteStartTime <= absoluteStartTime) {
                    prevSibling = nextSibling;
                    nextSibling = nextSibling._nextRep;
                    if (nextSibling && nextSibling._absoluteStartTime >= absoluteStartTime) {
                      while (nextSibling) {
                        overrideTween(nextSibling);
                        nextSibling = nextSibling._nextRep;
                      }
                    }
                  }
                }
                if (isFromToValue) {
                  decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[0], target, ti, tl, fromFunctionStore) : tweenFromValue, fromTargetObject);
                  decomposeRawValue(isFromToArray ? getFunctionValue(tweenToValue[1], target, ti, tl, toFunctionStore) : tweenToValue, toTargetObject);
                  const originalValue = getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore);
                  if (fromTargetObject.t === valueTypes.NUMBER) {
                    if (prevSibling) {
                      if (prevSibling._valueType === valueTypes.UNIT) {
                        fromTargetObject.t = valueTypes.UNIT;
                        fromTargetObject.u = prevSibling._unit;
                      }
                    } else {
                      decomposeRawValue(
                        originalValue,
                        decomposedOriginalValue
                      );
                      if (decomposedOriginalValue.t === valueTypes.UNIT) {
                        fromTargetObject.t = valueTypes.UNIT;
                        fromTargetObject.u = decomposedOriginalValue.u;
                      }
                    }
                  }
                } else {
                  if (hasToValue) {
                    decomposeRawValue(tweenToValue, toTargetObject);
                  } else {
                    if (prevTween) {
                      decomposeTweenValue(prevTween, toTargetObject);
                    } else {
                      decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore), toTargetObject);
                    }
                  }
                  if (hasFromvalue) {
                    decomposeRawValue(tweenFromValue, fromTargetObject);
                  } else {
                    if (prevTween) {
                      decomposeTweenValue(prevTween, fromTargetObject);
                    } else {
                      decomposeRawValue(parent && prevSibling && prevSibling.parent.parent === parent ? prevSibling._value : (
                        // No need to get and parse the original value if the tween is part of a timeline and has a previous sibling part of the same timeline
                        getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore)
                      ), fromTargetObject);
                    }
                  }
                }
                if (fromTargetObject.o) {
                  fromTargetObject.n = getRelativeValue(
                    !prevSibling ? decomposeRawValue(
                      getOriginalAnimatableValue(target, propName, tweenType, inlineStylesStore),
                      decomposedOriginalValue
                    ).n : prevSibling._toNumber,
                    fromTargetObject.n,
                    fromTargetObject.o
                  );
                }
                if (toTargetObject.o) {
                  toTargetObject.n = getRelativeValue(fromTargetObject.n, toTargetObject.n, toTargetObject.o);
                }
                if (fromTargetObject.t !== toTargetObject.t) {
                  if (fromTargetObject.t === valueTypes.COMPLEX || toTargetObject.t === valueTypes.COMPLEX) {
                    const complexValue = fromTargetObject.t === valueTypes.COMPLEX ? fromTargetObject : toTargetObject;
                    const notComplexValue = fromTargetObject.t === valueTypes.COMPLEX ? toTargetObject : fromTargetObject;
                    notComplexValue.t = valueTypes.COMPLEX;
                    notComplexValue.s = cloneArray(complexValue.s);
                    notComplexValue.d = complexValue.d.map(() => notComplexValue.n);
                  } else if (fromTargetObject.t === valueTypes.UNIT || toTargetObject.t === valueTypes.UNIT) {
                    const unitValue = fromTargetObject.t === valueTypes.UNIT ? fromTargetObject : toTargetObject;
                    const notUnitValue = fromTargetObject.t === valueTypes.UNIT ? toTargetObject : fromTargetObject;
                    notUnitValue.t = valueTypes.UNIT;
                    notUnitValue.u = unitValue.u;
                  } else if (fromTargetObject.t === valueTypes.COLOR || toTargetObject.t === valueTypes.COLOR) {
                    const colorValue = fromTargetObject.t === valueTypes.COLOR ? fromTargetObject : toTargetObject;
                    const notColorValue = fromTargetObject.t === valueTypes.COLOR ? toTargetObject : fromTargetObject;
                    notColorValue.t = valueTypes.COLOR;
                    notColorValue.s = colorValue.s;
                    notColorValue.d = [0, 0, 0, 1];
                  }
                }
                if (fromTargetObject.u !== toTargetObject.u) {
                  let valueToConvert = toTargetObject.u ? fromTargetObject : toTargetObject;
                  valueToConvert = convertValueUnit(
                    /** @type {DOMTarget} */
                    target,
                    valueToConvert,
                    toTargetObject.u ? toTargetObject.u : fromTargetObject.u,
                    false
                  );
                }
                if (toTargetObject.d && fromTargetObject.d && toTargetObject.d.length !== fromTargetObject.d.length) {
                  const longestValue = fromTargetObject.d.length > toTargetObject.d.length ? fromTargetObject : toTargetObject;
                  const shortestValue = longestValue === fromTargetObject ? toTargetObject : fromTargetObject;
                  shortestValue.d = longestValue.d.map((_2, i2) => isUnd(shortestValue.d[i2]) ? 0 : shortestValue.d[i2]);
                  shortestValue.s = cloneArray(longestValue.s);
                }
                const tweenUpdateDuration = round$1(+tweenDuration || minValue, 12);
                let inlineValue = inlineStylesStore[propName];
                if (!isNil(inlineValue)) inlineStylesStore[propName] = null;
                const tween = {
                  parent: this,
                  id: tweenId++,
                  property: propName,
                  target,
                  _value: null,
                  _toFunc: toFunctionStore.func,
                  _fromFunc: fromFunctionStore.func,
                  _ease: parseEase(tweenEasing),
                  _fromNumbers: cloneArray(fromTargetObject.d),
                  _toNumbers: cloneArray(toTargetObject.d),
                  _strings: cloneArray(toTargetObject.s),
                  _fromNumber: fromTargetObject.n,
                  _toNumber: toTargetObject.n,
                  _numbers: cloneArray(fromTargetObject.d),
                  // For additive tween and animatables
                  _number: fromTargetObject.n,
                  // For additive tween and animatables
                  _unit: toTargetObject.u,
                  _modifier: tweenModifier,
                  _currentTime: 0,
                  _startTime: tweenStartTime,
                  _delay: +tweenDelay,
                  _updateDuration: tweenUpdateDuration,
                  _changeDuration: tweenUpdateDuration,
                  _absoluteStartTime: absoluteStartTime,
                  // NOTE: Investigate bit packing to stores ENUM / BOOL
                  _tweenType: tweenType,
                  _valueType: toTargetObject.t,
                  _composition: tweenComposition,
                  _isOverlapped: 0,
                  _isOverridden: 0,
                  _renderTransforms: 0,
                  _inlineValue: inlineValue,
                  _prevRep: null,
                  // For replaced tween
                  _nextRep: null,
                  // For replaced tween
                  _prevAdd: null,
                  // For additive tween
                  _nextAdd: null,
                  // For additive tween
                  _prev: null,
                  _next: null
                };
                if (tweenComposition !== compositionTypes.none) {
                  composeTween(tween, siblings);
                }
                if (isNaN(firstTweenChangeStartTime)) {
                  firstTweenChangeStartTime = tween._startTime;
                }
                lastTweenChangeEndTime = round$1(tweenStartTime + tweenUpdateDuration, 12);
                prevTween = tween;
                animationAnimationLength++;
                addChild(this, tween);
              }
              if (isNaN(iterationDelay) || firstTweenChangeStartTime < iterationDelay) {
                iterationDelay = firstTweenChangeStartTime;
              }
              if (isNaN(iterationDuration) || lastTweenChangeEndTime > iterationDuration) {
                iterationDuration = lastTweenChangeEndTime;
              }
              if (tweenType === tweenTypes.TRANSFORM) {
                lastTransformGroupIndex = animationAnimationLength - tweenIndex;
                lastTransformGroupLength = animationAnimationLength;
              }
            }
          }
          if (!isNaN(lastTransformGroupIndex)) {
            let i2 = 0;
            forEachChildren(this, (tween) => {
              if (i2 >= lastTransformGroupIndex && i2 < lastTransformGroupLength) {
                tween._renderTransforms = 1;
                if (tween._composition === compositionTypes.blend) {
                  forEachChildren(additive.animation, (additiveTween) => {
                    if (additiveTween.id === tween.id) {
                      additiveTween._renderTransforms = 1;
                    }
                  });
                }
              }
              i2++;
            });
          }
        }
        if (!targetsLength) {
          console.warn(`No target found. Make sure the element you're trying to animate is accessible before creating your animation.`);
        }
        if (iterationDelay) {
          forEachChildren(this, (tween) => {
            if (!(tween._startTime - tween._delay)) {
              tween._delay -= iterationDelay;
            }
            tween._startTime -= iterationDelay;
          });
          iterationDuration -= iterationDelay;
        } else {
          iterationDelay = 0;
        }
        if (!iterationDuration) {
          iterationDuration = minValue;
          this.iterationCount = 0;
        }
        this.targets = parsedTargets;
        this.id = !isUnd(id) ? id : JSAnimationId;
        this.duration = iterationDuration === minValue ? minValue : clampInfinity((iterationDuration + this._loopDelay) * this.iterationCount - this._loopDelay) || minValue;
        this.onRender = onRender || animDefaults.onRender;
        this._ease = parsedAnimPlaybackEase;
        this._delay = iterationDelay;
        this.iterationDuration = iterationDuration;
        if (!this._autoplay && shouldTriggerRender) this.onRender(this);
      }
      /**
       * @param  {Number} newDuration
       * @return {this}
       */
      stretch(newDuration) {
        const currentDuration = this.duration;
        if (currentDuration === normalizeTime(newDuration)) return this;
        const timeScale = newDuration / currentDuration;
        forEachChildren(this, (tween) => {
          tween._updateDuration = normalizeTime(tween._updateDuration * timeScale);
          tween._changeDuration = normalizeTime(tween._changeDuration * timeScale);
          tween._currentTime *= timeScale;
          tween._startTime *= timeScale;
          tween._absoluteStartTime *= timeScale;
        });
        return super.stretch(newDuration);
      }
      /**
       * @return {this}
       */
      refresh() {
        forEachChildren(this, (tween) => {
          const toFunc = tween._toFunc;
          const fromFunc = tween._fromFunc;
          if (toFunc || fromFunc) {
            if (fromFunc) {
              decomposeRawValue(fromFunc(), fromTargetObject);
              if (fromTargetObject.u !== tween._unit && tween.target[isDomSymbol]) {
                convertValueUnit(
                  /** @type {DOMTarget} */
                  tween.target,
                  fromTargetObject,
                  tween._unit,
                  true
                );
              }
              tween._fromNumbers = cloneArray(fromTargetObject.d);
              tween._fromNumber = fromTargetObject.n;
            } else if (toFunc) {
              decomposeRawValue(getOriginalAnimatableValue(tween.target, tween.property, tween._tweenType), decomposedOriginalValue);
              tween._fromNumbers = cloneArray(decomposedOriginalValue.d);
              tween._fromNumber = decomposedOriginalValue.n;
            }
            if (toFunc) {
              decomposeRawValue(toFunc(), toTargetObject);
              tween._toNumbers = cloneArray(toTargetObject.d);
              tween._strings = cloneArray(toTargetObject.s);
              tween._toNumber = toTargetObject.o ? getRelativeValue(tween._fromNumber, toTargetObject.n, toTargetObject.o) : toTargetObject.n;
            }
          }
        });
        if (this.duration === minValue) this.restart();
        return this;
      }
      /**
       * Cancel the animation and revert all the values affected by this animation to their original state
       * @return {this}
       */
      revert() {
        super.revert();
        return cleanInlineStyles(this);
      }
      /**
       * @typedef {this & {then: null}} ResolvedJSAnimation
       */
      /**
       * @param  {Callback<ResolvedJSAnimation>} [callback]
       * @return Promise<this>
       */
      then(callback) {
        return super.then(callback);
      }
    };
    animate = (targets, parameters) => new JSAnimation(targets, parameters, null, 0, false).init();
    WAAPIAnimationsLookups = {
      _head: null,
      _tail: null
    };
    removeWAAPIAnimation = ($el, property, parent) => {
      let nextLookup = WAAPIAnimationsLookups._head;
      let anim;
      while (nextLookup) {
        const next = nextLookup._next;
        const matchTarget = nextLookup.$el === $el;
        const matchProperty = !property || nextLookup.property === property;
        const matchParent = !parent || nextLookup.parent === parent;
        if (matchTarget && matchProperty && matchParent) {
          anim = nextLookup.animation;
          try {
            anim.commitStyles();
          } catch {
          }
          anim.cancel();
          removeChild(WAAPIAnimationsLookups, nextLookup);
          const lookupParent = nextLookup.parent;
          if (lookupParent) {
            lookupParent._completed++;
            if (lookupParent.animations.length === lookupParent._completed) {
              lookupParent.completed = true;
              lookupParent.paused = true;
              if (!lookupParent.muteCallbacks) {
                lookupParent.onComplete(lookupParent);
                lookupParent._resolve(lookupParent);
              }
            }
          }
        }
        nextLookup = next;
      }
      return anim;
    };
    set = (targets, parameters) => {
      if (isUnd(parameters)) return;
      parameters.duration = minValue;
      parameters.composition = setValue(parameters.composition, compositionTypes.none);
      return new JSAnimation(targets, parameters, null, 0, true).resume();
    };
    remove = (targets, renderable, propertyName) => {
      const targetsArray = parseTargets(targets);
      for (let i2 = 0, l2 = targetsArray.length; i2 < l2; i2++) {
        removeWAAPIAnimation(
          /** @type {DOMTarget}  */
          targetsArray[i2],
          propertyName,
          renderable && /** @type {WAAPIAnimation} */
          renderable.controlAnimation && /** @type {WAAPIAnimation} */
          renderable
        );
      }
      removeTargetsFromRenderable(
        targetsArray,
        /** @type {Renderable} */
        renderable,
        propertyName
      );
      return targetsArray;
    };
    getPrevChildOffset = (timeline, timePosition) => {
      if (stringStartsWith(timePosition, "<")) {
        const goToPrevAnimationOffset = timePosition[1] === "<";
        const prevAnimation = (
          /** @type {Tickable} */
          timeline._tail
        );
        const prevOffset = prevAnimation ? prevAnimation._offset + prevAnimation._delay : 0;
        return goToPrevAnimationOffset ? prevOffset : prevOffset + prevAnimation.duration;
      }
    };
    parseTimelinePosition = (timeline, timePosition) => {
      let tlDuration = timeline.iterationDuration;
      if (tlDuration === minValue) tlDuration = 0;
      if (isUnd(timePosition)) return tlDuration;
      if (isNum(+timePosition)) return +timePosition;
      const timePosStr = (
        /** @type {String} */
        timePosition
      );
      const tlLabels = timeline ? timeline.labels : null;
      const hasLabels = !isNil(tlLabels);
      const prevOffset = getPrevChildOffset(timeline, timePosStr);
      const hasSibling = !isUnd(prevOffset);
      const matchedRelativeOperator = relativeValuesExecRgx.exec(timePosStr);
      if (matchedRelativeOperator) {
        const fullOperator = matchedRelativeOperator[0];
        const split = timePosStr.split(fullOperator);
        const labelOffset = hasLabels && split[0] ? tlLabels[split[0]] : tlDuration;
        const parsedOffset = hasSibling ? prevOffset : hasLabels ? labelOffset : tlDuration;
        const parsedNumericalOffset = +split[1];
        return getRelativeValue(parsedOffset, parsedNumericalOffset, fullOperator[0]);
      } else {
        return hasSibling ? prevOffset : hasLabels ? !isUnd(tlLabels[timePosStr]) ? tlLabels[timePosStr] : tlDuration : tlDuration;
      }
    };
    TLId = 0;
    Timeline = class extends Timer {
      /**
       * @param {TimelineParams} [parameters]
       */
      constructor(parameters = {}) {
        super(
          /** @type {TimerParams&TimelineParams} */
          parameters,
          null,
          0
        );
        ++TLId;
        this.id = !isUnd(parameters.id) ? parameters.id : TLId;
        this.duration = 0;
        this.labels = {};
        const defaultsParams = parameters.defaults;
        const globalDefaults = globals.defaults;
        this.defaults = defaultsParams ? mergeObjects(defaultsParams, globalDefaults) : globalDefaults;
        this.composition = setValue(parameters.composition, true);
        this.onRender = parameters.onRender || globalDefaults.onRender;
        const tlPlaybackEase = setValue(parameters.playbackEase, globalDefaults.playbackEase);
        this._ease = tlPlaybackEase ? parseEase(tlPlaybackEase) : null;
        this.iterationDuration = 0;
      }
      /**
       * @overload
       * @param {TargetsParam} a1
       * @param {AnimationParams} a2
       * @param {TimelinePosition|StaggerFunction<Number|String>} [a3]
       * @return {this}
       *
       * @overload
       * @param {TimerParams} a1
       * @param {TimelinePosition} [a2]
       * @return {this}
       *
       * @param {TargetsParam|TimerParams} a1
       * @param {TimelinePosition|AnimationParams} a2
       * @param {TimelinePosition|StaggerFunction<Number|String>} [a3]
       */
      add(a1, a2, a3) {
        const isAnim = isObj(a2);
        const isTimer = isObj(a1);
        if (isAnim || isTimer) {
          this._hasChildren = true;
          if (isAnim) {
            const childParams = (
              /** @type {AnimationParams} */
              a2
            );
            if (isFnc(a3)) {
              const staggeredPosition = a3;
              const parsedTargetsArray = parseTargets(
                /** @type {TargetsParam} */
                a1
              );
              const tlDuration = this.duration;
              const tlIterationDuration = this.iterationDuration;
              const id = childParams.id;
              let i2 = 0;
              const parsedLength = parsedTargetsArray.length;
              parsedTargetsArray.forEach((target) => {
                const staggeredChildParams = { ...childParams };
                this.duration = tlDuration;
                this.iterationDuration = tlIterationDuration;
                if (!isUnd(id)) staggeredChildParams.id = id + "-" + i2;
                addTlChild(
                  staggeredChildParams,
                  this,
                  parseTimelinePosition(this, staggeredPosition(target, i2, parsedLength, this)),
                  target,
                  i2,
                  parsedLength
                );
                i2++;
              });
            } else {
              addTlChild(
                childParams,
                this,
                parseTimelinePosition(this, a3),
                /** @type {TargetsParam} */
                a1
              );
            }
          } else {
            addTlChild(
              /** @type TimerParams */
              a1,
              this,
              parseTimelinePosition(this, a2)
            );
          }
          if (this.composition) this.init(true);
          return this;
        }
      }
      /**
       * @overload
       * @param {Tickable} [synced]
       * @param {TimelinePosition} [position]
       * @return {this}
       *
       * @overload
       * @param {globalThis.Animation} [synced]
       * @param {TimelinePosition} [position]
       * @return {this}
       *
       * @overload
       * @param {WAAPIAnimation} [synced]
       * @param {TimelinePosition} [position]
       * @return {this}
       *
       * @param {Tickable|WAAPIAnimation|globalThis.Animation} [synced]
       * @param {TimelinePosition} [position]
       */
      sync(synced, position) {
        if (isUnd(synced) || synced && isUnd(synced.pause)) return this;
        synced.pause();
        const duration = +/** @type {globalThis.Animation} */
        (synced.effect ? (
          /** @type {globalThis.Animation} */
          synced.effect.getTiming().duration
        ) : (
          /** @type {Tickable} */
          synced.duration
        ));
        if (!isUnd(synced) && !isUnd(
          /** @type {WAAPIAnimation} */
          synced.persist
        )) {
          synced.persist = true;
        }
        return this.add(synced, { currentTime: [0, duration], duration, delay: 0, ease: "linear", playbackEase: "linear" }, position);
      }
      /**
       * @param  {TargetsParam} targets
       * @param  {AnimationParams} parameters
       * @param  {TimelinePosition} [position]
       * @return {this}
       */
      set(targets, parameters, position) {
        if (isUnd(parameters)) return this;
        parameters.duration = minValue;
        parameters.composition = compositionTypes.replace;
        return this.add(targets, parameters, position);
      }
      /**
       * @param {Callback<Timer>} callback
       * @param {TimelinePosition} [position]
       * @return {this}
       */
      call(callback, position) {
        if (isUnd(callback) || callback && !isFnc(callback)) return this;
        return this.add({ duration: 0, delay: 0, onComplete: () => callback(this) }, position);
      }
      /**
       * @param {String} labelName
       * @param {TimelinePosition} [position]
       * @return {this}
       *
       */
      label(labelName, position) {
        if (isUnd(labelName) || labelName && !isStr(labelName)) return this;
        this.labels[labelName] = parseTimelinePosition(this, position);
        return this;
      }
      /**
       * @param  {TargetsParam} targets
       * @param  {String} [propertyName]
       * @return {this}
       */
      remove(targets, propertyName) {
        removeTargetsFromRenderable(parseTargets(targets), this, propertyName);
        return this;
      }
      /**
       * @param  {Number} newDuration
       * @return {this}
       */
      stretch(newDuration) {
        const currentDuration = this.duration;
        if (currentDuration === normalizeTime(newDuration)) return this;
        const timeScale = newDuration / currentDuration;
        const labels = this.labels;
        forEachChildren(this, (child) => child.stretch(child.duration * timeScale));
        for (let labelName in labels) labels[labelName] *= timeScale;
        return super.stretch(newDuration);
      }
      /**
       * @return {this}
       */
      refresh() {
        forEachChildren(this, (child) => {
          if (
            /** @type {JSAnimation} */
            child.refresh
          ) child.refresh();
        });
        return this;
      }
      /**
       * @return {this}
       */
      revert() {
        super.revert();
        forEachChildren(this, (child) => child.revert, true);
        return cleanInlineStyles(this);
      }
      /**
       * @typedef {this & {then: null}} ResolvedTimeline
       */
      /**
       * @param  {Callback<ResolvedTimeline>} [callback]
       * @return Promise<this>
       */
      then(callback) {
        return super.then(callback);
      }
    };
    createTimeline = (parameters) => new Timeline(parameters).init();
    roundPad$1 = (v2, decimalLength) => (+v2).toFixed(decimalLength);
    padStart$1 = (v2, totalLength, padString) => `${v2}`.padStart(totalLength, padString);
    padEnd$1 = (v2, totalLength, padString) => `${v2}`.padEnd(totalLength, padString);
    wrap$1 = (v2, min, max2) => ((v2 - min) % (max2 - min) + (max2 - min)) % (max2 - min) + min;
    mapRange$1 = (value, inLow, inHigh, outLow, outHigh) => outLow + (value - inLow) / (inHigh - inLow) * (outHigh - outLow);
    degToRad$1 = (degrees) => degrees * Math.PI / 180;
    radToDeg$1 = (radians) => radians * 180 / Math.PI;
    damp$1 = (start, end, deltaTime, factor) => {
      return !factor ? start : factor === 1 ? end : lerp$1(start, end, 1 - Math.exp(-factor * deltaTime * 0.1));
    };
    numberImports = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      clamp: clamp$1,
      damp: damp$1,
      degToRad: degToRad$1,
      lerp: lerp$1,
      mapRange: mapRange$1,
      padEnd: padEnd$1,
      padStart: padStart$1,
      radToDeg: radToDeg$1,
      round: round$1,
      roundPad: roundPad$1,
      snap: snap$1,
      wrap: wrap$1
    });
    maxSpringParamValue = K * 10;
    sync = (callback = noop) => {
      return new Timer({ duration: 1 * globals.timeScale, onComplete: callback }, null, 0).resume();
    };
    keepTime = (constructor) => {
      let tracked;
      return (...args) => {
        let currentIteration, currentIterationProgress, reversed, alternate;
        if (tracked) {
          currentIteration = tracked.currentIteration;
          currentIterationProgress = tracked.iterationProgress;
          reversed = tracked.reversed;
          alternate = tracked._alternate;
          tracked.revert();
        }
        const cleanup = constructor(...args);
        if (cleanup && !isFnc(cleanup) && cleanup.revert) tracked = cleanup;
        if (!isUnd(currentIterationProgress)) {
          tracked.currentIteration = currentIteration;
          tracked.iterationProgress = (alternate ? !(currentIteration % 2) ? reversed : !reversed : reversed) ? 1 - currentIterationProgress : currentIterationProgress;
        }
        return cleanup || noop;
      };
    };
    transformsShorthands = ["x", "y", "z"];
    commonDefaultPXProperties = [
      "perspective",
      "width",
      "height",
      "margin",
      "padding",
      "top",
      "right",
      "bottom",
      "left",
      "borderWidth",
      "fontSize",
      "borderRadius",
      ...transformsShorthands
    ];
    numberUtils = numberImports;
    chainables = {};
    curry = (fn, last = 0) => (...args) => last ? (v2) => fn(...args, v2) : (v2) => fn(v2, ...args);
    chain = (fn) => {
      return (...args) => {
        const result = fn(...args);
        return new Proxy(noop, {
          apply: (_2, __, [v2]) => result(v2),
          get: (_2, prop) => chain(
            /**@param {...Number|String} nextArgs */
            (...nextArgs) => {
              const nextResult = chainables[prop](...nextArgs);
              return (v2) => nextResult(result(v2));
            }
          )
        });
      };
    };
    makeChainable = (name, fn, right = 0) => {
      const chained = (...args) => (args.length < fn.length ? chain(curry(fn, right)) : fn)(...args);
      if (!chainables[name]) chainables[name] = chained;
      return chained;
    };
    roundPad = /** @type {typeof numberUtils.roundPad & ChainedRoundPad} */
    makeChainable("roundPad", numberUtils.roundPad);
    padStart = /** @type {typeof numberUtils.padStart & ChainedPadStart} */
    makeChainable("padStart", numberUtils.padStart);
    padEnd = /** @type {typeof numberUtils.padEnd & ChainedPadEnd} */
    makeChainable("padEnd", numberUtils.padEnd);
    wrap = /** @type {typeof numberUtils.wrap & ChainedWrap} */
    makeChainable("wrap", numberUtils.wrap);
    mapRange = /** @type {typeof numberUtils.mapRange & ChainedMapRange} */
    makeChainable("mapRange", numberUtils.mapRange);
    degToRad = /** @type {typeof numberUtils.degToRad & ChainedDegToRad} */
    makeChainable("degToRad", numberUtils.degToRad);
    radToDeg = /** @type {typeof numberUtils.radToDeg & ChainedRadToDeg} */
    makeChainable("radToDeg", numberUtils.radToDeg);
    snap = /** @type {typeof numberUtils.snap & ChainedSnap} */
    makeChainable("snap", numberUtils.snap);
    clamp = /** @type {typeof numberUtils.clamp & ChainedClamp} */
    makeChainable("clamp", numberUtils.clamp);
    round = /** @type {typeof numberUtils.round & ChainedRound} */
    makeChainable("round", numberUtils.round);
    lerp = /** @type {typeof numberUtils.lerp & ChainedLerp} */
    makeChainable("lerp", numberUtils.lerp, 1);
    damp = /** @type {typeof numberUtils.damp & ChainedDamp} */
    makeChainable("damp", numberUtils.damp, 1);
    random = (min = 0, max2 = 1, decimalLength = 0) => {
      const m2 = 10 ** decimalLength;
      return Math.floor((Math.random() * (max2 - min + 1 / m2) + min) * m2) / m2;
    };
    _seed = 0;
    createSeededRandom = (seed, seededMin = 0, seededMax = 1, seededDecimalLength = 0) => {
      let t2 = seed === void 0 ? _seed++ : seed;
      return (min = seededMin, max2 = seededMax, decimalLength = seededDecimalLength) => {
        t2 += 1831565813;
        t2 = Math.imul(t2 ^ t2 >>> 15, t2 | 1);
        t2 ^= t2 + Math.imul(t2 ^ t2 >>> 7, t2 | 61);
        const m2 = 10 ** decimalLength;
        return Math.floor((((t2 ^ t2 >>> 14) >>> 0) / 4294967296 * (max2 - min + 1 / m2) + min) * m2) / m2;
      };
    };
    randomPick = (items) => items[random(0, items.length - 1)];
    shuffle = (items) => {
      let m2 = items.length, t2, i2;
      while (m2) {
        i2 = random(0, --m2);
        t2 = items[m2];
        items[m2] = items[i2];
        items[i2] = t2;
      }
      return items;
    };
    stagger = (val, params = {}) => {
      let values = [];
      let maxValue2 = 0;
      const from = params.from;
      const reversed = params.reversed;
      const ease = params.ease;
      const hasEasing = !isUnd(ease);
      const hasSpring = hasEasing && !isUnd(
        /** @type {Spring} */
        ease.ease
      );
      const staggerEase = hasSpring ? (
        /** @type {Spring} */
        ease.ease
      ) : hasEasing ? parseEase(ease) : null;
      const grid2 = params.grid;
      const axis = params.axis;
      const customTotal = params.total;
      const fromFirst = isUnd(from) || from === 0 || from === "first";
      const fromCenter = from === "center";
      const fromLast = from === "last";
      const fromRandom = from === "random";
      const isRange = isArr(val);
      const useProp = params.use;
      const val1 = isRange ? parseNumber(val[0]) : parseNumber(val);
      const val2 = isRange ? parseNumber(val[1]) : 0;
      const unitMatch = unitsExecRgx.exec((isRange ? val[1] : val) + emptyString);
      const start = params.start || 0 + (isRange ? val1 : 0);
      let fromIndex = fromFirst ? 0 : isNum(from) ? from : 0;
      return (target, i2, t2, tl) => {
        const [registeredTarget] = registerTargets(target);
        const total = isUnd(customTotal) ? t2 : customTotal;
        const customIndex = !isUnd(useProp) ? isFnc(useProp) ? useProp(registeredTarget, i2, total) : getOriginalAnimatableValue(registeredTarget, useProp) : false;
        const staggerIndex = isNum(customIndex) || isStr(customIndex) && isNum(+customIndex) ? +customIndex : i2;
        if (fromCenter) fromIndex = (total - 1) / 2;
        if (fromLast) fromIndex = total - 1;
        if (!values.length) {
          for (let index = 0; index < total; index++) {
            if (!grid2) {
              values.push(abs(fromIndex - index));
            } else {
              const fromX = !fromCenter ? fromIndex % grid2[0] : (grid2[0] - 1) / 2;
              const fromY = !fromCenter ? floor(fromIndex / grid2[0]) : (grid2[1] - 1) / 2;
              const toX = index % grid2[0];
              const toY = floor(index / grid2[0]);
              const distanceX = fromX - toX;
              const distanceY = fromY - toY;
              let value = sqrt(distanceX * distanceX + distanceY * distanceY);
              if (axis === "x") value = -distanceX;
              if (axis === "y") value = -distanceY;
              values.push(value);
            }
            maxValue2 = max(...values);
          }
          if (staggerEase) values = values.map((val3) => staggerEase(val3 / maxValue2) * maxValue2);
          if (reversed) values = values.map((val3) => axis ? val3 < 0 ? val3 * -1 : -val3 : abs(maxValue2 - val3));
          if (fromRandom) values = shuffle(values);
        }
        const spacing = isRange ? (val2 - val1) / maxValue2 : val1;
        const offset = tl ? parseTimelinePosition(tl, isUnd(params.start) ? tl.iterationDuration : start) : (
          /** @type {Number} */
          start
        );
        let output = offset + (spacing * round$1(values[staggerIndex], 2) || 0);
        if (params.modifier) output = params.modifier(output);
        if (unitMatch) output = `${output}${unitMatch[2]}`;
        return output;
      };
    };
    index$2 = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      $: registerTargets,
      clamp,
      cleanInlineStyles,
      createSeededRandom,
      damp,
      degToRad,
      get,
      keepTime,
      lerp,
      mapRange,
      padEnd,
      padStart,
      radToDeg,
      random,
      randomPick,
      remove,
      round,
      roundPad,
      set,
      shuffle,
      snap,
      stagger,
      sync,
      wrap
    });
    segmenter = typeof Intl !== "undefined" && Intl.Segmenter;
  }
});

// ../../design-system/regent_ui/assets/js/svg_mount.ts
function parseSvgMarkup(markup, doc2 = document) {
  const Parser = doc2.defaultView?.DOMParser ?? DOMParser;
  const parsed = new Parser().parseFromString(markup, "image/svg+xml");
  const svg = parsed.documentElement;
  if (parsed.querySelector("parsererror") || svg.tagName.toLowerCase() !== "svg") {
    throw new Error("Expected generated SVG markup.");
  }
  return doc2.importNode(svg, true);
}
function mountSvgMarkup(container, markup) {
  const doc2 = container.ownerDocument ?? document;
  const svg = parseSvgMarkup(markup, doc2);
  container.replaceChildren(svg);
  return svg;
}
var init_svg_mount = __esm({
  "../../design-system/regent_ui/assets/js/svg_mount.ts"() {
  }
});

// ../../design-system/regent_ui/assets/js/collateral/runtime/engine.ts
function cssVar(style, name, fallback) {
  const value = style.getPropertyValue(name).trim();
  return value === "" ? fallback : value;
}
function paletteFrom(el) {
  const style = window.getComputedStyle(el);
  return {
    ink: cssVar(style, "--brand-ink", FALLBACK.ink),
    charcoal: cssVar(style, "--brand-charcoal", FALLBACK.charcoal),
    gold: cssVar(style, "--brand-gold", FALLBACK.gold),
    paper: cssVar(style, "--brand-paper", FALLBACK.paper),
    olive: cssVar(style, "--brand-olive", FALLBACK.olive),
    positive: cssVar(style, "--positive", FALLBACK.positive)
  };
}
function createEngine(Heerich, options = {}) {
  return new Heerich({
    tile: options.tile ?? 14,
    camera: options.camera ?? { type: "oblique", angle: 225, distance: 0.5 },
    style: options.style
  });
}
function shade(hex, amount) {
  const parsed = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!parsed) return hex;
  const num = parseInt(parsed[1], 16);
  const channels = [num >> 16, num >> 8 & 255, num & 255].map((channel) => {
    const target = amount >= 0 ? 255 : 0;
    const mixed = channel + (target - channel) * Math.abs(amount);
    return Math.max(0, Math.min(255, Math.round(mixed)));
  });
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}
function voxelTone(color) {
  return {
    top: { fill: shade(color, 0.18) },
    left: { fill: color },
    right: { fill: shade(color, -0.16) },
    front: { fill: shade(color, -0.16) },
    default: { fill: color }
  };
}
var FALLBACK;
var init_engine = __esm({
  "../../design-system/regent_ui/assets/js/collateral/runtime/engine.ts"() {
    FALLBACK = {
      ink: "#034568",
      charcoal: "#315569",
      gold: "#d4a756",
      paper: "#fbf4de",
      olive: "#848078",
      positive: "#2f7d4f"
    };
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/chamber_drift.ts
var chamber_drift_exports = {};
__export(chamber_drift_exports, {
  meta: () => meta,
  mount: () => mount
});
function depthMix(z, near, far) {
  const t2 = Math.min(1, Math.max(0, z / DEPTH));
  return t2 < 0.45 ? near : t2 < 0.8 ? shade(near, -0.28) : far;
}
function mount(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: 8.4 },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 }
  });
  const startX = -Math.floor(WIDTH / 2);
  const wallStyle = (axisGlow) => ({
    default: (_x, _y, z) => ({
      fill: depthMix(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix(z, shade(palette.gold, -0.2), shade(palette.ink, -0.2)),
      strokeWidth: 0.4
    }),
    [axisGlow]: (_x, _y, z) => ({
      fill: depthMix(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix(z, palette.gold, shade(palette.gold, -0.45)),
      strokeWidth: 0.7
    })
  });
  engine2.addGeometry({
    type: "box",
    position: [startX, 0, 0],
    size: [WIDTH, 1, DEPTH],
    style: {
      default: (_x, _y, z) => ({
        fill: depthMix(z, shade(palette.ink, -0.12), shade(palette.ink, -0.5)),
        stroke: depthMix(z, shade(palette.gold, -0.25), shade(palette.ink, -0.3)),
        strokeWidth: 0.4
      })
    }
  });
  engine2.addGeometry({ type: "box", position: [startX, 1, 0], size: [1, HEIGHT, DEPTH], style: wallStyle("right") });
  engine2.addGeometry({
    type: "box",
    position: [startX + WIDTH - 1, 1, 0],
    size: [1, HEIGHT, DEPTH],
    style: wallStyle("left")
  });
  engine2.addGeometry({
    type: "box",
    position: [startX, HEIGHT + 1, 0],
    size: [WIDTH, 1, DEPTH],
    style: {
      default: (_x, _y, z) => ({
        fill: depthMix(z, shade(palette.charcoal, 0.06), shade(palette.ink, -0.45)),
        stroke: depthMix(z, shade(palette.gold, -0.05), shade(palette.ink, -0.25)),
        strokeWidth: 0.5
      }),
      top: (_x, _y, z) => ({
        fill: depthMix(z, shade(palette.charcoal, 0.12), shade(palette.ink, -0.4)),
        stroke: depthMix(z, palette.gold, shade(palette.gold, -0.5)),
        strokeWidth: 0.66
      })
    }
  });
  el.classList.add("rg-collateral-host");
  const frame = document.createElement("div");
  frame.className = "rg-collateral-drift-frame";
  el.replaceChildren(frame);
  mountSvgMarkup(frame, engine2.toSVG({ padding: 18 }));
  const animations = [];
  if (!reducedMotion) {
    animations.push(
      animate(frame, {
        translateY: [-4, 4],
        scale: [1.015, 1.045],
        duration: 9e3,
        alternate: true,
        loop: true,
        ease: "inOutSine"
      })
    );
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations.length = 0;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    }
  };
}
var meta, WIDTH, HEIGHT, DEPTH;
var init_chamber_drift = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/chamber_drift.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta = {
      id: "chamber-drift",
      name: "Chamber Drift",
      class: "ambient",
      tags: ["background", "hero", "depth"],
      productUse: "Page hero backdrop with slow parallax depth, like the entrance hall of the product.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    };
    WIDTH = 11;
    HEIGHT = 6;
    DEPTH = 20;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/runtime/svg_anim.ts
function facesByMeta(root, key2, value) {
  const attr = `data-${key2.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const selector = value === void 0 ? `[${attr}]` : `[${attr}="${value}"]`;
  return Array.from(root.querySelectorAll(selector));
}
function staggerFaceReveal(faces, options = {}) {
  if (faces.length === 0) return null;
  const ordered = options.from === "random" ? shuffled(faces) : faces;
  const from = options.from === "random" || options.from === void 0 ? void 0 : options.from;
  return animate(ordered, {
    opacity: [0, 1],
    duration: options.duration ?? 420,
    delay: stagger(options.delayStep ?? 14, from ? { from } : void 0),
    ease: "outQuad"
  });
}
function shuffled(items) {
  const copy = items.slice();
  for (let i2 = copy.length - 1; i2 > 0; i2 -= 1) {
    const j = Math.floor(Math.random() * (i2 + 1));
    [copy[i2], copy[j]] = [copy[j], copy[i2]];
  }
  return copy;
}
var init_svg_anim = __esm({
  "../../design-system/regent_ui/assets/js/collateral/runtime/svg_anim.ts"() {
    init_anime_esm();
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/lattice_weave.ts
var lattice_weave_exports = {};
__export(lattice_weave_exports, {
  meta: () => meta2,
  mount: () => mount2
});
function mod(value, n2) {
  return (value % n2 + n2) % n2;
}
function mount2(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 14 }
  });
  const inkDeep = shade(palette.ink, -0.25);
  const topStyle = (x2, _y, z) => {
    const goldThread = mod(x2 - z, 8) === 0;
    return {
      fill: mod(x2 + z, 4) === 0 ? palette.ink : inkDeep,
      stroke: goldThread ? palette.gold : shade(palette.ink, -0.45),
      strokeWidth: goldThread ? 0.6 : 0.4
    };
  };
  for (let thread = 0; thread < THREADS; thread += 1) {
    engine2.addGeometry({
      type: "fill",
      // Heerich fill bounds are upper-exclusive; y must span 0..1 for one flat layer.
      bounds: [
        [-HALF, 0, -HALF],
        [HALF, 1, HALF]
      ],
      test: (x2, _y, z) => mod(x2 + z, 2) === 0 && mod(z, THREADS) === thread,
      meta: { thread },
      style: {
        top: topStyle,
        default: (x2, _y, z) => ({
          fill: shade(palette.ink, -0.5),
          stroke: mod(x2 - z, 8) === 0 ? shade(palette.gold, -0.3) : shade(palette.ink, -0.55),
          strokeWidth: 0.4
        })
      }
    });
  }
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 18 }));
  const animations = [];
  if (!reducedMotion) {
    for (let thread = 0; thread < THREADS; thread += 1) {
      const faces = facesByMeta(el, "thread", String(thread));
      if (faces.length === 0) continue;
      animations.push(
        animate(faces, {
          opacity: [1, 0.45],
          duration: 3200,
          delay: stagger(4, { start: thread * 760 }),
          loop: true,
          alternate: true,
          ease: "inOutSine"
        })
      );
    }
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations.length = 0;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    }
  };
}
var meta2, HALF, THREADS;
var init_lattice_weave = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/lattice_weave.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta2 = {
      id: "lattice-weave",
      name: "Lattice Weave",
      class: "ambient",
      tags: ["background", "section", "ripple"],
      productUse: "Section background; a flat voxel lattice that ripples gently to signal a live surface.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    };
    HALF = 8;
    THREADS = 4;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/haze_columns.ts
var haze_columns_exports = {};
__export(haze_columns_exports, {
  meta: () => meta3,
  mount: () => mount3
});
function mount3(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: 10 },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.2), strokeWidth: 0.5 }
  });
  const depthMix2 = (z, near, far) => {
    const t2 = Math.min(1, Math.max(0, z / DEPTH2));
    return t2 < 0.5 ? near : far;
  };
  engine2.addGeometry({
    type: "box",
    position: [-Math.floor(PLINTH_WIDTH / 2), COLUMN_HEIGHT + 1, 0],
    size: [PLINTH_WIDTH, 1, DEPTH2],
    style: {
      default: (_x, _y, z) => ({
        fill: depthMix2(z, shade(palette.ink, -0.18), shade(palette.ink, -0.45)),
        stroke: depthMix2(z, shade(palette.gold, -0.3), shade(palette.ink, -0.25)),
        strokeWidth: 0.4
      }),
      top: (_x, _y, z) => ({
        fill: depthMix2(z, shade(palette.charcoal, 0.05), shade(palette.ink, -0.35)),
        stroke: depthMix2(z, shade(palette.gold, -0.1), shade(palette.gold, -0.5)),
        strokeWidth: 0.55
      })
    }
  });
  for (const x2 of COLUMN_XS) {
    engine2.addGeometry({
      type: "box",
      position: [x2, 1, 2],
      size: [1, COLUMN_HEIGHT, 1],
      style: {
        default: (_x, y2, _z) => ({
          fill: shade(palette.charcoal, -0.05 * (COLUMN_HEIGHT - y2)),
          stroke: shade(palette.gold, -0.35),
          strokeWidth: 0.45
        }),
        top: {
          fill: shade(palette.gold, 0.08),
          stroke: shade(palette.gold, -0.25),
          strokeWidth: 0.6
        }
      }
    });
  }
  el.classList.add("rg-collateral-host");
  const frame = document.createElement("div");
  frame.className = "rg-collateral-drift-frame";
  frame.style.position = "relative";
  const svgHolder = document.createElement("div");
  svgHolder.style.width = "100%";
  svgHolder.style.height = "100%";
  frame.append(svgHolder);
  el.replaceChildren(frame);
  mountSvgMarkup(svgHolder, engine2.toSVG({ padding: 20 }));
  const beams = [];
  const beamLefts = [18, 44, 68];
  beamLefts.forEach((left, index) => {
    const beam = document.createElement("div");
    beam.className = "rg-collateral-beam";
    beam.style.inset = "auto";
    beam.style.left = `${left}%`;
    beam.style.top = "0";
    beam.style.width = "16%";
    beam.style.height = "100%";
    beam.style.background = `linear-gradient(180deg, ${palette.gold}, transparent 72%)`;
    beam.style.filter = "blur(14px)";
    beam.style.opacity = reducedMotion ? "0.22" : String(0.12 + index * 0.04);
    frame.append(beam);
    beams.push(beam);
  });
  const animations = [];
  if (!reducedMotion) {
    beams.forEach((beam, index) => {
      animations.push(
        animate(beam, {
          translateX: [-10, 12],
          opacity: [0.1, 0.3],
          duration: 7200 + index * 1500,
          alternate: true,
          loop: true,
          ease: "inOutSine"
        })
      );
    });
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations.length = 0;
      beams.length = 0;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    }
  };
}
var meta3, PLINTH_WIDTH, COLUMN_HEIGHT, DEPTH2, COLUMN_XS;
var init_haze_columns = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/haze_columns.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta3 = {
      id: "haze-columns",
      name: "Haze Columns",
      class: "ambient",
      tags: ["background", "ceremonial", "glow"],
      productUse: "Backdrop for sign-in and ceremonial pages; a colonnade with drifting light beams.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    };
    PLINTH_WIDTH = 17;
    COLUMN_HEIGHT = 6;
    DEPTH2 = 6;
    COLUMN_XS = [-6, -3, 0, 3, 6];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/ink_tide.ts
var ink_tide_exports = {};
__export(ink_tide_exports, {
  meta: () => meta4,
  mount: () => mount4
});
function mount4(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 14 }
  });
  let phase = 0;
  const surfaceAt = (x2, z) => {
    const swell = 2 + 1.5 * Math.sin(x2 * 0.42 + z * 0.55 + phase) * Math.cos(z * 0.3 - phase * 0.6);
    return Math.min(4, Math.max(0, Math.round(swell)));
  };
  const tideStyle = {
    top: (x2, y2, z) => {
      const crest = y2 === surfaceAt(x2, z);
      return crest ? { fill: palette.paper, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 } : { fill: shade(palette.ink, 0.08), stroke: shade(palette.ink, -0.3), strokeWidth: 0.4 };
    },
    default: (x2, y2, z) => {
      const depth = Math.max(0, y2 - surfaceAt(x2, z));
      return {
        fill: shade(palette.ink, -0.12 * depth - 0.08),
        stroke: shade(palette.ink, -0.4),
        strokeWidth: 0.4
      };
    }
  };
  const renderTide = () => engine2.renderTest({
    bounds: BOUNDS,
    test: (x2, y2, z) => y2 >= surfaceAt(x2, z),
    style: tideStyle
  });
  el.classList.add("rg-collateral-host");
  const frame = document.createElement("div");
  frame.className = "rg-collateral-drift-frame";
  el.replaceChildren(frame);
  const envelopeFaces = engine2.renderTest({
    bounds: BOUNDS,
    test: () => true,
    style: tideStyle
  });
  const envelope = engine2.getBounds(16, envelopeFaces);
  const viewBox = [envelope.x, envelope.y, envelope.w, envelope.h];
  const renderFrame = () => {
    const faces = renderTide();
    mountSvgMarkup(frame, engine2.toSVG({ faces, viewBox }));
  };
  renderFrame();
  let rafId = null;
  let lastTick = 0;
  const tick2 = (now2) => {
    if (now2 - lastTick >= FRAME_MS) {
      lastTick = now2;
      phase += PHASE_STEP;
      renderFrame();
    }
    rafId = requestAnimationFrame(tick2);
  };
  const startLoop = () => {
    if (reducedMotion || rafId !== null) return;
    lastTick = 0;
    rafId = requestAnimationFrame(tick2);
  };
  const stopLoop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  startLoop();
  return {
    cleanup() {
      stopLoop();
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      stopLoop();
    },
    resume() {
      startLoop();
    }
  };
}
var meta4, BOUNDS, FRAME_MS, PHASE_STEP;
var init_ink_tide = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/ink_tide.ts"() {
    init_svg_mount();
    init_engine();
    meta4 = {
      id: "ink-tide",
      name: "Ink Tide",
      class: "ambient",
      tags: ["footer", "wave", "procedural"],
      productUse: "Footer ambient strip; a low voxel tide that slowly swells and recedes.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "raf" }
    };
    BOUNDS = [
      [-14, 0, -3],
      [14, 4, 3]
    ];
    FRAME_MS = 100;
    PHASE_STEP = 0.14;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/starfield_depth.ts
var starfield_depth_exports = {};
__export(starfield_depth_exports, {
  meta: () => meta5,
  mount: () => mount5
});
function starSpot(index) {
  const layer = index % 3;
  const x2 = (index * 53 + layer * 7) % 21 - 10;
  const y2 = -((index * 31 + layer * 5) % 13 - 6);
  const z = layer * 6;
  return { x: x2, y: y2, z, layer };
}
function mount5(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 9,
    camera: { type: "oblique", angle: 315, distance: 10 }
  });
  const layerColor = [palette.gold, palette.paper, shade(palette.olive, 0.1)];
  for (let i2 = 0; i2 < STAR_COUNT; i2 += 1) {
    const spot = starSpot(i2);
    engine2.addGeometry({
      type: "box",
      position: [spot.x, spot.y, spot.z],
      size: [1, 1, 1],
      opaque: false,
      meta: { layer: spot.layer },
      style: voxelTone(layerColor[spot.layer])
    });
  }
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 22 }));
  const layerFaces = [0, 1, 2].map((layer) => facesByMeta(el, "layer", String(layer)));
  let pointerX = 0;
  let pointerY = 0;
  let rafId = null;
  let paused = false;
  const applyParallax = () => {
    rafId = null;
    layerFaces.forEach((faces, layer) => {
      const k = LAYER_DEPTH_PX[layer];
      const transform = `translate(${(pointerX * k).toFixed(2)}px, ${(pointerY * k).toFixed(2)}px)`;
      for (const face of faces) face.style.transform = transform;
    });
  };
  const onMove = (event) => {
    if (paused) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
    if (rafId === null) rafId = requestAnimationFrame(applyParallax);
  };
  if (!reducedMotion) {
    el.addEventListener("mousemove", onMove);
  }
  return {
    cleanup() {
      el.removeEventListener("mousemove", onMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
    resume() {
      paused = false;
    }
  };
}
var meta5, STAR_COUNT, LAYER_DEPTH_PX;
var init_starfield_depth = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/starfield_depth.ts"() {
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta5 = {
      id: "starfield-depth",
      name: "Starfield Depth",
      class: "ambient",
      tags: ["background", "parallax", "pointer"],
      productUse: "Empty-page backdrop (404, maintenance); sparse voxel stars with pointer parallax.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    };
    STAR_COUNT = 42;
    LAYER_DEPTH_PX = [10, 6, 3];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/tilt_parallax_card.ts
var tilt_parallax_card_exports = {};
__export(tilt_parallax_card_exports, {
  meta: () => meta6,
  mount: () => mount6
});
function mount6(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 14, camera: { type: "oblique", angle: 315, distance: 12 } });
  engine2.batch(() => {
    engine2.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [5, 1, 5],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.22))
    });
    engine2.addGeometry({
      type: "box",
      position: [0, -1, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.charcoal)
    });
    engine2.addGeometry({
      type: "box",
      position: [0, -2, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.ink)
    });
    engine2.addGeometry({
      type: "box",
      position: [0, -3, 0],
      size: [1, 1, 1],
      meta: { part: "stack" },
      style: voxelTone(palette.gold)
    });
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  const frame = document.createElement("div");
  el.replaceChildren(frame);
  mountSvgMarkup(frame, engine2.toSVG({ padding: 18 }));
  const pose = { x: 0, y: 0, tilt: 0 };
  const applyPose = () => {
    frame.style.transform = `translate(${pose.x}px, ${pose.y}px) rotate(${pose.tilt}deg)`;
  };
  let rafId = null;
  let restAnimation = null;
  let paused = false;
  const onMove = (event) => {
    if (paused) return;
    restAnimation?.cancel();
    restAnimation = null;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const ny = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    pose.x = nx * MAX_SHIFT_PX;
    pose.y = ny * MAX_SHIFT_PX;
    pose.tilt = nx * MAX_TILT_DEG;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyPose();
      });
    }
  };
  const onLeave = () => {
    if (paused) return;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    restAnimation?.cancel();
    restAnimation = animate(pose, {
      x: 0,
      y: 0,
      tilt: 0,
      duration: 520,
      ease: "outBack",
      onUpdate: applyPose
    });
  };
  if (!reducedMotion) {
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
  }
  return {
    cleanup() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      restAnimation?.cancel();
      restAnimation = null;
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      restAnimation?.pause();
    },
    resume() {
      paused = false;
      restAnimation?.play();
    }
  };
}
var meta6, MAX_SHIFT_PX, MAX_TILT_DEG;
var init_tilt_parallax_card = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/tilt_parallax_card.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta6 = {
      id: "tilt-parallax-card",
      name: "Tilt Parallax Card",
      class: "micro",
      tags: ["card", "hover", "depth"],
      productUse: "Product and agent cards; a voxel stack that tilts with the pointer to give cards physical depth.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    MAX_SHIFT_PX = 6;
    MAX_TILT_DEG = 3;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/hover_assemble_logo.ts
var hover_assemble_logo_exports = {};
__export(hover_assemble_logo_exports, {
  meta: () => meta7,
  mount: () => mount7
});
function scatterFor(seed) {
  const angle = seed * 137.508 % 360;
  const radius = 14 + seed * 71 % 18;
  return {
    dx: Math.cos(angle * Math.PI / 180) * radius,
    dy: Math.sin(angle * Math.PI / 180) * radius
  };
}
function mount7(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } });
  let voxelIndex = 0;
  engine2.batch(() => {
    for (const [x2, height] of CROWN_COLUMNS) {
      for (let y2 = 0; y2 < height; y2 += 1) {
        engine2.addGeometry({
          type: "box",
          position: [x2 - 3, -y2, 0],
          size: [1, 1, 1],
          meta: { part: "crown", vox: voxelIndex },
          style: voxelTone(y2 === height - 1 ? palette.gold : palette.ink)
        });
        voxelIndex += 1;
      }
    }
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 26 }));
  const targets = Array.from(el.querySelectorAll("[data-vox]")).map((element) => {
    const seed = Number(element.dataset.vox ?? "0");
    const { dx, dy } = scatterFor(seed);
    return { element, dx, dy };
  });
  let animations = [];
  let paused = false;
  function settle(assembled, immediate) {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    for (const target of targets) {
      const toX = assembled ? 0 : target.dx;
      const toY = assembled ? 0 : target.dy;
      if (immediate || paused) {
        target.element.style.transform = `translate(${toX}px, ${toY}px)`;
        target.element.style.opacity = assembled ? "1" : "0.55";
        continue;
      }
      animations.push(
        animate(target.element, {
          translateX: toX,
          translateY: toY,
          opacity: assembled ? 1 : 0.55,
          duration: assembled ? 420 : 560,
          ease: assembled ? "outBack" : "outQuad"
        })
      );
    }
  }
  const onEnter = () => settle(true, false);
  const onLeave = () => settle(false, false);
  if (reducedMotion) {
    settle(true, true);
  } else {
    settle(false, true);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      paused = false;
      animations.forEach((animation) => animation.play());
    }
  };
}
var meta7, CROWN_COLUMNS;
var init_hover_assemble_logo = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/hover_assemble_logo.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta7 = {
      id: "hover-assemble-logo",
      name: "Hover Assemble",
      class: "micro",
      tags: ["logo", "hover", "assembly"],
      productUse: "Nav logos and link hovers; scattered voxels snap together into the mark on hover.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    CROWN_COLUMNS = [
      [0, 3],
      [1, 2],
      [2, 4],
      [3, 3],
      [4, 4],
      [5, 2],
      [6, 3]
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/button_press_pad.ts
var button_press_pad_exports = {};
__export(button_press_pad_exports, {
  meta: () => meta8,
  mount: () => mount8
});
function mount8(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: TILE, camera: { type: "oblique", angle: 315, distance: 12 } });
  const restStroke = shade(palette.gold, -0.4);
  const baseFace = (fill) => ({
    fill,
    stroke: restStroke,
    strokeWidth: 0.5
  });
  engine2.batch(() => {
    engine2.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [5, 2, 4],
      meta: { part: "base" },
      style: {
        top: baseFace(shade(palette.ink, 0.16)),
        left: baseFace(palette.ink),
        right: baseFace(shade(palette.ink, -0.18)),
        front: baseFace(shade(palette.ink, -0.18)),
        default: baseFace(palette.ink)
      }
    });
    engine2.addGeometry({
      type: "box",
      position: [-1, -2, -1],
      size: [3, 1, 2],
      meta: { part: "cap" },
      style: voxelTone(palette.gold)
    });
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 16 }));
  const capFaces = facesByMeta(el, "part", "cap");
  const baseFaces = facesByMeta(el, "part", "base");
  let animations = [];
  let paused = false;
  const settle = (pressed) => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    if (paused) return;
    animations.push(
      animate(capFaces, {
        translateY: pressed ? TILE * 0.6 : 0,
        duration: pressed ? 90 : 260,
        ease: pressed ? "outQuad" : "outBack"
      }),
      animate(baseFaces, {
        stroke: pressed ? palette.gold : restStroke,
        duration: pressed ? 90 : 260,
        ease: "outQuad"
      })
    );
  };
  const onDown = () => settle(true);
  const onUp = () => settle(false);
  if (!reducedMotion) {
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      paused = false;
      animations.forEach((animation) => animation.play());
    }
  };
}
var meta8, TILE;
var init_button_press_pad = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/button_press_pad.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta8 = {
      id: "button-press-pad",
      name: "Press Pad",
      class: "micro",
      tags: ["button", "press", "feedback"],
      productUse: "Primary call-to-action feedback; a voxel key that physically depresses on press.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    TILE = 14;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/toggle_flip_cube.ts
var toggle_flip_cube_exports = {};
__export(toggle_flip_cube_exports, {
  meta: () => meta9,
  mount: () => mount9
});
function mount9(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 16, camera: { type: "oblique", angle: 315, distance: 12 } });
  const colorAt = (x2) => x2 < 0 ? palette.ink : x2 > 0 ? palette.gold : palette.charcoal;
  engine2.addGeometry({
    type: "box",
    position: [-1, -1, -1],
    size: [3, 3, 3],
    meta: { part: "cube" },
    style: {
      top: (x2) => ({ fill: shade(colorAt(x2), 0.18) }),
      left: (x2) => ({ fill: colorAt(x2) }),
      right: (x2) => ({ fill: shade(colorAt(x2), -0.16) }),
      front: (x2) => ({ fill: shade(colorAt(x2), -0.16) }),
      default: (x2) => ({ fill: colorAt(x2) })
    }
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  const frame = document.createElement("div");
  el.replaceChildren(frame);
  mountSvgMarkup(frame, engine2.toSVG({ padding: 20 }));
  let flipped = false;
  let flipAnimation = null;
  let paused = false;
  const applyState = () => {
    el.dataset.state = flipped ? "on" : "off";
  };
  const onClick = () => {
    if (paused) return;
    flipped = !flipped;
    applyState();
    flipAnimation?.cancel();
    flipAnimation = null;
    if (reducedMotion) {
      frame.style.transform = flipped ? "scaleX(-1)" : "scaleX(1)";
      return;
    }
    flipAnimation = animate(frame, {
      scaleX: flipped ? -1 : 1,
      scaleY: [1, 0.86, 1],
      duration: 460,
      ease: "inOutQuad"
    });
  };
  applyState();
  el.addEventListener("click", onClick);
  return {
    cleanup() {
      flipAnimation?.cancel();
      flipAnimation = null;
      el.removeEventListener("click", onClick);
      delete el.dataset.state;
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      flipAnimation?.pause();
    },
    resume() {
      paused = false;
      flipAnimation?.play();
    }
  };
}
var meta9;
var init_toggle_flip_cube = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/toggle_flip_cube.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta9 = {
      id: "toggle-flip-cube",
      name: "Flip Cube",
      class: "micro",
      tags: ["toggle", "state", "rotate"],
      productUse: "Two-state toggles (theme, view mode); a cube that rolls between two styled faces.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/checkbox_stack_tick.ts
var checkbox_stack_tick_exports = {};
__export(checkbox_stack_tick_exports, {
  meta: () => meta10,
  mount: () => mount10
});
function mount10(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 12 } });
  engine2.batch(() => {
    engine2.addGeometry({
      type: "box",
      position: [-3, 1, -3],
      size: [7, 1, 7],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.2))
    });
    TICK_PATH.forEach(([x2, z], step) => {
      engine2.addGeometry({
        type: "box",
        position: [x2, 0, z],
        size: [1, 1, 1],
        meta: { part: "tick", step },
        style: voxelTone(palette.gold)
      });
    });
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 16 }));
  const orderedFaces = [];
  for (let step = 0; step < TICK_PATH.length; step += 1) {
    orderedFaces.push(...facesByMeta(el, "step", String(step)));
  }
  let animation = null;
  let paused = false;
  const reveal = () => {
    if (paused) return;
    animation?.cancel();
    animation = staggerFaceReveal(orderedFaces, { delayStep: 40, duration: 320 });
  };
  if (!reducedMotion) {
    reveal();
    el.addEventListener("click", reveal);
  }
  return {
    cleanup() {
      animation?.cancel();
      animation = null;
      el.removeEventListener("click", reveal);
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      animation?.pause();
    },
    resume() {
      paused = false;
      animation?.play();
    }
  };
}
var meta10, TICK_PATH;
var init_checkbox_stack_tick = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/checkbox_stack_tick.ts"() {
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta10 = {
      id: "checkbox-stack-tick",
      name: "Stack Tick",
      class: "micro",
      tags: ["form", "success", "checkmark"],
      productUse: "Form confirmation; a voxel checkmark that builds in when a step completes.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    TICK_PATH = [
      [-3, 0],
      [-2, 1],
      [-1, 2],
      [0, 1],
      [1, 0],
      [2, -1],
      [3, -2]
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/input_focus_frame.ts
var input_focus_frame_exports = {};
__export(input_focus_frame_exports, {
  meta: () => meta11,
  mount: () => mount11
});
function mount11(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 12, camera: { type: "oblique", angle: 315, distance: 12 } });
  const restOpacity = reducedMotion ? 1 : REST_STROKE_OPACITY;
  const frameFace = (fill) => ({
    fill,
    stroke: palette.gold,
    strokeWidth: 0.6,
    strokeOpacity: restOpacity
  });
  const frameStyle = {
    top: frameFace(shade(palette.ink, 0.14)),
    left: frameFace(palette.ink),
    default: frameFace(shade(palette.ink, -0.16))
  };
  engine2.batch(() => {
    engine2.addGeometry({ type: "box", position: [-5, 0, -2], size: [10, 1, 1], meta: { side: "top" }, style: frameStyle });
    engine2.addGeometry({ type: "box", position: [-5, 0, 1], size: [10, 1, 1], meta: { side: "bottom" }, style: frameStyle });
    engine2.addGeometry({ type: "box", position: [-5, 0, -1], size: [1, 1, 2], meta: { side: "left" }, style: frameStyle });
    engine2.addGeometry({ type: "box", position: [4, 0, -1], size: [1, 1, 2], meta: { side: "right" }, style: frameStyle });
  });
  el.classList.add("rg-collateral-host", "rg-collateral-hoverable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 14 }));
  let chase = null;
  let fade = null;
  let paused = false;
  const onEnter = () => {
    if (paused) return;
    fade?.cancel();
    fade = null;
    chase?.cancel();
    const timeline = createTimeline();
    CHASE_ORDER.forEach((side, index) => {
      timeline.add(
        facesByMeta(el, "side", side),
        { strokeOpacity: [REST_STROKE_OPACITY, 1], duration: 150, ease: "inOutQuad" },
        index * 150
      );
    });
    chase = timeline;
  };
  const onLeave = () => {
    if (paused) return;
    chase?.cancel();
    chase = null;
    fade?.cancel();
    fade = animate(facesByMeta(el, "side"), {
      strokeOpacity: REST_STROKE_OPACITY,
      duration: 260,
      ease: "outQuad"
    });
  };
  if (!reducedMotion) {
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
  }
  return {
    cleanup() {
      chase?.cancel();
      chase = null;
      fade?.cancel();
      fade = null;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.classList.remove("rg-collateral-host", "rg-collateral-hoverable");
      el.replaceChildren();
    },
    pause() {
      paused = true;
      chase?.pause();
      fade?.pause();
    },
    resume() {
      paused = false;
      chase?.play();
      fade?.play();
    }
  };
}
var meta11, REST_STROKE_OPACITY, CHASE_ORDER;
var init_input_focus_frame = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/input_focus_frame.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta11 = {
      id: "input-focus-frame",
      name: "Focus Frame",
      class: "micro",
      tags: ["form", "focus", "frame"],
      productUse: "Input focus affordance; a thin voxel frame that lights up around the active field.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    REST_STROKE_OPACITY = 0.35;
    CHASE_ORDER = ["top", "right", "bottom", "left"];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/voxel_bar_relay.ts
var voxel_bar_relay_exports = {};
__export(voxel_bar_relay_exports, {
  meta: () => meta12,
  mount: () => mount12
});
function normalizeData(data) {
  const candidate = data;
  const values = Array.isArray(candidate?.values) ? candidate.values.filter((value) => typeof value === "number" && value >= 0).slice(0, 12) : [4, 9, 6, 12, 7, 10, 5];
  return { values, labels: candidate?.labels };
}
function mount12(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 13,
    camera: { type: "oblique", angle: 315, distance: 14 }
  });
  el.classList.add("rg-collateral-host");
  let animation = null;
  const barColor = (index, count) => {
    if (count <= 1) return palette.gold;
    const t2 = index / (count - 1);
    return t2 < 0.34 ? palette.charcoal : t2 < 0.67 ? palette.ink : palette.gold;
  };
  function render2(data, animateIn) {
    animation?.cancel();
    animation = null;
    const max2 = Math.max(...data.values, 1);
    engine2.clear();
    engine2.batch(() => {
      const count = data.values.length;
      const startX = -count;
      engine2.addGeometry({
        type: "box",
        position: [startX - 1, 1, -1],
        size: [count * 2 + 1, 1, 4],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.25))
      });
      data.values.forEach((value, index) => {
        const height = Math.max(1, Math.round(value / max2 * MAX_BAR_HEIGHT));
        engine2.addGeometry({
          type: "box",
          position: [startX + index * 2, 1 - height, 0],
          size: [1, height, 2],
          meta: { part: "bar", bar: index },
          style: voxelTone(barColor(index, count))
        });
      });
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 14 }));
    if (animateIn && !reducedMotion) {
      const bars = facesByMeta(el, "bar");
      animation = animate(bars, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 460,
        delay: stagger(8),
        ease: "outQuart"
      });
    }
  }
  render2(normalizeData(ctx.data), true);
  return {
    cleanup() {
      animation?.cancel();
      animation = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animation?.pause();
    },
    resume() {
      animation?.play();
    },
    update(data) {
      render2(normalizeData(data), true);
    }
  };
}
var meta12, MAX_BAR_HEIGHT;
var init_voxel_bar_relay = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/voxel_bar_relay.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta12 = {
      id: "voxel-bar-relay",
      name: "Voxel Bar Relay",
      class: "data",
      tags: ["chart", "dashboard", "bars"],
      productUse: "Dashboard stats; a 3D bar chart whose columns grow and reorder as numbers change.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    };
    MAX_BAR_HEIGHT = 9;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/terrain_heightmap.ts
var terrain_heightmap_exports = {};
__export(terrain_heightmap_exports, {
  meta: () => meta13,
  mount: () => mount13
});
function normalizeData2(data) {
  const candidate = data;
  if (!Array.isArray(candidate?.grid)) return { grid: DEMO_GRID };
  const grid2 = candidate.grid.slice(0, MAX_SIZE).map(
    (row) => Array.isArray(row) ? row.slice(0, MAX_SIZE).map(
      (value) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(MAX_HEIGHT, Math.round(value))) : 0
    ) : []
  ).filter((row) => row.length > 0);
  return grid2.length > 0 ? { grid: grid2 } : { grid: DEMO_GRID };
}
function mount13(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 11, camera: { type: "oblique", angle: 315, distance: 14 } });
  el.classList.add("rg-collateral-host");
  let animation = null;
  const columnColor = (height) => {
    if (height <= 2) return shade(palette.olive, 0.12);
    if (height <= 4) return palette.charcoal;
    return palette.ink;
  };
  function render2(data, animateIn) {
    animation?.cancel();
    animation = null;
    const rows = data.grid.length;
    const cols = Math.max(...data.grid.map((row) => row.length));
    const x0 = -Math.floor(cols / 2);
    const z0 = -Math.floor(rows / 2);
    engine2.clear();
    engine2.batch(() => {
      engine2.addGeometry({
        type: "box",
        position: [x0, 1, z0],
        size: [cols, 1, rows],
        meta: { part: "base" },
        style: voxelTone(shade(palette.olive, -0.1))
      });
      data.grid.forEach((row, z) => {
        row.forEach((value, x2) => {
          if (value <= 0) return;
          const peak = value >= 7;
          const bodyHeight = peak ? value - 1 : value;
          const cell = `${x2}-${z}`;
          if (bodyHeight > 0) {
            engine2.addGeometry({
              type: "box",
              position: [x0 + x2, 1 - bodyHeight, z0 + z],
              size: [1, bodyHeight, 1],
              meta: { cell },
              style: voxelTone(columnColor(value))
            });
          }
          if (peak) {
            engine2.addGeometry({
              type: "box",
              position: [x0 + x2, 1 - value, z0 + z],
              size: [1, 1, 1],
              meta: { cell },
              style: voxelTone(palette.gold)
            });
          }
        });
      });
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 16 }));
    if (animateIn && !reducedMotion) {
      animation = staggerFaceReveal(facesByMeta(el, "cell"), { from: "center", delayStep: 5, duration: 380 });
    }
  }
  render2(normalizeData2(ctx.data), true);
  return {
    cleanup() {
      animation?.cancel();
      animation = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animation?.pause();
    },
    resume() {
      animation?.play();
    },
    update(data) {
      render2(normalizeData2(data), true);
    }
  };
}
var meta13, MAX_SIZE, MAX_HEIGHT, DEMO_GRID;
var init_terrain_heightmap = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/terrain_heightmap.ts"() {
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta13 = {
      id: "terrain-heightmap",
      name: "Terrain Heightmap",
      class: "data",
      tags: ["chart", "surface", "analytics"],
      productUse: "Activity and network visualizations; a voxel terrain whose elevation is the data.",
      budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" }
    };
    MAX_SIZE = 8;
    MAX_HEIGHT = 8;
    DEMO_GRID = [
      [1, 2, 2, 3, 2, 1],
      [2, 3, 4, 4, 3, 2],
      [2, 4, 6, 5, 4, 2],
      [3, 4, 5, 6, 4, 3],
      [2, 3, 4, 4, 3, 2],
      [1, 2, 2, 3, 2, 1]
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/stake_vault_fill.ts
var stake_vault_fill_exports = {};
__export(stake_vault_fill_exports, {
  meta: () => meta14,
  mount: () => mount14
});
function normalizeData3(data) {
  const candidate = data;
  const ratio = typeof candidate?.ratio === "number" && Number.isFinite(candidate.ratio) ? Math.max(0, Math.min(1, candidate.ratio)) : 0.62;
  return { ratio };
}
function layersFor(ratio) {
  return Math.floor(ratio * LAYER_COUNT);
}
function mount14(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 14 } });
  el.classList.add("rg-collateral-host");
  let animation = null;
  let currentLayers = 0;
  let disposed = false;
  const glassFace = {
    fill: palette.ink,
    fillOpacity: 0.12,
    stroke: shade(palette.ink, 0.3),
    strokeWidth: 0.5
  };
  function render2(ratio, animateFrom) {
    animation?.cancel();
    animation = null;
    const layers = layersFor(ratio);
    currentLayers = layers;
    engine2.clear();
    engine2.batch(() => {
      engine2.addGeometry({
        type: "box",
        position: [-4, 1, -4],
        size: [8, 1, 8],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.2))
      });
      engine2.addGeometry({
        type: "box",
        position: [-3, -5, -3],
        size: [6, 6, 6],
        meta: { part: "shell" },
        style: { default: glassFace },
        opaque: false
      });
      engine2.removeGeometry({ type: "box", position: [-2, -5, -2], size: [4, 6, 4] });
      for (let layer = 0; layer < layers; layer += 1) {
        engine2.addGeometry({
          type: "box",
          position: [-2, -layer, -2],
          size: [4, 1, 4],
          meta: { layer },
          style: voxelTone(palette.gold)
        });
      }
      if (layers > 0) {
        engine2.addGeometry({
          type: "box",
          position: [-2, -layers, -2],
          size: [4, 1, 4],
          scale: [1, 0.3, 1],
          scaleOrigin: [0.5, 1, 0.5],
          opaque: false,
          meta: { part: "surface" },
          style: {
            top: { fill: palette.paper, stroke: shade(palette.gold, -0.2), strokeWidth: 0.4 },
            default: { fill: shade(palette.paper, -0.12), stroke: shade(palette.gold, -0.2), strokeWidth: 0.4 }
          }
        });
      }
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 22 }));
    if (reducedMotion || animateFrom === null) return;
    if (layers > animateFrom) {
      const rising = [];
      for (let layer = animateFrom; layer < layers; layer += 1) {
        rising.push(...facesByMeta(el, "layer", String(layer)));
      }
      rising.push(...facesByMeta(el, "part", "surface"));
      animation = animate(rising, {
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 420,
        delay: stagger(9),
        ease: "outQuad"
      });
    } else {
      const surface = facesByMeta(el, "part", "surface");
      if (surface.length > 0) {
        animation = animate(surface, { opacity: [0, 1], duration: 300, ease: "outQuad" });
      }
    }
  }
  render2(normalizeData3(ctx.data).ratio, reducedMotion ? null : 0);
  return {
    cleanup() {
      disposed = true;
      animation?.cancel();
      animation = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animation?.pause();
    },
    resume() {
      animation?.play();
    },
    update(data) {
      const next = normalizeData3(data);
      const nextLayers = layersFor(next.ratio);
      if (!reducedMotion && nextLayers < currentLayers) {
        const falling = [...facesByMeta(el, "part", "surface")];
        for (let layer = currentLayers - 1; layer >= nextLayers; layer -= 1) {
          falling.push(...facesByMeta(el, "layer", String(layer)));
        }
        animation?.cancel();
        animation = animate(falling, {
          opacity: 0,
          duration: 240,
          delay: stagger(8),
          ease: "inQuad"
        });
        void animation.then(() => {
          if (disposed) return;
          render2(next.ratio, nextLayers);
        });
      } else {
        render2(next.ratio, reducedMotion ? null : currentLayers);
      }
    }
  };
}
var meta14, LAYER_COUNT;
var init_stake_vault_fill = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/stake_vault_fill.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta14 = {
      id: "stake-vault-fill",
      name: "Vault Fill",
      class: "data",
      tags: ["staking", "progress", "vault"],
      productUse: "Staking progress; a glass vault that fills with gold voxels as the staked share grows.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    };
    LAYER_COUNT = 5;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/launch_pipeline_track.ts
var launch_pipeline_track_exports = {};
__export(launch_pipeline_track_exports, {
  meta: () => meta15,
  mount: () => mount15
});
function normalizeData4(data) {
  const candidate = data;
  const stages = typeof candidate?.stages === "number" && Number.isFinite(candidate.stages) ? Math.max(2, Math.min(8, Math.round(candidate.stages))) : 5;
  const stage = typeof candidate?.stage === "number" && Number.isFinite(candidate.stage) ? Math.max(1, Math.min(stages, Math.round(candidate.stage))) : Math.min(3, stages);
  return { stage, stages, labels: candidate?.labels };
}
function mount15(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: TILE2, camera: { type: "isometric", distance: 16 } });
  el.classList.add("rg-collateral-host");
  let animations = [];
  let currentStage = 0;
  const stationX = (index, stages) => index * SPACING - ((stages - 1) * SPACING + 2) / 2;
  const ghostStyle = (fill) => ({
    default: {
      fill,
      fillOpacity: 0.3,
      stroke: shade(palette.ink, 0.2),
      strokeOpacity: 0.4,
      strokeWidth: 0.4
    }
  });
  function render2(data) {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    const current = data.stage - 1;
    engine2.clear();
    engine2.batch(() => {
      for (let index = 0; index < data.stages; index += 1) {
        const sx = stationX(index, data.stages);
        const done = index <= current;
        engine2.addGeometry({
          type: "box",
          position: [sx, 1, -1],
          size: [2, 1, 2],
          meta: { part: "station", station: index },
          style: done ? voxelTone(palette.charcoal) : ghostStyle(palette.charcoal),
          opaque: done
        });
        if (done) {
          engine2.addGeometry({
            type: "box",
            position: [sx, 0, -1],
            size: [2, 1, 2],
            scale: [1, 0.3, 1],
            scaleOrigin: [0.5, 1, 0.5],
            opaque: false,
            meta: { part: "cap", station: index },
            style: voxelTone(palette.gold)
          });
        }
        if (index < data.stages - 1) {
          engine2.addGeometry({
            type: "box",
            position: [sx + 2, 1, -1],
            size: [2, 1, 1],
            meta: { part: "rail", rail: index },
            style: index < current ? voxelTone(shade(palette.ink, -0.1)) : ghostStyle(palette.ink),
            opaque: index < current
          });
        }
      }
      engine2.addGeometry({
        type: "box",
        position: [stationX(current, data.stages), -2, -1],
        size: [1, 2, 1],
        meta: { part: "token" },
        style: voxelTone(palette.gold)
      });
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 18 }));
  }
  const first = normalizeData4(ctx.data);
  currentStage = first.stage;
  render2(first);
  if (!reducedMotion) {
    const reveal = staggerFaceReveal(facesByMeta(el, "part"), { delayStep: 6, duration: 360 });
    if (reveal) animations.push(reveal);
  }
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    },
    update(data) {
      const next = normalizeData4(data);
      const previousStage = currentStage;
      currentStage = next.stage;
      render2(next);
      if (reducedMotion || next.stage === previousStage) return;
      const token = facesByMeta(el, "part", "token");
      const deltaX = (previousStage - next.stage) * SPACING * TILE2;
      animations.push(
        animate(token, {
          translateX: [deltaX, 0],
          duration: 600,
          ease: "outQuart"
        })
      );
      if (next.stage > previousStage) {
        const lit = [];
        for (let index = previousStage; index < next.stage; index += 1) {
          lit.push(...facesByMeta(el, "station", String(index)).filter((face) => face.dataset.part === "cap"));
        }
        if (lit.length > 0) {
          animations.push(
            animate(lit, {
              opacity: [0, 1],
              translateY: [-4, 0],
              duration: 420,
              delay: stagger(20),
              ease: "outBack"
            })
          );
        }
      }
    }
  };
}
var meta15, TILE2, SPACING;
var init_launch_pipeline_track = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/launch_pipeline_track.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta15 = {
      id: "launch-pipeline-track",
      name: "Pipeline Track",
      class: "data",
      tags: ["progress", "stages", "launch"],
      productUse: "Multi-stage progress; a token advances along an isometric track, one station per stage.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    };
    TILE2 = 12;
    SPACING = 4;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/techtree_growth.ts
var techtree_growth_exports = {};
__export(techtree_growth_exports, {
  meta: () => meta16,
  mount: () => mount16
});
function normalizeData5(data) {
  const candidate = data;
  const total = typeof candidate?.total === "number" && Number.isFinite(candidate.total) ? Math.max(1, Math.min(SLOTS.length, Math.round(candidate.total))) : SLOTS.length;
  const unlocked = typeof candidate?.unlocked === "number" && Number.isFinite(candidate.unlocked) ? Math.max(0, Math.min(total, Math.round(candidate.unlocked))) : Math.min(9, total);
  return { unlocked, total };
}
function mount16(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 13, camera: { type: "oblique", angle: 315, distance: 14 } });
  el.classList.add("rg-collateral-host");
  let animation = null;
  let currentUnlocked = 0;
  const ghostStyle = (fill) => ({
    default: {
      fill,
      fillOpacity: 0.25,
      stroke: shade(palette.ink, 0.2),
      strokeOpacity: 0.4,
      strokeWidth: 0.4
    }
  });
  function render2(data) {
    animation?.cancel();
    animation = null;
    engine2.clear();
    engine2.batch(() => {
      engine2.addGeometry({
        type: "box",
        position: [-2, 1, -2],
        size: [5, 1, 5],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.2))
      });
      engine2.addGeometry({
        type: "box",
        position: [0, -3, 0],
        size: [1, 4, 1],
        meta: { part: "trunk" },
        style: voxelTone(palette.charcoal)
      });
      SLOTS.slice(0, data.total).forEach((slot, node) => {
        const unlocked = node < data.unlocked;
        const color = slot.kind === "leaf" ? palette.gold : palette.ink;
        engine2.addGeometry({
          type: "box",
          position: slot.pos,
          size: [1, 1, 1],
          meta: { node },
          style: unlocked ? voxelTone(color) : ghostStyle(color),
          opaque: unlocked
        });
      });
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 18 }));
  }
  function assemble(from, to) {
    const rising = [];
    for (let node = from; node < to; node += 1) {
      rising.push(...facesByMeta(el, "node", String(node)));
    }
    if (rising.length === 0) return;
    for (const face of rising) {
      face.style.setProperty("transform-box", "fill-box");
      face.style.setProperty("transform-origin", "50% 50%");
    }
    animation = animate(rising, {
      opacity: [0, 1],
      scale: [0.4, 1],
      duration: 480,
      delay: stagger(20),
      ease: "outBack"
    });
  }
  const first = normalizeData5(ctx.data);
  currentUnlocked = first.unlocked;
  render2(first);
  if (!reducedMotion) assemble(0, first.unlocked);
  return {
    cleanup() {
      animation?.cancel();
      animation = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animation?.pause();
    },
    resume() {
      animation?.play();
    },
    update(data) {
      const next = normalizeData5(data);
      const previousUnlocked = currentUnlocked;
      currentUnlocked = next.unlocked;
      render2(next);
      if (!reducedMotion && next.unlocked > previousUnlocked) {
        assemble(previousUnlocked, next.unlocked);
      }
    }
  };
}
var meta16, SLOTS;
var init_techtree_growth = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/techtree_growth.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta16 = {
      id: "techtree-growth",
      name: "Tree Growth",
      class: "data",
      tags: ["tree", "progress", "research"],
      productUse: "Research-tree progress; branches assemble voxel by voxel as nodes unlock.",
      budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" }
    };
    SLOTS = [
      { pos: [-1, -2, 0], kind: "branch" },
      { pos: [1, -2, 0], kind: "branch" },
      { pos: [0, -2, -1], kind: "branch" },
      { pos: [0, -2, 1], kind: "branch" },
      { pos: [-2, -2, 0], kind: "leaf" },
      { pos: [2, -2, 0], kind: "leaf" },
      { pos: [0, -2, -2], kind: "leaf" },
      { pos: [0, -2, 2], kind: "leaf" },
      { pos: [0, -4, 0], kind: "branch" },
      { pos: [-1, -4, 0], kind: "branch" },
      { pos: [1, -4, 0], kind: "branch" },
      { pos: [-1, -5, 0], kind: "leaf" },
      { pos: [1, -5, 0], kind: "leaf" },
      { pos: [0, -5, -1], kind: "leaf" },
      { pos: [0, -5, 1], kind: "leaf" },
      { pos: [0, -6, 0], kind: "leaf" }
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/podium_bids.ts
var podium_bids_exports = {};
__export(podium_bids_exports, {
  meta: () => meta17,
  mount: () => mount17
});
function normalizeData6(data) {
  const candidate = data;
  if (!Array.isArray(candidate?.entries)) return { entries: DEMO_ENTRIES };
  const entries = candidate.entries.filter(
    (entry) => typeof entry === "object" && entry !== null && typeof entry.label === "string" && typeof entry.value === "number" && Number.isFinite(entry.value) && entry.value >= 0
  ).map((entry, index) => ({
    label: entry.label.replace(/[^\w-]/g, "").slice(0, 12) || `entry-${index}`,
    value: entry.value
  })).slice(0, SLOT_X.length);
  return entries.length > 0 ? { entries } : { entries: DEMO_ENTRIES };
}
function mount17(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: TILE3, camera: { type: "oblique", angle: 315, distance: 14 } });
  el.classList.add("rg-collateral-host");
  let animations = [];
  const previousSlotX = /* @__PURE__ */ new Map();
  const slotColors = [palette.gold, palette.charcoal, palette.ink, palette.olive, palette.olive];
  function render2(data, animateIn) {
    animations.forEach((animation) => animation.cancel());
    animations = [];
    const sorted = data.entries.slice().sort((a2, b2) => b2.value - a2.value);
    const maxValue2 = Math.max(...sorted.map((entry) => entry.value), 1);
    engine2.clear();
    engine2.batch(() => {
      engine2.addGeometry({
        type: "box",
        position: [-6, 1, -2],
        size: [12, 1, 4],
        meta: { part: "plinth" },
        style: voxelTone(shade(palette.olive, 0.25))
      });
      sorted.forEach((entry, slot) => {
        const height = Math.max(1, Math.round(entry.value / maxValue2 * MAX_COLUMN_HEIGHT));
        engine2.addGeometry({
          type: "box",
          position: [SLOT_X[slot] - 1, 1 - height, -1],
          size: [2, height, 2],
          meta: { slot, key: entry.label },
          style: voxelTone(slotColors[slot])
        });
      });
    });
    mountSvgMarkup(el, engine2.toSVG({ padding: 16 }));
    if (animateIn && !reducedMotion) {
      sorted.forEach((entry, slot) => {
        const faces = facesByMeta(el, "key", entry.label);
        if (faces.length === 0) return;
        const fromX = previousSlotX.get(entry.label);
        const toX = SLOT_X[slot];
        if (fromX !== void 0 && fromX !== toX) {
          animations.push(
            animate(faces, {
              translateX: [(fromX - toX) * TILE3, 0],
              duration: 620,
              ease: "outQuart"
            })
          );
        } else if (fromX === void 0) {
          animations.push(
            animate(faces, {
              opacity: [0, 1],
              translateY: [8, 0],
              duration: 420,
              ease: "outQuad"
            })
          );
        }
      });
    }
    previousSlotX.clear();
    sorted.forEach((entry, slot) => previousSlotX.set(entry.label, SLOT_X[slot]));
  }
  render2(normalizeData6(ctx.data), true);
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    },
    update(data) {
      render2(normalizeData6(data), true);
    }
  };
}
var meta17, TILE3, MAX_COLUMN_HEIGHT, SLOT_X, DEMO_ENTRIES;
var init_podium_bids = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/podium_bids.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta17 = {
      id: "podium-bids",
      name: "Podium Bids",
      class: "data",
      tags: ["leaderboard", "auction", "ranking"],
      productUse: "Live leaderboards; podium columns that grow and swap places as rankings change.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    };
    TILE3 = 13;
    MAX_COLUMN_HEIGHT = 8;
    SLOT_X = [0, -2.2, 2.2, -4.4, 4.4];
    DEMO_ENTRIES = [
      { label: "AURA", value: 86 },
      { label: "MINT", value: 64 },
      { label: "PLEX", value: 51 },
      { label: "NOVA", value: 38 },
      { label: "HALO", value: 22 }
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/dissolve_rebuild.ts
var dissolve_rebuild_exports = {};
__export(dissolve_rebuild_exports, {
  meta: () => meta18,
  mount: () => mount18
});
function scatterFor2(seed) {
  const angle = seed * 137.508 % 360;
  const radius = 22 + seed * 53 % 20;
  return {
    dx: Math.cos(angle * Math.PI / 180) * radius,
    dy: Math.sin(angle * Math.PI / 180) * radius
  };
}
function mount18(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 12,
    camera: { type: "oblique", angle: 315, distance: 12 }
  });
  let voxA = 0;
  for (let x2 = -2; x2 <= 1; x2 += 1) {
    for (let y2 = -3; y2 <= 0; y2 += 1) {
      for (let z = 0; z <= 3; z += 1) {
        engine2.addGeometry({
          type: "box",
          position: [x2, y2, z],
          size: [1, 1, 1],
          meta: { motif: "a", vox: voxA },
          style: voxelTone(y2 === -3 ? palette.gold : palette.ink)
        });
        voxA += 1;
      }
    }
  }
  const facesA = engine2.getFaces();
  const boundsA = engine2.getBounds(20, facesA);
  engine2.clear();
  let voxB = 0;
  const levels = [
    { half: 2, y: 0 },
    { half: 1, y: -1 },
    { half: 0, y: -2 }
  ];
  for (const level of levels) {
    for (let x2 = -level.half; x2 <= level.half; x2 += 1) {
      for (let z = 1 - level.half; z <= 1 + level.half; z += 1) {
        engine2.addGeometry({
          type: "box",
          position: [x2, level.y, z],
          size: [1, 1, 1],
          meta: { motif: "b", vox: voxB },
          style: voxelTone(level.half === 0 ? palette.gold : palette.charcoal)
        });
        voxB += 1;
      }
    }
  }
  const facesB = engine2.getFaces();
  const boundsB = engine2.getBounds(20, facesB);
  const minX = Math.min(boundsA.x, boundsB.x);
  const minY = Math.min(boundsA.y, boundsB.y);
  const viewBox = [
    minX,
    minY,
    Math.max(boundsA.x + boundsA.w, boundsB.x + boundsB.w) - minX,
    Math.max(boundsA.y + boundsA.h, boundsB.y + boundsB.h) - minY
  ];
  el.classList.add("rg-collateral-host", "rg-collateral-replayable");
  const frame = document.createElement("div");
  frame.className = "rg-collateral-drift-frame";
  frame.style.position = "relative";
  const layerA = document.createElement("div");
  layerA.style.width = "100%";
  layerA.style.height = "100%";
  const layerB = document.createElement("div");
  layerB.style.position = "absolute";
  layerB.style.inset = "0";
  frame.append(layerA, layerB);
  el.replaceChildren(frame);
  mountSvgMarkup(layerA, engine2.toSVG({ faces: facesA, viewBox }));
  mountSvgMarkup(layerB, engine2.toSVG({ faces: facesB, viewBox }));
  const collect = (motif) => {
    const faces = Array.from(frame.querySelectorAll(`[data-motif="${motif}"]`));
    return faces.map((face, index) => ({ face, key: (Number(face.dataset.vox ?? "0") * 137 + index * 31) % 101 })).sort((a2, b2) => a2.key - b2.key).map((entry) => entry.face);
  };
  const motifFaces = { a: collect("a"), b: collect("b") };
  const scatterOf = /* @__PURE__ */ new Map();
  for (const motif of ["a", "b"]) {
    for (const face of motifFaces[motif]) {
      scatterOf.set(face, scatterFor2(Number(face.dataset.vox ?? "0")));
    }
  }
  const setHidden = (faces, hidden) => {
    for (const face of faces) {
      if (hidden) {
        const scatter = scatterOf.get(face) ?? { dx: 0, dy: 0 };
        face.style.opacity = "0";
        face.style.transform = `translate(${scatter.dx.toFixed(1)}px, ${scatter.dy.toFixed(1)}px)`;
      } else {
        face.style.opacity = "1";
        face.style.transform = "translate(0px, 0px)";
      }
    }
  };
  let showing = "a";
  let timeline = null;
  const play = () => {
    const from = showing;
    const to = showing === "a" ? "b" : "a";
    showing = to;
    timeline?.cancel();
    timeline = null;
    setHidden(motifFaces[from], false);
    setHidden(motifFaces[to], true);
    if (reducedMotion) {
      setHidden(motifFaces[from], true);
      setHidden(motifFaces[to], false);
      return;
    }
    timeline = createTimeline();
    timeline.add(motifFaces[from], {
      opacity: 0,
      translateX: (target) => scatterOf.get(target)?.dx ?? 0,
      translateY: (target) => scatterOf.get(target)?.dy ?? 0,
      duration: 420,
      delay: stagger(5),
      ease: "inQuad"
    });
    timeline.add(
      motifFaces[to],
      {
        opacity: 1,
        translateX: 0,
        translateY: 0,
        duration: 460,
        delay: stagger(5),
        ease: "outBack"
      },
      420
    );
  };
  if (reducedMotion) {
    setHidden(motifFaces.a, true);
    setHidden(motifFaces.b, false);
    showing = "b";
  } else {
    setHidden(motifFaces.b, true);
    play();
  }
  return {
    cleanup() {
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta18;
var init_dissolve_rebuild = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/dissolve_rebuild.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta18 = {
      id: "dissolve-rebuild",
      name: "Dissolve and Rebuild",
      class: "transition",
      tags: ["navigation", "page", "morph"],
      productUse: "Page-to-page handoff; the current scene dissolves into voxels that reassemble as the next motif.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    };
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/tunnel_warp.ts
var tunnel_warp_exports = {};
__export(tunnel_warp_exports, {
  meta: () => meta19,
  mount: () => mount19
});
function mount19(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const depthMix2 = (z, near, far) => {
    const t2 = Math.min(1, Math.max(0, z / DEPTH3));
    return t2 < 0.45 ? near : t2 < 0.8 ? shade(near, -0.28) : far;
  };
  const engine2 = new Heerich({
    tile: [22, 22],
    camera: { type: "perspective", position: [0, -2.4], distance: FAR_DISTANCE },
    style: { fill: palette.ink, stroke: shade(palette.gold, -0.1), strokeWidth: 0.5 }
  });
  const startX = -Math.floor(WIDTH2 / 2);
  const wallStyle = (glowSide) => ({
    default: (_x, _y, z) => ({
      fill: depthMix2(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix2(z, shade(palette.gold, -0.2), shade(palette.ink, -0.2)),
      strokeWidth: 0.4
    }),
    [glowSide]: (_x, _y, z) => ({
      fill: depthMix2(z, palette.charcoal, shade(palette.ink, -0.4)),
      stroke: depthMix2(z, palette.gold, shade(palette.gold, -0.45)),
      strokeWidth: 0.7
    })
  });
  engine2.addGeometry({
    type: "box",
    position: [startX, 0, 0],
    size: [WIDTH2, 1, DEPTH3],
    style: {
      default: (_x, _y, z) => ({
        fill: depthMix2(z, shade(palette.ink, -0.12), shade(palette.ink, -0.5)),
        stroke: depthMix2(z, shade(palette.gold, -0.25), shade(palette.ink, -0.3)),
        strokeWidth: 0.4
      })
    }
  });
  engine2.addGeometry({ type: "box", position: [startX, 1, 0], size: [1, HEIGHT2, DEPTH3], style: wallStyle("right") });
  engine2.addGeometry({
    type: "box",
    position: [startX + WIDTH2 - 1, 1, 0],
    size: [1, HEIGHT2, DEPTH3],
    style: wallStyle("left")
  });
  engine2.addGeometry({
    type: "box",
    position: [startX, HEIGHT2 + 1, 0],
    size: [WIDTH2, 1, DEPTH3],
    style: {
      default: (_x, _y, z) => ({
        fill: depthMix2(z, shade(palette.charcoal, 0.06), shade(palette.ink, -0.45)),
        stroke: depthMix2(z, shade(palette.gold, -0.05), shade(palette.ink, -0.25)),
        strokeWidth: 0.5
      }),
      top: (_x, _y, z) => ({
        fill: depthMix2(z, shade(palette.charcoal, 0.12), shade(palette.ink, -0.4)),
        stroke: depthMix2(z, palette.gold, shade(palette.gold, -0.5)),
        strokeWidth: 0.66
      })
    }
  });
  el.classList.add("rg-collateral-host", "rg-collateral-replayable");
  const frame = document.createElement("div");
  frame.className = "rg-collateral-drift-frame";
  frame.style.position = "relative";
  const svgHolder = document.createElement("div");
  svgHolder.style.width = "100%";
  svgHolder.style.height = "100%";
  const flash = document.createElement("div");
  flash.style.position = "absolute";
  flash.style.inset = "0";
  flash.style.background = palette.paper;
  flash.style.opacity = "0";
  flash.style.pointerEvents = "none";
  frame.append(svgHolder, flash);
  el.replaceChildren(frame);
  const bounds = engine2.getBounds(20);
  const viewBox = [bounds.x, bounds.y, bounds.w, bounds.h];
  const render2 = (distance) => {
    engine2.setCamera({ type: "perspective", position: [0, -2.4], distance });
    mountSvgMarkup(svgHolder, engine2.toSVG({ viewBox }));
  };
  render2(FAR_DISTANCE);
  let animations = [];
  const play = () => {
    if (reducedMotion) return;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    flash.style.opacity = "0";
    render2(FAR_DISTANCE);
    const state = { distance: FAR_DISTANCE };
    let lastRender = 0;
    animations.push(
      animate(state, {
        distance: NEAR_DISTANCE,
        duration: 540,
        ease: "inQuad",
        onUpdate: () => {
          const now2 = performance.now();
          if (now2 - lastRender < RENDER_INTERVAL_MS) return;
          lastRender = now2;
          render2(state.distance);
        },
        onComplete: () => {
          render2(NEAR_DISTANCE);
          animations.push(animate(flash, { opacity: [0.85, 0], duration: 320, ease: "outQuad" }));
        }
      })
    );
  };
  play();
  return {
    cleanup() {
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    },
    play
  };
}
var meta19, WIDTH2, HEIGHT2, DEPTH3, FAR_DISTANCE, NEAR_DISTANCE, RENDER_INTERVAL_MS;
var init_tunnel_warp = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/tunnel_warp.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta19 = {
      id: "tunnel-warp",
      name: "Tunnel Warp",
      class: "transition",
      tags: ["entrance", "camera", "depth"],
      productUse: "Entering the app; a fast camera push through a voxel chamber, under 600 ms.",
      budget: { maxFaces: 1500, maxMountMs: 60, idleLoop: "none" }
    };
    WIDTH2 = 9;
    HEIGHT2 = 5;
    DEPTH3 = 14;
    FAR_DISTANCE = 8.4;
    NEAR_DISTANCE = 3.2;
    RENDER_INTERVAL_MS = 1e3 / 24;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/curtain_slats.ts
var curtain_slats_exports = {};
__export(curtain_slats_exports, {
  meta: () => meta20,
  mount: () => mount20
});
function mount20(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 13,
    camera: { type: "oblique", angle: 315, distance: 12 }
  });
  const goldEdge = shade(palette.gold, -0.15);
  const slatTone = (color) => ({
    top: { fill: shade(color, 0.18), stroke: goldEdge, strokeWidth: 0.5 },
    front: { fill: shade(color, -0.16), stroke: goldEdge, strokeWidth: 0.5 },
    right: { fill: shade(color, -0.16), stroke: goldEdge, strokeWidth: 0.5 },
    default: { fill: color, stroke: goldEdge, strokeWidth: 0.5 }
  });
  for (let slat = 0; slat < SLATS; slat += 1) {
    engine2.addGeometry({
      type: "box",
      position: [slat - 3, 1 - SLAT_HEIGHT, 0],
      size: [1, SLAT_HEIGHT, 1],
      meta: { slat },
      style: slatTone(slat % 2 === 0 ? palette.ink : palette.charcoal)
    });
  }
  engine2.addGeometry({
    type: "box",
    position: [0, -4, 2],
    size: [1, 2, 1],
    meta: { part: "reveal" },
    style: voxelTone(palette.gold)
  });
  el.classList.add("rg-collateral-host", "rg-collateral-replayable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 22 }));
  const slatFaces = [];
  for (let slat = 0; slat < SLATS; slat += 1) {
    slatFaces.push(facesByMeta(el, "slat", String(slat)));
  }
  const revealFaces = facesByMeta(el, "part", "reveal");
  const setOpenState = (open) => {
    slatFaces.forEach((faces, slat) => {
      for (const face of faces) {
        face.style.opacity = open ? "0.12" : "1";
        face.style.transform = open ? `translateX(${(slat - 3) * 4 + 13}px) rotate(-14deg)` : "";
      }
    });
    for (const face of revealFaces) {
      face.style.opacity = open ? "1" : "0";
    }
  };
  let timeline = null;
  const play = () => {
    timeline?.cancel();
    timeline = null;
    if (reducedMotion) {
      setOpenState(true);
      return;
    }
    setOpenState(false);
    timeline = createTimeline();
    slatFaces.forEach((faces, slat) => {
      timeline?.add(
        faces,
        {
          opacity: 0.12,
          translateX: (slat - 3) * 4 + 13,
          rotate: -14,
          duration: 380,
          ease: "inOutQuad"
        },
        slat * 90
      );
    });
    timeline.add(
      revealFaces,
      { opacity: [0, 1], scale: [0.6, 1], duration: 420, delay: stagger(30), ease: "outBack" },
      SLATS * 90 + 160
    );
  };
  if (reducedMotion) {
    setOpenState(true);
  } else {
    setOpenState(false);
  }
  return {
    cleanup() {
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta20, SLATS, SLAT_HEIGHT;
var init_curtain_slats = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/curtain_slats.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta20 = {
      id: "curtain-slats",
      name: "Curtain Slats",
      class: "transition",
      tags: ["modal", "reveal", "drawer"],
      productUse: "Modal and drawer reveals; vertical voxel slats rotate open in sequence.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    };
    SLATS = 7;
    SLAT_HEIGHT = 8;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/logo_scatter_handoff.ts
var logo_scatter_handoff_exports = {};
__export(logo_scatter_handoff_exports, {
  meta: () => meta21,
  mount: () => mount21
});
function scatterFor3(seed) {
  const angle = seed * 137.508 % 360;
  const radius = 26 + seed * 71 % 22;
  return {
    dx: Math.cos(angle * Math.PI / 180) * radius,
    dy: Math.sin(angle * Math.PI / 180) * radius
  };
}
function mount21(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } });
  const crownGrid = [];
  let voxelIndex = 0;
  for (const [x2, height] of CROWN_COLUMNS2) {
    for (let y2 = 0; y2 < height; y2 += 1) {
      engine2.addGeometry({
        type: "box",
        position: [x2 - 3, -y2, 0],
        size: [1, 1, 1],
        meta: { part: "crown", vox: voxelIndex },
        style: voxelTone(y2 === height - 1 ? palette.gold : palette.ink)
      });
      crownGrid.push({ x: x2 - 3, y: -y2 });
      voxelIndex += 1;
    }
  }
  el.classList.add("rg-collateral-host", "rg-collateral-replayable");
  mountSvgMarkup(el, engine2.toSVG({ padding: 26 }));
  const targetsByVox = /* @__PURE__ */ new Map();
  crownGrid.forEach((grid2, vox) => {
    const slot = vox % 9;
    const sealX = slot % 3 - 1;
    const sealY = -Math.floor(slot / 3);
    targetsByVox.set(vox, {
      scatter: scatterFor3(vox),
      seal: { dx: (sealX - grid2.x) * UNIT_PX, dy: (sealY - grid2.y) * UNIT_PX }
    });
  });
  const faces = Array.from(el.querySelectorAll("[data-vox]"));
  const targetsOf = (target) => targetsByVox.get(Number(target.dataset.vox ?? "0")) ?? {
    scatter: { dx: 0, dy: 0 },
    seal: { dx: 0, dy: 0 }
  };
  const applyArrangement = (arrangement2) => {
    for (const face of faces) {
      const targets = targetsOf(face);
      face.style.opacity = "1";
      face.style.transform = arrangement2 === "crown" ? "translate(0px, 0px)" : `translate(${targets.seal.dx.toFixed(1)}px, ${targets.seal.dy.toFixed(1)}px)`;
    }
  };
  let arrangement = "crown";
  let timeline = null;
  const play = () => {
    const from = arrangement;
    const to = arrangement === "crown" ? "seal" : "crown";
    arrangement = to;
    timeline?.cancel();
    timeline = null;
    if (reducedMotion) {
      applyArrangement(to);
      return;
    }
    applyArrangement(from);
    timeline = createTimeline();
    timeline.add(faces, {
      opacity: 0.2,
      translateX: (target) => targetsOf(target).scatter.dx,
      translateY: (target) => targetsOf(target).scatter.dy,
      duration: 380,
      delay: stagger(8),
      ease: "inQuad"
    });
    timeline.add(
      faces,
      {
        opacity: 1,
        translateX: (target) => to === "crown" ? 0 : targetsOf(target).seal.dx,
        translateY: (target) => to === "crown" ? 0 : targetsOf(target).seal.dy,
        duration: 460,
        delay: stagger(8),
        ease: "outBack"
      },
      400
    );
  };
  applyArrangement("crown");
  return {
    cleanup() {
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host", "rg-collateral-replayable");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta21, CROWN_COLUMNS2, UNIT_PX;
var init_logo_scatter_handoff = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/logo_scatter_handoff.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta21 = {
      id: "logo-scatter-handoff",
      name: "Scatter Handoff",
      class: "transition",
      tags: ["hero", "scroll", "logo"],
      productUse: "Hero-to-content handoff; the mark scatters into depth and regroups as the next section's sigil.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    };
    CROWN_COLUMNS2 = [
      [0, 3],
      [1, 2],
      [2, 4],
      [3, 3],
      [4, 4],
      [5, 2],
      [6, 3]
    ];
    UNIT_PX = 15;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/confetti_voxelburst.ts
var confetti_voxelburst_exports = {};
__export(confetti_voxelburst_exports, {
  meta: () => meta22,
  mount: () => mount22
});
function clusterPoints() {
  const points = [];
  for (let x2 = -2; x2 <= 2; x2 += 1) {
    for (let y2 = -2; y2 <= 2; y2 += 1) {
      for (let z = -2; z <= 2; z += 1) {
        if (x2 * x2 + y2 * y2 + z * z <= 5) points.push([x2, y2, z]);
      }
    }
  }
  return points;
}
function mount22(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 12, camera: { type: "oblique", angle: 315, distance: 12 } });
  const colors = [palette.gold, palette.gold, palette.paper, palette.positive];
  engine2.batch(() => {
    clusterPoints().forEach(([x2, y2, z], p2) => {
      engine2.addGeometry({
        type: "box",
        position: [x2, y2, z],
        size: [1, 1, 1],
        opaque: false,
        meta: { p: p2 },
        style: voxelTone(colors[p2 % colors.length])
      });
    });
  });
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 26 }));
  const targets = Array.from(el.querySelectorAll("[data-p]")).map((element) => ({
    element,
    index: Number(element.dataset.p ?? "0")
  }));
  const elements = targets.map((target) => target.element);
  let animations = [];
  let autoPlayId = null;
  function play() {
    if (reducedMotion) return;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    index$2.set(elements, { translateX: 0, translateY: 0, rotate: 0, opacity: 1 });
    for (const { element, index } of targets) {
      const angle = index * 137.508 * Math.PI / 180;
      const spread = 26 + index * 53 % 34;
      const dx = Math.cos(angle) * spread;
      const up = 18 + index * 31 % 22;
      const fall = 34 + index * 17 % 26;
      animations.push(
        animate(element, {
          translateX: [
            { to: dx * 0.6, duration: 320, ease: "outQuad" },
            { to: dx, duration: 560, ease: "linear" }
          ],
          translateY: [
            { to: -up, duration: 320, ease: "outQuad" },
            { to: fall, duration: 560, ease: "inQuad" }
          ],
          rotate: index % 2 === 0 ? 28 : -24,
          opacity: [
            { to: 1, duration: 540, ease: "linear" },
            { to: 0, duration: 340, ease: "outQuad" }
          ],
          duration: 880
        })
      );
    }
  }
  if (!reducedMotion) {
    autoPlayId = window.setTimeout(() => {
      autoPlayId = null;
      play();
    }, 400);
  }
  return {
    cleanup() {
      if (autoPlayId !== null) {
        window.clearTimeout(autoPlayId);
        autoPlayId = null;
      }
      animations.forEach((animation) => animation.cancel());
      animations = [];
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animations.forEach((animation) => animation.pause());
    },
    resume() {
      animations.forEach((animation) => animation.play());
    },
    play
  };
}
var meta22;
var init_confetti_voxelburst = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/confetti_voxelburst.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    meta22 = {
      id: "confetti-voxelburst",
      name: "Voxel Burst",
      class: "celebration",
      tags: ["success", "confetti", "one-shot"],
      productUse: "Success moments (claimed, minted, launched); a one-shot burst of brand-colored voxels.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    };
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/gavel_strike.ts
var gavel_strike_exports = {};
__export(gavel_strike_exports, {
  meta: () => meta23,
  mount: () => mount23
});
function mount23(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: TILE4, camera: { type: "oblique", angle: 315, distance: 14 } });
  const ringStyle = (intensity) => ({
    default: {
      fill: shade(palette.gold, intensity),
      opacity: 0,
      stroke: shade(palette.gold, -0.2),
      strokeWidth: 0.5
    }
  });
  engine2.batch(() => {
    engine2.addGeometry({
      type: "box",
      position: [-2, 0, -2],
      size: [4, 1, 4],
      meta: { part: "podium" },
      style: voxelTone(palette.ink)
    });
    engine2.addGeometry({
      type: "box",
      position: [-4, 0, -4],
      size: [8, 1, 8],
      meta: { ring: 1 },
      opaque: false,
      style: ringStyle(0.08)
    });
    engine2.removeGeometry({ type: "box", position: [-3, 0, -3], size: [6, 1, 6] });
    engine2.addGeometry({
      type: "box",
      position: [-6, 0, -6],
      size: [12, 1, 12],
      meta: { ring: 2 },
      opaque: false,
      style: ringStyle(-0.12)
    });
    engine2.removeGeometry({ type: "box", position: [-5, 0, -5], size: [10, 1, 10] });
    engine2.addGeometry({
      type: "box",
      position: [-2, -6, -1],
      size: [3, 2, 2],
      meta: { part: "gavel" },
      style: voxelTone(palette.charcoal)
    });
    engine2.addGeometry({
      type: "line",
      from: [1, -5, 0],
      to: [4, -5, 0],
      meta: { part: "gavel" },
      style: voxelTone(palette.gold)
    });
  });
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 20 }));
  const gavelFaces = facesByMeta(el, "part", "gavel");
  const podiumFaces = facesByMeta(el, "part", "podium");
  const ring1Faces = facesByMeta(el, "ring", "1");
  const ring2Faces = facesByMeta(el, "ring", "2");
  for (const face of [...ring1Faces, ...ring2Faces]) {
    face.style.setProperty("transform-box", "fill-box");
    face.style.setProperty("transform-origin", "50% 50%");
  }
  let timeline = null;
  let autoPlayId = null;
  function play() {
    if (reducedMotion) return;
    timeline?.cancel();
    index$2.set(gavelFaces, { translateY: 0 });
    index$2.set([...ring1Faces, ...ring2Faces], { opacity: 0, scale: 0.7 });
    const next = createTimeline();
    next.add(gavelFaces, { translateY: DROP_PX, duration: 140, ease: "inQuad" }, 0);
    next.add(
      ring1Faces,
      { opacity: [0, 0.9, 0], scale: [0.7, 1.25], duration: 620, ease: "outQuad", delay: stagger(4) },
      140
    );
    next.add(
      ring2Faces,
      { opacity: [0, 0.7, 0], scale: [0.7, 1.3], duration: 680, ease: "outQuad", delay: stagger(4) },
      240
    );
    next.add(podiumFaces, { opacity: [1, 0.72, 1], duration: 260, ease: "outQuad" }, 140);
    next.add(gavelFaces, { translateY: 0, duration: 460, ease: "outQuad" }, 430);
    timeline = next;
  }
  if (!reducedMotion) {
    autoPlayId = window.setTimeout(() => {
      autoPlayId = null;
      play();
    }, 400);
  }
  return {
    cleanup() {
      if (autoPlayId !== null) {
        window.clearTimeout(autoPlayId);
        autoPlayId = null;
      }
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta23, TILE4, DROP_PX;
var init_gavel_strike = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/gavel_strike.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta23 = {
      id: "gavel-strike",
      name: "Gavel Strike",
      class: "celebration",
      tags: ["auction", "won", "impact"],
      productUse: "Auction won; a voxel gavel strikes and a shockwave ring ripples out.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    };
    TILE4 = 12;
    DROP_PX = TILE4 * 3;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/crown_coronation.ts
var crown_coronation_exports = {};
__export(crown_coronation_exports, {
  meta: () => meta24,
  mount: () => mount24
});
function mount24(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: 15, camera: { type: "oblique", angle: 315, distance: 12 } });
  const crownStyle = (color) => {
    const tone = voxelTone(color);
    const styled = {};
    for (const [face, fill] of Object.entries(tone)) {
      styled[face] = { ...fill, stroke: palette.gold, strokeWidth: 0.5, strokeOpacity: REST_STROKE_OPACITY2 };
    }
    return styled;
  };
  let voxelIndex = 0;
  engine2.batch(() => {
    CROWN_COLUMNS3.forEach(([x2, height], col) => {
      for (let y2 = height - 1; y2 >= 0; y2 -= 1) {
        engine2.addGeometry({
          type: "box",
          position: [x2 - 3, -y2, 0],
          size: [1, 1, 1],
          meta: { vox: voxelIndex, col },
          style: crownStyle(y2 === height - 1 ? palette.gold : palette.ink)
        });
        voxelIndex += 1;
      }
    });
  });
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 24 }));
  const fallOrder = [];
  for (let vox = 0; vox < voxelIndex; vox += 1) {
    fallOrder.push(...facesByMeta(el, "vox", String(vox)));
  }
  const columnFaces = CROWN_COLUMNS3.map((_2, col) => facesByMeta(el, "col", String(col)));
  let timeline = null;
  let autoPlayId = null;
  function play() {
    if (reducedMotion) return;
    timeline?.cancel();
    index$2.set(fallOrder, { translateY: FALL_FROM_PX, opacity: 0, strokeOpacity: REST_STROKE_OPACITY2 });
    const fallDuration = 460;
    const fallStep = 9;
    const fallEnd = fallDuration + fallStep * Math.max(0, fallOrder.length - 1);
    const next = createTimeline();
    next.add(
      fallOrder,
      {
        translateY: [FALL_FROM_PX, 0],
        opacity: [0, 1],
        duration: fallDuration,
        delay: stagger(fallStep),
        ease: "outBack"
      },
      0
    );
    columnFaces.forEach((faces, col) => {
      next.add(
        faces,
        { strokeOpacity: [REST_STROKE_OPACITY2, 1, REST_STROKE_OPACITY2], duration: 340, ease: "inOutSine" },
        fallEnd + col * 55
      );
    });
    timeline = next;
  }
  if (!reducedMotion) {
    index$2.set(fallOrder, { opacity: 0 });
    autoPlayId = window.setTimeout(() => {
      autoPlayId = null;
      play();
    }, 400);
  }
  return {
    cleanup() {
      if (autoPlayId !== null) {
        window.clearTimeout(autoPlayId);
        autoPlayId = null;
      }
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta24, CROWN_COLUMNS3, REST_STROKE_OPACITY2, FALL_FROM_PX;
var init_crown_coronation = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/crown_coronation.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta24 = {
      id: "crown-coronation",
      name: "Coronation",
      class: "celebration",
      tags: ["onboarding", "complete", "crown"],
      productUse: "Onboarding and formation complete; a crown assembles from falling voxels with a gold sheen.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    };
    CROWN_COLUMNS3 = [
      [0, 3],
      [1, 2],
      [2, 4],
      [3, 3],
      [4, 4],
      [5, 2],
      [6, 3]
    ];
    REST_STROKE_OPACITY2 = 0.35;
    FALL_FROM_PX = -30;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/vault_jackpot.ts
var vault_jackpot_exports = {};
__export(vault_jackpot_exports, {
  meta: () => meta25,
  mount: () => mount25
});
function mount25(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, { tile: TILE5, camera: { type: "oblique", angle: 315, distance: 14 } });
  const coinStyle = () => {
    const tone = voxelTone(palette.gold);
    const hidden = {};
    for (const [face, fill] of Object.entries(tone)) {
      hidden[face] = { ...fill, opacity: 0 };
    }
    return hidden;
  };
  engine2.batch(() => {
    engine2.addGeometry({
      type: "box",
      position: [-3, 1, -3],
      size: [7, 1, 7],
      meta: { part: "plinth" },
      style: voxelTone(shade(palette.olive, 0.2))
    });
    engine2.addGeometry({
      type: "box",
      position: [-2, -4, -2],
      size: [5, 5, 5],
      meta: { part: "vault" },
      style: voxelTone(palette.ink)
    });
    engine2.removeGeometry({ type: "box", position: [-1, -3, -1], size: [3, 3, 3] });
    engine2.removeGeometry({ type: "box", position: [-1, -3, -2], size: [3, 3, 1] });
    COIN_SLOTS.forEach(([x2, y2, z], coin) => {
      engine2.addGeometry({
        type: "box",
        position: [x2, y2, z],
        size: [1, 1, 1],
        opaque: false,
        meta: { coin },
        style: coinStyle()
      });
    });
    engine2.addGeometry({
      type: "box",
      position: [-1, -3, -2],
      size: [3, 3, 1],
      opaque: false,
      meta: { part: "door" },
      style: {
        top: { fill: shade(palette.ink, 0.22), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 },
        left: { fill: shade(palette.ink, 0.08), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 },
        default: { fill: shade(palette.ink, -0.08), stroke: shade(palette.gold, -0.25), strokeWidth: 0.6 }
      }
    });
  });
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 20 }));
  const doorFaces = facesByMeta(el, "part", "door");
  for (const face of doorFaces) {
    face.style.setProperty("transform-box", "fill-box");
    face.style.setProperty("transform-origin", "50% 50%");
  }
  const coinFaces = [];
  for (let coin = 0; coin < COIN_COUNT; coin += 1) {
    coinFaces.push(facesByMeta(el, "coin", String(coin)));
  }
  const allCoinFaces = coinFaces.flat();
  let timeline = null;
  let autoPlayId = null;
  function play() {
    if (reducedMotion) return;
    timeline?.cancel();
    index$2.set(doorFaces, { translateX: 0, skewY: 0, opacity: 1 });
    index$2.set(allCoinFaces, { translateX: 0, translateY: 0, opacity: 0 });
    const next = createTimeline();
    next.add(
      doorFaces,
      { translateX: -TILE5 * 1.4, skewY: -9, opacity: 0.22, duration: 340, ease: "inOutQuad" },
      0
    );
    coinFaces.forEach((faces, coin) => {
      if (faces.length === 0) return;
      const dx = (coin % 2 === 0 ? 1 : -1) * (10 + coin * 29 % 26);
      const lift = 10 + coin * 13 % 12;
      const drop = 30 + coin * 7 % 14;
      next.add(
        faces,
        {
          translateX: [
            { to: dx * 0.5, duration: 300, ease: "outQuad" },
            { to: dx, duration: 420, ease: "linear" }
          ],
          translateY: [
            { to: -lift, duration: 300, ease: "outQuad" },
            { to: drop, duration: 420, ease: "inQuad" }
          ],
          opacity: [
            { to: 1, duration: 140, ease: "linear" },
            { to: 1, duration: 300, ease: "linear" },
            { to: 0, duration: 280, ease: "outQuad" }
          ],
          duration: 720
        },
        280 + coin * 45
      );
    });
    next.add(doorFaces, { translateX: 0, skewY: 0, opacity: 1, duration: 320, ease: "outQuad" }, 1480);
    timeline = next;
  }
  if (!reducedMotion) {
    autoPlayId = window.setTimeout(() => {
      autoPlayId = null;
      play();
    }, 400);
  }
  return {
    cleanup() {
      if (autoPlayId !== null) {
        window.clearTimeout(autoPlayId);
        autoPlayId = null;
      }
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    },
    play
  };
}
var meta25, TILE5, COIN_COUNT, COIN_SLOTS;
var init_vault_jackpot = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/vault_jackpot.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta25 = {
      id: "vault-jackpot",
      name: "Vault Jackpot",
      class: "celebration",
      tags: ["rewards", "claim", "payout"],
      productUse: "Rewards claimed; vault doors swing open and gold voxels spill out.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    };
    TILE5 = 13;
    COIN_COUNT = 12;
    COIN_SLOTS = [
      [-1, -1, -1],
      [0, -1, -1],
      [1, -1, -1],
      [-1, -1, 0],
      [0, -1, 0],
      [1, -1, 0],
      [-1, -1, 1],
      [0, -1, 1],
      [1, -1, 1],
      [-1, -2, 0],
      [0, -2, -1],
      [1, -2, 0]
    ];
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/stack_build_loader.ts
var stack_build_loader_exports = {};
__export(stack_build_loader_exports, {
  meta: () => meta26,
  mount: () => mount26
});
function mount26(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 16,
    camera: { type: "oblique", angle: 315, distance: 12 }
  });
  for (let step = 0; step < STEPS; step += 1) {
    engine2.addGeometry({
      type: "box",
      position: [-1, -step, -1],
      size: [3, 1, 3],
      meta: { step },
      style: voxelTone(step === STEPS - 1 ? palette.gold : palette.ink)
    });
  }
  el.classList.add("rg-collateral-host");
  mountSvgMarkup(el, engine2.toSVG({ padding: 20 }));
  let timeline = null;
  if (!reducedMotion) {
    const stepFaces = [];
    for (let step = 0; step < STEPS; step += 1) {
      stepFaces.push(facesByMeta(el, "step", String(step)));
    }
    stepFaces.forEach((faces) => index$2.set(faces, { opacity: 0 }));
    timeline = createTimeline({ loop: true });
    for (let step = 0; step < STEPS; step += 1) {
      timeline.add(
        stepFaces[step],
        { opacity: [0, 1], duration: STEP_MS, delay: stagger(8), ease: "outQuad" },
        step * STEP_MS
      );
    }
    const unbuildStart = STEPS * STEP_MS + 200;
    for (let i2 = 0; i2 < STEPS; i2 += 1) {
      timeline.add(
        stepFaces[STEPS - 1 - i2],
        { opacity: [1, 0], duration: STEP_MS, delay: stagger(8), ease: "inQuad" },
        unbuildStart + i2 * STEP_MS
      );
    }
  }
  return {
    cleanup() {
      timeline?.cancel();
      timeline = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      timeline?.pause();
    },
    resume() {
      timeline?.play();
    }
  };
}
var meta26, STEPS, STEP_MS;
var init_stack_build_loader = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/stack_build_loader.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta26 = {
      id: "stack-build-loader",
      name: "Stack Build Loader",
      class: "loading",
      tags: ["loading", "indeterminate", "loop"],
      productUse: "Indeterminate loading; a small voxel column builds and unbuilds in a calm loop.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "raf" }
    };
    STEPS = 5;
    STEP_MS = 200;
  }
});

// ../../design-system/regent_ui/assets/js/collateral/experiments/progress_ring.ts
var progress_ring_exports = {};
__export(progress_ring_exports, {
  meta: () => meta27,
  mount: () => mount27
});
function normalizeProgress(data) {
  const candidate = data?.progress;
  const progress = typeof candidate === "number" && Number.isFinite(candidate) ? candidate : 0.7;
  return Math.min(1, Math.max(0, progress));
}
function segmentPosition(index) {
  const angle = index / SEGMENTS * Math.PI * 2 - Math.PI / 2;
  return [Math.round(Math.cos(angle) * RADIUS), 0, Math.round(Math.sin(angle) * RADIUS)];
}
function mount27(ctx) {
  const { el, Heerich, reducedMotion } = ctx;
  const palette = paletteFrom(el);
  const engine2 = createEngine(Heerich, {
    tile: 13,
    camera: { type: "oblique", angle: 315, distance: 14 }
  });
  el.classList.add("rg-collateral-host");
  let animation = null;
  let filled = 0;
  const ghostStyle = {
    default: {
      fill: palette.olive,
      fillOpacity: 0.25,
      stroke: shade(palette.olive, -0.15),
      strokeOpacity: 0.45,
      strokeWidth: 0.4
    }
  };
  function render2(progress) {
    animation?.cancel();
    animation = null;
    const nextFilled = Math.round(progress * SEGMENTS);
    engine2.clear();
    for (let seg = 0; seg < SEGMENTS; seg += 1) {
      engine2.addGeometry({
        type: "box",
        position: segmentPosition(seg),
        size: [1, 1, 1],
        meta: { seg },
        style: seg < nextFilled ? voxelTone(palette.gold) : ghostStyle
      });
    }
    mountSvgMarkup(el, engine2.toSVG({ padding: 16 }));
    if (!reducedMotion && nextFilled > filled) {
      const newFaces = [];
      for (let seg = filled; seg < nextFilled; seg += 1) {
        newFaces.push(...facesByMeta(el, "seg", String(seg)));
      }
      animation = animate(newFaces, {
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 360,
        delay: stagger(40),
        ease: "outBack"
      });
    }
    filled = nextFilled;
  }
  render2(normalizeProgress(ctx.data));
  return {
    cleanup() {
      animation?.cancel();
      animation = null;
      el.classList.remove("rg-collateral-host");
      el.replaceChildren();
    },
    pause() {
      animation?.pause();
    },
    resume() {
      animation?.play();
    },
    update(data) {
      render2(normalizeProgress(data));
    }
  };
}
var meta27, SEGMENTS, RADIUS;
var init_progress_ring = __esm({
  "../../design-system/regent_ui/assets/js/collateral/experiments/progress_ring.ts"() {
    init_anime_esm();
    init_svg_mount();
    init_engine();
    init_svg_anim();
    meta27 = {
      id: "progress-ring",
      name: "Progress Ring",
      class: "loading",
      tags: ["loading", "determinate", "ring"],
      productUse: "Determinate progress; a ring of voxels fills clockwise toward completion.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    };
    SEGMENTS = 16;
    RADIUS = 5;
  }
});

// node_modules/heerich/dist/heerich.js
var e = 1e-4;
var t = class {
  constructor(e4 = 50) {
    this.nodes = [], this.cellSize = e4, this.grid = /* @__PURE__ */ new Map();
  }
  _cellKeys(e4, t2, n2, r2) {
    let i2 = this.cellSize, a2 = Math.floor(e4 / i2), o2 = Math.floor(t2 / i2), s2 = Math.floor(n2 / i2), c2 = Math.floor(r2 / i2), l2 = [];
    for (let e5 = a2; e5 <= s2; e5++) for (let t3 = o2; t3 <= c2; t3++) l2.push(e5 << 16 ^ t3);
    return l2;
  }
  getOverlapping(e4, t2, n2, r2) {
    let i2 = [], a2 = /* @__PURE__ */ new Set(), o2 = this._cellKeys(e4, t2, n2, r2);
    for (let s2 = 0; s2 < o2.length; s2++) {
      let c2 = this.grid.get(o2[s2]);
      if (c2) for (let o3 = 0; o3 < c2.length; o3++) {
        let s3 = c2[o3];
        if (a2.has(s3)) continue;
        a2.add(s3);
        let l2 = this.nodes[s3];
        n2 < l2.bounds.minX || e4 > l2.bounds.maxX || r2 < l2.bounds.minY || t2 > l2.bounds.maxY || i2.push(l2.poly);
      }
    }
    return i2;
  }
  clip(t2) {
    let n2 = [t2];
    for (let e4 of this.nodes) {
      if (n2.length === 0) return [];
      let t3 = [], r2 = e4.poly, i2 = e4.bounds;
      for (let e5 of n2) {
        let n3 = Infinity, a2 = Infinity, o2 = -Infinity, s2 = -Infinity;
        for (let t4 = 0; t4 < e5.length; t4++) {
          let r3 = e5[t4];
          r3[0] < n3 && (n3 = r3[0]), r3[1] < a2 && (a2 = r3[1]), r3[0] > o2 && (o2 = r3[0]), r3[1] > s2 && (s2 = r3[1]);
        }
        if (o2 < i2.minX || n3 > i2.maxX || s2 < i2.minY || a2 > i2.maxY) {
          t3.push(e5);
          continue;
        }
        let c2 = this.subtractConvex(e5, r2);
        t3.push(...c2);
      }
      n2 = t3;
    }
    return n2.filter((t3) => this.calcArea(t3) > e);
  }
  insert(t2, n2, r2, i2, a2) {
    let o2 = this.calcSignedArea(t2);
    if (Math.abs(o2) < e) return;
    let s2 = t2;
    if (o2 > 0 && (s2 = [...t2].reverse()), n2 === void 0) {
      n2 = Infinity, r2 = Infinity, i2 = -Infinity, a2 = -Infinity;
      for (let e4 = 0; e4 < s2.length; e4++) {
        let t3 = s2[e4];
        t3[0] < n2 && (n2 = t3[0]), t3[1] < r2 && (r2 = t3[1]), t3[0] > i2 && (i2 = t3[0]), t3[1] > a2 && (a2 = t3[1]);
      }
    }
    this.nodes.push({
      poly: s2,
      bounds: {
        minX: n2,
        minY: r2,
        maxX: i2,
        maxY: a2
      }
    });
    let c2 = this.nodes.length - 1, l2 = this._cellKeys(n2, r2, i2, a2);
    for (let e4 = 0; e4 < l2.length; e4++) {
      let t3 = l2[e4], n3 = this.grid.get(t3);
      n3 || (n3 = [], this.grid.set(t3, n3)), n3.push(c2);
    }
  }
  subtractConvex(t2, n2) {
    let r2 = [], i2 = t2;
    for (let t3 = 0; t3 < n2.length && !(!i2 || i2.length < 3); t3++) {
      let a2 = n2[t3], o2 = n2[(t3 + 1) % n2.length], s2 = this.splitPolygonByLine(i2, a2, o2);
      s2.front && s2.front.length > 2 && this.calcArea(s2.front) > e && r2.push(s2.front), i2 = s2.back && s2.back.length > 2 ? s2.back : null;
    }
    return r2;
  }
  splitPolygonByLine(t2, n2, r2) {
    let i2 = [], a2 = [], o2 = (t3) => {
      let i3 = (r2[0] - n2[0]) * (t3[1] - n2[1]) - (r2[1] - n2[1]) * (t3[0] - n2[0]);
      return i3 > e ? 1 : i3 < -e ? -1 : 0;
    }, s2 = t2[t2.length - 1], c2 = o2(s2);
    for (let e4 = 0; e4 < t2.length; e4++) {
      let l2 = t2[e4], u2 = o2(l2);
      if (u2 > 0) {
        if (c2 < 0) {
          let e5 = this.lineIntersect(n2, r2, s2, l2);
          e5 && (i2.push(e5), a2.push(e5));
        }
        i2.push(l2);
      } else if (u2 < 0) {
        if (c2 > 0) {
          let e5 = this.lineIntersect(n2, r2, s2, l2);
          e5 && (i2.push(e5), a2.push(e5));
        }
        a2.push(l2);
      } else i2.push(l2), a2.push(l2);
      s2 = l2, c2 = u2;
    }
    return {
      front: i2,
      back: a2
    };
  }
  lineIntersect(t2, n2, r2, i2) {
    let a2 = n2[0] - t2[0], o2 = n2[1] - t2[1], s2 = i2[0] - r2[0], c2 = i2[1] - r2[1], l2 = a2 * c2 - o2 * s2;
    if (Math.abs(l2) < e) return null;
    let u2 = r2[0] - t2[0], d2 = r2[1] - t2[1], f2 = (u2 * c2 - d2 * s2) / l2;
    return [t2[0] + f2 * a2, t2[1] + f2 * o2];
  }
  calcSignedArea(e4) {
    let t2 = 0;
    for (let n2 = 0; n2 < e4.length; n2++) {
      let r2 = e4[n2], i2 = e4[(n2 + 1) % e4.length];
      t2 += r2[0] * i2[1] - i2[0] * r2[1];
    }
    return t2 / 2;
  }
  calcArea(e4) {
    return Math.abs(this.calcSignedArea(e4));
  }
};
var n = /([MLHVCSQTZAmlhvcsqtza])/;
var r = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;
function i(e4) {
  let t2 = [], n2;
  for (r.lastIndex = 0; (n2 = r.exec(e4)) !== null; ) t2.push(parseFloat(n2[0]));
  return t2;
}
function a(e4) {
  let t2 = e4.split(n).filter(Boolean), r2 = [];
  for (let e5 = 0; e5 < t2.length; e5++) {
    let a2 = t2[e5].trim();
    a2 && n.test(a2) && a2.length === 1 && (r2.push({
      cmd: a2,
      args: i(t2[e5 + 1] || "")
    }), e5++);
  }
  return r2;
}
var o = Math.PI * 2;
function s(e4, t2, n2, r2, i2, a2, s2, c2, l2) {
  if (n2 === 0 || r2 === 0) return [[
    e4,
    t2,
    c2,
    l2,
    c2,
    l2
  ]];
  let u2 = Math.sin(i2), d2 = Math.cos(i2), f2 = (e4 - c2) / 2, p2 = (t2 - l2) / 2, m2 = d2 * f2 + u2 * p2, h2 = -u2 * f2 + d2 * p2, g2 = n2 * n2, _2 = r2 * r2, v2 = m2 * m2, y2 = h2 * h2, b2 = v2 / g2 + y2 / _2;
  if (b2 > 1) {
    let e5 = Math.sqrt(b2);
    n2 *= e5, r2 *= e5, g2 = n2 * n2, _2 = r2 * r2;
  }
  let x2 = (g2 * _2 - g2 * y2 - _2 * v2) / (g2 * y2 + _2 * v2);
  x2 < 0 && (x2 = 0);
  let S2 = Math.sqrt(x2);
  a2 === s2 && (S2 = -S2);
  let C2 = S2 * n2 * h2 / r2, w2 = -S2 * r2 * m2 / n2, T2 = Math.atan2((h2 - w2) / r2, (m2 - C2) / n2), E2 = Math.atan2((-h2 - w2) / r2, (-m2 - C2) / n2) - T2;
  !s2 && E2 > 0 ? E2 -= o : s2 && E2 < 0 && (E2 += o);
  let D = Math.max(1, Math.ceil(Math.abs(E2) / (Math.PI / 2))), O = E2 / D, k = [], A = 4 / 3 * Math.tan(O / 4), j = (e4 + c2) / 2 + d2 * C2 - u2 * w2, M = (t2 + l2) / 2 + u2 * C2 + d2 * w2, N = T2;
  for (let e5 = 0; e5 < D; e5++) {
    let t3 = Math.cos(N), i3 = Math.sin(N), a3 = N + O, o2 = Math.cos(a3), s3 = Math.sin(a3), f3 = t3 - A * i3, p3 = i3 + A * t3, m3 = o2 + A * s3, h3 = s3 - A * o2;
    k.push([
      d2 * n2 * f3 - u2 * r2 * p3 + j,
      u2 * n2 * f3 + d2 * r2 * p3 + M,
      d2 * n2 * m3 - u2 * r2 * h3 + j,
      u2 * n2 * m3 + d2 * r2 * h3 + M,
      e5 === D - 1 ? c2 : d2 * n2 * o2 - u2 * r2 * s3 + j,
      e5 === D - 1 ? l2 : u2 * n2 * o2 + d2 * r2 * s3 + M
    ]), N = a3;
  }
  return k;
}
function c(e4) {
  let t2 = a(e4), n2 = [], r2 = 0, i2 = 0, o2 = 0, c2 = 0;
  for (let { cmd: e5, args: a2 } of t2) {
    let t3 = e5.toUpperCase(), l2 = e5 !== t3;
    if (t3 === "Z") {
      n2.push({
        cmd: "Z",
        coords: null
      }), r2 = o2, i2 = c2;
      continue;
    }
    let u2 = t3 === "M" || t3 === "L" ? 2 : t3 === "H" || t3 === "V" ? 1 : t3 === "C" ? 6 : t3 === "S" || t3 === "Q" ? 4 : t3 === "T" ? 2 : t3 === "A" ? 7 : 0;
    if (u2) for (let e6 = 0; e6 < a2.length; e6 += u2) {
      let d2 = a2.slice(e6, e6 + u2);
      if (t3 === "H") {
        let e7 = l2 ? r2 + d2[0] : d2[0];
        n2.push({
          cmd: "L",
          coords: new Float64Array([e7, i2])
        }), r2 = e7;
        continue;
      }
      if (t3 === "V") {
        let e7 = l2 ? i2 + d2[0] : d2[0];
        n2.push({
          cmd: "L",
          coords: new Float64Array([r2, e7])
        }), i2 = e7;
        continue;
      }
      if (t3 === "A") {
        let e7 = l2 ? r2 + d2[5] : d2[5], t4 = l2 ? i2 + d2[6] : d2[6], a3 = s(r2, i2, d2[0], d2[1], d2[2] * Math.PI / 180, d2[3], d2[4], e7, t4);
        for (let e8 of a3) n2.push({
          cmd: "C",
          coords: new Float64Array(e8)
        });
        r2 = e7, i2 = t4;
        continue;
      }
      let f2 = new Float64Array(d2.length);
      for (let e7 = 0; e7 < d2.length; e7 += 2) f2[e7] = l2 ? r2 + d2[e7] : d2[e7], f2[e7 + 1] = l2 ? i2 + d2[e7 + 1] : d2[e7 + 1];
      let p2 = e6 > 0 && t3 === "M" ? "L" : t3;
      n2.push({
        cmd: p2,
        coords: f2
      }), r2 = f2[f2.length - 2], i2 = f2[f2.length - 1], t3 === "M" && e6 === 0 && (o2 = r2, c2 = i2);
    }
  }
  return n2;
}
function l(e4, t2) {
  let n2 = "";
  for (let r2 = 0; r2 < e4.length; r2++) {
    let i2 = e4[r2];
    if (i2.cmd === "Z") {
      n2 += "Z";
      continue;
    }
    let a2 = i2.coords;
    n2 += i2.cmd;
    for (let e5 = 0; e5 < a2.length; e5 += 2) {
      let r3 = a2[e5], i3 = a2[e5 + 1], o2 = 1 - r3, s2 = 1 - i3;
      e5 > 0 && (n2 += " "), n2 += o2 * s2 * t2[0] + r3 * s2 * t2[2] + r3 * i3 * t2[4] + o2 * i3 * t2[6] + " " + (o2 * s2 * t2[1] + r3 * s2 * t2[3] + r3 * i3 * t2[5] + o2 * i3 * t2[7]);
    }
    n2 += " ";
  }
  return n2;
}
function u(e4) {
  let t2 = /(<path\b[^>]*?\bd=(["']))([^"']*?)(\2[^>]*?>)/gi, n2 = [], r2 = 0, i2;
  for (; (i2 = t2.exec(e4)) !== null; ) {
    let a2 = e4.slice(r2, i2.index);
    n2.push({
      before: a2 + i2[1],
      ops: c(i2[3]),
      after: i2[4]
    }), r2 = t2.lastIndex;
  }
  return {
    fragments: n2,
    tail: e4.slice(r2)
  };
}
function d(e4, t2) {
  let n2 = "";
  for (let r2 = 0; r2 < e4.fragments.length; r2++) {
    let i2 = e4.fragments[r2];
    n2 += i2.before + l(i2.ops, t2) + i2.after;
  }
  return n2 + e4.tail;
}
function f(e4) {
  let t2 = [], n2 = null, r2 = /([MLZmlz])([-0-9.e\s]*)/gi, i2;
  for (; (i2 = r2.exec(e4)) !== null; ) {
    let e5 = i2[1].toUpperCase(), r3 = i2[2].trim() ? i2[2].trim().split(/[\s,]+/).filter(Boolean).map(Number) : [];
    e5 === "M" ? (n2 && n2.length && t2.push(n2), n2 = r3.length >= 2 ? [[r3[0], r3[1]]] : []) : e5 === "L" ? n2 && r3.length >= 2 && n2.push([r3[0], r3[1]]) : e5 === "Z" && n2 && n2.length && (t2.push(n2), n2 = null);
  }
  return n2 && n2.length && t2.push(n2), t2;
}
function p(e4, t2, n2, r2, i2) {
  let a2 = [], o2 = i2.length;
  for (let s3 = 0; s3 < o2; s3++) {
    let c2 = i2[s3][0], l2 = i2[s3][1], u2 = i2[(s3 + 1) % o2][0], d2 = i2[(s3 + 1) % o2][1], f2 = u2 - c2, p2 = d2 - l2, m2 = n2 * p2 - r2 * f2;
    if (Math.abs(m2) < 1e-10) continue;
    let h2 = c2 - e4, g2 = l2 - t2, _2 = (h2 * p2 - g2 * f2) / m2, v2 = (h2 * r2 - g2 * n2) / m2;
    v2 >= -1e-10 && v2 < 0.9999999999 && a2.push(_2);
  }
  if (a2.length < 2) return [];
  a2.sort((e5, t3) => e5 - t3);
  let s2 = [];
  for (let i3 = 0; i3 + 1 < a2.length; i3 += 2) {
    let o3 = a2[i3], c2 = a2[i3 + 1];
    c2 - o3 < 1e-10 || s2.push([
      e4 + o3 * n2,
      t2 + o3 * r2,
      e4 + c2 * n2,
      t2 + c2 * r2
    ]);
  }
  return s2;
}
function m(e4, t2, n2, r2) {
  let i2 = t2.angle === void 0 ? 45 : t2.angle, a2 = t2.period === void 0 ? 2 : t2.period;
  if (a2 <= 0) return "";
  let o2 = i2 * Math.PI / 180, s2 = Math.cos(o2), c2 = Math.sin(o2), l2 = n2 ? f(n2) : [[
    [e4[0], e4[1]],
    [e4[2], e4[3]],
    [e4[4], e4[5]],
    [e4[6], e4[7]]
  ]], u2 = Infinity, d2 = Infinity, m2 = -Infinity, h2 = -Infinity;
  for (let e5 of l2) for (let [t3, n3] of e5) t3 < u2 && (u2 = t3), n3 < d2 && (d2 = n3), t3 > m2 && (m2 = t3), n3 > h2 && (h2 = n3);
  let g2 = [
    u2,
    m2,
    m2,
    u2
  ], _2 = [
    d2,
    d2,
    h2,
    h2
  ], v2 = Infinity, y2 = -Infinity;
  for (let e5 = 0; e5 < 4; e5++) {
    let t3 = -g2[e5] * c2 + _2[e5] * s2;
    t3 < v2 && (v2 = t3), t3 > y2 && (y2 = t3);
  }
  let b2 = ` stroke="${t2.stroke ?? r2?.stroke ?? "currentColor"}" stroke-width="${t2.strokeWidth ?? r2?.strokeWidth ?? 1}" fill="none"${t2.opacity === void 0 ? "" : ` opacity="${t2.opacity}"`}`, x2 = (e5) => Math.round(e5 * 1e4) / 1e4, S2 = "", C2 = Math.ceil(v2 / a2) * a2;
  for (let e5 = C2; e5 <= y2; e5 += a2) {
    let t3 = -e5 * c2, n3 = e5 * s2;
    for (let e6 of l2) {
      let r3 = p(t3, n3, s2, c2, e6);
      for (let [e7, t4, n4, i3] of r3) S2 += `<line x1="${x2(e7)}" y1="${x2(t4)}" x2="${x2(n4)}" y2="${x2(i3)}"${b2}/>`;
    }
  }
  return S2;
}
var h = {};
var g = /* @__PURE__ */ new WeakMap();
var _ = class {
  render(e4, n2 = {}) {
    let r2 = n2.padding || 20, i2 = e4;
    if (n2.occlusion || n2.resolveOcclusion) {
      i2 = [];
      let r3 = [...e4].reverse(), a3 = new t();
      for (let e5 of r3) {
        if (!e5.points) continue;
        let t2 = e5.points.data, r4 = e5.points.length, o3 = [], s3 = Infinity, c3 = Infinity, l3 = -Infinity, u3 = -Infinity;
        for (let e6 = 0; e6 < r4; e6++) {
          let n3 = t2[e6 * 2], r5 = t2[e6 * 2 + 1];
          o3.push([n3, r5]), n3 < s3 && (s3 = n3), r5 < c3 && (c3 = r5), n3 > l3 && (l3 = n3), r5 > u3 && (u3 = r5);
        }
        let d2 = a3.getOverlapping(s3, c3, l3, u3), f3 = true, p3 = null;
        if (d2.length > 0) if (n2.resolveOcclusion) p3 = n2.resolveOcclusion(o3, d2), p3 || (f3 = false);
        else {
          let e6 = a3.clip(o3);
          if (e6.length === 0) f3 = false;
          else {
            let t3 = 0;
            for (let n4 of e6) t3 += a3.calcArea(n4);
            let n3 = a3.calcArea(o3);
            if (t3 < n3 * 0.999) {
              let t4 = "";
              for (let n4 of e6) {
                for (let e7 = 0; e7 < n4.length; e7++) t4 += e7 === 0 ? `M${n4[e7][0]} ${n4[e7][1]}` : `L${n4[e7][0]} ${n4[e7][1]}`;
                t4 += "Z";
              }
              p3 = t4;
            }
          }
        }
        f3 && (a3.insert(o3, s3, c3, l3, u3), p3 && typeof p3 == "string" ? i2.push({
          ...e5,
          _pathD: p3
        }) : i2.push(e5));
      }
      i2.reverse();
    }
    let a2 = v(i2), o2 = n2.viewBox ? n2.viewBox[0] : a2.x - r2, s2 = n2.viewBox ? n2.viewBox[1] : a2.y - r2, c2 = n2.viewBox ? n2.viewBox[2] : a2.w + r2 * 2, l2 = n2.viewBox ? n2.viewBox[3] : a2.h + r2 * 2, u2 = n2.offset || [0, 0], f2 = n2.tileW || 1, p2 = n2.faceAttributes || null, h2 = n2.decals || null, g2 = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o2} ${s2} ${c2} ${l2}" style="width:100%; height:100%;">`];
    n2.prepend && g2.push(n2.prepend), g2.push(`<g transform="translate(${u2[0]}, ${u2[1]})">`);
    for (let e5 = 0; e5 < i2.length; e5++) {
      let t2 = i2[e5];
      if (t2.type === "content") {
        g2.push(`<g transform="translate(${t2._px}, ${t2._py}) scale(${t2._scale})" style="--x:${t2._px};--y:${t2._py};--z:${t2._pos[2]};--scale:${t2._scale};--tile:${f2}">`, t2.content, "</g>");
        continue;
      }
      let n3 = t2.points.data, r3 = t2.voxel, a3 = t2.style, o3 = "";
      if (p2) {
        let e6 = p2(t2);
        if (e6) {
          let t3 = {};
          for (let [n4, r4] of Object.entries(e6)) r4 == null || n4 === "decal" || (n4 === "fill" || n4 === "stroke" || n4 === "strokeWidth" || n4 === "opacity" || n4 === "strokeDasharray" || n4 === "strokeLinecap" || n4 === "strokeLinejoin" || n4 === "fillOpacity" || n4 === "strokeOpacity" ? t3[n4] = r4 : o3 += ` ${n4}="${r4}"`);
          Object.keys(t3).length > 0 && (a3 = {
            ...a3,
            ...t3
          });
        }
      }
      let s3 = "";
      if (r3.meta) for (let [e6, t3] of Object.entries(r3.meta)) s3 += ` data-${e6}="${t3}"`;
      if (t2._pathD ? g2.push(`<path d="${t2._pathD}"${y(a3)} data-voxel="${r3.x},${r3.y},${r3.z}" data-x="${r3.x}" data-y="${r3.y}" data-z="${r3.z}" data-face="${t2.type}"${s3}${o3} />`) : g2.push(`<polygon points="${n3[0]},${n3[1]} ${n3[2]},${n3[3]} ${n3[4]},${n3[5]} ${n3[6]},${n3[7]}"${y(a3)} data-voxel="${r3.x},${r3.y},${r3.z}" data-x="${r3.x}" data-y="${r3.y}" data-z="${r3.z}" data-face="${t2.type}"${s3}${o3} />`), a3 && a3.hatch && g2.push(m(n3, a3.hatch, t2._pathD || null, a3)), a3 && a3.decal && h2) {
        let e6 = a3.decal, t3 = typeof e6 == "string" ? e6 : e6.name, r4 = h2 && h2.get(t3);
        if (r4) {
          let t4 = "";
          typeof e6 == "object" && e6.style && (t4 = y(e6.style));
          let i3 = d(r4._prepared, n3), a4 = t4 + o3;
          a4 ? g2.push(i3.replace(/<path\b/gi, `<path${a4}`)) : g2.push(i3);
        }
      }
    }
    return g2.push("</g>"), n2.append && g2.push(n2.append), g2.push("</svg>"), g2.join("");
  }
};
function v(e4) {
  let t2 = Infinity, n2 = Infinity, r2 = -Infinity, i2 = -Infinity;
  if (e4.length === 0) return {
    x: 0,
    y: 0,
    w: 100,
    h: 100
  };
  for (let a2 = 0; a2 < e4.length; a2++) {
    let o2 = e4[a2].points.data;
    for (let e5 = 0; e5 < o2.length; e5 += 2) {
      let a3 = o2[e5], s2 = o2[e5 + 1];
      a3 < t2 && (t2 = a3), s2 < n2 && (n2 = s2), a3 > r2 && (r2 = a3), s2 > i2 && (i2 = s2);
    }
  }
  return {
    x: t2,
    y: n2,
    w: r2 - t2,
    h: i2 - n2
  };
}
function y(e4) {
  let t2 = g.get(e4);
  if (t2) return t2;
  let n2 = {
    strokeLinejoin: "round",
    ...e4
  }, r2 = "";
  for (let e5 in n2) {
    if (e5 === "decal" || e5 === "hatch") continue;
    let t3 = n2[e5];
    if (t3 != null) {
      let n3 = h[e5] || (h[e5] = e5.replace(/([A-Z])/g, "-$1").toLowerCase());
      r2 += ` ${n3}="${t3}"`;
    }
  }
  return g.set(e4, r2), r2;
}
var b = class e2 {
  constructor(e4) {
    this.data = e4;
  }
  get length() {
    return this.data.length >> 1;
  }
  x(e4) {
    return this.data[e4 * 2];
  }
  y(e4) {
    return this.data[e4 * 2 + 1];
  }
  *[Symbol.iterator]() {
    let e4 = this.data;
    for (let t2 = 0; t2 < e4.length; t2 += 2) yield [e4[t2], e4[t2 + 1]];
  }
  static quad(t2, n2, r2, i2, a2, o2, s2, c2) {
    return new e2([
      t2,
      n2,
      r2,
      i2,
      a2,
      o2,
      s2,
      c2
    ]);
  }
};
function* x(e4, t2) {
  let [n2, r2, i2] = e4, [a2, o2, s2] = t2;
  for (let e5 = i2; e5 < i2 + s2; e5++) for (let t3 = r2; t3 < r2 + o2; t3++) for (let r3 = n2; r3 < n2 + a2; r3++) yield [
    r3,
    t3,
    e5
  ];
}
function* S(e4, t2) {
  let [n2, r2, i2] = e4;
  for (let e5 = Math.ceil(i2 - t2); e5 <= Math.floor(i2 + t2); e5++) for (let a2 = Math.ceil(r2 - t2); a2 <= Math.floor(r2 + t2); a2++) for (let o2 = Math.ceil(n2 - t2); o2 <= Math.floor(n2 + t2); o2++) {
    let s2 = n2 - o2, c2 = r2 - a2, l2 = i2 - e5;
    s2 * s2 + c2 * c2 + l2 * l2 <= t2 * t2 && (yield [
      o2,
      a2,
      e5
    ]);
  }
}
function* C(e4, t2, n2, r2) {
  let [i2, a2, o2] = e4, [s2, c2, l2] = t2, u2 = s2 - i2, d2 = c2 - a2, f2 = l2 - o2, p2 = Math.max(Math.abs(u2), Math.abs(d2), Math.abs(f2)), m2 = n2 > 0 ? /* @__PURE__ */ new Set() : null, h2 = function* (e5) {
    if (!m2) {
      yield* e5;
      return;
    }
    for (let t3 of e5) {
      let e6 = t3[0] + 512 << 20 | t3[1] + 512 << 10 | t3[2] + 512;
      m2.has(e6) || (m2.add(e6), yield t3);
    }
  }, g2 = p2 === 0 ? [[
    i2,
    a2,
    o2
  ]] : Array.from({ length: p2 + 1 }, (e5, t3) => {
    let n3 = t3 / p2;
    return [
      Math.round(i2 + n3 * u2),
      Math.round(a2 + n3 * d2),
      Math.round(o2 + n3 * f2)
    ];
  });
  for (let [e5, t3, i3] of g2) if (r2 === "rounded" && n2 > 0) yield* h2(S([
    e5,
    t3,
    i3
  ], n2));
  else if (r2 === "square" && n2 > 0) {
    let r3 = Math.floor(n2);
    yield* h2(x([
      e5 - r3,
      t3 - r3,
      i3 - r3
    ], [
      r3 * 2 + 1,
      r3 * 2 + 1,
      r3 * 2 + 1
    ]));
  } else yield [
    e5,
    t3,
    i3
  ];
}
function* w(e4, t2) {
  let [[n2, r2, i2], [a2, o2, s2]] = e4;
  for (let e5 = i2; e5 < s2; e5++) for (let i3 = r2; i3 < o2; i3++) for (let r3 = n2; r3 < a2; r3++) t2(r3, i3, e5) && (yield [
    r3,
    i3,
    e5
  ]);
}
var T = [
  [
    0,
    -1,
    0,
    "bottom"
  ],
  [
    0,
    1,
    0,
    "top"
  ],
  [
    -1,
    0,
    0,
    "right"
  ],
  [
    1,
    0,
    0,
    "left"
  ],
  [
    0,
    0,
    -1,
    "back"
  ],
  [
    0,
    0,
    1,
    "front"
  ]
];
var E = class e3 {
  constructor(e4 = {}) {
    let t2 = e4.tile || 10, n2 = typeof t2 == "number" ? [
      t2,
      t2,
      t2
    ] : t2.length === 2 ? [
      t2[0],
      t2[1],
      t2[0]
    ] : t2;
    this.defaultStyle = e4.style || {
      fill: "#aaaaaa",
      stroke: "#000000",
      strokeWidth: 1
    };
    let r2 = e4.camera || {
      type: "oblique",
      angle: 45,
      distance: 15
    };
    this.renderOptions = {
      projection: r2.type || "oblique",
      tileW: n2[0],
      tileH: n2[1],
      tileZ: n2[2],
      depthOffsetX: 15,
      depthOffsetY: -15,
      cameraX: 5,
      cameraY: 5,
      cameraDistance: 10
    }, this.setCamera(r2), this.voxels = /* @__PURE__ */ new Map(), this.decals = /* @__PURE__ */ new Map(), this._epoch = 0, this._cachedEpoch = -1, this._cachedFaces = null, this._svgRenderer = null, this._batching = false, this._dirtyKeys = /* @__PURE__ */ new Set(), this._faceCache3D = /* @__PURE__ */ new Map(), this._faceCacheEpoch = -1;
  }
  setCamera(e4 = {}) {
    let t2 = e4.type || this.renderOptions.projection;
    if (this.renderOptions.projection = t2, t2 === "oblique") {
      let t3 = e4.angle === void 0 ? 45 : e4.angle, n2 = e4.distance === void 0 ? 15 : e4.distance, r2 = Math.PI / 180 * t3, i2 = this.renderOptions.tileZ / this.renderOptions.tileW;
      this.renderOptions.depthOffsetX = Math.cos(r2) * n2 * i2, this.renderOptions.depthOffsetY = Math.sin(r2) * n2 * i2;
    } else if (t2 === "orthographic" || t2 === "isometric") this.renderOptions.angle = (e4.angle === void 0 ? 45 : e4.angle) * (Math.PI / 180), this.renderOptions.pitch = t2 === "isometric" ? Math.PI / 180 * 35.264 : (e4.pitch === void 0 ? 35.264 : e4.pitch) * (Math.PI / 180);
    else {
      let t3 = e4.position || [5, 5];
      this.renderOptions.cameraX = t3[0], this.renderOptions.cameraY = t3[1], this.renderOptions.cameraDistance = e4.distance === void 0 ? 10 : e4.distance;
    }
    this._faceCache3D && this._faceCache3D.clear(), this._invalidate();
  }
  _k(e4, t2, n2) {
    return (e4 + 512 & 1023) << 20 | (t2 + 512 & 1023) << 10 | n2 + 512 & 1023;
  }
  _invalidate() {
    this._epoch++, this._batching || (this._cachedFaces = null);
  }
  _markDirty(e4, t2, n2) {
    this._dirtyKeys.add(this._k(e4, t2, n2));
    for (let [r2, i2, a2] of T) this._dirtyKeys.add(this._k(e4 + r2, t2 + i2, n2 + a2));
  }
  get epoch() {
    return this._epoch;
  }
  batch(e4) {
    this._batching = true;
    try {
      e4();
    } finally {
      this._batching = false, this._cachedFaces = null;
    }
  }
  static _bboxCenter(e4, t2) {
    let n2 = Infinity, r2 = Infinity, i2 = Infinity, a2 = -Infinity, o2 = -Infinity, s2 = -Infinity;
    for (let c2 of e4) {
      let [e5, l2, u2] = t2(c2);
      e5 < n2 && (n2 = e5), e5 > a2 && (a2 = e5), l2 < r2 && (r2 = l2), l2 > o2 && (o2 = l2), u2 < i2 && (i2 = u2), u2 > s2 && (s2 = u2);
    }
    return [
      (n2 + a2) / 2,
      (r2 + o2) / 2,
      (i2 + s2) / 2
    ];
  }
  static _rot90(e4, t2, n2, r2, i2, a2, o2, s2) {
    let c2 = e4 - a2, l2 = t2 - o2, u2 = n2 - s2, d2 = (i2 % 4 + 4) % 4;
    for (let e5 = 0; e5 < d2; e5++) if (r2 === "z") {
      let e6 = c2;
      c2 = -l2, l2 = e6;
    } else if (r2 === "y") {
      let e6 = c2;
      c2 = -u2, u2 = e6;
    } else {
      let e6 = l2;
      l2 = -u2, u2 = e6;
    }
    return [
      Math.round(a2 + c2),
      Math.round(o2 + l2),
      Math.round(s2 + u2)
    ];
  }
  *_rotateCoords(t2, n2) {
    if (!n2) {
      yield* t2;
      return;
    }
    let r2 = [...t2], [i2, a2, o2] = n2.center || e3._bboxCenter(r2, (e4) => e4);
    for (let [t3, s2, c2] of r2) yield e3._rot90(t3, s2, c2, n2.axis, n2.turns, i2, a2, o2);
  }
  rotate(t2) {
    let n2 = [...this.voxels.values()], [r2, i2, a2] = t2.center || e3._bboxCenter(n2, (e4) => [
      e4.x,
      e4.y,
      e4.z
    ]);
    this.voxels.clear(), this._faceCache3D.clear();
    for (let o2 of n2) {
      let [n3, s2, c2] = e3._rot90(o2.x, o2.y, o2.z, t2.axis, t2.turns, r2, i2, a2);
      this.voxels.set(this._k(n3, s2, c2), {
        ...o2,
        x: n3,
        y: s2,
        z: c2
      });
    }
    this._invalidate();
  }
  _applyOp(e4, t2, n2, r2, i2, a2, o2, s2) {
    if (t2 === "intersect") {
      let t3 = /* @__PURE__ */ new Set();
      for (let [n3, r3, i3] of e4) {
        let e5 = this._k(n3, r3, i3);
        this.voxels.has(e5) && t3.add(e5);
      }
      for (let [e5, n3] of this.voxels.entries()) t3.has(e5) || (this._markDirty(n3.x, n3.y, n3.z), this.voxels.delete(e5));
      if (n2) for (let e5 of t3) {
        let t4 = this.voxels.get(e5);
        t4 && (t4.styles = this._resolveStyles(n2, t4.x, t4.y, t4.z, t4.styles));
      }
    } else for (let [c2, l2, u2] of e4) {
      let e5 = this._k(c2, l2, u2);
      if (this._markDirty(c2, l2, u2), t2 === "union") {
        let t3 = {
          x: c2,
          y: l2,
          z: u2,
          styles: this._resolveStyles(n2 || null, c2, l2, u2)
        };
        if (r2 && (t3.content = r2), o2) {
          let e6 = typeof o2 == "function" ? o2(c2, l2, u2) : o2;
          e6 && (t3.scale = e6, t3.scaleOrigin = (typeof s2 == "function" ? s2(c2, l2, u2) : s2) || [
            0.5,
            0,
            0.5
          ], t3.opaque = false);
        } else i2 === false && (t3.opaque = false);
        a2 && (t3.meta = a2), this.voxels.set(e5, t3);
      } else if (t2 === "subtract") {
        if (this.voxels.delete(e5) && n2) for (let [e6, t3, r3, i3] of T) {
          let a3 = c2 + e6, o3 = l2 + t3, s3 = u2 + r3, d2 = this._k(a3, o3, s3), f2 = this.voxels.get(d2);
          if (f2) {
            let e7 = this._resolveStyles(n2, a3, o3, s3);
            e7[i3] ? f2.styles[i3] = {
              ...f2.styles[i3] || {},
              ...e7[i3]
            } : e7.default && (f2.styles[i3] = {
              ...f2.styles[i3] || {},
              ...e7.default
            });
          }
        }
      } else if (t2 === "exclude") if (this.voxels.has(e5)) this.voxels.delete(e5);
      else {
        let t3 = {
          x: c2,
          y: l2,
          z: u2,
          styles: this._resolveStyles(n2 || null, c2, l2, u2)
        };
        if (r2 && (t3.content = r2), o2) {
          let e6 = typeof o2 == "function" ? o2(c2, l2, u2) : o2;
          e6 && (t3.scale = e6, t3.scaleOrigin = (typeof s2 == "function" ? s2(c2, l2, u2) : s2) || [
            0.5,
            0,
            0.5
          ], t3.opaque = false);
        } else i2 === false && (t3.opaque = false);
        a2 && (t3.meta = a2), this.voxels.set(e5, t3);
      }
    }
    this._invalidate();
  }
  _resolveStyles(e4, t2, n2, r2, i2 = null) {
    if (!e4) return i2 ? { ...i2 } : { default: { ...this.defaultStyle } };
    let a2 = typeof e4 == "function" ? e4(t2, n2, r2) : e4, o2 = i2 ? { ...i2 } : {};
    for (let [e5, i3] of Object.entries(a2)) {
      let a3 = typeof i3 == "function" ? i3(t2, n2, r2) : i3;
      o2[e5] ? Object.assign(o2[e5], a3) : o2[e5] = { ...a3 };
    }
    return o2;
  }
  clear() {
    this.voxels.clear(), this._faceCache3D.clear(), this._invalidate();
  }
  getVoxel(e4) {
    return this.voxels.get(this._k(e4[0], e4[1], e4[2])) || null;
  }
  hasVoxel(e4) {
    return this.voxels.has(this._k(e4[0], e4[1], e4[2]));
  }
  getNeighbors(e4) {
    let [t2, n2, r2] = e4;
    return {
      top: this.getVoxel([
        t2,
        n2 - 1,
        r2
      ]),
      bottom: this.getVoxel([
        t2,
        n2 + 1,
        r2
      ]),
      left: this.getVoxel([
        t2 - 1,
        n2,
        r2
      ]),
      right: this.getVoxel([
        t2 + 1,
        n2,
        r2
      ]),
      front: this.getVoxel([
        t2,
        n2,
        r2 - 1
      ]),
      back: this.getVoxel([
        t2,
        n2,
        r2 + 1
      ])
    };
  }
  *[Symbol.iterator]() {
    for (let e4 of this.voxels.values()) yield e4;
  }
  toJSON() {
    let e4 = [];
    for (let [t2, n2] of this.voxels.entries()) {
      let t3 = {};
      for (let [e5, r3] of Object.entries(n2.styles)) {
        if (typeof r3 == "function") {
          console.warn(`Heerich.toJSON: functional style on face "${e5}" at [${n2.x},${n2.y},${n2.z}] will be omitted`);
          continue;
        }
        t3[e5] = r3;
      }
      let r2 = {
        x: n2.x,
        y: n2.y,
        z: n2.z,
        styles: t3
      };
      n2.content && (r2.content = n2.content), n2.opaque === false && (r2.opaque = false), n2.meta && (r2.meta = n2.meta), n2.scale && (r2.scale = n2.scale), n2.scaleOrigin && (r2.scaleOrigin = n2.scaleOrigin), e4.push(r2);
    }
    return {
      tile: [
        this.renderOptions.tileW,
        this.renderOptions.tileH,
        this.renderOptions.tileZ
      ],
      camera: this.renderOptions.projection === "oblique" ? {
        type: "oblique",
        depthOffsetX: this.renderOptions.depthOffsetX,
        depthOffsetY: this.renderOptions.depthOffsetY
      } : {
        type: "perspective",
        position: [this.renderOptions.cameraX, this.renderOptions.cameraY],
        distance: this.renderOptions.cameraDistance
      },
      style: { ...this.defaultStyle },
      voxels: e4,
      decals: this.decals.size > 0 ? Object.fromEntries(this.decals.entries()) : void 0
    };
  }
  static fromJSON(t2) {
    let n2 = new e3({
      tile: t2.tile,
      camera: t2.camera,
      style: t2.style
    });
    for (let e4 of t2.voxels) {
      let t3 = {
        x: e4.x,
        y: e4.y,
        z: e4.z,
        styles: e4.styles
      };
      e4.content && (t3.content = e4.content), e4.opaque === false && (t3.opaque = false), e4.meta && (t3.meta = e4.meta), e4.scale && (t3.scale = e4.scale), e4.scaleOrigin && (t3.scaleOrigin = e4.scaleOrigin), n2.voxels.set(n2._k(e4.x, e4.y, e4.z), t3);
    }
    if (t2.decals) for (let [e4, r2] of Object.entries(t2.decals)) n2.defineDecal(e4, r2);
    return n2._invalidate(), n2;
  }
  _resolveGeometry(e4) {
    let t2 = e4.type;
    if (t2 === "box" || t2 === "sphere" || t2 === "fill") {
      let n2 = e4.bounds ? [
        e4.bounds[1][0] - e4.bounds[0][0],
        e4.bounds[1][1] - e4.bounds[0][1],
        e4.bounds[1][2] - e4.bounds[0][2]
      ] : e4.size == null ? [
        e4.radius * 2 + 1,
        e4.radius * 2 + 1,
        e4.radius * 2 + 1
      ] : typeof e4.size == "number" ? [
        e4.size,
        e4.size,
        e4.size
      ] : e4.size, r2 = e4.position ?? (e4.bounds ? e4.bounds[0] : null) ?? [
        e4.center[0] - Math.floor(n2[0] / 2),
        e4.center[1] - Math.floor(n2[1] / 2),
        e4.center[2] - Math.floor(n2[2] / 2)
      ], i2 = e4.center ?? [
        r2[0] + Math.floor(n2[0] / 2),
        r2[1] + Math.floor(n2[1] / 2),
        r2[2] + Math.floor(n2[2] / 2)
      ], a2 = e4.radius ?? Math.floor(n2[0] / 2);
      return t2 === "box" ? x(r2, n2) : t2 === "sphere" ? S(i2, a2) : w([r2, [
        r2[0] + n2[0],
        r2[1] + n2[1],
        r2[2] + n2[2]
      ]], e4.test);
    }
    if (t2 === "line") return C(e4.from, e4.to, e4.radius || 0, e4.shape || "rounded");
    throw Error(`Unknown geometry type: "${t2}"`);
  }
  defineDecal(e4, t2) {
    typeof t2 == "string" && (t2 = { content: t2 }), t2._prepared = u(t2.content), this.decals.set(e4, t2);
  }
  applyGeometry(e4) {
    let t2 = this._resolveGeometry(e4);
    e4.rotate && (t2 = this._rotateCoords(t2, e4.rotate)), this._applyOp(t2, e4.mode || "union", e4.style, e4.content, e4.opaque, e4.meta, e4.scale, e4.scaleOrigin);
  }
  removeGeometry(e4) {
    this.applyGeometry({
      ...e4,
      mode: "subtract"
    });
  }
  addGeometry(e4) {
    this.applyGeometry({
      ...e4,
      mode: "union"
    });
  }
  applyStyle(e4) {
    if (!e4.style) throw Error("applyStyle requires a style parameter");
    if (!e4.type) {
      for (let [t3, n2] of this.voxels.entries()) n2.styles = this._resolveStyles(e4.style, n2.x, n2.y, n2.z, n2.styles);
      this._invalidate();
      return;
    }
    let t2 = this._resolveGeometry(e4);
    for (let [n2, r2, i2] of t2) {
      let t3 = this._k(n2, r2, i2), a2 = this.voxels.get(t3);
      a2 && (a2.styles = this._resolveStyles(e4.style, n2, r2, i2, a2.styles));
    }
    this._invalidate();
  }
  static _scaleVertices(e4, t2, n2, r2, i2, a2) {
    let o2 = t2 + a2[0], s2 = n2 + a2[1], c2 = r2 + a2[2];
    return e4.map(([e5, t3, n3]) => [
      o2 + (e5 - o2) * i2[0],
      s2 + (t3 - s2) * i2[1],
      c2 + (n3 - c2) * i2[2]
    ]);
  }
  getFaces() {
    if (this._cachedEpoch === this._epoch && this._cachedFaces) return this._cachedFaces;
    let { projection: t2, tileW: n2, tileH: r2, depthOffsetX: i2, depthOffsetY: a2, cameraX: o2, cameraY: s2, cameraDistance: c2 } = this.renderOptions, l2 = (e4, t3, n3) => {
      let r3 = this.voxels.get(this._k(e4, t3, n3));
      return r3 && r3.opaque !== false;
    }, u2 = t2 === "oblique" ? i2 / n2 : 0, d2 = t2 === "oblique" ? a2 / r2 : 0, f2 = this._dirtyKeys, p2 = f2.size > 0 && this._faceCache3D.size > 0;
    if (p2) for (let e4 of f2) this._faceCache3D.delete(e4);
    let m2 = [];
    for (let [n3, r3] of this.voxels.entries()) {
      if (p2 && !f2.has(n3)) {
        let e4 = this._faceCache3D.get(n3);
        if (e4) {
          for (let t3 = 0; t3 < e4.length; t3++) m2.push(e4[t3]);
          continue;
        }
      }
      let { x: o3, y: s3, z: c3, styles: h3 } = r3;
      if (!r3.scale && l2(o3 - 1, s3, c3) && l2(o3 + 1, s3, c3) && l2(o3, s3 - 1, c3) && l2(o3, s3 + 1, c3) && l2(o3, s3, c3 - 1) && l2(o3, s3, c3 + 1)) continue;
      let g2 = m2.length;
      if (r3.content) {
        m2.push({
          type: "content",
          voxel: r3,
          content: r3.content,
          _pos: [
            o3,
            s3,
            c3
          ]
        }), this._faceCache3D.set(n3, m2.slice(g2));
        continue;
      }
      let _2 = h3.default ? {
        ...this.defaultStyle,
        ...h3.default
      } : this.defaultStyle, v2 = (e4) => {
        let t3 = h3[e4];
        return t3 ? {
          ..._2,
          ...t3
        } : _2;
      }, y2 = r3.scale, b2 = r3.scaleOrigin;
      if (t2 === "oblique") {
        let t3 = (e4, t4, n5) => n5 - e4 * u2 - t4 * d2, n4 = (n5, i3, a3, l3, u3) => {
          m2.push({
            type: n5,
            voxel: r3,
            vertices: y2 ? e3._scaleVertices(i3, o3, s3, c3, y2, b2) : i3,
            depth: t3(a3, l3, u3),
            style: v2(n5)
          });
        };
        a2 < 0 && (y2 || !l2(o3, s3 - 1, c3)) && n4("top", [
          [
            o3,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3 + 1
          ],
          [
            o3,
            s3,
            c3 + 1
          ]
        ], o3 + 0.5, s3, c3 + 0.5), a2 > 0 && (y2 || !l2(o3, s3 + 1, c3)) && n4("bottom", [
          [
            o3,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ]
        ], o3 + 0.5, s3 + 1, c3 + 0.5), i2 < 0 && (y2 || !l2(o3 - 1, s3, c3)) && n4("left", [
          [
            o3,
            s3,
            c3 + 1
          ],
          [
            o3,
            s3,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3 + 1
          ]
        ], o3, s3 + 0.5, c3 + 0.5), i2 > 0 && (y2 || !l2(o3 + 1, s3, c3)) && n4("right", [
          [
            o3 + 1,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ]
        ], o3 + 1, s3 + 0.5, c3 + 0.5), (y2 || !l2(o3, s3, c3 - 1)) && n4("front", [
          [
            o3,
            s3,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3
          ]
        ], o3 + 0.5, s3 + 0.5, c3);
      } else {
        let t3 = (t4, n4, i3, a3) => {
          if (y2) {
            let e4 = o3 + b2[0], t5 = s3 + b2[1], n5 = c3 + b2[2];
            a3 = [
              e4 + (a3[0] - e4) * y2[0],
              t5 + (a3[1] - t5) * y2[1],
              n5 + (a3[2] - n5) * y2[2]
            ];
          }
          m2.push({
            type: t4,
            voxel: r3,
            vertices: y2 ? e3._scaleVertices(n4, o3, s3, c3, y2, b2) : n4,
            n: i3,
            c: a3,
            style: v2(t4)
          });
        };
        (y2 || !l2(o3, s3 - 1, c3)) && t3("top", [
          [
            o3,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3 + 1
          ],
          [
            o3,
            s3,
            c3 + 1
          ]
        ], [
          0,
          -1,
          0
        ], [
          o3 + 0.5,
          s3,
          c3 + 0.5
        ]), (y2 || !l2(o3, s3 + 1, c3)) && t3("bottom", [
          [
            o3,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ]
        ], [
          0,
          1,
          0
        ], [
          o3 + 0.5,
          s3 + 1,
          c3 + 0.5
        ]), (y2 || !l2(o3 - 1, s3, c3)) && t3("left", [
          [
            o3,
            s3,
            c3 + 1
          ],
          [
            o3,
            s3,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3 + 1
          ]
        ], [
          -1,
          0,
          0
        ], [
          o3,
          s3 + 0.5,
          c3 + 0.5
        ]), (y2 || !l2(o3 + 1, s3, c3)) && t3("right", [
          [
            o3 + 1,
            s3,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ]
        ], [
          1,
          0,
          0
        ], [
          o3 + 1,
          s3 + 0.5,
          c3 + 0.5
        ]), (y2 || !l2(o3, s3, c3 - 1)) && t3("front", [
          [
            o3,
            s3,
            c3
          ],
          [
            o3,
            s3 + 1,
            c3
          ],
          [
            o3 + 1,
            s3 + 1,
            c3
          ],
          [
            o3 + 1,
            s3,
            c3
          ]
        ], [
          0,
          0,
          -1
        ], [
          o3 + 0.5,
          s3 + 0.5,
          c3
        ]), (y2 || !l2(o3, s3, c3 + 1)) && t3("back", [
          [
            o3 + 1,
            s3,
            c3 + 1
          ],
          [
            o3 + 1,
            s3 + 1,
            c3 + 1
          ],
          [
            o3,
            s3 + 1,
            c3 + 1
          ],
          [
            o3,
            s3,
            c3 + 1
          ]
        ], [
          0,
          0,
          1
        ], [
          o3 + 0.5,
          s3 + 0.5,
          c3 + 1
        ]);
      }
      m2.length > g2 && this._faceCache3D.set(n3, m2.slice(g2));
    }
    this._dirtyKeys.clear(), this._faceCacheEpoch = this._epoch;
    let h2 = this._projectAndSort(m2);
    return this._cachedFaces = h2, this._cachedEpoch = this._epoch, h2;
  }
  renderTest(e4) {
    let t2 = e4.regions || [e4.bounds], n2 = e4.test, r2 = typeof e4.style == "function" ? e4.style : null, i2 = r2 ? null : e4.style || null, a2 = this.defaultStyle, { projection: o2, depthOffsetX: s2, depthOffsetY: c2, tileW: l2, tileH: u2 } = this.renderOptions, d2 = o2 === "oblique" ? s2 / l2 : 0, f2 = o2 === "oblique" ? c2 / u2 : 0, p2 = o2 === "oblique", m2 = [], h2 = t2.length > 1 ? /* @__PURE__ */ new Set() : null, g2 = !r2 && !i2;
    for (let [[e5, o3, l3], [u3, _2, v2]] of t2) for (let t3 = l3; t3 < v2; t3++) for (let l4 = o3; l4 < _2; l4++) for (let o4 = e5; o4 < u3; o4++) {
      if (h2) {
        let e7 = o4 + 512 << 20 | l4 + 512 << 10 | t3 + 512;
        if (h2.has(e7)) continue;
        h2.add(e7);
      }
      if (!n2(o4, l4, t3)) continue;
      let e6 = {
        x: o4,
        y: l4,
        z: t3
      }, u4 = g2 ? () => a2 : (e7) => {
        if (r2) return {
          ...a2,
          ...r2(o4, l4, t3, e7)
        };
        let n3 = i2.default, s3 = n3 ? {
          ...a2,
          ...typeof n3 == "function" ? n3(o4, l4, t3) : n3
        } : a2, c3 = i2[e7];
        return c3 ? {
          ...s3,
          ...typeof c3 == "function" ? c3(o4, l4, t3) : c3
        } : s3;
      };
      if (p2) {
        let r3 = (e7, t4, n3) => n3 - e7 * d2 - t4 * f2, i3 = (t4, n3, i4, a3, o5) => {
          m2.push({
            type: t4,
            voxel: e6,
            vertices: n3,
            depth: r3(i4, a3, o5),
            style: u4(t4)
          });
        };
        c2 < 0 && !n2(o4, l4 - 1, t3) && i3("top", [
          [
            o4,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3 + 1
          ],
          [
            o4,
            l4,
            t3 + 1
          ]
        ], o4 + 0.5, l4, t3 + 0.5), c2 > 0 && !n2(o4, l4 + 1, t3) && i3("bottom", [
          [
            o4,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ]
        ], o4 + 0.5, l4 + 1, t3 + 0.5), s2 < 0 && !n2(o4 - 1, l4, t3) && i3("left", [
          [
            o4,
            l4,
            t3 + 1
          ],
          [
            o4,
            l4,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3 + 1
          ]
        ], o4, l4 + 0.5, t3 + 0.5), s2 > 0 && !n2(o4 + 1, l4, t3) && i3("right", [
          [
            o4 + 1,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ]
        ], o4 + 1, l4 + 0.5, t3 + 0.5), n2(o4, l4, t3 - 1) || i3("front", [
          [
            o4,
            l4,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3
          ]
        ], o4 + 0.5, l4 + 0.5, t3);
      } else {
        let r3 = (t4, n3, r4, i3) => {
          m2.push({
            type: t4,
            voxel: e6,
            vertices: n3,
            n: r4,
            c: i3,
            style: u4(t4)
          });
        };
        n2(o4, l4 - 1, t3) || r3("top", [
          [
            o4,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3 + 1
          ],
          [
            o4,
            l4,
            t3 + 1
          ]
        ], [
          0,
          -1,
          0
        ], [
          o4 + 0.5,
          l4,
          t3 + 0.5
        ]), n2(o4, l4 + 1, t3) || r3("bottom", [
          [
            o4,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ]
        ], [
          0,
          1,
          0
        ], [
          o4 + 0.5,
          l4 + 1,
          t3 + 0.5
        ]), n2(o4 - 1, l4, t3) || r3("left", [
          [
            o4,
            l4,
            t3 + 1
          ],
          [
            o4,
            l4,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3 + 1
          ]
        ], [
          -1,
          0,
          0
        ], [
          o4,
          l4 + 0.5,
          t3 + 0.5
        ]), n2(o4 + 1, l4, t3) || r3("right", [
          [
            o4 + 1,
            l4,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ]
        ], [
          1,
          0,
          0
        ], [
          o4 + 1,
          l4 + 0.5,
          t3 + 0.5
        ]), n2(o4, l4, t3 - 1) || r3("front", [
          [
            o4,
            l4,
            t3
          ],
          [
            o4,
            l4 + 1,
            t3
          ],
          [
            o4 + 1,
            l4 + 1,
            t3
          ],
          [
            o4 + 1,
            l4,
            t3
          ]
        ], [
          0,
          0,
          -1
        ], [
          o4 + 0.5,
          l4 + 0.5,
          t3
        ]), n2(o4, l4, t3 + 1) || r3("back", [
          [
            o4 + 1,
            l4,
            t3 + 1
          ],
          [
            o4 + 1,
            l4 + 1,
            t3 + 1
          ],
          [
            o4,
            l4 + 1,
            t3 + 1
          ],
          [
            o4,
            l4,
            t3 + 1
          ]
        ], [
          0,
          0,
          1
        ], [
          o4 + 0.5,
          l4 + 0.5,
          t3 + 1
        ]);
      }
    }
    return this._projectAndSort(m2);
  }
  _projectAndSort(e4) {
    let t2 = [], n2 = (e5) => Math.round(e5 * 1e4) / 1e4, { projection: r2, tileW: i2, tileH: a2, depthOffsetX: o2, depthOffsetY: s2, cameraX: c2, cameraY: l2 } = this.renderOptions, u2 = r2 === "oblique" ? o2 / i2 : 0, d2 = r2 === "oblique" ? s2 / a2 : 0, { cameraDistance: f2 } = this.renderOptions;
    for (let p2 of e4) {
      if (p2.type === "content") {
        let [e5, m2, h2] = p2._pos, g2, _2, v2, y2;
        if (r2 === "oblique") g2 = n2((e5 + 0.5) * i2 + (h2 + 0.5) * o2), _2 = n2((m2 + 0.5) * a2 + (h2 + 0.5) * s2), v2 = 1, y2 = h2 + 0.5 - (e5 + 0.5) * u2 - (m2 + 0.5) * d2;
        else if (r2 === "orthographic" || r2 === "isometric") {
          let { angle: t3 = 0, pitch: r3 = 0 } = this.renderOptions, o3 = Math.cos(t3), s3 = Math.sin(t3), c3 = Math.cos(r3), l3 = Math.sin(r3), u3 = (e5 + 0.5) * o3 - (h2 + 0.5) * s3, d3 = (m2 + 0.5) * c3 - ((e5 + 0.5) * s3 + (h2 + 0.5) * o3) * l3;
          g2 = n2((u3 + 5) * i2), _2 = n2((d3 + 5) * a2), v2 = 1, y2 = (m2 + 0.5) * l3 + ((e5 + 0.5) * s3 + (h2 + 0.5) * o3) * c3;
        } else {
          let t3 = f2 / (h2 + 0.5 + f2);
          g2 = n2((c2 + (e5 + 0.5 - c2) * t3) * i2), _2 = n2((l2 + (m2 + 0.5 - l2) * t3) * a2), v2 = n2(t3);
          let r3 = e5 + 0.5 - c2, o3 = m2 + 0.5 - l2, s3 = h2 + 0.5 + f2;
          y2 = r3 * r3 + o3 * o3 + s3 * s3;
        }
        let x2 = [
          [
            e5,
            m2,
            h2
          ],
          [
            e5 + 1,
            m2,
            h2
          ],
          [
            e5,
            m2 + 1,
            h2
          ],
          [
            e5 + 1,
            m2 + 1,
            h2
          ]
        ];
        if (r2 === "oblique") {
          let e6 = [];
          for (let [t3, r3, c3] of x2) e6.push(n2(t3 * i2 + c3 * o2), n2(r3 * a2 + c3 * s2));
          p2.points = new b(e6);
        } else if (r2 === "orthographic" || r2 === "isometric") {
          let e6 = [], { angle: t3 = 0, pitch: r3 = 0 } = this.renderOptions, o3 = Math.cos(t3), s3 = Math.sin(t3), c3 = Math.cos(r3), l3 = Math.sin(r3);
          for (let [t4, r4, u3] of x2) {
            let d3 = t4 * o3 - u3 * s3, f3 = r4 * c3 - (t4 * s3 + u3 * o3) * l3;
            e6.push(n2((d3 + 5) * i2), n2((f3 + 5) * a2));
          }
          p2.points = new b(e6);
        } else {
          let e6 = [];
          for (let [t3, r3, o3] of x2) {
            let s3 = f2 / (o3 + f2);
            e6.push(n2((c2 + (t3 - c2) * s3) * i2), n2((l2 + (r3 - l2) * s3) * a2));
          }
          p2.points = new b(e6);
        }
        p2.depth = y2, p2._px = g2, p2._py = _2, p2._scale = v2, t2.push(p2);
        continue;
      }
      if (r2 === "oblique") {
        let e5 = [];
        for (let t3 of p2.vertices) e5.push(n2(t3[0] * i2 + t3[2] * o2), n2(t3[1] * a2 + t3[2] * s2));
        p2.points = new b(e5);
      } else if (r2 === "orthographic" || r2 === "isometric") {
        let { angle: e5 = 0, pitch: t3 = 0 } = this.renderOptions, r3 = Math.cos(e5), o3 = Math.sin(e5), s3 = Math.cos(t3), c3 = Math.sin(t3), l3 = [
          o3 * s3,
          c3,
          r3 * s3
        ];
        if (l3[0] * p2.n[0] + l3[1] * p2.n[1] + l3[2] * p2.n[2] >= 0) continue;
        let u3 = [];
        for (let e6 of p2.vertices) {
          let t4 = e6[0] * r3 - e6[2] * o3, l4 = e6[1] * s3 - (e6[0] * o3 + e6[2] * r3) * c3;
          u3.push(n2((t4 + 5) * i2), n2((l4 + 5) * a2));
        }
        p2.points = new b(u3), p2.depth = p2.c[1] * c3 + (p2.c[0] * o3 + p2.c[2] * r3) * s3;
      } else if (r2 === "perspective") {
        let e5 = c2, t3 = l2, r3 = -f2, o3 = [
          p2.c[0] - e5,
          p2.c[1] - t3,
          p2.c[2] - r3
        ];
        if (o3[0] * p2.n[0] + o3[1] * p2.n[1] + o3[2] * p2.n[2] >= 0 || p2.vertices.some((e6) => e6[2] + f2 < 0.01)) continue;
        let s3 = [];
        for (let r4 of p2.vertices) {
          let o4 = f2 / (r4[2] + f2);
          s3.push(n2((e5 + (r4[0] - e5) * o4) * i2), n2((t3 + (r4[1] - t3) * o4) * a2));
        }
        p2.points = new b(s3), p2.depth = o3[0] * o3[0] + o3[1] * o3[1] + o3[2] * o3[2];
      }
      t2.push(p2);
    }
    return t2.sort((e5, t3) => t3.depth - e5.depth || e5.voxel.x - t3.voxel.x || e5.voxel.y - t3.voxel.y || e5.voxel.z - t3.voxel.z), t2;
  }
  getBounds(e4 = 0, t2) {
    t2 ||= this.getFaces();
    let n2 = v(t2);
    return {
      x: n2.x - e4,
      y: n2.y - e4,
      w: n2.w + e4 * 2,
      h: n2.h + e4 * 2,
      faces: t2
    };
  }
  toSVG(e4 = {}) {
    this._svgRenderer ||= new _();
    let t2 = e4.faces || this.getFaces();
    return this._svgRenderer.render(t2, {
      ...e4,
      tileW: this.renderOptions.tileW,
      decals: this.decals
    });
  }
};

// ../../design-system/regent_ui/assets/js/collateral/manifest.json
var manifest_default = {
  experiments: [
    {
      id: "chamber-drift",
      name: "Chamber Drift",
      class: "ambient",
      tags: ["background", "hero", "depth"],
      productUse: "Page hero backdrop with slow parallax depth, like the entrance hall of the product.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    },
    {
      id: "lattice-weave",
      name: "Lattice Weave",
      class: "ambient",
      tags: ["background", "section", "ripple"],
      productUse: "Section background; a flat voxel lattice that ripples gently to signal a live surface.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    },
    {
      id: "haze-columns",
      name: "Haze Columns",
      class: "ambient",
      tags: ["background", "ceremonial", "glow"],
      productUse: "Backdrop for sign-in and ceremonial pages; a colonnade with drifting light beams.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "css" }
    },
    {
      id: "ink-tide",
      name: "Ink Tide",
      class: "ambient",
      tags: ["footer", "wave", "procedural"],
      productUse: "Footer ambient strip; a low voxel tide that slowly swells and recedes.",
      budget: { maxFaces: 2500, maxMountMs: 50, idleLoop: "raf" }
    },
    {
      id: "starfield-depth",
      name: "Starfield Depth",
      class: "ambient",
      tags: ["background", "parallax", "pointer"],
      productUse: "Empty-page backdrop (404, maintenance); sparse voxel stars with pointer parallax.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "tilt-parallax-card",
      name: "Tilt Parallax Card",
      class: "micro",
      tags: ["card", "hover", "depth"],
      productUse: "Product and agent cards; a voxel stack that tilts with the pointer to give cards physical depth.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "hover-assemble-logo",
      name: "Hover Assemble",
      class: "micro",
      tags: ["logo", "hover", "assembly"],
      productUse: "Nav logos and link hovers; scattered voxels snap together into the mark on hover.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "button-press-pad",
      name: "Press Pad",
      class: "micro",
      tags: ["button", "press", "feedback"],
      productUse: "Primary call-to-action feedback; a voxel key that physically depresses on press.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "toggle-flip-cube",
      name: "Flip Cube",
      class: "micro",
      tags: ["toggle", "state", "rotate"],
      productUse: "Two-state toggles (theme, view mode); a cube that rolls between two styled faces.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "checkbox-stack-tick",
      name: "Stack Tick",
      class: "micro",
      tags: ["form", "success", "checkmark"],
      productUse: "Form confirmation; a voxel checkmark that builds in when a step completes.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "input-focus-frame",
      name: "Focus Frame",
      class: "micro",
      tags: ["form", "focus", "frame"],
      productUse: "Input focus affordance; a thin voxel frame that lights up around the active field.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" }
    },
    {
      id: "voxel-bar-relay",
      name: "Voxel Bar Relay",
      class: "data",
      tags: ["chart", "dashboard", "bars"],
      productUse: "Dashboard stats; a 3D bar chart whose columns grow and reorder as numbers change.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
      demoData: { values: [4, 9, 6, 12, 7, 10, 5], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }
    },
    {
      id: "terrain-heightmap",
      name: "Terrain Heightmap",
      class: "data",
      tags: ["chart", "surface", "analytics"],
      productUse: "Activity and network visualizations; a voxel terrain whose elevation is the data.",
      budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" },
      demoData: {
        grid: [
          [1, 2, 2, 3, 2, 1],
          [2, 3, 4, 4, 3, 2],
          [2, 4, 6, 5, 4, 2],
          [3, 4, 5, 6, 4, 3],
          [2, 3, 4, 4, 3, 2],
          [1, 2, 2, 3, 2, 1]
        ]
      }
    },
    {
      id: "stake-vault-fill",
      name: "Vault Fill",
      class: "data",
      tags: ["staking", "progress", "vault"],
      productUse: "Staking progress; a glass vault that fills with gold voxels as the staked share grows.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
      demoData: { ratio: 0.62 }
    },
    {
      id: "launch-pipeline-track",
      name: "Pipeline Track",
      class: "data",
      tags: ["progress", "stages", "launch"],
      productUse: "Multi-stage progress; a token advances along an isometric track, one station per stage.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
      demoData: { stage: 3, stages: 5, labels: ["Configure", "Fund", "Open", "Clear", "Graduate"] }
    },
    {
      id: "techtree-growth",
      name: "Tree Growth",
      class: "data",
      tags: ["tree", "progress", "research"],
      productUse: "Research-tree progress; branches assemble voxel by voxel as nodes unlock.",
      budget: { maxFaces: 1200, maxMountMs: 60, idleLoop: "none" },
      demoData: { unlocked: 9, total: 16 }
    },
    {
      id: "podium-bids",
      name: "Podium Bids",
      class: "data",
      tags: ["leaderboard", "auction", "ranking"],
      productUse: "Live leaderboards; podium columns that grow and swap places as rankings change.",
      budget: { maxFaces: 1200, maxMountMs: 50, idleLoop: "none" },
      demoData: {
        entries: [
          { label: "AURA", value: 86 },
          { label: "MINT", value: 64 },
          { label: "PLEX", value: 51 },
          { label: "NOVA", value: 38 },
          { label: "HALO", value: 22 }
        ]
      }
    },
    {
      id: "dissolve-rebuild",
      name: "Dissolve and Rebuild",
      class: "transition",
      tags: ["navigation", "page", "morph"],
      productUse: "Page-to-page handoff; the current scene dissolves into voxels that reassemble as the next motif.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "tunnel-warp",
      name: "Tunnel Warp",
      class: "transition",
      tags: ["entrance", "camera", "depth"],
      productUse: "Entering the app; a fast camera push through a voxel chamber, under 600 ms.",
      budget: { maxFaces: 1500, maxMountMs: 60, idleLoop: "none" }
    },
    {
      id: "curtain-slats",
      name: "Curtain Slats",
      class: "transition",
      tags: ["modal", "reveal", "drawer"],
      productUse: "Modal and drawer reveals; vertical voxel slats rotate open in sequence.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "logo-scatter-handoff",
      name: "Scatter Handoff",
      class: "transition",
      tags: ["hero", "scroll", "logo"],
      productUse: "Hero-to-content handoff; the mark scatters into depth and regroups as the next section's sigil.",
      budget: { maxFaces: 1500, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "confetti-voxelburst",
      name: "Voxel Burst",
      class: "celebration",
      tags: ["success", "confetti", "one-shot"],
      productUse: "Success moments (claimed, minted, launched); a one-shot burst of brand-colored voxels.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "gavel-strike",
      name: "Gavel Strike",
      class: "celebration",
      tags: ["auction", "won", "impact"],
      productUse: "Auction won; a voxel gavel strikes and a shockwave ring ripples out.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "crown-coronation",
      name: "Coronation",
      class: "celebration",
      tags: ["onboarding", "complete", "crown"],
      productUse: "Onboarding and formation complete; a crown assembles from falling voxels with a gold sheen.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "vault-jackpot",
      name: "Vault Jackpot",
      class: "celebration",
      tags: ["rewards", "claim", "payout"],
      productUse: "Rewards claimed; vault doors swing open and gold voxels spill out.",
      budget: { maxFaces: 1e3, maxMountMs: 50, idleLoop: "none" }
    },
    {
      id: "stack-build-loader",
      name: "Stack Build Loader",
      class: "loading",
      tags: ["loading", "indeterminate", "loop"],
      productUse: "Indeterminate loading; a small voxel column builds and unbuilds in a calm loop.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "raf" }
    },
    {
      id: "progress-ring",
      name: "Progress Ring",
      class: "loading",
      tags: ["loading", "determinate", "ring"],
      productUse: "Determinate progress; a ring of voxels fills clockwise toward completion.",
      budget: { maxFaces: 400, maxMountMs: 40, idleLoop: "none" },
      demoData: { progress: 0.7 }
    }
  ]
};

// ../../design-system/regent_ui/assets/js/collateral/registry.ts
var registry = {
  "chamber-drift": () => Promise.resolve().then(() => (init_chamber_drift(), chamber_drift_exports)),
  "lattice-weave": () => Promise.resolve().then(() => (init_lattice_weave(), lattice_weave_exports)),
  "haze-columns": () => Promise.resolve().then(() => (init_haze_columns(), haze_columns_exports)),
  "ink-tide": () => Promise.resolve().then(() => (init_ink_tide(), ink_tide_exports)),
  "starfield-depth": () => Promise.resolve().then(() => (init_starfield_depth(), starfield_depth_exports)),
  "tilt-parallax-card": () => Promise.resolve().then(() => (init_tilt_parallax_card(), tilt_parallax_card_exports)),
  "hover-assemble-logo": () => Promise.resolve().then(() => (init_hover_assemble_logo(), hover_assemble_logo_exports)),
  "button-press-pad": () => Promise.resolve().then(() => (init_button_press_pad(), button_press_pad_exports)),
  "toggle-flip-cube": () => Promise.resolve().then(() => (init_toggle_flip_cube(), toggle_flip_cube_exports)),
  "checkbox-stack-tick": () => Promise.resolve().then(() => (init_checkbox_stack_tick(), checkbox_stack_tick_exports)),
  "input-focus-frame": () => Promise.resolve().then(() => (init_input_focus_frame(), input_focus_frame_exports)),
  "voxel-bar-relay": () => Promise.resolve().then(() => (init_voxel_bar_relay(), voxel_bar_relay_exports)),
  "terrain-heightmap": () => Promise.resolve().then(() => (init_terrain_heightmap(), terrain_heightmap_exports)),
  "stake-vault-fill": () => Promise.resolve().then(() => (init_stake_vault_fill(), stake_vault_fill_exports)),
  "launch-pipeline-track": () => Promise.resolve().then(() => (init_launch_pipeline_track(), launch_pipeline_track_exports)),
  "techtree-growth": () => Promise.resolve().then(() => (init_techtree_growth(), techtree_growth_exports)),
  "podium-bids": () => Promise.resolve().then(() => (init_podium_bids(), podium_bids_exports)),
  "dissolve-rebuild": () => Promise.resolve().then(() => (init_dissolve_rebuild(), dissolve_rebuild_exports)),
  "tunnel-warp": () => Promise.resolve().then(() => (init_tunnel_warp(), tunnel_warp_exports)),
  "curtain-slats": () => Promise.resolve().then(() => (init_curtain_slats(), curtain_slats_exports)),
  "logo-scatter-handoff": () => Promise.resolve().then(() => (init_logo_scatter_handoff(), logo_scatter_handoff_exports)),
  "confetti-voxelburst": () => Promise.resolve().then(() => (init_confetti_voxelburst(), confetti_voxelburst_exports)),
  "gavel-strike": () => Promise.resolve().then(() => (init_gavel_strike(), gavel_strike_exports)),
  "crown-coronation": () => Promise.resolve().then(() => (init_crown_coronation(), crown_coronation_exports)),
  "vault-jackpot": () => Promise.resolve().then(() => (init_vault_jackpot(), vault_jackpot_exports)),
  "stack-build-loader": () => Promise.resolve().then(() => (init_stack_build_loader(), stack_build_loader_exports)),
  "progress-ring": () => Promise.resolve().then(() => (init_progress_ring(), progress_ring_exports))
};

// ../../design-system/regent_ui/assets/js/collateral/runtime/measure.ts
var listeners = /* @__PURE__ */ new Set();
function onMountMeasured(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ../../design-system/regent_ui/assets/js/collateral/harness.ts
window.Heerich = E;
var report = { done: false, entries: [] };
window.__collateralReport = report;
var mountTimes = /* @__PURE__ */ new Map();
onMountMeasured(({ id, mountMs }) => mountTimes.set(id, mountMs));
var grid = document.getElementById("grid");
if (!grid) throw new Error("harness.html must provide #grid");
async function mountAll() {
  for (const entry of manifest_default.experiments) {
    const card = document.createElement("section");
    card.className = "card";
    const stage = document.createElement("div");
    stage.className = "stage";
    const label = document.createElement("p");
    label.textContent = `${entry.name} (${entry.class})`;
    card.append(stage, label);
    grid.append(card);
    const reportEntry = {
      id: entry.id,
      mountMs: null,
      faceCount: null,
      error: null
    };
    report.entries.push(reportEntry);
    let handle = null;
    try {
      const loader = registry[entry.id];
      if (!loader) throw new Error("missing registry entry");
      const module = await loader();
      handle = module.mount({
        el: stage,
        Heerich: window.Heerich,
        reducedMotion: false,
        data: entry.demoData
      });
      handle.resume();
      reportEntry.mountMs = mountTimes.get(entry.id) ?? null;
      reportEntry.faceCount = stage.querySelectorAll("polygon, path").length;
      const budget = entry.budget.maxFaces;
      if (reportEntry.faceCount > budget) {
        reportEntry.error = `face count ${reportEntry.faceCount} exceeds budget ${budget}`;
      }
      label.textContent += ` \u2014 ${reportEntry.faceCount} faces, ${reportEntry.mountMs?.toFixed(1) ?? "?"} ms`;
      if (reportEntry.error) {
        card.classList.add("failed");
        label.textContent += ` \u2014 OVER BUDGET`;
      }
    } catch (error) {
      reportEntry.error = String(error);
      card.classList.add("failed");
      label.textContent += ` \u2014 ERROR: ${String(error)}`;
    }
  }
  report.done = true;
  const failures = report.entries.filter((entry) => entry.error !== null);
  const summary = document.getElementById("summary");
  if (summary) {
    summary.textContent = failures.length === 0 ? `All ${report.entries.length} experiments mounted cleanly.` : `${failures.length}/${report.entries.length} failed: ${failures.map((f2) => f2.id).join(", ")}`;
    summary.className = failures.length === 0 ? "ok" : "bad";
  }
}
void mountAll();
/**
 * Anime.js - ESM bundle
 * @version v4.3.5
 * @license MIT
 * @copyright 2026 - Julian Garnier
 */
