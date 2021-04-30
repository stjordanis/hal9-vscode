// d3-require v1.2.4 Copyright 2019 Observable, Inc.
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e=e||self).d3=e.d3||{})}(this,function(e){"use strict";const n=new Map,t=[],r=t.map,o=t.some,s=t.hasOwnProperty,i="https://cdn.jsdelivr.net/npm/",l=/^((?:@[^\/@]+\/)?[^\/@]+)(?:@([^\/]+))?(?:\/(.*))?$/,u=/^\d+\.\d+\.\d+(-[\w-.+]+)?$/,c=/\.[^\/]*$/,a=["unpkg","jsdelivr","browser","main"];class RequireError extends Error{constructor(e){super(e)}}function p(e){const n=l.exec(e);return n&&{name:n[1],version:n[2],path:n[3]}}function f(e){const t=`${i}${e.name}${e.version?`@${e.version}`:""}/package.json`;let r=n.get(t);return r||n.set(t,r=fetch(t).then(e=>{if(!e.ok)throw new RequireError("unable to load package.json");return e.redirected&&!n.has(e.url)&&n.set(e.url,r),e.json()})),r}RequireError.prototype.name=RequireError.name;var d=h(async function(e,n){if(e.startsWith(i)&&(e=e.substring(i.length)),/^(\w+:)|\/\//i.test(e))return e;if(/^[.]{0,2}\//i.test(e))return new URL(e,null==n?location:n).href;if(!e.length||/^[\s._]/.test(e)||/\s$/.test(e))throw new RequireError("illegal name");const t=p(e);if(!t)return`${i}${e}`;if(!t.version&&null!=n&&n.startsWith(i)){const e=await f(p(n.substring(i.length)));t.version=e.dependencies&&e.dependencies[t.name]||e.peerDependencies&&e.peerDependencies[t.name]}if(t.path&&!c.test(t.path)&&(t.path+=".js"),t.path&&t.version&&u.test(t.version))return`${i}${t.name}@${t.version}/${t.path}`;const r=await f(t);return`${i}${r.name}@${r.version}/${t.path||function(e){for(const n of a){const t=e[n];if("string"==typeof t)return c.test(t)?t:`${t}.js`}}(r)||"index.js"}`});function h(e){const n=new Map,o=i(null);function s(e){if("string"!=typeof e)return e;let r=n.get(e);return r||n.set(e,r=new Promise((n,r)=>{const o=document.createElement("script");o.onload=()=>{try{n(t.pop()(i(e)))}catch(e){r(new RequireError("invalid module"))}o.remove()},o.onerror=()=>{r(new RequireError("unable to load module")),o.remove()},o.async=!0,o.src=e,window.define=v,document.head.appendChild(o)})),r}function i(n){return t=>Promise.resolve(e(t,n)).then(s)}function l(e){return arguments.length>1?Promise.all(r.call(arguments,o)).then(m):o(e)}return l.alias=function(n){return h((t,r)=>t in n&&(r=null,"string"!=typeof(t=n[t]))?t:e(t,r))},l.resolve=e,l}function m(e){const n={};for(const t of e)for(const e in t)s.call(t,e)&&(null==t[e]?Object.defineProperty(n,e,{get:$(t,e)}):n[e]=t[e]);return n}function $(e,n){return()=>e[n]}function g(e){return"exports"===(e+="")||"module"===e}function v(e,n,s){const i=arguments.length;i<2?(s=e,n=[]):i<3&&(s=n,n="string"==typeof e?[]:e),t.push(o.call(n,g)?e=>{const t={},o={exports:t};return Promise.all(r.call(n,n=>"exports"===(n+="")?t:"module"===n?o:e(n))).then(e=>(s.apply(null,e),o.exports))}:e=>Promise.all(r.call(n,e)).then(e=>"function"==typeof s?s.apply(null,e):s))}v.amd={},e.RequireError=RequireError,e.require=d,e.requireFrom=h,Object.defineProperty(e,"__esModule",{value:!0})});

require = d3.require;
