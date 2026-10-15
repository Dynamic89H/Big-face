var qy=Object.defineProperty;var $y=(t,e,n)=>e in t?qy(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var gm=(t,e,n)=>$y(t,typeof e!="symbol"?e+"":e,n);function Yy(t,e){for(var n=0;n<e.length;n++){const i=e[n];if(typeof i!="string"&&!Array.isArray(i)){for(const r in i)if(r!=="default"&&!(r in t)){const s=Object.getOwnPropertyDescriptor(i,r);s&&Object.defineProperty(t,r,s.get?s:{enumerable:!0,get:()=>i[r]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function r0(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var s0={exports:{}},Kc={},a0={exports:{}},tt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ho=Symbol.for("react.element"),Ky=Symbol.for("react.portal"),Zy=Symbol.for("react.fragment"),Jy=Symbol.for("react.strict_mode"),Qy=Symbol.for("react.profiler"),eS=Symbol.for("react.provider"),tS=Symbol.for("react.context"),nS=Symbol.for("react.forward_ref"),iS=Symbol.for("react.suspense"),rS=Symbol.for("react.memo"),sS=Symbol.for("react.lazy"),vm=Symbol.iterator;function aS(t){return t===null||typeof t!="object"?null:(t=vm&&t[vm]||t["@@iterator"],typeof t=="function"?t:null)}var o0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},l0=Object.assign,c0={};function Sa(t,e,n){this.props=t,this.context=e,this.refs=c0,this.updater=n||o0}Sa.prototype.isReactComponent={};Sa.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Sa.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function u0(){}u0.prototype=Sa.prototype;function Uh(t,e,n){this.props=t,this.context=e,this.refs=c0,this.updater=n||o0}var Oh=Uh.prototype=new u0;Oh.constructor=Uh;l0(Oh,Sa.prototype);Oh.isPureReactComponent=!0;var _m=Array.isArray,d0=Object.prototype.hasOwnProperty,Fh={current:null},f0={key:!0,ref:!0,__self:!0,__source:!0};function h0(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)d0.call(e,i)&&!f0.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:Ho,type:t,key:s,ref:a,props:r,_owner:Fh.current}}function oS(t,e){return{$$typeof:Ho,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function kh(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ho}function lS(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var xm=/\/+/g;function bu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?lS(""+t.key):e.toString(36)}function jl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Ho:case Ky:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+bu(a,0):i,_m(r)?(n="",t!=null&&(n=t.replace(xm,"$&/")+"/"),jl(r,e,n,"",function(c){return c})):r!=null&&(kh(r)&&(r=oS(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(xm,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",_m(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+bu(s,o);a+=jl(s,e,n,l,r)}else if(l=aS(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+bu(s,o++),a+=jl(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function Jo(t,e,n){if(t==null)return t;var i=[],r=0;return jl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function cS(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var yn={current:null},Wl={transition:null},uS={ReactCurrentDispatcher:yn,ReactCurrentBatchConfig:Wl,ReactCurrentOwner:Fh};function p0(){throw Error("act(...) is not supported in production builds of React.")}tt.Children={map:Jo,forEach:function(t,e,n){Jo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Jo(t,function(){e++}),e},toArray:function(t){return Jo(t,function(e){return e})||[]},only:function(t){if(!kh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};tt.Component=Sa;tt.Fragment=Zy;tt.Profiler=Qy;tt.PureComponent=Uh;tt.StrictMode=Jy;tt.Suspense=iS;tt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=uS;tt.act=p0;tt.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=l0({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Fh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)d0.call(e,l)&&!f0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:Ho,type:t.type,key:r,ref:s,props:i,_owner:a}};tt.createContext=function(t){return t={$$typeof:tS,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:eS,_context:t},t.Consumer=t};tt.createElement=h0;tt.createFactory=function(t){var e=h0.bind(null,t);return e.type=t,e};tt.createRef=function(){return{current:null}};tt.forwardRef=function(t){return{$$typeof:nS,render:t}};tt.isValidElement=kh;tt.lazy=function(t){return{$$typeof:sS,_payload:{_status:-1,_result:t},_init:cS}};tt.memo=function(t,e){return{$$typeof:rS,type:t,compare:e===void 0?null:e}};tt.startTransition=function(t){var e=Wl.transition;Wl.transition={};try{t()}finally{Wl.transition=e}};tt.unstable_act=p0;tt.useCallback=function(t,e){return yn.current.useCallback(t,e)};tt.useContext=function(t){return yn.current.useContext(t)};tt.useDebugValue=function(){};tt.useDeferredValue=function(t){return yn.current.useDeferredValue(t)};tt.useEffect=function(t,e){return yn.current.useEffect(t,e)};tt.useId=function(){return yn.current.useId()};tt.useImperativeHandle=function(t,e,n){return yn.current.useImperativeHandle(t,e,n)};tt.useInsertionEffect=function(t,e){return yn.current.useInsertionEffect(t,e)};tt.useLayoutEffect=function(t,e){return yn.current.useLayoutEffect(t,e)};tt.useMemo=function(t,e){return yn.current.useMemo(t,e)};tt.useReducer=function(t,e,n){return yn.current.useReducer(t,e,n)};tt.useRef=function(t){return yn.current.useRef(t)};tt.useState=function(t){return yn.current.useState(t)};tt.useSyncExternalStore=function(t,e,n){return yn.current.useSyncExternalStore(t,e,n)};tt.useTransition=function(){return yn.current.useTransition()};tt.version="18.3.1";a0.exports=tt;var P=a0.exports;const Ot=r0(P),dS=Yy({__proto__:null,default:Ot},[P]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fS=P,hS=Symbol.for("react.element"),pS=Symbol.for("react.fragment"),mS=Object.prototype.hasOwnProperty,gS=fS.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,vS={key:!0,ref:!0,__self:!0,__source:!0};function m0(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)mS.call(e,i)&&!vS.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:hS,type:t,key:s,ref:a,props:r,_owner:gS.current}}Kc.Fragment=pS;Kc.jsx=m0;Kc.jsxs=m0;s0.exports=Kc;var u=s0.exports,Hd={},g0={exports:{}},Gn={},v0={exports:{}},_0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(O,L){var q=O.length;O.push(L);e:for(;0<q;){var Z=q-1>>>1,ce=O[Z];if(0<r(ce,L))O[Z]=L,O[q]=ce,q=Z;else break e}}function n(O){return O.length===0?null:O[0]}function i(O){if(O.length===0)return null;var L=O[0],q=O.pop();if(q!==L){O[0]=q;e:for(var Z=0,ce=O.length,_e=ce>>>1;Z<_e;){var se=2*(Z+1)-1,Me=O[se],de=se+1,j=O[de];if(0>r(Me,q))de<ce&&0>r(j,Me)?(O[Z]=j,O[de]=q,Z=de):(O[Z]=Me,O[se]=q,Z=se);else if(de<ce&&0>r(j,q))O[Z]=j,O[de]=q,Z=de;else break e}}return L}function r(O,L){var q=O.sortIndex-L.sortIndex;return q!==0?q:O.id-L.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],h=1,p=null,d=3,g=!1,x=!1,S=!1,m=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function M(O){for(var L=n(c);L!==null;){if(L.callback===null)i(c);else if(L.startTime<=O)i(c),L.sortIndex=L.expirationTime,e(l,L);else break;L=n(c)}}function v(O){if(S=!1,M(O),!x)if(n(l)!==null)x=!0,G(w);else{var L=n(c);L!==null&&U(v,L.startTime-O)}}function w(O,L){x=!1,S&&(S=!1,f(y),y=-1),g=!0;var q=d;try{for(M(L),p=n(l);p!==null&&(!(p.expirationTime>L)||O&&!D());){var Z=p.callback;if(typeof Z=="function"){p.callback=null,d=p.priorityLevel;var ce=Z(p.expirationTime<=L);L=t.unstable_now(),typeof ce=="function"?p.callback=ce:p===n(l)&&i(l),M(L)}else i(l);p=n(l)}if(p!==null)var _e=!0;else{var se=n(c);se!==null&&U(v,se.startTime-L),_e=!1}return _e}finally{p=null,d=q,g=!1}}var T=!1,A=null,y=-1,C=5,N=-1;function D(){return!(t.unstable_now()-N<C)}function B(){if(A!==null){var O=t.unstable_now();N=O;var L=!0;try{L=A(!0,O)}finally{L?F():(T=!1,A=null)}}else T=!1}var F;if(typeof _=="function")F=function(){_(B)};else if(typeof MessageChannel<"u"){var I=new MessageChannel,k=I.port2;I.port1.onmessage=B,F=function(){k.postMessage(null)}}else F=function(){m(B,0)};function G(O){A=O,T||(T=!0,F())}function U(O,L){y=m(function(){O(t.unstable_now())},L)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(O){O.callback=null},t.unstable_continueExecution=function(){x||g||(x=!0,G(w))},t.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<O?Math.floor(1e3/O):5},t.unstable_getCurrentPriorityLevel=function(){return d},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(O){switch(d){case 1:case 2:case 3:var L=3;break;default:L=d}var q=d;d=L;try{return O()}finally{d=q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(O,L){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var q=d;d=O;try{return L()}finally{d=q}},t.unstable_scheduleCallback=function(O,L,q){var Z=t.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?Z+q:Z):q=Z,O){case 1:var ce=-1;break;case 2:ce=250;break;case 5:ce=1073741823;break;case 4:ce=1e4;break;default:ce=5e3}return ce=q+ce,O={id:h++,callback:L,priorityLevel:O,startTime:q,expirationTime:ce,sortIndex:-1},q>Z?(O.sortIndex=q,e(c,O),n(l)===null&&O===n(c)&&(S?(f(y),y=-1):S=!0,U(v,q-Z))):(O.sortIndex=ce,e(l,O),x||g||(x=!0,G(w))),O},t.unstable_shouldYield=D,t.unstable_wrapCallback=function(O){var L=d;return function(){var q=d;d=L;try{return O.apply(this,arguments)}finally{d=q}}}})(_0);v0.exports=_0;var _S=v0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xS=P,Vn=_S;function oe(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var x0=new Set,po={};function xs(t,e){da(t,e),da(t+"Capture",e)}function da(t,e){for(po[t]=e,t=0;t<e.length;t++)x0.add(e[t])}var rr=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Vd=Object.prototype.hasOwnProperty,yS=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,ym={},Sm={};function SS(t){return Vd.call(Sm,t)?!0:Vd.call(ym,t)?!1:yS.test(t)?Sm[t]=!0:(ym[t]=!0,!1)}function ES(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function MS(t,e,n,i){if(e===null||typeof e>"u"||ES(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Sn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var sn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){sn[t]=new Sn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];sn[e]=new Sn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){sn[t]=new Sn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){sn[t]=new Sn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){sn[t]=new Sn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){sn[t]=new Sn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){sn[t]=new Sn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){sn[t]=new Sn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){sn[t]=new Sn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Bh=/[\-:]([a-z])/g;function zh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Bh,zh);sn[e]=new Sn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Bh,zh);sn[e]=new Sn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Bh,zh);sn[e]=new Sn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){sn[t]=new Sn(t,1,!1,t.toLowerCase(),null,!1,!1)});sn.xlinkHref=new Sn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){sn[t]=new Sn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Hh(t,e,n,i){var r=sn.hasOwnProperty(e)?sn[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(MS(e,n,r,i)&&(n=null),i||r===null?SS(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var ur=xS.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Qo=Symbol.for("react.element"),Hs=Symbol.for("react.portal"),Vs=Symbol.for("react.fragment"),Vh=Symbol.for("react.strict_mode"),Gd=Symbol.for("react.profiler"),y0=Symbol.for("react.provider"),S0=Symbol.for("react.context"),Gh=Symbol.for("react.forward_ref"),jd=Symbol.for("react.suspense"),Wd=Symbol.for("react.suspense_list"),jh=Symbol.for("react.memo"),Sr=Symbol.for("react.lazy"),E0=Symbol.for("react.offscreen"),Em=Symbol.iterator;function Aa(t){return t===null||typeof t!="object"?null:(t=Em&&t[Em]||t["@@iterator"],typeof t=="function"?t:null)}var Lt=Object.assign,Cu;function $a(t){if(Cu===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Cu=e&&e[1]||""}return`
`+Cu+t}var Au=!1;function Ru(t,e){if(!t||Au)return"";Au=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Au=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?$a(t):""}function wS(t){switch(t.tag){case 5:return $a(t.type);case 16:return $a("Lazy");case 13:return $a("Suspense");case 19:return $a("SuspenseList");case 0:case 2:case 15:return t=Ru(t.type,!1),t;case 11:return t=Ru(t.type.render,!1),t;case 1:return t=Ru(t.type,!0),t;default:return""}}function Xd(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Vs:return"Fragment";case Hs:return"Portal";case Gd:return"Profiler";case Vh:return"StrictMode";case jd:return"Suspense";case Wd:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case S0:return(t.displayName||"Context")+".Consumer";case y0:return(t._context.displayName||"Context")+".Provider";case Gh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case jh:return e=t.displayName||null,e!==null?e:Xd(t.type)||"Memo";case Sr:e=t._payload,t=t._init;try{return Xd(t(e))}catch{}}return null}function TS(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Xd(e);case 8:return e===Vh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Br(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function M0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function bS(t){var e=M0(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function el(t){t._valueTracker||(t._valueTracker=bS(t))}function w0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=M0(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function mc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function qd(t,e){var n=e.checked;return Lt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Mm(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=Br(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function T0(t,e){e=e.checked,e!=null&&Hh(t,"checked",e,!1)}function $d(t,e){T0(t,e);var n=Br(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Yd(t,e.type,n):e.hasOwnProperty("defaultValue")&&Yd(t,e.type,Br(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function wm(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Yd(t,e,n){(e!=="number"||mc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ya=Array.isArray;function ta(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+Br(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Kd(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(oe(91));return Lt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Tm(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(oe(92));if(Ya(n)){if(1<n.length)throw Error(oe(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Br(n)}}function b0(t,e){var n=Br(e.value),i=Br(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function bm(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function C0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Zd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?C0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var tl,A0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(tl=tl||document.createElement("div"),tl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=tl.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function mo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var no={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},CS=["Webkit","ms","Moz","O"];Object.keys(no).forEach(function(t){CS.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),no[e]=no[t]})});function R0(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||no.hasOwnProperty(t)&&no[t]?(""+e).trim():e+"px"}function P0(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=R0(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var AS=Lt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Jd(t,e){if(e){if(AS[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(oe(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(oe(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(oe(61))}if(e.style!=null&&typeof e.style!="object")throw Error(oe(62))}}function Qd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ef=null;function Wh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var tf=null,na=null,ia=null;function Cm(t){if(t=jo(t)){if(typeof tf!="function")throw Error(oe(280));var e=t.stateNode;e&&(e=tu(e),tf(t.stateNode,t.type,e))}}function N0(t){na?ia?ia.push(t):ia=[t]:na=t}function L0(){if(na){var t=na,e=ia;if(ia=na=null,Cm(t),e)for(t=0;t<e.length;t++)Cm(e[t])}}function D0(t,e){return t(e)}function I0(){}var Pu=!1;function U0(t,e,n){if(Pu)return t(e,n);Pu=!0;try{return D0(t,e,n)}finally{Pu=!1,(na!==null||ia!==null)&&(I0(),L0())}}function go(t,e){var n=t.stateNode;if(n===null)return null;var i=tu(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(oe(231,e,typeof n));return n}var nf=!1;if(rr)try{var Ra={};Object.defineProperty(Ra,"passive",{get:function(){nf=!0}}),window.addEventListener("test",Ra,Ra),window.removeEventListener("test",Ra,Ra)}catch{nf=!1}function RS(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(h){this.onError(h)}}var io=!1,gc=null,vc=!1,rf=null,PS={onError:function(t){io=!0,gc=t}};function NS(t,e,n,i,r,s,a,o,l){io=!1,gc=null,RS.apply(PS,arguments)}function LS(t,e,n,i,r,s,a,o,l){if(NS.apply(this,arguments),io){if(io){var c=gc;io=!1,gc=null}else throw Error(oe(198));vc||(vc=!0,rf=c)}}function ys(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function O0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Am(t){if(ys(t)!==t)throw Error(oe(188))}function DS(t){var e=t.alternate;if(!e){if(e=ys(t),e===null)throw Error(oe(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Am(r),t;if(s===i)return Am(r),e;s=s.sibling}throw Error(oe(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(oe(189))}}if(n.alternate!==i)throw Error(oe(190))}if(n.tag!==3)throw Error(oe(188));return n.stateNode.current===n?t:e}function F0(t){return t=DS(t),t!==null?k0(t):null}function k0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=k0(t);if(e!==null)return e;t=t.sibling}return null}var B0=Vn.unstable_scheduleCallback,Rm=Vn.unstable_cancelCallback,IS=Vn.unstable_shouldYield,US=Vn.unstable_requestPaint,Ft=Vn.unstable_now,OS=Vn.unstable_getCurrentPriorityLevel,Xh=Vn.unstable_ImmediatePriority,z0=Vn.unstable_UserBlockingPriority,_c=Vn.unstable_NormalPriority,FS=Vn.unstable_LowPriority,H0=Vn.unstable_IdlePriority,Zc=null,Ni=null;function kS(t){if(Ni&&typeof Ni.onCommitFiberRoot=="function")try{Ni.onCommitFiberRoot(Zc,t,void 0,(t.current.flags&128)===128)}catch{}}var gi=Math.clz32?Math.clz32:HS,BS=Math.log,zS=Math.LN2;function HS(t){return t>>>=0,t===0?32:31-(BS(t)/zS|0)|0}var nl=64,il=4194304;function Ka(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function xc(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=Ka(o):(s&=a,s!==0&&(i=Ka(s)))}else a=n&~r,a!==0?i=Ka(a):s!==0&&(i=Ka(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-gi(e),r=1<<n,i|=t[n],e&=~r;return i}function VS(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function GS(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-gi(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=VS(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function sf(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function V0(){var t=nl;return nl<<=1,!(nl&4194240)&&(nl=64),t}function Nu(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Vo(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-gi(e),t[e]=n}function jS(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-gi(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function qh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-gi(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var pt=0;function G0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var j0,$h,W0,X0,q0,af=!1,rl=[],Pr=null,Nr=null,Lr=null,vo=new Map,_o=new Map,wr=[],WS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Pm(t,e){switch(t){case"focusin":case"focusout":Pr=null;break;case"dragenter":case"dragleave":Nr=null;break;case"mouseover":case"mouseout":Lr=null;break;case"pointerover":case"pointerout":vo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":_o.delete(e.pointerId)}}function Pa(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=jo(e),e!==null&&$h(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function XS(t,e,n,i,r){switch(e){case"focusin":return Pr=Pa(Pr,t,e,n,i,r),!0;case"dragenter":return Nr=Pa(Nr,t,e,n,i,r),!0;case"mouseover":return Lr=Pa(Lr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return vo.set(s,Pa(vo.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,_o.set(s,Pa(_o.get(s)||null,t,e,n,i,r)),!0}return!1}function $0(t){var e=ns(t.target);if(e!==null){var n=ys(e);if(n!==null){if(e=n.tag,e===13){if(e=O0(n),e!==null){t.blockedOn=e,q0(t.priority,function(){W0(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Xl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=of(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);ef=i,n.target.dispatchEvent(i),ef=null}else return e=jo(n),e!==null&&$h(e),t.blockedOn=n,!1;e.shift()}return!0}function Nm(t,e,n){Xl(t)&&n.delete(e)}function qS(){af=!1,Pr!==null&&Xl(Pr)&&(Pr=null),Nr!==null&&Xl(Nr)&&(Nr=null),Lr!==null&&Xl(Lr)&&(Lr=null),vo.forEach(Nm),_o.forEach(Nm)}function Na(t,e){t.blockedOn===e&&(t.blockedOn=null,af||(af=!0,Vn.unstable_scheduleCallback(Vn.unstable_NormalPriority,qS)))}function xo(t){function e(r){return Na(r,t)}if(0<rl.length){Na(rl[0],t);for(var n=1;n<rl.length;n++){var i=rl[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Pr!==null&&Na(Pr,t),Nr!==null&&Na(Nr,t),Lr!==null&&Na(Lr,t),vo.forEach(e),_o.forEach(e),n=0;n<wr.length;n++)i=wr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<wr.length&&(n=wr[0],n.blockedOn===null);)$0(n),n.blockedOn===null&&wr.shift()}var ra=ur.ReactCurrentBatchConfig,yc=!0;function $S(t,e,n,i){var r=pt,s=ra.transition;ra.transition=null;try{pt=1,Yh(t,e,n,i)}finally{pt=r,ra.transition=s}}function YS(t,e,n,i){var r=pt,s=ra.transition;ra.transition=null;try{pt=4,Yh(t,e,n,i)}finally{pt=r,ra.transition=s}}function Yh(t,e,n,i){if(yc){var r=of(t,e,n,i);if(r===null)Hu(t,e,i,Sc,n),Pm(t,i);else if(XS(r,t,e,n,i))i.stopPropagation();else if(Pm(t,i),e&4&&-1<WS.indexOf(t)){for(;r!==null;){var s=jo(r);if(s!==null&&j0(s),s=of(t,e,n,i),s===null&&Hu(t,e,i,Sc,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Hu(t,e,i,null,n)}}var Sc=null;function of(t,e,n,i){if(Sc=null,t=Wh(i),t=ns(t),t!==null)if(e=ys(t),e===null)t=null;else if(n=e.tag,n===13){if(t=O0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Sc=t,null}function Y0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(OS()){case Xh:return 1;case z0:return 4;case _c:case FS:return 16;case H0:return 536870912;default:return 16}default:return 16}}var Cr=null,Kh=null,ql=null;function K0(){if(ql)return ql;var t,e=Kh,n=e.length,i,r="value"in Cr?Cr.value:Cr.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return ql=r.slice(t,1<i?1-i:void 0)}function $l(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function sl(){return!0}function Lm(){return!1}function jn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?sl:Lm,this.isPropagationStopped=Lm,this}return Lt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=sl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=sl)},persist:function(){},isPersistent:sl}),e}var Ea={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Zh=jn(Ea),Go=Lt({},Ea,{view:0,detail:0}),KS=jn(Go),Lu,Du,La,Jc=Lt({},Go,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Jh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==La&&(La&&t.type==="mousemove"?(Lu=t.screenX-La.screenX,Du=t.screenY-La.screenY):Du=Lu=0,La=t),Lu)},movementY:function(t){return"movementY"in t?t.movementY:Du}}),Dm=jn(Jc),ZS=Lt({},Jc,{dataTransfer:0}),JS=jn(ZS),QS=Lt({},Go,{relatedTarget:0}),Iu=jn(QS),eE=Lt({},Ea,{animationName:0,elapsedTime:0,pseudoElement:0}),tE=jn(eE),nE=Lt({},Ea,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),iE=jn(nE),rE=Lt({},Ea,{data:0}),Im=jn(rE),sE={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},aE={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},oE={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function lE(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=oE[t])?!!e[t]:!1}function Jh(){return lE}var cE=Lt({},Go,{key:function(t){if(t.key){var e=sE[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=$l(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?aE[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Jh,charCode:function(t){return t.type==="keypress"?$l(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?$l(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),uE=jn(cE),dE=Lt({},Jc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Um=jn(dE),fE=Lt({},Go,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Jh}),hE=jn(fE),pE=Lt({},Ea,{propertyName:0,elapsedTime:0,pseudoElement:0}),mE=jn(pE),gE=Lt({},Jc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),vE=jn(gE),_E=[9,13,27,32],Qh=rr&&"CompositionEvent"in window,ro=null;rr&&"documentMode"in document&&(ro=document.documentMode);var xE=rr&&"TextEvent"in window&&!ro,Z0=rr&&(!Qh||ro&&8<ro&&11>=ro),Om=" ",Fm=!1;function J0(t,e){switch(t){case"keyup":return _E.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Q0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Gs=!1;function yE(t,e){switch(t){case"compositionend":return Q0(e);case"keypress":return e.which!==32?null:(Fm=!0,Om);case"textInput":return t=e.data,t===Om&&Fm?null:t;default:return null}}function SE(t,e){if(Gs)return t==="compositionend"||!Qh&&J0(t,e)?(t=K0(),ql=Kh=Cr=null,Gs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Z0&&e.locale!=="ko"?null:e.data;default:return null}}var EE={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function km(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!EE[t.type]:e==="textarea"}function e_(t,e,n,i){N0(i),e=Ec(e,"onChange"),0<e.length&&(n=new Zh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var so=null,yo=null;function ME(t){d_(t,0)}function Qc(t){var e=Xs(t);if(w0(e))return t}function wE(t,e){if(t==="change")return e}var t_=!1;if(rr){var Uu;if(rr){var Ou="oninput"in document;if(!Ou){var Bm=document.createElement("div");Bm.setAttribute("oninput","return;"),Ou=typeof Bm.oninput=="function"}Uu=Ou}else Uu=!1;t_=Uu&&(!document.documentMode||9<document.documentMode)}function zm(){so&&(so.detachEvent("onpropertychange",n_),yo=so=null)}function n_(t){if(t.propertyName==="value"&&Qc(yo)){var e=[];e_(e,yo,t,Wh(t)),U0(ME,e)}}function TE(t,e,n){t==="focusin"?(zm(),so=e,yo=n,so.attachEvent("onpropertychange",n_)):t==="focusout"&&zm()}function bE(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Qc(yo)}function CE(t,e){if(t==="click")return Qc(e)}function AE(t,e){if(t==="input"||t==="change")return Qc(e)}function RE(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var xi=typeof Object.is=="function"?Object.is:RE;function So(t,e){if(xi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Vd.call(e,r)||!xi(t[r],e[r]))return!1}return!0}function Hm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Vm(t,e){var n=Hm(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Hm(n)}}function i_(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?i_(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function r_(){for(var t=window,e=mc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=mc(t.document)}return e}function ep(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function PE(t){var e=r_(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&i_(n.ownerDocument.documentElement,n)){if(i!==null&&ep(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Vm(n,s);var a=Vm(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var NE=rr&&"documentMode"in document&&11>=document.documentMode,js=null,lf=null,ao=null,cf=!1;function Gm(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;cf||js==null||js!==mc(i)||(i=js,"selectionStart"in i&&ep(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ao&&So(ao,i)||(ao=i,i=Ec(lf,"onSelect"),0<i.length&&(e=new Zh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=js)))}function al(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ws={animationend:al("Animation","AnimationEnd"),animationiteration:al("Animation","AnimationIteration"),animationstart:al("Animation","AnimationStart"),transitionend:al("Transition","TransitionEnd")},Fu={},s_={};rr&&(s_=document.createElement("div").style,"AnimationEvent"in window||(delete Ws.animationend.animation,delete Ws.animationiteration.animation,delete Ws.animationstart.animation),"TransitionEvent"in window||delete Ws.transitionend.transition);function eu(t){if(Fu[t])return Fu[t];if(!Ws[t])return t;var e=Ws[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in s_)return Fu[t]=e[n];return t}var a_=eu("animationend"),o_=eu("animationiteration"),l_=eu("animationstart"),c_=eu("transitionend"),u_=new Map,jm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Gr(t,e){u_.set(t,e),xs(e,[t])}for(var ku=0;ku<jm.length;ku++){var Bu=jm[ku],LE=Bu.toLowerCase(),DE=Bu[0].toUpperCase()+Bu.slice(1);Gr(LE,"on"+DE)}Gr(a_,"onAnimationEnd");Gr(o_,"onAnimationIteration");Gr(l_,"onAnimationStart");Gr("dblclick","onDoubleClick");Gr("focusin","onFocus");Gr("focusout","onBlur");Gr(c_,"onTransitionEnd");da("onMouseEnter",["mouseout","mouseover"]);da("onMouseLeave",["mouseout","mouseover"]);da("onPointerEnter",["pointerout","pointerover"]);da("onPointerLeave",["pointerout","pointerover"]);xs("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));xs("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));xs("onBeforeInput",["compositionend","keypress","textInput","paste"]);xs("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));xs("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));xs("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Za="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),IE=new Set("cancel close invalid load scroll toggle".split(" ").concat(Za));function Wm(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,LS(i,e,void 0,t),t.currentTarget=null}function d_(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Wm(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Wm(r,o,c),s=l}}}if(vc)throw t=rf,vc=!1,rf=null,t}function St(t,e){var n=e[pf];n===void 0&&(n=e[pf]=new Set);var i=t+"__bubble";n.has(i)||(f_(e,t,2,!1),n.add(i))}function zu(t,e,n){var i=0;e&&(i|=4),f_(n,t,i,e)}var ol="_reactListening"+Math.random().toString(36).slice(2);function Eo(t){if(!t[ol]){t[ol]=!0,x0.forEach(function(n){n!=="selectionchange"&&(IE.has(n)||zu(n,!1,t),zu(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ol]||(e[ol]=!0,zu("selectionchange",!1,e))}}function f_(t,e,n,i){switch(Y0(e)){case 1:var r=$S;break;case 4:r=YS;break;default:r=Yh}n=r.bind(null,e,n,t),r=void 0,!nf||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Hu(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=ns(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}U0(function(){var c=s,h=Wh(n),p=[];e:{var d=u_.get(t);if(d!==void 0){var g=Zh,x=t;switch(t){case"keypress":if($l(n)===0)break e;case"keydown":case"keyup":g=uE;break;case"focusin":x="focus",g=Iu;break;case"focusout":x="blur",g=Iu;break;case"beforeblur":case"afterblur":g=Iu;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=Dm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=JS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=hE;break;case a_:case o_:case l_:g=tE;break;case c_:g=mE;break;case"scroll":g=KS;break;case"wheel":g=vE;break;case"copy":case"cut":case"paste":g=iE;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=Um}var S=(e&4)!==0,m=!S&&t==="scroll",f=S?d!==null?d+"Capture":null:d;S=[];for(var _=c,M;_!==null;){M=_;var v=M.stateNode;if(M.tag===5&&v!==null&&(M=v,f!==null&&(v=go(_,f),v!=null&&S.push(Mo(_,v,M)))),m)break;_=_.return}0<S.length&&(d=new g(d,x,null,n,h),p.push({event:d,listeners:S}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",g=t==="mouseout"||t==="pointerout",d&&n!==ef&&(x=n.relatedTarget||n.fromElement)&&(ns(x)||x[sr]))break e;if((g||d)&&(d=h.window===h?h:(d=h.ownerDocument)?d.defaultView||d.parentWindow:window,g?(x=n.relatedTarget||n.toElement,g=c,x=x?ns(x):null,x!==null&&(m=ys(x),x!==m||x.tag!==5&&x.tag!==6)&&(x=null)):(g=null,x=c),g!==x)){if(S=Dm,v="onMouseLeave",f="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(S=Um,v="onPointerLeave",f="onPointerEnter",_="pointer"),m=g==null?d:Xs(g),M=x==null?d:Xs(x),d=new S(v,_+"leave",g,n,h),d.target=m,d.relatedTarget=M,v=null,ns(h)===c&&(S=new S(f,_+"enter",x,n,h),S.target=M,S.relatedTarget=m,v=S),m=v,g&&x)t:{for(S=g,f=x,_=0,M=S;M;M=Ms(M))_++;for(M=0,v=f;v;v=Ms(v))M++;for(;0<_-M;)S=Ms(S),_--;for(;0<M-_;)f=Ms(f),M--;for(;_--;){if(S===f||f!==null&&S===f.alternate)break t;S=Ms(S),f=Ms(f)}S=null}else S=null;g!==null&&Xm(p,d,g,S,!1),x!==null&&m!==null&&Xm(p,m,x,S,!0)}}e:{if(d=c?Xs(c):window,g=d.nodeName&&d.nodeName.toLowerCase(),g==="select"||g==="input"&&d.type==="file")var w=wE;else if(km(d))if(t_)w=AE;else{w=bE;var T=TE}else(g=d.nodeName)&&g.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(w=CE);if(w&&(w=w(t,c))){e_(p,w,n,h);break e}T&&T(t,d,c),t==="focusout"&&(T=d._wrapperState)&&T.controlled&&d.type==="number"&&Yd(d,"number",d.value)}switch(T=c?Xs(c):window,t){case"focusin":(km(T)||T.contentEditable==="true")&&(js=T,lf=c,ao=null);break;case"focusout":ao=lf=js=null;break;case"mousedown":cf=!0;break;case"contextmenu":case"mouseup":case"dragend":cf=!1,Gm(p,n,h);break;case"selectionchange":if(NE)break;case"keydown":case"keyup":Gm(p,n,h)}var A;if(Qh)e:{switch(t){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else Gs?J0(t,n)&&(y="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(y="onCompositionStart");y&&(Z0&&n.locale!=="ko"&&(Gs||y!=="onCompositionStart"?y==="onCompositionEnd"&&Gs&&(A=K0()):(Cr=h,Kh="value"in Cr?Cr.value:Cr.textContent,Gs=!0)),T=Ec(c,y),0<T.length&&(y=new Im(y,t,null,n,h),p.push({event:y,listeners:T}),A?y.data=A:(A=Q0(n),A!==null&&(y.data=A)))),(A=xE?yE(t,n):SE(t,n))&&(c=Ec(c,"onBeforeInput"),0<c.length&&(h=new Im("onBeforeInput","beforeinput",null,n,h),p.push({event:h,listeners:c}),h.data=A))}d_(p,e)})}function Mo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Ec(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=go(t,n),s!=null&&i.unshift(Mo(t,s,r)),s=go(t,e),s!=null&&i.push(Mo(t,s,r))),t=t.return}return i}function Ms(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Xm(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=go(n,s),l!=null&&a.unshift(Mo(n,l,o))):r||(l=go(n,s),l!=null&&a.push(Mo(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var UE=/\r\n?/g,OE=/\u0000|\uFFFD/g;function qm(t){return(typeof t=="string"?t:""+t).replace(UE,`
`).replace(OE,"")}function ll(t,e,n){if(e=qm(e),qm(t)!==e&&n)throw Error(oe(425))}function Mc(){}var uf=null,df=null;function ff(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var hf=typeof setTimeout=="function"?setTimeout:void 0,FE=typeof clearTimeout=="function"?clearTimeout:void 0,$m=typeof Promise=="function"?Promise:void 0,kE=typeof queueMicrotask=="function"?queueMicrotask:typeof $m<"u"?function(t){return $m.resolve(null).then(t).catch(BE)}:hf;function BE(t){setTimeout(function(){throw t})}function Vu(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),xo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);xo(e)}function Dr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Ym(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ma=Math.random().toString(36).slice(2),Ci="__reactFiber$"+Ma,wo="__reactProps$"+Ma,sr="__reactContainer$"+Ma,pf="__reactEvents$"+Ma,zE="__reactListeners$"+Ma,HE="__reactHandles$"+Ma;function ns(t){var e=t[Ci];if(e)return e;for(var n=t.parentNode;n;){if(e=n[sr]||n[Ci]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Ym(t);t!==null;){if(n=t[Ci])return n;t=Ym(t)}return e}t=n,n=t.parentNode}return null}function jo(t){return t=t[Ci]||t[sr],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Xs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(oe(33))}function tu(t){return t[wo]||null}var mf=[],qs=-1;function jr(t){return{current:t}}function Mt(t){0>qs||(t.current=mf[qs],mf[qs]=null,qs--)}function xt(t,e){qs++,mf[qs]=t.current,t.current=e}var zr={},mn=jr(zr),An=jr(!1),ds=zr;function fa(t,e){var n=t.type.contextTypes;if(!n)return zr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function Rn(t){return t=t.childContextTypes,t!=null}function wc(){Mt(An),Mt(mn)}function Km(t,e,n){if(mn.current!==zr)throw Error(oe(168));xt(mn,e),xt(An,n)}function h_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(oe(108,TS(t)||"Unknown",r));return Lt({},n,i)}function Tc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||zr,ds=mn.current,xt(mn,t),xt(An,An.current),!0}function Zm(t,e,n){var i=t.stateNode;if(!i)throw Error(oe(169));n?(t=h_(t,e,ds),i.__reactInternalMemoizedMergedChildContext=t,Mt(An),Mt(mn),xt(mn,t)):Mt(An),xt(An,n)}var $i=null,nu=!1,Gu=!1;function p_(t){$i===null?$i=[t]:$i.push(t)}function VE(t){nu=!0,p_(t)}function Wr(){if(!Gu&&$i!==null){Gu=!0;var t=0,e=pt;try{var n=$i;for(pt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}$i=null,nu=!1}catch(r){throw $i!==null&&($i=$i.slice(t+1)),B0(Xh,Wr),r}finally{pt=e,Gu=!1}}return null}var $s=[],Ys=0,bc=null,Cc=0,Yn=[],Kn=0,fs=null,Ki=1,Zi="";function es(t,e){$s[Ys++]=Cc,$s[Ys++]=bc,bc=t,Cc=e}function m_(t,e,n){Yn[Kn++]=Ki,Yn[Kn++]=Zi,Yn[Kn++]=fs,fs=t;var i=Ki;t=Zi;var r=32-gi(i)-1;i&=~(1<<r),n+=1;var s=32-gi(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Ki=1<<32-gi(e)+r|n<<r|i,Zi=s+t}else Ki=1<<s|n<<r|i,Zi=t}function tp(t){t.return!==null&&(es(t,1),m_(t,1,0))}function np(t){for(;t===bc;)bc=$s[--Ys],$s[Ys]=null,Cc=$s[--Ys],$s[Ys]=null;for(;t===fs;)fs=Yn[--Kn],Yn[Kn]=null,Zi=Yn[--Kn],Yn[Kn]=null,Ki=Yn[--Kn],Yn[Kn]=null}var Hn=null,zn=null,wt=!1,hi=null;function g_(t,e){var n=Qn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function Jm(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Hn=t,zn=Dr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Hn=t,zn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=fs!==null?{id:Ki,overflow:Zi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Qn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Hn=t,zn=null,!0):!1;default:return!1}}function gf(t){return(t.mode&1)!==0&&(t.flags&128)===0}function vf(t){if(wt){var e=zn;if(e){var n=e;if(!Jm(t,e)){if(gf(t))throw Error(oe(418));e=Dr(n.nextSibling);var i=Hn;e&&Jm(t,e)?g_(i,n):(t.flags=t.flags&-4097|2,wt=!1,Hn=t)}}else{if(gf(t))throw Error(oe(418));t.flags=t.flags&-4097|2,wt=!1,Hn=t}}}function Qm(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Hn=t}function cl(t){if(t!==Hn)return!1;if(!wt)return Qm(t),wt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ff(t.type,t.memoizedProps)),e&&(e=zn)){if(gf(t))throw v_(),Error(oe(418));for(;e;)g_(t,e),e=Dr(e.nextSibling)}if(Qm(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(oe(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){zn=Dr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}zn=null}}else zn=Hn?Dr(t.stateNode.nextSibling):null;return!0}function v_(){for(var t=zn;t;)t=Dr(t.nextSibling)}function ha(){zn=Hn=null,wt=!1}function ip(t){hi===null?hi=[t]:hi.push(t)}var GE=ur.ReactCurrentBatchConfig;function Da(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(oe(309));var i=n.stateNode}if(!i)throw Error(oe(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(oe(284));if(!n._owner)throw Error(oe(290,t))}return t}function ul(t,e){throw t=Object.prototype.toString.call(e),Error(oe(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function eg(t){var e=t._init;return e(t._payload)}function __(t){function e(f,_){if(t){var M=f.deletions;M===null?(f.deletions=[_],f.flags|=16):M.push(_)}}function n(f,_){if(!t)return null;for(;_!==null;)e(f,_),_=_.sibling;return null}function i(f,_){for(f=new Map;_!==null;)_.key!==null?f.set(_.key,_):f.set(_.index,_),_=_.sibling;return f}function r(f,_){return f=Fr(f,_),f.index=0,f.sibling=null,f}function s(f,_,M){return f.index=M,t?(M=f.alternate,M!==null?(M=M.index,M<_?(f.flags|=2,_):M):(f.flags|=2,_)):(f.flags|=1048576,_)}function a(f){return t&&f.alternate===null&&(f.flags|=2),f}function o(f,_,M,v){return _===null||_.tag!==6?(_=Ku(M,f.mode,v),_.return=f,_):(_=r(_,M),_.return=f,_)}function l(f,_,M,v){var w=M.type;return w===Vs?h(f,_,M.props.children,v,M.key):_!==null&&(_.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Sr&&eg(w)===_.type)?(v=r(_,M.props),v.ref=Da(f,_,M),v.return=f,v):(v=tc(M.type,M.key,M.props,null,f.mode,v),v.ref=Da(f,_,M),v.return=f,v)}function c(f,_,M,v){return _===null||_.tag!==4||_.stateNode.containerInfo!==M.containerInfo||_.stateNode.implementation!==M.implementation?(_=Zu(M,f.mode,v),_.return=f,_):(_=r(_,M.children||[]),_.return=f,_)}function h(f,_,M,v,w){return _===null||_.tag!==7?(_=us(M,f.mode,v,w),_.return=f,_):(_=r(_,M),_.return=f,_)}function p(f,_,M){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Ku(""+_,f.mode,M),_.return=f,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Qo:return M=tc(_.type,_.key,_.props,null,f.mode,M),M.ref=Da(f,null,_),M.return=f,M;case Hs:return _=Zu(_,f.mode,M),_.return=f,_;case Sr:var v=_._init;return p(f,v(_._payload),M)}if(Ya(_)||Aa(_))return _=us(_,f.mode,M,null),_.return=f,_;ul(f,_)}return null}function d(f,_,M,v){var w=_!==null?_.key:null;if(typeof M=="string"&&M!==""||typeof M=="number")return w!==null?null:o(f,_,""+M,v);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Qo:return M.key===w?l(f,_,M,v):null;case Hs:return M.key===w?c(f,_,M,v):null;case Sr:return w=M._init,d(f,_,w(M._payload),v)}if(Ya(M)||Aa(M))return w!==null?null:h(f,_,M,v,null);ul(f,M)}return null}function g(f,_,M,v,w){if(typeof v=="string"&&v!==""||typeof v=="number")return f=f.get(M)||null,o(_,f,""+v,w);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case Qo:return f=f.get(v.key===null?M:v.key)||null,l(_,f,v,w);case Hs:return f=f.get(v.key===null?M:v.key)||null,c(_,f,v,w);case Sr:var T=v._init;return g(f,_,M,T(v._payload),w)}if(Ya(v)||Aa(v))return f=f.get(M)||null,h(_,f,v,w,null);ul(_,v)}return null}function x(f,_,M,v){for(var w=null,T=null,A=_,y=_=0,C=null;A!==null&&y<M.length;y++){A.index>y?(C=A,A=null):C=A.sibling;var N=d(f,A,M[y],v);if(N===null){A===null&&(A=C);break}t&&A&&N.alternate===null&&e(f,A),_=s(N,_,y),T===null?w=N:T.sibling=N,T=N,A=C}if(y===M.length)return n(f,A),wt&&es(f,y),w;if(A===null){for(;y<M.length;y++)A=p(f,M[y],v),A!==null&&(_=s(A,_,y),T===null?w=A:T.sibling=A,T=A);return wt&&es(f,y),w}for(A=i(f,A);y<M.length;y++)C=g(A,f,y,M[y],v),C!==null&&(t&&C.alternate!==null&&A.delete(C.key===null?y:C.key),_=s(C,_,y),T===null?w=C:T.sibling=C,T=C);return t&&A.forEach(function(D){return e(f,D)}),wt&&es(f,y),w}function S(f,_,M,v){var w=Aa(M);if(typeof w!="function")throw Error(oe(150));if(M=w.call(M),M==null)throw Error(oe(151));for(var T=w=null,A=_,y=_=0,C=null,N=M.next();A!==null&&!N.done;y++,N=M.next()){A.index>y?(C=A,A=null):C=A.sibling;var D=d(f,A,N.value,v);if(D===null){A===null&&(A=C);break}t&&A&&D.alternate===null&&e(f,A),_=s(D,_,y),T===null?w=D:T.sibling=D,T=D,A=C}if(N.done)return n(f,A),wt&&es(f,y),w;if(A===null){for(;!N.done;y++,N=M.next())N=p(f,N.value,v),N!==null&&(_=s(N,_,y),T===null?w=N:T.sibling=N,T=N);return wt&&es(f,y),w}for(A=i(f,A);!N.done;y++,N=M.next())N=g(A,f,y,N.value,v),N!==null&&(t&&N.alternate!==null&&A.delete(N.key===null?y:N.key),_=s(N,_,y),T===null?w=N:T.sibling=N,T=N);return t&&A.forEach(function(B){return e(f,B)}),wt&&es(f,y),w}function m(f,_,M,v){if(typeof M=="object"&&M!==null&&M.type===Vs&&M.key===null&&(M=M.props.children),typeof M=="object"&&M!==null){switch(M.$$typeof){case Qo:e:{for(var w=M.key,T=_;T!==null;){if(T.key===w){if(w=M.type,w===Vs){if(T.tag===7){n(f,T.sibling),_=r(T,M.props.children),_.return=f,f=_;break e}}else if(T.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Sr&&eg(w)===T.type){n(f,T.sibling),_=r(T,M.props),_.ref=Da(f,T,M),_.return=f,f=_;break e}n(f,T);break}else e(f,T);T=T.sibling}M.type===Vs?(_=us(M.props.children,f.mode,v,M.key),_.return=f,f=_):(v=tc(M.type,M.key,M.props,null,f.mode,v),v.ref=Da(f,_,M),v.return=f,f=v)}return a(f);case Hs:e:{for(T=M.key;_!==null;){if(_.key===T)if(_.tag===4&&_.stateNode.containerInfo===M.containerInfo&&_.stateNode.implementation===M.implementation){n(f,_.sibling),_=r(_,M.children||[]),_.return=f,f=_;break e}else{n(f,_);break}else e(f,_);_=_.sibling}_=Zu(M,f.mode,v),_.return=f,f=_}return a(f);case Sr:return T=M._init,m(f,_,T(M._payload),v)}if(Ya(M))return x(f,_,M,v);if(Aa(M))return S(f,_,M,v);ul(f,M)}return typeof M=="string"&&M!==""||typeof M=="number"?(M=""+M,_!==null&&_.tag===6?(n(f,_.sibling),_=r(_,M),_.return=f,f=_):(n(f,_),_=Ku(M,f.mode,v),_.return=f,f=_),a(f)):n(f,_)}return m}var pa=__(!0),x_=__(!1),Ac=jr(null),Rc=null,Ks=null,rp=null;function sp(){rp=Ks=Rc=null}function ap(t){var e=Ac.current;Mt(Ac),t._currentValue=e}function _f(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function sa(t,e){Rc=t,rp=Ks=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(Cn=!0),t.firstContext=null)}function ni(t){var e=t._currentValue;if(rp!==t)if(t={context:t,memoizedValue:e,next:null},Ks===null){if(Rc===null)throw Error(oe(308));Ks=t,Rc.dependencies={lanes:0,firstContext:t}}else Ks=Ks.next=t;return e}var is=null;function op(t){is===null?is=[t]:is.push(t)}function y_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,op(e)):(n.next=r.next,r.next=n),e.interleaved=n,ar(t,i)}function ar(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Er=!1;function lp(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function S_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function er(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Ir(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,at&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,ar(t,n)}return r=i.interleaved,r===null?(e.next=e,op(i)):(e.next=r.next,r.next=e),i.interleaved=e,ar(t,n)}function Yl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,qh(t,n)}}function tg(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Pc(t,e,n,i){var r=t.updateQueue;Er=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var h=t.alternate;h!==null&&(h=h.updateQueue,o=h.lastBaseUpdate,o!==a&&(o===null?h.firstBaseUpdate=c:o.next=c,h.lastBaseUpdate=l))}if(s!==null){var p=r.baseState;a=0,h=c=l=null,o=s;do{var d=o.lane,g=o.eventTime;if((i&d)===d){h!==null&&(h=h.next={eventTime:g,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var x=t,S=o;switch(d=e,g=n,S.tag){case 1:if(x=S.payload,typeof x=="function"){p=x.call(g,p,d);break e}p=x;break e;case 3:x.flags=x.flags&-65537|128;case 0:if(x=S.payload,d=typeof x=="function"?x.call(g,p,d):x,d==null)break e;p=Lt({},p,d);break e;case 2:Er=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,d=r.effects,d===null?r.effects=[o]:d.push(o))}else g={eventTime:g,lane:d,tag:o.tag,payload:o.payload,callback:o.callback,next:null},h===null?(c=h=g,l=p):h=h.next=g,a|=d;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;d=o,o=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(h===null&&(l=p),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);ps|=a,t.lanes=a,t.memoizedState=p}}function ng(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(oe(191,r));r.call(i)}}}var Wo={},Li=jr(Wo),To=jr(Wo),bo=jr(Wo);function rs(t){if(t===Wo)throw Error(oe(174));return t}function cp(t,e){switch(xt(bo,e),xt(To,t),xt(Li,Wo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Zd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Zd(e,t)}Mt(Li),xt(Li,e)}function ma(){Mt(Li),Mt(To),Mt(bo)}function E_(t){rs(bo.current);var e=rs(Li.current),n=Zd(e,t.type);e!==n&&(xt(To,t),xt(Li,n))}function up(t){To.current===t&&(Mt(Li),Mt(To))}var At=jr(0);function Nc(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var ju=[];function dp(){for(var t=0;t<ju.length;t++)ju[t]._workInProgressVersionPrimary=null;ju.length=0}var Kl=ur.ReactCurrentDispatcher,Wu=ur.ReactCurrentBatchConfig,hs=0,Pt=null,qt=null,Jt=null,Lc=!1,oo=!1,Co=0,jE=0;function on(){throw Error(oe(321))}function fp(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!xi(t[n],e[n]))return!1;return!0}function hp(t,e,n,i,r,s){if(hs=s,Pt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Kl.current=t===null||t.memoizedState===null?$E:YE,t=n(i,r),oo){s=0;do{if(oo=!1,Co=0,25<=s)throw Error(oe(301));s+=1,Jt=qt=null,e.updateQueue=null,Kl.current=KE,t=n(i,r)}while(oo)}if(Kl.current=Dc,e=qt!==null&&qt.next!==null,hs=0,Jt=qt=Pt=null,Lc=!1,e)throw Error(oe(300));return t}function pp(){var t=Co!==0;return Co=0,t}function Ti(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Jt===null?Pt.memoizedState=Jt=t:Jt=Jt.next=t,Jt}function ii(){if(qt===null){var t=Pt.alternate;t=t!==null?t.memoizedState:null}else t=qt.next;var e=Jt===null?Pt.memoizedState:Jt.next;if(e!==null)Jt=e,qt=t;else{if(t===null)throw Error(oe(310));qt=t,t={memoizedState:qt.memoizedState,baseState:qt.baseState,baseQueue:qt.baseQueue,queue:qt.queue,next:null},Jt===null?Pt.memoizedState=Jt=t:Jt=Jt.next=t}return Jt}function Ao(t,e){return typeof e=="function"?e(t):e}function Xu(t){var e=ii(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=qt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var h=c.lane;if((hs&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var p={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=p,a=i):l=l.next=p,Pt.lanes|=h,ps|=h}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,xi(i,e.memoizedState)||(Cn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,Pt.lanes|=s,ps|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function qu(t){var e=ii(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);xi(s,e.memoizedState)||(Cn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function M_(){}function w_(t,e){var n=Pt,i=ii(),r=e(),s=!xi(i.memoizedState,r);if(s&&(i.memoizedState=r,Cn=!0),i=i.queue,mp(C_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Jt!==null&&Jt.memoizedState.tag&1){if(n.flags|=2048,Ro(9,b_.bind(null,n,i,r,e),void 0,null),Qt===null)throw Error(oe(349));hs&30||T_(n,e,r)}return r}function T_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=Pt.updateQueue,e===null?(e={lastEffect:null,stores:null},Pt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function b_(t,e,n,i){e.value=n,e.getSnapshot=i,A_(e)&&R_(t)}function C_(t,e,n){return n(function(){A_(e)&&R_(t)})}function A_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!xi(t,n)}catch{return!0}}function R_(t){var e=ar(t,1);e!==null&&vi(e,t,1,-1)}function ig(t){var e=Ti();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ao,lastRenderedState:t},e.queue=t,t=t.dispatch=qE.bind(null,Pt,t),[e.memoizedState,t]}function Ro(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=Pt.updateQueue,e===null?(e={lastEffect:null,stores:null},Pt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function P_(){return ii().memoizedState}function Zl(t,e,n,i){var r=Ti();Pt.flags|=t,r.memoizedState=Ro(1|e,n,void 0,i===void 0?null:i)}function iu(t,e,n,i){var r=ii();i=i===void 0?null:i;var s=void 0;if(qt!==null){var a=qt.memoizedState;if(s=a.destroy,i!==null&&fp(i,a.deps)){r.memoizedState=Ro(e,n,s,i);return}}Pt.flags|=t,r.memoizedState=Ro(1|e,n,s,i)}function rg(t,e){return Zl(8390656,8,t,e)}function mp(t,e){return iu(2048,8,t,e)}function N_(t,e){return iu(4,2,t,e)}function L_(t,e){return iu(4,4,t,e)}function D_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function I_(t,e,n){return n=n!=null?n.concat([t]):null,iu(4,4,D_.bind(null,e,t),n)}function gp(){}function U_(t,e){var n=ii();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&fp(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function O_(t,e){var n=ii();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&fp(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function F_(t,e,n){return hs&21?(xi(n,e)||(n=V0(),Pt.lanes|=n,ps|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,Cn=!0),t.memoizedState=n)}function WE(t,e){var n=pt;pt=n!==0&&4>n?n:4,t(!0);var i=Wu.transition;Wu.transition={};try{t(!1),e()}finally{pt=n,Wu.transition=i}}function k_(){return ii().memoizedState}function XE(t,e,n){var i=Or(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},B_(t))z_(e,n);else if(n=y_(t,e,n,i),n!==null){var r=xn();vi(n,t,i,r),H_(n,e,i)}}function qE(t,e,n){var i=Or(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(B_(t))z_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,xi(o,a)){var l=e.interleaved;l===null?(r.next=r,op(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=y_(t,e,r,i),n!==null&&(r=xn(),vi(n,t,i,r),H_(n,e,i))}}function B_(t){var e=t.alternate;return t===Pt||e!==null&&e===Pt}function z_(t,e){oo=Lc=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function H_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,qh(t,n)}}var Dc={readContext:ni,useCallback:on,useContext:on,useEffect:on,useImperativeHandle:on,useInsertionEffect:on,useLayoutEffect:on,useMemo:on,useReducer:on,useRef:on,useState:on,useDebugValue:on,useDeferredValue:on,useTransition:on,useMutableSource:on,useSyncExternalStore:on,useId:on,unstable_isNewReconciler:!1},$E={readContext:ni,useCallback:function(t,e){return Ti().memoizedState=[t,e===void 0?null:e],t},useContext:ni,useEffect:rg,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Zl(4194308,4,D_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Zl(4194308,4,t,e)},useInsertionEffect:function(t,e){return Zl(4,2,t,e)},useMemo:function(t,e){var n=Ti();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Ti();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=XE.bind(null,Pt,t),[i.memoizedState,t]},useRef:function(t){var e=Ti();return t={current:t},e.memoizedState=t},useState:ig,useDebugValue:gp,useDeferredValue:function(t){return Ti().memoizedState=t},useTransition:function(){var t=ig(!1),e=t[0];return t=WE.bind(null,t[1]),Ti().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=Pt,r=Ti();if(wt){if(n===void 0)throw Error(oe(407));n=n()}else{if(n=e(),Qt===null)throw Error(oe(349));hs&30||T_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,rg(C_.bind(null,i,s,t),[t]),i.flags|=2048,Ro(9,b_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Ti(),e=Qt.identifierPrefix;if(wt){var n=Zi,i=Ki;n=(i&~(1<<32-gi(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Co++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=jE++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},YE={readContext:ni,useCallback:U_,useContext:ni,useEffect:mp,useImperativeHandle:I_,useInsertionEffect:N_,useLayoutEffect:L_,useMemo:O_,useReducer:Xu,useRef:P_,useState:function(){return Xu(Ao)},useDebugValue:gp,useDeferredValue:function(t){var e=ii();return F_(e,qt.memoizedState,t)},useTransition:function(){var t=Xu(Ao)[0],e=ii().memoizedState;return[t,e]},useMutableSource:M_,useSyncExternalStore:w_,useId:k_,unstable_isNewReconciler:!1},KE={readContext:ni,useCallback:U_,useContext:ni,useEffect:mp,useImperativeHandle:I_,useInsertionEffect:N_,useLayoutEffect:L_,useMemo:O_,useReducer:qu,useRef:P_,useState:function(){return qu(Ao)},useDebugValue:gp,useDeferredValue:function(t){var e=ii();return qt===null?e.memoizedState=t:F_(e,qt.memoizedState,t)},useTransition:function(){var t=qu(Ao)[0],e=ii().memoizedState;return[t,e]},useMutableSource:M_,useSyncExternalStore:w_,useId:k_,unstable_isNewReconciler:!1};function ui(t,e){if(t&&t.defaultProps){e=Lt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function xf(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Lt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var ru={isMounted:function(t){return(t=t._reactInternals)?ys(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Or(t),s=er(i,r);s.payload=e,n!=null&&(s.callback=n),e=Ir(t,s,r),e!==null&&(vi(e,t,r,i),Yl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Or(t),s=er(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Ir(t,s,r),e!==null&&(vi(e,t,r,i),Yl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=xn(),i=Or(t),r=er(n,i);r.tag=2,e!=null&&(r.callback=e),e=Ir(t,r,i),e!==null&&(vi(e,t,i,n),Yl(e,t,i))}};function sg(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!So(n,i)||!So(r,s):!0}function V_(t,e,n){var i=!1,r=zr,s=e.contextType;return typeof s=="object"&&s!==null?s=ni(s):(r=Rn(e)?ds:mn.current,i=e.contextTypes,s=(i=i!=null)?fa(t,r):zr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ru,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function ag(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&ru.enqueueReplaceState(e,e.state,null)}function yf(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},lp(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=ni(s):(s=Rn(e)?ds:mn.current,r.context=fa(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(xf(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ru.enqueueReplaceState(r,r.state,null),Pc(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function ga(t,e){try{var n="",i=e;do n+=wS(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function $u(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Sf(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var ZE=typeof WeakMap=="function"?WeakMap:Map;function G_(t,e,n){n=er(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Uc||(Uc=!0,Nf=i),Sf(t,e)},n}function j_(t,e,n){n=er(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Sf(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Sf(t,e),typeof i!="function"&&(Ur===null?Ur=new Set([this]):Ur.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function og(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new ZE;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=dM.bind(null,t,e,n),e.then(t,t))}function lg(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function cg(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=er(-1,1),e.tag=2,Ir(n,e,1))),n.lanes|=1),t)}var JE=ur.ReactCurrentOwner,Cn=!1;function _n(t,e,n,i){e.child=t===null?x_(e,null,n,i):pa(e,t.child,n,i)}function ug(t,e,n,i,r){n=n.render;var s=e.ref;return sa(e,r),i=hp(t,e,n,i,s,r),n=pp(),t!==null&&!Cn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,or(t,e,r)):(wt&&n&&tp(e),e.flags|=1,_n(t,e,i,r),e.child)}function dg(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!wp(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,W_(t,e,s,i,r)):(t=tc(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:So,n(a,i)&&t.ref===e.ref)return or(t,e,r)}return e.flags|=1,t=Fr(s,i),t.ref=e.ref,t.return=e,e.child=t}function W_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(So(s,i)&&t.ref===e.ref)if(Cn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(Cn=!0);else return e.lanes=t.lanes,or(t,e,r)}return Ef(t,e,n,i,r)}function X_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},xt(Js,Fn),Fn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,xt(Js,Fn),Fn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,xt(Js,Fn),Fn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,xt(Js,Fn),Fn|=i;return _n(t,e,r,n),e.child}function q_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Ef(t,e,n,i,r){var s=Rn(n)?ds:mn.current;return s=fa(e,s),sa(e,r),n=hp(t,e,n,i,s,r),i=pp(),t!==null&&!Cn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,or(t,e,r)):(wt&&i&&tp(e),e.flags|=1,_n(t,e,n,r),e.child)}function fg(t,e,n,i,r){if(Rn(n)){var s=!0;Tc(e)}else s=!1;if(sa(e,r),e.stateNode===null)Jl(t,e),V_(e,n,i),yf(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=ni(c):(c=Rn(n)?ds:mn.current,c=fa(e,c));var h=n.getDerivedStateFromProps,p=typeof h=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&ag(e,a,i,c),Er=!1;var d=e.memoizedState;a.state=d,Pc(e,i,a,r),l=e.memoizedState,o!==i||d!==l||An.current||Er?(typeof h=="function"&&(xf(e,n,h,i),l=e.memoizedState),(o=Er||sg(e,n,o,i,d,l,c))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,S_(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:ui(e.type,o),a.props=c,p=e.pendingProps,d=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=ni(l):(l=Rn(n)?ds:mn.current,l=fa(e,l));var g=n.getDerivedStateFromProps;(h=typeof g=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==p||d!==l)&&ag(e,a,i,l),Er=!1,d=e.memoizedState,a.state=d,Pc(e,i,a,r);var x=e.memoizedState;o!==p||d!==x||An.current||Er?(typeof g=="function"&&(xf(e,n,g,i),x=e.memoizedState),(c=Er||sg(e,n,c,i,d,x,l)||!1)?(h||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,x,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,x,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=x),a.props=i,a.state=x,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),i=!1)}return Mf(t,e,n,i,s,r)}function Mf(t,e,n,i,r,s){q_(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Zm(e,n,!1),or(t,e,s);i=e.stateNode,JE.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=pa(e,t.child,null,s),e.child=pa(e,null,o,s)):_n(t,e,o,s),e.memoizedState=i.state,r&&Zm(e,n,!0),e.child}function $_(t){var e=t.stateNode;e.pendingContext?Km(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Km(t,e.context,!1),cp(t,e.containerInfo)}function hg(t,e,n,i,r){return ha(),ip(r),e.flags|=256,_n(t,e,n,i),e.child}var wf={dehydrated:null,treeContext:null,retryLane:0};function Tf(t){return{baseLanes:t,cachePool:null,transitions:null}}function Y_(t,e,n){var i=e.pendingProps,r=At.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),xt(At,r&1),t===null)return vf(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=ou(a,i,0,null),t=us(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Tf(n),e.memoizedState=wf,t):vp(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return QE(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Fr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Fr(o,s):(s=us(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Tf(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=wf,i}return s=t.child,t=s.sibling,i=Fr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function vp(t,e){return e=ou({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function dl(t,e,n,i){return i!==null&&ip(i),pa(e,t.child,null,n),t=vp(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function QE(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=$u(Error(oe(422))),dl(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=ou({mode:"visible",children:i.children},r,0,null),s=us(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&pa(e,t.child,null,a),e.child.memoizedState=Tf(a),e.memoizedState=wf,s);if(!(e.mode&1))return dl(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(oe(419)),i=$u(s,i,void 0),dl(t,e,a,i)}if(o=(a&t.childLanes)!==0,Cn||o){if(i=Qt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,ar(t,r),vi(i,t,r,-1))}return Mp(),i=$u(Error(oe(421))),dl(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=fM.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,zn=Dr(r.nextSibling),Hn=e,wt=!0,hi=null,t!==null&&(Yn[Kn++]=Ki,Yn[Kn++]=Zi,Yn[Kn++]=fs,Ki=t.id,Zi=t.overflow,fs=e),e=vp(e,i.children),e.flags|=4096,e)}function pg(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),_f(t.return,e,n)}function Yu(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function K_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(_n(t,e,i.children,n),i=At.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&pg(t,n,e);else if(t.tag===19)pg(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(xt(At,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Nc(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Yu(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Nc(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Yu(e,!0,n,null,s);break;case"together":Yu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Jl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function or(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),ps|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(oe(153));if(e.child!==null){for(t=e.child,n=Fr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Fr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function eM(t,e,n){switch(e.tag){case 3:$_(e),ha();break;case 5:E_(e);break;case 1:Rn(e.type)&&Tc(e);break;case 4:cp(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;xt(Ac,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(xt(At,At.current&1),e.flags|=128,null):n&e.child.childLanes?Y_(t,e,n):(xt(At,At.current&1),t=or(t,e,n),t!==null?t.sibling:null);xt(At,At.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return K_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),xt(At,At.current),i)break;return null;case 22:case 23:return e.lanes=0,X_(t,e,n)}return or(t,e,n)}var Z_,bf,J_,Q_;Z_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};bf=function(){};J_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,rs(Li.current);var s=null;switch(n){case"input":r=qd(t,r),i=qd(t,i),s=[];break;case"select":r=Lt({},r,{value:void 0}),i=Lt({},i,{value:void 0}),s=[];break;case"textarea":r=Kd(t,r),i=Kd(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Mc)}Jd(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(po.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(po.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&St("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Q_=function(t,e,n,i){n!==i&&(e.flags|=4)};function Ia(t,e){if(!wt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function ln(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function tM(t,e,n){var i=e.pendingProps;switch(np(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ln(e),null;case 1:return Rn(e.type)&&wc(),ln(e),null;case 3:return i=e.stateNode,ma(),Mt(An),Mt(mn),dp(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(cl(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,hi!==null&&(If(hi),hi=null))),bf(t,e),ln(e),null;case 5:up(e);var r=rs(bo.current);if(n=e.type,t!==null&&e.stateNode!=null)J_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(oe(166));return ln(e),null}if(t=rs(Li.current),cl(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Ci]=e,i[wo]=s,t=(e.mode&1)!==0,n){case"dialog":St("cancel",i),St("close",i);break;case"iframe":case"object":case"embed":St("load",i);break;case"video":case"audio":for(r=0;r<Za.length;r++)St(Za[r],i);break;case"source":St("error",i);break;case"img":case"image":case"link":St("error",i),St("load",i);break;case"details":St("toggle",i);break;case"input":Mm(i,s),St("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},St("invalid",i);break;case"textarea":Tm(i,s),St("invalid",i)}Jd(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&ll(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&ll(i.textContent,o,t),r=["children",""+o]):po.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&St("scroll",i)}switch(n){case"input":el(i),wm(i,s,!0);break;case"textarea":el(i),bm(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Mc)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=C0(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Ci]=e,t[wo]=i,Z_(t,e,!1,!1),e.stateNode=t;e:{switch(a=Qd(n,i),n){case"dialog":St("cancel",t),St("close",t),r=i;break;case"iframe":case"object":case"embed":St("load",t),r=i;break;case"video":case"audio":for(r=0;r<Za.length;r++)St(Za[r],t);r=i;break;case"source":St("error",t),r=i;break;case"img":case"image":case"link":St("error",t),St("load",t),r=i;break;case"details":St("toggle",t),r=i;break;case"input":Mm(t,i),r=qd(t,i),St("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Lt({},i,{value:void 0}),St("invalid",t);break;case"textarea":Tm(t,i),r=Kd(t,i),St("invalid",t);break;default:r=i}Jd(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?P0(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&A0(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&mo(t,l):typeof l=="number"&&mo(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(po.hasOwnProperty(s)?l!=null&&s==="onScroll"&&St("scroll",t):l!=null&&Hh(t,s,l,a))}switch(n){case"input":el(t),wm(t,i,!1);break;case"textarea":el(t),bm(t);break;case"option":i.value!=null&&t.setAttribute("value",""+Br(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ta(t,!!i.multiple,s,!1):i.defaultValue!=null&&ta(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Mc)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return ln(e),null;case 6:if(t&&e.stateNode!=null)Q_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(oe(166));if(n=rs(bo.current),rs(Li.current),cl(e)){if(i=e.stateNode,n=e.memoizedProps,i[Ci]=e,(s=i.nodeValue!==n)&&(t=Hn,t!==null))switch(t.tag){case 3:ll(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ll(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Ci]=e,e.stateNode=i}return ln(e),null;case 13:if(Mt(At),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(wt&&zn!==null&&e.mode&1&&!(e.flags&128))v_(),ha(),e.flags|=98560,s=!1;else if(s=cl(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(oe(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(oe(317));s[Ci]=e}else ha(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;ln(e),s=!1}else hi!==null&&(If(hi),hi=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||At.current&1?$t===0&&($t=3):Mp())),e.updateQueue!==null&&(e.flags|=4),ln(e),null);case 4:return ma(),bf(t,e),t===null&&Eo(e.stateNode.containerInfo),ln(e),null;case 10:return ap(e.type._context),ln(e),null;case 17:return Rn(e.type)&&wc(),ln(e),null;case 19:if(Mt(At),s=e.memoizedState,s===null)return ln(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Ia(s,!1);else{if($t!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Nc(t),a!==null){for(e.flags|=128,Ia(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return xt(At,At.current&1|2),e.child}t=t.sibling}s.tail!==null&&Ft()>va&&(e.flags|=128,i=!0,Ia(s,!1),e.lanes=4194304)}else{if(!i)if(t=Nc(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Ia(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!wt)return ln(e),null}else 2*Ft()-s.renderingStartTime>va&&n!==1073741824&&(e.flags|=128,i=!0,Ia(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ft(),e.sibling=null,n=At.current,xt(At,i?n&1|2:n&1),e):(ln(e),null);case 22:case 23:return Ep(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Fn&1073741824&&(ln(e),e.subtreeFlags&6&&(e.flags|=8192)):ln(e),null;case 24:return null;case 25:return null}throw Error(oe(156,e.tag))}function nM(t,e){switch(np(e),e.tag){case 1:return Rn(e.type)&&wc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return ma(),Mt(An),Mt(mn),dp(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return up(e),null;case 13:if(Mt(At),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(oe(340));ha()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Mt(At),null;case 4:return ma(),null;case 10:return ap(e.type._context),null;case 22:case 23:return Ep(),null;case 24:return null;default:return null}}var fl=!1,fn=!1,iM=typeof WeakSet=="function"?WeakSet:Set,Ce=null;function Zs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Dt(t,e,i)}else n.current=null}function Cf(t,e,n){try{n()}catch(i){Dt(t,e,i)}}var mg=!1;function rM(t,e){if(uf=yc,t=r_(),ep(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,h=0,p=t,d=null;t:for(;;){for(var g;p!==n||r!==0&&p.nodeType!==3||(o=a+r),p!==s||i!==0&&p.nodeType!==3||(l=a+i),p.nodeType===3&&(a+=p.nodeValue.length),(g=p.firstChild)!==null;)d=p,p=g;for(;;){if(p===t)break t;if(d===n&&++c===r&&(o=a),d===s&&++h===i&&(l=a),(g=p.nextSibling)!==null)break;p=d,d=p.parentNode}p=g}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(df={focusedElem:t,selectionRange:n},yc=!1,Ce=e;Ce!==null;)if(e=Ce,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,Ce=t;else for(;Ce!==null;){e=Ce;try{var x=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(x!==null){var S=x.memoizedProps,m=x.memoizedState,f=e.stateNode,_=f.getSnapshotBeforeUpdate(e.elementType===e.type?S:ui(e.type,S),m);f.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var M=e.stateNode.containerInfo;M.nodeType===1?M.textContent="":M.nodeType===9&&M.documentElement&&M.removeChild(M.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(oe(163))}}catch(v){Dt(e,e.return,v)}if(t=e.sibling,t!==null){t.return=e.return,Ce=t;break}Ce=e.return}return x=mg,mg=!1,x}function lo(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Cf(e,n,s)}r=r.next}while(r!==i)}}function su(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Af(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function ex(t){var e=t.alternate;e!==null&&(t.alternate=null,ex(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Ci],delete e[wo],delete e[pf],delete e[zE],delete e[HE])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function tx(t){return t.tag===5||t.tag===3||t.tag===4}function gg(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||tx(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Rf(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Mc));else if(i!==4&&(t=t.child,t!==null))for(Rf(t,e,n),t=t.sibling;t!==null;)Rf(t,e,n),t=t.sibling}function Pf(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Pf(t,e,n),t=t.sibling;t!==null;)Pf(t,e,n),t=t.sibling}var en=null,di=!1;function mr(t,e,n){for(n=n.child;n!==null;)nx(t,e,n),n=n.sibling}function nx(t,e,n){if(Ni&&typeof Ni.onCommitFiberUnmount=="function")try{Ni.onCommitFiberUnmount(Zc,n)}catch{}switch(n.tag){case 5:fn||Zs(n,e);case 6:var i=en,r=di;en=null,mr(t,e,n),en=i,di=r,en!==null&&(di?(t=en,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):en.removeChild(n.stateNode));break;case 18:en!==null&&(di?(t=en,n=n.stateNode,t.nodeType===8?Vu(t.parentNode,n):t.nodeType===1&&Vu(t,n),xo(t)):Vu(en,n.stateNode));break;case 4:i=en,r=di,en=n.stateNode.containerInfo,di=!0,mr(t,e,n),en=i,di=r;break;case 0:case 11:case 14:case 15:if(!fn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Cf(n,e,a),r=r.next}while(r!==i)}mr(t,e,n);break;case 1:if(!fn&&(Zs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){Dt(n,e,o)}mr(t,e,n);break;case 21:mr(t,e,n);break;case 22:n.mode&1?(fn=(i=fn)||n.memoizedState!==null,mr(t,e,n),fn=i):mr(t,e,n);break;default:mr(t,e,n)}}function vg(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new iM),e.forEach(function(i){var r=hM.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function ai(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:en=o.stateNode,di=!1;break e;case 3:en=o.stateNode.containerInfo,di=!0;break e;case 4:en=o.stateNode.containerInfo,di=!0;break e}o=o.return}if(en===null)throw Error(oe(160));nx(s,a,r),en=null,di=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Dt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)ix(e,t),e=e.sibling}function ix(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(ai(e,t),Ei(t),i&4){try{lo(3,t,t.return),su(3,t)}catch(S){Dt(t,t.return,S)}try{lo(5,t,t.return)}catch(S){Dt(t,t.return,S)}}break;case 1:ai(e,t),Ei(t),i&512&&n!==null&&Zs(n,n.return);break;case 5:if(ai(e,t),Ei(t),i&512&&n!==null&&Zs(n,n.return),t.flags&32){var r=t.stateNode;try{mo(r,"")}catch(S){Dt(t,t.return,S)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&T0(r,s),Qd(o,a);var c=Qd(o,s);for(a=0;a<l.length;a+=2){var h=l[a],p=l[a+1];h==="style"?P0(r,p):h==="dangerouslySetInnerHTML"?A0(r,p):h==="children"?mo(r,p):Hh(r,h,p,c)}switch(o){case"input":$d(r,s);break;case"textarea":b0(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var g=s.value;g!=null?ta(r,!!s.multiple,g,!1):d!==!!s.multiple&&(s.defaultValue!=null?ta(r,!!s.multiple,s.defaultValue,!0):ta(r,!!s.multiple,s.multiple?[]:"",!1))}r[wo]=s}catch(S){Dt(t,t.return,S)}}break;case 6:if(ai(e,t),Ei(t),i&4){if(t.stateNode===null)throw Error(oe(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(S){Dt(t,t.return,S)}}break;case 3:if(ai(e,t),Ei(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{xo(e.containerInfo)}catch(S){Dt(t,t.return,S)}break;case 4:ai(e,t),Ei(t);break;case 13:ai(e,t),Ei(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(yp=Ft())),i&4&&vg(t);break;case 22:if(h=n!==null&&n.memoizedState!==null,t.mode&1?(fn=(c=fn)||h,ai(e,t),fn=c):ai(e,t),Ei(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!h&&t.mode&1)for(Ce=t,h=t.child;h!==null;){for(p=Ce=h;Ce!==null;){switch(d=Ce,g=d.child,d.tag){case 0:case 11:case 14:case 15:lo(4,d,d.return);break;case 1:Zs(d,d.return);var x=d.stateNode;if(typeof x.componentWillUnmount=="function"){i=d,n=d.return;try{e=i,x.props=e.memoizedProps,x.state=e.memoizedState,x.componentWillUnmount()}catch(S){Dt(i,n,S)}}break;case 5:Zs(d,d.return);break;case 22:if(d.memoizedState!==null){xg(p);continue}}g!==null?(g.return=d,Ce=g):xg(p)}h=h.sibling}e:for(h=null,p=t;;){if(p.tag===5){if(h===null){h=p;try{r=p.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=p.stateNode,l=p.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=R0("display",a))}catch(S){Dt(t,t.return,S)}}}else if(p.tag===6){if(h===null)try{p.stateNode.nodeValue=c?"":p.memoizedProps}catch(S){Dt(t,t.return,S)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===t)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===t)break e;for(;p.sibling===null;){if(p.return===null||p.return===t)break e;h===p&&(h=null),p=p.return}h===p&&(h=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:ai(e,t),Ei(t),i&4&&vg(t);break;case 21:break;default:ai(e,t),Ei(t)}}function Ei(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(tx(n)){var i=n;break e}n=n.return}throw Error(oe(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(mo(r,""),i.flags&=-33);var s=gg(t);Pf(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=gg(t);Rf(t,o,a);break;default:throw Error(oe(161))}}catch(l){Dt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function sM(t,e,n){Ce=t,rx(t)}function rx(t,e,n){for(var i=(t.mode&1)!==0;Ce!==null;){var r=Ce,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||fl;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||fn;o=fl;var c=fn;if(fl=a,(fn=l)&&!c)for(Ce=r;Ce!==null;)a=Ce,l=a.child,a.tag===22&&a.memoizedState!==null?yg(r):l!==null?(l.return=a,Ce=l):yg(r);for(;s!==null;)Ce=s,rx(s),s=s.sibling;Ce=r,fl=o,fn=c}_g(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Ce=s):_g(t)}}function _g(t){for(;Ce!==null;){var e=Ce;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:fn||su(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!fn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:ui(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&ng(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}ng(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var p=h.dehydrated;p!==null&&xo(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(oe(163))}fn||e.flags&512&&Af(e)}catch(d){Dt(e,e.return,d)}}if(e===t){Ce=null;break}if(n=e.sibling,n!==null){n.return=e.return,Ce=n;break}Ce=e.return}}function xg(t){for(;Ce!==null;){var e=Ce;if(e===t){Ce=null;break}var n=e.sibling;if(n!==null){n.return=e.return,Ce=n;break}Ce=e.return}}function yg(t){for(;Ce!==null;){var e=Ce;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{su(4,e)}catch(l){Dt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Dt(e,r,l)}}var s=e.return;try{Af(e)}catch(l){Dt(e,s,l)}break;case 5:var a=e.return;try{Af(e)}catch(l){Dt(e,a,l)}}}catch(l){Dt(e,e.return,l)}if(e===t){Ce=null;break}var o=e.sibling;if(o!==null){o.return=e.return,Ce=o;break}Ce=e.return}}var aM=Math.ceil,Ic=ur.ReactCurrentDispatcher,_p=ur.ReactCurrentOwner,ei=ur.ReactCurrentBatchConfig,at=0,Qt=null,Ht=null,nn=0,Fn=0,Js=jr(0),$t=0,Po=null,ps=0,au=0,xp=0,co=null,Tn=null,yp=0,va=1/0,Xi=null,Uc=!1,Nf=null,Ur=null,hl=!1,Ar=null,Oc=0,uo=0,Lf=null,Ql=-1,ec=0;function xn(){return at&6?Ft():Ql!==-1?Ql:Ql=Ft()}function Or(t){return t.mode&1?at&2&&nn!==0?nn&-nn:GE.transition!==null?(ec===0&&(ec=V0()),ec):(t=pt,t!==0||(t=window.event,t=t===void 0?16:Y0(t.type)),t):1}function vi(t,e,n,i){if(50<uo)throw uo=0,Lf=null,Error(oe(185));Vo(t,n,i),(!(at&2)||t!==Qt)&&(t===Qt&&(!(at&2)&&(au|=n),$t===4&&Tr(t,nn)),Pn(t,i),n===1&&at===0&&!(e.mode&1)&&(va=Ft()+500,nu&&Wr()))}function Pn(t,e){var n=t.callbackNode;GS(t,e);var i=xc(t,t===Qt?nn:0);if(i===0)n!==null&&Rm(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Rm(n),e===1)t.tag===0?VE(Sg.bind(null,t)):p_(Sg.bind(null,t)),kE(function(){!(at&6)&&Wr()}),n=null;else{switch(G0(i)){case 1:n=Xh;break;case 4:n=z0;break;case 16:n=_c;break;case 536870912:n=H0;break;default:n=_c}n=fx(n,sx.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function sx(t,e){if(Ql=-1,ec=0,at&6)throw Error(oe(327));var n=t.callbackNode;if(aa()&&t.callbackNode!==n)return null;var i=xc(t,t===Qt?nn:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Fc(t,i);else{e=i;var r=at;at|=2;var s=ox();(Qt!==t||nn!==e)&&(Xi=null,va=Ft()+500,cs(t,e));do try{cM();break}catch(o){ax(t,o)}while(!0);sp(),Ic.current=s,at=r,Ht!==null?e=0:(Qt=null,nn=0,e=$t)}if(e!==0){if(e===2&&(r=sf(t),r!==0&&(i=r,e=Df(t,r))),e===1)throw n=Po,cs(t,0),Tr(t,i),Pn(t,Ft()),n;if(e===6)Tr(t,i);else{if(r=t.current.alternate,!(i&30)&&!oM(r)&&(e=Fc(t,i),e===2&&(s=sf(t),s!==0&&(i=s,e=Df(t,s))),e===1))throw n=Po,cs(t,0),Tr(t,i),Pn(t,Ft()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(oe(345));case 2:ts(t,Tn,Xi);break;case 3:if(Tr(t,i),(i&130023424)===i&&(e=yp+500-Ft(),10<e)){if(xc(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){xn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=hf(ts.bind(null,t,Tn,Xi),e);break}ts(t,Tn,Xi);break;case 4:if(Tr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-gi(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Ft()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*aM(i/1960))-i,10<i){t.timeoutHandle=hf(ts.bind(null,t,Tn,Xi),i);break}ts(t,Tn,Xi);break;case 5:ts(t,Tn,Xi);break;default:throw Error(oe(329))}}}return Pn(t,Ft()),t.callbackNode===n?sx.bind(null,t):null}function Df(t,e){var n=co;return t.current.memoizedState.isDehydrated&&(cs(t,e).flags|=256),t=Fc(t,e),t!==2&&(e=Tn,Tn=n,e!==null&&If(e)),t}function If(t){Tn===null?Tn=t:Tn.push.apply(Tn,t)}function oM(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!xi(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Tr(t,e){for(e&=~xp,e&=~au,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-gi(e),i=1<<n;t[n]=-1,e&=~i}}function Sg(t){if(at&6)throw Error(oe(327));aa();var e=xc(t,0);if(!(e&1))return Pn(t,Ft()),null;var n=Fc(t,e);if(t.tag!==0&&n===2){var i=sf(t);i!==0&&(e=i,n=Df(t,i))}if(n===1)throw n=Po,cs(t,0),Tr(t,e),Pn(t,Ft()),n;if(n===6)throw Error(oe(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,ts(t,Tn,Xi),Pn(t,Ft()),null}function Sp(t,e){var n=at;at|=1;try{return t(e)}finally{at=n,at===0&&(va=Ft()+500,nu&&Wr())}}function ms(t){Ar!==null&&Ar.tag===0&&!(at&6)&&aa();var e=at;at|=1;var n=ei.transition,i=pt;try{if(ei.transition=null,pt=1,t)return t()}finally{pt=i,ei.transition=n,at=e,!(at&6)&&Wr()}}function Ep(){Fn=Js.current,Mt(Js)}function cs(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,FE(n)),Ht!==null)for(n=Ht.return;n!==null;){var i=n;switch(np(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&wc();break;case 3:ma(),Mt(An),Mt(mn),dp();break;case 5:up(i);break;case 4:ma();break;case 13:Mt(At);break;case 19:Mt(At);break;case 10:ap(i.type._context);break;case 22:case 23:Ep()}n=n.return}if(Qt=t,Ht=t=Fr(t.current,null),nn=Fn=e,$t=0,Po=null,xp=au=ps=0,Tn=co=null,is!==null){for(e=0;e<is.length;e++)if(n=is[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}is=null}return t}function ax(t,e){do{var n=Ht;try{if(sp(),Kl.current=Dc,Lc){for(var i=Pt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Lc=!1}if(hs=0,Jt=qt=Pt=null,oo=!1,Co=0,_p.current=null,n===null||n.return===null){$t=1,Po=e,Ht=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=nn,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=o,p=h.tag;if(!(h.mode&1)&&(p===0||p===11||p===15)){var d=h.alternate;d?(h.updateQueue=d.updateQueue,h.memoizedState=d.memoizedState,h.lanes=d.lanes):(h.updateQueue=null,h.memoizedState=null)}var g=lg(a);if(g!==null){g.flags&=-257,cg(g,a,o,s,e),g.mode&1&&og(s,c,e),e=g,l=c;var x=e.updateQueue;if(x===null){var S=new Set;S.add(l),e.updateQueue=S}else x.add(l);break e}else{if(!(e&1)){og(s,c,e),Mp();break e}l=Error(oe(426))}}else if(wt&&o.mode&1){var m=lg(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),cg(m,a,o,s,e),ip(ga(l,o));break e}}s=l=ga(l,o),$t!==4&&($t=2),co===null?co=[s]:co.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var f=G_(s,l,e);tg(s,f);break e;case 1:o=l;var _=s.type,M=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||M!==null&&typeof M.componentDidCatch=="function"&&(Ur===null||!Ur.has(M)))){s.flags|=65536,e&=-e,s.lanes|=e;var v=j_(s,o,e);tg(s,v);break e}}s=s.return}while(s!==null)}cx(n)}catch(w){e=w,Ht===n&&n!==null&&(Ht=n=n.return);continue}break}while(!0)}function ox(){var t=Ic.current;return Ic.current=Dc,t===null?Dc:t}function Mp(){($t===0||$t===3||$t===2)&&($t=4),Qt===null||!(ps&268435455)&&!(au&268435455)||Tr(Qt,nn)}function Fc(t,e){var n=at;at|=2;var i=ox();(Qt!==t||nn!==e)&&(Xi=null,cs(t,e));do try{lM();break}catch(r){ax(t,r)}while(!0);if(sp(),at=n,Ic.current=i,Ht!==null)throw Error(oe(261));return Qt=null,nn=0,$t}function lM(){for(;Ht!==null;)lx(Ht)}function cM(){for(;Ht!==null&&!IS();)lx(Ht)}function lx(t){var e=dx(t.alternate,t,Fn);t.memoizedProps=t.pendingProps,e===null?cx(t):Ht=e,_p.current=null}function cx(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=nM(n,e),n!==null){n.flags&=32767,Ht=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{$t=6,Ht=null;return}}else if(n=tM(n,e,Fn),n!==null){Ht=n;return}if(e=e.sibling,e!==null){Ht=e;return}Ht=e=t}while(e!==null);$t===0&&($t=5)}function ts(t,e,n){var i=pt,r=ei.transition;try{ei.transition=null,pt=1,uM(t,e,n,i)}finally{ei.transition=r,pt=i}return null}function uM(t,e,n,i){do aa();while(Ar!==null);if(at&6)throw Error(oe(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(oe(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(jS(t,s),t===Qt&&(Ht=Qt=null,nn=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||hl||(hl=!0,fx(_c,function(){return aa(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=ei.transition,ei.transition=null;var a=pt;pt=1;var o=at;at|=4,_p.current=null,rM(t,n),ix(n,t),PE(df),yc=!!uf,df=uf=null,t.current=n,sM(n),US(),at=o,pt=a,ei.transition=s}else t.current=n;if(hl&&(hl=!1,Ar=t,Oc=r),s=t.pendingLanes,s===0&&(Ur=null),kS(n.stateNode),Pn(t,Ft()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Uc)throw Uc=!1,t=Nf,Nf=null,t;return Oc&1&&t.tag!==0&&aa(),s=t.pendingLanes,s&1?t===Lf?uo++:(uo=0,Lf=t):uo=0,Wr(),null}function aa(){if(Ar!==null){var t=G0(Oc),e=ei.transition,n=pt;try{if(ei.transition=null,pt=16>t?16:t,Ar===null)var i=!1;else{if(t=Ar,Ar=null,Oc=0,at&6)throw Error(oe(331));var r=at;for(at|=4,Ce=t.current;Ce!==null;){var s=Ce,a=s.child;if(Ce.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(Ce=c;Ce!==null;){var h=Ce;switch(h.tag){case 0:case 11:case 15:lo(8,h,s)}var p=h.child;if(p!==null)p.return=h,Ce=p;else for(;Ce!==null;){h=Ce;var d=h.sibling,g=h.return;if(ex(h),h===c){Ce=null;break}if(d!==null){d.return=g,Ce=d;break}Ce=g}}}var x=s.alternate;if(x!==null){var S=x.child;if(S!==null){x.child=null;do{var m=S.sibling;S.sibling=null,S=m}while(S!==null)}}Ce=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,Ce=a;else e:for(;Ce!==null;){if(s=Ce,s.flags&2048)switch(s.tag){case 0:case 11:case 15:lo(9,s,s.return)}var f=s.sibling;if(f!==null){f.return=s.return,Ce=f;break e}Ce=s.return}}var _=t.current;for(Ce=_;Ce!==null;){a=Ce;var M=a.child;if(a.subtreeFlags&2064&&M!==null)M.return=a,Ce=M;else e:for(a=_;Ce!==null;){if(o=Ce,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:su(9,o)}}catch(w){Dt(o,o.return,w)}if(o===a){Ce=null;break e}var v=o.sibling;if(v!==null){v.return=o.return,Ce=v;break e}Ce=o.return}}if(at=r,Wr(),Ni&&typeof Ni.onPostCommitFiberRoot=="function")try{Ni.onPostCommitFiberRoot(Zc,t)}catch{}i=!0}return i}finally{pt=n,ei.transition=e}}return!1}function Eg(t,e,n){e=ga(n,e),e=G_(t,e,1),t=Ir(t,e,1),e=xn(),t!==null&&(Vo(t,1,e),Pn(t,e))}function Dt(t,e,n){if(t.tag===3)Eg(t,t,n);else for(;e!==null;){if(e.tag===3){Eg(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ur===null||!Ur.has(i))){t=ga(n,t),t=j_(e,t,1),e=Ir(e,t,1),t=xn(),e!==null&&(Vo(e,1,t),Pn(e,t));break}}e=e.return}}function dM(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=xn(),t.pingedLanes|=t.suspendedLanes&n,Qt===t&&(nn&n)===n&&($t===4||$t===3&&(nn&130023424)===nn&&500>Ft()-yp?cs(t,0):xp|=n),Pn(t,e)}function ux(t,e){e===0&&(t.mode&1?(e=il,il<<=1,!(il&130023424)&&(il=4194304)):e=1);var n=xn();t=ar(t,e),t!==null&&(Vo(t,e,n),Pn(t,n))}function fM(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),ux(t,n)}function hM(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(oe(314))}i!==null&&i.delete(e),ux(t,n)}var dx;dx=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||An.current)Cn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return Cn=!1,eM(t,e,n);Cn=!!(t.flags&131072)}else Cn=!1,wt&&e.flags&1048576&&m_(e,Cc,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Jl(t,e),t=e.pendingProps;var r=fa(e,mn.current);sa(e,n),r=hp(null,e,i,t,r,n);var s=pp();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Rn(i)?(s=!0,Tc(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,lp(e),r.updater=ru,e.stateNode=r,r._reactInternals=e,yf(e,i,t,n),e=Mf(null,e,i,!0,s,n)):(e.tag=0,wt&&s&&tp(e),_n(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Jl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=mM(i),t=ui(i,t),r){case 0:e=Ef(null,e,i,t,n);break e;case 1:e=fg(null,e,i,t,n);break e;case 11:e=ug(null,e,i,t,n);break e;case 14:e=dg(null,e,i,ui(i.type,t),n);break e}throw Error(oe(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ui(i,r),Ef(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ui(i,r),fg(t,e,i,r,n);case 3:e:{if($_(e),t===null)throw Error(oe(387));i=e.pendingProps,s=e.memoizedState,r=s.element,S_(t,e),Pc(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=ga(Error(oe(423)),e),e=hg(t,e,i,n,r);break e}else if(i!==r){r=ga(Error(oe(424)),e),e=hg(t,e,i,n,r);break e}else for(zn=Dr(e.stateNode.containerInfo.firstChild),Hn=e,wt=!0,hi=null,n=x_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(ha(),i===r){e=or(t,e,n);break e}_n(t,e,i,n)}e=e.child}return e;case 5:return E_(e),t===null&&vf(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,ff(i,r)?a=null:s!==null&&ff(i,s)&&(e.flags|=32),q_(t,e),_n(t,e,a,n),e.child;case 6:return t===null&&vf(e),null;case 13:return Y_(t,e,n);case 4:return cp(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=pa(e,null,i,n):_n(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ui(i,r),ug(t,e,i,r,n);case 7:return _n(t,e,e.pendingProps,n),e.child;case 8:return _n(t,e,e.pendingProps.children,n),e.child;case 12:return _n(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,xt(Ac,i._currentValue),i._currentValue=a,s!==null)if(xi(s.value,a)){if(s.children===r.children&&!An.current){e=or(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=er(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),_f(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(oe(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),_f(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}_n(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,sa(e,n),r=ni(r),i=i(r),e.flags|=1,_n(t,e,i,n),e.child;case 14:return i=e.type,r=ui(i,e.pendingProps),r=ui(i.type,r),dg(t,e,i,r,n);case 15:return W_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ui(i,r),Jl(t,e),e.tag=1,Rn(i)?(t=!0,Tc(e)):t=!1,sa(e,n),V_(e,i,r),yf(e,i,r,n),Mf(null,e,i,!0,t,n);case 19:return K_(t,e,n);case 22:return X_(t,e,n)}throw Error(oe(156,e.tag))};function fx(t,e){return B0(t,e)}function pM(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Qn(t,e,n,i){return new pM(t,e,n,i)}function wp(t){return t=t.prototype,!(!t||!t.isReactComponent)}function mM(t){if(typeof t=="function")return wp(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Gh)return 11;if(t===jh)return 14}return 2}function Fr(t,e){var n=t.alternate;return n===null?(n=Qn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function tc(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")wp(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case Vs:return us(n.children,r,s,e);case Vh:a=8,r|=8;break;case Gd:return t=Qn(12,n,e,r|2),t.elementType=Gd,t.lanes=s,t;case jd:return t=Qn(13,n,e,r),t.elementType=jd,t.lanes=s,t;case Wd:return t=Qn(19,n,e,r),t.elementType=Wd,t.lanes=s,t;case E0:return ou(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case y0:a=10;break e;case S0:a=9;break e;case Gh:a=11;break e;case jh:a=14;break e;case Sr:a=16,i=null;break e}throw Error(oe(130,t==null?t:typeof t,""))}return e=Qn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function us(t,e,n,i){return t=Qn(7,t,i,e),t.lanes=n,t}function ou(t,e,n,i){return t=Qn(22,t,i,e),t.elementType=E0,t.lanes=n,t.stateNode={isHidden:!1},t}function Ku(t,e,n){return t=Qn(6,t,null,e),t.lanes=n,t}function Zu(t,e,n){return e=Qn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function gM(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Nu(0),this.expirationTimes=Nu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Nu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Tp(t,e,n,i,r,s,a,o,l){return t=new gM(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Qn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},lp(s),t}function vM(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Hs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function hx(t){if(!t)return zr;t=t._reactInternals;e:{if(ys(t)!==t||t.tag!==1)throw Error(oe(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Rn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(oe(171))}if(t.tag===1){var n=t.type;if(Rn(n))return h_(t,n,e)}return e}function px(t,e,n,i,r,s,a,o,l){return t=Tp(n,i,!0,t,r,s,a,o,l),t.context=hx(null),n=t.current,i=xn(),r=Or(n),s=er(i,r),s.callback=e??null,Ir(n,s,r),t.current.lanes=r,Vo(t,r,i),Pn(t,i),t}function lu(t,e,n,i){var r=e.current,s=xn(),a=Or(r);return n=hx(n),e.context===null?e.context=n:e.pendingContext=n,e=er(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Ir(r,e,a),t!==null&&(vi(t,r,a,s),Yl(t,r,a)),a}function kc(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Mg(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function bp(t,e){Mg(t,e),(t=t.alternate)&&Mg(t,e)}function _M(){return null}var mx=typeof reportError=="function"?reportError:function(t){console.error(t)};function Cp(t){this._internalRoot=t}cu.prototype.render=Cp.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(oe(409));lu(t,e,null,null)};cu.prototype.unmount=Cp.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;ms(function(){lu(null,t,null,null)}),e[sr]=null}};function cu(t){this._internalRoot=t}cu.prototype.unstable_scheduleHydration=function(t){if(t){var e=X0();t={blockedOn:null,target:t,priority:e};for(var n=0;n<wr.length&&e!==0&&e<wr[n].priority;n++);wr.splice(n,0,t),n===0&&$0(t)}};function Ap(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function uu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function wg(){}function xM(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=kc(a);s.call(c)}}var a=px(e,i,t,0,null,!1,!1,"",wg);return t._reactRootContainer=a,t[sr]=a.current,Eo(t.nodeType===8?t.parentNode:t),ms(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=kc(l);o.call(c)}}var l=Tp(t,0,!1,null,null,!1,!1,"",wg);return t._reactRootContainer=l,t[sr]=l.current,Eo(t.nodeType===8?t.parentNode:t),ms(function(){lu(e,l,n,i)}),l}function du(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=kc(a);o.call(l)}}lu(e,a,t,r)}else a=xM(n,e,t,r,i);return kc(a)}j0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ka(e.pendingLanes);n!==0&&(qh(e,n|1),Pn(e,Ft()),!(at&6)&&(va=Ft()+500,Wr()))}break;case 13:ms(function(){var i=ar(t,1);if(i!==null){var r=xn();vi(i,t,1,r)}}),bp(t,1)}};$h=function(t){if(t.tag===13){var e=ar(t,134217728);if(e!==null){var n=xn();vi(e,t,134217728,n)}bp(t,134217728)}};W0=function(t){if(t.tag===13){var e=Or(t),n=ar(t,e);if(n!==null){var i=xn();vi(n,t,e,i)}bp(t,e)}};X0=function(){return pt};q0=function(t,e){var n=pt;try{return pt=t,e()}finally{pt=n}};tf=function(t,e,n){switch(e){case"input":if($d(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=tu(i);if(!r)throw Error(oe(90));w0(i),$d(i,r)}}}break;case"textarea":b0(t,n);break;case"select":e=n.value,e!=null&&ta(t,!!n.multiple,e,!1)}};D0=Sp;I0=ms;var yM={usingClientEntryPoint:!1,Events:[jo,Xs,tu,N0,L0,Sp]},Ua={findFiberByHostInstance:ns,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},SM={bundleType:Ua.bundleType,version:Ua.version,rendererPackageName:Ua.rendererPackageName,rendererConfig:Ua.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ur.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=F0(t),t===null?null:t.stateNode},findFiberByHostInstance:Ua.findFiberByHostInstance||_M,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pl.isDisabled&&pl.supportsFiber)try{Zc=pl.inject(SM),Ni=pl}catch{}}Gn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yM;Gn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ap(e))throw Error(oe(200));return vM(t,e,null,n)};Gn.createRoot=function(t,e){if(!Ap(t))throw Error(oe(299));var n=!1,i="",r=mx;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Tp(t,1,!1,null,null,n,!1,i,r),t[sr]=e.current,Eo(t.nodeType===8?t.parentNode:t),new Cp(e)};Gn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(oe(188)):(t=Object.keys(t).join(","),Error(oe(268,t)));return t=F0(e),t=t===null?null:t.stateNode,t};Gn.flushSync=function(t){return ms(t)};Gn.hydrate=function(t,e,n){if(!uu(e))throw Error(oe(200));return du(null,t,e,!0,n)};Gn.hydrateRoot=function(t,e,n){if(!Ap(t))throw Error(oe(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=mx;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=px(e,null,t,1,n??null,r,!1,s,a),t[sr]=e.current,Eo(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new cu(e)};Gn.render=function(t,e,n){if(!uu(e))throw Error(oe(200));return du(null,t,e,!1,n)};Gn.unmountComponentAtNode=function(t){if(!uu(t))throw Error(oe(40));return t._reactRootContainer?(ms(function(){du(null,null,t,!1,function(){t._reactRootContainer=null,t[sr]=null})}),!0):!1};Gn.unstable_batchedUpdates=Sp;Gn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!uu(n))throw Error(oe(200));if(t==null||t._reactInternals===void 0)throw Error(oe(38));return du(t,e,n,!1,i)};Gn.version="18.3.1-next-f1338f8080-20240426";function gx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(gx)}catch(t){console.error(t)}}gx(),g0.exports=Gn;var EM=g0.exports,Tg=EM;Hd.createRoot=Tg.createRoot,Hd.hydrateRoot=Tg.hydrateRoot;/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function No(){return No=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},No.apply(null,arguments)}var Rr;(function(t){t.Pop="POP",t.Push="PUSH",t.Replace="REPLACE"})(Rr||(Rr={}));const bg="popstate";function MM(t){t===void 0&&(t={});function e(i,r){let{pathname:s,search:a,hash:o}=i.location;return Uf("",{pathname:s,search:a,hash:o},r.state&&r.state.usr||null,r.state&&r.state.key||"default")}function n(i,r){return typeof r=="string"?r:Bc(r)}return TM(e,n,null,t)}function Nt(t,e){if(t===!1||t===null||typeof t>"u")throw new Error(e)}function vx(t,e){if(!t){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function wM(){return Math.random().toString(36).substr(2,8)}function Cg(t,e){return{usr:t.state,key:t.key,idx:e}}function Uf(t,e,n,i){return n===void 0&&(n=null),No({pathname:typeof t=="string"?t:t.pathname,search:"",hash:""},typeof e=="string"?wa(e):e,{state:n,key:e&&e.key||i||wM()})}function Bc(t){let{pathname:e="/",search:n="",hash:i=""}=t;return n&&n!=="?"&&(e+=n.charAt(0)==="?"?n:"?"+n),i&&i!=="#"&&(e+=i.charAt(0)==="#"?i:"#"+i),e}function wa(t){let e={};if(t){let n=t.indexOf("#");n>=0&&(e.hash=t.substr(n),t=t.substr(0,n));let i=t.indexOf("?");i>=0&&(e.search=t.substr(i),t=t.substr(0,i)),t&&(e.pathname=t)}return e}function TM(t,e,n,i){i===void 0&&(i={});let{window:r=document.defaultView,v5Compat:s=!1}=i,a=r.history,o=Rr.Pop,l=null,c=h();c==null&&(c=0,a.replaceState(No({},a.state,{idx:c}),""));function h(){return(a.state||{idx:null}).idx}function p(){o=Rr.Pop;let m=h(),f=m==null?null:m-c;c=m,l&&l({action:o,location:S.location,delta:f})}function d(m,f){o=Rr.Push;let _=Uf(S.location,m,f);c=h()+1;let M=Cg(_,c),v=S.createHref(_);try{a.pushState(M,"",v)}catch(w){if(w instanceof DOMException&&w.name==="DataCloneError")throw w;r.location.assign(v)}s&&l&&l({action:o,location:S.location,delta:1})}function g(m,f){o=Rr.Replace;let _=Uf(S.location,m,f);c=h();let M=Cg(_,c),v=S.createHref(_);a.replaceState(M,"",v),s&&l&&l({action:o,location:S.location,delta:0})}function x(m){let f=r.location.origin!=="null"?r.location.origin:r.location.href,_=typeof m=="string"?m:Bc(m);return _=_.replace(/ $/,"%20"),Nt(f,"No window.location.(origin|href) available to create URL for href: "+_),new URL(_,f)}let S={get action(){return o},get location(){return t(r,a)},listen(m){if(l)throw new Error("A history only accepts one active listener");return r.addEventListener(bg,p),l=m,()=>{r.removeEventListener(bg,p),l=null}},createHref(m){return e(r,m)},createURL:x,encodeLocation(m){let f=x(m);return{pathname:f.pathname,search:f.search,hash:f.hash}},push:d,replace:g,go(m){return a.go(m)}};return S}var Ag;(function(t){t.data="data",t.deferred="deferred",t.redirect="redirect",t.error="error"})(Ag||(Ag={}));function bM(t,e,n){return n===void 0&&(n="/"),CM(t,e,n)}function CM(t,e,n,i){let r=typeof e=="string"?wa(e):e,s=_a(r.pathname||"/",n);if(s==null)return null;let a=_x(t);AM(a);let o=null,l=BM(s);for(let c=0;o==null&&c<a.length;++c)o=FM(a[c],l);return o}function _x(t,e,n,i){e===void 0&&(e=[]),n===void 0&&(n=[]),i===void 0&&(i="");let r=(s,a,o)=>{let l={relativePath:o===void 0?s.path||"":o,caseSensitive:s.caseSensitive===!0,childrenIndex:a,route:s};l.relativePath.startsWith("/")&&(Nt(l.relativePath.startsWith(i),'Absolute route path "'+l.relativePath+'" nested under path '+('"'+i+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),l.relativePath=l.relativePath.slice(i.length));let c=kr([i,l.relativePath]),h=n.concat(l);s.children&&s.children.length>0&&(Nt(s.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),_x(s.children,e,h,c)),!(s.path==null&&!s.index)&&e.push({path:c,score:UM(c,s.index),routesMeta:h})};return t.forEach((s,a)=>{var o;if(s.path===""||!((o=s.path)!=null&&o.includes("?")))r(s,a);else for(let l of xx(s.path))r(s,a,l)}),e}function xx(t){let e=t.split("/");if(e.length===0)return[];let[n,...i]=e,r=n.endsWith("?"),s=n.replace(/\?$/,"");if(i.length===0)return r?[s,""]:[s];let a=xx(i.join("/")),o=[];return o.push(...a.map(l=>l===""?s:[s,l].join("/"))),r&&o.push(...a),o.map(l=>t.startsWith("/")&&l===""?"/":l)}function AM(t){t.sort((e,n)=>e.score!==n.score?n.score-e.score:OM(e.routesMeta.map(i=>i.childrenIndex),n.routesMeta.map(i=>i.childrenIndex)))}const RM=/^:[\w-]+$/,PM=3,NM=2,LM=1,DM=10,IM=-2,Rg=t=>t==="*";function UM(t,e){let n=t.split("/"),i=n.length;return n.some(Rg)&&(i+=IM),e&&(i+=NM),n.filter(r=>!Rg(r)).reduce((r,s)=>r+(RM.test(s)?PM:s===""?LM:DM),i)}function OM(t,e){return t.length===e.length&&t.slice(0,-1).every((i,r)=>i===e[r])?t[t.length-1]-e[e.length-1]:0}function FM(t,e,n){let{routesMeta:i}=t,r={},s="/",a=[];for(let o=0;o<i.length;++o){let l=i[o],c=o===i.length-1,h=s==="/"?e:e.slice(s.length)||"/",p=Of({path:l.relativePath,caseSensitive:l.caseSensitive,end:c},h),d=l.route;if(!p)return null;Object.assign(r,p.params),a.push({params:r,pathname:kr([s,p.pathname]),pathnameBase:VM(kr([s,p.pathnameBase])),route:d}),p.pathnameBase!=="/"&&(s=kr([s,p.pathnameBase]))}return a}function Of(t,e){typeof t=="string"&&(t={path:t,caseSensitive:!1,end:!0});let[n,i]=kM(t.path,t.caseSensitive,t.end),r=e.match(n);if(!r)return null;let s=r[0],a=s.replace(/(.)\/+$/,"$1"),o=r.slice(1);return{params:i.reduce((c,h,p)=>{let{paramName:d,isOptional:g}=h;if(d==="*"){let S=o[p]||"";a=s.slice(0,s.length-S.length).replace(/(.)\/+$/,"$1")}const x=o[p];return g&&!x?c[d]=void 0:c[d]=(x||"").replace(/%2F/g,"/"),c},{}),pathname:s,pathnameBase:a,pattern:t}}function kM(t,e,n){e===void 0&&(e=!1),n===void 0&&(n=!0),vx(t==="*"||!t.endsWith("*")||t.endsWith("/*"),'Route path "'+t+'" will be treated as if it were '+('"'+t.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+t.replace(/\*$/,"/*")+'".'));let i=[],r="^"+t.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(a,o,l)=>(i.push({paramName:o,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return t.endsWith("*")?(i.push({paramName:"*"}),r+=t==="*"||t==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":t!==""&&t!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,e?void 0:"i"),i]}function BM(t){try{return t.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return vx(!1,'The URL path "'+t+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+e+").")),t}}function _a(t,e){if(e==="/")return t;if(!t.toLowerCase().startsWith(e.toLowerCase()))return null;let n=e.endsWith("/")?e.length-1:e.length,i=t.charAt(n);return i&&i!=="/"?null:t.slice(n)||"/"}function zM(t,e){e===void 0&&(e="/");let{pathname:n,search:i="",hash:r=""}=typeof t=="string"?wa(t):t,s;return n?(n=yx(n),n.startsWith("/")?s=Pg(n.substring(1),"/"):s=Pg(n,e)):s=e,{pathname:s,search:GM(i),hash:jM(r)}}function Pg(t,e){let n=e.replace(/\/+$/,"").split("/");return t.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function Ju(t,e,n,i){return"Cannot include a '"+t+"' character in a manually specified "+("`to."+e+"` field ["+JSON.stringify(i)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function HM(t){return t.filter((e,n)=>n===0||e.route.path&&e.route.path.length>0)}function Rp(t,e){let n=HM(t);return e?n.map((i,r)=>r===n.length-1?i.pathname:i.pathnameBase):n.map(i=>i.pathnameBase)}function Pp(t,e,n,i){i===void 0&&(i=!1);let r;typeof t=="string"?r=wa(t):(r=No({},t),Nt(!r.pathname||!r.pathname.includes("?"),Ju("?","pathname","search",r)),Nt(!r.pathname||!r.pathname.includes("#"),Ju("#","pathname","hash",r)),Nt(!r.search||!r.search.includes("#"),Ju("#","search","hash",r)));let s=t===""||r.pathname==="",a=s?"/":r.pathname,o;if(a==null)o=n;else{let p=e.length-1;if(!i&&a.startsWith("..")){let d=a.split("/");for(;d[0]==="..";)d.shift(),p-=1;r.pathname=d.join("/")}o=p>=0?e[p]:"/"}let l=zM(r,o),c=a&&a!=="/"&&a.endsWith("/"),h=(s||a===".")&&n.endsWith("/");return!l.pathname.endsWith("/")&&(c||h)&&(l.pathname+="/"),l}const yx=t=>t.replace(/\/\/+/g,"/"),kr=t=>yx(t.join("/")),VM=t=>t.replace(/\/+$/,"").replace(/^\/*/,"/"),GM=t=>!t||t==="?"?"":t.startsWith("?")?t:"?"+t,jM=t=>!t||t==="#"?"":t.startsWith("#")?t:"#"+t;function WM(t){return t!=null&&typeof t.status=="number"&&typeof t.statusText=="string"&&typeof t.internal=="boolean"&&"data"in t}const Sx=["post","put","patch","delete"];new Set(Sx);const XM=["get",...Sx];new Set(XM);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Lo(){return Lo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Lo.apply(null,arguments)}const fu=P.createContext(null),Ex=P.createContext(null),dr=P.createContext(null),hu=P.createContext(null),Bi=P.createContext({outlet:null,matches:[],isDataRoute:!1}),Mx=P.createContext(null);function qM(t,e){let{relative:n}=e===void 0?{}:e;Ta()||Nt(!1);let{basename:i,navigator:r}=P.useContext(dr),{hash:s,pathname:a,search:o}=pu(t,{relative:n}),l=a;return i!=="/"&&(l=a==="/"?i:kr([i,a])),r.createHref({pathname:l,search:o,hash:s})}function Ta(){return P.useContext(hu)!=null}function Xr(){return Ta()||Nt(!1),P.useContext(hu).location}function wx(t){P.useContext(dr).static||P.useLayoutEffect(t)}function zi(){let{isDataRoute:t}=P.useContext(Bi);return t?lw():$M()}function $M(){Ta()||Nt(!1);let t=P.useContext(fu),{basename:e,future:n,navigator:i}=P.useContext(dr),{matches:r}=P.useContext(Bi),{pathname:s}=Xr(),a=JSON.stringify(Rp(r,n.v7_relativeSplatPath)),o=P.useRef(!1);return wx(()=>{o.current=!0}),P.useCallback(function(c,h){if(h===void 0&&(h={}),!o.current)return;if(typeof c=="number"){i.go(c);return}let p=Pp(c,JSON.parse(a),s,h.relative==="path");t==null&&e!=="/"&&(p.pathname=p.pathname==="/"?e:kr([e,p.pathname])),(h.replace?i.replace:i.push)(p,h.state,h)},[e,i,a,s,t])}const YM=P.createContext(null);function KM(t){let e=P.useContext(Bi).outlet;return e&&P.createElement(YM.Provider,{value:t},e)}function Tx(){let{matches:t}=P.useContext(Bi),e=t[t.length-1];return e?e.params:{}}function pu(t,e){let{relative:n}=e===void 0?{}:e,{future:i}=P.useContext(dr),{matches:r}=P.useContext(Bi),{pathname:s}=Xr(),a=JSON.stringify(Rp(r,i.v7_relativeSplatPath));return P.useMemo(()=>Pp(t,JSON.parse(a),s,n==="path"),[t,a,s,n])}function ZM(t,e){return JM(t,e)}function JM(t,e,n,i){Ta()||Nt(!1);let{navigator:r}=P.useContext(dr),{matches:s}=P.useContext(Bi),a=s[s.length-1],o=a?a.params:{};a&&a.pathname;let l=a?a.pathnameBase:"/";a&&a.route;let c=Xr(),h;if(e){var p;let m=typeof e=="string"?wa(e):e;l==="/"||(p=m.pathname)!=null&&p.startsWith(l)||Nt(!1),h=m}else h=c;let d=h.pathname||"/",g=d;if(l!=="/"){let m=l.replace(/^\//,"").split("/");g="/"+d.replace(/^\//,"").split("/").slice(m.length).join("/")}let x=bM(t,{pathname:g}),S=iw(x&&x.map(m=>Object.assign({},m,{params:Object.assign({},o,m.params),pathname:kr([l,r.encodeLocation?r.encodeLocation(m.pathname).pathname:m.pathname]),pathnameBase:m.pathnameBase==="/"?l:kr([l,r.encodeLocation?r.encodeLocation(m.pathnameBase).pathname:m.pathnameBase])})),s,n,i);return e&&S?P.createElement(hu.Provider,{value:{location:Lo({pathname:"/",search:"",hash:"",state:null,key:"default"},h),navigationType:Rr.Pop}},S):S}function QM(){let t=ow(),e=WM(t)?t.status+" "+t.statusText:t instanceof Error?t.message:JSON.stringify(t),n=t instanceof Error?t.stack:null,r={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return P.createElement(P.Fragment,null,P.createElement("h2",null,"Unexpected Application Error!"),P.createElement("h3",{style:{fontStyle:"italic"}},e),n?P.createElement("pre",{style:r},n):null,null)}const ew=P.createElement(QM,null);class tw extends P.Component{constructor(e){super(e),this.state={location:e.location,revalidation:e.revalidation,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,n){return n.location!==e.location||n.revalidation!=="idle"&&e.revalidation==="idle"?{error:e.error,location:e.location,revalidation:e.revalidation}:{error:e.error!==void 0?e.error:n.error,location:n.location,revalidation:e.revalidation||n.revalidation}}componentDidCatch(e,n){console.error("React Router caught the following error during render",e,n)}render(){return this.state.error!==void 0?P.createElement(Bi.Provider,{value:this.props.routeContext},P.createElement(Mx.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function nw(t){let{routeContext:e,match:n,children:i}=t,r=P.useContext(fu);return r&&r.static&&r.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(r.staticContext._deepestRenderedBoundaryId=n.route.id),P.createElement(Bi.Provider,{value:e},i)}function iw(t,e,n,i){var r;if(e===void 0&&(e=[]),n===void 0&&(n=null),i===void 0&&(i=null),t==null){var s;if(!n)return null;if(n.errors)t=n.matches;else if((s=i)!=null&&s.v7_partialHydration&&e.length===0&&!n.initialized&&n.matches.length>0)t=n.matches;else return null}let a=t,o=(r=n)==null?void 0:r.errors;if(o!=null){let h=a.findIndex(p=>p.route.id&&(o==null?void 0:o[p.route.id])!==void 0);h>=0||Nt(!1),a=a.slice(0,Math.min(a.length,h+1))}let l=!1,c=-1;if(n&&i&&i.v7_partialHydration)for(let h=0;h<a.length;h++){let p=a[h];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(c=h),p.route.id){let{loaderData:d,errors:g}=n,x=p.route.loader&&d[p.route.id]===void 0&&(!g||g[p.route.id]===void 0);if(p.route.lazy||x){l=!0,c>=0?a=a.slice(0,c+1):a=[a[0]];break}}}return a.reduceRight((h,p,d)=>{let g,x=!1,S=null,m=null;n&&(g=o&&p.route.id?o[p.route.id]:void 0,S=p.route.errorElement||ew,l&&(c<0&&d===0?(cw("route-fallback"),x=!0,m=null):c===d&&(x=!0,m=p.route.hydrateFallbackElement||null)));let f=e.concat(a.slice(0,d+1)),_=()=>{let M;return g?M=S:x?M=m:p.route.Component?M=P.createElement(p.route.Component,null):p.route.element?M=p.route.element:M=h,P.createElement(nw,{match:p,routeContext:{outlet:h,matches:f,isDataRoute:n!=null},children:M})};return n&&(p.route.ErrorBoundary||p.route.errorElement||d===0)?P.createElement(tw,{location:n.location,revalidation:n.revalidation,component:S,error:g,children:_(),routeContext:{outlet:null,matches:f,isDataRoute:!0}}):_()},null)}var bx=function(t){return t.UseBlocker="useBlocker",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t}(bx||{}),Cx=function(t){return t.UseBlocker="useBlocker",t.UseLoaderData="useLoaderData",t.UseActionData="useActionData",t.UseRouteError="useRouteError",t.UseNavigation="useNavigation",t.UseRouteLoaderData="useRouteLoaderData",t.UseMatches="useMatches",t.UseRevalidator="useRevalidator",t.UseNavigateStable="useNavigate",t.UseRouteId="useRouteId",t}(Cx||{});function rw(t){let e=P.useContext(fu);return e||Nt(!1),e}function sw(t){let e=P.useContext(Ex);return e||Nt(!1),e}function aw(t){let e=P.useContext(Bi);return e||Nt(!1),e}function Ax(t){let e=aw(),n=e.matches[e.matches.length-1];return n.route.id||Nt(!1),n.route.id}function ow(){var t;let e=P.useContext(Mx),n=sw(),i=Ax();return e!==void 0?e:(t=n.errors)==null?void 0:t[i]}function lw(){let{router:t}=rw(bx.UseNavigateStable),e=Ax(Cx.UseNavigateStable),n=P.useRef(!1);return wx(()=>{n.current=!0}),P.useCallback(function(r,s){s===void 0&&(s={}),n.current&&(typeof r=="number"?t.navigate(r):t.navigate(r,Lo({fromRouteId:e},s)))},[t,e])}const Ng={};function cw(t,e,n){Ng[t]||(Ng[t]=!0)}function uw(t,e){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function zc(t){let{to:e,replace:n,state:i,relative:r}=t;Ta()||Nt(!1);let{future:s,static:a}=P.useContext(dr),{matches:o}=P.useContext(Bi),{pathname:l}=Xr(),c=zi(),h=Pp(e,Rp(o,s.v7_relativeSplatPath),l,r==="path"),p=JSON.stringify(h);return P.useEffect(()=>c(JSON.parse(p),{replace:n,state:i,relative:r}),[c,p,r,n,i]),null}function dw(t){return KM(t.context)}function Xt(t){Nt(!1)}function fw(t){let{basename:e="/",children:n=null,location:i,navigationType:r=Rr.Pop,navigator:s,static:a=!1,future:o}=t;Ta()&&Nt(!1);let l=e.replace(/^\/*/,"/"),c=P.useMemo(()=>({basename:l,navigator:s,static:a,future:Lo({v7_relativeSplatPath:!1},o)}),[l,o,s,a]);typeof i=="string"&&(i=wa(i));let{pathname:h="/",search:p="",hash:d="",state:g=null,key:x="default"}=i,S=P.useMemo(()=>{let m=_a(h,l);return m==null?null:{location:{pathname:m,search:p,hash:d,state:g,key:x},navigationType:r}},[l,h,p,d,g,x,r]);return S==null?null:P.createElement(dr.Provider,{value:c},P.createElement(hu.Provider,{children:n,value:S}))}function hw(t){let{children:e,location:n}=t;return ZM(Ff(e),n)}new Promise(()=>{});function Ff(t,e){e===void 0&&(e=[]);let n=[];return P.Children.forEach(t,(i,r)=>{if(!P.isValidElement(i))return;let s=[...e,r];if(i.type===P.Fragment){n.push.apply(n,Ff(i.props.children,s));return}i.type!==Xt&&Nt(!1),!i.props.index||!i.props.children||Nt(!1);let a={id:i.props.id||s.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(a.children=Ff(i.props.children,s)),n.push(a)}),n}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function Hc(){return Hc=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)({}).hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},Hc.apply(null,arguments)}function Rx(t,e){if(t==null)return{};var n={};for(var i in t)if({}.hasOwnProperty.call(t,i)){if(e.indexOf(i)!==-1)continue;n[i]=t[i]}return n}function pw(t){return!!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)}function mw(t,e){return t.button===0&&(!e||e==="_self")&&!pw(t)}function kf(t){return t===void 0&&(t=""),new URLSearchParams(typeof t=="string"||Array.isArray(t)||t instanceof URLSearchParams?t:Object.keys(t).reduce((e,n)=>{let i=t[n];return e.concat(Array.isArray(i)?i.map(r=>[n,r]):[[n,i]])},[]))}function gw(t,e){let n=kf(t);return e&&e.forEach((i,r)=>{n.has(r)||e.getAll(r).forEach(s=>{n.append(r,s)})}),n}const vw=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],_w=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],xw="6";try{window.__reactRouterVersion=xw}catch{}const yw=P.createContext({isTransitioning:!1}),Sw="startTransition",Lg=dS[Sw];function Ew(t){let{basename:e,children:n,future:i,window:r}=t,s=P.useRef();s.current==null&&(s.current=MM({window:r,v5Compat:!0}));let a=s.current,[o,l]=P.useState({action:a.action,location:a.location}),{v7_startTransition:c}=i||{},h=P.useCallback(p=>{c&&Lg?Lg(()=>l(p)):l(p)},[l,c]);return P.useLayoutEffect(()=>a.listen(h),[a,h]),P.useEffect(()=>uw(i),[i]),P.createElement(fw,{basename:e,children:n,location:o.location,navigationType:o.action,navigator:a,future:i})}const Mw=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",ww=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,ti=P.forwardRef(function(e,n){let{onClick:i,relative:r,reloadDocument:s,replace:a,state:o,target:l,to:c,preventScrollReset:h,viewTransition:p}=e,d=Rx(e,vw),{basename:g}=P.useContext(dr),x,S=!1;if(typeof c=="string"&&ww.test(c)&&(x=c,Mw))try{let M=new URL(window.location.href),v=c.startsWith("//")?new URL(M.protocol+c):new URL(c),w=_a(v.pathname,g);v.origin===M.origin&&w!=null?c=w+v.search+v.hash:S=!0}catch{}let m=qM(c,{relative:r}),f=bw(c,{replace:a,state:o,target:l,preventScrollReset:h,relative:r,viewTransition:p});function _(M){i&&i(M),M.defaultPrevented||f(M)}return P.createElement("a",Hc({},d,{href:x||m,onClick:S||s?i:_,ref:n,target:l}))}),Dg=P.forwardRef(function(e,n){let{"aria-current":i="page",caseSensitive:r=!1,className:s="",end:a=!1,style:o,to:l,viewTransition:c,children:h}=e,p=Rx(e,_w),d=pu(l,{relative:p.relative}),g=Xr(),x=P.useContext(Ex),{navigator:S,basename:m}=P.useContext(dr),f=x!=null&&Aw(d)&&c===!0,_=S.encodeLocation?S.encodeLocation(d).pathname:d.pathname,M=g.pathname,v=x&&x.navigation&&x.navigation.location?x.navigation.location.pathname:null;r||(M=M.toLowerCase(),v=v?v.toLowerCase():null,_=_.toLowerCase()),v&&m&&(v=_a(v,m)||v);const w=_!=="/"&&_.endsWith("/")?_.length-1:_.length;let T=M===_||!a&&M.startsWith(_)&&M.charAt(w)==="/",A=v!=null&&(v===_||!a&&v.startsWith(_)&&v.charAt(_.length)==="/"),y={isActive:T,isPending:A,isTransitioning:f},C=T?i:void 0,N;typeof s=="function"?N=s(y):N=[s,T?"active":null,A?"pending":null,f?"transitioning":null].filter(Boolean).join(" ");let D=typeof o=="function"?o(y):o;return P.createElement(ti,Hc({},p,{"aria-current":C,className:N,ref:n,style:D,to:l,viewTransition:c}),typeof h=="function"?h(y):h)});var Bf;(function(t){t.UseScrollRestoration="useScrollRestoration",t.UseSubmit="useSubmit",t.UseSubmitFetcher="useSubmitFetcher",t.UseFetcher="useFetcher",t.useViewTransitionState="useViewTransitionState"})(Bf||(Bf={}));var Ig;(function(t){t.UseFetcher="useFetcher",t.UseFetchers="useFetchers",t.UseScrollRestoration="useScrollRestoration"})(Ig||(Ig={}));function Tw(t){let e=P.useContext(fu);return e||Nt(!1),e}function bw(t,e){let{target:n,replace:i,state:r,preventScrollReset:s,relative:a,viewTransition:o}=e===void 0?{}:e,l=zi(),c=Xr(),h=pu(t,{relative:a});return P.useCallback(p=>{if(mw(p,n)){p.preventDefault();let d=i!==void 0?i:Bc(c)===Bc(h);l(t,{replace:d,state:r,preventScrollReset:s,relative:a,viewTransition:o})}},[c,l,h,i,r,n,t,s,a,o])}function Cw(t){let e=P.useRef(kf(t)),n=P.useRef(!1),i=Xr(),r=P.useMemo(()=>gw(i.search,n.current?null:e.current),[i.search]),s=zi(),a=P.useCallback((o,l)=>{const c=kf(typeof o=="function"?o(r):o);n.current=!0,s("?"+c,l)},[s,r]);return[r,a]}function Aw(t,e){e===void 0&&(e={});let n=P.useContext(yw);n==null&&Nt(!1);let{basename:i}=Tw(Bf.useViewTransitionState),r=pu(t,{relative:e.relative});if(!n.isTransitioning)return!1;let s=_a(n.currentLocation.pathname,i)||n.currentLocation.pathname,a=_a(n.nextLocation.pathname,i)||n.nextLocation.pathname;return Of(r.pathname,a)!=null||Of(r.pathname,s)!=null}const zf="bigface.token";class ot extends Error{constructor(n,i){super(i);gm(this,"status");this.name="ApiError",this.status=n}}function mu(){return localStorage.getItem(zf)}function ml(t){t?localStorage.setItem(zf,t):localStorage.removeItem(zf)}async function gu(t,e={}){const n=mu(),i=e.body instanceof FormData,r={...n?{Authorization:`Bearer ${n}`}:{},...i?{}:{"Content-Type":"application/json"}};for(const[o,l]of Object.entries(e.headers??{}))r[o]=l;const s=await fetch(`/api${t}`,{...e,headers:r});if(s.status===204)return;const a=await s.json().catch(()=>({}));if(!s.ok)throw new ot(s.status,a.error||`Request failed (${s.status})`);return a}const zt=t=>gu(t),Et=(t,e)=>gu(t,{method:"POST",body:e===void 0?void 0:JSON.stringify(e)}),Rw=(t,e)=>gu(t,{method:"PATCH",body:JSON.stringify(e)}),Do=t=>gu(t,{method:"DELETE"}),Qu={signup:t=>Et("/auth/signup",t),login:(t,e)=>Et("/auth/login",{identifier:t,password:e}),me:()=>zt("/auth/me")},bn={get:t=>zt(`/users/${t}`),search:t=>zt(`/users/search?q=${encodeURIComponent(t)}`),updateMe:t=>Rw("/users/me",t),leaderboard:(t=50)=>zt(`/users/leaderboard?limit=${t}`),colorOfWeek:()=>zt("/users/color-of-week"),hallOfFame:(t=20)=>zt(`/users/hall-of-fame?limit=${t}`),legendary:()=>zt("/users/legendary"),like:t=>Et(`/users/${t}/like`),unlike:t=>Do(`/users/${t}/like`),block:t=>Et(`/users/${t}/block`),unblock:t=>Do(`/users/${t}/block`)},oa={list:()=>zt("/rooms"),create:t=>Et("/rooms",t),get:t=>zt(`/rooms/${t}`),dm:t=>Et("/rooms/dm",{userId:t}),join:t=>Et(`/rooms/${t}/join`),leave:t=>Et(`/rooms/${t}/leave`),markRead:t=>Et(`/rooms/${t}/read`)},ws={list:(t,e=50,n)=>zt(`/rooms/${t}/messages?limit=${e}${n?`&before=${encodeURIComponent(n)}`:""}`),send:(t,e)=>Et(`/rooms/${t}/messages`,e),addReaction:(t,e)=>Et(`/messages/${t}/reactions`,{emoji:e}),removeReaction:(t,e)=>Do(`/messages/${t}/reactions/${encodeURIComponent(e)}`),markRead:t=>Et(`/messages/${t}/read`)},vu={upload:async t=>{const e=new FormData;e.append("file",t);const n=mu(),i=await fetch("/api/uploads",{method:"POST",headers:n?{Authorization:`Bearer ${n}`}:{},body:e});if(i.status===204)return;const r=await i.json().catch(()=>({}));if(!i.ok)throw new ot(i.status,r.error||`Upload failed (${i.status})`);return{url:r.url,name:r.name,mime:r.mime,size:r.size}}},ss={list:(t=20)=>zt(`/media?limit=${t}`),create:t=>Et("/media",t),like:t=>Et(`/media/${t}/like`),unlike:t=>Do(`/media/${t}/like`)},Oa={items:()=>zt("/avatar/items"),mine:()=>zt("/avatar/me"),acquire:t=>Et("/avatar/acquire",{itemId:t}),equip:t=>Et("/avatar/equip",{itemId:t}),unequip:t=>Et("/avatar/unequip",{slot:t})},Vc={get:()=>zt("/wallet"),purchase:t=>Et("/wallet/purchase",{packId:t}),confirm:t=>Et("/wallet/confirm",{paymentIntentId:t})},Gc={catalog:()=>zt("/gifts/catalog"),send:t=>Et("/gifts",t),received:()=>zt("/gifts/received"),sent:()=>zt("/gifts/sent")},ed={summary:()=>zt("/earnings/summary"),connect:()=>Et("/earnings/connect"),payout:t=>Et("/earnings/payout",{amountCents:t})},Ug={me:()=>zt("/throne/me"),legendary:()=>zt("/throne/legendary")},Px={report:t=>Et("/reports",t),safety:t=>Et("/reports/safety",t)},Og={start:t=>Et(`/rooms/${t}/video/start`),end:t=>Do(`/video/sessions/${t}/end`)},Ui=Object.create(null);Ui.open="0";Ui.close="1";Ui.ping="2";Ui.pong="3";Ui.message="4";Ui.upgrade="5";Ui.noop="6";const nc=Object.create(null);Object.keys(Ui).forEach(t=>{nc[Ui[t]]=t});const Hf={type:"error",data:"parser error"},Nx=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Lx=typeof ArrayBuffer=="function",Dx=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t&&t.buffer instanceof ArrayBuffer,Np=({type:t,data:e},n,i)=>Nx&&e instanceof Blob?n?i(e):Fg(e,i):Lx&&(e instanceof ArrayBuffer||Dx(e))?n?i(e):Fg(new Blob([e]),i):i(Ui[t]+(e||"")),Fg=(t,e)=>{const n=new FileReader;return n.onload=function(){const i=n.result.split(",")[1];e("b"+(i||""))},n.readAsDataURL(t)};function kg(t){return t instanceof Uint8Array?t:t instanceof ArrayBuffer?new Uint8Array(t):new Uint8Array(t.buffer,t.byteOffset,t.byteLength)}let td;function Pw(t,e){if(Nx&&t.data instanceof Blob)return t.data.arrayBuffer().then(kg).then(e);if(Lx&&(t.data instanceof ArrayBuffer||Dx(t.data)))return e(kg(t.data));Np(t,!1,n=>{td||(td=new TextEncoder),e(td.encode(n))})}const Bg="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",Ja=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let t=0;t<Bg.length;t++)Ja[Bg.charCodeAt(t)]=t;const Nw=t=>{let e=t.length*.75,n=t.length,i,r=0,s,a,o,l;t[t.length-1]==="="&&(e--,t[t.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<n;i+=4)s=Ja[t.charCodeAt(i)],a=Ja[t.charCodeAt(i+1)],o=Ja[t.charCodeAt(i+2)],l=Ja[t.charCodeAt(i+3)],h[r++]=s<<2|a>>4,h[r++]=(a&15)<<4|o>>2,h[r++]=(o&3)<<6|l&63;return c},Lw=typeof ArrayBuffer=="function",Lp=(t,e)=>{if(typeof t!="string")return{type:"message",data:Ix(t,e)};const n=t.charAt(0);return n==="b"?{type:"message",data:Dw(t.substring(1),e)}:nc[n]?t.length>1?{type:nc[n],data:t.substring(1)}:{type:nc[n]}:Hf},Dw=(t,e)=>{if(Lw){const n=Nw(t);return Ix(n,e)}else return{base64:!0,data:t}},Ix=(t,e)=>{switch(e){case"blob":return t instanceof Blob?t:new Blob([t]);case"arraybuffer":default:return t instanceof ArrayBuffer?t:t.buffer}},Ux="",Iw=(t,e)=>{const n=t.length,i=new Array(n);let r=0;t.forEach((s,a)=>{Np(s,!1,o=>{i[a]=o,++r===n&&e(i.join(Ux))})})},Uw=(t,e)=>{const n=t.split(Ux),i=[];for(let r=0;r<n.length;r++){const s=Lp(n[r],e);if(i.push(s),s.type==="error")break}return i};function Ow(){return new TransformStream({transform(t,e){Pw(t,n=>{const i=n.length;let r;if(i<126)r=new Uint8Array(1),new DataView(r.buffer).setUint8(0,i);else if(i<65536){r=new Uint8Array(3);const s=new DataView(r.buffer);s.setUint8(0,126),s.setUint16(1,i)}else{r=new Uint8Array(9);const s=new DataView(r.buffer);s.setUint8(0,127),s.setBigUint64(1,BigInt(i))}t.data&&typeof t.data!="string"&&(r[0]|=128),e.enqueue(r),e.enqueue(n)})}})}let nd;function gl(t){return t.reduce((e,n)=>e+n.length,0)}function vl(t,e){if(t[0].length===e)return t.shift();const n=new Uint8Array(e);let i=0;for(let r=0;r<e;r++)n[r]=t[0][i++],i===t[0].length&&(t.shift(),i=0);return t.length&&i<t[0].length&&(t[0]=t[0].slice(i)),n}function Fw(t,e){nd||(nd=new TextDecoder);const n=[];let i=0,r=-1,s=!1;return new TransformStream({transform(a,o){for(n.push(a);;){if(i===0){if(gl(n)<1)break;const l=vl(n,1);s=(l[0]&128)===128,r=l[0]&127,r<126?i=3:r===126?i=1:i=2}else if(i===1){if(gl(n)<2)break;const l=vl(n,2);r=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(gl(n)<8)break;const l=vl(n,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){o.enqueue(Hf);break}r=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(gl(n)<r)break;const l=vl(n,r);o.enqueue(Lp(s?l:nd.decode(l),e)),i=0}if(r===0||r>t){o.enqueue(Hf);break}}}})}const Ox=4;function Vt(t){if(t)return kw(t)}function kw(t){for(var e in Vt.prototype)t[e]=Vt.prototype[e];return t}Vt.prototype.on=Vt.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this};Vt.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this};Vt.prototype.off=Vt.prototype.removeListener=Vt.prototype.removeAllListeners=Vt.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(arguments.length==1)return delete this._callbacks["$"+t],this;for(var i,r=0;r<n.length;r++)if(i=n[r],i===e||i.fn===e){n.splice(r,1);break}return n.length===0&&delete this._callbacks["$"+t],this};Vt.prototype.emit=function(t){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),n=this._callbacks["$"+t],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(n){n=n.slice(0);for(var i=0,r=n.length;i<r;++i)n[i].apply(this,e)}return this};Vt.prototype.emitReserved=Vt.prototype.emit;Vt.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]};Vt.prototype.hasListeners=function(t){return!!this.listeners(t).length};const _u=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,n)=>n(e,0),Zn=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Bw="arraybuffer";function Fx(t,...e){return e.reduce((n,i)=>(t.hasOwnProperty(i)&&(n[i]=t[i]),n),{})}const zw=Zn.setTimeout,Hw=Zn.clearTimeout;function xu(t,e){e.useNativeTimers?(t.setTimeoutFn=zw.bind(Zn),t.clearTimeoutFn=Hw.bind(Zn)):(t.setTimeoutFn=Zn.setTimeout.bind(Zn),t.clearTimeoutFn=Zn.clearTimeout.bind(Zn))}const Vw=1.33;function Gw(t){return typeof t=="string"?jw(t):Math.ceil((t.byteLength||t.size)*Vw)}function jw(t){let e=0,n=0;for(let i=0,r=t.length;i<r;i++)e=t.charCodeAt(i),e<128?n+=1:e<2048?n+=2:e<55296||e>=57344?n+=3:(i++,n+=4);return n}function kx(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ww(t){let e="";for(let n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e}function Xw(t){let e={},n=t.split("&");for(let i=0,r=n.length;i<r;i++){let s=n[i].split("=");e[decodeURIComponent(s[0])]=decodeURIComponent(s[1])}return e}class qw extends Error{constructor(e,n,i){super(e),this.description=n,this.context=i,this.type="TransportError"}}class Dp extends Vt{constructor(e){super(),this.writable=!1,xu(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,n,i){return super.emitReserved("error",new qw(e,n,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const n=Lp(e,this.socket.binaryType);this.onPacket(n)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,n={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(n)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const n=Ww(e);return n.length?"?"+n:""}}class $w extends Dp{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const n=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||n()})),this.writable||(i++,this.once("drain",function(){--i||n()}))}else n()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const n=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Uw(e,this.socket.binaryType).forEach(n),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Iw(e,n=>{this.doWrite(n,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",n=this.query||{};return this.opts.timestampRequests!==!1&&(n[this.opts.timestampParam]=kx()),!this.supportsBinary&&!n.sid&&(n.b64=1),this.createUri(e,n)}}let Bx=!1;try{Bx=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Yw=Bx;function Kw(){}class Zw extends $w{constructor(e){if(super(e),typeof location<"u"){const n=location.protocol==="https:";let i=location.port;i||(i=n?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,n){const i=this.request({method:"POST",data:e});i.on("success",n),i.on("error",(r,s)=>{this.onError("xhr post error",r,s)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(n,i)=>{this.onError("xhr poll error",n,i)}),this.pollXhr=e}}class Di extends Vt{constructor(e,n,i){super(),this.createRequest=e,xu(this,i),this._opts=i,this._method=i.method||"GET",this._uri=n,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const n=Fx(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");n.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(n);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let r in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(r)&&i.setRequestHeader(r,this._opts.extraHeaders[r])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var r;i.readyState===3&&((r=this._opts.cookieJar)===null||r===void 0||r.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(r){this.setTimeoutFn(()=>{this._onError(r)},0);return}typeof document<"u"&&(this._index=Di.requestsCount++,Di.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Kw,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete Di.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}Di.requestsCount=0;Di.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",zg);else if(typeof addEventListener=="function"){const t="onpagehide"in Zn?"pagehide":"unload";addEventListener(t,zg,!1)}}function zg(){for(let t in Di.requests)Di.requests.hasOwnProperty(t)&&Di.requests[t].abort()}const Jw=function(){const t=zx({xdomain:!1});return t&&t.responseType!==null}();class Qw extends Zw{constructor(e){super(e);const n=e&&e.forceBase64;this.supportsBinary=Jw&&!n}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new Di(zx,this.uri(),e)}}function zx(t){const e=t.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Yw))return new XMLHttpRequest}catch{}if(!e)try{return new Zn[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Hx=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class eT extends Dp{get name(){return"websocket"}doOpen(){const e=this.uri(),n=this.opts.protocols,i=Hx?{}:Fx(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,n,i)}catch(r){return this.emitReserved("error",r)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const i=e[n],r=n===e.length-1;Np(i,this.supportsBinary,s=>{try{this.doWrite(i,s)}catch{}r&&_u(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",n=this.query||{};return this.opts.timestampRequests&&(n[this.opts.timestampParam]=kx()),this.supportsBinary||(n.b64=1),this.createUri(e,n)}}const id=Zn.WebSocket||Zn.MozWebSocket;class tT extends eT{createSocket(e,n,i){return Hx?new id(e,n,i):n?new id(e,n):new id(e)}doWrite(e,n){this.ws.send(n)}}class nT extends Dp{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const n=Fw(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(n).getReader(),r=Ow();r.readable.pipeTo(e.writable),this._writer=r.writable.getWriter();const s=()=>{i.read().then(({done:o,value:l})=>{o||(this.onPacket(l),s())}).catch(o=>{})};s();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let n=0;n<e.length;n++){const i=e[n],r=n===e.length-1;this._writer.write(i).then(()=>{r&&_u(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const iT={websocket:tT,webtransport:nT,polling:Qw},rT=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,sT=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function Vf(t){if(t.length>8e3)throw"URI too long";const e=t,n=t.indexOf("["),i=t.indexOf("]");n!=-1&&i!=-1&&(t=t.substring(0,n)+t.substring(n,i).replace(/:/g,";")+t.substring(i,t.length));let r=rT.exec(t||""),s={},a=14;for(;a--;)s[sT[a]]=r[a]||"";return n!=-1&&i!=-1&&(s.source=e,s.host=s.host.substring(1,s.host.length-1).replace(/;/g,":"),s.authority=s.authority.replace("[","").replace("]","").replace(/;/g,":"),s.ipv6uri=!0),s.pathNames=aT(s,s.path),s.queryKey=oT(s,s.query),s}function aT(t,e){const n=/\/{2,9}/g,i=e.replace(n,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function oT(t,e){const n={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,r,s){r&&(n[r]=s)}),n}const Gf=typeof addEventListener=="function"&&typeof removeEventListener=="function",ic=[];Gf&&addEventListener("offline",()=>{ic.forEach(t=>t())},!1);let Vx=class Bs extends Vt{constructor(e,n={}){var i,r;if(super(),this.binaryType=Bw,this.writeBuffer=[],this._prevBufferLen=0,this._upgrades=[],this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(n=e,e=null),e){const s=Vf(e);n.hostname=s.host,n.secure=s.protocol==="https"||s.protocol==="wss",n.port=s.port,s.query&&(n.query=s.query)}else n.host&&(n.hostname=Vf(n.host).host);if(xu(this,n),this.secure=n.secure!=null?n.secure:typeof location<"u"&&location.protocol==="https:",n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.hostname=n.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=n.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),n.transportImplementations&&n.transports)throw new Error("specifying both 'transportImplementations' and 'transports' options is not supported");n.transportImplementations||!((i=n.transports)===null||i===void 0)&&i.length&&typeof n.transports[0]=="function"?(this.transports=[],this._transportsByName=Object.create(null),((r=n.transportImplementations)!==null&&r!==void 0?r:n.transports).forEach(s=>{const a=s.prototype.name;this.transports.push(a),this._transportsByName[a]=s})):(this.transports=n.transports?[...n.transports]:["polling","websocket","webtransport"],this._transportsByName=iT),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},n),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Xw(this.opts.query)),Gf&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},ic.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const n=Object.assign({},this.opts.query);n.EIO=Ox,n.transport=e,this.id&&(n.sid=this.id);const i=Object.assign({},this.opts,{query:n,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&Bs.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const n=this.createTransport(e);n.open(),this.setTransport(n)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",n=>this._onClose("transport close",n))}_probe(e){let n=this.createTransport(e),i=!1;Bs.priorWebsocketSuccess=!1;const r=()=>{i||(n.send([{type:"ping",data:"probe"}]),n.once("packet",p=>{if(!i)if(p.type==="pong"&&p.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",n),!n)return;Bs.priorWebsocketSuccess=n.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(n),n.send([{type:"upgrade"}]),this.emitReserved("upgrade",n),n=null,this.upgrading=!1,this.flush())})}else{const d=new Error("probe error");d.transport=n.name,this.emitReserved("upgradeError",d)}}))};function s(){i||(i=!0,h(),n.close(),n=null)}const a=p=>{const d=new Error("probe error: "+p);d.transport=n.name,s(),this.emitReserved("upgradeError",d)};function o(){a("transport closed")}function l(){a("socket closed")}function c(p){n&&p.name!==n.name&&s()}const h=()=>{n.removeListener("open",r),n.removeListener("error",a),n.removeListener("close",o),this.off("close",l),this.off("upgrading",c)};n.once("open",r),n.once("error",a),n.once("close",o),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||n.open()},200):n.open()}onOpen(){if(this.readyState="open",Bs.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const n=new Error("server error");n.code=e.data,this._onError(n);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._upgrades=this._filterUpgrades(e.upgrades),this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let n=1;for(let i=0;i<this.writeBuffer.length;i++){const r=this.writeBuffer[i].data;if(r&&(n+=Gw(r)),i>0&&n>this._maxPayload)return this.writeBuffer.slice(0,i);n+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,_u(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,n,i){return this._sendPacket("message",e,n,i),this}send(e,n,i){return this._sendPacket("message",e,n,i),this}_sendPacket(e,n,i,r){if(typeof n=="function"&&(r=n,n=void 0),typeof i=="function"&&(r=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const s={type:e,data:n,options:i};this.emitReserved("packetCreate",s),this.writeBuffer.push(s),r&&this.once("flush",r),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},n=()=>{this.off("upgrade",n),this.off("upgradeError",n),e()},i=()=>{this.once("upgrade",n),this.once("upgradeError",n)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(Bs.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,n){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),Gf&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=ic.indexOf(this._offlineEventListener);i!==-1&&ic.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,n),this.writeBuffer=[],this._prevBufferLen=0}}_filterUpgrades(e){const n=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&n.push(e[i]);return n}};Vx.protocol=Ox;function lT(t,e="",n){let i=t;n=n||typeof location<"u"&&location,t==null&&(t=n.protocol+"//"+n.host),typeof t=="string"&&(t.charAt(0)==="/"&&(t.charAt(1)==="/"?t=n.protocol+t:t=n.host+t),/^(https?|wss?):\/\//.test(t)||(typeof n<"u"?t=n.protocol+"//"+t:t="https://"+t),i=Vf(t)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const s=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+s+":"+i.port+e,i.href=i.protocol+"://"+s+(n&&n.port===i.port?"":":"+i.port),i}const cT=typeof ArrayBuffer=="function",uT=t=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer,Gx=Object.prototype.toString,dT=typeof Blob=="function"||typeof Blob<"u"&&Gx.call(Blob)==="[object BlobConstructor]",fT=typeof File=="function"||typeof File<"u"&&Gx.call(File)==="[object FileConstructor]";function Ip(t){return cT&&(t instanceof ArrayBuffer||uT(t))||dT&&t instanceof Blob||fT&&t instanceof File}function rc(t,e){if(!t||typeof t!="object")return!1;if(Array.isArray(t)){for(let n=0,i=t.length;n<i;n++)if(rc(t[n]))return!0;return!1}if(Ip(t))return!0;if(t.toJSON&&typeof t.toJSON=="function"&&arguments.length===1)return rc(t.toJSON(),!0);for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&rc(t[n]))return!0;return!1}function hT(t){const e=[],n=t.data,i=t;return i.data=sc(n,e),i.attachments=e.length,{packet:i,buffers:e}}function sc(t,e,n){if(!t)return t;if(Ip(t)){const i={_placeholder:!0,num:e.length};return e.push(t),i}else if(Array.isArray(t)){const i=new Array(t.length);for(let r=0;r<t.length;r++)i[r]=sc(t[r],e);return i}else if(typeof t=="object"&&!(t instanceof Date)){if(t.toJSON&&typeof t.toJSON=="function"&&!n)return sc(t.toJSON(),e,!0);const i={};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(i[r]=sc(t[r],e));return i}return t}function pT(t,e){return t.data=jf(t.data,e),delete t.attachments,t}function jf(t,e){if(!t)return t;if(t&&t._placeholder===!0){if(typeof t.num=="number"&&t.num>=0&&t.num<e.length)return e[t.num];throw new Error("illegal attachments")}else if(Array.isArray(t))for(let n=0;n<t.length;n++)t[n]=jf(t[n],e);else if(typeof t=="object")for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&(t[n]=jf(t[n],e));return t}const mT=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var it;(function(t){t[t.CONNECT=0]="CONNECT",t[t.DISCONNECT=1]="DISCONNECT",t[t.EVENT=2]="EVENT",t[t.ACK=3]="ACK",t[t.CONNECT_ERROR=4]="CONNECT_ERROR",t[t.BINARY_EVENT=5]="BINARY_EVENT",t[t.BINARY_ACK=6]="BINARY_ACK"})(it||(it={}));class gT{constructor(e){this.replacer=e}encode(e){return(e.type===it.EVENT||e.type===it.ACK)&&rc(e)?this.encodeAsBinary({type:e.type===it.EVENT?it.BINARY_EVENT:it.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let n=""+e.type;return(e.type===it.BINARY_EVENT||e.type===it.BINARY_ACK)&&(n+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(n+=e.nsp+","),e.id!=null&&(n+=e.id),e.data!=null&&(n+=JSON.stringify(e.data,this.replacer)),n}encodeAsBinary(e){const n=hT(e),i=this.encodeAsString(n.packet),r=n.buffers;return r.unshift(i),r}}class Up extends Vt{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let n;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");n=this.decodeString(e);const i=n.type===it.BINARY_EVENT;i||n.type===it.BINARY_ACK?(n.type=i?it.EVENT:it.ACK,this.reconstructor=new vT(n)):super.emitReserved("decoded",n)}else if(Ip(e)||e.base64)if(this.reconstructor)n=this.reconstructor.takeBinaryData(e),n&&(this.reconstructor=null,super.emitReserved("decoded",n));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let n=0;const i={type:Number(e.charAt(0))};if(it[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===it.BINARY_EVENT||i.type===it.BINARY_ACK){const s=n+1;for(;e.charAt(++n)!=="-"&&n!=e.length;);const a=e.substring(s,n);if(a!=Number(a)||e.charAt(n)!=="-")throw new Error("Illegal attachments");const o=Number(a);if(!_T(o)||o<1)throw new Error("Illegal attachments");if(o>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=o}if(e.charAt(n+1)==="/"){const s=n+1;for(;++n&&!(e.charAt(n)===","||n===e.length););i.nsp=e.substring(s,n)}else i.nsp="/";const r=e.charAt(n+1);if(r!==""&&Number(r)==r){const s=n+1;for(;++n;){const a=e.charAt(n);if(a==null||Number(a)!=a){--n;break}if(n===e.length)break}i.id=Number(e.substring(s,n+1))}if(e.charAt(++n)){const s=this.tryParse(e.substr(n));if(Up.isPayloadValid(i.type,s))i.data=s;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,n){switch(e){case it.CONNECT:return Hg(n);case it.DISCONNECT:return n===void 0;case it.CONNECT_ERROR:return typeof n=="string"||Hg(n);case it.EVENT:case it.BINARY_EVENT:return Array.isArray(n)&&(typeof n[0]=="number"||typeof n[0]=="string"&&mT.indexOf(n[0])===-1);case it.ACK:case it.BINARY_ACK:return Array.isArray(n)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class vT{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const n=pT(this.reconPack,this.buffers);return this.finishedReconstruction(),n}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const _T=Number.isInteger||function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t};function Hg(t){return Object.prototype.toString.call(t)==="[object Object]"}const xT=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Up,Encoder:gT,get PacketType(){return it}},Symbol.toStringTag,{value:"Module"}));function fi(t,e,n){return t.on(e,n),function(){t.off(e,n)}}const yT=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class jx extends Vt{constructor(e,n,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=n,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[fi(e,"open",this.onopen.bind(this)),fi(e,"packet",this.onpacket.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...n){var i,r,s;if(yT.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(n.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(n),this;const a={type:it.EVENT,data:n};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof n[n.length-1]=="function"){const h=this.ids++,p=n.pop();this._registerAckCallback(h,p),a.id=h}const o=(r=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||r===void 0?void 0:r.writable,l=this.connected&&!(!((s=this.io.engine)===null||s===void 0)&&s._hasPingExpired());return this.flags.volatile&&!o||(l?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,n){var i;const r=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(r===void 0){this.acks[e]=n;return}const s=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let o=0;o<this.sendBuffer.length;o++)this.sendBuffer[o].id===e&&this.sendBuffer.splice(o,1);n.call(this,new Error("operation has timed out"))},r),a=(...o)=>{this.io.clearTimeoutFn(s),n.apply(this,o)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...n){return new Promise((i,r)=>{const s=(a,o)=>a?r(a):i(o);s.withError=!0,n.push(s),this.emit(e,...n)})}_addToQueue(e){let n;typeof e[e.length-1]=="function"&&(n=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((r,...s)=>(this._queue[0],r!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),n&&n(r)):(this._queue.shift(),n&&n(null,...s)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const n=this._queue[0];n.pending&&!e||(n.pending=!0,n.tryCount++,this.flags=n.flags,this.emit.apply(this,n.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:it.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,n){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,n),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case it.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case it.EVENT:case it.BINARY_EVENT:this.onevent(e);break;case it.ACK:case it.BINARY_ACK:this.onack(e);break;case it.DISCONNECT:this.ondisconnect();break;case it.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const n=e.data||[];e.id!=null&&n.push(this.ack(e.id)),this.connected?this.emitEvent(n):this.receiveBuffer.push(Object.freeze(n))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const n=this._anyListeners.slice();for(const i of n)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const n=this;let i=!1;return function(...r){i||(i=!0,n.packet({type:it.ACK,id:e,data:r}))}}onack(e){const n=this.acks[e.id];typeof n=="function"&&(delete this.acks[e.id],n.withError&&e.data.unshift(null),n.apply(this,e.data))}onconnect(e,n){this.id=e,this.recovered=n&&this._pid===n,this._pid=n,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:it.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const n=this._anyListeners;for(let i=0;i<n.length;i++)if(e===n[i])return n.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const n=this._anyOutgoingListeners;for(let i=0;i<n.length;i++)if(e===n[i])return n.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const n=this._anyOutgoingListeners.slice();for(const i of n)i.apply(this,e.data)}}}function ba(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}ba.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=Math.floor(e*10)&1?t+n:t-n}return Math.min(t,this.max)|0};ba.prototype.reset=function(){this.attempts=0};ba.prototype.setMin=function(t){this.ms=t};ba.prototype.setMax=function(t){this.max=t};ba.prototype.setJitter=function(t){this.jitter=t};class Wf extends Vt{constructor(e,n){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(n=e,e=void 0),n=n||{},n.path=n.path||"/socket.io",this.opts=n,xu(this,n),this.reconnection(n.reconnection!==!1),this.reconnectionAttempts(n.reconnectionAttempts||1/0),this.reconnectionDelay(n.reconnectionDelay||1e3),this.reconnectionDelayMax(n.reconnectionDelayMax||5e3),this.randomizationFactor((i=n.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new ba({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(n.timeout==null?2e4:n.timeout),this._readyState="closed",this.uri=e;const r=n.parser||xT;this.encoder=new r.Encoder,this.decoder=new r.Decoder,this._autoConnect=n.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var n;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(n=this.backoff)===null||n===void 0||n.setMin(e),this)}randomizationFactor(e){var n;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(n=this.backoff)===null||n===void 0||n.setJitter(e),this)}reconnectionDelayMax(e){var n;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(n=this.backoff)===null||n===void 0||n.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Vx(this.uri,this.opts);const n=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const r=fi(n,"open",function(){i.onopen(),e&&e()}),s=o=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",o),e?e(o):this.maybeReconnectOnOpen()},a=fi(n,"error",s);if(this._timeout!==!1){const o=this._timeout,l=this.setTimeoutFn(()=>{r(),s(new Error("timeout")),n.close()},o);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(r),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(fi(e,"ping",this.onping.bind(this)),fi(e,"data",this.ondata.bind(this)),fi(e,"error",this.onerror.bind(this)),fi(e,"close",this.onclose.bind(this)),fi(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(n){this.onclose("parse error",n)}}ondecoded(e){_u(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,n){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new jx(this,e,n),this.nsps[e]=i),i}_destroy(e){const n=Object.keys(this.nsps);for(const i of n)if(this.nsps[i].active)return;this._close()}_packet(e){const n=this.encoder.encode(e);for(let i=0;i<n.length;i++)this.engine.write(n[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,n){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,n),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const n=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(r=>{r?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",r)):e.onreconnect()}))},n);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Fa={};function ac(t,e){typeof t=="object"&&(e=t,t=void 0),e=e||{};const n=lT(t,e.path||"/socket.io"),i=n.source,r=n.id,s=n.path,a=Fa[r]&&s in Fa[r].nsps,o=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let l;return o?l=new Wf(i,e):(Fa[r]||(Fa[r]=new Wf(i,e)),l=Fa[r]),n.query&&!e.query&&(e.query=n.queryKey),l.socket(n.path,e)}Object.assign(ac,{Manager:Wf,Socket:jx,io:ac,connect:ac});let as=null;function Nn(){return as||(as=ac("/",{auth:{token:mu()},autoConnect:!0,reconnection:!0,reconnectionAttempts:1/0,reconnectionDelay:1e3,reconnectionDelayMax:1e4})),as}function Vg(){as&&(as.disconnect(),as.removeAllListeners(),as=null)}function ST(t){Nn().emit("room:join",{roomId:t})}function ET(t){Nn().emit("room:leave",{roomId:t})}function rd(t,e){Nn().emit("typing",{roomId:t,isTyping:e})}function MT(t,e){Nn().emit("message:read",{roomId:t,messageId:e})}function wT(t){Nn().emit("video:join",{roomId:t})}function Gg(t){Nn().emit("video:leave",{roomId:t})}function sd(t,e){Nn().emit("video:signal",{to:t,signal:e})}const Wx=P.createContext(null);function TT({children:t}){const[e,n]=P.useState(null),[i,r]=P.useState(!0),s=P.useCallback(async()=>{const{user:h}=await Qu.me();n(h)},[]);P.useEffect(()=>{(async()=>{if(mu())try{await s(),Nn()}catch{ml(null),Vg(),n(null)}r(!1)})()},[s]);const a=P.useCallback(async(h,p)=>{const{token:d,user:g}=await Qu.login(h,p);ml(d),n(g),Nn()},[]),o=P.useCallback(async h=>{const{token:p,user:d}=await Qu.signup(h);ml(p),n(d),Nn()},[]),l=P.useCallback(()=>{Vg(),ml(null),n(null)},[]),c=P.useMemo(()=>({user:e,loading:i,login:a,signup:o,logout:l,refreshUser:s,setUser:n}),[e,i,a,o,l,s]);return u.jsx(Wx.Provider,{value:c,children:t})}function En(){const t=P.useContext(Wx);if(!t)throw new Error("useAuth must be used inside <AuthProvider>");return t}const jg=["👏","🎉","👑","✨","🌟","🎊"];function bT(){const[t,e]=P.useState(null);P.useEffect(()=>{const s=Nn(),a=o=>e(o);return s.on("red:carpet",a),()=>{s.off("red:carpet",a)}},[]);const n=P.useMemo(()=>t?Array.from({length:28},(s,a)=>({id:a,emoji:jg[a%jg.length],left:Math.random()*100,delay:Math.random()*2.2,duration:3+Math.random()*2.5,size:1.4+Math.random()*1.6})):[],[t]);if(!t)return null;const{king:i,queen:r}=t;return u.jsxs("div",{className:"red-carpet-overlay",role:"dialog","aria-label":"Red carpet announcement",children:[n.map(s=>u.jsx("span",{className:"applause",style:{left:`${s.left}%`,bottom:"-4rem",fontSize:`${s.size}rem`,animationDuration:`${s.duration}s`,animationDelay:`${s.delay}s`},children:s.emoji},s.id)),u.jsxs("div",{className:"red-carpet-inner",children:[u.jsx("span",{className:"rc-crown",children:"👑"}),u.jsx("h1",{children:u.jsx("span",{className:"starlight",children:"RED CARPET WEEK"})}),u.jsx("p",{className:"page-sub",style:{color:"#d7dce5"},children:"All hail this week's royalty"}),u.jsxs("div",{className:"rc-names",style:{marginTop:"1rem"},children:[i&&u.jsxs("div",{children:["🤴 Face King — ",u.jsx("span",{className:"starlight",children:i.displayName})]}),r&&u.jsxs("div",{style:{marginTop:"0.5rem"},children:["👸 Face Queen — ",u.jsx("span",{className:"starlight",children:r.displayName})]}),!i&&!r&&u.jsx("div",{children:"No royalty crowned this week — the throne awaits."})]}),u.jsx("button",{className:"btn rc-dismiss",onClick:()=>e(null),children:"Take your seat 👏"})]})]})}function Wg(t){return Math.pow(Math.max(1,t)-1,2)*100}const CT={common:"#9aa3b2",rare:"#4da3ff",epic:"#b06bff",legendary:"#ffc94d"},AT=["#0066FF","#3b82f6","#0ea5e9","#06b6d4","#FF5C5C","#ef4444","#f97316","#fb7185","#22c55e","#10b981","#84cc16","#14b8a6","#a855f7","#8b5cf6","#ec4899","#d946ef","#f59e0b","#eab308","#d4af37","#b45309","#f2f4f8","#9ca3af","#374151","#111827","#00ff88","#ff00aa","#ccff00","#7c3aed"];function RT(t){const e=t.trim().split(/\s+/);return e.length===1?e[0].slice(0,2).toUpperCase():(e[0][0]+e[e.length-1][0]).toUpperCase()}function Xo(t){const e=Date.now()-new Date(t).getTime(),n=Math.floor(e/6e4);if(n<1)return"just now";if(n<60)return`${n}m ago`;const i=Math.floor(n/60);if(i<24)return`${i}h ago`;const r=Math.floor(i/24);return r<7?`${r}d ago`:new Date(t).toLocaleDateString()}function PT(t){const e=new Date(t),n=new Date,i=new Date;return i.setDate(n.getDate()-1),e.toDateString()===n.toDateString()?"Today":e.toDateString()===i.toDateString()?"Yesterday":e.toLocaleDateString(void 0,{weekday:"long",month:"long",day:"numeric"})}function Xg(t){return new Date(t).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}function NT(t){const e=/^#?([0-9a-f]{6})$/i.exec(t.trim());if(!e)return"#fff";const n=parseInt(e[1],16),i=n>>16&255,r=n>>8&255,s=n&255;return(.299*i+.587*r+.114*s)/255>.6?"#101216":"#ffffff"}function ri({displayName:t,profileColor:e,size:n,online:i,photoUrl:r}){return u.jsxs("span",{className:`avatar${n?` ${n}`:""}`,style:r?{backgroundImage:`url(${r})`,backgroundSize:"cover",backgroundPosition:"center"}:{background:e,color:NT(e)},"aria-hidden":!0,children:[!r&&RT(t),i!==void 0&&u.jsx("span",{className:`presence-dot${i?"":" off"}`})]})}function lr(t){const e=(t==null?void 0:t.avatarConfig)??{};return typeof e.facePhotoUrl=="string"?e.facePhotoUrl:null}const Io={rose:"🌹",crown:"👑",throne:"🪑",starshower:"🌠",legend:"🐉"};function Op({receiverId:t,receiverName:e,onClose:n,onSent:i}){const[r,s]=P.useState([]),[a,o]=P.useState(null),[l,c]=P.useState(""),[h,p]=P.useState(null),[d,g]=P.useState(!0),[x,S]=P.useState(!1),[m,f]=P.useState(null),[_,M]=P.useState(!1);P.useEffect(()=>{(async()=>{try{const[{gifts:T},A]=await Promise.all([Gc.catalog(),Vc.get()]);s(T),p(A.balance),T.length>0&&o(T[0].key)}catch(T){f(T instanceof ot?T.message:"Could not load gifts.")}finally{g(!1)}})()},[]);const v=async()=>{if(a){S(!0),f(null);try{const{gift:T}=await Gc.send({receiverId:t,giftKey:a,message:l.trim()||void 0});M(!0),i==null||i(T)}catch(T){f(T instanceof ot?T.message:"Could not send the gift. Please try again.")}finally{S(!1)}}},w=r.find(T=>T.key===a);return u.jsx("div",{className:"modal-backdrop",onClick:n,children:u.jsx("div",{className:"modal",onClick:T=>T.stopPropagation(),role:"dialog","aria-label":"Send a gift",children:_?u.jsxs(u.Fragment,{children:[u.jsx("h3",{children:"🎁 Gift sent!"}),u.jsxs("p",{className:"form-note",children:[w?`${Io[w.key]??"🎁"} ${w.label}`:"Your gift"," is on its way to ",e,". They earn +10 XP for receiving it."]}),u.jsx("button",{className:"btn btn-block",onClick:n,children:"Done"})]}):u.jsxs(u.Fragment,{children:[u.jsxs("h3",{children:["🎁 Send a gift to ",e]}),h!==null&&u.jsxs("p",{className:"form-note",style:{marginTop:0},children:["Your balance: ",u.jsxs("strong",{style:{color:"var(--gold)"},children:[h," tokens"]})]}),d?u.jsx("div",{className:"loading-wrap",children:u.jsx("div",{className:"spinner"})}):m&&r.length===0?u.jsx("div",{className:"form-error",children:m}):u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"gift-grid",style:{marginBottom:"0.9rem"},children:r.map(T=>u.jsxs("button",{type:"button",className:`card gift-card${a===T.key?" selected":""}`,onClick:()=>o(T.key),children:[u.jsx("div",{className:"g-emoji",children:Io[T.key]??"🎁"}),u.jsx("div",{className:"g-label",children:T.label}),u.jsxs("div",{className:"g-cost",children:[T.tokenCost," tokens"]})]},T.key))}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"gift-msg",children:"Add a note (optional)"}),u.jsx("input",{id:"gift-msg",className:"input",value:l,onChange:T=>c(T.target.value),placeholder:"You earned this 👑",maxLength:140})]})]}),m&&r.length>0&&u.jsx("div",{className:"form-error",children:m}),u.jsxs("div",{style:{display:"flex",gap:"0.6rem"},children:[u.jsx("button",{className:"btn btn-ghost",style:{flex:1},onClick:n,children:"Cancel"}),u.jsx("button",{className:"btn",style:{flex:1},onClick:v,disabled:x||d||!a,children:x?"Sending…":w?`Send for ${w.tokenCost} tokens`:"Send"})]})]})})})}const LT=[{to:"/chats",label:"Chats",icon:"💬"},{to:"/video",label:"Video",icon:"📹"},{to:"/leaderboard",label:"Leaderboard",icon:"🏆"},{to:"/hall-of-fame",label:"Hall of Fame",icon:"⭐"},{to:"/avatar-studio",label:"Avatar Studio",icon:"🎨"},{to:"/throne",label:"Throne Room",icon:"👑"},{to:"/dj-booth",label:"DJ Booth",icon:"🎧"},{to:"/safety",label:"Safety",icon:"🛡️"},{to:"/wallet",label:"Wallet",icon:"💰"},{to:"/earnings",label:"Earnings",icon:"💵"}];let DT=0;function IT(){const{user:t,logout:e}=En(),n=zi(),[i,r]=P.useState([]),s=(l,c)=>{const h=++DT;r(p=>[...p,{id:h,title:l,sub:c}]),window.setTimeout(()=>r(p=>p.filter(d=>d.id!==h)),7e3)};P.useEffect(()=>{const l=Nn(),c=p=>{const d=p.userId===(t==null?void 0:t.id)?"You":"Someone";s(`🎉 ${d} ranked up!`,`${d==="You"?"You are":"They are"} now Level ${p.level} — ${p.tier}.`)},h=p=>{const d=Io[p.gift.giftKey]??"🎁";s(`${d} Gift received!`,`Someone sent you a gift${p.gift.message?`: “${p.gift.message}”`:""}. +10 XP!`)};return l.on("user:rank-up",c),l.on("gift:received",h),()=>{l.off("user:rank-up",c),l.off("gift:received",h)}},[t==null?void 0:t.id]);const a=()=>{e(),n("/login",{replace:!0})};if(!t)return null;const o=l=>LT.map(c=>u.jsxs(Dg,{to:c.to,className:({isActive:h})=>`${l}${h?" active":""}`,children:[u.jsx("span",{className:"nav-icon",children:c.icon}),u.jsx("span",{children:c.label})]},c.to));return u.jsxs("div",{className:"app-shell",style:{"--accent":t.profileColor||"#0066FF"},children:[u.jsxs("aside",{className:"sidebar",children:[u.jsx(Dg,{to:"/chats",className:"wordmark",children:"BIG FACE"}),u.jsx("nav",{className:"nav",children:o("nav-link")}),u.jsxs("div",{className:"user-chip",children:[u.jsx(ri,{displayName:t.displayName,profileColor:t.profileColor,online:!0,photoUrl:lr(t)}),u.jsxs("div",{className:"meta",children:[u.jsx("div",{className:"name",children:t.displayName}),u.jsxs("div",{className:"level",children:["Level ",t.level," · ",t.xp," XP"]})]}),u.jsx("button",{className:"icon-btn",title:"Edit profile",onClick:()=>n("/profile/edit"),children:"✏️"}),u.jsx("button",{className:"icon-btn",title:"Log out",onClick:a,children:"⏻"})]})]}),u.jsx("main",{className:"main",children:u.jsx(dw,{})}),u.jsx("nav",{className:"bottom-nav",children:o("nav-link")}),u.jsx("div",{className:"toast-stack","aria-live":"polite",children:i.map(l=>u.jsxs("div",{className:"toast",children:[u.jsx("div",{className:"t-title",children:l.title}),u.jsx("div",{className:"t-sub",children:l.sub})]},l.id))}),u.jsx(bT,{})]})}function UT(){const{login:t}=En(),e=zi(),[n,i]=P.useState(""),[r,s]=P.useState(""),[a,o]=P.useState(null),[l,c]=P.useState(!1),h=async p=>{p.preventDefault(),c(!0),o(null);try{await t(n.trim(),r),e("/chats",{replace:!0})}catch(d){o(d instanceof ot?d.message:"Login failed. Please try again.")}finally{c(!1)}};return u.jsx("div",{className:"auth-wrap",children:u.jsxs("div",{className:"card auth-card",children:[u.jsx("span",{className:"wordmark",children:"BIG FACE"}),u.jsx("p",{className:"auth-tag",children:"Chat, go live, and climb to the throne."}),u.jsxs("form",{onSubmit:h,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"identifier",children:"Username or email"}),u.jsx("input",{id:"identifier",className:"input",value:n,onChange:p=>i(p.target.value),autoComplete:"username",required:!0})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"password",children:"Password"}),u.jsx("input",{id:"password",type:"password",className:"input",value:r,onChange:p=>s(p.target.value),autoComplete:"current-password",required:!0})]}),a&&u.jsx("div",{className:"form-error",children:a}),u.jsx("button",{className:"btn btn-block",type:"submit",disabled:l,children:l?"Logging in…":"Log in"})]}),u.jsxs("p",{className:"auth-switch",children:["New to Big Face? ",u.jsx(ti,{to:"/signup",children:"Create an account"})]})]})})}const OT=["female","male","nonbinary","other"];function FT(){const{signup:t}=En(),e=zi(),[n,i]=P.useState({username:"",email:"",password:"",displayName:"",gender:"female"}),[r,s]=P.useState(null),[a,o]=P.useState(!1),l=h=>p=>i(d=>({...d,[h]:p.target.value})),c=async h=>{h.preventDefault(),o(!0),s(null);try{await t({username:n.username.trim(),email:n.email.trim(),password:n.password,displayName:n.displayName.trim(),gender:n.gender}),e("/avatar-studio?onboarding=1",{replace:!0})}catch(p){s(p instanceof ot?p.message:"Signup failed. Please try again.")}finally{o(!1)}};return u.jsx("div",{className:"auth-wrap",children:u.jsxs("div",{className:"card auth-card",children:[u.jsx("span",{className:"wordmark",children:"BIG FACE"}),u.jsx("p",{className:"auth-tag",children:"Claim your face. Rule the feed."}),u.jsxs("form",{onSubmit:c,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"su-display",children:"Display name"}),u.jsx("input",{id:"su-display",className:"input",value:n.displayName,onChange:l("displayName"),required:!0,maxLength:40})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"su-username",children:"Username"}),u.jsx("input",{id:"su-username",className:"input",value:n.username,onChange:l("username"),required:!0,maxLength:24,autoComplete:"username"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"su-email",children:"Email"}),u.jsx("input",{id:"su-email",type:"email",className:"input",value:n.email,onChange:l("email"),required:!0,autoComplete:"email"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"su-password",children:"Password"}),u.jsx("input",{id:"su-password",type:"password",className:"input",value:n.password,onChange:l("password"),required:!0,minLength:6,autoComplete:"new-password"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"su-gender",children:"Gender"}),u.jsx("select",{id:"su-gender",className:"select",value:n.gender,onChange:l("gender"),children:OT.map(h=>u.jsx("option",{value:h,children:h[0].toUpperCase()+h.slice(1)},h))})]}),r&&u.jsx("div",{className:"form-error",children:r}),u.jsx("button",{className:"btn btn-block",type:"submit",disabled:a,children:a?"Creating your face…":"Create account"})]}),u.jsxs("p",{className:"auth-switch",children:["Already have a face? ",u.jsx(ti,{to:"/login",children:"Log in"})]})]})})}function Wn(t){P.useEffect(()=>(document.title=`${t} · Big Face`,()=>{document.title="Big Face"}),[t])}function kT(){Wn("Chats");const{user:t}=En(),e=zi(),[n,i]=P.useState([]),[r,s]=P.useState(!0),[a,o]=P.useState(null),[l,c]=P.useState(!1),[h,p]=P.useState(""),[d,g]=P.useState(""),[x,S]=P.useState(!1),[m,f]=P.useState(null),[_,M]=P.useState(!1),[v,w]=P.useState(""),[T,A]=P.useState([]),[y,C]=P.useState(null),[N,D]=P.useState(null),B=async()=>{s(!0),o(null);try{const{rooms:G}=await oa.list();i(G)}catch(G){o(G instanceof ot?G.message:"Could not load your chats.")}finally{s(!1)}};P.useEffect(()=>{B()},[]),P.useEffect(()=>{if(!_)return;const G=v.trim().toLowerCase();if(G.length<2){A([]);return}const U=window.setTimeout(async()=>{try{const{users:O}=await bn.search(G);A(O.slice(0,8))}catch{A([])}},250);return()=>window.clearTimeout(U)},[v,_,t==null?void 0:t.id]);const F=P.useMemo(()=>[...n].sort((G,U)=>{const O=G.lastMessageAt?new Date(G.lastMessageAt).getTime():0;return(U.lastMessageAt?new Date(U.lastMessageAt).getTime():0)-O}),[n]),I=async()=>{if(h.trim()){S(!0),f(null);try{const{room:G}=await oa.create({name:h.trim(),description:d.trim()||void 0});c(!1),p(""),g(""),e(`/chats/${G.id}`)}catch(G){f(G instanceof ot?G.message:"Could not create the room.")}finally{S(!1)}}},k=async G=>{D(G.id),C(null);try{const{room:U}=await oa.dm(G.id);M(!1),w(""),e(`/chats/${U.id}`)}catch(U){C(U instanceof ot?U.message:"Could not start the conversation.")}finally{D(null)}};return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"},children:[u.jsxs("div",{children:[u.jsx("h1",{className:"page-title",children:"Chats"}),u.jsx("p",{className:"page-sub",children:"Your rooms and direct messages. Every message earns +5 XP."})]}),u.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[u.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>M(!0),children:"✉️ New DM"}),u.jsx("button",{className:"btn btn-sm",onClick:()=>c(!0),children:"＋ New room"})]})]}),r&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Loading your chats…"})]}),a&&!r&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",a]}),u.jsx("button",{className:"btn",onClick:B,children:"Try again"})]}),!r&&!a&&F.length===0&&u.jsxs("div",{className:"card empty-wrap",children:[u.jsx("div",{className:"big",children:"💬"}),u.jsx("h3",{children:"No chats yet"}),u.jsx("p",{children:"Start a room or slide into someone's DMs to get the conversation going."}),u.jsxs("div",{style:{display:"flex",gap:"0.5rem"},children:[u.jsx("button",{className:"btn btn-ghost",onClick:()=>M(!0),children:"New DM"}),u.jsx("button",{className:"btn",onClick:()=>c(!0),children:"Create a room"})]})]}),!r&&!a&&F.length>0&&u.jsx("div",{className:"card",style:{padding:"0.6rem"},children:F.map(G=>u.jsxs("div",{className:"room-item",onClick:()=>e(`/chats/${G.id}`),role:"button",tabIndex:0,onKeyDown:U=>U.key==="Enter"&&e(`/chats/${G.id}`),children:[u.jsx(ri,{displayName:G.name,profileColor:(t==null?void 0:t.profileColor)??"#0066FF",size:"sm"}),u.jsxs("div",{className:"info",children:[u.jsx("div",{className:"name",children:G.isDm?`💌 ${G.name}`:G.name}),u.jsx("div",{className:"preview",children:G.lastMessageAt?`Last activity ${Xo(G.lastMessageAt)}`:"No messages yet — say hi!"})]}),G.unreadCount>0&&u.jsx("span",{className:"unread-badge",children:G.unreadCount})]},G.id))}),l&&u.jsx("div",{className:"modal-backdrop",onClick:()=>c(!1),children:u.jsxs("div",{className:"modal",onClick:G=>G.stopPropagation(),children:[u.jsx("h3",{children:"＋ Create a room"}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"room-name",children:"Room name"}),u.jsx("input",{id:"room-name",className:"input",value:h,onChange:G=>p(G.target.value),placeholder:"e.g. Late Night Vibes",maxLength:60})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"room-desc",children:"Description (optional)"}),u.jsx("textarea",{id:"room-desc",className:"textarea",value:d,onChange:G=>g(G.target.value),placeholder:"What's this room about?",maxLength:200})]}),m&&u.jsx("div",{className:"form-error",children:m}),u.jsxs("div",{style:{display:"flex",gap:"0.6rem"},children:[u.jsx("button",{className:"btn btn-ghost",style:{flex:1},onClick:()=>c(!1),children:"Cancel"}),u.jsx("button",{className:"btn",style:{flex:1},onClick:I,disabled:x||!h.trim(),children:x?"Creating…":"Create room"})]})]})}),_&&u.jsx("div",{className:"modal-backdrop",onClick:()=>M(!1),children:u.jsxs("div",{className:"modal",onClick:G=>G.stopPropagation(),children:[u.jsx("h3",{children:"✉️ New direct message"}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"dm-search",children:"Find someone by username"}),u.jsx("input",{id:"dm-search",className:"input",value:v,onChange:G=>w(G.target.value),placeholder:"Type at least 2 characters…",autoFocus:!0})]}),y&&u.jsx("div",{className:"form-error",children:y}),v.trim().length>=2&&T.length===0&&u.jsx("p",{className:"form-note",children:"No matches found. Try a different name."}),T.map(G=>u.jsxs("div",{className:"room-item",onClick:()=>k(G),role:"button",tabIndex:0,onKeyDown:U=>U.key==="Enter"&&k(G),children:[u.jsx(ri,{displayName:G.displayName,profileColor:G.profileColor,size:"sm",photoUrl:lr(G)}),u.jsxs("div",{className:"info",children:[u.jsx("div",{className:"name",children:G.displayName}),u.jsxs("div",{className:"preview",children:["@",G.username," · Level ",G.level]})]}),N===G.id&&u.jsx("div",{className:"spinner",style:{width:20,height:20}})]},G.id)),u.jsx("button",{className:"btn btn-ghost btn-block",style:{marginTop:"0.8rem"},onClick:()=>M(!1),children:"Close"})]})})]})}const BT=["😀","😁","😂","🤣","😊","😍","😘","😎","🤔","😅","😭","😡","👍","👎","👏","🙌","🤝","💪","👋","✌️","🤟","👀","❤️","💔","💯","🔥","⭐","🌟","✨","🎉","🎊","👑","🌹","💎","🏆","🥇","🚀","💰","🎮","🎵","🍕","☕","🌈","🌙","☀️","⚡","💧","🌊","🍀","🎯","💡","📌"];function zT({onPick:t,onClose:e}){const n=P.useRef(null);return P.useEffect(()=>{const i=r=>{n.current&&!n.current.contains(r.target)&&e()};return document.addEventListener("mousedown",i),()=>document.removeEventListener("mousedown",i)},[e]),u.jsx("div",{className:"emoji-pop",ref:n,role:"dialog","aria-label":"Emoji picker",children:u.jsx("div",{className:"emoji-grid",children:BT.map(i=>u.jsx("button",{type:"button",onClick:()=>{t(i),e()},"aria-label":`emoji ${i}`,children:i},i))})})}const qg=["Spam or scams","Harassment or bullying","Hate speech","Explicit or sexual content","Impersonation","Something else"];function Xx({targetType:t,targetId:e,onClose:n}){const[i,r]=P.useState(qg[0]),[s,a]=P.useState(!1),[o,l]=P.useState(null),[c,h]=P.useState(!1),p=async()=>{a(!0),l(null);try{await Px.report({targetType:t,targetId:e,reason:i}),h(!0)}catch(d){l(d instanceof ot?d.message:"Could not send the report. Please try again.")}finally{a(!1)}};return u.jsx("div",{className:"modal-backdrop",onClick:n,children:u.jsx("div",{className:"modal",onClick:d=>d.stopPropagation(),role:"dialog","aria-label":"Report",children:c?u.jsxs(u.Fragment,{children:[u.jsx("h3",{children:"Report sent"}),u.jsx("p",{className:"form-note",children:"Thanks — our moderators will take a look. We keep reports private."}),u.jsx("button",{className:"btn btn-block",onClick:n,children:"Done"})]}):u.jsxs(u.Fragment,{children:[u.jsxs("h3",{children:["🚩 Report this ",t]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"report-reason",children:"What's wrong?"}),u.jsx("select",{id:"report-reason",className:"select",value:i,onChange:d=>r(d.target.value),children:qg.map(d=>u.jsx("option",{value:d,children:d},d))})]}),o&&u.jsx("div",{className:"form-error",children:o}),u.jsxs("div",{style:{display:"flex",gap:"0.6rem"},children:[u.jsx("button",{className:"btn btn-ghost",style:{flex:1},onClick:n,children:"Cancel"}),u.jsx("button",{className:"btn btn-coral",style:{flex:1},onClick:p,disabled:s,children:s?"Sending…":"Send report"})]})]})})})}const _l=50;function HT(){Wn("Chat");const{id:t}=Tx(),{user:e}=En(),n=zi(),[i,r]=P.useState(null),[s,a]=P.useState([]),[o,l]=P.useState([]),[c,h]=P.useState(!0),[p,d]=P.useState(!0),[g,x]=P.useState(!1),[S,m]=P.useState(null),[f,_]=P.useState(""),[M,v]=P.useState([]),[w,T]=P.useState(!1),[A,y]=P.useState(!1),[C,N]=P.useState(null),[D,B]=P.useState(!1),[F,I]=P.useState({}),[k,G]=P.useState([]),[U,O]=P.useState(null),[L,q]=P.useState(null),Z=P.useRef(null),ce=P.useRef(null),_e=P.useRef(null),se=P.useRef(null),Me=P.useRef({}),de=()=>{const ee=Z.current;return ee?ee.scrollHeight-ee.scrollTop-ee.clientHeight<140:!0},j=()=>{const ee=Z.current;ee&&(ee.scrollTop=ee.scrollHeight)},J=P.useCallback(async()=>{if(t){d(!0),m(null);try{const[{room:ee,members:Ae},{messages:qe}]=await Promise.all([oa.get(t),ws.list(t,_l)]);r(ee),a(Ae),Me.current=Object.fromEntries(Ae.map(We=>[We.id,We])),l(qe.slice().reverse()),h(qe.length>=_l),requestAnimationFrame(()=>j())}catch(ee){m(ee instanceof ot?ee.message:"Could not open this chat.")}finally{d(!1)}}},[t]);P.useEffect(()=>{J()},[J]),P.useEffect(()=>{if(!t)return;const ee=Nn();ST(t);const Ae=ze=>{if(ze.message.roomId!==t)return;const ke=de();l(R=>R.some(E=>E.id===ze.message.id)?R:[...R,ze.message]),ke&&requestAnimationFrame(()=>j()),le()},qe=ze=>{ze.userId!==(e==null?void 0:e.id)&&l(ke=>ke.map(R=>{if(R.id!==ze.messageId)return R;const E=R.reactions.find($=>$.emoji===ze.emoji);let W=R.reactions;return ze.action==="added"?W=E?R.reactions.map($=>$.emoji===ze.emoji?{...$,count:$.count+1}:$):[...R.reactions,{emoji:ze.emoji,count:1,reactedByMe:!1}]:W=R.reactions.map($=>$.emoji===ze.emoji?{...$,count:$.count-1}:$).filter($=>$.count>0),{...R,reactions:W}}))},We=ze=>{ze.roomId!==t||ze.userId===(e==null?void 0:e.id)||I(ke=>{const R={...ke};return ze.isTyping?R[ze.userId]=Date.now()+4e3:delete R[ze.userId],R})},Je=ze=>{l(ke=>ke.map(R=>R.id===ze.messageId&&!R.readBy.includes(ze.userId)?{...R,readBy:[...R.readBy,ze.userId]}:R))},Fe=ze=>{ze.roomId===t&&G(ze.onlineUserIds)};ee.on("message:new",Ae),ee.on("message:reaction",qe),ee.on("typing:update",We),ee.on("read:update",Je),ee.on("presence:update",Fe);const H=window.setInterval(()=>{I(ze=>{const ke=Date.now(),R=Object.fromEntries(Object.entries(ze).filter(([,E])=>E>ke));return Object.keys(R).length===Object.keys(ze).length?ze:R})},2e3);return()=>{window.clearInterval(H),ee.off("message:new",Ae),ee.off("message:reaction",qe),ee.off("typing:update",We),ee.off("read:update",Je),ee.off("presence:update",Fe),ET(t)}},[t,e==null?void 0:e.id]);const le=P.useCallback(()=>{t&&(se.current&&window.clearTimeout(se.current),se.current=window.setTimeout(()=>{oa.markRead(t).catch(()=>{})},1200))},[t]);P.useEffect(()=>{!p&&o.length>0&&le()},[p,o.length,le]);const Ue=ee=>{_(ee),t&&(rd(t,!0),_e.current&&window.clearTimeout(_e.current),_e.current=window.setTimeout(()=>t&&rd(t,!1),2e3))},he=async ee=>{if(!(!ee||ee.length===0)){T(!0),N(null);try{const Ae=[];for(const qe of Array.from(ee))Ae.push(await vu.upload(qe));v(qe=>[...qe,...Ae])}catch(Ae){N(Ae instanceof ot?Ae.message:"Upload failed. Files must be under 25MB.")}finally{T(!1)}}},Ve=async()=>{if(!t||D)return;const ee=f.trim();if(!(!ee&&M.length===0)){B(!0),N(null);try{const Ae=M.map(We=>({url:We.url,name:We.name,mime:We.mime,size:We.size})),{message:qe}=await ws.send(t,{body:ee||void 0,attachments:Ae.length?Ae:void 0});l(We=>We.some(Je=>Je.id===qe.id)?We:[...We,qe]),_(""),v([]),_e.current&&window.clearTimeout(_e.current),rd(t,!1),MT(t,qe.id),requestAnimationFrame(()=>j())}catch(Ae){N(Ae instanceof ot?Ae.message:"Message failed to send.")}finally{B(!1)}}},bt=async(ee,Ae)=>{var We;const qe=(We=ee.reactions.find(Je=>Je.emoji===Ae))==null?void 0:We.reactedByMe;l(Je=>Je.map(Fe=>{if(Fe.id!==ee.id)return Fe;const H=Fe.reactions.find(ke=>ke.emoji===Ae);let ze;return qe?ze=Fe.reactions.map(ke=>ke.emoji===Ae?{...ke,count:ke.count-1,reactedByMe:!1}:ke).filter(ke=>ke.count>0):H?ze=Fe.reactions.map(ke=>ke.emoji===Ae?{...ke,count:ke.count+1,reactedByMe:!0}:ke):ze=[...Fe.reactions,{emoji:Ae,count:1,reactedByMe:!0}],{...Fe,reactions:ze}}));try{qe?await ws.removeReaction(ee.id,Ae):await ws.addReaction(ee.id,Ae)}catch{t&&ws.list(t,1).catch(()=>{})}},Ze=async()=>{if(!t||g||o.length===0)return;const ee=Z.current,Ae=(ee==null?void 0:ee.scrollHeight)??0,qe=(ee==null?void 0:ee.scrollTop)??0;x(!0);try{const{messages:We}=await ws.list(t,_l,o[0].createdAt);h(We.length>=_l),l(Je=>[...We.slice().reverse(),...Je]),requestAnimationFrame(()=>{ee&&(ee.scrollTop=qe+(ee.scrollHeight-Ae))})}catch{}finally{x(!1)}},nt=Object.keys(F).map(ee=>{var Ae;return(Ae=Me.current[ee])==null?void 0:Ae.displayName}).filter(Boolean);if(p)return u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Opening chat…"})]});if(S||!i)return u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",S??"This chat could not be opened."]}),u.jsx("button",{className:"btn",onClick:()=>n("/chats"),children:"Back to chats"})]});let dt="";return u.jsxs("div",{className:"chat-panel",style:{height:"calc(100vh - 4.5rem)"},children:[u.jsxs("div",{className:"chat-header",children:[u.jsx("button",{className:"icon-btn",onClick:()=>n("/chats"),"aria-label":"Back to chats",children:"←"}),u.jsx(ri,{displayName:i.name,profileColor:(e==null?void 0:e.profileColor)??"#0066FF",size:"sm"}),u.jsxs("div",{style:{flex:1,minWidth:0},children:[u.jsx("div",{className:"title",children:i.isDm?`💌 ${i.name}`:i.name}),u.jsxs("div",{className:"sub",children:[s.length," member",s.length===1?"":"s",k.length>0&&` · ${k.length} online`]})]}),u.jsx("button",{className:"btn btn-sm",onClick:()=>n("/video",{state:{roomId:t,roomName:i.name}}),children:"📹 Video"})]}),u.jsxs("div",{className:"messages",ref:Z,children:[c&&o.length>0&&u.jsx("div",{style:{textAlign:"center",marginBottom:"0.6rem"},children:u.jsx("button",{className:"btn btn-ghost btn-sm",onClick:Ze,disabled:g,children:g?"Loading…":"Load older messages"})}),o.length===0&&u.jsxs("div",{className:"empty-wrap",children:[u.jsx("div",{className:"big",children:"👋"}),u.jsx("p",{children:"No messages yet. Break the ice — you'll earn +5 XP."})]}),o.map(ee=>{const Ae=PT(ee.createdAt),qe=Ae!==dt;dt=Ae;const We=ee.sender.id===(e==null?void 0:e.id),Je=ee.readBy.filter(Fe=>Fe!==(e==null?void 0:e.id)).length;return u.jsxs("div",{children:[qe&&u.jsx("div",{className:"date-divider",children:u.jsx("span",{children:Ae})}),u.jsxs("div",{className:`msg-row${We?" own":""}`,children:[!We&&u.jsx(ti,{to:`/u/${ee.sender.id}`,style:{flexShrink:0},children:u.jsx(ri,{displayName:ee.sender.displayName,profileColor:ee.sender.profileColor,size:"sm",photoUrl:lr(ee.sender)})}),u.jsxs("div",{className:"msg-body-wrap",children:[!We&&u.jsxs("div",{className:"msg-head",children:[u.jsx(ti,{to:`/u/${ee.sender.id}`,className:"msg-sender",children:ee.sender.displayName}),u.jsxs("span",{className:"badge",children:["Lv ",ee.sender.level]}),u.jsx("span",{className:"msg-time",children:Xg(ee.createdAt)})]}),We&&u.jsx("div",{className:"msg-head",style:{justifyContent:"flex-end"},children:u.jsx("span",{className:"msg-time",children:Xg(ee.createdAt)})}),(ee.body||ee.attachments.length>0)&&u.jsxs("div",{className:"msg-bubble",children:[ee.body,ee.attachments.length>0&&u.jsx("div",{className:"msg-attach",children:ee.attachments.map((Fe,H)=>u.jsx("div",{children:Fe.mime.startsWith("image/")?u.jsx("a",{href:Fe.url,target:"_blank",rel:"noreferrer",children:u.jsx("img",{src:Fe.url,alt:Fe.name,loading:"lazy"})}):Fe.mime.startsWith("video/")?u.jsx("video",{src:Fe.url,controls:!0,preload:"metadata"}):u.jsxs("a",{className:"file-chip",href:Fe.url,target:"_blank",rel:"noreferrer",children:["📎 ",Fe.name]})},`${Fe.url}-${H}`))})]}),ee.reactions.length>0&&u.jsxs("div",{className:"reactions",children:[ee.reactions.map(Fe=>u.jsxs("button",{className:`reaction-pill${Fe.reactedByMe?" mine":""}`,onClick:()=>bt(ee,Fe.emoji),title:Fe.reactedByMe?"Remove your reaction":"React",children:[Fe.emoji," ",Fe.count]},Fe.emoji)),u.jsx("button",{className:"reaction-pill",onClick:()=>bt(ee,"❤️"),title:"Quick react ❤️",children:"＋"})]}),ee.reactions.length===0&&u.jsx("div",{className:"reactions",children:u.jsx("button",{className:"reaction-pill",onClick:()=>bt(ee,"❤️"),title:"React ❤️",children:"＋"})}),We&&Je>0&&u.jsxs("div",{className:"seen-line",children:["✓✓ Seen by ",Je]})]}),u.jsx("button",{className:"msg-menu-btn",onClick:()=>O(U===ee.id?null:ee.id),"aria-label":"Message options",children:"⋯"}),U===ee.id&&u.jsxs("div",{className:"card",style:{position:"absolute",top:"1.8rem",right:"0.4rem",zIndex:20,padding:"0.4rem",minWidth:150},children:[u.jsx("button",{className:"btn btn-ghost btn-sm btn-block",style:{marginBottom:"0.3rem"},onClick:()=>{var Fe;ee.body&&((Fe=navigator.clipboard)==null||Fe.writeText(ee.body).catch(()=>{})),O(null)},children:"📋 Copy text"}),!We&&u.jsx("button",{className:"btn btn-ghost btn-sm btn-block",onClick:()=>{q(ee.id),O(null)},children:"🚩 Report message"})]})]})]},ee.id)})]}),u.jsx("div",{className:"typing-bar",children:nt.length>0&&`${nt.join(", ")} ${nt.length===1?"is":"are"} typing…`}),u.jsxs("div",{className:"composer",children:[M.length>0&&u.jsx("div",{className:"pending-attachments",children:M.map(ee=>u.jsxs("div",{className:"pending-chip",children:[ee.mime.startsWith("image/")?u.jsx("img",{src:ee.url,alt:ee.name}):u.jsxs("span",{className:"file-chip",children:["📎 ",ee.name]}),u.jsx("button",{onClick:()=>v(Ae=>Ae.filter(qe=>qe.url!==ee.url)),"aria-label":"Remove attachment",children:"✕"})]},ee.url))}),C&&u.jsx("div",{className:"form-error",style:{marginBottom:0},children:C}),u.jsxs("div",{className:"composer-row",style:{position:"relative"},children:[u.jsx("button",{className:"icon-btn",onClick:()=>y(ee=>!ee),"aria-label":"Pick an emoji",children:"😀"}),A&&u.jsx(zT,{onPick:ee=>_(Ae=>Ae+ee),onClose:()=>y(!1)}),u.jsx("button",{className:"icon-btn",onClick:()=>{var ee;return(ee=ce.current)==null?void 0:ee.click()},disabled:w,"aria-label":"Attach a file",children:w?"⏳":"📎"}),u.jsx("input",{ref:ce,type:"file",hidden:!0,multiple:!0,accept:"image/*,video/*,audio/*",onChange:ee=>{he(ee.target.files),ee.target.value=""}}),u.jsx("input",{className:"input",value:f,onChange:ee=>Ue(ee.target.value),onKeyDown:ee=>{ee.key==="Enter"&&!ee.shiftKey&&(ee.preventDefault(),Ve())},placeholder:`Message ${i.name}…`,maxLength:2e3}),u.jsx("button",{className:"btn",onClick:Ve,disabled:D||!f.trim()&&M.length===0,children:D?"…":"Send"})]})]}),L&&u.jsx(Xx,{targetType:"message",targetId:L,onClose:()=>q(null)})]})}const VT=[{key:"filter-none",label:"Natural"},{key:"filter-glow",label:"✨ Glow"},{key:"filter-retro",label:"📼 Retro"},{key:"filter-smooth",label:"🌫️ Smooth"}],GT={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"turn:openrelay.metered.ca:80",username:"openrelayproject",credential:"openrelayproject"},{urls:"turn:openrelay.metered.ca:443",username:"openrelayproject",credential:"openrelayproject"}]};function $g({stream:t,label:e,filter:n,mirrored:i}){const r=P.useRef(null);return P.useEffect(()=>{r.current&&(r.current.srcObject=t)},[t]),u.jsxs("div",{className:"video-tile",children:[u.jsx("video",{ref:r,autoPlay:!0,playsInline:!0,muted:i,className:n,style:i?{transform:"scaleX(-1)"}:void 0}),u.jsx("span",{className:"tile-label",children:e})]})}function jT(){var ce,_e;Wn("Video");const{user:t}=En(),e=Xr(),[n,i]=P.useState([]),[r,s]=P.useState(((ce=e.state)==null?void 0:ce.roomId)??""),[a,o]=P.useState(!1),[l,c]=P.useState(null),[h,p]=P.useState(null),[d,g]=P.useState([]),[x,S]=P.useState(!1),[m,f]=P.useState(!1),[_,M]=P.useState("filter-none"),[v,w]=P.useState(null),[T,A]=P.useState(!1),y=P.useRef(new Map),C=P.useRef(null),N=P.useRef(!1),D=P.useRef(""),B=P.useRef(new Map),F=P.useRef(null),I=P.useCallback(se=>{const Me=y.current.get(se);Me&&(Me.close(),y.current.delete(se)),B.current.delete(se),g(de=>de.filter(j=>j.socketId!==se))},[]),k=P.useCallback(async(se,Me,de)=>{if(y.current.has(se))return y.current.get(se);const j=new RTCPeerConnection(GT);y.current.set(se,j),B.current.set(se,Me);const J=C.current;if(J&&J.getTracks().forEach(le=>j.addTrack(le,J)),j.onicecandidate=le=>{le.candidate&&sd(se,{candidate:le.candidate})},j.ontrack=le=>{const Ue=le.streams[0];g(he=>he.some(Ve=>Ve.socketId===se)?he.map(Ve=>Ve.socketId===se?{...Ve,stream:Ue}:Ve):[...he,{socketId:se,userId:se,displayName:Me,stream:Ue}])},j.onconnectionstatechange=()=>{(j.connectionState==="failed"||j.connectionState==="closed")&&I(se)},de){const le=await j.createOffer();await j.setLocalDescription(le),sd(se,{sdp:le})}return j},[I]),G=P.useCallback(async(se,Me)=>{if(!N.current)return;const de=Me;let j=y.current.get(se);j||(j=await k(se,B.current.get(se)??"Guest",!1));try{if(de.sdp){if(await j.setRemoteDescription(new RTCSessionDescription(de.sdp)),de.sdp.type==="offer"){const J=await j.createAnswer();await j.setLocalDescription(J),sd(se,{sdp:J})}}else de.candidate&&await j.addIceCandidate(new RTCIceCandidate(de.candidate))}catch{}},[k]);P.useEffect(()=>{const se=Nn(),Me=J=>{N.current&&k(J.socketId,J.userId,!0).catch(()=>{})},de=J=>I(J.socketId),j=J=>G(J.from,J.signal);return se.on("video:peer-joined",Me),se.on("video:peer-left",de),se.on("video:signal",j),()=>{se.off("video:peer-joined",Me),se.off("video:peer-left",de),se.off("video:signal",j)}},[k,G,I]),P.useEffect(()=>{oa.list().then(({rooms:se})=>i(se)).catch(()=>{})},[]),P.useEffect(()=>{D.current=r},[r]);const U=P.useCallback(async()=>{var Me;D.current&&N.current&&Gg(D.current);const se=F.current;se&&Og.end(se).catch(()=>{}),y.current.forEach(de=>de.close()),y.current.clear(),B.current.clear(),(Me=C.current)==null||Me.getTracks().forEach(de=>de.stop()),C.current=null,N.current=!1,F.current=null,g([]),p(null),o(!1),c(null),S(!1),f(!1)},[]);P.useEffect(()=>()=>{var se;D.current&&N.current&&Gg(D.current),y.current.forEach(Me=>Me.close()),(se=C.current)==null||se.getTracks().forEach(Me=>Me.stop())},[]);const O=async()=>{if(!(!r||a||T)){A(!0),w(null);try{const{sessionId:se}=await Og.start(r),Me=await navigator.mediaDevices.getUserMedia({audio:!0,video:!0});C.current=Me,N.current=!0,D.current=r,F.current=se,p(Me),c(se),o(!0),wT(r)}catch(se){N.current=!1,se instanceof DOMException&&(se.name==="NotAllowedError"||se.name==="NotFoundError")?w("Camera or microphone unavailable. Please allow access and make sure a camera is connected, then try again."):w(se instanceof ot?se.message:"Could not start the video call.")}finally{A(!1)}}},L=()=>{var Me;const se=!x;(Me=C.current)==null||Me.getAudioTracks().forEach(de=>{de.enabled=!se}),S(se)},q=()=>{var Me;const se=!m;(Me=C.current)==null||Me.getVideoTracks().forEach(de=>{de.enabled=!se}),f(se)},Z=n.find(se=>se.id===r);return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Video"}),u.jsx("p",{className:"page-sub",children:"Face-to-face in any room. Mesh video — everyone connects directly to everyone."})]}),!a&&u.jsxs("div",{className:"card",style:{maxWidth:560},children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"video-room",children:"Pick a room"}),u.jsxs("select",{id:"video-room",className:"select",value:r,onChange:se=>s(se.target.value),children:[u.jsx("option",{value:"",children:"Choose a room…"}),n.map(se=>u.jsx("option",{value:se.id,children:se.name},se.id))]})]}),n.length===0&&u.jsx("p",{className:"form-note",children:"You aren't in any rooms yet. Create one from the Chats tab first."}),v&&u.jsx("div",{className:"form-error",children:v}),u.jsx("button",{className:"btn btn-block",onClick:O,disabled:!r||T,children:T?"Starting camera…":"📹 Start video"}),u.jsx("p",{className:"form-note",style:{marginTop:"0.8rem"},children:"Your browser will ask for camera and microphone permission."})]}),a&&u.jsxs("div",{children:[u.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.9rem",flexWrap:"wrap",gap:"0.6rem"},children:[u.jsxs("h3",{style:{margin:0},children:["📹 ",(Z==null?void 0:Z.name)??((_e=e.state)==null?void 0:_e.roomName)??"Video call",u.jsxs("span",{className:"badge badge-blue",style:{marginLeft:"0.6rem"},children:[d.length+1," on camera"]})]}),u.jsxs("div",{className:"field",style:{margin:0,minWidth:180},children:[u.jsx("label",{htmlFor:"cam-filter",children:"Camera filter"}),u.jsx("select",{id:"cam-filter",className:"select",value:_,onChange:se=>M(se.target.value),children:VT.map(se=>u.jsx("option",{value:se.key,children:se.label},se.key))})]})]}),u.jsxs("div",{className:"video-grid",children:[u.jsx($g,{stream:h,label:`${(t==null?void 0:t.displayName)??"You"} (you)`,filter:_,mirrored:!0}),d.map(se=>u.jsx("div",{style:{position:"relative"},children:u.jsx($g,{stream:se.stream,label:se.displayName,filter:_})},se.socketId))]}),d.length===0&&u.jsx("p",{className:"form-note",style:{textAlign:"center",marginTop:"1rem"},children:"You're on camera — waiting for others to join the room…"}),u.jsxs("div",{className:"video-controls",children:[u.jsx("button",{className:`ctrl-btn${x?" off":""}`,onClick:L,title:x?"Unmute":"Mute",children:x?"🔇":"🎤"}),u.jsx("button",{className:`ctrl-btn${m?" off":""}`,onClick:q,title:m?"Turn camera on":"Turn camera off",children:m?"🚫":"📷"}),u.jsx("button",{className:"ctrl-btn leave",onClick:U,children:"Leave"})]}),v&&u.jsx("div",{className:"form-error",style:{marginTop:"0.8rem"},children:v})]})]})}const WT=["🥇","🥈","🥉"];function Yg({title:t,crown:e,person:n}){return n?u.jsxs("div",{className:"card royal-card",children:[u.jsx("div",{className:"crown",children:e}),u.jsx("h3",{style:{margin:"0.4rem 0"},children:t}),u.jsxs(ti,{to:`/u/${n.id}`,style:{display:"flex",alignItems:"center",gap:"0.7rem"},children:[u.jsx(ri,{displayName:n.displayName,profileColor:n.profileColor,photoUrl:lr(n)}),u.jsxs("div",{children:[u.jsx("div",{className:"starlight",children:n.displayName}),u.jsxs("div",{className:"form-note",children:["@",n.username," · Level ",n.level," · ",n.xp," XP"]})]})]})]}):u.jsxs("div",{className:"card royal-card",children:[u.jsx("div",{className:"crown",children:e}),u.jsx("h3",{style:{margin:"0.4rem 0"},children:t}),u.jsx("p",{className:"form-note",children:"No one has claimed this crown yet this week. It could be you."})]})}function XT(){Wn("Leaderboard");const{user:t}=En(),[e,n]=P.useState([]),[i,r]=P.useState(null),[s,a]=P.useState(null),[o,l]=P.useState(!0),[c,h]=P.useState(null),p=async()=>{l(!0),h(null);try{const[{entries:d},g]=await Promise.all([bn.leaderboard(50),bn.legendary()]);n(d),r(g.king),a(g.queen)}catch(d){h(d instanceof ot?d.message:"Could not load the leaderboard.")}finally{l(!1)}};return P.useEffect(()=>{p()},[]),u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Leaderboard"}),u.jsx("p",{className:"page-sub",children:"The race for the throne. Earn XP by chatting, posting, and receiving gifts."})]}),u.jsxs("div",{className:"grid-2",style:{marginBottom:"1.4rem"},children:[u.jsx(Yg,{title:"Face King",crown:"🤴",person:i}),u.jsx(Yg,{title:"Face Queen",crown:"👸",person:s})]}),o&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Counting XP…"})]}),c&&!o&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",c]}),u.jsx("button",{className:"btn",onClick:p,children:"Try again"})]}),!o&&!c&&e.length===0&&u.jsxs("div",{className:"card empty-wrap",children:[u.jsx("div",{className:"big",children:"🏆"}),u.jsx("h3",{children:"Nobody's on the board yet"}),u.jsx("p",{children:"Be the first to earn XP — send a message and take the lead."})]}),!o&&!c&&e.length>0&&u.jsx("div",{className:"card",style:{padding:"0.6rem"},children:e.map((d,g)=>{const x=g===0?" top1":g===1?" top2":g===2?" top3":"",S=d.user.id===(t==null?void 0:t.id);return u.jsxs(ti,{to:`/u/${d.user.id}`,className:`lb-row${x}`,style:S?{outline:"1px dashed var(--blue)",outlineOffset:-1}:void 0,children:[u.jsx("div",{className:"lb-rank",children:g<3?WT[g]:`#${d.rank}`}),u.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.7rem",minWidth:0},children:[u.jsx(ri,{displayName:d.user.displayName,profileColor:d.user.profileColor,size:"sm",photoUrl:lr(d.user)}),u.jsxs("div",{style:{minWidth:0},children:[u.jsxs("div",{style:{fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:[d.user.displayName,S&&" (you)"]}),u.jsxs("div",{className:"form-note",children:["@",d.user.username]})]})]}),u.jsxs("div",{className:"lb-xp",children:[u.jsxs("div",{className:"xp",children:[d.xp," XP"]}),u.jsxs("div",{className:"lvl",children:["Level ",d.level]})]}),u.jsx("div",{children:g<3&&u.jsx("span",{className:"badge badge-gold",children:"👑 Top 3"})})]},d.user.id)})})]})}function qT(){Wn("Hall of Fame");const[t,e]=P.useState([]),[n,i]=P.useState(null),[r,s]=P.useState(!0),[a,o]=P.useState(null),[l,c]=P.useState(null),[h,p]=P.useState(""),[d,g]=P.useState(!1),[x,S]=P.useState(null),m=P.useRef(null),f=async()=>{s(!0),o(null);try{const[{posts:v},{user:w}]=await Promise.all([ss.list(40),bn.colorOfWeek()]);e(v),i(w)}catch(v){o(v instanceof ot?v.message:"Could not load the Hall of Fame.")}finally{s(!1)}};P.useEffect(()=>{f()},[]);const _=async v=>{e(w=>w.map(T=>T.id===v.id?{...T,likedByMe:!T.likedByMe,likesCount:T.likesCount+(T.likedByMe?-1:1)}:T));try{v.likedByMe?await ss.unlike(v.id):await ss.like(v.id)}catch{e(w=>w.map(T=>T.id===v.id?v:T))}},M=async v=>{if(v.preventDefault(),!(!l||d)){g(!0),S(null);try{const w=await vu.upload(l),T=w.mime.startsWith("video/")?"video":w.mime.startsWith("audio/")?"audio":"image",{post:A}=await ss.create({url:w.url,kind:T,caption:h.trim()||void 0});e(y=>[A,...y].sort((C,N)=>N.likesCount-C.likesCount)),c(null),p(""),m.current&&(m.current.value="")}catch(w){S(w instanceof ot?w.message:"Upload failed. Files must be under 25MB.")}finally{g(!1)}}};return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Hall of Fame"}),u.jsx("p",{className:"page-sub",children:"The most-loved posts on Big Face. Posting earns +10 XP."})]}),n&&u.jsxs("div",{className:"card spotlight",style:{marginBottom:"1.4rem",display:"flex",alignItems:"center",gap:"1rem"},children:[u.jsx(ri,{displayName:n.displayName,profileColor:n.profileColor,size:"lg",photoUrl:lr(n)}),u.jsxs("div",{children:[u.jsx("div",{className:"badge badge-blue",style:{marginBottom:"0.3rem"},children:"🎨 Color of the Week"}),u.jsx(ti,{to:`/u/${n.id}`,style:{fontWeight:800,fontSize:"1.1rem"},children:n.displayName}),u.jsxs("p",{className:"form-note",style:{margin:"0.2rem 0 0"},children:["@",n.username," is setting the vibe this week."]})]})]}),u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem"},children:[u.jsx("h3",{children:"📸 Share a moment"}),u.jsxs("form",{onSubmit:M,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"hof-file",children:"Photo or video"}),u.jsx("input",{id:"hof-file",ref:m,type:"file",className:"input",accept:"image/*,video/*",onChange:v=>{var w;return c(((w=v.target.files)==null?void 0:w[0])??null)}})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"hof-caption",children:"Caption (optional)"}),u.jsx("input",{id:"hof-caption",className:"input",value:h,onChange:v=>p(v.target.value),placeholder:"Say something legendary…",maxLength:200})]}),x&&u.jsx("div",{className:"form-error",children:x}),u.jsx("button",{className:"btn",type:"submit",disabled:!l||d,children:d?"Publishing…":"Publish to Hall of Fame"})]})]}),r&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Loading the greats…"})]}),a&&!r&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",a]}),u.jsx("button",{className:"btn",onClick:f,children:"Try again"})]}),!r&&!a&&t.length===0&&u.jsxs("div",{className:"card empty-wrap",children:[u.jsx("div",{className:"big",children:"⭐"}),u.jsx("h3",{children:"The hall is empty"}),u.jsx("p",{children:"Be the first legend — publish a post above and watch the likes roll in."})]}),!r&&!a&&t.length>0&&u.jsx("div",{className:"media-grid",children:t.map((v,w)=>u.jsxs("div",{className:"card media-card",children:[v.kind==="video"?u.jsx("video",{src:v.url,controls:!0,preload:"metadata"}):u.jsx("img",{src:v.url,alt:v.caption??"Hall of fame post",loading:"lazy"}),u.jsxs("div",{className:"media-body",children:[u.jsxs("div",{className:"media-meta",children:[w<3&&u.jsx("span",{className:"badge badge-gold",children:["🥇","🥈","🥉"][w]}),u.jsxs(ti,{to:`/u/${v.user.id}`,style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[u.jsx(ri,{displayName:v.user.displayName,profileColor:v.user.profileColor,size:"sm",photoUrl:lr(v.user)}),u.jsx("span",{style:{fontWeight:700,fontSize:"0.88rem"},children:v.user.displayName})]})]}),v.caption&&u.jsx("p",{className:"caption",children:v.caption}),u.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[u.jsxs("button",{className:`like-btn${v.likedByMe?" liked":""}`,onClick:()=>_(v),children:[v.likedByMe?"❤️":"🤍"," ",v.likesCount]}),u.jsx("span",{className:"form-note",children:Xo(v.createdAt)})]})]})]},v.id))})]})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fp="186",la={ROTATE:0,DOLLY:1,PAN:2},Qs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},$T=0,Kg=1,YT=2,oc=1,qx=2,Qa=3,gs=0,Ln=1,Ai=2,tr=0,fo=1,Zg=2,Jg=3,Qg=4,KT=5,zs=100,ZT=101,JT=102,QT=103,eb=104,tb=200,nb=201,ib=202,rb=203,$x=204,Yx=205,sb=206,ab=207,ob=208,lb=209,cb=210,ub=211,db=212,fb=213,hb=214,Xf=0,qf=1,$f=2,Uo=3,Yf=4,Kf=5,Zf=6,Jf=7,Kx=0,pb=1,mb=2,Ii=0,Zx=1,Jx=2,Qx=3,ey=4,ty=5,ny=6,iy=7,ry=300,vs=301,xa=302,ad=303,od=304,yu=306,Qf=1e3,Ji=1001,eh=1002,tn=1003,gb=1004,xl=1005,hn=1006,ld=1007,os=1008,Bn=1009,sy=1010,ay=1011,Oo=1012,kp=1013,Oi=1014,Ri=1015,Fi=1016,Bp=1017,zp=1018,Fo=1020,oy=35902,ly=35899,cy=1021,uy=1022,mi=1023,cr=1026,ls=1027,dy=1028,Hp=1029,_s=1030,Vp=1031,Gp=1033,lc=33776,cc=33777,uc=33778,dc=33779,th=35840,nh=35841,ih=35842,rh=35843,sh=36196,ah=37492,oh=37496,lh=37488,ch=37489,jc=37490,uh=37491,dh=37808,fh=37809,hh=37810,ph=37811,mh=37812,gh=37813,vh=37814,_h=37815,xh=37816,yh=37817,Sh=37818,Eh=37819,Mh=37820,wh=37821,Th=36492,bh=36494,Ch=36495,Ah=36283,Rh=36284,Wc=36285,Ph=36286,vb=3200,Nh=0,_b=1,br="",kn="srgb",Xc="srgb-linear",qc="linear",ft="srgb",cd=7680,xb=519,yb=512,Sb=513,Eb=514,jp=515,Mb=516,wb=517,Wp=518,Tb=519,bb=35044,ev="300 es",Pi=2e3,ko=2001;function Cb(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Bo(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function Ab(){const t=Bo("canvas");return t.style.display="block",t}const tv={};function nv(...t){const e="THREE."+t.shift();console.log(e,...t)}function fy(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Ge(...t){t=fy(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function lt(...t){t=fy(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function ca(...t){const e=t.join(" ");e in tv||(tv[e]=!0,Ge(...t))}function Rb(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const Pb={[Xf]:qf,[$f]:Zf,[Yf]:Jf,[Uo]:Kf,[qf]:Xf,[Zf]:$f,[Jf]:Yf,[Kf]:Uo};class qr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fc=Math.PI/180,Lh=180/Math.PI;function qo(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(cn[t&255]+cn[t>>8&255]+cn[t>>16&255]+cn[t>>24&255]+"-"+cn[e&255]+cn[e>>8&255]+"-"+cn[e>>16&15|64]+cn[e>>24&255]+"-"+cn[n&63|128]+cn[n>>8&255]+"-"+cn[n>>16&255]+cn[n>>24&255]+cn[i&255]+cn[i>>8&255]+cn[i>>16&255]+cn[i>>24&255]).toLowerCase()}function et(t,e,n){return Math.max(e,Math.min(n,t))}function Nb(t,e){return(t%e+e)%e}function ud(t,e,n){return(1-n)*t+n*e}function ka(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Mn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Lb={DEG2RAD:fc},tm=class tm{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=et(this.x,e.x,n.x),this.y=et(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=et(this.x,e,n),this.y=et(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};tm.prototype.isVector2=!0;let He=tm;class Hr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],p=i[r+3],d=s[a+0],g=s[a+1],x=s[a+2],S=s[a+3];if(p!==S||l!==d||c!==g||h!==x){let m=l*d+c*g+h*x+p*S;m<0&&(d=-d,g=-g,x=-x,S=-S,m=-m);let f=1-o;if(m<.9995){const _=Math.acos(m),M=Math.sin(_);f=Math.sin(f*_)/M,o=Math.sin(o*_)/M,l=l*f+d*o,c=c*f+g*o,h=h*f+x*o,p=p*f+S*o}else{l=l*f+d*o,c=c*f+g*o,h=h*f+x*o,p=p*f+S*o;const _=1/Math.sqrt(l*l+c*c+h*h+p*p);l*=_,c*=_,h*=_,p*=_}}e[n]=l,e[n+1]=c,e[n+2]=h,e[n+3]=p}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],p=s[a],d=s[a+1],g=s[a+2],x=s[a+3];return e[n]=o*x+h*p+l*g-c*d,e[n+1]=l*x+h*d+c*p-o*g,e[n+2]=c*x+h*g+o*d-l*p,e[n+3]=h*x-o*p-l*d-c*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),p=o(s/2),d=l(i/2),g=l(r/2),x=l(s/2);switch(a){case"XYZ":this._x=d*h*p+c*g*x,this._y=c*g*p-d*h*x,this._z=c*h*x+d*g*p,this._w=c*h*p-d*g*x;break;case"YXZ":this._x=d*h*p+c*g*x,this._y=c*g*p-d*h*x,this._z=c*h*x-d*g*p,this._w=c*h*p+d*g*x;break;case"ZXY":this._x=d*h*p-c*g*x,this._y=c*g*p+d*h*x,this._z=c*h*x+d*g*p,this._w=c*h*p-d*g*x;break;case"ZYX":this._x=d*h*p-c*g*x,this._y=c*g*p+d*h*x,this._z=c*h*x-d*g*p,this._w=c*h*p+d*g*x;break;case"YZX":this._x=d*h*p+c*g*x,this._y=c*g*p+d*h*x,this._z=c*h*x-d*g*p,this._w=c*h*p-d*g*x;break;case"XZY":this._x=d*h*p-c*g*x,this._y=c*g*p-d*h*x,this._z=c*h*x+d*g*p,this._w=c*h*p+d*g*x;break;default:Ge("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],h=n[6],p=n[10],d=i+o+p;if(d>0){const g=.5/Math.sqrt(d+1);this._w=.25/g,this._x=(h-l)*g,this._y=(s-c)*g,this._z=(a-r)*g}else if(i>o&&i>p){const g=2*Math.sqrt(1+i-o-p);this._w=(h-l)/g,this._x=.25*g,this._y=(r+a)/g,this._z=(s+c)/g}else if(o>p){const g=2*Math.sqrt(1+o-i-p);this._w=(s-c)/g,this._x=(r+a)/g,this._y=.25*g,this._z=(l+h)/g}else{const g=2*Math.sqrt(1+p-i-o);this._w=(a-r)/g,this._x=(s+c)/g,this._y=(l+h)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(et(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,h=n._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-n;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,n=Math.sin(n*c)/h,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const nm=class nm{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(iv.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(iv.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*n-s*r),p=2*(s*i-a*n);return this.x=n+l*c+a*p-o*h,this.y=i+l*h+o*c-s*p,this.z=r+l*p+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=et(this.x,e.x,n.x),this.y=et(this.y,e.y,n.y),this.z=et(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=et(this.x,e,n),this.y=et(this.y,e,n),this.z=et(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return dd.copy(this).projectOnVector(e),this.sub(dd)}reflect(e){return this.sub(dd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(et(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};nm.prototype.isVector3=!0;let X=nm;const dd=new X,iv=new Hr,im=class im{constructor(e,n,i,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=n,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],p=i[7],d=i[2],g=i[5],x=i[8],S=r[0],m=r[3],f=r[6],_=r[1],M=r[4],v=r[7],w=r[2],T=r[5],A=r[8];return s[0]=a*S+o*_+l*w,s[3]=a*m+o*M+l*T,s[6]=a*f+o*v+l*A,s[1]=c*S+h*_+p*w,s[4]=c*m+h*M+p*T,s[7]=c*f+h*v+p*A,s[2]=d*S+g*_+x*w,s[5]=d*m+g*M+x*T,s[8]=d*f+g*v+x*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return n*a*h-n*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=h*a-o*c,d=o*l-h*s,g=c*s-a*l,x=n*p+i*d+r*g;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/x;return e[0]=p*S,e[1]=(r*c-h*i)*S,e[2]=(o*i-r*a)*S,e[3]=d*S,e[4]=(h*n-r*l)*S,e[5]=(r*s-o*n)*S,e[6]=g*S,e[7]=(i*l-c*n)*S,e[8]=(a*n-i*s)*S,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return ca("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(fd.makeScale(e,n)),this}rotate(e){return ca("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(fd.makeRotation(-e)),this}translate(e,n){return ca("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(fd.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};im.prototype.isMatrix3=!0;let je=im;const fd=new je,rv=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sv=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Db(){const t={enabled:!0,workingColorSpace:Xc,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ft&&(r.r=nr(r.r),r.g=nr(r.g),r.b=nr(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ft&&(r.r=ua(r.r),r.g=ua(r.g),r.b=ua(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===br?qc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ca("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ca("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Xc]:{primaries:e,whitePoint:i,transfer:qc,toXYZ:rv,fromXYZ:sv,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:kn},outputColorSpaceConfig:{drawingBufferColorSpace:kn}},[kn]:{primaries:e,whitePoint:i,transfer:ft,toXYZ:rv,fromXYZ:sv,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:kn}}}),t}const rt=Db();function nr(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function ua(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Ts;class Ib{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ts===void 0&&(Ts=Bo("canvas")),Ts.width=e.width,Ts.height=e.height;const r=Ts.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ts}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Bo("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=nr(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(nr(n[i]/255)*255):n[i]=nr(n[i]);return{data:n,width:e.width,height:e.height}}else return Ge("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ub=0;class Xp{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ub++}),this.uuid=qo(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(hd(r[a].image)):s.push(hd(r[a]))}else s=hd(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function hd(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Ib.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Ge("Texture: Unable to serialize Texture."),{})}let Ob=0;const pd=new X;class pn extends qr{constructor(e=pn.DEFAULT_IMAGE,n=pn.DEFAULT_MAPPING,i=Ji,r=Ji,s=hn,a=os,o=mi,l=Bn,c=pn.DEFAULT_ANISOTROPY,h=br){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ob++}),this.uuid=qo(),this.name="",this.source=new Xp(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(pd).x}get height(){return this.source.getSize(pd).y}get depth(){return this.source.getSize(pd).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Ge(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Ge(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ry)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Qf:e.x=e.x-Math.floor(e.x);break;case Ji:e.x=e.x<0?0:1;break;case eh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Qf:e.y=e.y-Math.floor(e.y);break;case Ji:e.y=e.y<0?0:1;break;case eh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}pn.DEFAULT_IMAGE=null;pn.DEFAULT_MAPPING=ry;pn.DEFAULT_ANISOTROPY=1;const rm=class rm{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],h=l[4],p=l[8],d=l[1],g=l[5],x=l[9],S=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(p-S)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(p+S)<.1&&Math.abs(x+m)<.1&&Math.abs(c+g+f-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const M=(c+1)/2,v=(g+1)/2,w=(f+1)/2,T=(h+d)/4,A=(p+S)/4,y=(x+m)/4;return M>v&&M>w?M<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(M),r=T/i,s=A/i):v>w?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=T/r,s=y/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=A/s,r=y/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-x)*(m-x)+(p-S)*(p-S)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-x)/_,this.y=(p-S)/_,this.z=(d-h)/_,this.w=Math.acos((c+g+f-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=et(this.x,e.x,n.x),this.y=et(this.y,e.y,n.y),this.z=et(this.z,e.z,n.z),this.w=et(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=et(this.x,e,n),this.y=et(this.y,e,n),this.z=et(this.z,e,n),this.w=et(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(et(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};rm.prototype.isVector4=!0;let Rt=rm;class Fb extends qr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Rt(0,0,e,n),this.scissorTest=!1,this.viewport=new Rt(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new pn(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const n={minFilter:hn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new Xp(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _i extends Fb{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class hy extends pn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class kb extends pn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=tn,this.minFilter=tn,this.wrapR=Ji,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Yc=class Yc{constructor(e,n,i,r,s,a,o,l,c,h,p,d,g,x,S,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,h,p,d,g,x,S,m)}set(e,n,i,r,s,a,o,l,c,h,p,d,g,x,S,m){const f=this.elements;return f[0]=e,f[4]=n,f[8]=i,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=p,f[14]=d,f[3]=g,f[7]=x,f[11]=S,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Yc().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const n=this.elements,i=e.elements,r=1/bs.setFromMatrixColumn(e,0).length(),s=1/bs.setFromMatrixColumn(e,1).length(),a=1/bs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),p=Math.sin(s);if(e.order==="XYZ"){const d=a*h,g=a*p,x=o*h,S=o*p;n[0]=l*h,n[4]=-l*p,n[8]=c,n[1]=g+x*c,n[5]=d-S*c,n[9]=-o*l,n[2]=S-d*c,n[6]=x+g*c,n[10]=a*l}else if(e.order==="YXZ"){const d=l*h,g=l*p,x=c*h,S=c*p;n[0]=d+S*o,n[4]=x*o-g,n[8]=a*c,n[1]=a*p,n[5]=a*h,n[9]=-o,n[2]=g*o-x,n[6]=S+d*o,n[10]=a*l}else if(e.order==="ZXY"){const d=l*h,g=l*p,x=c*h,S=c*p;n[0]=d-S*o,n[4]=-a*p,n[8]=x+g*o,n[1]=g+x*o,n[5]=a*h,n[9]=S-d*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const d=a*h,g=a*p,x=o*h,S=o*p;n[0]=l*h,n[4]=x*c-g,n[8]=d*c+S,n[1]=l*p,n[5]=S*c+d,n[9]=g*c-x,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const d=a*l,g=a*c,x=o*l,S=o*c;n[0]=l*h,n[4]=S-d*p,n[8]=x*p+g,n[1]=p,n[5]=a*h,n[9]=-o*h,n[2]=-c*h,n[6]=g*p+x,n[10]=d-S*p}else if(e.order==="XZY"){const d=a*l,g=a*c,x=o*l,S=o*c;n[0]=l*h,n[4]=-p,n[8]=c*h,n[1]=d*p+S,n[5]=a*h,n[9]=g*p-x,n[2]=x*p-g,n[6]=o*h,n[10]=S*p+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Bb,e,zb)}lookAt(e,n,i){const r=this.elements;return In.subVectors(e,n),In.lengthSq()===0&&(In.z=1),In.normalize(),gr.crossVectors(i,In),gr.lengthSq()===0&&(Math.abs(i.z)===1?In.x+=1e-4:In.z+=1e-4,In.normalize(),gr.crossVectors(i,In)),gr.normalize(),yl.crossVectors(In,gr),r[0]=gr.x,r[4]=yl.x,r[8]=In.x,r[1]=gr.y,r[5]=yl.y,r[9]=In.y,r[2]=gr.z,r[6]=yl.z,r[10]=In.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],p=i[5],d=i[9],g=i[13],x=i[2],S=i[6],m=i[10],f=i[14],_=i[3],M=i[7],v=i[11],w=i[15],T=r[0],A=r[4],y=r[8],C=r[12],N=r[1],D=r[5],B=r[9],F=r[13],I=r[2],k=r[6],G=r[10],U=r[14],O=r[3],L=r[7],q=r[11],Z=r[15];return s[0]=a*T+o*N+l*I+c*O,s[4]=a*A+o*D+l*k+c*L,s[8]=a*y+o*B+l*G+c*q,s[12]=a*C+o*F+l*U+c*Z,s[1]=h*T+p*N+d*I+g*O,s[5]=h*A+p*D+d*k+g*L,s[9]=h*y+p*B+d*G+g*q,s[13]=h*C+p*F+d*U+g*Z,s[2]=x*T+S*N+m*I+f*O,s[6]=x*A+S*D+m*k+f*L,s[10]=x*y+S*B+m*G+f*q,s[14]=x*C+S*F+m*U+f*Z,s[3]=_*T+M*N+v*I+w*O,s[7]=_*A+M*D+v*k+w*L,s[11]=_*y+M*B+v*G+w*q,s[15]=_*C+M*F+v*U+w*Z,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],p=e[6],d=e[10],g=e[14],x=e[3],S=e[7],m=e[11],f=e[15],_=l*g-c*d,M=o*g-c*p,v=o*d-l*p,w=a*g-c*h,T=a*d-l*h,A=a*p-o*h;return n*(S*_-m*M+f*v)-i*(x*_-m*w+f*T)+r*(x*M-S*w+f*A)-s*(x*v-S*T+m*A)}determinantAffine(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return n*(a*h-o*c)-i*(s*h-o*l)+r*(s*c-a*l)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],p=e[9],d=e[10],g=e[11],x=e[12],S=e[13],m=e[14],f=e[15],_=n*o-i*a,M=n*l-r*a,v=n*c-s*a,w=i*l-r*o,T=i*c-s*o,A=r*c-s*l,y=h*S-p*x,C=h*m-d*x,N=h*f-g*x,D=p*m-d*S,B=p*f-g*S,F=d*f-g*m,I=_*F-M*B+v*D+w*N-T*C+A*y;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/I;return e[0]=(o*F-l*B+c*D)*k,e[1]=(r*B-i*F-s*D)*k,e[2]=(S*A-m*T+f*w)*k,e[3]=(d*T-p*A-g*w)*k,e[4]=(l*N-a*F-c*C)*k,e[5]=(n*F-r*N+s*C)*k,e[6]=(m*v-x*A-f*M)*k,e[7]=(h*A-d*v+g*M)*k,e[8]=(a*B-o*N+c*y)*k,e[9]=(i*N-n*B-s*y)*k,e[10]=(x*T-S*v+f*_)*k,e[11]=(p*v-h*T-g*_)*k,e[12]=(o*C-a*D-l*y)*k,e[13]=(n*D-i*C+r*y)*k,e[14]=(S*M-x*w-m*_)*k,e[15]=(h*w-p*M+d*_)*k,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,h=a+a,p=o+o,d=s*c,g=s*h,x=s*p,S=a*h,m=a*p,f=o*p,_=l*c,M=l*h,v=l*p,w=i.x,T=i.y,A=i.z;return r[0]=(1-(S+f))*w,r[1]=(g+v)*w,r[2]=(x-M)*w,r[3]=0,r[4]=(g-v)*T,r[5]=(1-(d+f))*T,r[6]=(m+_)*T,r[7]=0,r[8]=(x+M)*A,r[9]=(m-_)*A,r[10]=(1-(d+S))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let a=bs.set(r[0],r[1],r[2]).length();const o=bs.set(r[4],r[5],r[6]).length(),l=bs.set(r[8],r[9],r[10]).length();s<0&&(a=-a),oi.copy(this);const c=1/a,h=1/o,p=1/l;return oi.elements[0]*=c,oi.elements[1]*=c,oi.elements[2]*=c,oi.elements[4]*=h,oi.elements[5]*=h,oi.elements[6]*=h,oi.elements[8]*=p,oi.elements[9]*=p,oi.elements[10]*=p,n.setFromRotationMatrix(oi),i.x=a,i.y=o,i.z=l,this}makePerspective(e,n,i,r,s,a,o=Pi,l=!1){const c=this.elements,h=2*s/(n-e),p=2*s/(i-r),d=(n+e)/(n-e),g=(i+r)/(i-r);let x,S;if(l)x=s/(a-s),S=a*s/(a-s);else if(o===Pi)x=-(a+s)/(a-s),S=-2*a*s/(a-s);else if(o===ko)x=-a/(a-s),S=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=p,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Pi,l=!1){const c=this.elements,h=2/(n-e),p=2/(i-r),d=-(n+e)/(n-e),g=-(i+r)/(i-r);let x,S;if(l)x=1/(a-s),S=a/(a-s);else if(o===Pi)x=-2/(a-s),S=-(a+s)/(a-s);else if(o===ko)x=-1/(a-s),S=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=p,c[9]=0,c[13]=g,c[2]=0,c[6]=0,c[10]=x,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};Yc.prototype.isMatrix4=!0;let It=Yc;const bs=new X,oi=new It,Bb=new X(0,0,0),zb=new X(1,1,1),gr=new X,yl=new X,In=new X,av=new It,ov=new Hr;class Vr{constructor(e=0,n=0,i=0,r=Vr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],p=r[2],d=r[6],g=r[10];switch(n){case"XYZ":this._y=Math.asin(et(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,g),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-et(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,s),this._z=0);break;case"ZXY":this._x=Math.asin(et(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-p,g),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-et(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(d,g),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(et(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-p,s)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-et(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,g),this._y=0);break;default:Ge("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return av.makeRotationFromQuaternion(e),this.setFromRotationMatrix(av,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return ov.setFromEuler(this),this.setFromQuaternion(ov,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Vr.DEFAULT_ORDER="XYZ";class py{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Hb=0;const lv=new X,Cs=new Hr,Hi=new It,Sl=new X,Ba=new X,Vb=new X,Gb=new Hr,cv=new X(1,0,0),uv=new X(0,1,0),dv=new X(0,0,1),fv={type:"added"},jb={type:"removed"},As={type:"childadded",child:null},md={type:"childremoved",child:null};class rn extends qr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hb++}),this.uuid=qo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=rn.DEFAULT_UP.clone();const e=new X,n=new Vr,i=new Hr,r=new X(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new It},normalMatrix:{value:new je}}),this.matrix=new It,this.matrixWorld=new It,this.matrixAutoUpdate=rn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new py,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Cs.setFromAxisAngle(e,n),this.quaternion.multiply(Cs),this}rotateOnWorldAxis(e,n){return Cs.setFromAxisAngle(e,n),this.quaternion.premultiply(Cs),this}rotateX(e){return this.rotateOnAxis(cv,e)}rotateY(e){return this.rotateOnAxis(uv,e)}rotateZ(e){return this.rotateOnAxis(dv,e)}translateOnAxis(e,n){return lv.copy(e).applyQuaternion(this.quaternion),this.position.add(lv.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(cv,e)}translateY(e){return this.translateOnAxis(uv,e)}translateZ(e){return this.translateOnAxis(dv,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Sl.copy(e):Sl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Ba.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hi.lookAt(Ba,Sl,this.up):Hi.lookAt(Sl,Ba,this.up),this.quaternion.setFromRotationMatrix(Hi),r&&(Hi.extractRotation(r.matrixWorld),Cs.setFromRotationMatrix(Hi),this.quaternion.premultiply(Cs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(lt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(fv),As.child=e,this.dispatchEvent(As),As.child=null):lt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(jb),md.child=e,this.dispatchEvent(md),md.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(fv),As.child=e,this.dispatchEvent(As),As.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ba,e,Vb),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ba,Gb,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const p=l[c];s(e.shapes,p)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),p=a(e.shapes),d=a(e.skeletons),g=a(e.animations),x=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),p.length>0&&(i.shapes=p),d.length>0&&(i.skeletons=d),g.length>0&&(i.animations=g),x.length>0&&(i.nodes=x)}return i.object=r,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}rn.DEFAULT_UP=new X(0,1,0);rn.DEFAULT_MATRIX_AUTO_UPDATE=!0;rn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class eo extends rn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Wb={type:"move"};class gd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new eo,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new eo,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new eo,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const S of e.hand.values()){const m=n.getJointPose(S,i),f=this._getHandJoint(c,S);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],d=h.position.distanceTo(p.position),g=.02,x=.005;c.inputState.pinching&&d>g+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=g-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Wb)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new eo;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const my={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vr={h:0,s:0,l:0},El={h:0,s:0,l:0};function vd(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Ke{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=kn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=rt.workingColorSpace){return this.r=e,this.g=n,this.b=i,rt.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=rt.workingColorSpace){if(e=Nb(e,1),n=et(n,0,1),i=et(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=vd(a,s,e+1/3),this.g=vd(a,s,e),this.b=vd(a,s,e-1/3)}return rt.colorSpaceToWorking(this,r),this}setStyle(e,n=kn){function i(s){s!==void 0&&parseFloat(s)<1&&Ge("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Ge("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);Ge("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=kn){const i=my[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Ge("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=nr(e.r),this.g=nr(e.g),this.b=nr(e.b),this}copyLinearToSRGB(e){return this.r=ua(e.r),this.g=ua(e.g),this.b=ua(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kn){return rt.workingToColorSpace(un.copy(this),e),Math.round(et(un.r*255,0,255))*65536+Math.round(et(un.g*255,0,255))*256+Math.round(et(un.b*255,0,255))}getHexString(e=kn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=rt.workingColorSpace){rt.workingToColorSpace(un.copy(this),n);const i=un.r,r=un.g,s=un.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=h<=.5?p/(a+o):p/(2-a-o),a){case i:l=(r-s)/p+(r<s?6:0);break;case r:l=(s-i)/p+2;break;case s:l=(i-r)/p+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,n=rt.workingColorSpace){return rt.workingToColorSpace(un.copy(this),n),e.r=un.r,e.g=un.g,e.b=un.b,e}getStyle(e=kn){rt.workingToColorSpace(un.copy(this),e);const n=un.r,i=un.g,r=un.b;return e!==kn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(vr),this.setHSL(vr.h+e,vr.s+n,vr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(vr),e.getHSL(El);const i=ud(vr.h,El.h,n),r=ud(vr.s,El.s,n),s=ud(vr.l,El.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const un=new Ke;Ke.NAMES=my;class Xb extends rn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Vr,this.environmentIntensity=1,this.environmentRotation=new Vr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}}const li=new X,Vi=new X,_d=new X,Gi=new X,Rs=new X,Ps=new X,hv=new X,xd=new X,yd=new X,Sd=new X,Ed=new Rt,Md=new Rt,wd=new Rt;class pi{constructor(e=new X,n=new X,i=new X){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),li.subVectors(e,n),r.cross(li);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){li.subVectors(r,n),Vi.subVectors(i,n),_d.subVectors(e,n);const a=li.dot(li),o=li.dot(Vi),l=li.dot(_d),c=Vi.dot(Vi),h=Vi.dot(_d),p=a*c-o*o;if(p===0)return s.set(0,0,0),null;const d=1/p,g=(c*l-o*h)*d,x=(a*h-o*l)*d;return s.set(1-g-x,x,g)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Gi)===null?!1:Gi.x>=0&&Gi.y>=0&&Gi.x+Gi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,Gi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Gi.x),l.addScaledVector(a,Gi.y),l.addScaledVector(o,Gi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return Ed.setScalar(0),Md.setScalar(0),wd.setScalar(0),Ed.fromBufferAttribute(e,n),Md.fromBufferAttribute(e,i),wd.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Ed,s.x),a.addScaledVector(Md,s.y),a.addScaledVector(wd,s.z),a}static isFrontFacing(e,n,i,r){return li.subVectors(i,n),Vi.subVectors(e,n),li.cross(Vi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return li.subVectors(this.c,this.b),Vi.subVectors(this.a,this.b),li.cross(Vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return pi.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return pi.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Rs.subVectors(r,i),Ps.subVectors(s,i),xd.subVectors(e,i);const l=Rs.dot(xd),c=Ps.dot(xd);if(l<=0&&c<=0)return n.copy(i);yd.subVectors(e,r);const h=Rs.dot(yd),p=Ps.dot(yd);if(h>=0&&p<=h)return n.copy(r);const d=l*p-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),n.copy(i).addScaledVector(Rs,a);Sd.subVectors(e,s);const g=Rs.dot(Sd),x=Ps.dot(Sd);if(x>=0&&g<=x)return n.copy(s);const S=g*c-l*x;if(S<=0&&c>=0&&x<=0)return o=c/(c-x),n.copy(i).addScaledVector(Ps,o);const m=h*x-g*p;if(m<=0&&p-h>=0&&g-x>=0)return hv.subVectors(s,r),o=(p-h)/(p-h+(g-x)),n.copy(r).addScaledVector(hv,o);const f=1/(m+S+d);return a=S*f,o=d*f,n.copy(i).addScaledVector(Rs,a).addScaledVector(Ps,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class $o{constructor(e=new X(1/0,1/0,1/0),n=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(ci.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(ci.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=ci.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ci):ci.fromBufferAttribute(s,a),ci.applyMatrix4(e.matrixWorld),this.expandByPoint(ci);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ml.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ml.copy(i.boundingBox)),Ml.applyMatrix4(e.matrixWorld),this.union(Ml)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ci),ci.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(za),wl.subVectors(this.max,za),Ns.subVectors(e.a,za),Ls.subVectors(e.b,za),Ds.subVectors(e.c,za),_r.subVectors(Ls,Ns),xr.subVectors(Ds,Ls),Yr.subVectors(Ns,Ds);let n=[0,-_r.z,_r.y,0,-xr.z,xr.y,0,-Yr.z,Yr.y,_r.z,0,-_r.x,xr.z,0,-xr.x,Yr.z,0,-Yr.x,-_r.y,_r.x,0,-xr.y,xr.x,0,-Yr.y,Yr.x,0];return!Td(n,Ns,Ls,Ds,wl)||(n=[1,0,0,0,1,0,0,0,1],!Td(n,Ns,Ls,Ds,wl))?!1:(Tl.crossVectors(_r,xr),n=[Tl.x,Tl.y,Tl.z],Td(n,Ns,Ls,Ds,wl))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ci).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ci).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ji[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ji[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ji[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ji[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ji[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ji[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ji[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ji[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ji),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ji=[new X,new X,new X,new X,new X,new X,new X,new X],ci=new X,Ml=new $o,Ns=new X,Ls=new X,Ds=new X,_r=new X,xr=new X,Yr=new X,za=new X,wl=new X,Tl=new X,Kr=new X;function Td(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){Kr.fromArray(t,s);const o=r.x*Math.abs(Kr.x)+r.y*Math.abs(Kr.y)+r.z*Math.abs(Kr.z),l=e.dot(Kr),c=n.dot(Kr),h=i.dot(Kr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Bt=new X,bl=new He;let qb=0;class ir extends qr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qb++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=bb,this.updateRanges=[],this.gpuType=Ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)bl.fromBufferAttribute(this,n),bl.applyMatrix3(e),this.setXY(n,bl.x,bl.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Bt.fromBufferAttribute(this,n),Bt.applyMatrix3(e),this.setXYZ(n,Bt.x,Bt.y,Bt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Bt.fromBufferAttribute(this,n),Bt.applyMatrix4(e),this.setXYZ(n,Bt.x,Bt.y,Bt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Bt.fromBufferAttribute(this,n),Bt.applyNormalMatrix(e),this.setXYZ(n,Bt.x,Bt.y,Bt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Bt.fromBufferAttribute(this,n),Bt.transformDirection(e),this.setXYZ(n,Bt.x,Bt.y,Bt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ka(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=Mn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ka(n,this.array)),n}setX(e,n){return this.normalized&&(n=Mn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ka(n,this.array)),n}setY(e,n){return this.normalized&&(n=Mn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ka(n,this.array)),n}setZ(e,n){return this.normalized&&(n=Mn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ka(n,this.array)),n}setW(e,n){return this.normalized&&(n=Mn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=Mn(n,this.array),i=Mn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=Mn(n,this.array),i=Mn(i,this.array),r=Mn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=Mn(n,this.array),i=Mn(i,this.array),r=Mn(r,this.array),s=Mn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class gy extends ir{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class vy extends ir{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Tt extends ir{constructor(e,n,i){super(new Float32Array(e),n,i)}}const $b=new $o,Ha=new X,bd=new X;class qp{constructor(e=new X,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):$b.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ha.subVectors(e,this.center);const n=Ha.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Ha,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ha.copy(e.center).add(bd)),this.expandByPoint(Ha.copy(e.center).sub(bd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Yb=0;const qn=new It,Cd=new rn,Is=new X,Un=new $o,Va=new $o,Zt=new X;class Dn extends qr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yb++}),this.uuid=qo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cb(e)?vy:gy)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new je().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return qn.makeRotationFromQuaternion(e),this.applyMatrix4(qn),this}rotateX(e){return qn.makeRotationX(e),this.applyMatrix4(qn),this}rotateY(e){return qn.makeRotationY(e),this.applyMatrix4(qn),this}rotateZ(e){return qn.makeRotationZ(e),this.applyMatrix4(qn),this}translate(e,n,i){return qn.makeTranslation(e,n,i),this.applyMatrix4(qn),this}scale(e,n,i){return qn.makeScale(e,n,i),this.applyMatrix4(qn),this}lookAt(e){return Cd.lookAt(e),Cd.updateMatrix(),this.applyMatrix4(Cd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Is).negate(),this.translate(Is.x,Is.y,Is.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Tt(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Ge("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $o);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){lt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Un.setFromBufferAttribute(s),this.morphTargetsRelative?(Zt.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(Zt),Zt.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(Zt)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&lt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qp);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){lt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const i=this.boundingSphere.center;if(Un.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];Va.setFromBufferAttribute(o),this.morphTargetsRelative?(Zt.addVectors(Un.min,Va.min),Un.expandByPoint(Zt),Zt.addVectors(Un.max,Va.max),Un.expandByPoint(Zt)):(Un.expandByPoint(Va.min),Un.expandByPoint(Va.max))}Un.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Zt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Zt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Zt.fromBufferAttribute(o,c),l&&(Is.fromBufferAttribute(e,c),Zt.add(Is)),r=Math.max(r,i.distanceToSquared(Zt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&lt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){lt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new ir(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let y=0;y<i.count;y++)o[y]=new X,l[y]=new X;const c=new X,h=new X,p=new X,d=new He,g=new He,x=new He,S=new X,m=new X;function f(y,C,N){c.fromBufferAttribute(i,y),h.fromBufferAttribute(i,C),p.fromBufferAttribute(i,N),d.fromBufferAttribute(s,y),g.fromBufferAttribute(s,C),x.fromBufferAttribute(s,N),h.sub(c),p.sub(c),g.sub(d),x.sub(d);const D=1/(g.x*x.y-x.x*g.y);isFinite(D)&&(S.copy(h).multiplyScalar(x.y).addScaledVector(p,-g.y).multiplyScalar(D),m.copy(p).multiplyScalar(g.x).addScaledVector(h,-x.x).multiplyScalar(D),o[y].add(S),o[C].add(S),o[N].add(S),l[y].add(m),l[C].add(m),l[N].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let y=0,C=_.length;y<C;++y){const N=_[y],D=N.start,B=N.count;for(let F=D,I=D+B;F<I;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const M=new X,v=new X,w=new X,T=new X;function A(y){w.fromBufferAttribute(r,y),T.copy(w);const C=o[y];M.copy(C),M.sub(w.multiplyScalar(w.dot(C))).normalize(),v.crossVectors(T,C);const D=v.dot(l[y])<0?-1:1;a.setXYZW(y,M.x,M.y,M.z,D)}for(let y=0,C=_.length;y<C;++y){const N=_[y],D=N.start,B=N.count;for(let F=D,I=D+B;F<I;F+=3)A(e.getX(F+0)),A(e.getX(F+1)),A(e.getX(F+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new ir(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,g=i.count;d<g;d++)i.setXYZ(d,0,0,0);const r=new X,s=new X,a=new X,o=new X,l=new X,c=new X,h=new X,p=new X;if(e)for(let d=0,g=e.count;d<g;d+=3){const x=e.getX(d+0),S=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(n,x),s.fromBufferAttribute(n,S),a.fromBufferAttribute(n,m),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),o.fromBufferAttribute(i,x),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(x,o.x,o.y,o.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,g=n.count;d<g;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),a.fromBufferAttribute(n,d+2),h.subVectors(a,s),p.subVectors(r,s),h.cross(p),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Zt.fromBufferAttribute(e,n),Zt.normalize(),e.setXYZ(n,Zt.x,Zt.y,Zt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,p=o.normalized,d=new c.constructor(l.length*h);let g=0,x=0;for(let S=0,m=l.length;S<m;S++){o.isInterleavedBufferAttribute?g=l[S]*o.data.stride+o.offset:g=l[S]*h;for(let f=0;f<h;f++)d[x++]=c[g++]}return new ir(d,h,p)}if(this.index===null)return Ge("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Dn,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,p=c.length;h<p;h++){const d=c[h],g=e(d,i);l.push(g)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let p=0,d=c.length;p<d;p++){const g=c[p];h.push(g.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(n))}const s=e.morphAttributes;for(const c in s){const h=[],p=s[c];for(let d=0,g=p.length;d<g;d++)h.push(p[d].clone(n));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ad=new X,Kb=new X,Zb=new je;class Yi{constructor(e=new X(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Ad.subVectors(i,n).cross(Kb.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(Ad),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||Zb.getNormalMatrix(e),r=this.coplanarPoint(Ad).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Jb=0;class Yo extends qr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jb++}),this.uuid=qo(),this.name="",this.type="Material",this.blending=fo,this.side=gs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$x,this.blendDst=Yx,this.blendEquation=zs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=Uo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=xb,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=cd,this.stencilZFail=cd,this.stencilZPass=cd,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Ge(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Ge(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Yi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new He().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new He().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Wi=new X,Rd=new X,Cl=new X,Al=new X;class _y{constructor(e=new X,n=new X(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Wi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Wi.copy(this.origin).addScaledVector(this.direction,n),Wi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Rd.copy(e).add(n).multiplyScalar(.5),Cl.copy(n).sub(e).normalize(),Al.copy(this.origin).sub(Rd);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Cl),o=Al.dot(this.direction),l=-Al.dot(Cl),c=Al.lengthSq(),h=Math.abs(1-a*a);let p,d,g,x;if(h>0)if(p=a*l-o,d=a*o-l,x=s*h,p>=0)if(d>=-x)if(d<=x){const S=1/h;p*=S,d*=S,g=p*(p+a*d+2*o)+d*(a*p+d+2*l)+c}else d=s,p=Math.max(0,-(a*d+o)),g=-p*p+d*(d+2*l)+c;else d=-s,p=Math.max(0,-(a*d+o)),g=-p*p+d*(d+2*l)+c;else d<=-x?(p=Math.max(0,-(-a*s+o)),d=p>0?-s:Math.min(Math.max(-s,-l),s),g=-p*p+d*(d+2*l)+c):d<=x?(p=0,d=Math.min(Math.max(-s,-l),s),g=d*(d+2*l)+c):(p=Math.max(0,-(a*s+o)),d=p>0?s:Math.min(Math.max(-s,-l),s),g=-p*p+d*(d+2*l)+c);else d=a>0?-s:s,p=Math.max(0,-(a*d+o)),g=-p*p+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,p),r&&r.copy(Rd).addScaledVector(Cl,d),g}intersectSphere(e,n){if(e.radius<0)return null;Wi.subVectors(e.center,this.origin);const i=Wi.dot(this.direction),r=Wi.dot(Wi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,p=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),p>=0?(o=(e.min.z-d.z)*p,l=(e.max.z-d.z)*p):(o=(e.max.z-d.z)*p,l=(e.min.z-d.z)*p),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Wi)!==null}intersectTriangle(e,n,i,r,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,p=e.x-a.x,d=e.y-a.y,g=e.z-a.z,x=n.x-a.x,S=n.y-a.y,m=n.z-a.z,f=i.x-a.x,_=i.y-a.y,M=i.z-a.z,v=Math.abs(l),w=Math.abs(c),T=Math.abs(h);let A,y,C,N,D,B,F,I,k,G,U,O;if(v>=w&&v>=T?(C=l,B=p,k=x,O=f,l>=0?(A=c,y=h,N=d,D=g,F=S,I=m,G=_,U=M):(A=h,y=c,N=g,D=d,F=m,I=S,G=M,U=_)):w>=T?(C=c,B=d,k=S,O=_,c>=0?(A=h,y=l,N=g,D=p,F=m,I=x,G=M,U=f):(A=l,y=h,N=p,D=g,F=x,I=m,G=f,U=M)):(C=h,B=g,k=m,O=M,h>=0?(A=l,y=c,N=p,D=d,F=x,I=S,G=f,U=_):(A=c,y=l,N=d,D=p,F=S,I=x,G=_,U=f)),C===0)return null;const L=A/C,q=y/C,Z=1/C,ce=N-L*B,_e=D-q*B,se=F-L*k,Me=I-q*k,de=G-L*O,j=U-q*O,J=de*Me-j*se,le=ce*j-_e*de,Ue=se*_e-Me*ce;if(r){if(J<0||le<0||Ue<0)return null}else if((J<0||le<0||Ue<0)&&(J>0||le>0||Ue>0))return null;const he=J+le+Ue;if(he===0)return null;const Ve=Z*(J*B+le*k+Ue*O);return(he>0?Ve<0:Ve>0)?null:this.at(Ve/he,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class $p extends Yo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vr,this.combine=Kx,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pv=new It,Zr=new _y,Rl=new qp,mv=new X,Pl=new X,Nl=new X,Ll=new X,Pd=new X,Dl=new X,gv=new X,Il=new X;class dn extends rn{constructor(e=new Dn,n=new $p){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Dl.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],p=s[l];h!==0&&(Pd.fromBufferAttribute(p,e),a?Dl.addScaledVector(Pd,h):Dl.addScaledVector(Pd.sub(n),h))}n.add(Dl)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Rl.copy(i.boundingSphere),Rl.applyMatrix4(s),Zr.copy(e.ray).recast(e.near),!(Rl.containsPoint(Zr.origin)===!1&&(Zr.intersectSphere(Rl,mv)===null||Zr.origin.distanceToSquared(mv)>(e.far-e.near)**2))&&(pv.copy(s).invert(),Zr.copy(e.ray).applyMatrix4(pv),!(i.boundingBox!==null&&Zr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Zr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,p=s.attributes.normal,d=s.groups,g=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,S=d.length;x<S;x++){const m=d[x],f=a[m.materialIndex],_=Math.max(m.start,g.start),M=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let v=_,w=M;v<w;v+=3){const T=o.getX(v),A=o.getX(v+1),y=o.getX(v+2);r=Ul(this,f,e,i,c,h,p,T,A,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,g.start),S=Math.min(o.count,g.start+g.count);for(let m=x,f=S;m<f;m+=3){const _=o.getX(m),M=o.getX(m+1),v=o.getX(m+2);r=Ul(this,a,e,i,c,h,p,_,M,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,S=d.length;x<S;x++){const m=d[x],f=a[m.materialIndex],_=Math.max(m.start,g.start),M=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let v=_,w=M;v<w;v+=3){const T=v,A=v+1,y=v+2;r=Ul(this,f,e,i,c,h,p,T,A,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const x=Math.max(0,g.start),S=Math.min(l.count,g.start+g.count);for(let m=x,f=S;m<f;m+=3){const _=m,M=m+1,v=m+2;r=Ul(this,a,e,i,c,h,p,_,M,v),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function Qb(t,e,n,i,r,s,a,o){let l;if(e.side===Ln?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===gs,o),l===null)return null;Il.copy(o),Il.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Il);return c<n.near||c>n.far?null:{distance:c,point:Il.clone(),object:t}}function Ul(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Pl),t.getVertexPosition(l,Nl),t.getVertexPosition(c,Ll);const h=Qb(t,e,n,i,Pl,Nl,Ll,gv);if(h){const p=new X;pi.getBarycoord(gv,Pl,Nl,Ll,p),r&&(h.uv=pi.getInterpolatedAttribute(r,o,l,c,p,new He)),s&&(h.uv1=pi.getInterpolatedAttribute(s,o,l,c,p,new He)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,l,c,p,new X),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new X,materialIndex:0};pi.getNormal(Pl,Nl,Ll,d.normal),h.face=d,h.barycoord=p}return h}class e1 extends pn{constructor(e=null,n=1,i=1,r,s,a,o,l,c=tn,h=tn,p,d){super(null,a,o,l,c,h,r,s,p,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Jr=new qp,t1=new He(.5,.5),Ol=new X;class Yp{constructor(e=new Yi,n=new Yi,i=new Yi,r=new Yi,s=new Yi,a=new Yi){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Pi,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],p=s[5],d=s[6],g=s[7],x=s[8],S=s[9],m=s[10],f=s[11],_=s[12],M=s[13],v=s[14],w=s[15];if(r[0].setComponents(c-a,g-h,f-x,w-_).normalize(),r[1].setComponents(c+a,g+h,f+x,w+_).normalize(),r[2].setComponents(c+o,g+p,f+S,w+M).normalize(),r[3].setComponents(c-o,g-p,f-S,w-M).normalize(),i)r[4].setComponents(l,d,m,v).normalize(),r[5].setComponents(c-l,g-d,f-m,w-v).normalize();else if(r[4].setComponents(c-l,g-d,f-m,w-v).normalize(),n===Pi)r[5].setComponents(c+l,g+d,f+m,w+v).normalize();else if(n===ko)r[5].setComponents(l,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jr)}intersectsSprite(e){Jr.center.set(0,0,0);const n=t1.distanceTo(e.center);return Jr.radius=.7071067811865476+n,Jr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Ol.x=r.normal.x>0?e.max.x:e.min.x,Ol.y=r.normal.y>0?e.max.y:e.min.y,Ol.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ol)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class xy extends pn{constructor(e=[],n=vs,i,r,s,a,o,l,c,h){super(e,n,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zo extends pn{constructor(e,n,i=Oi,r,s,a,o=tn,l=tn,c,h=cr,p=1){if(h!==cr&&h!==ls)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:p};super(d,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Xp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}}class n1 extends zo{constructor(e,n=Oi,i=vs,r,s,a=tn,o=tn,l,c=cr){const h={width:e,height:e,depth:1},p=[h,h,h,h,h,h];super(e,e,n,i,r,s,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class yy extends pn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Qi extends Dn{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],p=[];let d=0,g=0;x("z","y","x",-1,-1,i,n,e,a,s,0),x("z","y","x",1,-1,i,n,-e,a,s,1),x("x","z","y",1,1,e,i,n,r,a,2),x("x","z","y",1,-1,e,i,-n,r,a,3),x("x","y","z",1,-1,e,n,i,r,s,4),x("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Tt(c,3)),this.setAttribute("normal",new Tt(h,3)),this.setAttribute("uv",new Tt(p,2));function x(S,m,f,_,M,v,w,T,A,y,C){const N=v/A,D=w/y,B=v/2,F=w/2,I=T/2,k=A+1,G=y+1;let U=0,O=0;const L=new X;for(let q=0;q<G;q++){const Z=q*D-F;for(let ce=0;ce<k;ce++){const _e=ce*N-B;L[S]=_e*_,L[m]=Z*M,L[f]=I,c.push(L.x,L.y,L.z),L[S]=0,L[m]=0,L[f]=T>0?1:-1,h.push(L.x,L.y,L.z),p.push(ce/A),p.push(1-q/y),U+=1}}for(let q=0;q<y;q++)for(let Z=0;Z<A;Z++){const ce=d+Z+k*q,_e=d+Z+k*(q+1),se=d+(Z+1)+k*(q+1),Me=d+(Z+1)+k*q;l.push(ce,_e,Me),l.push(_e,se,Me),O+=6}o.addGroup(g,O,C),g+=O,d+=U}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Kp extends Dn{constructor(e=1,n=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:n,thetaStart:i,thetaLength:r},n=Math.max(3,n);const s=[],a=[],o=[],l=[],c=new X,h=new He;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let p=0,d=3;p<=n;p++,d+=3){const g=i+p/n*r;c.x=e*Math.cos(g),c.y=e*Math.sin(g),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,l.push(h.x,h.y)}for(let p=1;p<=n;p++)s.push(p,p+1,0);this.setIndex(s),this.setAttribute("position",new Tt(a,3)),this.setAttribute("normal",new Tt(o,3)),this.setAttribute("uv",new Tt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Kp(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class qi extends Dn{constructor(e=1,n=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],p=[],d=[],g=[];let x=0;const S=[],m=i/2;let f=0;_(),a===!1&&(e>0&&M(!0),n>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new Tt(p,3)),this.setAttribute("normal",new Tt(d,3)),this.setAttribute("uv",new Tt(g,2));function _(){const v=new X,w=new X;let T=0;const A=(n-e)/i;for(let y=0;y<=s;y++){const C=[],N=y/s,D=N*(n-e)+e;for(let B=0;B<=r;B++){const F=B/r,I=F*l+o,k=Math.sin(I),G=Math.cos(I);w.x=D*k,w.y=-N*i+m,w.z=D*G,p.push(w.x,w.y,w.z),v.set(k,A,G).normalize(),d.push(v.x,v.y,v.z),g.push(F,1-N),C.push(x++)}S.push(C)}for(let y=0;y<r;y++)for(let C=0;C<s;C++){const N=S[C][y],D=S[C+1][y],B=S[C+1][y+1],F=S[C][y+1];(e>0||C!==0)&&(h.push(N,D,F),T+=3),(n>0||C!==s-1)&&(h.push(D,B,F),T+=3)}c.addGroup(f,T,0),f+=T}function M(v){const w=x,T=new He,A=new X;let y=0;const C=v===!0?e:n,N=v===!0?1:-1;for(let B=1;B<=r;B++)p.push(0,m*N,0),d.push(0,N,0),g.push(.5,.5),x++;const D=x;for(let B=0;B<=r;B++){const I=B/r*l+o,k=Math.cos(I),G=Math.sin(I);A.x=C*G,A.y=m*N,A.z=C*k,p.push(A.x,A.y,A.z),d.push(0,N,0),T.x=k*.5+.5,T.y=G*.5*N+.5,g.push(T.x,T.y),x++}for(let B=0;B<r;B++){const F=w+B,I=D+B;v===!0?h.push(I,I+1,F):h.push(I+1,I,F),y+=3}c.addGroup(f,y,v===!0?1:2),f+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Su extends Dn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,p=e/o,d=n/l,g=[],x=[],S=[],m=[];for(let f=0;f<h;f++){const _=f*d-a;for(let M=0;M<c;M++){const v=M*p-s;x.push(v,-_,0),S.push(0,0,1),m.push(M/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let _=0;_<o;_++){const M=_+c*f,v=_+c*(f+1),w=_+1+c*(f+1),T=_+1+c*f;g.push(M,v,T),g.push(v,w,T)}this.setIndex(g),this.setAttribute("position",new Tt(x,3)),this.setAttribute("normal",new Tt(S,3)),this.setAttribute("uv",new Tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Su(e.width,e.height,e.widthSegments,e.heightSegments)}}class Zp extends Dn{constructor(e=.5,n=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],h=[];let p=e;const d=(n-e)/r,g=new X,x=new He;for(let S=0;S<=r;S++){for(let m=0;m<=i;m++){const f=s+m/i*a;g.x=p*Math.cos(f),g.y=p*Math.sin(f),l.push(g.x,g.y,g.z),c.push(0,0,1),x.x=(g.x/n+1)/2,x.y=(g.y/n+1)/2,h.push(x.x,x.y)}p+=d}for(let S=0;S<r;S++){const m=S*(i+1);for(let f=0;f<i;f++){const _=f+m,M=_,v=_+i+1,w=_+i+2,T=_+1;o.push(M,v,T),o.push(v,w,T)}}this.setIndex(o),this.setAttribute("position",new Tt(l,3)),this.setAttribute("normal",new Tt(c,3)),this.setAttribute("uv",new Tt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zp(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Mr extends Dn{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],p=new X,d=new X,g=[],x=[],S=[],m=[];for(let f=0;f<=i;f++){const _=[],M=f/i,v=a+M*o,w=e*Math.cos(v),T=Math.sqrt(e*e-w*w);let A=0;f===0&&a===0?A=.5/n:f===i&&l===Math.PI&&(A=-.5/n);for(let y=0;y<=n;y++){const C=y/n,N=r+C*s;p.x=-T*Math.cos(N),p.y=w,p.z=T*Math.sin(N),x.push(p.x,p.y,p.z),d.copy(p).normalize(),S.push(d.x,d.y,d.z),m.push(C+A,1-M),_.push(c++)}h.push(_)}for(let f=0;f<i;f++)for(let _=0;_<n;_++){const M=h[f][_+1],v=h[f][_],w=h[f+1][_],T=h[f+1][_+1];(f!==0||a>0)&&g.push(M,v,T),(f!==i-1||l<Math.PI)&&g.push(v,w,T)}this.setIndex(g),this.setAttribute("position",new Tt(x,3)),this.setAttribute("normal",new Tt(S,3)),this.setAttribute("uv",new Tt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mr(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ho extends Dn{constructor(e=1,n=.4,i=12,r=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:n,radialSegments:i,tubularSegments:r,arc:s,thetaStart:a,thetaLength:o},i=Math.floor(i),r=Math.floor(r);const l=[],c=[],h=[],p=[],d=new X,g=new X,x=new X;for(let S=0;S<=i;S++){const m=a+S/i*o;for(let f=0;f<=r;f++){const _=f/r*s;g.x=(e+n*Math.cos(m))*Math.cos(_),g.y=(e+n*Math.cos(m))*Math.sin(_),g.z=n*Math.sin(m),c.push(g.x,g.y,g.z),d.x=e*Math.cos(_),d.y=e*Math.sin(_),x.subVectors(g,d).normalize(),h.push(x.x,x.y,x.z),p.push(f/r),p.push(S/i)}}for(let S=1;S<=i;S++)for(let m=1;m<=r;m++){const f=(r+1)*S+m-1,_=(r+1)*(S-1)+m-1,M=(r+1)*(S-1)+m,v=(r+1)*S+m;l.push(f,_,v),l.push(_,M,v)}this.setIndex(l),this.setAttribute("position",new Tt(c,3)),this.setAttribute("normal",new Tt(h,3)),this.setAttribute("uv",new Tt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ho(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function ya(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(vv(r))r.isRenderTargetTexture?(Ge("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(vv(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function vn(t){const e={};for(let n=0;n<t.length;n++){const i=ya(t[n]);for(const r in i)e[r]=i[r]}return e}function vv(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function i1(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Sy(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}const r1={clone:ya,merge:vn};var s1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,a1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends Yo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=s1,this.fragmentShader=a1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ya(e.uniforms),this.uniformsGroups=i1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(const i in e.uniforms){const r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new Ke().setHex(r.value);break;case"v2":this.uniforms[i].value=new He().fromArray(r.value);break;case"v3":this.uniforms[i].value=new X().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Rt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new je().fromArray(r.value);break;case"m4":this.uniforms[i].value=new It().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class o1 extends ki{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class $n extends Yo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Vr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class l1 extends Yo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vb,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class c1 extends Yo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Nd={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(_v(t)||(this.files[t]=e))},get:function(t){if(this.enabled!==!1&&!_v(t))return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};function _v(t){try{const e=t.slice(t.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class u1{constructor(e,n,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,s===!1&&r.onStart!==void 0&&r.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,r.onProgress!==void 0&&r.onProgress(h,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,p){return c.push(h,p),this},this.removeHandler=function(h){const p=c.indexOf(h);return p!==-1&&c.splice(p,2),this},this.getHandler=function(h){for(let p=0,d=c.length;p<d;p+=2){const g=c[p],x=c[p+1];if(g.global&&(g.lastIndex=0),g.test(h))return x}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const d1=new u1;class Jp{constructor(e){this.manager=e!==void 0?e:d1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Jp.DEFAULT_MATERIAL_NAME="__DEFAULT";const Us=new WeakMap;class f1 extends Jp{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Nd.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(e),setTimeout(function(){n&&n(a),s.manager.itemEnd(e)},0);else{let p=Us.get(a);p===void 0&&(p=[],Us.set(a,p)),p.push({onLoad:n,onError:r})}return a}const o=Bo("img");function l(){h(),n&&n(this);const p=Us.get(this)||[];for(let d=0;d<p.length;d++){const g=p[d];g.onLoad&&g.onLoad(this)}Us.delete(this),s.manager.itemEnd(e)}function c(p){h(),r&&r(p),Nd.remove(`image:${e}`);const d=Us.get(this)||[];for(let g=0;g<d.length;g++){const x=d[g];x.onError&&x.onError(p)}Us.delete(this),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Nd.add(`image:${e}`,o),s.manager.itemStart(e),o.src=e,o}}class h1 extends Jp{constructor(e){super(e)}load(e,n,i,r){const s=new pn,a=new f1(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class Ey extends rn{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=n}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}class p1 extends Ey{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}toJSON(e){const n=super.toJSON(e);return n.object.groundColor=this.groundColor.getHex(),n}}const Ld=new It,xv=new X,yv=new X;class m1{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.mapType=Bn,this.map=null,this.mapPass=null,this.matrix=new It,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yp,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new Rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera;xv.setFromMatrixPosition(e.matrixWorld),n.position.copy(xv),yv.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(yv),n.updateMatrixWorld(),this._updateMatrix(n,this.matrix,this._frustum)}_updateMatrix(e,n,i,r){Ld.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Ld,e.coordinateSystem,e.reversedDepth);const s=this._frameExtents,a=r?r.z/s.x:1,o=r?r.w/s.y:1,l=r?r.x/s.x:0,c=r?r.y/s.y:0;e.coordinateSystem===ko||e.reversedDepth?n.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):n.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),n.multiply(Ld)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Fl=new X,kl=new Hr,Mi=new X;class My extends rn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new It,this.projectionMatrix=new It,this.projectionMatrixInverse=new It,this.coordinateSystem=Pi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Fl,kl,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fl,kl,Mi.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Fl,kl,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fl,kl,Mi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const yr=new X,Sv=new He,Ev=new He;class Jn extends My{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=Lh*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(fc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lh*2*Math.atan(Math.tan(fc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){yr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(yr.x,yr.y).multiplyScalar(-e/yr.z),yr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(yr.x,yr.y).multiplyScalar(-e/yr.z)}getViewSize(e,n){return this.getViewBounds(e,Sv,Ev),n.subVectors(Ev,Sv)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(fc*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class Qp extends My{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class g1 extends m1{constructor(){super(new Qp(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Mv extends Ey{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(rn.DEFAULT_UP),this.updateMatrix(),this.target=new rn,this.shadow=new g1}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}const Os=-90,Fs=1;class v1 extends rn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Jn(Os,Fs,e,n);r.layers=this.layers,this.add(r);const s=new Jn(Os,Fs,e,n);s.layers=this.layers,this.add(s);const a=new Jn(Os,Fs,e,n);a.layers=this.layers,this.add(a);const o=new Jn(Os,Fs,e,n);o.layers=this.layers,this.add(o);const l=new Jn(Os,Fs,e,n);l.layers=this.layers,this.add(l);const c=new Jn(Os,Fs,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===Pi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ko)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,p=e.getRenderTarget(),d=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,h),e.setRenderTarget(p,d,g),e.xr.enabled=x,i.texture.needsPMREMUpdate=!0}}class _1 extends Jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class x1{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Ge("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}class wv{constructor(e=1,n=0,i=0){this.radius=e,this.phi=n,this.theta=i}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=et(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(et(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const sm=class sm{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};sm.prototype.isMatrix2=!0;let Tv=sm;class y1 extends qr{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function bv(t,e,n,i){const r=S1(i);switch(n){case cy:return t*e;case dy:return t*e/r.components*r.byteLength;case Hp:return t*e/r.components*r.byteLength;case _s:return t*e*2/r.components*r.byteLength;case Vp:return t*e*2/r.components*r.byteLength;case uy:return t*e*3/r.components*r.byteLength;case mi:return t*e*4/r.components*r.byteLength;case Gp:return t*e*4/r.components*r.byteLength;case lc:case cc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case uc:case dc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case nh:case rh:return Math.max(t,16)*Math.max(e,8)/4;case th:case ih:return Math.max(t,8)*Math.max(e,8)/2;case sh:case ah:case lh:case ch:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case oh:case jc:case uh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case dh:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case fh:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case hh:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case ph:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case mh:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case gh:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case vh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case _h:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case xh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case yh:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Sh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Eh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Mh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case wh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Th:case bh:case Ch:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Ah:case Rh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Wc:case Ph:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function S1(t){switch(t){case Bn:case sy:return{byteLength:1,components:1};case Oo:case ay:case Fi:return{byteLength:2,components:1};case Bp:case zp:return{byteLength:2,components:4};case Oi:case kp:case Ri:return{byteLength:4,components:1};case oy:case ly:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fp}}));typeof window<"u"&&(window.__THREE__?Ge("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fp);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function wy(){let t=null,e=!1,n=null,i=null;function r(s,a){i=t.requestAnimationFrame(r),n(s,a)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function E1(t){const e=new WeakMap;function n(o,l){const c=o.array,h=o.usage,p=c.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,c,h),o.onUploadCallback();let g;if(c instanceof Float32Array)g=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)g=t.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?g=t.HALF_FLOAT:g=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)g=t.SHORT;else if(c instanceof Uint32Array)g=t.UNSIGNED_INT;else if(c instanceof Int32Array)g=t.INT;else if(c instanceof Int8Array)g=t.BYTE;else if(c instanceof Uint8Array)g=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)g=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:g,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function i(o,l,c){const h=l.array,p=l.updateRanges;if(t.bindBuffer(c,o),p.length===0)t.bufferSubData(c,0,h);else{p.sort((g,x)=>g.start-x.start);let d=0;for(let g=1;g<p.length;g++){const x=p[d],S=p[g];S.start<=x.start+x.count+1?x.count=Math.max(x.count,S.start+S.count-x.start):(++d,p[d]=S)}p.length=d+1;for(let g=0,x=p.length;g<x;g++){const S=p[g];t.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var M1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,w1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,T1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,b1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,C1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,A1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,R1=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,P1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,N1=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,L1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,D1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,I1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,U1=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,O1=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,F1=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,k1=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,B1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,z1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,H1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,V1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,G1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,j1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,W1=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,X1=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,q1=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,$1=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Y1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,K1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Z1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,J1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Q1="gl_FragColor = linearToOutputTexel( gl_FragColor );",eC=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tC=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nC=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,iC=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,rC=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sC=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,aC=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,oC=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lC=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cC=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,uC=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dC=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,fC=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hC=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pC=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,mC=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,gC=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vC=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_C=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xC=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,yC=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,SC=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,EC=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,MC=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,wC=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,TC=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,bC=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,CC=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,AC=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,RC=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,PC=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,NC=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,LC=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,DC=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,IC=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,UC=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,OC=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,FC=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kC=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,BC=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,zC=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,HC=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,VC=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,GC=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jC=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,WC=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,XC=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,qC=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$C=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,YC=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,KC=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ZC=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,JC=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,QC=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,eA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,tA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,nA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,iA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,rA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,sA=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,aA=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,oA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,lA=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,cA=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,uA=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fA=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,hA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gA=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vA=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_A=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,xA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,yA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,SA=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,EA=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const MA=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wA=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bA=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,AA=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,RA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,PA=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,NA=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,LA=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,DA=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,IA=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,UA=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,OA=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,FA=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,kA=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BA=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zA=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HA=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,VA=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GA=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,jA=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,WA=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XA=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qA=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,$A=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,YA=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,KA=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ZA=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,JA=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,QA=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,eR=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tR=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nR=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:M1,alphahash_pars_fragment:w1,alphamap_fragment:T1,alphamap_pars_fragment:b1,alphatest_fragment:C1,alphatest_pars_fragment:A1,aomap_fragment:R1,aomap_pars_fragment:P1,batching_pars_vertex:N1,batching_vertex:L1,begin_vertex:D1,beginnormal_vertex:I1,bsdfs:U1,iridescence_fragment:O1,bumpmap_pars_fragment:F1,clipping_planes_fragment:k1,clipping_planes_pars_fragment:B1,clipping_planes_pars_vertex:z1,clipping_planes_vertex:H1,color_fragment:V1,color_pars_fragment:G1,color_pars_vertex:j1,color_vertex:W1,common:X1,cube_uv_reflection_fragment:q1,defaultnormal_vertex:$1,displacementmap_pars_vertex:Y1,displacementmap_vertex:K1,emissivemap_fragment:Z1,emissivemap_pars_fragment:J1,colorspace_fragment:Q1,colorspace_pars_fragment:eC,envmap_fragment:tC,envmap_common_pars_fragment:nC,envmap_pars_fragment:iC,envmap_pars_vertex:rC,envmap_physical_pars_fragment:mC,envmap_vertex:sC,fog_vertex:aC,fog_pars_vertex:oC,fog_fragment:lC,fog_pars_fragment:cC,gradientmap_pars_fragment:uC,lightmap_pars_fragment:dC,lights_lambert_fragment:fC,lights_lambert_pars_fragment:hC,lights_pars_begin:pC,lights_toon_fragment:gC,lights_toon_pars_fragment:vC,lights_phong_fragment:_C,lights_phong_pars_fragment:xC,lights_physical_fragment:yC,lights_physical_pars_fragment:SC,lights_fragment_begin:EC,lights_fragment_maps:MC,lights_fragment_end:wC,lightprobes_pars_fragment:TC,logdepthbuf_fragment:bC,logdepthbuf_pars_fragment:CC,logdepthbuf_pars_vertex:AC,logdepthbuf_vertex:RC,map_fragment:PC,map_pars_fragment:NC,map_particle_fragment:LC,map_particle_pars_fragment:DC,metalnessmap_fragment:IC,metalnessmap_pars_fragment:UC,morphinstance_vertex:OC,morphcolor_vertex:FC,morphnormal_vertex:kC,morphtarget_pars_vertex:BC,morphtarget_vertex:zC,normal_fragment_begin:HC,normal_fragment_maps:VC,normal_pars_fragment:GC,normal_pars_vertex:jC,normal_vertex:WC,normalmap_pars_fragment:XC,clearcoat_normal_fragment_begin:qC,clearcoat_normal_fragment_maps:$C,clearcoat_pars_fragment:YC,iridescence_pars_fragment:KC,opaque_fragment:ZC,packing:JC,premultiplied_alpha_fragment:QC,project_vertex:eA,dithering_fragment:tA,dithering_pars_fragment:nA,roughnessmap_fragment:iA,roughnessmap_pars_fragment:rA,shadowmap_pars_fragment:sA,shadowmap_pars_vertex:aA,shadowmap_vertex:oA,shadowmask_pars_fragment:lA,skinbase_vertex:cA,skinning_pars_vertex:uA,skinning_vertex:dA,skinnormal_vertex:fA,specularmap_fragment:hA,specularmap_pars_fragment:pA,tonemapping_fragment:mA,tonemapping_pars_fragment:gA,transmission_fragment:vA,transmission_pars_fragment:_A,uv_pars_fragment:xA,uv_pars_vertex:yA,uv_vertex:SA,worldpos_vertex:EA,background_vert:MA,background_frag:wA,backgroundCube_vert:TA,backgroundCube_frag:bA,cube_vert:CA,cube_frag:AA,depth_vert:RA,depth_frag:PA,distance_vert:NA,distance_frag:LA,equirect_vert:DA,equirect_frag:IA,linedashed_vert:UA,linedashed_frag:OA,meshbasic_vert:FA,meshbasic_frag:kA,meshlambert_vert:BA,meshlambert_frag:zA,meshmatcap_vert:HA,meshmatcap_frag:VA,meshnormal_vert:GA,meshnormal_frag:jA,meshphong_vert:WA,meshphong_frag:XA,meshphysical_vert:qA,meshphysical_frag:$A,meshtoon_vert:YA,meshtoon_frag:KA,points_vert:ZA,points_frag:JA,shadow_vert:QA,shadow_frag:eR,sprite_vert:tR,sprite_frag:nR},ye={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new X},probesMax:{value:new X},probesResolution:{value:new X}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},bi={basic:{uniforms:vn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:vn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:vn([ye.common,ye.specularmap,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,ye.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:vn([ye.common,ye.envmap,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.roughnessmap,ye.metalnessmap,ye.fog,ye.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:vn([ye.common,ye.aomap,ye.lightmap,ye.emissivemap,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.gradientmap,ye.fog,ye.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:vn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,ye.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:vn([ye.points,ye.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:vn([ye.common,ye.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:vn([ye.common,ye.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:vn([ye.common,ye.bumpmap,ye.normalmap,ye.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:vn([ye.sprite,ye.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:vn([ye.common,ye.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:vn([ye.lights,ye.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};bi.physical={uniforms:vn([bi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Bl={r:0,b:0,g:0},iR=new It,Ty=new je;Ty.set(-1,0,0,0,1,0,0,0,1);function rR(t,e,n,i,r,s){const a=new Ke(0);let o=r===!0?0:1,l,c,h=null,p=0,d=null;function g(_){let M=_.isScene===!0?_.background:null;if(M&&M.isTexture){const v=_.backgroundBlurriness>0;M=e.get(M,v)}return M}function x(_){let M=!1;const v=g(_);v===null?m(a,o):v&&v.isColor&&(m(v,1),M=!0);const w=t.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function S(_,M){const v=g(M);v&&(v.isCubeTexture||v.mapping===yu)?(c===void 0&&(c=new dn(new Qi(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:ya(bi.backgroundCube.uniforms),vertexShader:bi.backgroundCube.vertexShader,fragmentShader:bi.backgroundCube.fragmentShader,side:Ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(iR.makeRotationFromEuler(M.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Ty),c.material.toneMapped=rt.getTransfer(v.colorSpace)!==ft,(h!==v||p!==v.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,h=v,p=v.version,d=t.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new dn(new Su(2,2),new ki({name:"BackgroundMaterial",uniforms:ya(bi.background.uniforms),vertexShader:bi.background.vertexShader,fragmentShader:bi.background.fragmentShader,side:gs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=rt.getTransfer(v.colorSpace)!==ft,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||p!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,h=v,p=v.version,d=t.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function m(_,M){_.getRGB(Bl,Sy(t)),n.buffers.color.setClear(Bl.r,Bl.g,Bl.b,M,s)}function f(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(_,M=1){a.set(_),o=M,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(_){o=_,m(a,o)},render:x,addToRenderList:S,dispose:f}}function sR(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(D,B,F,I,k){let G=!1;const U=p(D,I,F,B);s!==U&&(s=U,c(s.object)),G=g(D,I,F,k),G&&x(D,I,F,k),k!==null&&e.update(k,t.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,v(D,B,F,I),k!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return t.createVertexArray()}function c(D){return t.bindVertexArray(D)}function h(D){return t.deleteVertexArray(D)}function p(D,B,F,I){const k=I.wireframe===!0;let G=i[B.id];G===void 0&&(G={},i[B.id]=G);const U=D.isInstancedMesh===!0?D.id:0;let O=G[U];O===void 0&&(O={},G[U]=O);let L=O[F.id];L===void 0&&(L={},O[F.id]=L);let q=L[k];return q===void 0&&(q=d(l()),L[k]=q),q}function d(D){const B=[],F=[],I=[];for(let k=0;k<n;k++)B[k]=0,F[k]=0,I[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:F,attributeDivisors:I,object:D,attributes:{},index:null}}function g(D,B,F,I){const k=s.attributes,G=B.attributes;let U=0;const O=F.getAttributes();for(const L in O)if(O[L].location>=0){const Z=k[L];let ce=G[L];if(ce===void 0&&(L==="instanceMatrix"&&D.instanceMatrix&&(ce=D.instanceMatrix),L==="instanceColor"&&D.instanceColor&&(ce=D.instanceColor)),Z===void 0||Z.attribute!==ce||ce&&Z.data!==ce.data)return!0;U++}return s.attributesNum!==U||s.index!==I}function x(D,B,F,I){const k={},G=B.attributes;let U=0;const O=F.getAttributes();for(const L in O)if(O[L].location>=0){let Z=G[L];Z===void 0&&(L==="instanceMatrix"&&D.instanceMatrix&&(Z=D.instanceMatrix),L==="instanceColor"&&D.instanceColor&&(Z=D.instanceColor));const ce={};ce.attribute=Z,Z&&Z.data&&(ce.data=Z.data),k[L]=ce,U++}s.attributes=k,s.attributesNum=U,s.index=I}function S(){const D=s.newAttributes;for(let B=0,F=D.length;B<F;B++)D[B]=0}function m(D){f(D,0)}function f(D,B){const F=s.newAttributes,I=s.enabledAttributes,k=s.attributeDivisors;F[D]=1,I[D]===0&&(t.enableVertexAttribArray(D),I[D]=1),k[D]!==B&&(t.vertexAttribDivisor(D,B),k[D]=B)}function _(){const D=s.newAttributes,B=s.enabledAttributes;for(let F=0,I=B.length;F<I;F++)B[F]!==D[F]&&(t.disableVertexAttribArray(F),B[F]=0)}function M(D,B,F,I,k,G,U){U===!0?t.vertexAttribIPointer(D,B,F,k,G):t.vertexAttribPointer(D,B,F,I,k,G)}function v(D,B,F,I){S();const k=I.attributes,G=F.getAttributes(),U=B.defaultAttributeValues;for(const O in G){const L=G[O];if(L.location>=0){let q=k[O];if(q===void 0&&(O==="instanceMatrix"&&D.instanceMatrix&&(q=D.instanceMatrix),O==="instanceColor"&&D.instanceColor&&(q=D.instanceColor)),q!==void 0){const Z=q.normalized,ce=q.itemSize,_e=e.get(q);if(_e===void 0)continue;const se=_e.buffer,Me=_e.type,de=_e.bytesPerElement,j=Me===t.INT||Me===t.UNSIGNED_INT||q.gpuType===kp;if(q.isInterleavedBufferAttribute){const J=q.data,le=J.stride,Ue=q.offset;if(J.isInstancedInterleavedBuffer){for(let he=0;he<L.locationSize;he++)f(L.location+he,J.meshPerAttribute);D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let he=0;he<L.locationSize;he++)m(L.location+he);t.bindBuffer(t.ARRAY_BUFFER,se);for(let he=0;he<L.locationSize;he++)M(L.location+he,ce/L.locationSize,Me,Z,le*de,(Ue+ce/L.locationSize*he)*de,j)}else{if(q.isInstancedBufferAttribute){for(let J=0;J<L.locationSize;J++)f(L.location+J,q.meshPerAttribute);D.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let J=0;J<L.locationSize;J++)m(L.location+J);t.bindBuffer(t.ARRAY_BUFFER,se);for(let J=0;J<L.locationSize;J++)M(L.location+J,ce/L.locationSize,Me,Z,ce*de,ce/L.locationSize*J*de,j)}}else if(U!==void 0){const Z=U[O];if(Z!==void 0)switch(Z.length){case 2:t.vertexAttrib2fv(L.location,Z);break;case 3:t.vertexAttrib3fv(L.location,Z);break;case 4:t.vertexAttrib4fv(L.location,Z);break;default:t.vertexAttrib1fv(L.location,Z)}}}}_()}function w(){C();for(const D in i){const B=i[D];for(const F in B){const I=B[F];for(const k in I){const G=I[k];for(const U in G)h(G[U].object),delete G[U];delete I[k]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const B=i[D.id];for(const F in B){const I=B[F];for(const k in I){const G=I[k];for(const U in G)h(G[U].object),delete G[U];delete I[k]}}delete i[D.id]}function A(D){for(const B in i){const F=i[B];for(const I in F){const k=F[I];if(k[D.id]===void 0)continue;const G=k[D.id];for(const U in G)h(G[U].object),delete G[U];delete k[D.id]}}}function y(D){for(const B in i){const F=i[B],I=D.isInstancedMesh===!0?D.id:0,k=F[I];if(k!==void 0){for(const G in k){const U=k[G];for(const O in U)h(U[O].object),delete U[O];delete k[G]}delete F[I],Object.keys(F).length===0&&delete i[B]}}}function C(){N(),a=!0,s!==r&&(s=r,c(s.object))}function N(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:C,resetDefaultState:N,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:A,initAttributes:S,enableAttribute:m,disableUnusedAttributes:_}}function aR(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function a(l,c,h){h!==0&&(t.drawArraysInstanced(i,l,c,h),n.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let g=0;g<h;g++)d+=c[g];n.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function oR(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==mi&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const y=A===Fi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Bn&&A!==Ri&&!y&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const h=l(c);h!==c&&(Ge("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const p=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&Ge("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const g=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),f=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),M=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),w=t.getParameter(t.MAX_SAMPLES),T=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:p,reversedDepthBuffer:d,maxTextures:g,maxVertexTextures:x,maxTextureSize:S,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:_,maxVaryings:M,maxFragmentUniforms:v,maxSamples:w,samples:T}}function lR(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Yi,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,d){const g=p.length!==0||d||i!==0||r;return r=d,i=p.length,g},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(p,d){n=h(p,d,0)},this.setState=function(p,d,g){const x=p.clippingPlanes,S=p.clipIntersection,m=p.clipShadows,f=t.get(p);if(!r||x===null||x.length===0||s&&!m)s?h(null):c();else{const _=s?0:i,M=_*4;let v=f.clippingState||null;l.value=v,v=h(x,d,M,g);for(let w=0;w!==M;++w)v[w]=n[w];f.clippingState=v,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(p,d,g,x){const S=p!==null?p.length:0;let m=null;if(S!==0){if(m=l.value,x!==!0||m===null){const f=g+S*4,_=d.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,v=g;M!==S;++M,v+=4)a.copy(p[M]).applyMatrix4(_,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,m}}const ea=4,cR=6,uR=20,dR=256,Ga=new Qp,Cv=new Ke;let Dd=null,Id=0,Ud=0,Od=!1;const fR=new X,Qr=new X;class Av{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:a=256,position:o=fR}=s;Dd=this._renderer.getRenderTarget(),Id=this._renderer.getActiveCubeFace(),Ud=this._renderer.getActiveMipmapLevel(),Od=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nv(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pv(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Dd,Id,Ud),this._renderer.xr.enabled=Od,e.scissorTest=!1,ks(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===vs||e.mapping===xa?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Dd=this._renderer.getRenderTarget(),Id=this._renderer.getActiveCubeFace(),Ud=this._renderer.getActiveMipmapLevel(),Od=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:hn,minFilter:hn,generateMipmaps:!1,type:Fi,format:mi,colorSpace:Xc,depthBuffer:!1},r=Rv(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Rv(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=hR(s)),this._blurMaterial=mR(s,e,n),this._ggxMaterial=pR(s,e,n)}return r}_compileMaterial(e){const n=new dn(new Dn,e);this._renderer.compile(n,Ga)}_sceneToCubeUV(e,n,i,r,s){const l=new Jn(90,1,n,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],p=this._renderer,d=p.autoClear,g=p.toneMapping;p.getClearColor(Cv),p.toneMapping=Ii,p.autoClear=!1,p.state.buffers.depth.getReversed()&&(p.setRenderTarget(r),p.clearDepth(),p.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new dn(new Qi,new $p({name:"PMREM.Background",side:Ln,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,m=S.material;let f=!1;const _=e.background;_?_.isColor&&(m.color.copy(_),e.background=null,f=!0):(m.color.copy(Cv),f=!0);for(let M=0;M<6;M++){const v=M%3;v===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[M],s.y,s.z)):v===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[M]));const w=this._cubeSize;ks(r,v*w,M>2?w:0,w,w),p.setRenderTarget(r),f&&p.render(S,l),p.render(e,l)}p.toneMapping=g,p.autoClear=d,e.background=_}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===vs||e.mapping===xa;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nv()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pv());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;ks(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Ga)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=n/(this._lodMeshes.length-1),p=Math.sqrt(c*c-h*h),d=c*1.25,g=p*d,{_lodMax:x}=this,S=this._sizeLods[i],m=3*S*(i>x-ea?i-x+ea:0),f=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=g,l.mipInt.value=x-n,ks(s,m,f,3*S,2*S),r.setRenderTarget(s),r.render(o,Ga),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=x-i,ks(e,m,f,3*S,2*S),r.setRenderTarget(e),r.render(o,Ga)}_blur(e,n,i,r){const s=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,a),this._blurPass(s,e,i,i,a)}_blurPass(e,n,i,r,s){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[r];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[r],p=3*h*(r>this._lodMax-ea?r-this._lodMax+ea:0),d=4*(this._cubeSize-h);ks(n,p,d,3*h,2*h),a.setRenderTarget(n),a.render(l,Ga)}}function hR(t){const e=[],n=[];let i=t;const r=t-ea+1+cR;for(let s=0;s<r;s++){const a=Math.pow(2,i);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],p=6,d=6,g=3,x=new Float32Array(g*d*p),S=new Float32Array(g*d*p);for(let f=0;f<p;f++){const _=f%3*2/3-1,M=f>2?0:-1,v=[_,M,0,_+2/3,M,0,_+2/3,M+1,0,_,M,0,_+2/3,M+1,0,_,M+1,0];x.set(v,g*d*f);for(let w=0;w<d;w++){const T=h[w*2]*2-1,A=h[w*2+1]*2-1;f===0?Qr.set(1,A,T):f===1?Qr.set(-T,1,-A):f===2?Qr.set(-T,A,1):f===3?Qr.set(-1,A,-T):f===4?Qr.set(-T,-1,A):Qr.set(T,A,-1),Qr.toArray(S,(f*d+w)*g)}}const m=new Dn;m.setAttribute("position",new ir(x,g)),m.setAttribute("outputDirection",new ir(S,g)),n.push(new dn(m,null)),i>ea&&i--}return{lodMeshes:n,sizeLods:e}}function Rv(t,e,n){const i=new _i(t,e,n);return i.texture.mapping=yu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ks(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function pR(t,e,n){return new ki({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:dR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Eu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function mR(t,e,n){return new ki({name:"SphericalGaussianBlur",defines:{SAMPLES:uR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Eu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function Pv(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Eu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function Nv(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Eu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function Eu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class by extends _i{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new xy(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Qi(5,5,5),s=new ki({name:"CubemapFromEquirect",uniforms:ya(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ln,blending:tr});s.uniforms.tEquirect.value=n;const a=new dn(r,s),o=n.minFilter;return n.minFilter===os&&(n.minFilter=hn),new v1(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}function gR(t){let e=new WeakMap,n=new WeakMap,i=null;function r(d,g=!1){return d==null?null:g?a(d):s(d)}function s(d){if(d&&d.isTexture){const g=d.mapping;if(g===ad||g===od)if(e.has(d)){const x=e.get(d).texture;return o(x,d.mapping)}else{const x=d.image;if(x&&x.height>0){const S=new by(x.height);return S.fromEquirectangularTexture(t,d),e.set(d,S),d.addEventListener("dispose",c),o(S.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const g=d.mapping,x=g===ad||g===od,S=g===vs||g===xa;if(x||S){let m=n.get(d);const f=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==f)return i===null&&(i=new Av(t)),m=x?i.fromEquirectangular(d,m):i.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),m.texture;if(m!==void 0)return m.texture;{const _=d.image;return x&&_&&_.height>0||S&&_&&l(_)?(i===null&&(i=new Av(t)),m=x?i.fromEquirectangular(d):i.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,n.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,g){return g===ad?d.mapping=vs:g===od&&(d.mapping=xa),d}function l(d){let g=0;const x=6;for(let S=0;S<x;S++)d[S]!==void 0&&g++;return g===x}function c(d){const g=d.target;g.removeEventListener("dispose",c);const x=e.get(g);x!==void 0&&(e.delete(g),x.dispose())}function h(d){const g=d.target;g.removeEventListener("dispose",h);const x=n.get(g);x!==void 0&&(n.delete(g),x.dispose())}function p(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:p}}function vR(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&ca("WebGLRenderer: "+i+" extension not supported."),r}}}function _R(t,e,n,i){const r={},s=new WeakMap;function a(p){const d=p.target;d.index!==null&&e.remove(d.index);for(const x in d.attributes)e.remove(d.attributes[x]);d.removeEventListener("dispose",a),delete r[d.id];const g=s.get(d);g&&(e.remove(g),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function o(p,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,n.memory.geometries++),d}function l(p){const d=p.attributes;for(const g in d)e.update(d[g],t.ARRAY_BUFFER)}function c(p){const d=[],g=p.index,x=p.attributes.position;let S=0;if(x===void 0)return;if(g!==null){const _=g.array;S=g.version;for(let M=0,v=_.length;M<v;M+=3){const w=_[M+0],T=_[M+1],A=_[M+2];d.push(w,T,T,A,A,w)}}else{const _=x.array;S=x.version;for(let M=0,v=_.length/3-1;M<v;M+=3){const w=M+0,T=M+1,A=M+2;d.push(w,T,T,A,A,w)}}const m=new(x.count>=65535?vy:gy)(d,1);m.version=S;const f=s.get(p);f&&e.remove(f),s.set(p,m)}function h(p){const d=s.get(p);if(d){const g=p.index;g!==null&&d.version<g.version&&c(p)}else c(p);return s.get(p)}return{get:o,update:l,getWireframeAttribute:h}}function xR(t,e,n){let i;function r(p){i=p}let s,a;function o(p){s=p.type,a=p.bytesPerElement}function l(p,d){t.drawElements(i,d,s,p*a),n.update(d,i,1)}function c(p,d,g){g!==0&&(t.drawElementsInstanced(i,d,s,p*a,g),n.update(d,i,g))}function h(p,d,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,p,0,g);let S=0;for(let m=0;m<g;m++)S+=d[m];n.update(S,i,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function yR(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:lt("WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function SR(t,e,n){const i=new WeakMap,r=new Rt;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==p){let N=function(){y.dispose(),i.delete(o),o.removeEventListener("dispose",N)};var g=N;d!==void 0&&d.texture.dispose();const x=o.morphAttributes.position!==void 0,S=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let v=0;x===!0&&(v=1),S===!0&&(v=2),m===!0&&(v=3);let w=o.attributes.position.count*v,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const A=new Float32Array(w*T*4*p),y=new hy(A,w,T,p);y.type=Ri,y.needsUpdate=!0;const C=v*4;for(let D=0;D<p;D++){const B=f[D],F=_[D],I=M[D],k=w*T*4*D;for(let G=0;G<B.count;G++){const U=G*C;x===!0&&(r.fromBufferAttribute(B,G),A[k+U+0]=r.x,A[k+U+1]=r.y,A[k+U+2]=r.z,A[k+U+3]=0),S===!0&&(r.fromBufferAttribute(F,G),A[k+U+4]=r.x,A[k+U+5]=r.y,A[k+U+6]=r.z,A[k+U+7]=0),m===!0&&(r.fromBufferAttribute(I,G),A[k+U+8]=r.x,A[k+U+9]=r.y,A[k+U+10]=r.z,A[k+U+11]=I.itemSize===4?r.w:1)}}d={count:p,texture:y,size:new He(w,T)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let x=0;for(let m=0;m<c.length;m++)x+=c[m];const S=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(t,"morphTargetBaseInfluence",S),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function ER(t,e,n,i,r){let s=new WeakMap;function a(c){const h=r.render.frame,p=c.geometry,d=e.get(c,p);if(s.get(d)!==h&&(e.update(d),s.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const g=c.skeleton;s.get(g)!==h&&(g.update(),s.set(g,h))}return d}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null&&n.remove(h.instanceColor)}return{update:a,dispose:o}}const MR={[Zx]:"LINEAR_TONE_MAPPING",[Jx]:"REINHARD_TONE_MAPPING",[Qx]:"CINEON_TONE_MAPPING",[ey]:"ACES_FILMIC_TONE_MAPPING",[ny]:"AGX_TONE_MAPPING",[iy]:"NEUTRAL_TONE_MAPPING",[ty]:"CUSTOM_TONE_MAPPING"};function wR(t,e,n,i,r,s){const a=new _i(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Dn;c.setAttribute("position",new Tt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Tt([0,2,0,0,2,0],2));const h=new o1({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),p=new dn(c,h),d=new Qp(-1,1,1,-1,0,1);let g=null,x=null,S=!1,m,f=null,_=[],M=!1;this.setSize=function(v,w){a.setSize(v,w),o!==null&&o.setSize(v,w),l!==null&&l.setSize(v,w);for(let T=0;T<_.length;T++){const A=_[T];A.setSize&&A.setSize(v,w)}},this.setEffects=function(v){_=v,M=_.length>0&&_[0].isRenderPass===!0;const w=a.width,T=a.height;_.length>0&&o===null&&(o=new _i(w,T,{type:Fi,depthBuffer:!1,stencilBuffer:!1}),l=new _i(w,T,{type:Fi,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<_.length;A++){const y=_[A];y.setSize&&y.setSize(w,T)}},this.begin=function(v,w){if(S||v.toneMapping===Ii&&_.length===0)return!1;if(f=w,w!==null){const T=w.width,A=w.height;(a.width!==T||a.height!==A)&&this.setSize(T,A)}return M===!1&&v.setRenderTarget(a),m=v.toneMapping,v.toneMapping=Ii,!0},this.hasRenderPass=function(){return M},this.end=function(v,w){v.toneMapping=m,S=!0;let T=a,A=o;for(let y=0;y<_.length;y++){const C=_[y];C.enabled!==!1&&(C.render(v,A,T,w),C.needsSwap!==!1&&(T=A,A=A===o?l:o))}if(g!==v.outputColorSpace||x!==v.toneMapping){g=v.outputColorSpace,x=v.toneMapping,h.defines={},rt.getTransfer(g)===ft&&(h.defines.SRGB_TRANSFER="");const y=MR[x];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,v.setRenderTarget(f),v.render(p,d),f=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const Cy=new pn,Dh=new zo(1,1),Ay=new hy,Ry=new kb,Py=new xy,Lv=[],Dv=[],Iv=new Float32Array(16),Uv=new Float32Array(9),Ov=new Float32Array(4);function Ca(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Lv[r];if(s===void 0&&(s=new Float32Array(r),Lv[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Yt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Kt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Mu(t,e){let n=Dv[e];n===void 0&&(n=new Int32Array(e),Dv[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function TR(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function bR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Yt(n,e))return;t.uniform2fv(this.addr,e),Kt(n,e)}}function CR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Yt(n,e))return;t.uniform3fv(this.addr,e),Kt(n,e)}}function AR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Yt(n,e))return;t.uniform4fv(this.addr,e),Kt(n,e)}}function RR(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Yt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Kt(n,e)}else{if(Yt(n,i))return;Ov.set(i),t.uniformMatrix2fv(this.addr,!1,Ov),Kt(n,i)}}function PR(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Yt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Kt(n,e)}else{if(Yt(n,i))return;Uv.set(i),t.uniformMatrix3fv(this.addr,!1,Uv),Kt(n,i)}}function NR(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Yt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Kt(n,e)}else{if(Yt(n,i))return;Iv.set(i),t.uniformMatrix4fv(this.addr,!1,Iv),Kt(n,i)}}function LR(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function DR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Yt(n,e))return;t.uniform2iv(this.addr,e),Kt(n,e)}}function IR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Yt(n,e))return;t.uniform3iv(this.addr,e),Kt(n,e)}}function UR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Yt(n,e))return;t.uniform4iv(this.addr,e),Kt(n,e)}}function OR(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function FR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Yt(n,e))return;t.uniform2uiv(this.addr,e),Kt(n,e)}}function kR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Yt(n,e))return;t.uniform3uiv(this.addr,e),Kt(n,e)}}function BR(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Yt(n,e))return;t.uniform4uiv(this.addr,e),Kt(n,e)}}function zR(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Dh.compareFunction=n.isReversedDepthBuffer()?Wp:jp,s=Dh):s=Cy,n.setTexture2D(e||s,r)}function HR(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Ry,r)}function VR(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Py,r)}function GR(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Ay,r)}function jR(t){switch(t){case 5126:return TR;case 35664:return bR;case 35665:return CR;case 35666:return AR;case 35674:return RR;case 35675:return PR;case 35676:return NR;case 5124:case 35670:return LR;case 35667:case 35671:return DR;case 35668:case 35672:return IR;case 35669:case 35673:return UR;case 5125:return OR;case 36294:return FR;case 36295:return kR;case 36296:return BR;case 35678:case 36198:case 36298:case 36306:case 35682:return zR;case 35679:case 36299:case 36307:return HR;case 35680:case 36300:case 36308:case 36293:return VR;case 36289:case 36303:case 36311:case 36292:return GR}}function WR(t,e){t.uniform1fv(this.addr,e)}function XR(t,e){const n=Ca(e,this.size,2);t.uniform2fv(this.addr,n)}function qR(t,e){const n=Ca(e,this.size,3);t.uniform3fv(this.addr,n)}function $R(t,e){const n=Ca(e,this.size,4);t.uniform4fv(this.addr,n)}function YR(t,e){const n=Ca(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function KR(t,e){const n=Ca(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function ZR(t,e){const n=Ca(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function JR(t,e){t.uniform1iv(this.addr,e)}function QR(t,e){t.uniform2iv(this.addr,e)}function eP(t,e){t.uniform3iv(this.addr,e)}function tP(t,e){t.uniform4iv(this.addr,e)}function nP(t,e){t.uniform1uiv(this.addr,e)}function iP(t,e){t.uniform2uiv(this.addr,e)}function rP(t,e){t.uniform3uiv(this.addr,e)}function sP(t,e){t.uniform4uiv(this.addr,e)}function aP(t,e,n){const i=this.cache,r=e.length,s=Mu(n,r);Yt(i,s)||(t.uniform1iv(this.addr,s),Kt(i,s));let a;this.type===t.SAMPLER_2D_SHADOW?a=Dh:a=Cy;for(let o=0;o!==r;++o)n.setTexture2D(e[o]||a,s[o])}function oP(t,e,n){const i=this.cache,r=e.length,s=Mu(n,r);Yt(i,s)||(t.uniform1iv(this.addr,s),Kt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||Ry,s[a])}function lP(t,e,n){const i=this.cache,r=e.length,s=Mu(n,r);Yt(i,s)||(t.uniform1iv(this.addr,s),Kt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||Py,s[a])}function cP(t,e,n){const i=this.cache,r=e.length,s=Mu(n,r);Yt(i,s)||(t.uniform1iv(this.addr,s),Kt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||Ay,s[a])}function uP(t){switch(t){case 5126:return WR;case 35664:return XR;case 35665:return qR;case 35666:return $R;case 35674:return YR;case 35675:return KR;case 35676:return ZR;case 5124:case 35670:return JR;case 35667:case 35671:return QR;case 35668:case 35672:return eP;case 35669:case 35673:return tP;case 5125:return nP;case 36294:return iP;case 36295:return rP;case 36296:return sP;case 35678:case 36198:case 36298:case 36306:case 35682:return aP;case 35679:case 36299:case 36307:return oP;case 35680:case 36300:case 36308:case 36293:return lP;case 36289:case 36303:case 36311:case 36292:return cP}}class dP{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=jR(n.type)}}class fP{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=uP(n.type)}}class hP{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Fd=/(\w+)(\])?(\[|\.)?/g;function Fv(t,e){t.seq.push(e),t.map[e.id]=e}function pP(t,e,n){const i=t.name,r=i.length;for(Fd.lastIndex=0;;){const s=Fd.exec(i),a=Fd.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Fv(n,c===void 0?new dP(o,t,e):new fP(o,t,e));break}else{let p=n.map[o];p===void 0&&(p=new hP(o),Fv(n,p)),n=p}}}class hc{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),l=e.getUniformLocation(n,o.name);pP(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function kv(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const mP=37297;let gP=0;function vP(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Bv=new je;function _P(t){rt._getMatrix(Bv,rt.workingColorSpace,t);const e=`mat3( ${Bv.elements.map(n=>n.toFixed(4))} )`;switch(rt.getTransfer(t)){case qc:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return Ge("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function zv(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+vP(t.getShaderSource(e),o)}else return s}function xP(t,e){const n=_P(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const yP={[Zx]:"Linear",[Jx]:"Reinhard",[Qx]:"Cineon",[ey]:"ACESFilmic",[ny]:"AgX",[iy]:"Neutral",[ty]:"Custom"};function SP(t,e){const n=yP[e];return n===void 0?(Ge("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const zl=new X;function EP(){rt.getLuminanceCoefficients(zl);const t=zl.x.toFixed(4),e=zl.y.toFixed(4),n=zl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function MP(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(to).join(`
`)}function wP(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function TP(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function to(t){return t!==""}function Hv(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Vv(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const bP=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ih(t){return t.replace(bP,AP)}const CP=new Map;function AP(t,e){let n=Ye[e];if(n===void 0){const i=CP.get(e);if(i!==void 0)n=Ye[i],Ge('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Ih(n)}const RP=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gv(t){return t.replace(RP,PP)}function PP(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function jv(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const NP={[oc]:"SHADOWMAP_TYPE_PCF",[Qa]:"SHADOWMAP_TYPE_VSM"};function LP(t){return NP[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const DP={[vs]:"ENVMAP_TYPE_CUBE",[xa]:"ENVMAP_TYPE_CUBE",[yu]:"ENVMAP_TYPE_CUBE_UV"};function IP(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":DP[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const UP={[xa]:"ENVMAP_MODE_REFRACTION"};function OP(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":UP[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const FP={[Kx]:"ENVMAP_BLENDING_MULTIPLY",[pb]:"ENVMAP_BLENDING_MIX",[mb]:"ENVMAP_BLENDING_ADD"};function kP(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":FP[t.combine]||"ENVMAP_BLENDING_NONE"}function BP(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function zP(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=LP(n),c=IP(n),h=OP(n),p=kP(n),d=BP(n),g=MP(n),x=wP(s),S=r.createProgram();let m,f,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(to).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x].filter(to).join(`
`),f.length>0&&(f+=`
`)):(m=[jv(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(to).join(`
`),f=[jv(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,x,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+h:"",n.envMap?"#define "+p:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ii?"#define TONE_MAPPING":"",n.toneMapping!==Ii?Ye.tonemapping_pars_fragment:"",n.toneMapping!==Ii?SP("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,xP("linearToOutputTexel",n.outputColorSpace),EP(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(to).join(`
`)),a=Ih(a),a=Hv(a,n),a=Vv(a,n),o=Ih(o),o=Hv(o,n),o=Vv(o,n),a=Gv(a),o=Gv(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",n.glslVersion===ev?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===ev?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=_+m+a,v=_+f+o,w=kv(r,r.VERTEX_SHADER,M),T=kv(r,r.FRAGMENT_SHADER,v);r.attachShader(S,w),r.attachShader(S,T),n.index0AttributeName!==void 0?r.bindAttribLocation(S,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function A(D){if(t.debug.checkShaderErrors){const B=r.getProgramInfoLog(S)||"",F=r.getShaderInfoLog(w)||"",I=r.getShaderInfoLog(T)||"",k=B.trim(),G=F.trim(),U=I.trim();let O=!0,L=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(O=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,S,w,T);else{const q=zv(r,w,"vertex"),Z=zv(r,T,"fragment");lt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+k+`
`+q+`
`+Z)}else k!==""?Ge("WebGLProgram: Program Info Log:",k):(G===""||U==="")&&(L=!1);L&&(D.diagnostics={runnable:O,programLog:k,vertexShader:{log:G,prefix:m},fragmentShader:{log:U,prefix:f}})}r.deleteShader(w),r.deleteShader(T),y=new hc(r,S),C=TP(r,S)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let C;this.getAttributes=function(){return C===void 0&&A(this),C};let N=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=r.getProgramParameter(S,mP)),N},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=gP++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=w,this.fragmentShader=T,this}let HP=0;class VP{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){const r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new GP(e),n.set(e,i)),i}}class GP{constructor(e){this.id=HP++,this.code=e,this.usedTimes=0}}function jP(t){return t===_s||t===jc||t===Wc}function WP(t,e,n,i,r,s){const a=new py,o=new VP,l=new Set,c=[],h=new Map,p=i.logarithmicDepthBuffer;let d=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(y){return l.add(y),y===0?"uv":`uv${y}`}function S(y,C,N,D,B,F){const I=D.fog,k=B.geometry,G=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,U=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,O=e.get(y.envMap||G,U),L=O&&O.mapping===yu?O.image.height:null,q=g[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&Ge("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const Z=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,ce=Z!==void 0?Z.length:0;let _e=0;k.morphAttributes.position!==void 0&&(_e=1),k.morphAttributes.normal!==void 0&&(_e=2),k.morphAttributes.color!==void 0&&(_e=3);let se,Me,de,j;if(q){const vt=bi[q];se=vt.vertexShader,Me=vt.fragmentShader}else{se=y.vertexShader,Me=y.fragmentShader;const vt=o.getVertexShaderStage(y),ct=o.getFragmentShaderStage(y);o.update(y,vt,ct),de=vt.id,j=ct.id}const J=t.getRenderTarget(),le=t.state.buffers.depth.getReversed(),Ue=B.isInstancedMesh===!0,he=B.isBatchedMesh===!0,Ve=!!y.map,bt=!!y.matcap,Ze=!!O,nt=!!y.aoMap,dt=!!y.lightMap,ee=!!y.bumpMap&&y.wireframe===!1,Ae=!!y.normalMap,qe=!!y.displacementMap,We=!!y.emissiveMap,Je=!!y.metalnessMap,Fe=!!y.roughnessMap,H=y.anisotropy>0,ze=y.clearcoat>0,ke=y.dispersion>0,R=y.retroreflectivity>0,E=y.iridescence>0,W=y.sheen>0,$=y.transmission>0,te=H&&!!y.anisotropyMap,ue=ze&&!!y.clearcoatMap,fe=ze&&!!y.clearcoatNormalMap,ne=ze&&!!y.clearcoatRoughnessMap,re=E&&!!y.iridescenceMap,pe=E&&!!y.iridescenceThicknessMap,De=W&&!!y.sheenColorMap,xe=W&&!!y.sheenRoughnessMap,me=!!y.specularMap,Ie=!!y.specularColorMap,Be=!!y.specularIntensityMap,Xe=$&&!!y.transmissionMap,V=$&&!!y.thicknessMap,ge=!!y.gradientMap,ie=!!y.alphaMap,ve=y.alphaTest>0,we=!!y.alphaHash,ae=!!y.extensions;let Oe=Ii;y.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(Oe=t.toneMapping);const Ne={shaderID:q,shaderType:y.type,shaderName:y.name,vertexShader:se,fragmentShader:Me,defines:y.defines,customVertexShaderID:de,customFragmentShaderID:j,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:he,batchingColor:he&&B._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&B.instanceColor!==null,instancingMorph:Ue&&B.morphTexture!==null,outputColorSpace:J===null?t.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Ve,matcap:bt,envMap:Ze,envMapMode:Ze&&O.mapping,envMapCubeUVHeight:L,aoMap:nt,lightMap:dt,bumpMap:ee,normalMap:Ae,displacementMap:qe,emissiveMap:We,normalMapObjectSpace:Ae&&y.normalMapType===_b,normalMapTangentSpace:Ae&&y.normalMapType===Nh,packedNormalMap:Ae&&y.normalMapType===Nh&&jP(y.normalMap.format),metalnessMap:Je,roughnessMap:Fe,anisotropy:H,anisotropyMap:te,clearcoat:ze,clearcoatMap:ue,clearcoatNormalMap:fe,clearcoatRoughnessMap:ne,dispersion:ke,retroreflection:R,iridescence:E,iridescenceMap:re,iridescenceThicknessMap:pe,sheen:W,sheenColorMap:De,sheenRoughnessMap:xe,specularMap:me,specularColorMap:Ie,specularIntensityMap:Be,transmission:$,transmissionMap:Xe,thicknessMap:V,gradientMap:ge,opaque:y.transparent===!1&&y.blending===fo&&y.alphaToCoverage===!1,alphaMap:ie,alphaTest:ve,alphaHash:we,combine:y.combine,mapUv:Ve&&x(y.map.channel),aoMapUv:nt&&x(y.aoMap.channel),lightMapUv:dt&&x(y.lightMap.channel),bumpMapUv:ee&&x(y.bumpMap.channel),normalMapUv:Ae&&x(y.normalMap.channel),displacementMapUv:qe&&x(y.displacementMap.channel),emissiveMapUv:We&&x(y.emissiveMap.channel),metalnessMapUv:Je&&x(y.metalnessMap.channel),roughnessMapUv:Fe&&x(y.roughnessMap.channel),anisotropyMapUv:te&&x(y.anisotropyMap.channel),clearcoatMapUv:ue&&x(y.clearcoatMap.channel),clearcoatNormalMapUv:fe&&x(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&x(y.clearcoatRoughnessMap.channel),iridescenceMapUv:re&&x(y.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&x(y.iridescenceThicknessMap.channel),sheenColorMapUv:De&&x(y.sheenColorMap.channel),sheenRoughnessMapUv:xe&&x(y.sheenRoughnessMap.channel),specularMapUv:me&&x(y.specularMap.channel),specularColorMapUv:Ie&&x(y.specularColorMap.channel),specularIntensityMapUv:Be&&x(y.specularIntensityMap.channel),transmissionMapUv:Xe&&x(y.transmissionMap.channel),thicknessMapUv:V&&x(y.thicknessMap.channel),alphaMapUv:ie&&x(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Ae||H),vertexNormals:!!k.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(Ve||ie),fog:!!I,useFog:y.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||k.attributes.normal===void 0&&Ae===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:le,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:_e,numSunLights:C.sun.length,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numSunLightShadows:C.sunShadowMap.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:F.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:Oe,decodeVideoTexture:Ve&&y.map.isVideoTexture===!0&&rt.getTransfer(y.map.colorSpace)===ft,decodeVideoTextureEmissive:We&&y.emissiveMap.isVideoTexture===!0&&rt.getTransfer(y.emissiveMap.colorSpace)===ft,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Ai,flipSided:y.side===Ln,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ae&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ae&&y.extensions.multiDraw===!0||he)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ne.vertexUv1s=l.has(1),Ne.vertexUv2s=l.has(2),Ne.vertexUv3s=l.has(3),l.clear(),Ne}function m(y){const C=[];if(y.shaderID?C.push(y.shaderID):(C.push(y.customVertexShaderID),C.push(y.customFragmentShaderID)),y.defines!==void 0)for(const N in y.defines)C.push(N),C.push(y.defines[N]);return y.isRawShaderMaterial===!1&&(f(C,y),_(C,y),C.push(t.outputColorSpace)),C.push(y.customProgramCacheKey),C.join()}function f(y,C){y.push(C.precision),y.push(C.outputColorSpace),y.push(C.envMapMode),y.push(C.envMapCubeUVHeight),y.push(C.mapUv),y.push(C.alphaMapUv),y.push(C.lightMapUv),y.push(C.aoMapUv),y.push(C.bumpMapUv),y.push(C.normalMapUv),y.push(C.displacementMapUv),y.push(C.emissiveMapUv),y.push(C.metalnessMapUv),y.push(C.roughnessMapUv),y.push(C.anisotropyMapUv),y.push(C.clearcoatMapUv),y.push(C.clearcoatNormalMapUv),y.push(C.clearcoatRoughnessMapUv),y.push(C.iridescenceMapUv),y.push(C.iridescenceThicknessMapUv),y.push(C.sheenColorMapUv),y.push(C.sheenRoughnessMapUv),y.push(C.specularMapUv),y.push(C.specularColorMapUv),y.push(C.specularIntensityMapUv),y.push(C.transmissionMapUv),y.push(C.thicknessMapUv),y.push(C.combine),y.push(C.fogExp2),y.push(C.sizeAttenuation),y.push(C.morphTargetsCount),y.push(C.morphAttributeCount),y.push(C.numSunLights),y.push(C.numDirLights),y.push(C.numPointLights),y.push(C.numSpotLights),y.push(C.numSpotLightMaps),y.push(C.numHemiLights),y.push(C.numRectAreaLights),y.push(C.numSunLightShadows),y.push(C.numDirLightShadows),y.push(C.numPointLightShadows),y.push(C.numSpotLightShadows),y.push(C.numSpotLightShadowsWithMaps),y.push(C.numLightProbes),y.push(C.shadowMapType),y.push(C.toneMapping),y.push(C.numClippingPlanes),y.push(C.numClipIntersection),y.push(C.depthPacking)}function _(y,C){a.disableAll(),C.instancing&&a.enable(0),C.instancingColor&&a.enable(1),C.instancingMorph&&a.enable(2),C.matcap&&a.enable(3),C.envMap&&a.enable(4),C.normalMapObjectSpace&&a.enable(5),C.normalMapTangentSpace&&a.enable(6),C.clearcoat&&a.enable(7),C.iridescence&&a.enable(8),C.alphaTest&&a.enable(9),C.vertexColors&&a.enable(10),C.vertexAlphas&&a.enable(11),C.vertexUv1s&&a.enable(12),C.vertexUv2s&&a.enable(13),C.vertexUv3s&&a.enable(14),C.vertexTangents&&a.enable(15),C.anisotropy&&a.enable(16),C.alphaHash&&a.enable(17),C.batching&&a.enable(18),C.dispersion&&a.enable(19),C.retroreflection&&a.enable(24),C.batchingColor&&a.enable(20),C.gradientMap&&a.enable(21),C.packedNormalMap&&a.enable(22),C.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),C.fog&&a.enable(0),C.useFog&&a.enable(1),C.flatShading&&a.enable(2),C.logarithmicDepthBuffer&&a.enable(3),C.reversedDepthBuffer&&a.enable(4),C.skinning&&a.enable(5),C.morphTargets&&a.enable(6),C.morphNormals&&a.enable(7),C.morphColors&&a.enable(8),C.premultipliedAlpha&&a.enable(9),C.shadowMapEnabled&&a.enable(10),C.doubleSided&&a.enable(11),C.flipSided&&a.enable(12),C.useDepthPacking&&a.enable(13),C.dithering&&a.enable(14),C.transmission&&a.enable(15),C.sheen&&a.enable(16),C.opaque&&a.enable(17),C.pointsUvs&&a.enable(18),C.decodeVideoTexture&&a.enable(19),C.decodeVideoTextureEmissive&&a.enable(20),C.alphaToCoverage&&a.enable(21),C.numLightProbeGrids>0&&a.enable(22),C.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function M(y){const C=g[y.type];let N;if(C){const D=bi[C];N=r1.clone(D.uniforms)}else N=y.uniforms;return N}function v(y,C){let N=h.get(C);return N!==void 0?++N.usedTimes:(N=new zP(t,C,y,r),c.push(N),h.set(C,N)),N}function w(y){if(--y.usedTimes===0){const C=c.indexOf(y);c[C]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function T(y){o.remove(y)}function A(){o.dispose()}return{getParameters:S,getProgramCacheKey:m,getUniforms:M,acquireProgram:v,releaseProgram:w,releaseShaderCache:T,programs:c,dispose:A}}function XP(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function qP(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function Wv(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Xv(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(d){let g=0;return d.isInstancedMesh&&(g+=2),d.isSkinnedMesh&&(g+=1),g}function o(d,g,x,S,m,f){let _=t[e];return _===void 0?(_={id:d.id,object:d,geometry:g,material:x,materialVariant:a(d),groupOrder:S,renderOrder:d.renderOrder,z:m,group:f},t[e]=_):(_.id=d.id,_.object=d,_.geometry=g,_.material=x,_.materialVariant=a(d),_.groupOrder=S,_.renderOrder=d.renderOrder,_.z=m,_.group=f),e++,_}function l(d,g,x,S,m,f,_){_.reversedDepth===!0&&(m=-m);const M=o(d,g,x,S,m,f);x.transmission>0?i.push(M):x.transparent===!0?r.push(M):n.push(M)}function c(d,g,x,S,m,f){const _=o(d,g,x,S,m,f);x.transmission>0?i.unshift(_):x.transparent===!0?r.unshift(_):n.unshift(_)}function h(d,g){n.length>1&&n.sort(d||qP),i.length>1&&i.sort(g||Wv),r.length>1&&r.sort(g||Wv)}function p(){for(let d=e,g=t.length;d<g;d++){const x=t[d];if(x.id===null)break;x.id=null,x.object=null,x.geometry=null,x.material=null,x.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:p,sort:h}}function $P(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Xv,t.set(i,[a])):r>=s.length?(a=new Xv,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function YP(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new X,color:new Ke};break;case"SpotLight":n={position:new X,direction:new X,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new X,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":n={direction:new X,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":n={color:new Ke,position:new X,halfWidth:new X,halfHeight:new X};break}return t[e.id]=n,n}}}function KP(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let ZP=0;function JP(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function QP(t){const e=new YP,n=KP(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new X);const r=new X,s=new It,a=new It;function o(c){let h=0,p=0,d=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let g=0,x=0,S=0,m=0,f=0,_=0,M=0,v=0,w=0,T=0,A=0,y=0,C=0,N=0;c.sort(JP);for(let B=0,F=c.length;B<F;B++){const I=c[B],k=I.color,G=I.intensity,U=I.distance;let O=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===_s?O=I.shadow.map.texture:O=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=k.r*G,p+=k.g*G,d+=k.b*G;else if(I.isLightProbe){for(let L=0;L<9;L++)i.probe[L].addScaledVector(I.sh.coefficients[L],G);N++}else if(I.isSunLight){const L=e.get(I);if(L.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const q=I.shadow,Z=n.get(I);Z.shadowIntensity=q.intensity,Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize.copy(q.mapSize).multiply(q.getFrameExtents()),i.sunShadow[x]=Z,i.sunShadowMap[x]=O;const ce=q.getViewportCount();for(let _e=0;_e<ce;_e++)i.sunShadowMatrix[S+_e]=q.getMatrix(_e),i.sunShadowCascade[S+_e]=q._cascadeData[_e];S+=ce,x++}i.sun[g]=L,g++}else if(I.isDirectionalLight){const L=e.get(I);if(L.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const q=I.shadow,Z=n.get(I);Z.shadowIntensity=q.intensity,Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,i.directionalShadow[m]=Z,i.directionalShadowMap[m]=O,i.directionalShadowMatrix[m]=I.shadow.matrix,w++}i.directional[m]=L,m++}else if(I.isSpotLight){const L=e.get(I);L.position.setFromMatrixPosition(I.matrixWorld),L.color.copy(k).multiplyScalar(G),L.distance=U,L.coneCos=Math.cos(I.angle),L.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),L.decay=I.decay,i.spot[_]=L;const q=I.shadow;if(I.map&&(i.spotLightMap[y]=I.map,y++,q.updateMatrices(I),I.castShadow&&C++),i.spotLightMatrix[_]=q.matrix,I.castShadow){const Z=n.get(I);Z.shadowIntensity=q.intensity,Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,i.spotShadow[_]=Z,i.spotShadowMap[_]=O,A++}_++}else if(I.isRectAreaLight){const L=e.get(I);L.color.copy(k).multiplyScalar(G),L.halfWidth.set(I.width*.5,0,0),L.halfHeight.set(0,I.height*.5,0),i.rectArea[M]=L,M++}else if(I.isPointLight){const L=e.get(I);if(L.color.copy(I.color).multiplyScalar(I.intensity),L.distance=I.distance,L.decay=I.decay,I.castShadow){const q=I.shadow,Z=n.get(I);Z.shadowIntensity=q.intensity,Z.shadowBias=q.bias,Z.shadowNormalBias=q.normalBias,Z.shadowRadius=q.radius,Z.shadowMapSize=q.mapSize,Z.shadowCameraNear=q.camera.near,Z.shadowCameraFar=q.camera.far,i.pointShadow[f]=Z,i.pointShadowMap[f]=O,i.pointShadowMatrix[f]=I.shadow.matrix,T++}i.point[f]=L,f++}else if(I.isHemisphereLight){const L=e.get(I);L.skyColor.copy(I.color).multiplyScalar(G),L.groundColor.copy(I.groundColor).multiplyScalar(G),i.hemi[v]=L,v++}}M>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ye.LTC_FLOAT_1,i.rectAreaLTC2=ye.LTC_FLOAT_2):(i.rectAreaLTC1=ye.LTC_HALF_1,i.rectAreaLTC2=ye.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=p,i.ambient[2]=d;const D=i.hash;(D.sunLength!==g||D.directionalLength!==m||D.pointLength!==f||D.spotLength!==_||D.rectAreaLength!==M||D.hemiLength!==v||D.numSunShadows!==x||D.numDirectionalShadows!==w||D.numPointShadows!==T||D.numSpotShadows!==A||D.numSpotMaps!==y||D.numLightProbes!==N)&&(i.sun.length=g,i.directional.length=m,i.spot.length=_,i.rectArea.length=M,i.point.length=f,i.hemi.length=v,i.sunShadow.length=x,i.sunShadowMap.length=x,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.directionalShadowMatrix.length=w,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+y-C,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=N,D.sunLength=g,D.directionalLength=m,D.pointLength=f,D.spotLength=_,D.rectAreaLength=M,D.hemiLength=v,D.numSunShadows=x,D.numDirectionalShadows=w,D.numPointShadows=T,D.numSpotShadows=A,D.numSpotMaps=y,D.numLightProbes=N,i.version=ZP++)}function l(c,h){let p=0,d=0,g=0,x=0,S=0,m=0;const f=h.matrixWorldInverse;for(let _=0,M=c.length;_<M;_++){const v=c[_];if(v.isSunLight){const w=i.sun[p];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(f),p++}else if(v.isDirectionalLight){const w=i.directional[d];w.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),d++}else if(v.isSpotLight){const w=i.spot[x];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(f),w.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(f),x++}else if(v.isRectAreaLight){const w=i.rectArea[S];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(f),a.identity(),s.copy(v.matrixWorld),s.premultiply(f),a.extractRotation(s),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),S++}else if(v.isPointLight){const w=i.point[g];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(f),g++}else if(v.isHemisphereLight){const w=i.hemi[m];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(f),m++}}}return{setup:o,setupView:l,state:i}}function qv(t){const e=new QP(t),n=[],i=[],r=[];function s(d){p.camera=d,n.length=0,i.length=0,r.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(n)}function h(d){e.setupView(n,d)}const p={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:p,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function eN(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new qv(t),e.set(r,[o])):s>=a.length?(o=new qv(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const tN=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nN=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,iN=[new X(1,0,0),new X(-1,0,0),new X(0,1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1)],rN=[new X(0,-1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1),new X(0,-1,0),new X(0,-1,0)],$v=new It,ja=new X,kd=new X;function sN(t,e,n){let i=new Yp;const r=new He,s=new He,a=new Rt,o=new l1,l=new c1,c={},h=n.maxTextureSize,p={[gs]:Ln,[Ln]:gs,[Ai]:Ai},d=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:tN,fragmentShader:nN}),g=d.clone();g.defines.HORIZONTAL_PASS=1;const x=new Dn;x.setAttribute("position",new ir(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new dn(x,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oc;let f=this.type;this.render=function(T,A,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===qx&&(Ge("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=oc);const C=t.getRenderTarget(),N=t.getActiveCubeFace(),D=t.getActiveMipmapLevel(),B=t.state;B.setBlending(tr),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const F=f!==this.type;F&&A.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(k=>k.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,k=T.length;I<k;I++){const G=T[I],U=G.shadow;if(U===void 0){Ge("WebGLShadowMap:",G,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;r.copy(U.mapSize);const O=U.getFrameExtents();r.multiply(O),s.copy(U.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/O.x),r.x=s.x*O.x,U.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/O.y),r.y=s.y*O.y,U.mapSize.y=s.y));const L=t.state.buffers.depth.getReversed();if(U.camera._reversedDepth=L,U.map===null||F===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===Qa){if(G.isPointLight){Ge("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new _i(r.x,r.y,{format:_s,type:Fi,minFilter:hn,magFilter:hn,generateMipmaps:!1}),U.map.texture.name=G.name+".shadowMap",U.map.depthTexture=new zo(r.x,r.y,Ri),U.map.depthTexture.name=G.name+".shadowMapDepth",U.map.depthTexture.format=cr,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=tn,U.map.depthTexture.magFilter=tn}else G.isPointLight?(U.map=new by(r.x),U.map.depthTexture=new n1(r.x,Oi)):(U.map=new _i(r.x,r.y),U.map.depthTexture=new zo(r.x,r.y,Oi)),U.map.depthTexture.name=G.name+".shadowMap",U.map.depthTexture.format=cr,this.type===oc?(U.map.depthTexture.compareFunction=L?Wp:jp,U.map.depthTexture.minFilter=hn,U.map.depthTexture.magFilter=hn):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=tn,U.map.depthTexture.magFilter=tn);U.camera.updateProjectionMatrix()}U.map.isWebGLCubeRenderTarget!==!0&&(U.map.width!==r.x||U.map.height!==r.y)&&U.map.setSize(r.x,r.y);const q=U.map.isWebGLCubeRenderTarget?6:U.getViewportCount();G.isPointLight!==!0&&U.updateMatrices(G,y);for(let Z=0;Z<q;Z++){const ce=U.getCamera(Z);if(G.isPointLight){const _e=U.camera,se=U.matrix,Me=G.distance||_e.far;Me!==_e.far&&(_e.far=Me,_e.updateProjectionMatrix()),ja.setFromMatrixPosition(G.matrixWorld),_e.position.copy(ja),kd.copy(_e.position),kd.add(iN[Z]),_e.up.copy(rN[Z]),_e.lookAt(kd),_e.updateMatrixWorld(),se.makeTranslation(-ja.x,-ja.y,-ja.z),$v.multiplyMatrices(_e.projectionMatrix,_e.matrixWorldInverse),U._frustum.setFromProjectionMatrix($v,_e.coordinateSystem,_e.reversedDepth)}if(U.map.isWebGLCubeRenderTarget)t.setRenderTarget(U.map,Z),t.clear();else{Z===0&&(t.setRenderTarget(U.map),t.clear());const _e=U.getViewport(Z);a.set(s.x*_e.x,s.y*_e.y,s.x*_e.z,s.y*_e.w),B.viewport(a)}i=U.getFrustum(Z),v(A,y,ce,G,this.type)}U.isPointLightShadow!==!0&&this.type===Qa&&_(U,y),U.needsUpdate=!1}f=this.type,m.needsUpdate=!1,t.setRenderTarget(C,N,D)};function _(T,A){const y=e.update(S);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,g.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,g.needsUpdate=!0),T.mapPass===null?T.mapPass=new _i(r.x,r.y,{format:_s,type:Fi}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(A,null,y,d,S,null),g.uniforms.shadow_pass.value=T.mapPass.texture,g.uniforms.resolution.value.set(T.map.width,T.map.height),g.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(A,null,y,g,S,null)}function M(T,A,y,C){let N=null;const D=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)N=D;else if(N=y.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const B=N.uuid,F=A.uuid;let I=c[B];I===void 0&&(I={},c[B]=I);let k=I[F];k===void 0&&(k=N.clone(),I[F]=k,A.addEventListener("dispose",w)),N=k}if(N.visible=A.visible,N.wireframe=A.wireframe,C===Qa?N.side=A.shadowSide!==null?A.shadowSide:A.side:N.side=A.shadowSide!==null?A.shadowSide:p[A.side],N.alphaMap=A.alphaMap,N.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,N.map=A.map,N.clipShadows=A.clipShadows,N.clippingPlanes=A.clippingPlanes,N.clipIntersection=A.clipIntersection,N.displacementMap=A.displacementMap,N.displacementScale=A.displacementScale,N.displacementBias=A.displacementBias,N.wireframeLinewidth=A.wireframeLinewidth,N.linewidth=A.linewidth,y.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const B=t.properties.get(N);B.light=y}return N}function v(T,A,y,C,N){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&N===Qa)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);const F=e.update(T),I=T.material;if(Array.isArray(I)){const k=F.groups;for(let G=0,U=k.length;G<U;G++){const O=k[G],L=I[O.materialIndex];if(L&&L.visible){const q=M(T,L,C,N);T.onBeforeShadow(t,T,A,y,F,q,O),t.renderBufferDirect(y,null,F,q,T,O),T.onAfterShadow(t,T,A,y,F,q,O)}}}else if(I.visible){const k=M(T,I,C,N);T.onBeforeShadow(t,T,A,y,F,k,null),t.renderBufferDirect(y,null,F,k,T,null),T.onAfterShadow(t,T,A,y,F,k,null)}}const B=T.children;for(let F=0,I=B.length;F<I;F++)v(B[F],A,y,C,N)}function w(T){T.target.removeEventListener("dispose",w);for(const y in c){const C=c[y],N=T.target.uuid;N in C&&(C[N].dispose(),delete C[N])}}}function aN(t,e){function n(){let V=!1;const ge=new Rt;let ie=null;const ve=new Rt(0,0,0,0);return{setMask:function(we){ie!==we&&!V&&(t.colorMask(we,we,we,we),ie=we)},setLocked:function(we){V=we},setClear:function(we,ae,Oe,Ne,vt){vt===!0&&(we*=Ne,ae*=Ne,Oe*=Ne),ge.set(we,ae,Oe,Ne),ve.equals(ge)===!1&&(t.clearColor(we,ae,Oe,Ne),ve.copy(ge))},reset:function(){V=!1,ie=null,ve.set(-1,0,0,0)}}}function i(){let V=!1,ge=!1,ie=null,ve=null,we=null;return{setReversed:function(ae){if(ge!==ae){const Oe=e.get("EXT_clip_control");ae?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT),ge=ae;const Ne=we;we=null,this.setClear(Ne)}},getReversed:function(){return ge},setTest:function(ae){ae?J(t.DEPTH_TEST):le(t.DEPTH_TEST)},setMask:function(ae){ie!==ae&&!V&&(t.depthMask(ae),ie=ae)},setFunc:function(ae){if(ge&&(ae=Pb[ae]),ve!==ae){switch(ae){case Xf:t.depthFunc(t.NEVER);break;case qf:t.depthFunc(t.ALWAYS);break;case $f:t.depthFunc(t.LESS);break;case Uo:t.depthFunc(t.LEQUAL);break;case Yf:t.depthFunc(t.EQUAL);break;case Kf:t.depthFunc(t.GEQUAL);break;case Zf:t.depthFunc(t.GREATER);break;case Jf:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ve=ae}},setLocked:function(ae){V=ae},setClear:function(ae){we!==ae&&(we=ae,ge&&(ae=1-ae),t.clearDepth(ae))},reset:function(){V=!1,ie=null,ve=null,we=null,ge=!1}}}function r(){let V=!1,ge=null,ie=null,ve=null,we=null,ae=null,Oe=null,Ne=null,vt=null;return{setTest:function(ct){V||(ct?J(t.STENCIL_TEST):le(t.STENCIL_TEST))},setMask:function(ct){ge!==ct&&!V&&(t.stencilMask(ct),ge=ct)},setFunc:function(ct,si,yi){(ie!==ct||ve!==si||we!==yi)&&(t.stencilFunc(ct,si,yi),ie=ct,ve=si,we=yi)},setOp:function(ct,si,yi){(ae!==ct||Oe!==si||Ne!==yi)&&(t.stencilOp(ct,si,yi),ae=ct,Oe=si,Ne=yi)},setLocked:function(ct){V=ct},setClear:function(ct){vt!==ct&&(t.clearStencil(ct),vt=ct)},reset:function(){V=!1,ge=null,ie=null,ve=null,we=null,ae=null,Oe=null,Ne=null,vt=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let h={},p={},d={},g=new WeakMap,x=[],S=null,m=!1,f=null,_=null,M=null,v=null,w=null,T=null,A=null,y=new Ke(0,0,0),C=0,N=!1,D=null,B=null,F=null,I=null,k=null;const G=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,O=0;const L=t.getParameter(t.VERSION);L.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(L)[1]),U=O>=1):L.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),U=O>=2);let q=null,Z={};const ce=t.getParameter(t.SCISSOR_BOX),_e=t.getParameter(t.VIEWPORT),se=new Rt().fromArray(ce),Me=new Rt().fromArray(_e);function de(V,ge,ie,ve){const we=new Uint8Array(4),ae=t.createTexture();t.bindTexture(V,ae),t.texParameteri(V,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(V,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Oe=0;Oe<ie;Oe++)V===t.TEXTURE_3D||V===t.TEXTURE_2D_ARRAY?t.texImage3D(ge,0,t.RGBA,1,1,ve,0,t.RGBA,t.UNSIGNED_BYTE,we):t.texImage2D(ge+Oe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,we);return ae}const j={};j[t.TEXTURE_2D]=de(t.TEXTURE_2D,t.TEXTURE_2D,1),j[t.TEXTURE_CUBE_MAP]=de(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[t.TEXTURE_2D_ARRAY]=de(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),j[t.TEXTURE_3D]=de(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),J(t.DEPTH_TEST),a.setFunc(Uo),ee(!1),Ae(Kg),J(t.CULL_FACE),nt(tr);function J(V){h[V]!==!0&&(t.enable(V),h[V]=!0)}function le(V){h[V]!==!1&&(t.disable(V),h[V]=!1)}function Ue(V,ge){return d[V]!==ge?(t.bindFramebuffer(V,ge),d[V]=ge,V===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=ge),V===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=ge),!0):!1}function he(V,ge){let ie=x,ve=!1;if(V){ie=g.get(ge),ie===void 0&&(ie=[],g.set(ge,ie));const we=V.textures;if(ie.length!==we.length||ie[0]!==t.COLOR_ATTACHMENT0){for(let ae=0,Oe=we.length;ae<Oe;ae++)ie[ae]=t.COLOR_ATTACHMENT0+ae;ie.length=we.length,ve=!0}}else ie[0]!==t.BACK&&(ie[0]=t.BACK,ve=!0);ve&&t.drawBuffers(ie)}function Ve(V){return S!==V?(t.useProgram(V),S=V,!0):!1}const bt={[zs]:t.FUNC_ADD,[ZT]:t.FUNC_SUBTRACT,[JT]:t.FUNC_REVERSE_SUBTRACT};bt[QT]=t.MIN,bt[eb]=t.MAX;const Ze={[tb]:t.ZERO,[nb]:t.ONE,[ib]:t.SRC_COLOR,[$x]:t.SRC_ALPHA,[cb]:t.SRC_ALPHA_SATURATE,[ob]:t.DST_COLOR,[sb]:t.DST_ALPHA,[rb]:t.ONE_MINUS_SRC_COLOR,[Yx]:t.ONE_MINUS_SRC_ALPHA,[lb]:t.ONE_MINUS_DST_COLOR,[ab]:t.ONE_MINUS_DST_ALPHA,[ub]:t.CONSTANT_COLOR,[db]:t.ONE_MINUS_CONSTANT_COLOR,[fb]:t.CONSTANT_ALPHA,[hb]:t.ONE_MINUS_CONSTANT_ALPHA};function nt(V,ge,ie,ve,we,ae,Oe,Ne,vt,ct){if(V===tr){m===!0&&(le(t.BLEND),m=!1);return}if(m===!1&&(J(t.BLEND),m=!0),V!==KT){if(V!==f||ct!==N){if((_!==zs||w!==zs)&&(t.blendEquation(t.FUNC_ADD),_=zs,w=zs),ct)switch(V){case fo:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Zg:t.blendFunc(t.ONE,t.ONE);break;case Jg:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Qg:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:lt("WebGLState: Invalid blending: ",V);break}else switch(V){case fo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Zg:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Jg:lt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qg:lt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:lt("WebGLState: Invalid blending: ",V);break}M=null,v=null,T=null,A=null,y.set(0,0,0),C=0,f=V,N=ct}return}we=we||ge,ae=ae||ie,Oe=Oe||ve,(ge!==_||we!==w)&&(t.blendEquationSeparate(bt[ge],bt[we]),_=ge,w=we),(ie!==M||ve!==v||ae!==T||Oe!==A)&&(t.blendFuncSeparate(Ze[ie],Ze[ve],Ze[ae],Ze[Oe]),M=ie,v=ve,T=ae,A=Oe),(Ne.equals(y)===!1||vt!==C)&&(t.blendColor(Ne.r,Ne.g,Ne.b,vt),y.copy(Ne),C=vt),f=V,N=!1}function dt(V,ge){V.side===Ai?le(t.CULL_FACE):J(t.CULL_FACE);let ie=V.side===Ln;ge&&(ie=!ie),ee(ie),V.blending===fo&&V.transparent===!1?nt(tr):nt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),a.setFunc(V.depthFunc),a.setTest(V.depthTest),a.setMask(V.depthWrite),s.setMask(V.colorWrite);const ve=V.stencilWrite;o.setTest(ve),ve&&(o.setMask(V.stencilWriteMask),o.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),o.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),We(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?J(t.SAMPLE_ALPHA_TO_COVERAGE):le(t.SAMPLE_ALPHA_TO_COVERAGE)}function ee(V){D!==V&&(V?t.frontFace(t.CW):t.frontFace(t.CCW),D=V)}function Ae(V){V!==$T?(J(t.CULL_FACE),V!==B&&(V===Kg?t.cullFace(t.BACK):V===YT?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):le(t.CULL_FACE),B=V}function qe(V){V!==F&&(U&&t.lineWidth(V),F=V)}function We(V,ge,ie){V?(J(t.POLYGON_OFFSET_FILL),(I!==ge||k!==ie)&&(I=ge,k=ie,a.getReversed()&&(ge=-ge),t.polygonOffset(ge,ie))):le(t.POLYGON_OFFSET_FILL)}function Je(V){V?J(t.SCISSOR_TEST):le(t.SCISSOR_TEST)}function Fe(V){V===void 0&&(V=t.TEXTURE0+G-1),q!==V&&(t.activeTexture(V),q=V)}function H(V,ge,ie){ie===void 0&&(q===null?ie=t.TEXTURE0+G-1:ie=q);let ve=Z[ie];ve===void 0&&(ve={type:void 0,texture:void 0},Z[ie]=ve),(ve.type!==V||ve.texture!==ge)&&(q!==ie&&(t.activeTexture(ie),q=ie),t.bindTexture(V,ge||j[V]),ve.type=V,ve.texture=ge)}function ze(){const V=Z[q];V!==void 0&&V.type!==void 0&&(t.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function ke(){try{t.compressedTexImage2D(...arguments)}catch(V){lt("WebGLState:",V)}}function R(){try{t.compressedTexImage3D(...arguments)}catch(V){lt("WebGLState:",V)}}function E(){try{t.texSubImage2D(...arguments)}catch(V){lt("WebGLState:",V)}}function W(){try{t.texSubImage3D(...arguments)}catch(V){lt("WebGLState:",V)}}function $(){try{t.compressedTexSubImage2D(...arguments)}catch(V){lt("WebGLState:",V)}}function te(){try{t.compressedTexSubImage3D(...arguments)}catch(V){lt("WebGLState:",V)}}function ue(){try{t.texStorage2D(...arguments)}catch(V){lt("WebGLState:",V)}}function fe(){try{t.texStorage3D(...arguments)}catch(V){lt("WebGLState:",V)}}function ne(){try{t.texImage2D(...arguments)}catch(V){lt("WebGLState:",V)}}function re(){try{t.texImage3D(...arguments)}catch(V){lt("WebGLState:",V)}}function pe(V){return p[V]!==void 0?p[V]:t.getParameter(V)}function De(V,ge){p[V]!==ge&&(t.pixelStorei(V,ge),p[V]=ge)}function xe(V){se.equals(V)===!1&&(t.scissor(V.x,V.y,V.z,V.w),se.copy(V))}function me(V){Me.equals(V)===!1&&(t.viewport(V.x,V.y,V.z,V.w),Me.copy(V))}function Ie(V,ge){let ie=c.get(ge);ie===void 0&&(ie=new WeakMap,c.set(ge,ie));let ve=ie.get(V);ve===void 0&&(ve=t.getUniformBlockIndex(ge,V.name),ie.set(V,ve))}function Be(V,ge){const ve=c.get(ge).get(V);l.get(ge)!==ve&&(t.uniformBlockBinding(ge,ve,V.__bindingPointIndex),l.set(ge,ve))}function Xe(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),h={},p={},q=null,Z={},d={},g=new WeakMap,x=[],S=null,m=!1,f=null,_=null,M=null,v=null,w=null,T=null,A=null,y=new Ke(0,0,0),C=0,N=!1,D=null,B=null,F=null,I=null,k=null,se.set(0,0,t.canvas.width,t.canvas.height),Me.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:J,disable:le,bindFramebuffer:Ue,drawBuffers:he,useProgram:Ve,setBlending:nt,setMaterial:dt,setFlipSided:ee,setCullFace:Ae,setLineWidth:qe,setPolygonOffset:We,setScissorTest:Je,activeTexture:Fe,bindTexture:H,unbindTexture:ze,compressedTexImage2D:ke,compressedTexImage3D:R,texImage2D:ne,texImage3D:re,pixelStorei:De,getParameter:pe,updateUBOMapping:Ie,uniformBlockBinding:Be,texStorage2D:ue,texStorage3D:fe,texSubImage2D:E,texSubImage3D:W,compressedTexSubImage2D:$,compressedTexSubImage3D:te,scissor:xe,viewport:me,reset:Xe}}function oN(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new He,h=new WeakMap,p=new Set;let d;const g=new WeakMap;let x=!1;try{x=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(R,E){return x?new OffscreenCanvas(R,E):Bo("canvas")}function m(R,E,W){let $=1;const te=ke(R);if((te.width>W||te.height>W)&&($=W/Math.max(te.width,te.height)),$<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ue=Math.floor($*te.width),fe=Math.floor($*te.height);d===void 0&&(d=S(ue,fe));const ne=E?S(ue,fe):d;return ne.width=ue,ne.height=fe,ne.getContext("2d").drawImage(R,0,0,ue,fe),Ge("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ue+"x"+fe+")."),ne}else return"data"in R&&Ge("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),R;return R}function f(R){return R.generateMipmaps}function _(R){t.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?t.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(R,E,W,$,te,ue=!1){if(R!==null){if(t[R]!==void 0)return t[R];Ge("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let fe;$&&(fe=e.get("EXT_texture_norm16"),fe||Ge("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ne=E;if(E===t.RED&&(W===t.FLOAT&&(ne=t.R32F),W===t.HALF_FLOAT&&(ne=t.R16F),W===t.UNSIGNED_BYTE&&(ne=t.R8),W===t.UNSIGNED_SHORT&&fe&&(ne=fe.R16_EXT),W===t.SHORT&&fe&&(ne=fe.R16_SNORM_EXT)),E===t.RED_INTEGER&&(W===t.UNSIGNED_BYTE&&(ne=t.R8UI),W===t.UNSIGNED_SHORT&&(ne=t.R16UI),W===t.UNSIGNED_INT&&(ne=t.R32UI),W===t.BYTE&&(ne=t.R8I),W===t.SHORT&&(ne=t.R16I),W===t.INT&&(ne=t.R32I)),E===t.RG&&(W===t.FLOAT&&(ne=t.RG32F),W===t.HALF_FLOAT&&(ne=t.RG16F),W===t.UNSIGNED_BYTE&&(ne=t.RG8),W===t.UNSIGNED_SHORT&&fe&&(ne=fe.RG16_EXT),W===t.SHORT&&fe&&(ne=fe.RG16_SNORM_EXT)),E===t.RG_INTEGER&&(W===t.UNSIGNED_BYTE&&(ne=t.RG8UI),W===t.UNSIGNED_SHORT&&(ne=t.RG16UI),W===t.UNSIGNED_INT&&(ne=t.RG32UI),W===t.BYTE&&(ne=t.RG8I),W===t.SHORT&&(ne=t.RG16I),W===t.INT&&(ne=t.RG32I)),E===t.RGB_INTEGER&&(W===t.UNSIGNED_BYTE&&(ne=t.RGB8UI),W===t.UNSIGNED_SHORT&&(ne=t.RGB16UI),W===t.UNSIGNED_INT&&(ne=t.RGB32UI),W===t.BYTE&&(ne=t.RGB8I),W===t.SHORT&&(ne=t.RGB16I),W===t.INT&&(ne=t.RGB32I)),E===t.RGBA_INTEGER&&(W===t.UNSIGNED_BYTE&&(ne=t.RGBA8UI),W===t.UNSIGNED_SHORT&&(ne=t.RGBA16UI),W===t.UNSIGNED_INT&&(ne=t.RGBA32UI),W===t.BYTE&&(ne=t.RGBA8I),W===t.SHORT&&(ne=t.RGBA16I),W===t.INT&&(ne=t.RGBA32I)),E===t.RGB&&(W===t.UNSIGNED_SHORT&&fe&&(ne=fe.RGB16_EXT),W===t.SHORT&&fe&&(ne=fe.RGB16_SNORM_EXT),W===t.UNSIGNED_INT_5_9_9_9_REV&&(ne=t.RGB9_E5),W===t.UNSIGNED_INT_10F_11F_11F_REV&&(ne=t.R11F_G11F_B10F)),E===t.RGBA){const re=ue?qc:rt.getTransfer(te);W===t.FLOAT&&(ne=t.RGBA32F),W===t.HALF_FLOAT&&(ne=t.RGBA16F),W===t.UNSIGNED_BYTE&&(ne=re===ft?t.SRGB8_ALPHA8:t.RGBA8),W===t.UNSIGNED_SHORT&&fe&&(ne=fe.RGBA16_EXT),W===t.SHORT&&fe&&(ne=fe.RGBA16_SNORM_EXT),W===t.UNSIGNED_SHORT_4_4_4_4&&(ne=t.RGBA4),W===t.UNSIGNED_SHORT_5_5_5_1&&(ne=t.RGB5_A1)}return(ne===t.R16F||ne===t.R32F||ne===t.RG16F||ne===t.RG32F||ne===t.RGBA16F||ne===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function w(R,E){let W;return R?E===null||E===Oi||E===Fo?W=t.DEPTH24_STENCIL8:E===Ri?W=t.DEPTH32F_STENCIL8:E===Oo&&(W=t.DEPTH24_STENCIL8,Ge("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Oi||E===Fo?W=t.DEPTH_COMPONENT24:E===Ri?W=t.DEPTH_COMPONENT32F:E===Oo&&(W=t.DEPTH_COMPONENT16),W}function T(R,E){return f(R)===!0||R.isFramebufferTexture&&R.minFilter!==tn&&R.minFilter!==hn?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function A(R){const E=R.target;E.removeEventListener("dispose",A),C(E),E.isVideoTexture&&h.delete(E),E.isHTMLTexture&&p.delete(E)}function y(R){const E=R.target;E.removeEventListener("dispose",y),D(E)}function C(R){const E=i.get(R);if(E.__webglInit===void 0)return;const W=R.source,$=g.get(W);if($){const te=$[E.__cacheKey];te.usedTimes--,te.usedTimes===0&&N(R),Object.keys($).length===0&&g.delete(W)}i.remove(R)}function N(R){const E=i.get(R);t.deleteTexture(E.__webglTexture);const W=R.source,$=g.get(W);delete $[E.__cacheKey],a.memory.textures--}function D(R){const E=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(E.__webglFramebuffer[$]))for(let te=0;te<E.__webglFramebuffer[$].length;te++)t.deleteFramebuffer(E.__webglFramebuffer[$][te]);else t.deleteFramebuffer(E.__webglFramebuffer[$]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[$])}else{if(Array.isArray(E.__webglFramebuffer))for(let $=0;$<E.__webglFramebuffer.length;$++)t.deleteFramebuffer(E.__webglFramebuffer[$]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let $=0;$<E.__webglColorRenderbuffer.length;$++)E.__webglColorRenderbuffer[$]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[$]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const W=R.textures;for(let $=0,te=W.length;$<te;$++){const ue=i.get(W[$]);ue.__webglTexture&&(t.deleteTexture(ue.__webglTexture),a.memory.textures--),i.remove(W[$])}i.remove(R)}let B=0;function F(){B=0}function I(){return B}function k(R){B=R}function G(){const R=B;return R>=r.maxTextures&&Ge("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+r.maxTextures),B+=1,R}function U(R){const E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function O(R,E){const W=i.get(R);if(R.isVideoTexture&&H(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&W.__version!==R.version){const $=R.image;if($===null)Ge("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Ge("WebGLRenderer: Texture marked for update but image is incomplete");else{le(W,R,E);return}}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,W.__webglTexture,t.TEXTURE0+E)}function L(R,E){const W=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){le(W,R,E);return}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,W.__webglTexture,t.TEXTURE0+E)}function q(R,E){const W=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){le(W,R,E);return}n.bindTexture(t.TEXTURE_3D,W.__webglTexture,t.TEXTURE0+E)}function Z(R,E){const W=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&W.__version!==R.version){Ue(W,R,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,W.__webglTexture,t.TEXTURE0+E)}const ce={[Qf]:t.REPEAT,[Ji]:t.CLAMP_TO_EDGE,[eh]:t.MIRRORED_REPEAT},_e={[tn]:t.NEAREST,[gb]:t.NEAREST_MIPMAP_NEAREST,[xl]:t.NEAREST_MIPMAP_LINEAR,[hn]:t.LINEAR,[ld]:t.LINEAR_MIPMAP_NEAREST,[os]:t.LINEAR_MIPMAP_LINEAR},se={[yb]:t.NEVER,[Tb]:t.ALWAYS,[Sb]:t.LESS,[jp]:t.LEQUAL,[Eb]:t.EQUAL,[Wp]:t.GEQUAL,[Mb]:t.GREATER,[wb]:t.NOTEQUAL};function Me(R,E){if(E.type===Ri&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===hn||E.magFilter===ld||E.magFilter===xl||E.magFilter===os||E.minFilter===hn||E.minFilter===ld||E.minFilter===xl||E.minFilter===os)&&Ge("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(R,t.TEXTURE_WRAP_S,ce[E.wrapS]),t.texParameteri(R,t.TEXTURE_WRAP_T,ce[E.wrapT]),(R===t.TEXTURE_3D||R===t.TEXTURE_2D_ARRAY)&&t.texParameteri(R,t.TEXTURE_WRAP_R,ce[E.wrapR]),t.texParameteri(R,t.TEXTURE_MAG_FILTER,_e[E.magFilter]),t.texParameteri(R,t.TEXTURE_MIN_FILTER,_e[E.minFilter]),E.compareFunction&&(t.texParameteri(R,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(R,t.TEXTURE_COMPARE_FUNC,se[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===tn||E.minFilter!==xl&&E.minFilter!==os||E.type===Ri&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const W=e.get("EXT_texture_filter_anisotropic");t.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function de(R,E){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",A));const $=E.source;let te=g.get($);te===void 0&&(te={},g.set($,te));const ue=U(E);if(ue!==R.__cacheKey){te[ue]===void 0&&(te[ue]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,W=!0),te[ue].usedTimes++;const fe=te[R.__cacheKey];fe!==void 0&&(te[R.__cacheKey].usedTimes--,fe.usedTimes===0&&N(E)),R.__cacheKey=ue,R.__webglTexture=te[ue].texture}return W}function j(R,E,W){return Math.floor(Math.floor(R/W)/E)}function J(R,E,W,$){const ue=R.updateRanges;if(ue.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,E.width,E.height,W,$,E.data);else{ue.sort((De,xe)=>De.start-xe.start);let fe=0;for(let De=1;De<ue.length;De++){const xe=ue[fe],me=ue[De],Ie=xe.start+xe.count,Be=j(me.start,E.width,4),Xe=j(xe.start,E.width,4);me.start<=Ie+1&&Be===Xe&&j(me.start+me.count-1,E.width,4)===Be?xe.count=Math.max(xe.count,me.start+me.count-xe.start):(++fe,ue[fe]=me)}ue.length=fe+1;const ne=n.getParameter(t.UNPACK_ROW_LENGTH),re=n.getParameter(t.UNPACK_SKIP_PIXELS),pe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,E.width);for(let De=0,xe=ue.length;De<xe;De++){const me=ue[De],Ie=Math.floor(me.start/4),Be=Math.ceil(me.count/4),Xe=Ie%E.width,V=Math.floor(Ie/E.width),ge=Be,ie=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Xe),n.pixelStorei(t.UNPACK_SKIP_ROWS,V),n.texSubImage2D(t.TEXTURE_2D,0,Xe,V,ge,ie,W,$,E.data)}R.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,ne),n.pixelStorei(t.UNPACK_SKIP_PIXELS,re),n.pixelStorei(t.UNPACK_SKIP_ROWS,pe)}}function le(R,E,W){let $=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&($=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&($=t.TEXTURE_3D);const te=de(R,E),ue=E.source;n.bindTexture($,R.__webglTexture,t.TEXTURE0+W);const fe=i.get(ue);if(ue.version!==fe.__version||te===!0){if(n.activeTexture(t.TEXTURE0+W),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const ie=rt.getPrimaries(rt.workingColorSpace),ve=E.colorSpace===br?null:rt.getPrimaries(E.colorSpace),we=E.colorSpace===br||ie===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,we)}n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment);let re=m(E.image,!1,r.maxTextureSize);re=ze(E,re);const pe=s.convert(E.format,E.colorSpace),De=s.convert(E.type);let xe=v(E.internalFormat,pe,De,E.normalized,E.colorSpace,E.isVideoTexture);Me($,E);let me;const Ie=E.mipmaps,Be=E.isVideoTexture!==!0,Xe=fe.__version===void 0||te===!0,V=ue.dataReady,ge=T(E,re);if(E.isDepthTexture)xe=w(E.format===ls,E.type),Xe&&(Be?n.texStorage2D(t.TEXTURE_2D,1,xe,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,xe,re.width,re.height,0,pe,De,null));else if(E.isDataTexture)if(Ie.length>0){Be&&Xe&&n.texStorage2D(t.TEXTURE_2D,ge,xe,Ie[0].width,Ie[0].height);for(let ie=0,ve=Ie.length;ie<ve;ie++)me=Ie[ie],Be?V&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,pe,De,me.data):n.texImage2D(t.TEXTURE_2D,ie,xe,me.width,me.height,0,pe,De,me.data);E.generateMipmaps=!1}else Be?(Xe&&n.texStorage2D(t.TEXTURE_2D,ge,xe,re.width,re.height),V&&J(E,re,pe,De)):n.texImage2D(t.TEXTURE_2D,0,xe,re.width,re.height,0,pe,De,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Be&&Xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ge,xe,Ie[0].width,Ie[0].height,re.depth);for(let ie=0,ve=Ie.length;ie<ve;ie++)if(me=Ie[ie],E.format!==mi)if(pe!==null)if(Be){if(V)if(E.layerUpdates.size>0){const we=bv(me.width,me.height,E.format,E.type);for(const ae of E.layerUpdates){const Oe=me.data.subarray(ae*we/me.data.BYTES_PER_ELEMENT,(ae+1)*we/me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,ae,me.width,me.height,1,pe,Oe)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,me.width,me.height,re.depth,pe,me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ie,xe,me.width,me.height,re.depth,0,me.data,0,0);else Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?V&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,me.width,me.height,re.depth,pe,De,me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ie,xe,me.width,me.height,re.depth,0,pe,De,me.data);E.layerUpdates.size>0&&E.clearLayerUpdates()}else{Be&&Xe&&n.texStorage2D(t.TEXTURE_2D,ge,xe,Ie[0].width,Ie[0].height);for(let ie=0,ve=Ie.length;ie<ve;ie++)me=Ie[ie],E.format!==mi?pe!==null?Be?V&&n.compressedTexSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,pe,me.data):n.compressedTexImage2D(t.TEXTURE_2D,ie,xe,me.width,me.height,0,me.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?V&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,pe,De,me.data):n.texImage2D(t.TEXTURE_2D,ie,xe,me.width,me.height,0,pe,De,me.data)}else if(E.isDataArrayTexture)if(Be){if(Xe&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ge,xe,re.width,re.height,re.depth),V)if(E.layerUpdates.size>0){const ie=bv(re.width,re.height,E.format,E.type);for(const ve of E.layerUpdates){const we=re.data.subarray(ve*ie/re.data.BYTES_PER_ELEMENT,(ve+1)*ie/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ve,re.width,re.height,1,pe,De,we)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,pe,De,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,xe,re.width,re.height,re.depth,0,pe,De,re.data);else if(E.isData3DTexture)Be?(Xe&&n.texStorage3D(t.TEXTURE_3D,ge,xe,re.width,re.height,re.depth),V&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,pe,De,re.data)):n.texImage3D(t.TEXTURE_3D,0,xe,re.width,re.height,re.depth,0,pe,De,re.data);else if(E.isFramebufferTexture){if(Xe)if(Be)n.texStorage2D(t.TEXTURE_2D,ge,xe,re.width,re.height);else{let ie=re.width,ve=re.height;for(let we=0;we<ge;we++)n.texImage2D(t.TEXTURE_2D,we,xe,ie,ve,0,pe,De,null),ie>>=1,ve>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in t){const ie=t.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),re.parentNode!==ie){ie.appendChild(re),p.add(E),ie.onpaint=ve=>{const we=ve.changedElements;for(const ae of p)we.includes(ae.image)&&(ae.needsUpdate=!0)},ie.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,re);else{const we=t.RGBA,ae=t.RGBA,Oe=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,we,ae,Oe,re)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ie.length>0){if(Be&&Xe){const ie=ke(Ie[0]);n.texStorage2D(t.TEXTURE_2D,ge,xe,ie.width,ie.height)}for(let ie=0,ve=Ie.length;ie<ve;ie++)me=Ie[ie],Be?V&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,pe,De,me):n.texImage2D(t.TEXTURE_2D,ie,xe,pe,De,me);E.generateMipmaps=!1}else if(Be){if(Xe){const ie=ke(re);n.texStorage2D(t.TEXTURE_2D,ge,xe,ie.width,ie.height)}V&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,pe,De,re)}else n.texImage2D(t.TEXTURE_2D,0,xe,pe,De,re);f(E)&&_($),fe.__version=ue.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function Ue(R,E,W){if(E.image.length!==6)return;const $=de(R,E),te=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,R.__webglTexture,t.TEXTURE0+W);const ue=i.get(te);if(te.version!==ue.__version||$===!0){n.activeTexture(t.TEXTURE0+W);const fe=rt.getPrimaries(rt.workingColorSpace),ne=E.colorSpace===br?null:rt.getPrimaries(E.colorSpace),re=E.colorSpace===br||fe===ne?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);const pe=E.isCompressedTexture||E.image[0].isCompressedTexture,De=E.image[0]&&E.image[0].isDataTexture,xe=[];for(let ae=0;ae<6;ae++)!pe&&!De?xe[ae]=m(E.image[ae],!0,r.maxCubemapSize):xe[ae]=De?E.image[ae].image:E.image[ae],xe[ae]=ze(E,xe[ae]);const me=xe[0],Ie=s.convert(E.format,E.colorSpace),Be=s.convert(E.type),Xe=v(E.internalFormat,Ie,Be,E.normalized,E.colorSpace),V=E.isVideoTexture!==!0,ge=ue.__version===void 0||$===!0,ie=te.dataReady;let ve=T(E,me);Me(t.TEXTURE_CUBE_MAP,E);let we;if(pe){V&&ge&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ve,Xe,me.width,me.height);for(let ae=0;ae<6;ae++){we=xe[ae].mipmaps;for(let Oe=0;Oe<we.length;Oe++){const Ne=we[Oe];E.format!==mi?Ie!==null?V?ie&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe,0,0,Ne.width,Ne.height,Ie,Ne.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe,Xe,Ne.width,Ne.height,0,Ne.data):Ge("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe,0,0,Ne.width,Ne.height,Ie,Be,Ne.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe,Xe,Ne.width,Ne.height,0,Ie,Be,Ne.data)}}}else{if(we=E.mipmaps,V&&ge){we.length>0&&ve++;const ae=ke(xe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ve,Xe,ae.width,ae.height)}for(let ae=0;ae<6;ae++)if(De){V?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,xe[ae].width,xe[ae].height,Ie,Be,xe[ae].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Xe,xe[ae].width,xe[ae].height,0,Ie,Be,xe[ae].data);for(let Oe=0;Oe<we.length;Oe++){const vt=we[Oe].image[ae].image;V?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe+1,0,0,vt.width,vt.height,Ie,Be,vt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe+1,Xe,vt.width,vt.height,0,Ie,Be,vt.data)}}else{V?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,0,0,Ie,Be,xe[ae]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,Xe,Ie,Be,xe[ae]);for(let Oe=0;Oe<we.length;Oe++){const Ne=we[Oe];V?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe+1,0,0,Ie,Be,Ne.image[ae]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ae,Oe+1,Xe,Ie,Be,Ne.image[ae])}}}f(E)&&_(t.TEXTURE_CUBE_MAP),ue.__version=te.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function he(R,E,W,$,te,ue){const fe=s.convert(W.format,W.colorSpace),ne=s.convert(W.type),re=v(W.internalFormat,fe,ne,W.normalized,W.colorSpace),pe=i.get(E),De=i.get(W);if(De.__renderTarget=E,!pe.__hasExternalTextures){const xe=Math.max(1,E.width>>ue),me=Math.max(1,E.height>>ue);te===t.TEXTURE_3D||te===t.TEXTURE_2D_ARRAY?n.texImage3D(te,ue,re,xe,me,E.depth,0,fe,ne,null):n.texImage2D(te,ue,re,xe,me,0,fe,ne,null)}n.bindFramebuffer(t.FRAMEBUFFER,R),Fe(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,$,te,De.__webglTexture,0,Je(E)):(te===t.TEXTURE_2D||te>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,$,te,De.__webglTexture,ue),n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ve(R,E,W){if(t.bindRenderbuffer(t.RENDERBUFFER,R),E.depthBuffer){const $=E.depthTexture,te=$&&$.isDepthTexture?$.type:null,ue=w(E.stencilBuffer,te),fe=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Fe(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Je(E),ue,E.width,E.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,Je(E),ue,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ue,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,fe,t.RENDERBUFFER,R)}else{const $=E.textures;for(let te=0;te<$.length;te++){const ue=$[te],fe=s.convert(ue.format,ue.colorSpace),ne=s.convert(ue.type),re=v(ue.internalFormat,fe,ne,ue.normalized,ue.colorSpace);Fe(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Je(E),re,E.width,E.height):W?t.renderbufferStorageMultisample(t.RENDERBUFFER,Je(E),re,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,re,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function bt(R,E,W){const $=E.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(E.depthTexture);if(te.__renderTarget=E,(!te.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),$){if(te.__webglInit===void 0&&(te.__webglInit=!0,E.depthTexture.addEventListener("dispose",A)),te.__webglTexture===void 0){te.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),Me(t.TEXTURE_CUBE_MAP,E.depthTexture);const pe=s.convert(E.depthTexture.format),De=s.convert(E.depthTexture.type);let xe;E.depthTexture.format===cr?xe=t.DEPTH_COMPONENT24:E.depthTexture.format===ls&&(xe=t.DEPTH24_STENCIL8);for(let me=0;me<6;me++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,xe,E.width,E.height,0,pe,De,null)}}else O(E.depthTexture,0);const ue=te.__webglTexture,fe=Je(E),ne=$?t.TEXTURE_CUBE_MAP_POSITIVE_X+W:t.TEXTURE_2D,re=E.depthTexture.format===ls?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(E.depthTexture.format===cr)Fe(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,ne,ue,0,fe):t.framebufferTexture2D(t.FRAMEBUFFER,re,ne,ue,0);else if(E.depthTexture.format===ls)Fe(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,re,ne,ue,0,fe):t.framebufferTexture2D(t.FRAMEBUFFER,re,ne,ue,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ze(R){const E=i.get(R),W=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){const $=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),$){const te=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,$.removeEventListener("dispose",te)};$.addEventListener("dispose",te),E.__depthDisposeCallback=te}E.__boundDepthTexture=$}if(R.depthTexture&&!E.__autoAllocateDepthBuffer)if(W)for(let $=0;$<6;$++)bt(E.__webglFramebuffer[$],R,$);else{const $=R.texture.mipmaps;$&&$.length>0?bt(E.__webglFramebuffer[0],R,0):bt(E.__webglFramebuffer,R,0)}else if(W){E.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[$]),E.__webglDepthbuffer[$]===void 0)E.__webglDepthbuffer[$]=t.createRenderbuffer(),Ve(E.__webglDepthbuffer[$],R,!1);else{const te=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=E.__webglDepthbuffer[$];t.bindRenderbuffer(t.RENDERBUFFER,ue),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,ue)}}else{const $=R.texture.mipmaps;if($&&$.length>0?n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),Ve(E.__webglDepthbuffer,R,!1);else{const te=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ue),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,ue)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function nt(R,E,W){const $=i.get(R);E!==void 0&&he($.__webglFramebuffer,R,R.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),W!==void 0&&Ze(R)}function dt(R){const E=R.texture,W=i.get(R),$=i.get(E);R.addEventListener("dispose",y);const te=R.textures,ue=R.isWebGLCubeRenderTarget===!0,fe=te.length>1;if(fe||($.__webglTexture===void 0&&($.__webglTexture=t.createTexture()),$.__version=E.version,a.memory.textures++),ue){W.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer[ne]=[];for(let re=0;re<E.mipmaps.length;re++)W.__webglFramebuffer[ne][re]=t.createFramebuffer()}else W.__webglFramebuffer[ne]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer=[];for(let ne=0;ne<E.mipmaps.length;ne++)W.__webglFramebuffer[ne]=t.createFramebuffer()}else W.__webglFramebuffer=t.createFramebuffer();if(fe)for(let ne=0,re=te.length;ne<re;ne++){const pe=i.get(te[ne]);pe.__webglTexture===void 0&&(pe.__webglTexture=t.createTexture(),a.memory.textures++)}if(R.samples>0&&Fe(R)===!1){W.__webglMultisampledFramebuffer=t.createFramebuffer(),W.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ne=0;ne<te.length;ne++){const re=te[ne];W.__webglColorRenderbuffer[ne]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,W.__webglColorRenderbuffer[ne]);const pe=s.convert(re.format,re.colorSpace),De=s.convert(re.type),xe=v(re.internalFormat,pe,De,re.normalized,re.colorSpace,R.isXRRenderTarget===!0),me=Je(R);t.renderbufferStorageMultisample(t.RENDERBUFFER,me,xe,R.width,R.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ne,t.RENDERBUFFER,W.__webglColorRenderbuffer[ne])}t.bindRenderbuffer(t.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=t.createRenderbuffer(),Ve(W.__webglDepthRenderbuffer,R,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(ue){n.bindTexture(t.TEXTURE_CUBE_MAP,$.__webglTexture),Me(t.TEXTURE_CUBE_MAP,E);for(let ne=0;ne<6;ne++)if(E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)he(W.__webglFramebuffer[ne][re],R,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ne,re);else he(W.__webglFramebuffer[ne],R,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);f(E)&&_(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(fe){for(let ne=0,re=te.length;ne<re;ne++){const pe=te[ne],De=i.get(pe);let xe=t.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(xe=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(xe,De.__webglTexture),Me(xe,pe),he(W.__webglFramebuffer,R,pe,t.COLOR_ATTACHMENT0+ne,xe,0),f(pe)&&_(xe)}n.unbindTexture()}else{let ne=t.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(ne=R.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ne,$.__webglTexture),Me(ne,E),E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)he(W.__webglFramebuffer[re],R,E,t.COLOR_ATTACHMENT0,ne,re);else he(W.__webglFramebuffer,R,E,t.COLOR_ATTACHMENT0,ne,0);f(E)&&_(ne),n.unbindTexture()}R.depthBuffer&&Ze(R)}function ee(R){const E=R.textures;for(let W=0,$=E.length;W<$;W++){const te=E[W];if(f(te)){const ue=M(R),fe=i.get(te).__webglTexture;n.bindTexture(ue,fe),_(ue),n.unbindTexture()}}}const Ae=[],qe=[];function We(R){if(R.samples>0){if(Fe(R)===!1){const E=R.textures,W=R.width,$=R.height;let te=t.COLOR_BUFFER_BIT;const ue=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,fe=i.get(R),ne=E.length>1;if(ne)for(let pe=0;pe<E.length;pe++)n.bindFramebuffer(t.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer);const re=R.texture.mipmaps;re&&re.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,fe.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let pe=0;pe<E.length;pe++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(te|=t.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(te|=t.STENCIL_BUFFER_BIT)),ne){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,fe.__webglColorRenderbuffer[pe]);const De=i.get(E[pe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,W,$,0,0,W,$,te,t.NEAREST),l===!0&&(Ae.length=0,qe.length=0,Ae.push(t.COLOR_ATTACHMENT0+pe),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(Ae.push(ue),qe.push(ue),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,qe)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ae))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ne)for(let pe=0;pe<E.length;pe++){n.bindFramebuffer(t.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.RENDERBUFFER,fe.__webglColorRenderbuffer[pe]);const De=i.get(E[pe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,fe.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+pe,t.TEXTURE_2D,De,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){const E=R.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function Je(R){return Math.min(r.maxSamples,R.samples)}function Fe(R){const E=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function H(R){const E=a.render.frame;h.get(R)!==E&&(h.set(R,E),R.update())}function ze(R,E){const W=R.colorSpace,$=R.format,te=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==Xc&&W!==br&&(rt.getTransfer(W)===ft?($!==mi||te!==Bn)&&Ge("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):lt("WebGLTextures: Unsupported texture color space:",W)),E}function ke(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=F,this.getTextureUnits=I,this.setTextureUnits=k,this.setTexture2D=O,this.setTexture2DArray=L,this.setTexture3D=q,this.setTextureCube=Z,this.rebindTextures=nt,this.setupRenderTarget=dt,this.updateRenderTargetMipmap=ee,this.updateMultisampleRenderTarget=We,this.setupDepthRenderbuffer=Ze,this.setupFrameBufferTexture=he,this.useMultisampledRTT=Fe,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function lN(t,e){function n(i,r=br){let s;const a=rt.getTransfer(r);if(i===Bn)return t.UNSIGNED_BYTE;if(i===Bp)return t.UNSIGNED_SHORT_4_4_4_4;if(i===zp)return t.UNSIGNED_SHORT_5_5_5_1;if(i===oy)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===ly)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===sy)return t.BYTE;if(i===ay)return t.SHORT;if(i===Oo)return t.UNSIGNED_SHORT;if(i===kp)return t.INT;if(i===Oi)return t.UNSIGNED_INT;if(i===Ri)return t.FLOAT;if(i===Fi)return t.HALF_FLOAT;if(i===cy)return t.ALPHA;if(i===uy)return t.RGB;if(i===mi)return t.RGBA;if(i===cr)return t.DEPTH_COMPONENT;if(i===ls)return t.DEPTH_STENCIL;if(i===dy)return t.RED;if(i===Hp)return t.RED_INTEGER;if(i===_s)return t.RG;if(i===Vp)return t.RG_INTEGER;if(i===Gp)return t.RGBA_INTEGER;if(i===lc||i===cc||i===uc||i===dc)if(a===ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===lc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===cc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===uc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===dc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===lc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===cc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===uc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===dc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===th||i===nh||i===ih||i===rh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===th)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===nh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ih)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===rh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===sh||i===ah||i===oh||i===lh||i===ch||i===jc||i===uh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===sh||i===ah)return a===ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===oh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===lh)return s.COMPRESSED_R11_EAC;if(i===ch)return s.COMPRESSED_SIGNED_R11_EAC;if(i===jc)return s.COMPRESSED_RG11_EAC;if(i===uh)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===dh||i===fh||i===hh||i===ph||i===mh||i===gh||i===vh||i===_h||i===xh||i===yh||i===Sh||i===Eh||i===Mh||i===wh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===dh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===fh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===hh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ph)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===vh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===_h)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===xh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===yh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Sh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Eh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Mh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===wh)return a===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Th||i===bh||i===Ch)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Th)return a===ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===bh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ch)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ah||i===Rh||i===Wc||i===Ph)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ah)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Rh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Wc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ph)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fo?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const cN=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uN=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class dN{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new yy(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ki({vertexShader:cN,fragmentShader:uN,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new dn(new Su(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fN extends qr{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,p=null,d=null,g=null,x=null;const S=typeof XRWebGLBinding<"u",m=new dN,f={},_=n.getContextAttributes();let M=null,v=null;const w=[],T=[],A=new He;let y=null,C=null;const N=new Jn;N.viewport=new Rt;const D=new Jn;D.viewport=new Rt;const B=[N,D],F=new _1;let I=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let J=w[j];return J===void 0&&(J=new gd,w[j]=J),J.getTargetRaySpace()},this.getControllerGrip=function(j){let J=w[j];return J===void 0&&(J=new gd,w[j]=J),J.getGripSpace()},this.getHand=function(j){let J=w[j];return J===void 0&&(J=new gd,w[j]=J),J.getHandSpace()};function G(j){const J=T.indexOf(j.inputSource);if(J===-1)return;const le=w[J];le!==void 0&&(le.update(j.inputSource,j.frame,c||a),le.dispatchEvent({type:j.type,data:j.inputSource}))}function U(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",U),r.removeEventListener("inputsourceschange",O);for(let j=0;j<w.length;j++){const J=T[j];J!==null&&(T[j]=null,w[j].disconnect(J))}I=null,k=null,m.reset();for(const j in f)delete f[j];if(e.setRenderTarget(M),g=null,d=null,p=null,r=null,v=null,de.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(A.width,A.height,!1),C!==null){const j=C.camera;j.fov=C.fov,j.zoom=C.zoom,j.updateProjectionMatrix(),C=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&Ge("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,i.isPresenting===!0&&Ge("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:g},this.getBinding=function(){return p===null&&S&&(p=new XRWebGLBinding(r,n)),p},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(M=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",U),r.addEventListener("inputsourceschange",O),_.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(A),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let le=null,Ue=null,he=null;_.depth&&(he=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,le=_.stencil?ls:cr,Ue=_.stencil?Fo:Oi);const Ve={colorFormat:n.RGBA8,depthFormat:he,scaleFactor:s};p=this.getBinding(),d=p.createProjectionLayer(Ve),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new _i(d.textureWidth,d.textureHeight,{format:mi,type:Bn,depthTexture:new zo(d.textureWidth,d.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,le),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const le={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(r,n,le),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),v=new _i(g.framebufferWidth,g.framebufferHeight,{format:mi,type:Bn,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),de.setContext(r),de.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function O(j){for(let J=0;J<j.removed.length;J++){const le=j.removed[J],Ue=T.indexOf(le);Ue>=0&&(T[Ue]=null,w[Ue].disconnect(le))}for(let J=0;J<j.added.length;J++){const le=j.added[J];let Ue=T.indexOf(le);if(Ue===-1){for(let Ve=0;Ve<w.length;Ve++)if(Ve>=T.length){T.push(le),Ue=Ve;break}else if(T[Ve]===null){T[Ve]=le,Ue=Ve;break}if(Ue===-1)break}const he=w[Ue];he&&he.connect(le)}}const L=new X,q=new X;function Z(j,J,le){L.setFromMatrixPosition(J.matrixWorld),q.setFromMatrixPosition(le.matrixWorld);const Ue=L.distanceTo(q),he=J.projectionMatrix.elements,Ve=le.projectionMatrix.elements,bt=he[14]/(he[10]-1),Ze=he[14]/(he[10]+1),nt=(he[9]+1)/he[5],dt=(he[9]-1)/he[5],ee=(he[8]-1)/he[0],Ae=(Ve[8]+1)/Ve[0],qe=bt*ee,We=bt*Ae,Je=Ue/(-ee+Ae),Fe=Je*-ee;if(J.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Fe),j.translateZ(Je),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),he[10]===-1)j.projectionMatrix.copy(J.projectionMatrix),j.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const H=bt+Je,ze=Ze+Je,ke=qe-Fe,R=We+(Ue-Fe),E=nt*Ze/ze*H,W=dt*Ze/ze*H;j.projectionMatrix.makePerspective(ke,R,E,W,H,ze),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function ce(j,J){J===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(J.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let J=j.near,le=j.far;m.texture!==null&&(m.depthNear>0&&(J=m.depthNear),m.depthFar>0&&(le=m.depthFar)),F.near=D.near=N.near=J,F.far=D.far=N.far=le,(I!==F.near||k!==F.far)&&(r.updateRenderState({depthNear:F.near,depthFar:F.far}),I=F.near,k=F.far),F.layers.mask=j.layers.mask|6,N.layers.mask=F.layers.mask&-5,D.layers.mask=F.layers.mask&-3;const Ue=j.parent,he=F.cameras;ce(F,Ue);for(let Ve=0;Ve<he.length;Ve++)ce(he[Ve],Ue);he.length===2?Z(F,N,D):F.projectionMatrix.copy(N.projectionMatrix),C===null&&j.isPerspectiveCamera&&(C={camera:j,fov:j.fov,zoom:j.zoom}),_e(j,F,Ue)};function _e(j,J,le){le===null?j.matrix.copy(J.matrixWorld):(j.matrix.copy(le.matrixWorld),j.matrix.invert(),j.matrix.multiply(J.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(J.projectionMatrix),j.projectionMatrixInverse.copy(J.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Lh*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&g===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(j){return f[j]};let se=null;function Me(j,J){if(h=J.getViewerPose(c||a),x=J,h!==null){const le=h.views;g!==null&&(e.setRenderTargetFramebuffer(v,g.framebuffer),e.setRenderTarget(v));let Ue=!1;le.length!==F.cameras.length&&(F.cameras.length=0,Ue=!0);for(let Ze=0;Ze<le.length;Ze++){const nt=le[Ze];let dt=null;if(g!==null)dt=g.getViewport(nt);else{const Ae=p.getViewSubImage(d,nt);dt=Ae.viewport,Ze===0&&(e.setRenderTargetTextures(v,Ae.colorTexture,Ae.depthStencilTexture),e.setRenderTarget(v))}let ee=B[Ze];ee===void 0&&(ee=new Jn,ee.layers.enable(Ze),ee.viewport=new Rt,B[Ze]=ee),ee.matrix.fromArray(nt.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(nt.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(dt.x,dt.y,dt.width,dt.height),Ze===0&&(F.matrix.copy(ee.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ue===!0&&F.cameras.push(ee)}const he=r.enabledFeatures;if(he&&he.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){p=i.getBinding();const Ze=p.getDepthInformation(le[0]);Ze&&Ze.isValid&&Ze.texture&&m.init(Ze,r.renderState)}if(he&&he.includes("camera-access")&&S){e.state.unbindTexture(),p=i.getBinding();for(let Ze=0;Ze<le.length;Ze++){const nt=le[Ze].camera;if(nt){let dt=f[nt];dt||(dt=new yy,f[nt]=dt);const ee=p.getCameraImage(nt);dt.sourceTexture=ee}}}}for(let le=0;le<w.length;le++){const Ue=T[le],he=w[le];Ue!==null&&he!==void 0&&he.update(Ue,J,c||a)}se&&se(j,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),x=null}const de=new wy;de.setAnimationLoop(Me),this.setAnimationLoop=function(j){se=j},this.dispose=function(){}}}const hN=new It,Ny=new je;Ny.set(-1,0,0,0,1,0,0,0,1);function pN(t,e){function n(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Sy(t)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function r(m,f,_,M,v){f.isNodeMaterial?f.uniformsNeedUpdate=!1:f.isMeshBasicMaterial?s(m,f):f.isMeshLambertMaterial?(s(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshToonMaterial?(s(m,f),p(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)):f.isMeshStandardMaterial?(s(m,f),d(m,f),f.isMeshPhysicalMaterial&&g(m,f,v)):f.isMeshMatcapMaterial?(s(m,f),x(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),S(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,_,M):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,n(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ln&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,n(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ln&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,n(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,n(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,n(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const _=e.get(f),M=_.envMap,v=_.envMapRotation;M&&(m.envMap.value=M,m.envMapRotation.value.setFromMatrix4(hN.makeRotationFromEuler(v)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ny),m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,n(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,n(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,_,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*_,m.scale.value=M*.5,f.map&&(m.map.value=f.map,n(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,n(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,n(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function p(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,n(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,n(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function g(m,f,_){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,n(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,n(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,n(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,n(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,n(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ln&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.retroreflectivity>0&&(m.retroreflectivity.value=f.retroreflectivity),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,n(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,n(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,n(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,n(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,n(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,n(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,n(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function S(m,f){const _=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function mN(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,w){const T=w.program;i.uniformBlockBinding(v,T)}function c(v,w){let T=r[v.id];T===void 0&&(m(v),T=h(v),r[v.id]=T,v.addEventListener("dispose",_));const A=w.program;i.updateUBOMapping(v,A);const y=e.render.frame;s[v.id]!==y&&(d(v),s[v.id]=y)}function h(v){const w=p();v.__bindingPointIndex=w;const T=t.createBuffer(),A=v.__size,y=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,T),t.bufferData(t.UNIFORM_BUFFER,A,y),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,w,T),T}function p(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return lt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){const w=r[v.id],T=v.uniforms,A=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,w);for(let y=0,C=T.length;y<C;y++){const N=T[y];if(Array.isArray(N))for(let D=0,B=N.length;D<B;D++)g(N[D],y,D,A);else g(N,y,0,A)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function g(v,w,T,A){if(S(v,w,T,A)===!0){const y=v.__offset,C=v.value;if(Array.isArray(C)){let N=0;for(let D=0;D<C.length;D++){const B=C[D],F=f(B);x(B,v.__data,N),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(N+=F.storage/Float32Array.BYTES_PER_ELEMENT)}}else x(C,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,y,v.__data)}}function x(v,w,T){typeof v=="number"||typeof v=="boolean"?w[0]=v:v.isMatrix3?(w[0]=v.elements[0],w[1]=v.elements[1],w[2]=v.elements[2],w[3]=0,w[4]=v.elements[3],w[5]=v.elements[4],w[6]=v.elements[5],w[7]=0,w[8]=v.elements[6],w[9]=v.elements[7],w[10]=v.elements[8],w[11]=0):ArrayBuffer.isView(v)?w.set(new v.constructor(v.buffer,v.byteOffset,w.length)):v.toArray(w,T)}function S(v,w,T,A){const y=v.value,C=w+"_"+T;if(A[C]===void 0)return typeof y=="number"||typeof y=="boolean"?A[C]=y:ArrayBuffer.isView(y)?A[C]=y.slice():A[C]=y.clone(),!0;{const N=A[C];if(typeof y=="number"||typeof y=="boolean"){if(N!==y)return A[C]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(N.equals(y)===!1)return N.copy(y),!0}}return!1}function m(v){const w=v.uniforms;let T=0;const A=16;for(let C=0,N=w.length;C<N;C++){const D=Array.isArray(w[C])?w[C]:[w[C]];for(let B=0,F=D.length;B<F;B++){const I=D[B],k=Array.isArray(I.value)?I.value:[I.value];for(let G=0,U=k.length;G<U;G++){const O=k[G],L=f(O),q=T%A,Z=q%L.boundary,ce=q+Z;T+=Z,ce!==0&&A-ce<L.storage&&(T+=A-ce),I.__data=new Float32Array(L.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=T,T+=L.storage}}}const y=T%A;return y>0&&(T+=A-y),v.__size=T,v.__cache={},this}function f(v){const w={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(w.boundary=4,w.storage=4):v.isVector2?(w.boundary=8,w.storage=8):v.isVector3||v.isColor?(w.boundary=16,w.storage=12):v.isVector4?(w.boundary=16,w.storage=16):v.isMatrix3?(w.boundary=48,w.storage=48):v.isMatrix4?(w.boundary=64,w.storage=64):v.isTexture?Ge("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(w.boundary=16,w.storage=v.byteLength):Ge("WebGLRenderer: Unsupported uniform value type.",v),w}function _(v){const w=v.target;w.removeEventListener("dispose",_);const T=a.indexOf(w.__bindingPointIndex);a.splice(T,1),t.deleteBuffer(r[w.id]),delete r[w.id],delete s[w.id]}function M(){for(const v in r)t.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:l,update:c,dispose:M}}const gN=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let wi=null;function vN(){return wi===null&&(wi=new e1(gN,16,16,_s,Fi),wi.name="DFG_LUT",wi.minFilter=hn,wi.magFilter=hn,wi.wrapS=Ji,wi.wrapT=Ji,wi.generateMipmaps=!1,wi.needsUpdate=!0),wi}class _N{constructor(e={}){const{canvas:n=Ab(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:d=!1,outputBufferType:g=Bn}=e;this.isWebGLRenderer=!0;let x;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");x=i.getContextAttributes().alpha}else x=a;const S=g,m=new Set([Gp,Vp,Hp]),f=new Set([Bn,Oi,Oo,Fo,Bp,zp]),_=new Uint32Array(4),M=new Int32Array(4),v=new X;let w=null,T=null;const A=[],y=[];let C=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ii,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let D=!1,B=null,F=null,I=null,k=null;this._outputColorSpace=kn;let G=0,U=0,O=null,L=-1,q=null;const Z=new Rt,ce=new Rt;let _e=null;const se=new Ke(0);let Me=0,de=n.width,j=n.height,J=1,le=null,Ue=null;const he=new Rt(0,0,de,j),Ve=new Rt(0,0,de,j);let bt=!1;const Ze=new Yp;let nt=!1,dt=!1;const ee=new It,Ae=new X,qe=new Rt,We={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Je=!1;function Fe(){return O===null?J:1}let H=i;function ze(b,z){return n.getContext(b,z)}let ke,R,E,W,$,te,ue,fe,ne,re,pe,De,xe,me,Ie,Be,Xe,V,ge,ie,ve,we,ae;try{const b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:p};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Fp}`),n.addEventListener("webglcontextlost",vt,!1),n.addEventListener("webglcontextrestored",ct,!1),n.addEventListener("webglcontextcreationerror",si,!1),H===null){const z="webgl2";if(H=ze(z,b),H===null)throw ze(z)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Oe()}catch(b){throw n.removeEventListener("webglcontextlost",vt,!1),n.removeEventListener("webglcontextrestored",ct,!1),n.removeEventListener("webglcontextcreationerror",si,!1),lt("WebGLRenderer: "+b.message),b}function Oe(){ke=new vR(H),ke.init(),ve=new lN(H,ke),R=new oR(H,ke,e,ve),E=new aN(H,ke),R.reversedDepthBuffer&&d&&E.buffers.depth.setReversed(!0),F=H.createFramebuffer(),I=H.createFramebuffer(),k=H.createFramebuffer(),W=new yR(H),$=new XP,te=new oN(H,ke,E,$,R,ve,W),ue=new gR(N),fe=new E1(H),we=new sR(H,fe),ne=new _R(H,fe,W,we),re=new ER(H,ne,fe,we,W),V=new SR(H,R,te),Ie=new lR($),pe=new WP(N,ue,ke,R,we,Ie),De=new pN(N,$),xe=new $P,me=new eN(ke),Xe=new rR(N,ue,E,re,x,l),Be=new sN(N,re,R),ae=new mN(H,W,R,E),ge=new aR(H,ke,W),ie=new xR(H,ke,W),W.programs=pe.programs,N.capabilities=R,N.extensions=ke,N.properties=$,N.renderLists=xe,N.shadowMap=Be,N.state=E,N.info=W}S!==Bn&&(C=new wR(S,n.width,n.height,o,r,s));const Ne=new fN(N,H);this.xr=Ne,this.getContext=function(){return H},this.getContextAttributes=function(){return H.getContextAttributes()},this.forceContextLoss=function(){const b=ke.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=ke.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(b){b!==void 0&&(J=b,this.setSize(de,j,!1))},this.getSize=function(b){return b.set(de,j)},this.setSize=function(b,z,Q=!0){if(Ne.isPresenting){Ge("WebGLRenderer: Can't change size while VR device is presenting.");return}de=b,j=z,n.width=Math.floor(b*J),n.height=Math.floor(z*J),Q===!0&&(n.style.width=b+"px",n.style.height=z+"px"),C!==null&&C.setSize(n.width,n.height),this.setViewport(0,0,b,z)},this.getDrawingBufferSize=function(b){return b.set(de*J,j*J).floor()},this.setDrawingBufferSize=function(b,z,Q){de=b,j=z,J=Q,n.width=Math.floor(b*Q),n.height=Math.floor(z*Q),this.setViewport(0,0,b,z)},this.setEffects=function(b){if(S===Bn){lt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let z=0;z<b.length;z++)if(b[z].isOutputPass===!0){Ge("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(Z)},this.getViewport=function(b){return b.copy(he)},this.setViewport=function(b,z,Q,Y){b.isVector4?he.set(b.x,b.y,b.z,b.w):he.set(b,z,Q,Y),E.viewport(Z.copy(he).multiplyScalar(J).round())},this.getScissor=function(b){return b.copy(Ve)},this.setScissor=function(b,z,Q,Y){b.isVector4?Ve.set(b.x,b.y,b.z,b.w):Ve.set(b,z,Q,Y),E.scissor(ce.copy(Ve).multiplyScalar(J).round())},this.getScissorTest=function(){return bt},this.setScissorTest=function(b){E.setScissorTest(bt=b)},this.setOpaqueSort=function(b){le=b},this.setTransparentSort=function(b){Ue=b},this.getClearColor=function(b){return b.copy(Xe.getClearColor())},this.setClearColor=function(){Xe.setClearColor(...arguments)},this.getClearAlpha=function(){return Xe.getClearAlpha()},this.setClearAlpha=function(){Xe.setClearAlpha(...arguments)},this.clear=function(b=!0,z=!0,Q=!0){let Y=0;if(b){let K=!1;if(O!==null){const Ee=O.texture.format;K=m.has(Ee)}if(K){const Ee=O.texture.type,be=f.has(Ee),Se=Xe.getClearColor(),Re=Xe.getClearAlpha(),Le=Se.r,$e=Se.g,Qe=Se.b;be?(_[0]=Le,_[1]=$e,_[2]=Qe,_[3]=Re,H.clearBufferuiv(H.COLOR,0,_)):(M[0]=Le,M[1]=$e,M[2]=Qe,M[3]=Re,H.clearBufferiv(H.COLOR,0,M))}else Y|=H.COLOR_BUFFER_BIT}z&&(Y|=H.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&(Y|=H.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Y!==0&&H.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),B=b},this.dispose=function(){n.removeEventListener("webglcontextlost",vt,!1),n.removeEventListener("webglcontextrestored",ct,!1),n.removeEventListener("webglcontextcreationerror",si,!1),Xe.dispose(),xe.dispose(),me.dispose(),$.dispose(),ue.dispose(),re.dispose(),we.dispose(),ae.dispose(),pe.dispose(),Ne.dispose(),Ne.removeEventListener("sessionstart",om),Ne.removeEventListener("sessionend",lm),$r.stop()};function vt(b){b.preventDefault(),nv("WebGLRenderer: Context Lost."),D=!0}function ct(){nv("WebGLRenderer: Context Restored."),D=!1;const b=W.autoReset,z=Be.enabled,Q=Be.autoUpdate,Y=Be.needsUpdate,K=Be.type;Oe(),W.autoReset=b,Be.enabled=z,Be.autoUpdate=Q,Be.needsUpdate=Y,Be.type=K}function si(b){lt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function yi(b){const z=b.target;z.removeEventListener("dispose",yi),zy(z)}function zy(b){Hy(b),$.remove(b)}function Hy(b){const z=$.get(b).programs;z!==void 0&&(z.forEach(function(Q){pe.releaseProgram(Q)}),b.isShaderMaterial&&pe.releaseShaderCache(b))}this.renderBufferDirect=function(b,z,Q,Y,K,Ee){z===null&&(z=We);const be=K.isMesh&&K.matrixWorld.determinantAffine()<0,Se=jy(b,z,Q,Y,K);E.setMaterial(Y,be);let Re=Q.index,Le=1;if(Y.wireframe===!0){if(Re=ne.getWireframeAttribute(Q),Re===void 0)return;Le=2}const $e=Q.drawRange,Qe=Q.attributes.position;let Pe=$e.start*Le,ut=($e.start+$e.count)*Le;Ee!==null&&(Pe=Math.max(Pe,Ee.start*Le),ut=Math.min(ut,(Ee.start+Ee.count)*Le)),Re!==null?(Pe=Math.max(Pe,0),ut=Math.min(ut,Re.count)):Qe!=null&&(Pe=Math.max(Pe,0),ut=Math.min(ut,Qe.count));const kt=ut-Pe;if(kt<0||kt===1/0)return;we.setup(K,Y,Se,Q,Re);let yt,gt=ge;if(Re!==null&&(yt=fe.get(Re),gt=ie,gt.setIndex(yt)),K.isMesh)Y.wireframe===!0?(E.setLineWidth(Y.wireframeLinewidth*Fe()),gt.setMode(H.LINES)):gt.setMode(H.TRIANGLES);else if(K.isLine){let an=Y.linewidth;an===void 0&&(an=1),E.setLineWidth(an*Fe()),K.isLineSegments?gt.setMode(H.LINES):K.isLineLoop?gt.setMode(H.LINE_LOOP):gt.setMode(H.LINE_STRIP)}else K.isPoints?gt.setMode(H.POINTS):K.isSprite&&gt.setMode(H.TRIANGLES);if(K.isBatchedMesh)if(ke.get("WEBGL_multi_draw"))gt.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{const an=K._multiDrawStarts,Te=K._multiDrawCounts,gn=K._multiDrawCount,st=Re?fe.get(Re).bytesPerElement:1,Xn=$.get(Y).currentProgram.getUniforms();for(let Si=0;Si<gn;Si++)Xn.setValue(H,"_gl_DrawID",Si),gt.render(an[Si]/st,Te[Si])}else if(K.isInstancedMesh)gt.renderInstances(Pe,kt,K.count);else if(Q.isInstancedBufferGeometry){const an=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Te=Math.min(Q.instanceCount,an);gt.renderInstances(Pe,kt,Te)}else gt.render(Pe,kt)};function am(b,z,Q,Y){B!==null&&b.isNodeMaterial&&B.setObject(Y,b),nt===!0&&Ie.setState(b,Q,!1),b.transparent===!0&&b.side===Ai&&b.forceSinglePass===!1?(b.side=Ln,b.needsUpdate=!0,Zo(b,z,Y),b.side=gs,b.needsUpdate=!0,Zo(b,z,Y),b.side=Ai):Zo(b,z,Y)}this.compile=function(b,z,Q=null){Q===null&&(Q=b),B!==null&&B.renderStart(b,z,Q),T=me.get(Q),T.init(z),y.push(T),Q.traverseVisible(function(K){K.isLight&&K.layers.test(z.layers)&&(T.pushLight(K),K.castShadow&&T.pushShadow(K))}),b!==Q&&b.traverseVisible(function(K){K.isLight&&K.layers.test(z.layers)&&(T.pushLight(K),K.castShadow&&T.pushShadow(K))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),dt=this.localClippingEnabled,nt=Ie.init(this.clippingPlanes,dt),nt===!0&&Ie.setGlobalState(this.clippingPlanes,z),B!==null&&Be.render(T.state.shadowsArray,Q,z);const Y=new Set;return b.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;const Ee=K.material;if(Ee)if(Array.isArray(Ee))for(let be=0;be<Ee.length;be++){const Se=Ee[be];am(Se,Q,z,K),Y.add(Se)}else am(Ee,Q,z,K),Y.add(Ee)}),T=y.pop(),B!==null&&B.renderEnd(),Y},this.compileAsync=function(b,z,Q=null){const Y=this.compile(b,z,Q);return new Promise(K=>{function Ee(){if(Y.forEach(function(be){const Re=$.get(be).currentProgram;(Re===void 0||Re.isReady())&&Y.delete(be)}),Y.size===0){K(b);return}setTimeout(Ee,10)}ke.get("KHR_parallel_shader_compile")!==null?Ee():setTimeout(Ee,10)})};let wu=null;function Vy(b){wu&&wu(b)}function om(){$r.stop()}function lm(){$r.start()}const $r=new wy;$r.setAnimationLoop(Vy),typeof self<"u"&&$r.setContext(self),this.setAnimationLoop=function(b){wu=b,Ne.setAnimationLoop(b),b===null?$r.stop():$r.start()},Ne.addEventListener("sessionstart",om),Ne.addEventListener("sessionend",lm),this.render=function(b,z){if(z!==void 0&&z.isCamera!==!0){lt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;B!==null&&B.renderStart(b,z);const Q=Ne.enabled===!0&&Ne.isPresenting===!0,Y=C!==null&&(O===null||Q)&&C.begin(N,O);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),Ne.enabled===!0&&Ne.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(Ne.cameraAutoUpdate===!0&&Ne.updateCamera(z),z=Ne.getCamera()),b.isScene===!0&&b.onBeforeRender(N,b,z,O),T=me.get(b,y.length),T.init(z),T.state.textureUnits=te.getTextureUnits(),y.push(T),ee.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Ze.setFromProjectionMatrix(ee,Pi,z.reversedDepth),dt=this.localClippingEnabled,nt=Ie.init(this.clippingPlanes,dt),w=xe.get(b,A.length),w.init(),A.push(w),Ne.enabled===!0&&Ne.isPresenting===!0){const be=N.xr.getDepthSensingMesh();be!==null&&Tu(be,z,-1/0,N.sortObjects)}Tu(b,z,0,N.sortObjects),w.finish(),B!==null&&B.updateLights(T.state.lightsArray),N.sortObjects===!0&&w.sort(le,Ue),Je=Ne.enabled===!1||Ne.isPresenting===!1||Ne.hasDepthSensing()===!1,Je&&Xe.addToRenderList(w,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),nt===!0&&Ie.beginShadows();const K=T.state.shadowsArray;if(Be.render(K,b,z),nt===!0&&Ie.endShadows(),(Y&&C.hasRenderPass())===!1){const be=w.opaque,Se=w.transmissive;if(T.setupLights(),z.isArrayCamera){const Re=z.cameras;if(Se.length>0)for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le];um(be,Se,b,Qe)}Je&&Xe.render(b);for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le];cm(w,b,Qe,Qe.viewport)}}else Se.length>0&&um(be,Se,b,z),Je&&Xe.render(b),cm(w,b,z)}O!==null&&U===0&&(te.updateMultisampleRenderTarget(O),te.updateRenderTargetMipmap(O)),Y&&C.end(N),b.isScene===!0&&b.onAfterRender(N,b,z),we.resetDefaultState(),L=-1,q=null,y.pop(),y.length>0?(T=y[y.length-1],te.setTextureUnits(T.state.textureUnits),nt===!0&&Ie.setGlobalState(N.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?w=A[A.length-1]:w=null,B!==null&&B.renderEnd()};function Tu(b,z,Q,Y){if(b.visible===!1)return;if(b.layers.test(z.layers)){if(b.isGroup)Q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(z);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(Ze)){Y&&qe.setFromMatrixPosition(b.matrixWorld).applyMatrix4(ee);const be=re.update(b),Se=b.material;Se.visible&&w.push(b,be,Se,Q,qe.z,null,z)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(Ze))){const be=re.update(b),Se=b.material;if(Y&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),qe.copy(b.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),qe.copy(be.boundingSphere.center)),qe.applyMatrix4(b.matrixWorld).applyMatrix4(ee)),Array.isArray(Se)){const Re=be.groups;for(let Le=0,$e=Re.length;Le<$e;Le++){const Qe=Re[Le],Pe=Se[Qe.materialIndex];Pe&&Pe.visible&&w.push(b,be,Pe,Q,qe.z,Qe,z)}}else Se.visible&&w.push(b,be,Se,Q,qe.z,null,z)}}const Ee=b.children;for(let be=0,Se=Ee.length;be<Se;be++)Tu(Ee[be],z,Q,Y)}function cm(b,z,Q,Y){const{opaque:K,transmissive:Ee,transparent:be}=b;T.setupLightsView(Q),nt===!0&&Ie.setGlobalState(N.clippingPlanes,Q),Y&&E.viewport(Z.copy(Y)),K.length>0&&Ko(K,z,Q),Ee.length>0&&Ko(Ee,z,Q),be.length>0&&Ko(be,z,Q),E.buffers.depth.setTest(!0),E.buffers.depth.setMask(!0),E.buffers.color.setMask(!0),E.setPolygonOffset(!1)}function um(b,z,Q,Y){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[Y.id]===void 0){const Pe=ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[Y.id]=new _i(1,1,{generateMipmaps:!0,type:Pe?Fi:Bn,minFilter:os,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:rt.workingColorSpace})}const Ee=T.state.transmissionRenderTarget[Y.id],be=Y.viewport||Z;Ee.setSize(be.z*N.transmissionResolutionScale,be.w*N.transmissionResolutionScale);const Se=N.getRenderTarget(),Re=N.getActiveCubeFace(),Le=N.getActiveMipmapLevel();N.setRenderTarget(Ee),N.getClearColor(se),Me=N.getClearAlpha(),Me<1&&N.setClearColor(16777215,.5),N.clear(),Je&&Xe.render(Q);const $e=N.toneMapping;N.toneMapping=Ii;const Qe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),T.setupLightsView(Y),nt===!0&&Ie.setGlobalState(N.clippingPlanes,Y),Ko(b,Q,Y),te.updateMultisampleRenderTarget(Ee),te.updateRenderTargetMipmap(Ee),ke.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let ut=0,kt=z.length;ut<kt;ut++){const yt=z[ut],{object:gt,geometry:an,material:Te,group:gn}=yt;if(Te.side===Ai&&gt.layers.test(Y.layers)){const st=Te.side;Te.side=Ln,Te.needsUpdate=!0,dm(gt,Q,Y,an,Te,gn),Te.side=st,Te.needsUpdate=!0,Pe=!0}}Pe===!0&&(te.updateMultisampleRenderTarget(Ee),te.updateRenderTargetMipmap(Ee))}N.setRenderTarget(Se,Re,Le),N.setClearColor(se,Me),Qe!==void 0&&(Y.viewport=Qe),N.toneMapping=$e}function Ko(b,z,Q){const Y=z.isScene===!0?z.overrideMaterial:null;for(let K=0,Ee=b.length;K<Ee;K++){const be=b[K],{object:Se,geometry:Re,group:Le}=be;let $e=be.material;$e.allowOverride===!0&&Y!==null&&($e=Y),Se.layers.test(Q.layers)&&dm(Se,z,Q,Re,$e,Le)}}function dm(b,z,Q,Y,K,Ee){B!==null&&K.isNodeMaterial&&B.setObject(b,K),b.onBeforeRender(N,z,Q,Y,K,Ee),b.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),K.onBeforeRender(N,z,Q,Y,b,Ee),K.transparent===!0&&K.side===Ai&&K.forceSinglePass===!1?(K.side=Ln,K.needsUpdate=!0,N.renderBufferDirect(Q,z,Y,K,b,Ee),K.side=gs,K.needsUpdate=!0,N.renderBufferDirect(Q,z,Y,K,b,Ee),K.side=Ai):N.renderBufferDirect(Q,z,Y,K,b,Ee),b.onAfterRender(N,z,Q,Y,K,Ee)}function Zo(b,z,Q){z.isScene!==!0&&(z=We);const Y=$.get(b),K=T.state.lights,Ee=T.state.shadowsArray,be=K.state.version,Se=pe.getParameters(b,K.state,Ee,z,Q,T.state.lightProbeGridArray),Re=pe.getProgramCacheKey(Se);let Le=Y.programs;Y.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?z.environment:null,Y.fog=z.fog;const $e=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;Y.envMap=ue.get(b.envMap||Y.environment,$e),Y.envMapRotation=Y.environment!==null&&b.envMap===null?z.environmentRotation:b.envMapRotation,Le===void 0&&(b.addEventListener("dispose",yi),Le=new Map,Y.programs=Le);let Qe=Le.get(Re);if(Qe!==void 0){if(Y.currentProgram===Qe&&Y.lightsStateVersion===be)return hm(b,Se),Qe}else Se.uniforms=pe.getUniforms(b),B!==null&&b.isNodeMaterial&&B.build(b,Q,Se),b.onBeforeCompile(Se,N),Qe=pe.acquireProgram(Se,Re),Le.set(Re,Qe),Y.uniforms=Se.uniforms;const Pe=Y.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Pe.clippingPlanes=Ie.uniform),hm(b,Se),Y.needsLights=Xy(b),Y.lightsStateVersion=be,Y.needsLights&&(Pe.ambientLightColor.value=K.state.ambient,Pe.lightProbe.value=K.state.probe,Pe.sunLights.value=K.state.sun,Pe.sunLightShadows.value=K.state.sunShadow,Pe.directionalLights.value=K.state.directional,Pe.directionalLightShadows.value=K.state.directionalShadow,Pe.spotLights.value=K.state.spot,Pe.spotLightShadows.value=K.state.spotShadow,Pe.rectAreaLights.value=K.state.rectArea,Pe.ltc_1.value=K.state.rectAreaLTC1,Pe.ltc_2.value=K.state.rectAreaLTC2,Pe.pointLights.value=K.state.point,Pe.pointLightShadows.value=K.state.pointShadow,Pe.hemisphereLights.value=K.state.hemi,Pe.sunShadowMatrix.value=K.state.sunShadowMatrix,Pe.sunShadowCascade.value=K.state.sunShadowCascade,Pe.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Pe.spotLightMatrix.value=K.state.spotLightMatrix,Pe.spotLightMap.value=K.state.spotLightMap,Pe.pointShadowMatrix.value=K.state.pointShadowMatrix),Y.lightProbeGrid=T.state.lightProbeGridArray.length>0,Y.currentProgram=Qe,Y.uniformsList=null,Qe}function fm(b){if(b.uniformsList===null){const z=b.currentProgram.getUniforms();b.uniformsList=hc.seqWithValue(z.seq,b.uniforms)}return b.uniformsList}function hm(b,z){const Q=$.get(b);Q.outputColorSpace=z.outputColorSpace,Q.batching=z.batching,Q.batchingColor=z.batchingColor,Q.instancing=z.instancing,Q.instancingColor=z.instancingColor,Q.instancingMorph=z.instancingMorph,Q.skinning=z.skinning,Q.morphTargets=z.morphTargets,Q.morphNormals=z.morphNormals,Q.morphColors=z.morphColors,Q.morphTargetsCount=z.morphTargetsCount,Q.numClippingPlanes=z.numClippingPlanes,Q.numIntersection=z.numClipIntersection,Q.vertexAlphas=z.vertexAlphas,Q.vertexTangents=z.vertexTangents,Q.toneMapping=z.toneMapping}function Gy(b,z){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;v.setFromMatrixPosition(z.matrixWorld);for(let Q=0,Y=b.length;Q<Y;Q++){const K=b[Q];if(K.texture!==null&&K.boundingBox.containsPoint(v))return K}return null}function jy(b,z,Q,Y,K){z.isScene!==!0&&(z=We),te.resetTextureUnits();const Ee=z.fog,be=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial?z.environment:null,Se=O===null?N.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:rt.workingColorSpace,Re=Y.isMeshStandardMaterial||Y.isMeshLambertMaterial&&!Y.envMap||Y.isMeshPhongMaterial&&!Y.envMap,Le=ue.get(Y.envMap||be,Re),$e=Y.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,Qe=!!Q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Pe=!!Q.morphAttributes.position,ut=!!Q.morphAttributes.normal,kt=!!Q.morphAttributes.color;let yt=Ii;Y.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(yt=N.toneMapping);const gt=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,an=gt!==void 0?gt.length:0,Te=$.get(Y),gn=T.state.lights;if(nt===!0&&(dt===!0||b!==q)){const _t=b===q&&Y.id===L;Ie.setState(Y,b,_t)}let st=!1;Y.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==gn.state.version||Te.outputColorSpace!==Se||K.isBatchedMesh&&Te.batching===!1||!K.isBatchedMesh&&Te.batching===!0||K.isBatchedMesh&&Te.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Te.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Te.instancing===!1||!K.isInstancedMesh&&Te.instancing===!0||K.isSkinnedMesh&&Te.skinning===!1||!K.isSkinnedMesh&&Te.skinning===!0||K.isInstancedMesh&&Te.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Te.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Te.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Te.instancingMorph===!1&&K.morphTexture!==null||Te.envMap!==Le||Y.fog===!0&&Te.fog!==Ee||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==Ie.numPlanes||Te.numIntersection!==Ie.numIntersection)||Te.vertexAlphas!==$e||Te.vertexTangents!==Qe||Te.morphTargets!==Pe||Te.morphNormals!==ut||Te.morphColors!==kt||Te.toneMapping!==yt||Te.morphTargetsCount!==an||!!Te.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(st=!0):(st=!0,Te.__version=Y.version);let Xn=Te.currentProgram;st===!0&&(Xn=Zo(Y,z,K),B&&Y.isNodeMaterial&&B.onUpdateProgram(Y,Xn,Te));let Si=!1,fr=!1,Ss=!1;const mt=Xn.getUniforms(),Ut=Te.uniforms;if(E.useProgram(Xn.program)&&(Si=!0,fr=!0,Ss=!0),Y.id!==L&&(L=Y.id,fr=!0),Te.needsLights){const _t=Gy(T.state.lightProbeGridArray,K);Te.lightProbeGrid!==_t&&(Te.lightProbeGrid=_t,fr=!0)}if(Si||q!==b){E.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),mt.setValue(H,"projectionMatrix",b.projectionMatrix),mt.setValue(H,"viewMatrix",b.matrixWorldInverse);const pr=mt.map.cameraPosition;pr!==void 0&&pr.setValue(H,Ae.setFromMatrixPosition(b.matrixWorld)),R.logarithmicDepthBuffer&&mt.setValue(H,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&mt.setValue(H,"isOrthographic",b.isOrthographicCamera===!0),q!==b&&(q=b,fr=!0,Ss=!0)}if(Te.needsLights&&(gn.state.sunShadowMap.length>0&&mt.setValue(H,"sunShadowMap",gn.state.sunShadowMap,te),gn.state.directionalShadowMap.length>0&&mt.setValue(H,"directionalShadowMap",gn.state.directionalShadowMap,te),gn.state.spotShadowMap.length>0&&mt.setValue(H,"spotShadowMap",gn.state.spotShadowMap,te),gn.state.pointShadowMap.length>0&&mt.setValue(H,"pointShadowMap",gn.state.pointShadowMap,te)),K.isSkinnedMesh){mt.setOptional(H,K,"bindMatrix"),mt.setOptional(H,K,"bindMatrixInverse");const _t=K.skeleton;_t&&(_t.boneTexture===null&&_t.computeBoneTexture(),mt.setValue(H,"boneTexture",_t.boneTexture,te))}K.isBatchedMesh&&(mt.setOptional(H,K,"batchingTexture"),mt.setValue(H,"batchingTexture",K._matricesTexture,te),mt.setOptional(H,K,"batchingIdTexture"),mt.setValue(H,"batchingIdTexture",K._indirectTexture,te),mt.setOptional(H,K,"batchingColorTexture"),K._colorsTexture!==null&&mt.setValue(H,"batchingColorTexture",K._colorsTexture,te));const hr=Q.morphAttributes;if((hr.position!==void 0||hr.normal!==void 0||hr.color!==void 0)&&V.update(K,Q,Xn),(fr||Te.receiveShadow!==K.receiveShadow)&&(Te.receiveShadow=K.receiveShadow,mt.setValue(H,"receiveShadow",K.receiveShadow)),(Y.isMeshStandardMaterial||Y.isMeshLambertMaterial||Y.isMeshPhongMaterial)&&Y.envMap===null&&z.environment!==null&&(Ut.envMapIntensity.value=z.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=vN()),fr){if(mt.setValue(H,"toneMappingExposure",N.toneMappingExposure),Te.needsLights&&Wy(Ut,Ss),Ee&&Y.fog===!0&&De.refreshFogUniforms(Ut,Ee),De.refreshMaterialUniforms(Ut,Y,J,j,T.state.transmissionRenderTarget[b.id]),Te.needsLights&&Te.lightProbeGrid){const _t=Te.lightProbeGrid;Ut.probesSH.value=_t.texture,Ut.probesMin.value.copy(_t.boundingBox.min),Ut.probesMax.value.copy(_t.boundingBox.max),Ut.probesResolution.value.copy(_t.resolution)}hc.upload(H,fm(Te),Ut,te)}if(Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(hc.upload(H,fm(Te),Ut,te),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&mt.setValue(H,"center",K.center),mt.setValue(H,"modelViewMatrix",K.modelViewMatrix),mt.setValue(H,"normalMatrix",K.normalMatrix),mt.setValue(H,"modelMatrix",K.matrixWorld),Y.uniformsGroups!==void 0){const _t=Y.uniformsGroups;for(let pr=0,Es=_t.length;pr<Es;pr++){const mm=_t[pr];ae.update(mm,Xn),ae.bind(mm,Xn)}}return Xn}function Wy(b,z){b.ambientLightColor.needsUpdate=z,b.lightProbe.needsUpdate=z,b.sunLights.needsUpdate=z,b.sunLightShadows.needsUpdate=z,b.directionalLights.needsUpdate=z,b.directionalLightShadows.needsUpdate=z,b.pointLights.needsUpdate=z,b.pointLightShadows.needsUpdate=z,b.spotLights.needsUpdate=z,b.spotLightShadows.needsUpdate=z,b.rectAreaLights.needsUpdate=z,b.hemisphereLights.needsUpdate=z}function Xy(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(b,z,Q){const Y=$.get(b);Y.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),$.get(b.texture).__webglTexture=z,$.get(b.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:Q,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,z){const Q=$.get(b);Q.__webglFramebuffer=z,Q.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(b,z=0,Q=0){O=b,G=z,U=Q;let Y=null,K=!1,Ee=!1;if(b){const Se=$.get(b);if(Se.__useDefaultFramebuffer!==void 0){E.bindFramebuffer(H.FRAMEBUFFER,Se.__webglFramebuffer),Z.copy(b.viewport),ce.copy(b.scissor),_e=b.scissorTest,E.viewport(Z),E.scissor(ce),E.setScissorTest(_e),L=-1;return}else if(Se.__webglFramebuffer===void 0)te.setupRenderTarget(b);else if(Se.__hasExternalTextures)te.rebindTextures(b,$.get(b.texture).__webglTexture,$.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const $e=b.depthTexture;if(Se.__boundDepthTexture!==$e){if($e!==null&&$.has($e)&&(b.width!==$e.image.width||b.height!==$e.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");te.setupDepthRenderbuffer(b)}}const Re=b.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(Ee=!0);const Le=$.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Le[z])?Y=Le[z][Q]:Y=Le[z],K=!0):b.samples>0&&te.useMultisampledRTT(b)===!1?Y=$.get(b).__webglMultisampledFramebuffer:Array.isArray(Le)?Y=Le[Q]:Y=Le,Z.copy(b.viewport),ce.copy(b.scissor),_e=b.scissorTest}else Z.copy(he).multiplyScalar(J).floor(),ce.copy(Ve).multiplyScalar(J).floor(),_e=bt;if(Q!==0&&(Y=F),E.bindFramebuffer(H.FRAMEBUFFER,Y)&&E.drawBuffers(b,Y),E.viewport(Z),E.scissor(ce),E.setScissorTest(_e),K){const Se=$.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_CUBE_MAP_POSITIVE_X+z,Se.__webglTexture,Q)}else if(Ee){const Se=z;for(let Re=0;Re<b.textures.length;Re++){const Le=$.get(b.textures[Re]);H.framebufferTextureLayer(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0+Re,Le.__webglTexture,Q,Se)}}else if(b!==null&&Q!==0){const Se=$.get(b.texture);H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Se.__webglTexture,Q)}L=-1};function pm(b){const z=$.get(b);return(z.__readFormat!==b.format||z.__readType!==b.type)&&(z.__readFormat=b.format,z.__readType=b.type,z.__formatReadable=R.textureFormatReadable(b.format),z.__typeReadable=R.textureTypeReadable(b.type)),z}this.readRenderTargetPixels=function(b,z,Q,Y,K,Ee,be,Se=0){if(!(b&&b.isWebGLRenderTarget)){lt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Re=Re[be]),Re){E.bindFramebuffer(H.FRAMEBUFFER,Re);try{const Le=b.textures[Se],$e=Le.format,Qe=Le.type;b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Se);const Pe=pm(Le);if(Pe.__formatReadable===!1){lt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pe.__typeReadable===!1){lt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=b.width-Y&&Q>=0&&Q<=b.height-K&&H.readPixels(z,Q,Y,K,ve.convert($e),ve.convert(Qe),Ee)}finally{const Le=O!==null?$.get(O).__webglFramebuffer:null;E.bindFramebuffer(H.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(b,z,Q,Y,K,Ee,be,Se=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=$.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&be!==void 0&&(Re=Re[be]),Re)if(z>=0&&z<=b.width-Y&&Q>=0&&Q<=b.height-K){E.bindFramebuffer(H.FRAMEBUFFER,Re);const Le=b.textures[Se],$e=Le.format,Qe=Le.type;b.textures.length>1&&H.readBuffer(H.COLOR_ATTACHMENT0+Se);const Pe=pm(Le);if(Pe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ut=H.createBuffer();H.bindBuffer(H.PIXEL_PACK_BUFFER,ut),H.bufferData(H.PIXEL_PACK_BUFFER,Ee.byteLength,H.STREAM_READ),H.readPixels(z,Q,Y,K,ve.convert($e),ve.convert(Qe),0),H.bindBuffer(H.PIXEL_PACK_BUFFER,null);const kt=O!==null?$.get(O).__webglFramebuffer:null;E.bindFramebuffer(H.FRAMEBUFFER,kt);const yt=H.fenceSync(H.SYNC_GPU_COMMANDS_COMPLETE,0);return H.flush(),await Rb(H,yt,4),H.bindBuffer(H.PIXEL_PACK_BUFFER,ut),H.getBufferSubData(H.PIXEL_PACK_BUFFER,0,Ee),H.bindBuffer(H.PIXEL_PACK_BUFFER,null),H.deleteBuffer(ut),H.deleteSync(yt),Ee}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,z=null,Q=0){const Y=Math.pow(2,-Q),K=Math.floor(b.image.width*Y),Ee=Math.floor(b.image.height*Y),be=z!==null?z.x:0,Se=z!==null?z.y:0;te.setTexture2D(b,0),H.copyTexSubImage2D(H.TEXTURE_2D,Q,0,0,be,Se,K,Ee),E.unbindTexture()},this.copyTextureToTexture=function(b,z,Q=null,Y=null,K=0,Ee=0){let be,Se,Re,Le,$e,Qe,Pe,ut,kt;const yt=b.isCompressedTexture?b.mipmaps[Ee]:b.image;if(Q!==null)be=Q.max.x-Q.min.x,Se=Q.max.y-Q.min.y,Re=Q.isBox3?Q.max.z-Q.min.z:1,Le=Q.min.x,$e=Q.min.y,Qe=Q.isBox3?Q.min.z:0;else{const Ut=Math.pow(2,-K);be=Math.floor(yt.width*Ut),Se=Math.floor(yt.height*Ut),b.isDataArrayTexture?Re=yt.depth:b.isData3DTexture?Re=Math.floor(yt.depth*Ut):Re=1,Le=0,$e=0,Qe=0}Y!==null?(Pe=Y.x,ut=Y.y,kt=Y.z):(Pe=0,ut=0,kt=0);const gt=ve.convert(z.format),an=ve.convert(z.type);let Te;z.isData3DTexture?(te.setTexture3D(z,0),Te=H.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(te.setTexture2DArray(z,0),Te=H.TEXTURE_2D_ARRAY):(te.setTexture2D(z,0),Te=H.TEXTURE_2D),E.activeTexture(H.TEXTURE0),E.pixelStorei(H.UNPACK_FLIP_Y_WEBGL,z.flipY),E.pixelStorei(H.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),E.pixelStorei(H.UNPACK_ALIGNMENT,z.unpackAlignment);const gn=E.getParameter(H.UNPACK_ROW_LENGTH),st=E.getParameter(H.UNPACK_IMAGE_HEIGHT),Xn=E.getParameter(H.UNPACK_SKIP_PIXELS),Si=E.getParameter(H.UNPACK_SKIP_ROWS),fr=E.getParameter(H.UNPACK_SKIP_IMAGES);E.pixelStorei(H.UNPACK_ROW_LENGTH,yt.width),E.pixelStorei(H.UNPACK_IMAGE_HEIGHT,yt.height),E.pixelStorei(H.UNPACK_SKIP_PIXELS,Le),E.pixelStorei(H.UNPACK_SKIP_ROWS,$e),E.pixelStorei(H.UNPACK_SKIP_IMAGES,Qe);const Ss=b.isDataArrayTexture||b.isData3DTexture,mt=z.isDataArrayTexture||z.isData3DTexture;if(b.isDepthTexture){const Ut=$.get(b),hr=$.get(z),_t=$.get(Ut.__renderTarget),pr=$.get(hr.__renderTarget);E.bindFramebuffer(H.READ_FRAMEBUFFER,_t.__webglFramebuffer),E.bindFramebuffer(H.DRAW_FRAMEBUFFER,pr.__webglFramebuffer);for(let Es=0;Es<Re;Es++)Ss&&(H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,$.get(b).__webglTexture,K,Qe+Es),H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,$.get(z).__webglTexture,Ee,kt+Es)),H.blitFramebuffer(Le,$e,be,Se,Pe,ut,be,Se,H.DEPTH_BUFFER_BIT,H.NEAREST);E.bindFramebuffer(H.READ_FRAMEBUFFER,null),E.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else if(K!==0||b.isRenderTargetTexture||$.has(b)){const Ut=$.get(b),hr=$.get(z);E.bindFramebuffer(H.READ_FRAMEBUFFER,I),E.bindFramebuffer(H.DRAW_FRAMEBUFFER,k);for(let _t=0;_t<Re;_t++)Ss?H.framebufferTextureLayer(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,Ut.__webglTexture,K,Qe+_t):H.framebufferTexture2D(H.READ_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,Ut.__webglTexture,K),mt?H.framebufferTextureLayer(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,hr.__webglTexture,Ee,kt+_t):H.framebufferTexture2D(H.DRAW_FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,hr.__webglTexture,Ee),K!==0?H.blitFramebuffer(Le,$e,be,Se,Pe,ut,be,Se,H.COLOR_BUFFER_BIT,H.NEAREST):mt?H.copyTexSubImage3D(Te,Ee,Pe,ut,kt+_t,Le,$e,be,Se):H.copyTexSubImage2D(Te,Ee,Pe,ut,Le,$e,be,Se);E.bindFramebuffer(H.READ_FRAMEBUFFER,null),E.bindFramebuffer(H.DRAW_FRAMEBUFFER,null)}else mt?b.isDataTexture||b.isData3DTexture?H.texSubImage3D(Te,Ee,Pe,ut,kt,be,Se,Re,gt,an,yt.data):z.isCompressedArrayTexture?H.compressedTexSubImage3D(Te,Ee,Pe,ut,kt,be,Se,Re,gt,yt.data):H.texSubImage3D(Te,Ee,Pe,ut,kt,be,Se,Re,gt,an,yt):b.isDataTexture?H.texSubImage2D(H.TEXTURE_2D,Ee,Pe,ut,be,Se,gt,an,yt.data):b.isCompressedTexture?H.compressedTexSubImage2D(H.TEXTURE_2D,Ee,Pe,ut,yt.width,yt.height,gt,yt.data):H.texSubImage2D(H.TEXTURE_2D,Ee,Pe,ut,be,Se,gt,an,yt);E.pixelStorei(H.UNPACK_ROW_LENGTH,gn),E.pixelStorei(H.UNPACK_IMAGE_HEIGHT,st),E.pixelStorei(H.UNPACK_SKIP_PIXELS,Xn),E.pixelStorei(H.UNPACK_SKIP_ROWS,Si),E.pixelStorei(H.UNPACK_SKIP_IMAGES,fr),Ee===0&&z.generateMipmaps&&H.generateMipmap(Te),E.unbindTexture()},this.initRenderTarget=function(b){$.get(b).__webglFramebuffer===void 0&&te.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?te.setTextureCube(b,0):b.isData3DTexture?te.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?te.setTexture2DArray(b,0):te.setTexture2D(b,0),E.unbindTexture()},this.resetState=function(){G=0,U=0,O=null,E.reset(),we.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),n.unpackColorSpace=rt._getUnpackColorSpace()}}const Yv={type:"change"},em={type:"start"},Ly={type:"end"},Hl=new _y,Kv=new Yi,xN=Math.cos(70*Lb.DEG2RAD),Wt=new X,wn=2*Math.PI,ht={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Bd=1e-6;class yN extends y1{constructor(e,n=null){super(e,n),this.state=ht.NONE,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:la.ROTATE,MIDDLE:la.DOLLY,RIGHT:la.PAN},this.touches={ONE:Qs.ROTATE,TWO:Qs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new X,this._lastQuaternion=new Hr,this._lastTargetPosition=new X,this._quat=new Hr().setFromUnitVectors(e.up,new X(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new wv,this._sphericalDelta=new wv,this._scale=1,this._panOffset=new X,this._rotateStart=new He,this._rotateEnd=new He,this._rotateDelta=new He,this._panStart=new He,this._panEnd=new He,this._panDelta=new He,this._dollyStart=new He,this._dollyEnd=new He,this._dollyDelta=new He,this._dollyDirection=new X,this._mouse=new He,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=EN.bind(this),this._onPointerDown=SN.bind(this),this._onPointerUp=MN.bind(this),this._onContextMenu=PN.bind(this),this._onMouseWheel=bN.bind(this),this._onKeyDown=CN.bind(this),this._onTouchStart=AN.bind(this),this._onTouchMove=RN.bind(this),this._onMouseDown=wN.bind(this),this._onMouseMove=TN.bind(this),this._interceptControlDown=NN.bind(this),this._interceptControlUp=LN.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=ht.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Yv),this.update(),this.state=ht.NONE}pan(e,n){this._pan(e,n),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const n=this.object.position;Wt.copy(n).sub(this.target),Wt.applyQuaternion(this._quat),this._spherical.setFromVector3(Wt),this.autoRotate&&this.state===ht.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=wn:i>Math.PI&&(i-=wn),r<-Math.PI?r+=wn:r>Math.PI&&(r-=wn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(Wt.setFromSpherical(this._spherical),Wt.applyQuaternion(this._quatInverse),n.copy(this.target).add(Wt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Wt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const o=new X(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new X(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Wt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Hl.origin.copy(this.object.position),Hl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Hl.direction))<xN?this.object.lookAt(this.target):(Kv.setFromNormalAndCoplanarPoint(this.object.up,this.target),Hl.intersectPlane(Kv,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Bd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Bd||this._lastTargetPosition.distanceToSquared(this.target)>Bd?(this.dispatchEvent(Yv),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?wn/60*this.autoRotateSpeed*e:wn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Wt.setFromMatrixColumn(n,0),Wt.multiplyScalar(-e),this._panOffset.add(Wt)}_panUp(e,n){this.screenSpacePanning===!0?Wt.setFromMatrixColumn(n,1):(Wt.setFromMatrixColumn(n,0),Wt.crossVectors(this.object.up,Wt)),Wt.multiplyScalar(e),this._panOffset.add(Wt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;Wt.copy(r).sub(this.target);let s=Wt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-wn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(wn*this._rotateDelta.x/n.clientHeight),this._rotateUp(wn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new He,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function SN(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function EN(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function MN(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ly),this.state=ht.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function wN(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case la.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=ht.DOLLY;break;case la.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ht.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ht.ROTATE}break;case la.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=ht.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=ht.PAN}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(em)}function TN(t){switch(this.state){case ht.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case ht.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case ht.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function bN(t){this.enabled===!1||this.enableZoom===!1||this.state!==ht.NONE||(t.preventDefault(),this.dispatchEvent(em),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Ly))}function CN(t){this.enabled!==!1&&this._handleKeyDown(t)}function AN(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case Qs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=ht.TOUCH_ROTATE;break;case Qs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=ht.TOUCH_PAN;break;default:this.state=ht.NONE}break;case 2:switch(this.touches.TWO){case Qs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=ht.TOUCH_DOLLY_PAN;break;case Qs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=ht.TOUCH_DOLLY_ROTATE;break;default:this.state=ht.NONE}break;default:this.state=ht.NONE}this.state!==ht.NONE&&this.dispatchEvent(em)}function RN(t){switch(this._trackPointer(t),this.state){case ht.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case ht.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case ht.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case ht.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=ht.NONE}}function PN(t){this.enabled!==!1&&t.preventDefault()}function NN(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function LN(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Wa=t=>{const e=(t==null?void 0:t.style)??{},n={};for(const[i,r]of Object.entries(e))typeof r=="string"&&(n[i]=r);return n};function DN({equipped:t,facePhotoUrl:e,profileColor:n="#0066FF",size:i=300}){const r=P.useRef(null);return P.useEffect(()=>{const s=r.current;if(!s)return;const a=new Xb;a.background=null;const o=new Jn(38,1,.1,100);o.position.set(0,1.55,4.4);const l=new _N({antialias:!0,alpha:!0});l.setSize(i,i),l.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.shadowMap.enabled=!0,l.shadowMap.type=qx,s.appendChild(l.domElement);const c=new yN(o,l.domElement);c.target.set(0,1.15,0),c.enableDamping=!0,c.enablePan=!1,c.minDistance=2.2,c.maxDistance=8,c.maxPolarAngle=Math.PI/1.75,a.add(new p1(16777215,1711138,.9));const h=new Mv(16777215,1.6);h.position.set(3,6,4),h.castShadow=!0,h.shadow.mapSize.set(1024,1024),a.add(h);const p=new Mv(4491519,.7);p.position.set(-4,3,-3),a.add(p);const d=new dn(new Kp(1.35,48),new $n({color:new Ke(n),transparent:!0,opacity:.35,roughness:.9}));d.rotation.x=-Math.PI/2,d.receiveShadow=!0,a.add(d);const g=new dn(new Zp(1.35,1.45,48),new $p({color:new Ke(n),transparent:!0,opacity:.8,side:Ai}));g.rotation.x=-Math.PI/2,g.position.y=.001,a.add(g);const x=new eo;a.add(x);const S=new $n({color:9263675,roughness:.55});new $n({color:1381914,roughness:.7});const m=(de,j,J=0,le=0,Ue=0)=>{const he=new dn(de,j);return he.position.set(J,le,Ue),he.castShadow=!0,x.add(he),he},f=Wa(t.hair),_=Wa(t.top),M=Wa(t.bottom),v=Wa(t.shoes),w=Wa(t.chain),T=new Ke(_.color||"#1d4ed8"),A=new Ke(M.color||"#23262e"),y=new Ke(v.color||"#ffffff"),C=new $n({color:A,roughness:.8});m(new qi(.11,.13,.85,16),C,-.16,.47,0),m(new qi(.11,.13,.85,16),C,.16,.47,0);const N=new $n({color:y,roughness:.35});m(new Qi(.22,.14,.42),N,-.16,.07,.07),m(new Qi(.22,.14,.42),N,.16,.07,.07);const D=new $n({color:1118481,roughness:.5});m(new Qi(.23,.04,.2),D,-.16,.1,.05),m(new Qi(.23,.04,.2),D,.16,.1,.05);const B=new $n({color:T,roughness:.75});m(new qi(.26,.3,.75,20),B,0,1.25,0);const F=new $n({color:T,roughness:.75}),I=m(new qi(.075,.085,.62,14),F,-.4,1.22,0);I.rotation.z=.18;const k=m(new qi(.075,.085,.62,14),F,.4,1.22,0);k.rotation.z=-.18,m(new Mr(.09,14,14),S,-.46,.88,0),m(new Mr(.09,14,14),S,.46,.88,0);const G=new Mr(.26,32,32);let U;if(e){const de=new h1().load(e);de.colorSpace=kn,U=new $n({map:de,roughness:.55})}else U=S;const O=m(G,U,0,1.95,0),L=new Ke(f.color||"#101010"),q=new $n({color:L,roughness:.9}),Z=(f.kind||"fade").toLowerCase();if(Z.includes("dread")||Z.includes("braid")){m(new Mr(.27,20,16,0,Math.PI*2,0,Math.PI/2.2),q,0,1.98,0);for(let de=0;de<8;de++){const j=de/8*Math.PI*2,J=m(new qi(.028,.022,.42,8),q,Math.cos(j)*.2,1.78,Math.sin(j)*.2);J.rotation.z=Math.cos(j)*.25,J.rotation.x=-Math.sin(j)*.25}}else Z.includes("curly")||Z.includes("afro")?m(new Mr(.3,20,16),q,0,2.08,0):m(new Mr(.265,24,16,0,Math.PI*2,0,Math.PI/2.6),q,0,1.97,0);if(t.chain){const de=(w.metal||"gold").toLowerCase(),j=de.includes("platinum")||de.includes("silver")?14212582:13938487,J=new $n({color:j,metalness:.95,roughness:.25}),le=new dn(new ho(.2,.028,12,32),J);le.position.set(0,1.58,.12),le.rotation.x=Math.PI/2-.35,le.castShadow=!0,x.add(le);const Ue=new dn(new qi(.07,.07,.02,20),J);Ue.position.set(0,1.42,.28),Ue.rotation.x=Math.PI/2-.2,Ue.castShadow=!0,x.add(Ue)}if(t.ring){const de=new $n({color:13938487,metalness:.9,roughness:.3}),j=new dn(new ho(.035,.012,8,16),de);j.position.set(-.46,.86,.08),x.add(j);const J=new dn(new ho(.035,.012,8,16),de);J.position.set(.46,.86,.08),x.add(J)}const ce=new x1;let _e=0;const se=()=>{_e=requestAnimationFrame(se);const de=ce.getElapsedTime();x.position.y=Math.sin(de*1.6)*.03,O.rotation.y=Math.sin(de*.7)*.18,c.update(),l.render(a,o)};se();const Me=()=>{l.setSize(i,i)};return window.addEventListener("resize",Me),()=>{cancelAnimationFrame(_e),window.removeEventListener("resize",Me),c.dispose(),l.dispose(),s.removeChild(l.domElement),a.traverse(de=>{const j=de;j.geometry&&j.geometry.dispose();const J=j.material;Array.isArray(J)?J.forEach(le=>le.dispose()):J&&J.dispose()})}},[i]),u.jsx("div",{ref:r,style:{width:i,height:i,maxWidth:"100%",touchAction:"none"},children:u.jsx("p",{className:"form-note",style:{textAlign:"center",margin:"0.3rem 0 0"},children:"Drag to spin your character 🌀"})})}function IN(){Wn("Avatar Studio");const{user:t,refreshUser:e}=En(),n=zi(),[i]=Cw(),r=i.get("onboarding")==="1",[s,a]=P.useState([]),[o,l]=P.useState(new Set),[c,h]=P.useState({}),[p,d]=P.useState(null),[g,x]=P.useState(!0),[S,m]=P.useState(null),[f,_]=P.useState(null),[M,v]=P.useState(null),[w,T]=P.useState(null),[A,y]=P.useState(!1),C=P.useRef(null),N=async()=>{x(!0),m(null);try{const[{items:U},{owned:O,equipped:L},{balance:q}]=await Promise.all([Oa.items(),Oa.mine(),Vc.get()]);a(U),l(new Set(O.map(ce=>ce.item.id))),h(L),d(q);const Z=(t==null?void 0:t.avatarConfig)??{};typeof Z.facePhotoUrl=="string"&&T(Z.facePhotoUrl)}catch(U){m(U instanceof ot?U.message:"Could not load the studio.")}finally{x(!1)}},D=async U=>{y(!0),v(null);try{const{url:O}=await vu.upload(U),L={...(t==null?void 0:t.avatarConfig)??{},facePhotoUrl:O};await bn.updateMe({avatarConfig:L}),T(O),e().catch(()=>{})}catch(O){v(O instanceof ot?O.message:"Could not upload photo.")}finally{y(!1)}};P.useEffect(()=>{N()},[]);const B=P.useMemo(()=>{const U=new Map;for(const O of s){const L=U.get(O.slot)??[];L.push(O),U.set(O.slot,L)}return[...U.entries()]},[s]),F=async U=>{_(U.id),v(null);try{await Oa.acquire(U.id),l(L=>new Set(L).add(U.id));const{balance:O}=await Vc.get();d(O),e().catch(()=>{})}catch(O){v(O instanceof ot?O.message:`Could not acquire ${U.name}.`)}finally{_(null)}},I=async U=>{_(U.id),v(null);try{await Oa.equip(U.id),h(O=>({...O,[U.slot]:U})),e().catch(()=>{})}catch(O){v(O instanceof ot?O.message:`Could not equip ${U.name}.`)}finally{_(null)}},k=async U=>{_(`unequip-${U}`),v(null);try{await Oa.unequip(U),h(O=>{const L={...O};return delete L[U],L}),e().catch(()=>{})}catch(O){v(O instanceof ot?O.message:"Could not unequip that item.")}finally{_(null)}},G=Object.values(c);return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"1rem"},children:[u.jsxs("div",{children:[u.jsx("h1",{className:"page-title",children:r?"🎭 Create your character":"Avatar Studio"}),u.jsx("p",{className:"page-sub",children:r?"This is your Big Face. Gear up, then enter the arena.":"Collect gear, flex your rarity. Some pieces need level or tokens."})]}),p!==null&&u.jsxs("span",{className:"badge badge-gold",style:{fontSize:"0.9rem"},children:["💰 ",p," tokens"]})]}),M&&u.jsx("div",{className:"form-error",children:M}),g&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Opening the studio…"})]}),S&&!g&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",S]}),u.jsx("button",{className:"btn",onClick:N,children:"Try again"})]}),!g&&!S&&u.jsxs("div",{className:"studio-layout",children:[u.jsxs("div",{children:[B.length===0&&u.jsxs("div",{className:"card empty-wrap",children:[u.jsx("div",{className:"big",children:"🎨"}),u.jsx("p",{children:"No avatar items are available right now. Check back soon."})]}),B.map(([U,O])=>u.jsxs("div",{style:{marginBottom:"1.4rem"},children:[u.jsx("h3",{style:{textTransform:"capitalize",margin:"0 0 0.7rem"},children:U}),u.jsx("div",{className:"grid-3",children:O.map(L=>{var se;const q=o.has(L.id),Z=((se=c[L.slot])==null?void 0:se.id)===L.id,ce=((t==null?void 0:t.level)??1)<L.minLevel,_e=CT[L.rarity]??"#9aa3b2";return u.jsxs("div",{className:"card item-card",style:{borderColor:Z?_e:void 0},children:[u.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[u.jsx("span",{className:"rarity-tag",style:{color:_e},children:L.rarity}),Z&&u.jsx("span",{className:"badge badge-blue",children:"Equipped"})]}),u.jsx("div",{className:"item-name",children:L.name}),u.jsxs("div",{className:"item-meta",children:[L.minLevel>1&&u.jsxs("div",{children:["🔒 Level ",L.minLevel,"+ required"]}),L.tokenPrice>0&&u.jsxs("div",{children:["💰 ",L.tokenPrice," tokens"]}),L.tokenPrice===0&&L.minLevel<=1&&u.jsx("div",{children:"Free"})]}),u.jsx("div",{style:{display:"flex",gap:"0.5rem",marginTop:"auto"},children:q?Z?u.jsx("button",{className:"btn btn-ghost btn-sm",style:{flex:1},disabled:f===`unequip-${U}`,onClick:()=>k(U),children:"Unequip"}):u.jsx("button",{className:"btn btn-sm",style:{flex:1},disabled:f===L.id,onClick:()=>I(L),children:f===L.id?"…":"Equip"}):u.jsx("button",{className:"btn btn-sm",style:{flex:1},disabled:ce||f===L.id,onClick:()=>F(L),title:ce?`Reach level ${L.minLevel} to unlock`:void 0,children:f===L.id?"…":ce?`🔒 Lv ${L.minLevel}`:L.tokenPrice>0?`Acquire · ${L.tokenPrice} 🪙`:"Acquire"})})]},L.id)})})]},U))]}),u.jsxs("div",{className:"card preview-stage",children:[u.jsx("h3",{style:{margin:0},children:"Your character"}),u.jsx(DN,{equipped:c,facePhotoUrl:w,profileColor:t==null?void 0:t.profileColor,size:240}),u.jsx("input",{ref:C,type:"file",accept:"image/*",style:{display:"none"},onChange:U=>{var L;const O=(L=U.target.files)==null?void 0:L[0];O&&D(O),U.target.value=""}}),u.jsx("button",{className:"btn btn-block",style:{marginTop:"0.5rem"},disabled:A,onClick:()=>{var U;return(U=C.current)==null?void 0:U.click()},children:A?"Uploading…":w?"📸 Change face photo":"📸 Upload your face photo"}),G.length===0?u.jsxs("p",{className:"form-note",style:{textAlign:"center"},children:["Nothing equipped yet.",u.jsx("br",{}),"Grab gear below and watch your character come alive."]}):u.jsxs("p",{className:"form-note",style:{textAlign:"center"},children:[G.length," item",G.length===1?"":"s"," equipped"]}),r&&u.jsx("button",{className:"btn btn-block",style:{marginTop:"1rem",background:"linear-gradient(135deg, #d4af37, #aa8a2e)",fontSize:"1.05rem",padding:"0.9rem"},onClick:()=>n("/chats",{replace:!0}),children:"Done — Enter Big Face →"})]})]})]})}function UN(t){const e=t.toLowerCase();return e.includes("legendary")?"throne-legendary":e.includes("golden")?"throne-golden":e==="throne"?"throne-throne":e.includes("seat")?"throne-seat":"throne-rising"}function ON(){Wn("Throne Room");const{user:t}=En(),[e,n]=P.useState(null),[i,r]=P.useState(null),[s,a]=P.useState([]),[o,l]=P.useState(!0),[c,h]=P.useState(null),[p,d]=P.useState(!1),g=async()=>{l(!0),h(null);try{const[S,m,{gifts:f}]=await Promise.all([Ug.me(),Ug.legendary(),Gc.received()]);n(S),r(m.king),a(f.slice(0,10))}catch(S){h(S instanceof ot?S.message:"Could not load the throne room.")}finally{l(!1)}};P.useEffect(()=>{g()},[]);const x=(()=>{if(!e)return 0;const S=Wg(e.level),m=Wg(e.level+1);return m<=S?100:Math.min(100,Math.max(0,(e.xp-S)/(m-S)*100))})();return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Throne Room"}),u.jsx("p",{className:"page-sub",children:"Your seat grows grander with every level. Keep earning XP."})]}),o&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Approaching the throne…"})]}),c&&!o&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",c]}),u.jsx("button",{className:"btn",onClick:g,children:"Try again"})]}),!o&&!c&&e&&u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"card throne-stage",children:[u.jsxs("div",{className:`throne ${UN(e.tier)}`,children:[u.jsx("div",{className:"t-glow"}),u.jsx("div",{className:"t-back"}),u.jsx("div",{className:"t-seat"}),u.jsx("div",{className:"t-base"}),e.tier.toLowerCase().includes("golden")||e.tier.toLowerCase().includes("legendary")?u.jsx("div",{className:"t-crown",children:"👑"}):null]}),u.jsxs("span",{className:"badge badge-gold",style:{fontSize:"1rem",padding:"0.4rem 1rem"},children:["👑 ",e.tier]}),u.jsxs("h2",{style:{margin:"0.8rem 0 0.2rem"},children:[t==null?void 0:t.displayName," · Level ",e.level]}),u.jsxs("p",{className:"form-note",style:{margin:"0 0 1rem"},children:["Rank #",e.rank," · ",e.xp," XP total"]}),u.jsxs("div",{style:{width:"100%",maxWidth:420},children:[u.jsx("div",{className:"xp-bar",children:u.jsx("div",{className:"fill",style:{width:`${x}%`}})}),u.jsx("p",{className:"form-note",style:{marginTop:"0.5rem"},children:e.xpForNext>0?`${e.xpForNext} XP to Level ${e.level+1}`:"Max level — legendary status achieved."})]})]}),u.jsxs("div",{className:"grid-2",style:{marginTop:"1.2rem"},children:[u.jsxs("div",{className:"card",children:[u.jsx("h3",{children:"🙏 Pay tribute"}),u.jsx("p",{className:"form-note",children:i?`Send a gift to this week's Face King, ${i.displayName}, and earn their favor (+2 XP per gift sent).`:"No Face King crowned this week yet — check back after the red carpet."}),u.jsx("button",{className:"btn",disabled:!i,onClick:()=>d(!0),children:"Send tribute"})]}),u.jsxs("div",{className:"card",children:[u.jsx("h3",{children:"🎁 Recent gifts received"}),s.length===0?u.jsx("p",{className:"form-note",children:"No gifts yet. Gifts from admirers show up here — each one is +10 XP."}):s.map(S=>{var m;return u.jsxs("div",{className:"tx-row",children:[u.jsxs("span",{children:[u.jsx("span",{style:{fontSize:"1.2rem",marginRight:"0.5rem"},children:Io[S.giftKey]??"🎁"}),((m=S.sender)==null?void 0:m.displayName)??"Someone",S.message&&u.jsxs("span",{className:"form-note",children:[" — “",S.message,"”"]})]}),u.jsx("span",{className:"form-note",children:Xo(S.createdAt)})]},S.id)})]})]})]}),p&&i&&u.jsx(Op,{receiverId:i.id,receiverName:i.displayName,onClose:()=>d(!1),onSent:()=>g()})]})}function FN(t){const n=((t==null?void 0:t.avatarConfig)??{}).profileTrack;return n!=null&&n.url?n:null}function kN(){Wn("DJ Booth");const{user:t,refreshUser:e}=En(),[n,i]=P.useState(""),[r,s]=P.useState(""),[a,o]=P.useState("rap"),[l,c]=P.useState(null),[h,p]=P.useState(!1),[d,g]=P.useState(null),[x,S]=P.useState(null),m=P.useRef(null),f=FN(t),_=async v=>{if(v.preventDefault(),!l){g("Choose an audio file first.");return}p(!0),g(null),S(null);try{const{url:w}=await vu.upload(l),T={...(t==null?void 0:t.avatarConfig)??{},profileTrack:{title:n.trim(),artist:r.trim(),genre:a,url:w}};await bn.updateMe({avatarConfig:T}),await e(),i(""),s(""),c(null),S("Your track is live on your profile. 🎶")}catch(w){g(w instanceof ot?w.message:"Upload failed. Try again.")}finally{p(!1)}},M=async()=>{const v={...(t==null?void 0:t.avatarConfig)??{}};delete v.profileTrack,await bn.updateMe({avatarConfig:v}),await e(),S("Track removed.")};return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"🎧 DJ Booth"}),u.jsx("p",{className:"page-sub",children:"Your profile. Your sound. Upload a rap or R&B track — visitors play it from your page."})]}),f&&u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem",borderColor:"var(--gold)"},children:[u.jsx("div",{className:"form-note",children:"NOW PLAYING ON YOUR PROFILE"}),u.jsx("h3",{style:{margin:"0.4rem 0"},children:f.title}),u.jsxs("p",{className:"form-note",style:{margin:"0 0 0.8rem"},children:[f.artist," · ",f.genre.toUpperCase()]}),u.jsx("audio",{controls:!0,src:f.url,style:{width:"100%"}}),u.jsx("button",{className:"btn btn-ghost btn-sm",style:{marginTop:"0.8rem"},onClick:M,children:"Remove track"})]}),u.jsxs("div",{className:"card",children:[u.jsx("h3",{style:{marginTop:0},children:f?"Replace your track":"Set your profile track"}),u.jsxs("form",{onSubmit:_,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"dj-title",children:"Track title"}),u.jsx("input",{id:"dj-title",className:"input",value:n,onChange:v=>i(v.target.value),required:!0,maxLength:80,placeholder:"My hottest verse"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"dj-artist",children:"Artist"}),u.jsx("input",{id:"dj-artist",className:"input",value:r,onChange:v=>s(v.target.value),required:!0,maxLength:80,placeholder:(t==null?void 0:t.displayName)??"Artist name"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"dj-genre",children:"Genre"}),u.jsxs("select",{id:"dj-genre",className:"select",value:a,onChange:v=>o(v.target.value),children:[u.jsx("option",{value:"rap",children:"Rap"}),u.jsx("option",{value:"rnb",children:"R&B"})]})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{children:"Audio file"}),u.jsx("input",{ref:m,type:"file",accept:"audio/*",style:{display:"none"},onChange:v=>{var w;return c(((w=v.target.files)==null?void 0:w[0])??null)}}),u.jsx("button",{type:"button",className:"btn btn-ghost btn-block",onClick:()=>{var v;return(v=m.current)==null?void 0:v.click()},children:l?`🎵 ${l.name}`:"Choose audio file"})]}),d&&u.jsx("div",{className:"form-error",children:d}),x&&u.jsx("p",{className:"form-note",style:{color:"var(--green)"},children:x}),u.jsx("button",{className:"btn btn-block",type:"submit",disabled:h,children:h?"Uploading…":"Set profile track"})]}),u.jsx("p",{className:"form-note",style:{marginTop:"1rem",marginBottom:0},children:"Only upload music you own or have rights to share."})]})]})}const BN=[{key:"bullying",label:"Bullying or harassment"},{key:"sexual",label:"Sexual content"},{key:"violence",label:"Violence or threats"},{key:"spam",label:"Spam or scam"},{key:"other",label:"Other"}];function zN(){Wn("Safety Center");const[t,e]=P.useState(!1),[n,i]=P.useState(""),[r,s]=P.useState("bullying"),[a,o]=P.useState(""),[l,c]=P.useState(!1),[h,p]=P.useState(null),[d,g]=P.useState(!1),x=async S=>{S.preventDefault(),c(!0),p(null);try{await Px.safety({subject:n,reason:r,details:a}),g(!0),i(""),o(""),e(!1)}catch(m){p(m instanceof ot?m.message:"Could not send the report.")}finally{c(!1)}};return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"🛡️ Safety Center"}),u.jsx("p",{className:"page-sub",children:"Protect the vibe. Big Face is for everyone — here's how we keep it that way."})]}),u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem"},children:[u.jsx("h3",{style:{marginTop:0},children:"The rules"}),u.jsxs("ul",{style:{margin:0,paddingLeft:"1.2rem",lineHeight:2},children:[u.jsxs("li",{children:[u.jsx("strong",{children:"Never"})," share your address, school, or private details."]}),u.jsxs("li",{children:[u.jsx("strong",{children:"Never"})," meet someone from the app alone — bring a friend."]}),u.jsxs("li",{children:[u.jsx("strong",{children:"Never"})," send money or gift cards to someone you met here."]}),u.jsx("li",{children:"Younger users: keep a trusted adult in the loop about who you talk to."}),u.jsx("li",{children:"Bullying, sexual content, threats, and scams get accounts removed."})]})]}),u.jsxs("div",{className:"card",children:[u.jsx("h3",{style:{marginTop:0},children:"Report a concern"}),u.jsx("p",{className:"form-note",children:"See something wrong? Tell us. Reports are reviewed by the Big Face team."}),d&&u.jsx("p",{className:"form-note",style:{color:"var(--green)"},children:"Report received. Thank you for keeping Big Face safe."}),t?u.jsxs("form",{onSubmit:x,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"safety-subject",children:"Who or what is this about?"}),u.jsx("input",{id:"safety-subject",className:"input",value:n,onChange:S=>i(S.target.value),required:!0,maxLength:120,placeholder:"Username or description"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"safety-reason",children:"Reason"}),u.jsx("select",{id:"safety-reason",className:"select",value:r,onChange:S=>s(S.target.value),children:BN.map(S=>u.jsx("option",{value:S.key,children:S.label},S.key))})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"safety-details",children:"Details"}),u.jsx("textarea",{id:"safety-details",className:"textarea",value:a,onChange:S=>o(S.target.value),maxLength:500,placeholder:"What happened?"})]}),h&&u.jsx("div",{className:"form-error",children:h}),u.jsxs("div",{style:{display:"flex",gap:"0.6rem"},children:[u.jsx("button",{type:"button",className:"btn btn-ghost",style:{flex:1},onClick:()=>e(!1),children:"Cancel"}),u.jsx("button",{type:"submit",className:"btn",style:{flex:1},disabled:l,children:l?"Sending…":"Submit report"})]})]}):u.jsx("button",{className:"btn",onClick:()=>{e(!0),g(!1)},children:"Report a concern"})]})]})}var Dy="https://js.stripe.com/v3",HN=/^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;var VN=function(){for(var e=document.querySelectorAll('script[src^="'.concat(Dy,'"]')),n=0;n<e.length;n++){var i=e[n];if(HN.test(i.src))return i}return null},Zv=function(e){var n="",i=document.createElement("script");i.src="".concat(Dy).concat(n);var r=document.head||document.body;if(!r)throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");return r.appendChild(i),i},Xa=null,Vl=null,Gl=null,GN=function(e){return function(){e(new Error("Failed to load Stripe.js"))}},jN=function(e,n){return function(){window.Stripe?e(window.Stripe):n(new Error("Stripe.js not available"))}},WN=function(e){return Xa!==null?Xa:(Xa=new Promise(function(n,i){if(typeof window>"u"||typeof document>"u"){n(null);return}if(window.Stripe){n(window.Stripe);return}try{var r=VN();if(!(r&&e)){if(!r)r=Zv(e);else if(r&&Gl!==null&&Vl!==null){var s;r.removeEventListener("load",Gl),r.removeEventListener("error",Vl),(s=r.parentNode)===null||s===void 0||s.removeChild(r),r=Zv(e)}}Gl=jN(n,i),Vl=GN(i),r.addEventListener("load",Gl),r.addEventListener("error",Vl)}catch(a){i(a);return}}),Xa.catch(function(n){return Xa=null,Promise.reject(n)}))},qa,XN=function(){return qa||(qa=WN(null).catch(function(e){return qa=null,Promise.reject(e)}),qa)};Promise.resolve().then(function(){return XN()}).catch(function(t){console.warn(t)});var Iy={exports:{}},qN="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",$N=qN,YN=$N;function Uy(){}function Oy(){}Oy.resetWarningCache=Uy;var KN=function(){function t(i,r,s,a,o,l){if(l!==YN){var c=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}t.isRequired=t;function e(){return t}var n={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Oy,resetWarningCache:Uy};return n.PropTypes=n,n};Iy.exports=KN();var ZN=Iy.exports;const Ct=r0(ZN);function Jv(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(t,r).enumerable})),n.push.apply(n,i)}return n}function Qv(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Jv(Object(n),!0).forEach(function(i){Fy(t,i,n[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Jv(Object(n)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(n,i))})}return t}function pc(t){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?pc=function(e){return typeof e}:pc=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},pc(t)}function Fy(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function JN(t,e){return QN(t)||eL(t,e)||tL(t,e)||nL()}function QN(t){if(Array.isArray(t))return t}function eL(t,e){var n=t&&(typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"]);if(n!=null){var i=[],r=!0,s=!1,a,o;try{for(n=n.call(t);!(r=(a=n.next()).done)&&(i.push(a.value),!(e&&i.length===e));r=!0);}catch(l){s=!0,o=l}finally{try{!r&&n.return!=null&&n.return()}finally{if(s)throw o}}return i}}function tL(t,e){if(t){if(typeof t=="string")return e0(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);if(n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set")return Array.from(t);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return e0(t,e)}}function e0(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function nL(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var On=function(e,n,i){var r=!!i,s=Ot.useRef(i);Ot.useEffect(function(){s.current=i},[i]),Ot.useEffect(function(){if(!r||!e)return function(){};var a=function(){s.current&&s.current.apply(s,arguments)};return e.on(n,a),function(){e.off(n,a)}},[r,n,e,s])},iL=function(e){var n=Ot.useRef(e);return Ot.useEffect(function(){n.current=e},[e]),n.current},$c=function(e){return e!==null&&pc(e)==="object"},t0="[object Object]",rL=function t(e,n){if(!$c(e)||!$c(n))return e===n;var i=Array.isArray(e),r=Array.isArray(n);if(i!==r)return!1;var s=Object.prototype.toString.call(e)===t0,a=Object.prototype.toString.call(n)===t0;if(s!==a)return!1;if(!s&&!i)return e===n;var o=Object.keys(e),l=Object.keys(n);if(o.length!==l.length)return!1;for(var c={},h=0;h<o.length;h+=1)c[o[h]]=!0;for(var p=0;p<l.length;p+=1)c[l[p]]=!0;var d=Object.keys(c);if(d.length!==o.length)return!1;var g=e,x=n,S=function(f){return t(g[f],x[f])};return d.every(S)},sL=function(e,n,i){return $c(e)?Object.keys(e).reduce(function(r,s){var a=!$c(n)||!rL(e[s],n[s]);return i.includes(s)?(a&&console.warn("Unsupported prop change: options.".concat(s," is not a mutable property.")),r):a?Qv(Qv({},r||{}),{},Fy({},s,e[s])):r},null):null},ky=Ot.createContext(null);ky.displayName="ElementsContext";var aL=function(e,n){if(!e)throw new Error("Could not find Elements context; You need to wrap the part of your app that ".concat(n," in an <Elements> provider."));return e};Ct.any,Ct.object;Ct.func.isRequired;var By=Ot.createContext(null);By.displayName="CustomCheckoutSdkContext";var oL=function(e,n){if(!e)throw new Error("Could not find CustomCheckoutProvider context; You need to wrap the part of your app that ".concat(n," in an <CustomCheckoutProvider> provider."));return e},lL=Ot.createContext(null);lL.displayName="CustomCheckoutContext";Ct.any,Ct.shape({clientSecret:Ct.string.isRequired,elementsOptions:Ct.object}).isRequired;var n0=function(e){var n=Ot.useContext(By),i=Ot.useContext(ky);if(n&&i)throw new Error("You cannot wrap the part of your app that ".concat(e," in both <CustomCheckoutProvider> and <Elements> providers."));return n?oL(n,e):aL(i,e)},cL=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},Gt=function(e,n){var i="".concat(cL(e),"Element"),r=function(l){var c=l.id,h=l.className,p=l.options,d=p===void 0?{}:p,g=l.onBlur,x=l.onFocus,S=l.onReady,m=l.onChange,f=l.onEscape,_=l.onClick,M=l.onLoadError,v=l.onLoaderStart,w=l.onNetworksChange,T=l.onConfirm,A=l.onCancel,y=l.onShippingAddressChange,C=l.onShippingRateChange,N=n0("mounts <".concat(i,">")),D="elements"in N?N.elements:null,B="customCheckoutSdk"in N?N.customCheckoutSdk:null,F=Ot.useState(null),I=JN(F,2),k=I[0],G=I[1],U=Ot.useRef(null),O=Ot.useRef(null);On(k,"blur",g),On(k,"focus",x),On(k,"escape",f),On(k,"click",_),On(k,"loaderror",M),On(k,"loaderstart",v),On(k,"networkschange",w),On(k,"confirm",T),On(k,"cancel",A),On(k,"shippingaddresschange",y),On(k,"shippingratechange",C),On(k,"change",m);var L;S&&(e==="expressCheckout"?L=S:L=function(){S(k)}),On(k,"ready",L),Ot.useLayoutEffect(function(){if(U.current===null&&O.current!==null&&(D||B)){var Z=null;B?Z=B.createElement(e,d):D&&(Z=D.create(e,d)),U.current=Z,G(Z),Z&&Z.mount(O.current)}},[D,B,d]);var q=iL(d);return Ot.useEffect(function(){if(U.current){var Z=sL(d,q,["paymentRequest"]);Z&&"update"in U.current&&U.current.update(Z)}},[d,q]),Ot.useLayoutEffect(function(){return function(){if(U.current&&typeof U.current.destroy=="function")try{U.current.destroy(),U.current=null}catch{}}},[]),Ot.createElement("div",{id:c,className:h,ref:O})},s=function(l){n0("mounts <".concat(i,">"));var c=l.id,h=l.className;return Ot.createElement("div",{id:c,className:h})},a=n?s:r;return a.propTypes={id:Ct.string,className:Ct.string,onChange:Ct.func,onBlur:Ct.func,onFocus:Ct.func,onReady:Ct.func,onEscape:Ct.func,onClick:Ct.func,onLoadError:Ct.func,onLoaderStart:Ct.func,onNetworksChange:Ct.func,onConfirm:Ct.func,onCancel:Ct.func,onShippingAddressChange:Ct.func,onShippingRateChange:Ct.func,options:Ct.object},a.displayName=i,a.__elementType=e,a},jt=typeof window>"u",uL=Ot.createContext(null);uL.displayName="EmbeddedCheckoutProviderContext";Gt("auBankAccount",jt);Gt("card",jt);Gt("cardNumber",jt);Gt("cardExpiry",jt);Gt("cardCvc",jt);Gt("fpxBank",jt);Gt("iban",jt);Gt("idealBank",jt);Gt("p24Bank",jt);Gt("epsBank",jt);Gt("payment",jt);Gt("expressCheckout",jt);Gt("currencySelector",jt);Gt("paymentRequestButton",jt);Gt("linkAuthentication",jt);Gt("address",jt);Gt("shippingAddress",jt);Gt("paymentMethodMessaging",jt);Gt("affirmMessage",jt);Gt("afterpayClearpayMessage",jt);const dL=null;function fL(){Wn("Wallet");const{user:t}=En(),[e,n]=P.useState(null),[i,r]=P.useState([]),[s,a]=P.useState([]),[o,l]=P.useState(!0),[c,h]=P.useState(null),[p,d]=P.useState(null),[g,x]=P.useState(""),[S,m]=P.useState([]),[f,_]=P.useState(null),M=async()=>{l(!0),h(null);try{const[{balance:v,transactions:w},{gifts:T}]=await Promise.all([Vc.get(),Gc.catalog()]);n(v),r(w),a(T)}catch(v){h(v instanceof ot?v.message:"Could not load your wallet.")}finally{l(!1)}};return P.useEffect(()=>{M()},[]),P.useEffect(()=>{const v=g.trim().toLowerCase();if(v.length<2){m([]);return}const w=window.setTimeout(async()=>{try{const{users:T}=await bn.search(v);m(T.slice(0,6))}catch{m([])}},250);return()=>window.clearTimeout(w)},[g,t==null?void 0:t.id]),u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Wallet"}),u.jsx("p",{className:"page-sub",children:"Tokens buy gifts, avatar gear, and royal favor."})]}),o&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Opening your wallet…"})]}),c&&!o&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",c]}),u.jsx("button",{className:"btn",onClick:M,children:"Try again"})]}),!o&&!c&&u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[u.jsxs("div",{children:[u.jsx("div",{className:"form-note",children:"Token balance"}),u.jsxs("div",{style:{fontSize:"2rem",fontWeight:900,color:"var(--gold)"},children:["💰 ",e??0]})]}),u.jsxs("div",{className:"form-note",style:{textAlign:"right"},children:["100 tokens = $1.00",u.jsx("br",{}),"in creator payouts"]})]}),u.jsx("h2",{style:{margin:"0 0 0.9rem"},children:"Buy tokens"}),u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem",borderColor:"var(--gold)"},children:[u.jsx("h3",{style:{marginTop:0},children:"💳 Payments are not configured"}),u.jsx("p",{className:"form-note",children:"Token purchases are currently unavailable — the payment provider hasn't been set up yet. Please check back soon. No charges were made."})]}),u.jsx("h2",{style:{margin:"0 0 0.9rem"},children:"Send a gift"}),u.jsxs("div",{className:"card",style:{marginBottom:"1.4rem"},children:[u.jsxs("div",{className:"field",style:{marginBottom:"0.6rem"},children:[u.jsx("label",{htmlFor:"gift-search",children:"Who deserves a gift?"}),u.jsx("input",{id:"gift-search",className:"input",value:g,onChange:v=>x(v.target.value),placeholder:"Search by username…"})]}),S.map(v=>u.jsxs("div",{className:"room-item",onClick:()=>{_(v),x(""),m([])},role:"button",tabIndex:0,onKeyDown:w=>w.key==="Enter"&&_(v),children:[u.jsx(ri,{displayName:v.displayName,profileColor:v.profileColor,size:"sm",photoUrl:lr(v)}),u.jsxs("div",{className:"info",children:[u.jsx("div",{className:"name",children:v.displayName}),u.jsxs("div",{className:"preview",children:["@",v.username," · Level ",v.level]})]})]},v.id)),u.jsx("div",{className:"gift-grid",style:{marginTop:"0.8rem"},children:s.map(v=>u.jsxs("div",{className:"card gift-card",style:{cursor:"default"},children:[u.jsx("div",{className:"g-emoji",children:Io[v.key]??"🎁"}),u.jsx("div",{className:"g-label",children:v.label}),u.jsxs("div",{className:"g-cost",children:[v.tokenCost," tokens"]})]},v.key))}),s.length===0&&u.jsx("p",{className:"form-note",children:"No gifts in the catalog right now."})]}),u.jsx("h2",{style:{margin:"0 0 0.9rem"},children:"Transaction history"}),u.jsx("div",{className:"card",children:i.length===0?u.jsx("p",{className:"form-note",style:{margin:0},children:"No transactions yet. Buy tokens or send gifts to get started."}):i.map(v=>u.jsxs("div",{className:"tx-row",children:[u.jsxs("div",{children:[u.jsx("div",{style:{fontWeight:700,textTransform:"capitalize"},children:v.kind.replace(/_/g," ")}),u.jsx("div",{className:"form-note",children:v.note??Xo(v.createdAt)})]}),u.jsxs("div",{className:`tx-amt${v.amount>=0?" pos":" neg"}`,children:[v.amount>=0?"+":"",v.amount," 🪙"]})]},v.id))})]}),p&&dL,f&&u.jsx(Op,{receiverId:f.id,receiverName:f.displayName,onClose:()=>_(null),onSent:M})]})}const hL=100,zd=10;function pL(){Wn("Earnings");const[t,e]=P.useState(null),[n,i]=P.useState(!0),[r,s]=P.useState(null),[a,o]=P.useState(!1),[l,c]=P.useState(null),[h,p]=P.useState(""),[d,g]=P.useState(!1),[x,S]=P.useState(null),[m,f]=P.useState(!1),_=async()=>{i(!0),s(null);try{e(await ed.summary())}catch(C){s(C instanceof ot?C.message:"Could not load your earnings.")}finally{i(!1)}};P.useEffect(()=>{_()},[]);const M=async()=>{o(!0),c(null);try{const{onboardingUrl:C}=await ed.connect();window.open(C,"_blank","noopener")}catch(C){c(C instanceof ot?C.message:"Could not start onboarding. Please try again.")}finally{o(!1)}},v=parseFloat(h),w=!Number.isNaN(v)&&v>=zd,T=w?Math.round(v*hL):0,A=t!==null&&T<=t.tokenBalance,y=async C=>{if(C.preventDefault(),!(!w||!A||d)){g(!0),S(null),f(!1);try{await ed.payout(Math.round(v*100)),f(!0),p(""),await _()}catch(N){S(N instanceof ot?N.message:"Payout request failed. Please try again.")}finally{g(!1)}}};return u.jsxs("div",{children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Earnings"}),u.jsx("p",{className:"page-sub",children:"Turn your tokens into real money. 100 tokens = $1.00."})]}),n&&u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Counting your coins…"})]}),r&&!n&&u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",r]}),u.jsx("button",{className:"btn",onClick:_,children:"Try again"})]}),!n&&!r&&t&&u.jsxs(u.Fragment,{children:[u.jsxs("div",{className:"grid-4",style:{marginBottom:"1.4rem"},children:[u.jsxs("div",{className:"card",children:[u.jsx("div",{className:"form-note",children:"Token balance"}),u.jsxs("div",{style:{fontSize:"1.7rem",fontWeight:900},children:["🪙 ",t.tokenBalance]})]}),u.jsxs("div",{className:"card",children:[u.jsx("div",{className:"form-note",children:"Tokens earned"}),u.jsxs("div",{style:{fontSize:"1.7rem",fontWeight:900},children:["✨ ",t.earnedTokens]})]}),u.jsxs("div",{className:"card",children:[u.jsx("div",{className:"form-note",children:"Gifts received"}),u.jsxs("div",{style:{fontSize:"1.7rem",fontWeight:900},children:["🎁 ",t.giftsReceived]})]}),u.jsxs("div",{className:"card",children:[u.jsx("div",{className:"form-note",children:"Total paid out"}),u.jsxs("div",{style:{fontSize:"1.7rem",fontWeight:900},children:["$",(t.payoutsTotal/100).toFixed(2)]})]})]}),u.jsxs("div",{className:"grid-2",children:[u.jsxs("div",{className:"card",children:[u.jsx("h3",{children:"💳 Get paid"}),u.jsx("p",{className:"form-note",children:"Connect a payout account to receive your earnings. You'll be guided through a secure onboarding with our payment provider."}),l&&u.jsx("div",{className:"form-error",children:l}),u.jsx("button",{className:"btn",onClick:M,disabled:a,children:a?"Opening…":"Connect payout account"})]}),u.jsxs("div",{className:"card",children:[u.jsx("h3",{children:"💵 Request a payout"}),u.jsxs("form",{onSubmit:y,children:[u.jsxs("div",{className:"field",children:[u.jsxs("label",{htmlFor:"payout-usd",children:["Amount (USD, min $",zd,")"]}),u.jsx("input",{id:"payout-usd",className:"input",type:"number",min:zd,step:"0.01",value:h,onChange:C=>p(C.target.value),placeholder:"25.00"})]}),w&&u.jsxs("p",{className:"form-note",children:["≈ ",u.jsxs("strong",{children:[T," tokens"]})," will be converted at 100 tokens = $1.00. You'll receive ",u.jsxs("strong",{children:["$",(v*.7).toFixed(2)]})," after the 30% platform fee.",!A&&u.jsxs("span",{style:{color:"var(--coral)"},children:[" You only have ",t.tokenBalance," tokens."]})]}),x&&u.jsx("div",{className:"form-error",children:x}),m&&u.jsx("div",{className:"card",style:{borderColor:"var(--green)",marginBottom:"0.9rem",padding:"0.7rem"},children:"✅ Payout requested! It will arrive once processed."}),u.jsx("button",{className:"btn btn-block",type:"submit",disabled:!w||!A||d,children:d?"Requesting…":"Request payout"})]}),u.jsx("p",{className:"form-note",style:{marginTop:"0.8rem",marginBottom:0},children:"Payout history and status are available in your connected payout dashboard. Big Face takes a 30% platform fee — you receive 70% of your payout amount."})]})]})]})]})}function mL(){Wn("Profile");const{id:t}=Tx(),{user:e}=En(),[n,i]=P.useState(null),[r,s]=P.useState(null),[a,o]=P.useState([]),[l,c]=P.useState(!1),[h,p]=P.useState(0),[d,g]=P.useState(!1),[x,S]=P.useState(!0),[m,f]=P.useState(null),[_,M]=P.useState(!1),[v,w]=P.useState(!1),[T,A]=P.useState(null),y=t===(e==null?void 0:e.id),C=async()=>{if(t){S(!0),f(null);try{const[{user:F,stats:I},{posts:k}]=await Promise.all([bn.get(t),ss.list(60)]);i(F),s(I),p(I.followersLikes),o(k.filter(G=>G.user.id===t))}catch(F){f(F instanceof ot?F.message:"Could not load this profile.")}finally{S(!1)}}};P.useEffect(()=>{C()},[t]);const N=async()=>{if(t){A(null);try{l?(await bn.unlike(t),c(!1),p(F=>Math.max(0,F-1))):(await bn.like(t),c(!0),p(F=>F+1))}catch(F){A(F instanceof ot?F.message:"Could not like this profile.")}}},D=async()=>{if(t){A(null);try{d?(await bn.unblock(t),g(!1)):(await bn.block(t),g(!0))}catch(F){A(F instanceof ot?F.message:"Could not update block status.")}}},B=async F=>{try{F.likedByMe?(await ss.unlike(F.id),o(I=>I.map(k=>k.id===F.id?{...k,likedByMe:!1,likesCount:k.likesCount-1}:k))):(await ss.like(F.id),o(I=>I.map(k=>k.id===F.id?{...k,likedByMe:!0,likesCount:k.likesCount+1}:k)))}catch{}};return x?u.jsxs("div",{className:"loading-wrap",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Loading profile…"})]}):m||!n?u.jsxs("div",{className:"error-wrap",children:[u.jsxs("p",{children:["😕 ",m??"This profile could not be found."]}),u.jsx(ti,{className:"btn",to:"/leaderboard",children:"Back to leaderboard"})]}):u.jsxs("div",{children:[u.jsxs("div",{className:"card",style:{padding:0,overflow:"hidden"},children:[u.jsx("div",{className:"profile-cover",style:{background:`linear-gradient(135deg, ${n.profileColor}, #0e1013)`}}),u.jsxs("div",{className:"profile-head",children:[u.jsx(ri,{displayName:n.displayName,profileColor:n.profileColor,size:"xl",photoUrl:lr(n)}),u.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.6rem",marginTop:"0.7rem"},children:[u.jsxs("div",{children:[u.jsx("h1",{className:"page-title",children:n.displayName}),u.jsxs("p",{className:"page-sub",children:["@",n.username," · ",n.gender]})]}),u.jsxs("span",{className:"badge badge-gold",children:["👑 Level ",n.level]})]}),n.bio&&u.jsx("p",{style:{marginTop:"0.7rem",lineHeight:1.5},children:n.bio}),u.jsxs("div",{className:"stat-row",children:[u.jsxs("div",{className:"stat",children:[u.jsx("div",{className:"num",children:n.xp}),u.jsx("div",{className:"lbl",children:"XP"})]}),u.jsxs("div",{className:"stat",children:[u.jsx("div",{className:"num",children:h}),u.jsx("div",{className:"lbl",children:"Likes"})]}),u.jsxs("div",{className:"stat",children:[u.jsx("div",{className:"num",children:(r==null?void 0:r.mediaCount)??0}),u.jsx("div",{className:"lbl",children:"Posts"})]}),(r==null?void 0:r.rank)!==null&&(r==null?void 0:r.rank)!==void 0&&u.jsxs("div",{className:"stat",children:[u.jsxs("div",{className:"num",children:["#",r.rank]}),u.jsx("div",{className:"lbl",children:"Rank"})]})]}),!y&&u.jsxs("div",{className:"profile-actions",children:[u.jsx("button",{className:`like-btn${l?" liked":""}`,onClick:N,style:{fontSize:"0.95rem",padding:"0.55rem 1.1rem"},children:l?"❤️ Liked":"🤍 Like"}),u.jsx("button",{className:"btn btn-sm",onClick:()=>M(!0),children:"🎁 Send gift"}),u.jsx("button",{className:"btn btn-ghost btn-sm",onClick:D,children:d?"Unblock":"⛔ Block"}),u.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>w(!0),children:"🚩 Report"})]}),y&&u.jsx("div",{className:"profile-actions",children:u.jsx(ti,{className:"btn btn-sm",to:"/profile/edit",children:"✏️ Edit profile"})}),T&&u.jsx("div",{className:"form-error",style:{marginTop:"0.8rem"},children:T}),(()=>{const I=(n.avatarConfig??{}).profileTrack;return I!=null&&I.url?u.jsxs("div",{className:"card",style:{marginTop:"1rem",borderColor:"var(--gold)"},children:[u.jsx("div",{className:"form-note",children:"🎧 PROFILE TRACK"}),u.jsx("div",{style:{fontWeight:800,margin:"0.3rem 0"},children:I.title}),u.jsxs("div",{className:"form-note",style:{marginBottom:"0.6rem"},children:[I.artist," · ",(I.genre??"").toUpperCase()]}),u.jsx("audio",{controls:!0,src:I.url,style:{width:"100%"}})]}):null})()]})]}),u.jsx("h2",{style:{margin:"1.6rem 0 0.9rem"},children:"Posts"}),a.length===0?u.jsxs("div",{className:"card empty-wrap",children:[u.jsx("div",{className:"big",children:"📸"}),u.jsx("p",{children:y?"You haven't posted anything yet. Share your first moment in the Hall of Fame!":`${n.displayName} hasn't posted anything yet.`}),y&&u.jsx(ti,{className:"btn",to:"/hall-of-fame",children:"Post something"})]}):u.jsx("div",{className:"media-grid",children:a.map(F=>u.jsxs("div",{className:"card media-card",children:[F.kind==="video"?u.jsx("video",{src:F.url,controls:!0,preload:"metadata"}):u.jsx("img",{src:F.url,alt:F.caption??"Post",loading:"lazy"}),u.jsxs("div",{className:"media-body",children:[F.caption&&u.jsx("p",{className:"caption",children:F.caption}),u.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[u.jsxs("button",{className:`like-btn${F.likedByMe?" liked":""}`,onClick:()=>B(F),children:[F.likedByMe?"❤️":"🤍"," ",F.likesCount]}),u.jsx("span",{className:"form-note",children:Xo(F.createdAt)})]})]})]},F.id))}),_&&u.jsx(Op,{receiverId:n.id,receiverName:n.displayName,onClose:()=>M(!1)}),v&&u.jsx(Xx,{targetType:"user",targetId:n.id,onClose:()=>w(!1)})]})}const gL=["female","male","nonbinary","other"];function vL(){Wn("Edit Profile");const{user:t,setUser:e}=En(),n=zi(),[i,r]=P.useState((t==null?void 0:t.displayName)??""),[s,a]=P.useState((t==null?void 0:t.bio)??""),[o,l]=P.useState((t==null?void 0:t.gender)??"female"),[c,h]=P.useState((t==null?void 0:t.profileColor)??"#0066FF"),[p,d]=P.useState(null),[g,x]=P.useState(!1);if(!t)return null;const S=async m=>{m.preventDefault(),x(!0),d(null);try{const{user:f}=await bn.updateMe({displayName:i.trim(),bio:s.trim(),gender:o,profileColor:c});e(f),n(`/u/${f.id}`)}catch(f){d(f instanceof ot?f.message:"Could not save your profile.")}finally{x(!1)}};return u.jsxs("div",{style:{maxWidth:600},children:[u.jsxs("div",{className:"page-head",children:[u.jsx("h1",{className:"page-title",children:"Edit profile"}),u.jsx("p",{className:"page-sub",children:"Your color shows up everywhere — chats, leaderboard, your avatar."})]}),u.jsxs("div",{className:"card",children:[u.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.2rem"},children:[u.jsx(ri,{displayName:i||t.displayName,profileColor:c,size:"lg"}),u.jsxs("div",{children:[u.jsx("div",{style:{fontWeight:800},children:i||t.displayName}),u.jsx("div",{className:"form-note",children:"Live preview"})]})]}),u.jsxs("form",{onSubmit:S,children:[u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"pe-name",children:"Display name"}),u.jsx("input",{id:"pe-name",className:"input",value:i,onChange:m=>r(m.target.value),required:!0,maxLength:40})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"pe-bio",children:"Bio"}),u.jsx("textarea",{id:"pe-bio",className:"textarea",value:s,onChange:m=>a(m.target.value),maxLength:300,placeholder:"Tell the world who you are…"})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{htmlFor:"pe-gender",children:"Gender"}),u.jsx("select",{id:"pe-gender",className:"select",value:o,onChange:m=>l(m.target.value),children:gL.map(m=>u.jsx("option",{value:m,children:m[0].toUpperCase()+m.slice(1)},m))})]}),u.jsxs("div",{className:"field",children:[u.jsx("label",{children:"Profile color"}),u.jsxs("div",{className:"swatch-row",children:[AT.map(m=>u.jsx("button",{type:"button",className:`swatch${c.toLowerCase()===m.toLowerCase()?" selected":""}`,style:{background:m},onClick:()=>h(m),"aria-label":`Use color ${m}`,title:m},m)),u.jsx("input",{type:"color",className:"color-native",value:/^#[0-9a-f]{6}$/i.test(c)?c:"#0066FF",onChange:m=>h(m.target.value),"aria-label":"Pick a custom color",title:"Custom color"})]})]}),p&&u.jsx("div",{className:"form-error",children:p}),u.jsxs("div",{style:{display:"flex",gap:"0.6rem"},children:[u.jsx("button",{type:"button",className:"btn btn-ghost",style:{flex:1},onClick:()=>n(`/u/${t.id}`),children:"Cancel"}),u.jsx("button",{type:"submit",className:"btn",style:{flex:1},disabled:g,children:g?"Saving…":"Save changes"})]})]})]})]})}function _L({children:t}){const{user:e,loading:n}=En();return n?u.jsxs("div",{className:"loading-wrap",style:{minHeight:"100vh"},children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Waking up Big Face…"})]}):e?u.jsx(u.Fragment,{children:t}):u.jsx(zc,{to:"/login",replace:!0})}function i0({children:t}){const{user:e,loading:n}=En();return n?null:e?u.jsx(zc,{to:"/chats",replace:!0}):u.jsx(u.Fragment,{children:t})}function xL(){return u.jsx(Ew,{children:u.jsx(TT,{children:u.jsxs(hw,{children:[u.jsx(Xt,{path:"/login",element:u.jsx(i0,{children:u.jsx(UT,{})})}),u.jsx(Xt,{path:"/signup",element:u.jsx(i0,{children:u.jsx(FT,{})})}),u.jsxs(Xt,{path:"/*",element:u.jsx(_L,{children:u.jsx(IT,{})}),children:[u.jsx(Xt,{index:!0,element:u.jsx(zc,{to:"/chats",replace:!0})}),u.jsx(Xt,{path:"chats",element:u.jsx(kT,{})}),u.jsx(Xt,{path:"chats/:id",element:u.jsx(HT,{})}),u.jsx(Xt,{path:"video",element:u.jsx(jT,{})}),u.jsx(Xt,{path:"leaderboard",element:u.jsx(XT,{})}),u.jsx(Xt,{path:"hall-of-fame",element:u.jsx(qT,{})}),u.jsx(Xt,{path:"avatar-studio",element:u.jsx(IN,{})}),u.jsx(Xt,{path:"throne",element:u.jsx(ON,{})}),u.jsx(Xt,{path:"dj-booth",element:u.jsx(kN,{})}),u.jsx(Xt,{path:"safety",element:u.jsx(zN,{})}),u.jsx(Xt,{path:"wallet",element:u.jsx(fL,{})}),u.jsx(Xt,{path:"earnings",element:u.jsx(pL,{})}),u.jsx(Xt,{path:"u/:id",element:u.jsx(mL,{})}),u.jsx(Xt,{path:"profile/edit",element:u.jsx(vL,{})}),u.jsx(Xt,{path:"*",element:u.jsx(zc,{to:"/chats",replace:!0})})]})]})})})}Hd.createRoot(document.getElementById("root")).render(u.jsx(Ot.StrictMode,{children:u.jsx(xL,{})}));
