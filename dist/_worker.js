var e=(e,t,n)=>(r,i)=>{let a=-1;return o(0);async function o(s){if(s<=a)throw Error(`next() called multiple times`);a=s;let c,l=!1,u;if(e[s]?(u=e[s][0][0],r.req.routeIndex=s):u=s===e.length&&i||void 0,u)try{c=await u(r,()=>o(s+1))}catch(e){if(e instanceof Error&&t)r.error=e,c=await t(e,r),l=!0;else throw e}else r.finalized===!1&&n&&(c=await n(r));return c&&(r.finalized===!1||l)&&(r.res=c),r}},t=Symbol(),n=(e,t)=>new Response(e,{headers:{"Content-Type":t.replace(/^[^;]+/,e=>e.toLowerCase())}}).formData(),r=e=>`headers`in e,i=async(e,t=Object.create(null))=>{let{all:n=!1,dot:i=!1}=t,o=(r(e)?e.headers:e.raw.headers).get(`Content-Type`)?.split(`;`)[0].trim().toLowerCase();return o===`multipart/form-data`||o===`application/x-www-form-urlencoded`?a(e,{all:n,dot:i}):{}};async function a(e,t){if(!r(e)&&e.bodyCache.formData)return o(await e.bodyCache.formData,t);let i=r(e)?e.headers:e.raw.headers,a=n(await e.arrayBuffer(),i.get(`Content-Type`)||``);r(e)||(e.bodyCache.formData=a);let s=await a;return s?o(s,t):{}}function o(e,t){let n=Object.create(null);return e.forEach((e,r)=>{t.all||r.endsWith(`[]`)?s(n,r,e):n[r]=e}),t.dot&&Object.entries(n).forEach(([e,t])=>{e.includes(`.`)&&(c(n,e,t),delete n[e])}),n}var s=(e,t,n)=>{e[t]===void 0?e[t]=t.endsWith(`[]`)?[n]:n:Array.isArray(e[t])?e[t].push(n):e[t]=[e[t],n]},c=(e,t,n)=>{if(/(?:^|\.)__proto__\./.test(t))return;let r=e,i=t.split(`.`);i.forEach((e,t)=>{t===i.length-1?r[e]=n:((!r[e]||typeof r[e]!=`object`||Array.isArray(r[e])||r[e]instanceof File)&&(r[e]=Object.create(null)),r=r[e])})},l=e=>{let t=e.split(`/`);return t[0]===``&&t.shift(),t},u=e=>{let{groups:t,path:n}=d(e);return f(l(n),t)},d=e=>{let t=[];return e=e.replace(/\{[^}]+\}/g,(e,n)=>{let r=`@${n}`;return t.push([r,e]),r}),{groups:t,path:e}},f=(e,t)=>{for(let n=t.length-1;n>=0;n--){let[r]=t[n];for(let i=e.length-1;i>=0;i--)if(e[i].includes(r)){e[i]=e[i].replace(r,t[n][1]);break}}return e},p={},m=(e,t)=>{if(e===`*`)return`*`;let n=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(n){let r=`${e}#${t}`;return p[r]||(p[r]=n[2]?t&&t[0]!==`:`&&t[0]!==`*`?[r,n[1],RegExp(`^${n[2]}(?=/${t})`)]:[e,n[1],RegExp(`^${n[2]}$`)]:[e,n[1],!0]),p[r]}return null},h=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,e=>{try{return t(e)}catch{return e}})}},g=e=>h(e,decodeURI),ee=e=>{let t=e.url,n=t.indexOf(`/`,t.indexOf(`:`)+4),r=n;for(;r<t.length;r++){let e=t.charCodeAt(r);if(e===37){let e=t.indexOf(`?`,r),i=t.indexOf(`#`,r),a=e===-1?i===-1?void 0:i:i===-1?e:Math.min(e,i),o=t.slice(n,a);return g(o.includes(`%25`)?o.replace(/%25/g,`%2525`):o)}if(e===63||e===35)break}return t.slice(n,r)},te=e=>{let t=ee(e);return t.length>1&&t.at(-1)===`/`?t.slice(0,-1):t},_=(e,t,...n)=>(n.length&&(t=_(t,...n)),`${e?.[0]===`/`?``:`/`}${e}${t===`/`?``:`${e?.at(-1)===`/`?``:`/`}${t?.[0]===`/`?t.slice(1):t}`}`),ne=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(`:`))return null;let t=e.split(`/`),n=[],r=``;return t.forEach(e=>{if(e!==``&&!/\:/.test(e))r+=`/`+e;else if(/\:/.test(e)){if(e.charCodeAt(e.length-1)===63){n.length===0&&r===``?n.push(`/`):n.push(r);let t=e.slice(0,-1);r+=`/`+t,n.push(r)}else r+=`/`+e}}),n.filter((e,t,n)=>n.indexOf(e)===t)},v=e=>e.indexOf(`%`)===-1?e:h(e,oe),y=e=>(e.indexOf(`+`)!==-1&&(e=e.replace(/\+/g,` `)),v(e)),re=(e,t,n)=>{let r;if(!n&&t&&t.indexOf(`%`)===-1&&t.indexOf(`+`)===-1){let n=e.indexOf(`?`,8);if(n===-1)return;for(e.startsWith(t,n+1)||(n=e.indexOf(`&${t}`,n+1));n!==-1;){let r=e.charCodeAt(n+t.length+1);if(r===61){let r=n+t.length+2,i=e.indexOf(`&`,r);return y(e.slice(r,i===-1?void 0:i))}if(r==38||isNaN(r))return``;n=e.indexOf(`&${t}`,n+1)}if(r=/[%+]/.test(e),!r)return}let i=Object.create(null);r??=/[%+]/.test(e);let a=e.indexOf(`?`,8);for(;a!==-1;){let t=e.indexOf(`&`,a+1),o=e.indexOf(`=`,a);o>t&&t!==-1&&(o=-1);let s=e.slice(a+1,o===-1?t===-1?void 0:t:o);if(r&&(s=y(s)),a=t,s===``)continue;let c;o===-1?c=``:(c=e.slice(o+1,t===-1?void 0:t),r&&(c=y(c))),n?(i[s]&&Array.isArray(i[s])||(i[s]=[]),i[s].push(c)):i[s]??=c}return t?i[t]:i},ie=re,ae=(e,t)=>re(e,t,!0),oe=decodeURIComponent,se=class{raw;#e;#t;routeIndex=0;path;bodyCache={};constructor(e,t=`/`,n=[[]]){this.raw=e,this.path=t,this.#t=n}param(e){return e?this.#n(e):this.#r()}#n(e){let t=this.#t[0][this.routeIndex][1][e],n=this.#i(t);return n&&v(n)}#r(){let e={},t=Object.keys(this.#t[0][this.routeIndex][1]);for(let n of t){let t=this.#i(this.#t[0][this.routeIndex][1][n]);t!==void 0&&(e[n]=v(t))}return e}#i(e){return this.#t[1]?this.#t[1][e]:e}query(e){return ie(this.url,e)}queries(e){return ae(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;let t=Object.create(null);return this.raw.headers.forEach((e,n)=>{t[n]=e}),t}async parseBody(e){return i(this,e)}#a=e=>{let{bodyCache:t,raw:n}=this,r=t[e];if(r)return r;for(let n in t)return t[n].then(t=>(n===`json`&&(t=JSON.stringify(t)),new Response(t)[e]()));return t[e]=n[e]()};json(){return this.#a(`text`).then(e=>JSON.parse(e))}text(){return this.#a(`text`)}arrayBuffer(){return this.#a(`arrayBuffer`)}bytes(){return this.#a(`arrayBuffer`).then(e=>new Uint8Array(e))}blob(){return this.#a(`blob`)}formData(){return this.#a(`formData`)}addValidatedData(e,t){(this.#e??={})[e]=t}valid(e){return this.#e?.[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[t](){return this.#t}get matchedRoutes(){return this.#t[0].map(([[,e]])=>e)}get routePath(){return this.#t[0].map(([[,e]])=>e)[this.routeIndex].path}},ce={Stringify:1,BeforeStream:2,Stream:3},le=(e,t)=>{let n=new String(e);return n.isEscaped=!0,n.callbacks=t,n},ue=async(e,t,n,r,i)=>{typeof e==`object`&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));let a=e.callbacks;if(!a?.length)return Promise.resolve(e);i?i[0]+=e:i=[e];let o=Promise.all(a.map(e=>e({phase:t,buffer:i,context:r}))).then(e=>Promise.all(e.filter(Boolean).map(e=>ue(e,t,!1,r,i))).then(()=>i[0]));return n?le(await o,a):o},de=`text/plain; charset=UTF-8`,b=(e,t)=>({"Content-Type":e,...t}),x=(e,t)=>new Response(e,t),fe=class{#e;#t;env={};#n;finalized=!1;error;#r;#i;#a;#o;#s;#c;#l;#u;#d;constructor(e,t){this.#e=e,t&&(this.#i=t.executionCtx,this.env=t.env,this.#c=t.notFoundHandler,this.#d=t.path,this.#u=t.matchResult)}get req(){return this.#t??=new se(this.#e,this.#d,this.#u),this.#t}get event(){if(this.#i&&`respondWith`in this.#i)return this.#i;throw Error(`This context has no FetchEvent`)}get executionCtx(){if(this.#i)return this.#i;throw Error(`This context has no ExecutionContext`)}get res(){return this.#a||=x(null,{headers:this.#l??=new Headers})}set res(e){if(this.#a&&e){e=x(e.body,e);for(let[t,n]of this.#a.headers.entries())if(t!==`content-type`){if(t===`set-cookie`){let t=this.#a.headers.getSetCookie();e.headers.delete(`set-cookie`);for(let n of t)e.headers.append(`set-cookie`,n)}else e.headers.set(t,n)}}this.#a=e,this.finalized=!0}render=(...e)=>(this.#s??=e=>this.html(e),this.#s(...e));setLayout=e=>this.#o=e;getLayout=()=>this.#o;setRenderer=e=>{this.#s=e};header=(e,t,n)=>{this.finalized&&(this.#a=x(this.#a.body,this.#a));let r=this.#a?this.#a.headers:this.#l??=new Headers;t===void 0?r.delete(e):n?.append?r.append(e,t):r.set(e,t)};status=e=>{this.#r=e};set=(e,t)=>{this.#n??=new Map,this.#n.set(e,t)};get=e=>this.#n?this.#n.get(e):void 0;get var(){return this.#n?Object.fromEntries(this.#n):{}}#f(e,t,n){let r=this.#a?new Headers(this.#a.headers):this.#l;if(typeof t==`object`&&t.headers){r??=new Headers;for(let[e,n]of new Headers(t.headers))e===`set-cookie`?r.append(e,n):r.set(e,n)}if(n){if(!r){let e=0;for(let t in n)if(++e>1||typeof n[t]!=`string`){r=new Headers;break}}if(r)for(let e in n){let t=n[e];if(typeof t==`string`)r.set(e,t);else{r.delete(e);for(let n of t)r.append(e,n)}}}return x(e,{status:typeof t==`number`?t:t?.status??this.#r,headers:r??n})}newResponse=(...e)=>this.#f(...e);body=(e,t,n)=>this.#f(e,t,n);text=(e,t,n)=>!this.#l&&!this.#r&&!t&&!n&&!this.finalized?new Response(e):this.#f(e,t,b(de,n));json=(e,t,n)=>this.#f(JSON.stringify(e),t,b(`application/json`,n));html=(e,t,n)=>{let r=e=>this.#f(e,t,b(`text/html; charset=UTF-8`,n));return typeof e==`object`?ue(e,ce.Stringify,!1,{}).then(r):r(e)};redirect=(e,t)=>{let n=String(e);return this.header(`Location`,/[^\x00-\xFF]/.test(n)?encodeURI(n):n),this.newResponse(null,t??302)};notFound=()=>(this.#c??=()=>x(),this.#c(this))},pe=[`get`,`post`,`put`,`delete`,`options`,`patch`,`query`],me=`Can not add a route since the matcher is already built.`,he=class extends Error{},ge=`__COMPOSED_HANDLER`,_e=e=>e.text(`404 Not Found`,404),ve=(e,t)=>{if(`getResponse`in e){let n=e.getResponse();return t.newResponse(n.body,n)}return console.error(e),t.text(`Internal Server Error`,500)},ye=class t{get;post;put;delete;options;patch;query;all;on;use;router;getPath;_basePath=`/`;#e=`/`;routes=[];constructor(e={}){[...pe,`all`].forEach(e=>{this[e]=(t,...n)=>(typeof t==`string`?this.#e=t:this.#r(e,this.#e,t),n.forEach(t=>{this.#r(e,this.#e,t)}),this)}),this.on=(e,t,...n)=>{for(let r of[t].flat()){this.#e=r;for(let t of[e].flat())n.map(e=>{this.#r(t.toUpperCase(),this.#e,e)})}return this},this.use=(e,...t)=>(typeof e==`string`?this.#e=e:(this.#e=`*`,t.unshift(e)),t.forEach(e=>{this.#r(`ALL`,this.#e,e)}),this);let{strict:t,...n}=e;Object.assign(this,n),this.getPath=t??!0?e.getPath??ee:te}#t(){let e=new t({router:this.router,getPath:this.getPath});return e.errorHandler=this.errorHandler,e.#n=this.#n,e.routes=this.routes,e}#n=_e;errorHandler=ve;route(t,n){let r=this.basePath(t);return n.routes.map(t=>{let i;n.errorHandler===ve?i=t.handler:(i=async(r,i)=>(await e([],n.errorHandler)(r,()=>t.handler(r,i))).res,i[ge]=t.handler),r.#r(t.method,t.path,i,t.basePath)}),this}basePath(e){let t=this.#t();return t._basePath=_(this._basePath,e),t}onError=e=>(this.errorHandler=e,this);notFound=e=>(this.#n=e,this);mount(e,t,n){let r,i;n&&(typeof n==`function`?i=n:(i=n.optionHandler,r=n.replaceRequest===!1?e=>e:n.replaceRequest));let a=i?e=>{let t=i(e);return Array.isArray(t)?t:[t]}:e=>{let t;try{t=e.executionCtx}catch{}return[e.env,t]};return r||=(()=>{let t=_(this._basePath,e),n=t===`/`?0:t.length;return e=>{let t=new URL(e.url);return t.pathname=this.getPath(e).slice(n)||`/`,new Request(t,e)}})(),this.#r(`ALL`,_(e,`*`),async(e,n)=>{let i=await t(r(e.req.raw),...a(e));if(i)return i;await n()}),this}#r(e,t,n,r){e=e.toUpperCase(),t=_(this._basePath,t);let i={basePath:r===void 0?this._basePath:_(this._basePath,r),path:t,method:e,handler:n};this.router.add(e,t,[n,i]),this.routes.push(i)}#i(e,t){if(e instanceof Error)return this.errorHandler(e,t);throw e}#a(t,n,r,i){if(i===`HEAD`)return(async()=>new Response(null,await this.#a(t,n,r,`GET`)))();let a=this.getPath(t,{env:r}),o=this.router.match(i,a),s=new fe(t,{path:a,matchResult:o,env:r,executionCtx:n,notFoundHandler:this.#n});if(o[0].length===1){let e;try{e=o[0][0][0][0](s,async()=>{s.res=await this.#n(s)})}catch(e){return this.#i(e,s)}return e instanceof Promise?e.then(e=>e||(s.finalized?s.res:this.#n(s))).catch(e=>this.#i(e,s)):e??this.#n(s)}let c=e(o[0],this.errorHandler,this.#n);return(async()=>{try{let e=await c(s);if(!e.finalized)throw Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return e.res}catch(e){return this.#i(e,s)}})()}fetch=(e,...t)=>this.#a(e,t[1],t[0],e.method);request=(e,t,n,r)=>e instanceof Request?this.fetch(t?new Request(e,t):e,n,r):(e=e.toString(),this.fetch(new Request(/^https?:\/\//.test(e)?e:`http://localhost${_(`/`,e)}`,t),n,r));fire=()=>{addEventListener(`fetch`,e=>{e.respondWith(this.#a(e.request,e,void 0,e.request.method))})}},be=[];function xe(e,t){let n=this.buildAllMatchers(),r=((e,t)=>{let r=n[e]||n.ALL,i=r[2][t];if(i)return i;let a=t.match(r[0]);if(!a)return[[],be];let o=a.indexOf(``,1);return[r[1][o],a]});return this.match=r,r(e,t)}var S=`[^/]+`,C=`.*`,w=`(?:|/.*)`,T=Symbol(),Se=new Set(`.\\+*[^]$()`);function Ce(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1?1:e===C||e===w?t===w?-1:1:t===C||t===w?-1:e===S?1:t===S?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var we=class e{#e;#t;#n=Object.create(null);insert(t,n,r,i,a){let o=this;for(let n=0,a=t.length;n<a;n++){let s=t[n],c=s.length===1?s===`*`?n===a-1?[``,``,C]:[``,``,S]:null:s===`/*`?[``,``,w]:s.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/),l;if(c){let t=c[1],n=c[2]||S;if(t&&c[2]&&(n===`.*`||(n=n.replace(/^\((?!\?:)(?=[^)]+\)$)/,`(?:`),/\((?!\?:)/.test(n))||n.length===1&&Se.has(n)))throw T;if(l=o.#n[n],!l){if(n!==C&&n!==w){for(let e in o.#n)if((n.length>1||e.length>1)&&e!==C&&e!==w)throw T}l=o.#n[n]=new e}t!==``&&(l.#t??=i.varIndex++,r.push([t,l.#t]))}else if(l=o.#n[s],!l){for(let e in o.#n)if(e.length>1&&e!==C&&e!==w)throw T;l=o.#n[s]=new e}o=l}if(o.#e!==void 0)throw T;o.#e=a?-1:n}buildRegExpStr(){let e=Object.keys(this.#n).sort(Ce).map(e=>{let t=this.#n[e],n=t.buildRegExpStr();return n===``?``:(typeof t.#t==`number`?`(${e})@${t.#t}`:Se.has(e)?`\\${e}`:e)+n}).filter(Boolean);return typeof this.#e==`number`&&this.#e!==-1&&e.unshift(`#${this.#e}`),e.length===0?``:e.length===1?e[0]:`(?:`+e.join(`|`)+`)`}},Te=class{#e={varIndex:0};#t=new we;#n=0;paths=Object.create(null);insert(e,t){if(t){this.#t.insert(e.split(``),0,[],this.#e,!0);return}let n=[],r=[],i=e;for(let e=0;;){let t=!1;if(i=i.replace(/\{[^}]+\}/g,n=>{let i=`@\\${e}`;return r[e]=[i,n],e++,t=!0,i}),!t)break}let a=i.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let e=r.length-1;e>=0;e--){let[t]=r[e];for(let n=a.length-1;n>=0;n--)if(a[n].indexOf(t)!==-1){a[n]=a[n].replace(t,r[e][1]);break}}this.#t.insert(a,this.#n,n,this.#e,!1),this.paths[e]=[this.#n++,n]}buildRegExp(){let e=this.#t.buildRegExpStr();if(e===``)return[/^$/,[],[]];let t=0,n=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(e,i,a)=>i===void 0?(a===void 0||(r[Number(a)]=++t),``):(n[++t]=Number(i),`$()`)),[RegExp(`^${e}`),n,r]}},Ee=Object.create(null);function De(e){return Ee[e]??=RegExp(e===`*`?``:`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(e,t)=>t?`\\${t}`:`(?:|/.*)`)}$`)}function Oe(){Ee=Object.create(null)}function E(e,t){if(e){for(let n of Object.keys(e).sort((e,t)=>t.length-e.length))if(De(n).test(t))return[...e[n]]}}var ke=class{name=`RegExpRouter`;#e;#t;#n;constructor(){this.#e={ALL:Object.create(null)},this.#t={ALL:Object.create(null)},this.#n={ALL:new Te}}#r(e,t){try{this.#n[e].insert(t,!/\*|\/:/.test(t))}catch(e){throw e===T?new he(t):e}}add(e,t,n){let r=this.#e,i=this.#t;if(!r||!i)throw Error(me);r[e]||(this.#n[e]=new Te,[r,i].forEach(t=>{t[e]=Object.create(null),Object.keys(t.ALL).forEach(n=>{t[e][n]=[...t.ALL[n]],this.#r(e,n)})})),t===`/*`&&(t=`*`);let a=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){let o=De(t);Object.keys(r).forEach(n=>{(e===`ALL`||e===n)&&!r[n][t]&&(this.#r(n,t),r[n][t]=E(r[n],t)||E(r.ALL,t)||[])}),Object.keys(r).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(r[t]).forEach(e=>{o.test(e)&&r[t][e].push([n,a])})}),Object.keys(i).forEach(t=>{(e===`ALL`||e===t)&&Object.keys(i[t]).forEach(e=>o.test(e)&&i[t][e].push([n,a]))});return}let o=ne(t)||[t];for(let t=0,s=o.length;t<s;t++){let c=o[t];Object.keys(i).forEach(o=>{(e===`ALL`||e===o)&&(i[o][c]||(this.#r(o,c),i[o][c]=[...E(r[o],c)||E(r.ALL,c)||[]]),i[o][c].push([n,a-s+t+1]))})}}match=xe;buildAllMatchers(){let e=Object.create(null);return Object.keys(this.#t).concat(Object.keys(this.#e)).forEach(t=>{e[t]||=this.#i(t)}),this.#e=this.#t=this.#n=void 0,Oe(),e}#i(e){let t=this.#e[e],n=this.#t[e],r=this.#n[e],i=Object.create(null),a=[];[t,n].forEach(e=>{for(let t in e){let n=e[t],o=r.paths[t];if(!o){i[t]=[n.map(([e])=>[e,Object.create(null)]),be];continue}let s=o[1];a[o[0]]=n.map(([e,t])=>{let n=Object.create(null);for(--t;t>=0;t--){let[e,r]=s[t];n[e]=r}return[e,n]})}});let[o,s,c]=r.buildRegExp();for(let e=0,t=a.length;e<t;e++)for(let t=0,n=a[e].length;t<n;t++){let n=a[e][t]?.[1];if(!n)continue;let r=Object.keys(n);for(let e=0,t=r.length;e<t;e++)n[r[e]]=c[n[r[e]]]}let l=[];for(let e in s)l[e]=a[s[e]];return[o,l,i]}},Ae=class{name=`SmartRouter`;#e=[];#t=[];constructor(e){this.#e=e.routers}add(e,t,n){if(!this.#t)throw Error(me);this.#t.push([e,t,n])}match(e,t){if(!this.#t)throw Error(`Fatal error`);let n=this.#e,r=this.#t,i=n.length,a=0,o;for(;a<i;a++){let i=n[a];try{for(let e=0,t=r.length;e<t;e++)i.add(...r[e]);o=i.match(e,t)}catch(e){if(e instanceof he)continue;throw e}this.match=i.match.bind(i),this.#e=[i],this.#t=void 0;break}if(a===i)throw Error(`Fatal error`);return this.name=`SmartRouter + ${this.activeRouter.name}`,o}get activeRouter(){if(this.#t||this.#e.length!==1)throw Error(`No active router has been determined yet.`);return this.#e[0]}},D=Object.create(null),je=0,Me=class e{#e=[];#t=Object.create(null);#n=[];#r;#i=D;insert(t,n,r){let i=this,a=u(n),o=new Set,s=0;for(let t of a){let n=a[++s],r=m(t,n)||(n===void 0&&t&&t.indexOf(`*`)===t.length-1?t:null),c=Array.isArray(r),l=c?r[0]:r||t,u=i.#t[l]||=new e;r&&!u.#r&&(u.#r=r,i.#n.push(u)),i=u,c&&o.add(r[1])}i.#e.push({[t]:{handler:r,possibleKeys:[...o],score:++je}})}#a(e,t,n,r,i){for(let a=0,o=t.#e.length;a<o;a++){let o=t.#e[a],s=o[n]||o.ALL;if(s){s.params=Object.create(null),e.push(s);for(let e=0,t=s.possibleKeys.length;e<t;e++){let t=s.possibleKeys[e];s.params[t]=i?.[t]&&!e?i[t]:r[t]??i?.[t]}}}}search(e,t){let n=[];this.#i=D;let r=[this],i=l(t),a=[],o=i.length,s=null;for(let c=0;c<o;c++){let l=i[c],u=c===o-1,d=[];for(let f=0,p=r.length;f<p;f++){let p=r[f],m=p.#t[l];m&&(m.#i=p.#i,u?(m.#t[`*`]&&this.#a(n,m.#t[`*`],e,p.#i),this.#a(n,m,e,p.#i)):d.push(m));for(let r of p.#n){let f=r.#r,m=p.#i===D?{}:{...p.#i};if(typeof f==`string`){(f===`*`||l.startsWith(f.slice(0,-1)))&&(this.#a(n,r,e,p.#i),f===`*`&&(r.#i=m,d.push(r)));continue}let[,h,g]=f;if(!(!l&&g===!0)){if(g!==!0){if(!s){s=[];let e=+(t[0]===`/`);for(let t=0;t<o;t++)s[t]=e,e+=i[t].length+1}let l=t.slice(s[c]),u=g.exec(l);if(u){m[h]=u[0],this.#a(n,r,e,p.#i,m),u[0].length===l.length&&r.#t[`*`]&&this.#a(n,r.#t[`*`],e,p.#i,m);for(let e in r.#t){r.#i=m;let e=u[0].match(/\//g)?.length??0;(a[e]||=[]).push(r);break}continue}}(g===!0||g.test(l))&&(m[h]=l,u?(this.#a(n,r,e,m,p.#i),r.#t[`*`]&&this.#a(n,r.#t[`*`],e,m,p.#i)):(r.#i=m,d.push(r)))}}}let f=a.shift();r=f?d.concat(f):d}return n[1]&&n.sort((e,t)=>e.score-t.score),[n.map(({handler:e,params:t})=>[e,t])]}},Ne=class{name=`TrieRouter`;#e=new Me;add(e,t,n){for(let r of ne(t)||[t])this.#e.insert(e,r,n)}match(e,t){return this.#e.search(e,t)}},O=class extends ye{constructor(e={}){super(e),this.router=e.router??new Ae({routers:[new ke,new Ne]})}},Pe=e=>{let t={origin:`*`,allowMethods:[`GET`,`HEAD`,`PUT`,`POST`,`DELETE`,`PATCH`,`QUERY`],allowHeaders:[],exposeHeaders:[],...e},n=t.exposeHeaders?.length?t.exposeHeaders.join(`,`):void 0,r=t.allowHeaders?.length?t.allowHeaders.join(`,`):void 0,i=(e=>typeof e==`string`?e===`*`?()=>e:t=>e===t?t:null:typeof e==`function`?e:t=>e.includes(t)?t:null)(t.origin),a=(e=>{if(typeof e==`function`)return async(t,n)=>(await e(t,n)).join(`,`);if(Array.isArray(e)){let t=e.join(`,`);return()=>t}return()=>``})(t.allowMethods);return async function(e,o){function s(t,n){e.res.headers.set(t,n)}let c=await i(e.req.header(`origin`)||``,e);if(c&&s(`Access-Control-Allow-Origin`,c),t.credentials&&s(`Access-Control-Allow-Credentials`,`true`),n&&s(`Access-Control-Expose-Headers`,n),e.req.method===`OPTIONS`){t.origin!==`*`&&e.res.headers.append(`Vary`,`Origin`),t.maxAge!=null&&s(`Access-Control-Max-Age`,t.maxAge.toString());let n=await a(e.req.header(`origin`)||``,e);n&&s(`Access-Control-Allow-Methods`,n);let i=r;if(!i){let t=e.req.header(`Access-Control-Request-Headers`);t&&(i=t.split(`,`).map(e=>e.trim()).join(`,`))}return i&&(s(`Access-Control-Allow-Headers`,i),e.res.headers.append(`Vary`,`Access-Control-Request-Headers`)),e.res.headers.delete(`Content-Length`),e.res.headers.delete(`Content-Type`),new Response(null,{headers:e.res.headers,status:204,statusText:`No Content`})}await o(),t.origin!==`*`&&e.header(`Vary`,`Origin`,{append:!0})}},Fe=/^[\w!#$%&'*.^`|~+-]+$/,Ie=/^[!#-:<>-[\]-~]+$/,Le=/^[ !#-:<-[\]-~]*$/,Re=e=>{let t=0,n=e.length;for(;t<n;){let n=e.charCodeAt(t);if(n!==32&&n!==9)break;t++}for(;n>t;){let t=e.charCodeAt(n-1);if(t!==32&&t!==9)break;n--}return t===0&&n===e.length?e:e.slice(t,n)},ze=(e,t)=>{if(t&&e.indexOf(t)===-1)return{};let n=e.split(`;`),r=Object.create(null);for(let e of n){let n=e.indexOf(`=`);if(n===-1)continue;let i=Re(e.substring(0,n));if(t&&t!==i||!Ie.test(i)||i in r)continue;let a=Re(e.substring(n+1));if(a.startsWith(`"`)&&a.endsWith(`"`)&&(a=a.slice(1,-1)),Le.test(a)&&(r[i]=v(a),t))break}return r},Be=(e,t,n={})=>{if(!Fe.test(e))throw Error(`Invalid cookie name`);let r=`${e}=${t}`;if(e.startsWith(`__Secure-`)&&!n.secure)throw Error(`__Secure- Cookie must have Secure attributes`);if(e.startsWith(`__Host-`)){if(!n.secure)throw Error(`__Host- Cookie must have Secure attributes`);if(n.path!==`/`)throw Error(`__Host- Cookie must have Path attributes with "/"`);if(n.domain)throw Error(`__Host- Cookie must not have Domain attributes`)}for(let e of[`domain`,`path`,`sameSite`,`priority`])if(n[e]&&/[;\r\n]/.test(n[e]))throw Error(`${e} must not contain ";", "\\r", or "\\n"`);if(n&&typeof n.maxAge==`number`&&n.maxAge>=0){if(n.maxAge>3456e4)throw Error(`Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.`);r+=`; Max-Age=${n.maxAge|0}`}if(n.domain&&n.prefix!==`host`&&(r+=`; Domain=${n.domain}`),n.path&&(r+=`; Path=${n.path}`),n.expires){if(n.expires.getTime()-Date.now()>3456e7)throw Error(`Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.`);r+=`; Expires=${n.expires.toUTCString()}`}if(n.httpOnly&&(r+=`; HttpOnly`),n.secure&&(r+=`; Secure`),n.sameSite&&(r+=`; SameSite=${n.sameSite.charAt(0).toUpperCase()+n.sameSite.slice(1)}`),n.priority&&(r+=`; Priority=${n.priority.charAt(0).toUpperCase()+n.priority.slice(1)}`),n.partitioned){if(!n.secure)throw Error(`Partitioned Cookie must have Secure attributes`);r+=`; Partitioned`}return r},k=(e,t,n)=>(t=encodeURIComponent(t),Be(e,t,n)),A=(e,t,n)=>{let r=e.req.raw.headers.get(`Cookie`);if(typeof t==`string`){if(!r)return;let e=t;return n===`secure`?e=`__Secure-`+t:n===`host`&&(e=`__Host-`+t),ze(r,e)[e]}return r?ze(r):{}},Ve=(e,t,n)=>{let r;return r=n?.prefix===`secure`?k(`__Secure-`+e,t,{path:`/`,...n,secure:!0}):n?.prefix===`host`?k(`__Host-`+e,t,{...n,path:`/`,secure:!0,domain:void 0}):k(e,t,{path:`/`,...n}),r},He=(e,t,n,r)=>{let i=Ve(t,n,r);e.header(`Set-Cookie`,i,{append:!0})},Ue=(e,t,n)=>{let r=A(e,t,n?.prefix);return He(e,t,``,{...n,maxAge:0}),r},We=1e5;async function j(e,t){let n=t?Ke(t):crypto.getRandomValues(new Uint8Array(16)),r=await crypto.subtle.importKey(`raw`,new TextEncoder().encode(e),`PBKDF2`,!1,[`deriveBits`]),i=await crypto.subtle.deriveBits({name:`PBKDF2`,salt:n,iterations:We,hash:`SHA-256`},r,256);return{hash:M(new Uint8Array(i)),salt:M(n)}}async function Ge(e,t,n){let{hash:r}=await j(e,t);if(r.length!==n.length)return!1;let i=0;for(let e=0;e<r.length;e++)i|=r.charCodeAt(e)^n.charCodeAt(e);return i===0}function M(e){return Array.from(e).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function Ke(e){return new Uint8Array(e.match(/.{2}/g).map(e=>parseInt(e,16)))}function qe(){return M(crypto.getRandomValues(new Uint8Array(32)))}var N=`saraya_session`,Je=12;async function Ye(e,t,n){let r=qe(),i=new Date(Date.now()+Je*3600*1e3).toISOString();return await e.prepare(`INSERT INTO sessions (id, user_id, expires_at, ip) VALUES (?, ?, ?, ?)`).bind(r,t,i,n).run(),r}function Xe(e,t){He(e,N,t,{httpOnly:!0,secure:!0,sameSite:`Lax`,path:`/`,maxAge:Je*3600})}function Ze(e){Ue(e,N,{path:`/`})}async function Qe(e){let t=A(e,N);return!t||!/^[a-f0-9]{64}$/.test(t)?null:await e.env.DB.prepare(`
    SELECT u.id, u.email, u.name, u.role FROM sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.id = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).bind(t).first()||null}async function $e(e){let t=A(e,N);t&&await e.env.DB.prepare(`DELETE FROM sessions WHERE id = ?`).bind(t).run(),Ze(e)}var et={super_admin:[`*`],content_manager:[`products`,`categories`,`services`,`projects`,`media`,`homepage`,`dashboard`],sales:[`leads`,`dashboard`],editor:[`products`,`categories`,`services`,`projects`,`homepage`,`dashboard`]};function tt(e,t){let n=et[e]||[];return n.includes(`*`)||n.includes(t)}function nt(){return async(e,t)=>{let n=await Qe(e);if(!n)return e.json({error:`غير مصرح — يجب تسجيل الدخول`},401);e.set(`user`,n),await t()}}function P(e){return async(t,n)=>{let r=t.get(`user`);if(!r||!tt(r.role,e))return t.json({error:`ليس لديك صلاحية لهذا الإجراء`},403);await n()}}async function F(e,t,n,r,i,a,o){try{await e.prepare(`INSERT INTO audit_log (user_id, user_email, action, entity, entity_id, metadata, ip) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(t?.id??null,t?.email??null,n,r,i,a?JSON.stringify(a):null,o??null).run()}catch{}}var rt=new Map;function it(e,t=8,n=6e5){let r=Date.now(),i=rt.get(e);return!i||r>i.reset?(rt.set(e,{count:1,reset:r+n}),!0):(i.count++,i.count<=t)}var I=new O;I.post(`/login`,async e=>{let t=e.req.header(`cf-connecting-ip`)||e.req.header(`x-forwarded-for`)||`unknown`;if(!it(`login:`+t))return e.json({error:`محاولات كثيرة — حاول مرة أخرى بعد قليل`},429);let n;try{n=await e.req.json()}catch{return e.json({error:`بيانات غير صالحة`},400)}let r=String(n.email||``).trim().toLowerCase(),i=String(n.password||``);if(!r||!i)return e.json({error:`البريد وكلمة المرور مطلوبان`},400);let a=await e.env.DB.prepare(`SELECT id, email, name, role, password_hash, password_salt, is_active FROM admin_users WHERE lower(email) = ?`).bind(r).first();return!a||!a.is_active?e.json({error:`بيانات الدخول غير صحيحة`},401):await Ge(i,a.password_salt,a.password_hash)?(Xe(e,await Ye(e.env.DB,a.id,t)),await e.env.DB.prepare(`UPDATE admin_users SET last_login_at = datetime("now") WHERE id = ?`).bind(a.id).run(),await F(e.env.DB,{id:a.id,email:a.email,name:a.name,role:a.role},`login`,`admin_users`,a.id,null,t),e.json({user:{id:a.id,email:a.email,name:a.name,role:a.role}})):(await F(e.env.DB,null,`login_failed`,`admin_users`,a.id,{email:r},t),e.json({error:`بيانات الدخول غير صحيحة`},401))}),I.post(`/logout`,async e=>(await $e(e),e.json({success:!0}))),I.get(`/me`,async e=>{let t=await Qe(e);return t?e.json({user:t}):e.json({user:null},401)});function L(e){return(e||``).toString().trim().toLowerCase().replace(/[^\u0600-\u06FFa-z0-9\s-]/g,``).replace(/\s+/g,`-`).replace(/-+/g,`-`)||`item-`+Date.now()}function R(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function at(e){return(e||``).split(`
`).map(e=>e.trim()).filter(Boolean)}function ot(){return`QR-${new Date().toISOString().slice(0,10).replace(/-/g,``)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`}function z(e,t){let n=(e||``).replace(/\D/g,``);return n.startsWith(`0`)&&(n=`2`+n),`https://wa.me/${n}?text=${encodeURIComponent(t)}`}async function B(e){let t=await e.prepare(`SELECT key, value FROM settings`).all(),n={};for(let e of t.results||[])n[e.key]=e.value;return n}function V(e,t,n,r){e.prepare(`INSERT INTO analytics_events (event_type, entity_id, path) VALUES (?, ?, ?)`).bind(t,n,r).run().catch(()=>{})}var H=new O;H.use(`*`,nt()),H.get(`/stats`,async e=>{let t=e.env.DB,n=await t.prepare(`SELECT
    (SELECT COUNT(*) FROM products) AS products_total,
    (SELECT COUNT(*) FROM products WHERE status='published') AS products_published,
    (SELECT COUNT(*) FROM categories) AS categories_total,
    (SELECT COUNT(*) FROM services) AS services_total,
    (SELECT COUNT(*) FROM projects) AS projects_total,
    (SELECT COUNT(*) FROM leads) AS leads_total,
    (SELECT COUNT(*) FROM leads WHERE status='new') AS leads_new,
    (SELECT COUNT(*) FROM leads WHERE type='quote') AS quotes_total,
    (SELECT COUNT(*) FROM leads WHERE type='contact') AS messages_total,
    (SELECT COUNT(*) FROM analytics_events WHERE event_type='page_view') AS page_views,
    (SELECT COUNT(*) FROM analytics_events WHERE event_type='whatsapp_click') AS whatsapp_clicks
  `).first(),r=await t.prepare(`SELECT id, request_ref, type, name, phone, status, created_at FROM leads ORDER BY created_at DESC LIMIT 6`).all(),i=await t.prepare(`SELECT user_email, action, entity, entity_id, created_at FROM audit_log ORDER BY created_at DESC LIMIT 10`).all();return e.json({stats:n,recent_leads:r.results,recent_activity:i.results})}),H.get(`/products`,P(`products`),async e=>{let t=e.req.query(`q`)||``,n=e.req.query(`status`)||``,r=e.req.query(`category_id`)||``,i=`SELECT p.*, c.name_ar AS category_name FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE 1=1`,a=[];t&&(i+=` AND (p.name_ar LIKE ? OR p.name_en LIKE ? OR p.sku LIKE ?)`,a.push(`%${t}%`,`%${t}%`,`%${t}%`)),n&&(i+=` AND p.status = ?`,a.push(n)),r&&(i+=` AND p.category_id = ?`,a.push(Number(r))),i+=` ORDER BY p.updated_at DESC LIMIT 200`;let o=await e.env.DB.prepare(i).bind(...a).all();return e.json({products:o.results})}),H.get(`/products/:id`,P(`products`),async e=>{let t=Number(e.req.param(`id`)),n=await e.env.DB.prepare(`SELECT * FROM products WHERE id = ?`).bind(t).first();if(!n)return e.json({error:`غير موجود`},404);let r=await e.env.DB.prepare(`SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order`).bind(t).all();return e.json({product:n,images:r.results})});var U=[`sku`,`name_ar`,`name_en`,`short_desc_ar`,`short_desc_en`,`description_ar`,`description_en`,`category_id`,`main_image`,`specifications`,`materials_ar`,`materials_en`,`dimensions`,`features_ar`,`features_en`,`price`,`show_price`,`is_featured`,`is_new`,`is_offer`,`status`,`seo_title`,`seo_description`,`og_image`];H.post(`/products`,P(`products`),async e=>{let t=await e.req.json();if(!t.name_ar)return e.json({error:`الاسم بالعربية مطلوب`},400);let n=t.slug?L(t.slug):L(t.name_ar),r=U.map(e=>t[e]??null),i=(await e.env.DB.prepare(`INSERT INTO products (slug, ${U.join(`,`)}) VALUES (?${`,?`.repeat(U.length)})`).bind(n+`-`+Date.now().toString(36),...r).run()).meta.last_row_id;if(await e.env.DB.prepare(`SELECT id FROM products WHERE slug = ? AND id != ?`).bind(n,i).first()||await e.env.DB.prepare(`UPDATE products SET slug = ? WHERE id = ?`).bind(n,i).run(),Array.isArray(t.images))for(let n=0;n<t.images.length;n++)await e.env.DB.prepare(`INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)`).bind(i,t.images[n],n).run();return await F(e.env.DB,e.get(`user`),`create`,`products`,Number(i),{name:t.name_ar}),e.json({id:i},201)}),H.put(`/products/:id`,P(`products`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];for(let e of U)e in n&&(r.push(`${e} = ?`),i.push(n[e]));if(n.slug&&(r.push(`slug = ?`),i.push(L(n.slug))),!r.length&&!Array.isArray(n.images))return e.json({error:`لا توجد تعديلات`},400);if(r.length&&(r.push(`updated_at = datetime('now')`,`updated_by = ?`),i.push(e.get(`user`).id,t),await e.env.DB.prepare(`UPDATE products SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run()),Array.isArray(n.images)){await e.env.DB.prepare(`DELETE FROM product_images WHERE product_id = ?`).bind(t).run();for(let r=0;r<n.images.length;r++)await e.env.DB.prepare(`INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)`).bind(t,n.images[r],r).run()}return await F(e.env.DB,e.get(`user`),`update`,`products`,t),e.json({success:!0})}),H.delete(`/products/:id`,P(`products`),async e=>{let t=Number(e.req.param(`id`));return await e.env.DB.prepare(`DELETE FROM products WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`products`,t),e.json({success:!0})}),H.get(`/categories`,P(`categories`),async e=>{let t=await e.env.DB.prepare(`
    SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS products_count
    FROM categories c ORDER BY c.sort_order`).all();return e.json({categories:t.results})});var W=[`name_ar`,`name_en`,`description_ar`,`description_en`,`image_url`,`icon`,`parent_id`,`sort_order`,`is_active`,`seo_title`,`seo_description`];H.post(`/categories`,P(`categories`),async e=>{let t=await e.req.json();if(!t.name_ar)return e.json({error:`الاسم بالعربية مطلوب`},400);let n=L(t.slug||t.name_ar),r=W.map(e=>t[e]??null),i=(await e.env.DB.prepare(`INSERT INTO categories (slug, ${W.join(`,`)}) VALUES (?${`,?`.repeat(W.length)})`).bind(n+`-`+Date.now().toString(36),...r).run()).meta.last_row_id;return await e.env.DB.prepare(`SELECT id FROM categories WHERE slug = ? AND id != ?`).bind(n,i).first()||await e.env.DB.prepare(`UPDATE categories SET slug = ? WHERE id = ?`).bind(n,i).run(),await F(e.env.DB,e.get(`user`),`create`,`categories`,Number(i)),e.json({id:i},201)}),H.put(`/categories/:id`,P(`categories`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];for(let e of W)e in n&&(r.push(`${e} = ?`),i.push(n[e]));return r.length?(r.push(`updated_at = datetime('now')`),i.push(t),await e.env.DB.prepare(`UPDATE categories SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run(),await F(e.env.DB,e.get(`user`),`update`,`categories`,t),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.delete(`/categories/:id`,P(`categories`),async e=>{let t=Number(e.req.param(`id`)),n=await e.env.DB.prepare(`SELECT COUNT(*) AS n FROM products WHERE category_id = ?`).bind(t).first();return n&&n.n>0?e.json({error:`لا يمكن الحذف — يوجد ${n.n} منتج مرتبط بهذه الفئة`},409):(await e.env.DB.prepare(`DELETE FROM categories WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`categories`,t),e.json({success:!0}))});var G=[`title_ar`,`title_en`,`short_desc_ar`,`short_desc_en`,`description_ar`,`description_en`,`image_url`,`icon`,`features_ar`,`features_en`,`sort_order`,`is_active`,`seo_title`,`seo_description`];H.get(`/services`,P(`services`),async e=>{let t=await e.env.DB.prepare(`SELECT * FROM services ORDER BY sort_order`).all();return e.json({services:t.results})}),H.post(`/services`,P(`services`),async e=>{let t=await e.req.json();if(!t.title_ar)return e.json({error:`العنوان بالعربية مطلوب`},400);let n=L(t.slug||t.title_ar)+`-`+Date.now().toString(36),r=G.map(e=>t[e]??null),i=await e.env.DB.prepare(`INSERT INTO services (slug, ${G.join(`,`)}) VALUES (?${`,?`.repeat(G.length)})`).bind(n,...r).run();return await F(e.env.DB,e.get(`user`),`create`,`services`,Number(i.meta.last_row_id)),e.json({id:i.meta.last_row_id},201)}),H.put(`/services/:id`,P(`services`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];for(let e of G)e in n&&(r.push(`${e} = ?`),i.push(n[e]));return r.length?(r.push(`updated_at = datetime('now')`),i.push(t),await e.env.DB.prepare(`UPDATE services SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run(),await F(e.env.DB,e.get(`user`),`update`,`services`,t),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.delete(`/services/:id`,P(`services`),async e=>{let t=Number(e.req.param(`id`));return await e.env.DB.prepare(`DELETE FROM services WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`services`,t),e.json({success:!0})});var K=[`title_ar`,`title_en`,`description_ar`,`description_en`,`cover_image`,`client_name`,`location`,`project_type`,`project_date`,`is_featured`,`status`];H.get(`/projects`,P(`projects`),async e=>{let t=await e.env.DB.prepare(`SELECT * FROM projects ORDER BY created_at DESC`).all();return e.json({projects:t.results})}),H.get(`/projects/:id`,P(`projects`),async e=>{let t=Number(e.req.param(`id`)),n=await e.env.DB.prepare(`SELECT * FROM projects WHERE id = ?`).bind(t).first();if(!n)return e.json({error:`غير موجود`},404);let r=await e.env.DB.prepare(`SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order`).bind(t).all();return e.json({project:n,images:r.results})}),H.post(`/projects`,P(`projects`),async e=>{let t=await e.req.json();if(!t.title_ar)return e.json({error:`العنوان بالعربية مطلوب`},400);let n=L(t.slug||t.title_ar)+`-`+Date.now().toString(36),r=K.map(e=>t[e]??null),i=(await e.env.DB.prepare(`INSERT INTO projects (slug, ${K.join(`,`)}) VALUES (?${`,?`.repeat(K.length)})`).bind(n,...r).run()).meta.last_row_id;if(Array.isArray(t.images))for(let n=0;n<t.images.length;n++)await e.env.DB.prepare(`INSERT INTO project_images (project_id, url, sort_order) VALUES (?, ?, ?)`).bind(i,t.images[n],n).run();return await F(e.env.DB,e.get(`user`),`create`,`projects`,Number(i)),e.json({id:i},201)}),H.put(`/projects/:id`,P(`projects`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];for(let e of K)e in n&&(r.push(`${e} = ?`),i.push(n[e]));if(r.length&&(r.push(`updated_at = datetime('now')`),i.push(t),await e.env.DB.prepare(`UPDATE projects SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run()),Array.isArray(n.images)){await e.env.DB.prepare(`DELETE FROM project_images WHERE project_id = ?`).bind(t).run();for(let r=0;r<n.images.length;r++)await e.env.DB.prepare(`INSERT INTO project_images (project_id, url, sort_order) VALUES (?, ?, ?)`).bind(t,n.images[r],r).run()}return await F(e.env.DB,e.get(`user`),`update`,`projects`,t),e.json({success:!0})}),H.delete(`/projects/:id`,P(`projects`),async e=>{let t=Number(e.req.param(`id`));return await e.env.DB.prepare(`DELETE FROM projects WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`projects`,t),e.json({success:!0})}),H.get(`/leads`,P(`leads`),async e=>{let t=e.req.query(`status`)||``,n=e.req.query(`type`)||``,r=e.req.query(`q`)||``,i=`SELECT * FROM leads WHERE 1=1`,a=[];t&&(i+=` AND status = ?`,a.push(t)),n&&(i+=` AND type = ?`,a.push(n)),r&&(i+=` AND (name LIKE ? OR phone LIKE ? OR company LIKE ? OR request_ref LIKE ?)`,a.push(`%${r}%`,`%${r}%`,`%${r}%`,`%${r}%`)),i+=` ORDER BY created_at DESC LIMIT 300`;let o=await e.env.DB.prepare(i).bind(...a).all();return e.json({leads:o.results})}),H.get(`/leads/:id`,P(`leads`),async e=>{let t=Number(e.req.param(`id`)),n=await e.env.DB.prepare(`SELECT * FROM leads WHERE id = ?`).bind(t).first();if(!n)return e.json({error:`غير موجود`},404);let r=await e.env.DB.prepare(`
    SELECT n.*, u.name AS user_name FROM lead_notes n LEFT JOIN admin_users u ON u.id = n.user_id
    WHERE n.lead_id = ? ORDER BY n.created_at DESC`).bind(t).all();return e.json({lead:n,notes:r.results})});var st=[`new`,`contacted`,`qualified`,`quotation_sent`,`negotiation`,`won`,`lost`,`archived`];H.put(`/leads/:id`,P(`leads`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];if(n.status){if(!st.includes(n.status))return e.json({error:`حالة غير صالحة`},400);r.push(`status = ?`),i.push(n.status)}return`assigned_to`in n&&(r.push(`assigned_to = ?`),i.push(n.assigned_to)),r.length?(r.push(`updated_at = datetime('now')`),i.push(t),await e.env.DB.prepare(`UPDATE leads SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run(),await F(e.env.DB,e.get(`user`),`update`,`leads`,t,{status:n.status}),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.post(`/leads/:id/notes`,P(`leads`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json();return n.note?(await e.env.DB.prepare(`INSERT INTO lead_notes (lead_id, user_id, note) VALUES (?, ?, ?)`).bind(t,e.get(`user`).id,String(n.note)).run(),e.json({success:!0},201)):e.json({error:`الملاحظة مطلوبة`},400)}),H.delete(`/leads/:id`,P(`leads`),async e=>{let t=Number(e.req.param(`id`));return await e.env.DB.prepare(`DELETE FROM leads WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`leads`,t),e.json({success:!0})}),H.get(`/homepage`,P(`homepage`),async e=>{let t=await e.env.DB.prepare(`SELECT * FROM home_sections ORDER BY sort_order`).all(),n=await e.env.DB.prepare(`SELECT * FROM why_us_points ORDER BY sort_order`).all();return e.json({sections:t.results,why_us:n.results})}),H.put(`/homepage/sections/:id`,P(`homepage`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[`title_ar`,`title_en`,`content_ar`,`content_en`,`image_url`,`cta_text_ar`,`cta_url`,`extra`,`sort_order`,`is_active`],i=[],a=[];for(let e of r)e in n&&(i.push(`${e} = ?`),a.push(n[e]));return i.length?(i.push(`updated_at = datetime('now')`),a.push(t),await e.env.DB.prepare(`UPDATE home_sections SET ${i.join(`, `)} WHERE id = ?`).bind(...a).run(),await F(e.env.DB,e.get(`user`),`update`,`home_sections`,t),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.post(`/homepage/why-us`,P(`homepage`),async e=>{let t=await e.req.json();if(!t.title_ar)return e.json({error:`العنوان مطلوب`},400);let n=await e.env.DB.prepare(`INSERT INTO why_us_points (icon, title_ar, title_en, description_ar, description_en, sort_order) VALUES (?, ?, ?, ?, ?, ?)`).bind(t.icon??null,t.title_ar,t.title_en??null,t.description_ar??null,t.description_en??null,t.sort_order??0).run();return e.json({id:n.meta.last_row_id},201)}),H.put(`/homepage/why-us/:id`,P(`homepage`),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[`icon`,`title_ar`,`title_en`,`description_ar`,`description_en`,`sort_order`,`is_active`],i=[],a=[];for(let e of r)e in n&&(i.push(`${e} = ?`),a.push(n[e]));return i.length?(a.push(t),await e.env.DB.prepare(`UPDATE why_us_points SET ${i.join(`, `)} WHERE id = ?`).bind(...a).run(),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.delete(`/homepage/why-us/:id`,P(`homepage`),async e=>(await e.env.DB.prepare(`DELETE FROM why_us_points WHERE id = ?`).bind(Number(e.req.param(`id`))).run(),e.json({success:!0}))),H.get(`/settings`,async e=>{let t=e.get(`user`);if(!tt(t.role,`homepage`)&&t.role!==`super_admin`)return e.json({error:`ليس لديك صلاحية`},403);let n=await e.env.DB.prepare(`SELECT key, value FROM settings`).all();return e.json({settings:n.results})}),H.put(`/settings`,async e=>{let t=e.get(`user`);if(t.role!==`super_admin`&&t.role!==`content_manager`)return e.json({error:`ليس لديك صلاحية`},403);let n=await e.req.json();if(!n||typeof n!=`object`)return e.json({error:`بيانات غير صالحة`},400);for(let[t,r]of Object.entries(n))await e.env.DB.prepare(`INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`).bind(t,String(r)).run();return await F(e.env.DB,t,`update`,`settings`,null,{keys:Object.keys(n)}),e.json({success:!0})});function q(){return async(e,t)=>{if(e.get(`user`).role!==`super_admin`)return e.json({error:`مخصص للمدير العام فقط`},403);await t()}}H.get(`/users`,q(),async e=>{let t=await e.env.DB.prepare(`SELECT id, email, name, role, is_active, last_login_at, created_at FROM admin_users ORDER BY id`).all();return e.json({users:t.results})}),H.post(`/users`,q(),async e=>{let t=await e.req.json();if(!t.email||!t.name||!t.password)return e.json({error:`البريد والاسم وكلمة المرور مطلوبة`},400);if(String(t.password).length<8)return e.json({error:`كلمة المرور 8 أحرف على الأقل`},400);let n=[`super_admin`,`content_manager`,`sales`,`editor`].includes(t.role)?t.role:`editor`,{hash:r,salt:i}=await j(String(t.password));try{let a=await e.env.DB.prepare(`INSERT INTO admin_users (email, name, password_hash, password_salt, role) VALUES (?, ?, ?, ?, ?)`).bind(String(t.email).toLowerCase(),t.name,r,i,n).run();return await F(e.env.DB,e.get(`user`),`create`,`admin_users`,Number(a.meta.last_row_id)),e.json({id:a.meta.last_row_id},201)}catch{return e.json({error:`البريد مستخدم بالفعل`},409)}}),H.put(`/users/:id`,q(),async e=>{let t=Number(e.req.param(`id`)),n=await e.req.json(),r=[],i=[];if(n.name&&(r.push(`name = ?`),i.push(n.name)),n.role&&(r.push(`role = ?`),i.push(n.role)),`is_active`in n){if(t===e.get(`user`).id&&!n.is_active)return e.json({error:`لا يمكنك تعطيل حسابك`},400);r.push(`is_active = ?`),i.push(+!!n.is_active)}if(n.password){if(String(n.password).length<8)return e.json({error:`كلمة المرور 8 أحرف على الأقل`},400);let{hash:t,salt:a}=await j(String(n.password));r.push(`password_hash = ?`,`password_salt = ?`),i.push(t,a)}return r.length?(r.push(`updated_at = datetime('now')`),i.push(t),await e.env.DB.prepare(`UPDATE admin_users SET ${r.join(`, `)} WHERE id = ?`).bind(...i).run(),await F(e.env.DB,e.get(`user`),`update`,`admin_users`,t),e.json({success:!0})):e.json({error:`لا توجد تعديلات`},400)}),H.delete(`/users/:id`,q(),async e=>{let t=Number(e.req.param(`id`));return t===e.get(`user`).id?e.json({error:`لا يمكنك حذف حسابك`},400):(await e.env.DB.prepare(`DELETE FROM admin_users WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`admin_users`,t),e.json({success:!0}))}),H.get(`/audit`,q(),async e=>{let t=await e.env.DB.prepare(`SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 200`).all();return e.json({audit:t.results})}),H.get(`/media`,P(`media`),async e=>{let t=`hero-main.bedroom-1.bedroom-2.bedroom-3.bedroom-4.bedroom-5.bedroom-6.bedroom-7.bedroom-8.living-1.living-2.living-3.living-4.living-5.living-6.living-7.living-8.dining-1.dining-2.dining-3.dining-4.dining-5.dining-6.dining-7.dining-8.office-1.office-2.office-3.office-4.office-5.storage-1.storage-2.storage-3.storage-6`.split(`.`).map(e=>({url:`/static/images/${e}.jpg`,filename:`${e}.jpg`,source:`catalog`})),n=await e.env.DB.prepare(`SELECT id, url, filename, mime_type, size, alt_text, created_at FROM media ORDER BY created_at DESC LIMIT 200`).all();return e.json({media:[...n.results.map(e=>({...e,source:`upload`})),...t]})}),H.post(`/media/upload`,P(`media`),async e=>{let t;try{t=await e.req.json()}catch{return e.json({error:`بيانات غير صالحة`},400)}let n=String(t.data||``),r=String(t.mime_type||`image/jpeg`),i=n.match(/^data:([\w/+.-]+);base64,(.+)$/);if(i&&(r=i[1],n=i[2]),!n||!/^[A-Za-z0-9+/=\s]+$/.test(n.slice(0,200)))return e.json({error:`صورة غير صالحة`},400);if(!/^image\//.test(r))return e.json({error:`يُسمح بملفات الصور فقط`},400);if(n.length>18e5)return e.json({error:`حجم الصورة كبير جداً (الحد الأقصى ~1.3MB بعد الضغط)`},413);let a=Math.floor(n.length*3/4),o=String(t.filename||`upload.jpg`).slice(0,120),s=await e.env.DB.prepare(`INSERT INTO media (url, filename, mime_type, size, alt_text, data) VALUES (?, ?, ?, ?, ?, ?)`).bind(``,o,r,a,t.alt_text??null,n).run(),c=Number(s.meta.last_row_id),l=`/api/media/file/${c}`;return await e.env.DB.prepare(`UPDATE media SET url = ? WHERE id = ?`).bind(l,c).run(),await F(e.env.DB,e.get(`user`),`create`,`media`,c,{filename:o,size:a}),e.json({id:c,url:l,filename:o},201)}),H.delete(`/media/:id`,P(`media`),async e=>{let t=Number(e.req.param(`id`));return await e.env.DB.prepare(`DELETE FROM media WHERE id = ?`).bind(t).run(),await F(e.env.DB,e.get(`user`),`delete`,`media`,t),e.json({success:!0})});var J=new O;J.get(`/products`,async e=>{let t=e.req.query(`q`)||``,n=e.req.query(`category`)||``,r=e.req.query(`featured`)||``,i=Math.min(Number(e.req.query(`limit`)||60),100),a=`SELECT p.id, p.slug, p.name_ar, p.name_en, p.short_desc_ar, p.main_image, p.is_featured, p.is_new, p.is_offer,
    c.slug AS category_slug, c.name_ar AS category_name
    FROM products p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'`,o=[];t&&(a+=` AND (p.name_ar LIKE ? OR p.name_en LIKE ? OR p.short_desc_ar LIKE ?)`,o.push(`%${t}%`,`%${t}%`,`%${t}%`)),n&&(a+=` AND c.slug = ?`,o.push(n)),r&&(a+=` AND p.is_featured = 1`),a+=` ORDER BY p.is_featured DESC, p.updated_at DESC LIMIT ?`,o.push(i);let s=await e.env.DB.prepare(a).bind(...o).all();return e.json({products:s.results})}),J.get(`/categories`,async e=>{let t=await e.env.DB.prepare(`
    SELECT c.id, c.slug, c.name_ar, c.name_en, c.description_ar, c.image_url, c.icon,
      (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.status='published') AS products_count
    FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order`).all();return e.json({categories:t.results})}),J.post(`/quote`,async e=>{let t;try{t=await e.req.json()}catch{return e.json({error:`بيانات غير صالحة`},400)}let n=String(t.name||``).trim(),r=String(t.phone||``).trim();if(!n||n.length<2)return e.json({error:`الاسم مطلوب`},400);if(!r||r.replace(/\D/g,``).length<8)return e.json({error:`رقم هاتف صحيح مطلوب`},400);let i=ot(),a=await e.env.DB.prepare(`
    INSERT INTO leads (request_ref, type, name, company, phone, whatsapp, email, project_type, city, units_count, products_requested, message, source)
    VALUES (?, 'quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(i,n,t.company??null,r,t.whatsapp??null,t.email??null,t.project_type??null,t.city??null,t.units_count??null,t.products_requested?JSON.stringify(t.products_requested):null,t.message??null,t.source||`website`).run();return await e.env.DB.prepare(`INSERT INTO notifications (type, title, body, entity, entity_id) VALUES (?, ?, ?, ?, ?)`).bind(`lead_quote`,`طلب عرض سعر جديد`,`${n} — ${r} (${i})`,`leads`,a.meta.last_row_id).run(),V(e.env.DB,`quote_submit`,Number(a.meta.last_row_id),`/quote`),e.json({success:!0,request_ref:i},201)}),J.post(`/contact`,async e=>{let t;try{t=await e.req.json()}catch{return e.json({error:`بيانات غير صالحة`},400)}let n=String(t.name||``).trim(),r=String(t.phone||``).trim(),i=String(t.message||``).trim();if(!n||!r||!i)return e.json({error:`الاسم والهاتف والرسالة مطلوبة`},400);let a=ot().replace(`QR-`,`CT-`),o=await e.env.DB.prepare(`
    INSERT INTO leads (request_ref, type, name, phone, email, message, source)
    VALUES (?, 'contact', ?, ?, ?, ?, 'contact_page')
  `).bind(a,n,r,t.email??null,i).run();return await e.env.DB.prepare(`INSERT INTO notifications (type, title, body, entity, entity_id) VALUES (?, ?, ?, ?, ?)`).bind(`lead_contact`,`رسالة تواصل جديدة`,`${n} — ${r}`,`leads`,o.meta.last_row_id).run(),V(e.env.DB,`contact_submit`,Number(o.meta.last_row_id),`/contact`),e.json({success:!0,request_ref:a},201)}),J.get(`/media/file/:id`,async e=>{let t=Number(e.req.param(`id`));if(!t)return e.notFound();let n=await e.env.DB.prepare(`SELECT mime_type, data FROM media WHERE id = ?`).bind(t).first();if(!n||!n.data)return e.notFound();let r=Uint8Array.from(atob(n.data),e=>e.charCodeAt(0));return e.body(r,200,{"Content-Type":n.mime_type||`image/jpeg`,"Cache-Control":`public, max-age=31536000, immutable`})}),J.post(`/track`,async e=>{try{let t=await e.req.json();[`page_view`,`product_view`,`whatsapp_click`,`phone_click`].includes(t.event)&&V(e.env.DB,t.event,t.entity_id??null,String(t.path||``).slice(0,200))}catch{}return e.json({ok:!0})});function Y(e,t){let n=e.settings,r=n.company_name_ar||`سرايا الأندلس للأثاث الفندقي والضيافة`,i=e.title?`${e.title} — ${r}`:n.seo_default_title||r,a=e.description||n.seo_default_description||``,o=z(n.whatsapp||`01227932213`,n.whatsapp_default_message||``),s=n.logo_url||``,c=n.favicon_url||`/favicon.svg`,l=n.company_tagline_ar||`للأثاث الفندقي والضيافة`,u=[[`facebook_url`,`fa-facebook-f`,`فيسبوك`],[`instagram_url`,`fa-instagram`,`إنستجرام`],[`tiktok_url`,`fa-tiktok`,`تيك توك`],[`youtube_url`,`fa-youtube`,`يوتيوب`]].filter(([e])=>(n[e]||``).trim()),d=u.length?`<div class="flex gap-3 mt-4">${u.map(([e,t,r])=>`<a href="${R(n[e])}" target="_blank" rel="noopener" aria-label="${r}" class="w-9 h-9 rounded-full bg-white/10 hover:bg-gold text-cream flex items-center justify-center transition-colors"><i class="fab ${t}"></i></a>`).join(``)}</div>`:``,f=[[`/`,`الرئيسية`],[`/products`,`المنتجات`],[`/services`,`الخدمات`],[`/projects`,`المشاريع`],[`/about`,`من نحن`],[`/contact`,`تواصل معنا`]],p=f.map(([t,n])=>`<a href="${t}" class="nav-link ${e.path===t||t!==`/`&&e.path.startsWith(t)?`nav-active`:``}">${n}</a>`).join(``);return`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="${R(c)}">
<title>${R(i)}</title>
<meta name="description" content="${R(a)}">
<meta property="og:title" content="${R(i)}">
<meta property="og:description" content="${R(a)}">
<meta property="og:type" content="website">
${e.ogImage?`<meta property="og:image" content="${R(e.ogImage)}">`:``}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script>
tailwind.config = { theme: { extend: {
  colors: {
    charcoal: '#23201c', cream: '#faf7f2', sand: '#efe9df', gold: '#b08d57', golddark: '#8f7040', brown: '#4a3728'
  },
  fontFamily: { sans: ['Cairo','sans-serif'], serif: ['Amiri','serif'] }
}}}
<\/script>
<style>
  body { font-family: 'Cairo', sans-serif; background:#faf7f2; color:#23201c; }
  .nav-link { color:#4a3728; padding:.5rem .75rem; font-weight:600; font-size:.95rem; transition:color .2s; }
  .nav-link:hover, .nav-active { color:#b08d57; }
  .btn-gold { background:#b08d57; color:#fff; transition:background .2s; }
  .btn-gold:hover { background:#8f7040; }
  .btn-outline { border:1px solid #b08d57; color:#b08d57; transition:all .2s; }
  .btn-outline:hover { background:#b08d57; color:#fff; }
  .section-title { position:relative; }
  .section-title:after { content:''; display:block; width:64px; height:3px; background:#b08d57; margin-top:.75rem; }
  .card-img { transition: transform .5s ease; }
  .group:hover .card-img { transform: scale(1.05); }
  .fade-up { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
  .fade-up.visible { opacity:1; transform:none; }
</style>
</head>
<body>
<header id="site-header" class="bg-cream/95 backdrop-blur sticky top-0 z-40 border-b border-sand">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
    <a href="/" id="brand-logo" class="flex items-center gap-3">
      ${s?`<img src="${R(s)}" alt="${R(r)}" class="h-12 w-auto max-w-[150px] object-contain">`:`<span class="w-11 h-11 rounded-full bg-charcoal text-gold flex items-center justify-center text-xl"><i class="fas fa-couch"></i></span>`}
      <span class="leading-tight">
        <span class="block font-black text-lg text-charcoal">${R(n.company_name_ar?n.company_name_ar.replace(/\s*للأثاث.*$/,``):`سرايا الأندلس`)}</span>
        <span class="block text-xs text-brown/70 tracking-wide">${R(l)}</span>
      </span>
    </a>
    <nav id="main-nav" class="hidden lg:flex items-center">${p}</nav>
    <div class="flex items-center gap-3">
      <a href="/quote" class="btn-gold hidden sm:inline-block px-5 py-2.5 rounded-full text-sm font-bold">اطلب عرض سعر</a>
      <a href="${o}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" class="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      <button id="menu-btn" class="lg:hidden w-10 h-10 text-charcoal text-xl" aria-label="القائمة"><i class="fas fa-bars"></i></button>
    </div>
  </div>
  <nav id="mobile-nav" class="hidden lg:hidden border-t border-sand bg-cream px-4 py-3 flex flex-col">${p}
    <a href="/quote" class="btn-gold mt-2 px-5 py-2.5 rounded-full text-sm font-bold text-center">اطلب عرض سعر</a>
  </nav>
</header>

<main id="page-content">${t}</main>

<footer id="site-footer" class="bg-charcoal text-cream/80 mt-20">
  <div class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-10">
    <section>
      ${s?`<img src="${R(s)}" alt="${R(r)}" class="h-14 w-auto max-w-[170px] object-contain mb-4">`:``}
      <h3 class="text-gold font-bold text-lg mb-4">${R(r)}</h3>
      <p class="text-sm leading-7">${R(n.footer_about_ar||``)}</p>
      ${d}
    </section>
    <section>
      <h3 class="text-gold font-bold text-lg mb-4">روابط سريعة</h3>
      <ul class="space-y-2 text-sm">
        ${f.map(([e,t])=>`<li><a href="${e}" class="hover:text-gold transition-colors">${t}</a></li>`).join(``)}
        <li><a href="/quote" class="hover:text-gold transition-colors">طلب عرض سعر</a></li>
      </ul>
    </section>
    <section>
      <h3 class="text-gold font-bold text-lg mb-4">تواصل معنا</h3>
      <ul class="space-y-3 text-sm">
        <li><i class="fas fa-phone ml-2 text-gold"></i><a href="tel:${R((n.phone||``).replace(/\s/g,``))}" onclick="trackEvent('phone_click')" dir="ltr">${R(n.phone||``)}</a></li>
        <li><i class="fab fa-whatsapp ml-2 text-gold"></i><a href="${o}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" dir="ltr">${R(n.whatsapp||``)}</a></li>
        ${(n.contact_email||``).trim()?`<li><i class="fas fa-envelope ml-2 text-gold"></i><a href="mailto:${R(n.contact_email)}" dir="ltr">${R(n.contact_email)}</a></li>`:``}
        <li><i class="fas fa-location-dot ml-2 text-gold"></i>${R(n.address_ar||``)}</li>
        ${(n.working_hours_ar||``).trim()?`<li><i class="fas fa-clock ml-2 text-gold"></i>${R(n.working_hours_ar)}</li>`:``}
      </ul>
    </section>
  </div>
  <div class="border-t border-white/10 py-4 text-center text-xs text-cream/50">© ${new Date().getFullYear()} ${R(r)} — جميع الحقوق محفوظة</div>
</footer>

<a href="${o}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" id="wa-float" class="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-lg hover:scale-110 transition-transform" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>

<script>
document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('mobile-nav').classList.toggle('hidden'));
function trackEvent(ev, id) { try { navigator.sendBeacon('/api/track', JSON.stringify({ event: ev, entity_id: id||null, path: location.pathname })); } catch(e){} }
trackEvent('page_view');
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold:.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
<\/script>
</body>
</html>`}var X=new O,Z=e=>`
<article class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow fade-up">
  <a href="/products/${R(e.slug)}" class="block">
    <figure class="relative h-64 overflow-hidden">
      <img src="${R(e.main_image||`/static/images/hero-main.jpg`)}" alt="${R(e.name_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute top-3 right-3 flex gap-2">
        ${e.is_new?`<span class="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">جديد</span>`:``}
        ${e.is_offer?`<span class="bg-brown text-white text-xs font-bold px-3 py-1 rounded-full">عرض</span>`:``}
      </div>
    </figure>
    <div class="p-5">
      ${e.category_name?`<span class="text-xs text-gold font-semibold">${R(e.category_name)}</span>`:``}
      <h3 class="font-bold text-charcoal mt-1 mb-2">${R(e.name_ar)}</h3>
      <p class="text-sm text-brown/70 leading-6 line-clamp-2">${R(e.short_desc_ar||``)}</p>
    </div>
  </a>
</article>`;X.get(`/`,async e=>{let t=e.env.DB,n=await B(t),[r,i,a,o,s,c]=await Promise.all([t.prepare(`SELECT * FROM home_sections WHERE is_active = 1 ORDER BY sort_order`).all(),t.prepare(`SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id=c.id AND p.status='published') n FROM categories c WHERE c.is_active=1 ORDER BY c.sort_order LIMIT 6`).all(),t.prepare(`SELECT p.*, c.name_ar category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.status='published' AND p.is_featured=1 ORDER BY p.updated_at DESC LIMIT 6`).all(),t.prepare(`SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order LIMIT 6`).all(),t.prepare(`SELECT * FROM projects WHERE status='published' ORDER BY is_featured DESC, created_at DESC LIMIT 3`).all(),t.prepare(`SELECT * FROM why_us_points WHERE is_active = 1 ORDER BY sort_order`).all()]),l={};for(let e of r.results)l[e.section_key]=e;let u=l.hero||{},d=l.about||{},f=l.cta||{},p=`
<section id="hero-section" class="relative min-h-[82vh] flex items-center">
  <img src="${R(u.image_url||`/static/images/hero-main.jpg`)}" alt="" class="absolute inset-0 w-full h-full object-cover">
  <div class="absolute inset-0 bg-gradient-to-l from-charcoal/85 via-charcoal/60 to-charcoal/30"></div>
  <div class="relative max-w-7xl mx-auto px-4 py-24 w-full">
    <div class="max-w-2xl fade-up visible">
      <span class="text-gold text-sm font-bold tracking-widest">أثاث فندقي · ضيافة · مشروعات</span>
      <h1 class="text-4xl md:text-6xl font-black text-white leading-tight mt-4 mb-6">${R(u.title_ar||`أثاث فندقي يليق بمشروعك`)}</h1>
      <p class="text-cream/85 text-lg leading-8 mb-8">${R(u.content_ar||``)}</p>
      <div class="flex flex-wrap gap-4">
        <a href="${R(u.cta_url||`/products`)}" class="btn-gold px-8 py-3.5 rounded-full font-bold">${R(u.cta_text_ar||`استكشف منتجاتنا`)}</a>
        <a href="/quote" class="border border-white/40 text-white px-8 py-3.5 rounded-full font-bold hover:bg-white hover:text-charcoal transition-colors">اطلب عرض سعر</a>
      </div>
    </div>
  </div>
</section>

<section id="about-preview" class="max-w-7xl mx-auto px-4 py-20">
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div class="fade-up">
      <h2 class="section-title text-3xl font-black text-charcoal mb-6">${R(d.title_ar||`من نحن`)}</h2>
      <p class="text-brown/80 leading-8 text-lg">${R(d.content_ar||``)}</p>
      <a href="/about" class="btn-outline inline-block mt-6 px-7 py-3 rounded-full font-bold">${R(d.cta_text_ar||`اعرف المزيد`)}</a>
    </div>
    <figure class="fade-up grid grid-cols-2 gap-4">
      <img src="/static/images/living-3.jpg" alt="أثاث لوبي" loading="lazy" class="rounded-2xl h-56 w-full object-cover">
      <img src="/static/images/bedroom-1.jpg" alt="غرفة فندقية" loading="lazy" class="rounded-2xl h-56 w-full object-cover mt-8">
    </figure>
  </div>
</section>

<section id="categories-section" class="bg-sand/50 py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-charcoal mb-10">${R(l.categories?.title_ar||`حلولنا وفئات منتجاتنا`)}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${i.results.map(e=>`
      <a href="/products?category=${R(e.slug)}" class="group relative rounded-2xl overflow-hidden h-56 fade-up">
        <img src="${R(e.image_url||`/static/images/hero-main.jpg`)}" alt="${R(e.name_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent"></div>
        <div class="absolute bottom-0 right-0 p-5">
          <i class="fas ${R(e.icon||`fa-couch`)} text-gold text-xl mb-2"></i>
          <h3 class="text-white font-bold text-lg">${R(e.name_ar)}</h3>
          <span class="text-cream/70 text-xs">${e.n} منتج</span>
        </div>
      </a>`).join(``)}
    </div>
  </div>
</section>

${a.results.length?`
<section id="featured-section" class="max-w-7xl mx-auto px-4 py-20">
  <div class="flex items-end justify-between mb-10">
    <h2 class="section-title text-3xl font-black text-charcoal">${R(l.featured?.title_ar||`منتجات مميزة`)}</h2>
    <a href="/products" class="text-gold font-bold text-sm hover:underline">عرض الكل <i class="fas fa-arrow-left mr-1"></i></a>
  </div>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${a.results.map(Z).join(``)}</div>
</section>`:``}

<section id="services-section" class="bg-charcoal py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-white mb-10">${R(l.services?.title_ar||`خدماتنا`)}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${o.results.map(e=>`
      <a href="/services#svc-${e.id}" class="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-gold/60 transition-colors fade-up block">
        <i class="fas ${R(e.icon||`fa-star`)} text-gold text-2xl mb-4"></i>
        <h3 class="text-white font-bold text-lg mb-2">${R(e.title_ar)}</h3>
        <p class="text-cream/60 text-sm leading-6">${R(e.short_desc_ar||``)}</p>
      </a>`).join(``)}
    </div>
  </div>
</section>

${s.results.length?`
<section id="projects-section" class="max-w-7xl mx-auto px-4 py-20">
  <div class="flex items-end justify-between mb-10">
    <h2 class="section-title text-3xl font-black text-charcoal">${R(l.projects?.title_ar||`مشاريعنا`)}</h2>
    <a href="/projects" class="text-gold font-bold text-sm hover:underline">عرض الكل <i class="fas fa-arrow-left mr-1"></i></a>
  </div>
  <div class="grid md:grid-cols-3 gap-6">
    ${s.results.map(e=>`
    <a href="/projects/${R(e.slug)}" class="group relative rounded-2xl overflow-hidden h-72 fade-up">
      <img src="${R(e.cover_image||`/static/images/hero-main.jpg`)}" alt="${R(e.title_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent"></div>
      <div class="absolute bottom-0 right-0 p-6">
        <h3 class="text-white font-bold text-lg">${R(e.title_ar)}</h3>
      </div>
    </a>`).join(``)}
  </div>
</section>`:``}

<section id="why-us-section" class="bg-sand/50 py-20">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="section-title text-3xl font-black text-charcoal mb-10">${R(l.why_us?.title_ar||`لماذا سرايا الأندلس؟`)}</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      ${c.results.map(e=>`
      <article class="bg-white rounded-2xl p-7 text-center fade-up">
        <span class="w-14 h-14 mx-auto rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl mb-4"><i class="fas ${R(e.icon||`fa-check`)}"></i></span>
        <h3 class="font-bold text-charcoal mb-2">${R(e.title_ar)}</h3>
        <p class="text-sm text-brown/70 leading-6">${R(e.description_ar||``)}</p>
      </article>`).join(``)}
    </div>
  </div>
</section>

<section id="cta-section" class="max-w-5xl mx-auto px-4 py-20 text-center">
  <h2 class="text-3xl md:text-4xl font-black text-charcoal mb-4 fade-up">${R(f.title_ar||`ابدأ مشروعك معنا`)}</h2>
  <p class="text-brown/70 text-lg mb-8 fade-up">${R(f.content_ar||``)}</p>
  <a href="${R(f.cta_url||`/quote`)}" class="btn-gold px-10 py-4 rounded-full font-bold text-lg fade-up inline-block">${R(f.cta_text_ar||`اطلب عرض سعر`)}</a>
</section>`;return e.html(Y({settings:n,path:`/`},p))}),X.get(`/products`,async e=>{let t=e.env.DB,n=await B(t),r=e.req.query(`category`)||``,i=e.req.query(`q`)||``,a=await t.prepare(`SELECT slug, name_ar FROM categories WHERE is_active=1 ORDER BY sort_order`).all(),o=`SELECT p.*, c.name_ar category_name, c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.status='published'`,s=[];r&&(o+=` AND c.slug = ?`,s.push(r)),i&&(o+=` AND (p.name_ar LIKE ? OR p.short_desc_ar LIKE ?)`,s.push(`%${i}%`,`%${i}%`)),o+=` ORDER BY p.is_featured DESC, p.updated_at DESC LIMIT 60`;let c=await t.prepare(o).bind(...s).all(),l=a.results.find(e=>e.slug===r),u=`
<section id="products-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">${l?R(l.name_ar):`منتجاتنا`}</h1>
    <p class="text-cream/60">حلول أثاث فندقي وضيافة بجودة تليق بمشروعك</p>
  </div>
</section>
<section id="products-catalog" class="max-w-7xl mx-auto px-4 py-12">
  <div class="flex flex-wrap items-center gap-3 mb-10">
    <a href="/products" class="${r?`btn-outline`:`btn-gold`} px-5 py-2 rounded-full text-sm font-bold">الكل</a>
    ${a.results.map(e=>`<a href="/products?category=${R(e.slug)}" class="${r===e.slug?`btn-gold`:`btn-outline`} px-5 py-2 rounded-full text-sm font-bold">${R(e.name_ar)}</a>`).join(``)}
    <form action="/products" method="get" class="mr-auto flex">
      ${r?`<input type="hidden" name="category" value="${R(r)}">`:``}
      <input id="search-input" name="q" value="${R(i)}" placeholder="ابحث عن منتج..." class="border border-sand rounded-r-full px-4 py-2 text-sm bg-white focus:outline-none focus:border-gold">
      <button class="btn-gold rounded-l-full px-4" aria-label="بحث"><i class="fas fa-search"></i></button>
    </form>
  </div>
  ${c.results.length?`<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${c.results.map(Z).join(``)}</div>`:`<p class="text-center text-brown/60 py-20 text-lg">لا توجد منتجات مطابقة حالياً.</p>`}
</section>`;return e.html(Y({settings:n,path:`/products`,title:l?l.name_ar:`المنتجات`},u))}),X.get(`/products/:slug`,async e=>{let t=e.env.DB,n=await B(t),r=e.req.param(`slug`),i=await t.prepare(`SELECT p.*, c.name_ar category_name, c.slug category_slug FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.slug = ? AND p.status='published'`).bind(r).first();if(!i)return e.notFound();let a=await t.prepare(`SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order`).bind(i.id).all(),o=await t.prepare(`SELECT p.*, c.name_ar category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.category_id = ? AND p.id != ? AND p.status='published' LIMIT 3`).bind(i.category_id,i.id).all();t.prepare(`UPDATE products SET views = views + 1 WHERE id = ?`).bind(i.id).run().catch(()=>{}),V(t,`product_view`,i.id,`/products/`+r);let s=a.results.map(e=>e.url);!s.length&&i.main_image&&s.push(i.main_image);let c=(n.whatsapp_product_message||`مرحباً، أرغب في الاستفسار عن منتج: [PRODUCT]`).replace(`[PRODUCT]`,i.name_ar),l=z(n.whatsapp||`01227932213`,c),u=at(i.features_ar),d=[];try{d=i.specifications?JSON.parse(i.specifications):[]}catch{}let f=`
<nav id="breadcrumb" class="max-w-7xl mx-auto px-4 pt-6 text-sm text-brown/60">
  <a href="/" class="hover:text-gold">الرئيسية</a> / <a href="/products" class="hover:text-gold">المنتجات</a>
  ${i.category_name?` / <a href="/products?category=${R(i.category_slug)}" class="hover:text-gold">${R(i.category_name)}</a>`:``}
  / <span class="text-charcoal">${R(i.name_ar)}</span>
</nav>
<section id="product-details" class="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-12">
  <div>
    <figure class="rounded-2xl overflow-hidden h-[420px] bg-sand">
      <img id="main-product-image" src="${R(s[0]||`/static/images/hero-main.jpg`)}" alt="${R(i.name_ar)}" class="w-full h-full object-cover">
    </figure>
    ${s.length>1?`
    <div id="product-gallery" class="grid grid-cols-4 gap-3 mt-4">
      ${s.map((e,t)=>`<button onclick="document.getElementById('main-product-image').src='${R(e)}'" class="rounded-xl overflow-hidden h-20 border-2 ${t===0?`border-gold`:`border-transparent`} hover:border-gold transition-colors"><img src="${R(e)}" alt="" loading="lazy" class="w-full h-full object-cover"></button>`).join(``)}
    </div>`:``}
  </div>
  <div>
    ${i.category_name?`<span class="text-gold text-sm font-bold">${R(i.category_name)}</span>`:``}
    <h1 class="text-3xl md:text-4xl font-black text-charcoal mt-2 mb-4">${R(i.name_ar)}</h1>
    <div class="flex gap-2 mb-5">
      ${i.is_new?`<span class="bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">جديد</span>`:``}
      ${i.is_featured?`<span class="bg-charcoal text-white text-xs font-bold px-3 py-1 rounded-full">مميز</span>`:``}
      ${i.is_offer?`<span class="bg-brown text-white text-xs font-bold px-3 py-1 rounded-full">عرض خاص</span>`:``}
    </div>
    <p class="text-brown/80 leading-8 mb-6">${R(i.description_ar||i.short_desc_ar||``)}</p>
    ${u.length?`<ul class="space-y-2 mb-6">${u.map(e=>`<li class="flex items-center gap-2 text-sm"><i class="fas fa-check text-gold"></i>${R(e)}</li>`).join(``)}</ul>`:``}
    <dl class="bg-white rounded-2xl p-6 space-y-3 text-sm mb-8">
      ${i.materials_ar?`<div class="flex justify-between"><dt class="text-brown/60">الخامات</dt><dd class="font-semibold">${R(i.materials_ar)}</dd></div>`:``}
      ${i.dimensions?`<div class="flex justify-between"><dt class="text-brown/60">الأبعاد</dt><dd class="font-semibold">${R(i.dimensions)}</dd></div>`:``}
      ${i.sku?`<div class="flex justify-between"><dt class="text-brown/60">SKU</dt><dd class="font-semibold" dir="ltr">${R(i.sku)}</dd></div>`:``}
      ${d.map(e=>`<div class="flex justify-between"><dt class="text-brown/60">${R(e.label_ar||``)}</dt><dd class="font-semibold">${R(e.value_ar||``)}</dd></div>`).join(``)}
      ${i.show_price&&i.price?`<div class="flex justify-between border-t border-sand pt-3"><dt class="text-brown/60">السعر</dt><dd class="font-black text-gold text-lg">${R(String(i.price))} ج.م</dd></div>`:``}
    </dl>
    <div class="flex flex-wrap gap-4">
      <a href="/quote?product=${R(i.slug)}&name=${encodeURIComponent(i.name_ar)}" class="btn-gold px-8 py-3.5 rounded-full font-bold">اطلب عرض سعر لهذا المنتج</a>
      <a href="${l}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click', ${i.id})" class="bg-[#25D366] text-white px-8 py-3.5 rounded-full font-bold"><i class="fab fa-whatsapp ml-2"></i>استفسر واتساب</a>
    </div>
  </div>
</section>
${o.results.length?`
<section id="related-products" class="max-w-7xl mx-auto px-4 py-14">
  <h2 class="section-title text-2xl font-black text-charcoal mb-8">منتجات ذات صلة</h2>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${o.results.map(Z).join(``)}</div>
</section>`:``}`;return e.html(Y({settings:n,path:`/products`,title:i.seo_title||i.name_ar,description:i.seo_description||i.short_desc_ar||``,ogImage:i.og_image||i.main_image},f))}),X.get(`/services`,async e=>{let t=e.env.DB,n=await B(t),r=`
<section id="services-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">خدماتنا</h1>
    <p class="text-cream/60">حلول متكاملة لتجهيز المشروعات الفندقية والضيافة</p>
  </div>
</section>
<section id="services-list" class="max-w-7xl mx-auto px-4 py-14 space-y-12">
  ${(await t.prepare(`SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order`).all()).results.map((e,t)=>`
  <article id="svc-${e.id}" class="grid md:grid-cols-2 gap-10 items-center fade-up">
    <figure class="rounded-2xl overflow-hidden h-72 ${t%2?`md:order-2`:``}">
      <img src="${R(e.image_url||`/static/images/hero-main.jpg`)}" alt="${R(e.title_ar)}" loading="lazy" class="w-full h-full object-cover">
    </figure>
    <div>
      <i class="fas ${R(e.icon||`fa-star`)} text-gold text-3xl mb-4"></i>
      <h2 class="text-2xl font-black text-charcoal mb-4">${R(e.title_ar)}</h2>
      <p class="text-brown/80 leading-8 mb-5">${R(e.description_ar||e.short_desc_ar||``)}</p>
      ${at(e.features_ar).map(e=>`<p class="text-sm mb-1"><i class="fas fa-check text-gold ml-2"></i>${R(e)}</p>`).join(``)}
      <a href="/quote" class="btn-outline inline-block mt-5 px-7 py-2.5 rounded-full font-bold text-sm">اطلب هذه الخدمة</a>
    </div>
  </article>`).join(``)}
</section>`;return e.html(Y({settings:n,path:`/services`,title:`الخدمات`},r))}),X.get(`/projects`,async e=>{let t=e.env.DB,n=await B(t),r=await t.prepare(`SELECT * FROM projects WHERE status='published' ORDER BY is_featured DESC, created_at DESC`).all(),i=`
<section id="projects-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">مشاريعنا</h1>
    <p class="text-cream/60">نماذج من أعمال التجهيز والتوريد للمشروعات الفندقية</p>
  </div>
</section>
<section id="projects-grid" class="max-w-7xl mx-auto px-4 py-14">
  ${r.results.length?`
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${r.results.map(e=>`
    <a href="/projects/${R(e.slug)}" class="group relative rounded-2xl overflow-hidden h-80 fade-up">
      <img src="${R(e.cover_image||`/static/images/hero-main.jpg`)}" alt="${R(e.title_ar)}" loading="lazy" class="card-img w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent"></div>
      <div class="absolute bottom-0 right-0 p-6">
        ${e.project_type?`<span class="text-gold text-xs font-bold">${R(e.project_type)}</span>`:``}
        <h2 class="text-white font-bold text-xl mt-1">${R(e.title_ar)}</h2>
        ${e.location?`<p class="text-cream/60 text-sm mt-1"><i class="fas fa-location-dot ml-1"></i>${R(e.location)}</p>`:``}
      </div>
    </a>`).join(``)}
  </div>`:`<p class="text-center text-brown/60 py-20">سيتم إضافة المشاريع قريباً.</p>`}
</section>`;return e.html(Y({settings:n,path:`/projects`,title:`المشاريع`},i))}),X.get(`/projects/:slug`,async e=>{let t=e.env.DB,n=await B(t),r=await t.prepare(`SELECT * FROM projects WHERE slug = ? AND status='published'`).bind(e.req.param(`slug`)).first();if(!r)return e.notFound();let i=await t.prepare(`SELECT url, caption_ar FROM project_images WHERE project_id = ? ORDER BY sort_order`).bind(r.id).all(),a=`
<section id="project-header" class="relative h-[50vh] min-h-[360px]">
  <img src="${R(r.cover_image||`/static/images/hero-main.jpg`)}" alt="${R(r.title_ar)}" class="absolute inset-0 w-full h-full object-cover">
  <div class="absolute inset-0 bg-charcoal/60"></div>
  <div class="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-10">
    <div>
      ${r.project_type?`<span class="text-gold text-sm font-bold">${R(r.project_type)}</span>`:``}
      <h1 class="text-4xl font-black text-white mt-2">${R(r.title_ar)}</h1>
    </div>
  </div>
</section>
<section id="project-body" class="max-w-5xl mx-auto px-4 py-14">
  <p class="text-brown/80 leading-9 text-lg mb-10">${R(r.description_ar||``)}</p>
  <div class="grid sm:grid-cols-2 gap-5">
    ${i.results.map(e=>`<figure class="rounded-2xl overflow-hidden fade-up"><img src="${R(e.url)}" alt="${R(e.caption_ar||r.title_ar)}" loading="lazy" class="w-full h-72 object-cover"></figure>`).join(``)}
  </div>
  <div class="text-center mt-12"><a href="/quote" class="btn-gold px-10 py-4 rounded-full font-bold inline-block">ابدأ مشروعك معنا</a></div>
</section>`;return e.html(Y({settings:n,path:`/projects`,title:r.title_ar,ogImage:r.cover_image},a))}),X.get(`/about`,async e=>{let t=e.env.DB,n=await B(t),r=await t.prepare(`SELECT * FROM why_us_points WHERE is_active = 1 ORDER BY sort_order`).all(),i=`
<section id="about-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">من نحن</h1>
  </div>
</section>
<section id="about-body" class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-12 items-center">
  <div class="fade-up">
    <h2 class="section-title text-2xl font-black text-charcoal mb-6">${R(n.company_name_ar||``)}</h2>
    <p class="text-brown/80 leading-9 text-lg">${R(n.footer_about_ar||``)}</p>
    <p class="text-brown/80 leading-9 text-lg mt-4">نتعامل مع أصحاب الفنادق والشقق الفندقية والمنتجعات والمطاعم والكافيهات، ونوفر حلول تصميم وتوريد وتجهيز حسب احتياج كل مشروع — من قطعة أثاث واحدة إلى تجهيز متكامل.</p>
    <a href="/quote" class="btn-gold inline-block mt-8 px-8 py-3.5 rounded-full font-bold">اطلب عرض سعر</a>
  </div>
  <figure class="grid grid-cols-2 gap-4 fade-up">
    <img src="/static/images/bedroom-4.jpg" alt="" loading="lazy" class="rounded-2xl h-60 w-full object-cover">
    <img src="/static/images/dining-1.jpg" alt="" loading="lazy" class="rounded-2xl h-60 w-full object-cover mt-8">
  </figure>
</section>
<section id="about-values" class="bg-sand/50 py-16">
  <div class="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
    ${r.results.map(e=>`
    <article class="bg-white rounded-2xl p-7 text-center fade-up">
      <span class="w-14 h-14 mx-auto rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl mb-4"><i class="fas ${R(e.icon||`fa-check`)}"></i></span>
      <h3 class="font-bold text-charcoal mb-2">${R(e.title_ar)}</h3>
      <p class="text-sm text-brown/70 leading-6">${R(e.description_ar||``)}</p>
    </article>`).join(``)}
  </div>
</section>`;return e.html(Y({settings:n,path:`/about`,title:`من نحن`},i))}),X.get(`/quote`,async e=>{let t=e.env.DB,n=await B(t),r=e.req.query(`name`)||``,i=`
<section id="quote-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-4xl font-black text-white mb-3">طلب عرض سعر</h1>
    <p class="text-cream/60">أخبرنا عن مشروعك وسنتواصل معك بعرض سعر مخصص</p>
  </div>
</section>
<section id="quote-form-section" class="max-w-3xl mx-auto px-4 py-14">
  <form id="quote-form" class="bg-white rounded-2xl p-8 shadow-sm space-y-5">
    <div class="grid sm:grid-cols-2 gap-5">
      <div><label class="block text-sm font-bold mb-2">الاسم *</label><input name="name" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">الشركة / المنشأة</label><input name="company" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">الهاتف *</label><input name="phone" required dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">WhatsApp</label><input name="whatsapp" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">البريد الإلكتروني (اختياري)</label><input name="email" type="email" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">نوع المشروع</label>
        <select name="project_type" class="w-full border border-sand rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-gold">
          <option value="">اختر...</option><option value="hotel">فندق</option><option value="hotel_apartments">شقق فندقية</option>
          <option value="resort">منتجع</option><option value="restaurant">مطعم</option><option value="cafe">كافيه</option>
          <option value="commercial">منشأة تجارية</option><option value="other">أخرى</option>
        </select></div>
      <div><label class="block text-sm font-bold mb-2">المدينة</label><input name="city" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
      <div><label class="block text-sm font-bold mb-2">عدد الوحدات / الغرف (اختياري)</label><input name="units_count" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    </div>
    <div><label class="block text-sm font-bold mb-2">المنتجات المطلوبة</label>
      <select id="products-select" name="products" multiple size="5" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold">
        ${(await t.prepare(`SELECT id, name_ar FROM products WHERE status='published' ORDER BY name_ar`).all()).results.map(e=>`<option value="${e.id}" data-name="${R(e.name_ar)}" ${r&&e.name_ar===r?`selected`:``}>${R(e.name_ar)}</option>`).join(``)}
      </select>
      <p class="text-xs text-brown/50 mt-1">يمكنك اختيار أكثر من منتج (Ctrl / لمس مطول)</p></div>
    <div><label class="block text-sm font-bold mb-2">تفاصيل الطلب</label><textarea name="message" rows="4" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></textarea></div>
    <button id="quote-submit-btn" type="submit" class="btn-gold w-full py-4 rounded-xl font-bold text-lg">إرسال طلب عرض السعر</button>
    <div id="quote-result" class="hidden text-center p-5 rounded-xl"></div>
  </form>
</section>
<script>
document.getElementById('quote-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, btn = document.getElementById('quote-submit-btn'), out = document.getElementById('quote-result');
  const sel = [...document.getElementById('products-select').selectedOptions].map(o => ({ id: +o.value, name: o.dataset.name }));
  const data = { name: f.name.value, company: f.company.value, phone: f.phone.value, whatsapp: f.whatsapp.value,
    email: f.email.value, project_type: f.project_type.value, city: f.city.value, units_count: f.units_count.value,
    products_requested: sel, message: f.message.value };
  btn.disabled = true; btn.textContent = 'جارٍ الإرسال...';
  try {
    const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const j = await r.json();
    out.classList.remove('hidden');
    if (r.ok) { out.className = 'text-center p-5 rounded-xl bg-green-50 text-green-800'; out.innerHTML = '<i class="fas fa-check-circle text-2xl mb-2"></i><p class="font-bold">تم استلام طلبك بنجاح!</p><p class="text-sm mt-1">رقم الطلب: <b dir="ltr">' + j.request_ref + '</b> — سنتواصل معك قريباً.</p>'; f.reset(); }
    else { out.className = 'text-center p-5 rounded-xl bg-red-50 text-red-700'; out.textContent = j.error || 'حدث خطأ، حاول مرة أخرى'; }
  } catch { out.classList.remove('hidden'); out.className = 'text-center p-5 rounded-xl bg-red-50 text-red-700'; out.textContent = 'تعذر الاتصال بالخادم'; }
  btn.disabled = false; btn.textContent = 'إرسال طلب عرض السعر';
});
<\/script>`;return e.html(Y({settings:n,path:`/quote`,title:`طلب عرض سعر`},i))}),X.get(`/contact`,async e=>{let t=e.env.DB,n=await B(t),r=z(n.whatsapp||`01227932213`,n.whatsapp_default_message||``),i=`
<section id="contact-header" class="bg-charcoal py-16">
  <div class="max-w-7xl mx-auto px-4"><h1 class="text-4xl font-black text-white mb-3">تواصل معنا</h1></div>
</section>
<section id="contact-body" class="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12">
  <div class="space-y-5">
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl"><i class="fas fa-phone"></i></span>
      <div><h3 class="font-bold">الهاتف</h3><a href="tel:${R((n.phone||``).replace(/\s/g,``))}" onclick="trackEvent('phone_click')" dir="ltr" class="text-brown/70">${R(n.phone||``)}</a></div>
    </article>
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-2xl"><i class="fab fa-whatsapp"></i></span>
      <div><h3 class="font-bold">WhatsApp</h3><a href="${r}" target="_blank" rel="noopener" onclick="trackEvent('whatsapp_click')" dir="ltr" class="text-brown/70">${R(n.whatsapp||``)}</a></div>
    </article>
    <article class="bg-white rounded-2xl p-6 flex items-center gap-5">
      <span class="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center text-2xl"><i class="fas fa-location-dot"></i></span>
      <div><h3 class="font-bold">العنوان</h3><p class="text-brown/70">${R(n.address_ar||``)}</p></div>
    </article>
  </div>
  <form id="contact-form" class="bg-white rounded-2xl p-8 shadow-sm space-y-5">
    <h2 class="text-xl font-black text-charcoal">أرسل رسالة</h2>
    <div><label class="block text-sm font-bold mb-2">الاسم *</label><input name="name" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">الهاتف *</label><input name="phone" required dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">البريد الإلكتروني</label><input name="email" type="email" dir="ltr" class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></div>
    <div><label class="block text-sm font-bold mb-2">الرسالة *</label><textarea name="message" rows="4" required class="w-full border border-sand rounded-xl px-4 py-3 focus:outline-none focus:border-gold"></textarea></div>
    <button id="contact-submit-btn" type="submit" class="btn-gold w-full py-3.5 rounded-xl font-bold">إرسال</button>
    <div id="contact-result" class="hidden text-center p-4 rounded-xl"></div>
  </form>
</section>
<script>
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, btn = document.getElementById('contact-submit-btn'), out = document.getElementById('contact-result');
  btn.disabled = true;
  try {
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name.value, phone: f.phone.value, email: f.email.value, message: f.message.value }) });
    const j = await r.json();
    out.classList.remove('hidden');
    if (r.ok) { out.className = 'text-center p-4 rounded-xl bg-green-50 text-green-800 font-bold'; out.textContent = 'تم إرسال رسالتك بنجاح — سنتواصل معك قريباً.'; f.reset(); }
    else { out.className = 'text-center p-4 rounded-xl bg-red-50 text-red-700'; out.textContent = j.error || 'حدث خطأ'; }
  } catch { out.classList.remove('hidden'); out.className='text-center p-4 rounded-xl bg-red-50 text-red-700'; out.textContent='تعذر الاتصال'; }
  btn.disabled = false;
});
<\/script>`;return e.html(Y({settings:n,path:`/contact`,title:`تواصل معنا`},i))});function ct(){return`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>لوحة التحكم — سرايا الأندلس</title>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script>
tailwind.config = { theme: { extend: {
  colors: { charcoal:'#23201c', cream:'#faf7f2', sand:'#efe9df', gold:'#b08d57', golddark:'#8f7040', brown:'#4a3728' },
  fontFamily: { sans: ['Cairo','sans-serif'] }
}}}
<\/script>
<style>
  body { font-family:'Cairo',sans-serif; background:#f4f1ec; }
  ::selection { background:#b08d57; color:#fff; }
  /* Sidebar */
  .side-link { display:flex; align-items:center; gap:.75rem; padding:.7rem 1rem; border-radius:.75rem; color:#d6cfc4; font-weight:600; font-size:.9rem; transition:all .15s; cursor:pointer; }
  .side-link:hover { background:rgba(255,255,255,.07); color:#fff; }
  .side-link.active { background:linear-gradient(135deg,#b08d57,#9a7847); color:#fff; box-shadow:0 3px 10px rgba(176,141,87,.35); }
  /* Inputs */
  .inp { width:100%; border:1.5px solid #e5ddd0; border-radius:.7rem; padding:.6rem .9rem; font-size:.9rem; background:#fff; transition:border-color .15s, box-shadow .15s; }
  .inp:focus { outline:none; border-color:#b08d57; box-shadow:0 0 0 3px rgba(176,141,87,.15); }
  .inp:disabled { background:#f5f2ec; color:#8a7d6b; }
  textarea.inp { line-height:1.7; }
  .lbl { display:block; font-size:.78rem; font-weight:700; color:#4a3728; margin-bottom:.35rem; }
  /* Buttons — unified system (works standalone: btn-gold OR btn btn-gold) */
  .btn, .btn-gold, .btn-dark, .btn-red, .btn-ghost, .btn-outline {
    display:inline-flex; align-items:center; justify-content:center; gap:.4rem;
    padding:.55rem 1.15rem; border-radius:.7rem; font-weight:700; font-size:.85rem;
    cursor:pointer; border:1.5px solid transparent; transition:all .15s; white-space:nowrap;
    font-family:'Cairo',sans-serif; line-height:1.4;
  }
  .btn-gold { background:linear-gradient(135deg,#b08d57,#9a7847); color:#fff; box-shadow:0 2px 8px rgba(176,141,87,.3); }
  .btn-gold:hover { filter:brightness(1.08); box-shadow:0 4px 14px rgba(176,141,87,.4); transform:translateY(-1px); }
  .btn-dark { background:#23201c; color:#fff; }
  .btn-dark:hover { background:#3a352e; }
  .btn-red { background:#fee2e2; color:#b91c1c; }
  .btn-red:hover { background:#dc2626; color:#fff; }
  .btn-ghost { background:#efe9df; color:#4a3728; }
  .btn-ghost:hover { background:#e3dac9; }
  .btn-outline { background:#fff; color:#8f7040; border-color:#d9c9ae; }
  .btn-outline:hover { background:#faf6ef; border-color:#b08d57; }
  .btn:active, .btn-gold:active, .btn-dark:active, .btn-red:active, .btn-ghost:active, .btn-outline:active { transform:scale(.97); }
  /* Icon-only action buttons in tables */
  .act { display:inline-flex; align-items:center; justify-content:center; width:2.1rem; height:2.1rem; border-radius:.6rem; font-size:.8rem; cursor:pointer; transition:all .15s; border:none; }
  .act-edit { background:#eef4ff; color:#2563eb; } .act-edit:hover { background:#2563eb; color:#fff; }
  .act-del { background:#fee2e2; color:#dc2626; } .act-del:hover { background:#dc2626; color:#fff; }
  .act-warn { background:#fef3c7; color:#b45309; } .act-warn:hover { background:#d97706; color:#fff; }
  .act-view { background:#efe9df; color:#4a3728; } .act-view:hover { background:#b08d57; color:#fff; }
  /* Badges */
  .badge { display:inline-block; font-size:.7rem; font-weight:700; padding:.2rem .65rem; border-radius:999px; white-space:nowrap; }
  /* Tables */
  table.tbl { width:100%; font-size:.85rem; border-collapse:collapse; }
  table.tbl th { text-align:right; padding:.75rem .9rem; background:#efe9df; color:#4a3728; font-weight:700; font-size:.78rem; }
  table.tbl th:first-child { border-radius:0 .8rem 0 0; } table.tbl th:last-child { border-radius:.8rem 0 0 0; }
  table.tbl td { padding:.7rem .9rem; border-bottom:1px solid #f0ece4; vertical-align:middle; }
  table.tbl tr:last-child td { border-bottom:none; }
  table.tbl tbody tr { transition:background .12s; }
  table.tbl tbody tr:hover td { background:#faf7f2; }
  /* Cards */
  .card { background:#fff; border-radius:1rem; box-shadow:0 1px 4px rgba(35,32,28,.06); }
  /* Modal */
  .modal-bg { background:rgba(35,32,28,.6); backdrop-filter:blur(3px); animation:fadeIn .15s ease; }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
  .modal-card { animation:slideUp .2s ease; }
  /* Upload dropzone */
  .dropzone { border:2px dashed #d9c9ae; border-radius:1rem; background:#faf7f2; transition:all .15s; cursor:pointer; }
  .dropzone:hover, .dropzone.drag { border-color:#b08d57; background:#f5eee1; }
  /* Media picker tabs */
  .ptab { padding:.5rem 1.1rem; border-radius:.6rem; font-weight:700; font-size:.82rem; cursor:pointer; color:#8a7d6b; transition:all .15s; border:none; background:transparent; }
  .ptab.active { background:#23201c; color:#fff; }
  /* Scrollbar */
  ::-webkit-scrollbar { width:9px; height:9px; } ::-webkit-scrollbar-track { background:#efe9df; }
  ::-webkit-scrollbar-thumb { background:#c7b394; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:#b08d57; }
</style>
</head>
<body>
<div id="admin-app"><div class="min-h-screen flex items-center justify-center text-brown/60"><i class="fas fa-spinner fa-spin ml-2"></i> جارٍ التحميل...</div></div>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
<script src="/static/admin.js"><\/script>
</body>
</html>`}var Q=new O;Q.use(`/api/*`,Pe()),Q.route(`/api/auth`,I),Q.route(`/api/admin`,H),Q.route(`/api`,J),Q.get(`/admin`,e=>e.html(ct())),Q.get(`/admin/*`,e=>e.html(ct())),Q.get(`/robots.txt`,e=>e.text(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${new URL(e.req.url).origin}/sitemap.xml`)),Q.get(`/sitemap.xml`,async e=>{let t=new URL(e.req.url).origin,n=[`/`,`/products`,`/services`,`/projects`,`/about`,`/contact`,`/quote`],r=await e.env.DB.prepare(`SELECT slug, updated_at FROM products WHERE status='published'`).all(),i=await e.env.DB.prepare(`SELECT slug, updated_at FROM projects WHERE status='published'`).all(),a=(e,n)=>`<url><loc>${t}${e}</loc>${n?`<lastmod>${n.slice(0,10)}</lastmod>`:``}</url>`,o=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${n.map(e=>a(e)).join(`
`)}
${r.results.map(e=>a(`/products/`+e.slug,e.updated_at)).join(`
`)}
${i.results.map(e=>a(`/projects/`+e.slug,e.updated_at)).join(`
`)}
</urlset>`;return e.body(o,200,{"Content-Type":`application/xml`})}),Q.route(`/`,X),Q.notFound(async e=>{if(e.req.path.startsWith(`/api/`))return e.json({error:`غير موجود`},404);let t={};try{t=await B(e.env.DB)}catch{}let n=t.company_name_ar||`سرايا الأندلس`;return e.html(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>الصفحة غير موجودة — ${R(n)}</title><script src="https://cdn.tailwindcss.com"><\/script><link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Cairo',sans-serif}</style></head><body class="bg-[#faf7f2] min-h-screen flex items-center justify-center"><div class="text-center px-4"><p class="text-7xl font-black text-[#b08d57] mb-4">404</p><h1 class="text-2xl font-bold text-[#23201c] mb-6">الصفحة التي تبحث عنها غير موجودة</h1><a href="/" class="inline-block bg-[#b08d57] text-white px-8 py-3 rounded-full font-bold">العودة للرئيسية</a></div></body></html>`,404)}),Q.onError((e,t)=>(console.error(e),t.req.path.startsWith(`/api/`)?t.json({error:`خطأ داخلي`},500):t.html(`<h1 style="font-family:sans-serif;text-align:center;margin-top:20vh">حدث خطأ — حاول لاحقاً</h1>`,500)));var $=new O,lt=Object.assign({"/src/index.tsx":Q}),ut=!1;for(let[,e]of Object.entries(lt))e&&($.all(`*`,t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),$.notFound(t=>{let n;try{n=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,n)}),ut=!0);if(!ut)throw Error(`Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']`);export{$ as default};