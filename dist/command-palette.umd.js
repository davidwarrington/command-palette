var Re=(m,b,x)=>{if(!b.has(m))throw TypeError("Cannot "+x)};var T=(m,b,x)=>(Re(m,b,"read from private field"),x?x.call(m):b.get(m)),ie=(m,b,x)=>{if(b.has(m))throw TypeError("Cannot add the same private member more than once");b instanceof WeakSet?b.add(m):b.set(m,x)};(function(m,b){typeof exports=="object"&&typeof module!="undefined"?module.exports=b():typeof define=="function"&&define.amd?define(b):(m=typeof globalThis!="undefined"?globalThis:m||self,m.CommandPalette=b())})(this,function(){var C;"use strict";function m(){}function b(e){return e()}function x(){return Object.create(null)}function L(e){e.forEach(b)}function F(e){return typeof e=="function"}function le(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}function ce(e){return Object.keys(e).length===0}function ae(e){return e&&F(e.destroy)?e.destroy:m}function v(e,t){e.appendChild(t)}function j(e,t,n){e.insertBefore(t,n||null)}function M(e){e.parentNode.removeChild(e)}function ue(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function S(e){return document.createElement(e)}function U(e){return document.createTextNode(e)}function z(){return U(" ")}function de(){return U("")}function O(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function fe(e){return function(t){return t.preventDefault(),e.call(this,t)}}function pe(e){return function(t){return t.stopPropagation(),e.call(this,t)}}function k(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function me(e){return Array.from(e.childNodes)}function Q(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function W(e,t){e.value=t==null?"":t}function he(e){const t={};for(const n of e)t[n.name]=n.value;return t}let Y;function X(e){Y=e}const N=[],P=[],H=[],Z=[],$=Promise.resolve();let B=!1;function ee(){B||(B=!0,$.then(A))}function ge(){return ee(),$}function V(e){H.push(e)}let G=!1;const J=new Set;function A(){if(!G){G=!0;do{for(let e=0;e<N.length;e+=1){const t=N[e];X(t),_e(t.$$)}for(X(null),N.length=0;P.length;)P.pop()();for(let e=0;e<H.length;e+=1){const t=H[e];J.has(t)||(J.add(t),t())}H.length=0}while(N.length);for(;Z.length;)Z.pop()();B=!1,G=!1,J.clear()}}function _e(e){if(e.fragment!==null){e.update(),L(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(V)}}const be=new Set;function ye(e,t){e&&e.i&&(be.delete(e),e.i(t))}function Ee(e,t,n,s){const{fragment:r,on_mount:a,on_destroy:l,after_update:E}=e.$$;r&&r.m(t,n),s||V(()=>{const g=a.map(b).filter(F);l?l.push(...g):L(g),e.$$.on_mount=[]}),E.forEach(V)}function we(e,t){const n=e.$$;n.fragment!==null&&(L(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ke(e,t){e.$$.dirty[0]===-1&&(N.push(e),ee(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function ve(e,t,n,s,r,a,l,E=[-1]){const g=Y;X(e);const d=e.$$={fragment:null,ctx:null,props:a,update:m,not_equal:r,bound:x(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(g?g.$$.context:[])),callbacks:x(),dirty:E,skip_bound:!1,root:t.target||g.$$.root};l&&l(d.root);let y=!1;if(d.ctx=n?n(e,t.props||{},(f,p,...c)=>{const u=c.length?c[0]:p;return d.ctx&&r(d.ctx[f],d.ctx[f]=u)&&(!d.skip_bound&&d.bound[f]&&d.bound[f](u),y&&ke(e,f)),p}):[],d.update(),y=!0,L(d.before_update),d.fragment=s?s(d.ctx):!1,t.target){if(t.hydrate){const f=me(t.target);d.fragment&&d.fragment.l(f),f.forEach(M)}else d.fragment&&d.fragment.c();t.intro&&ye(e.$$.fragment),Ee(e,t.target,t.anchor,t.customElement),A()}X(g)}let te;typeof HTMLElement=="function"&&(te=class extends HTMLElement{constructor(){super();this.attachShadow({mode:"open"})}connectedCallback(){const{on_mount:e}=this.$$;this.$$.on_disconnect=e.map(b).filter(F);for(const t in this.$$.slotted)this.appendChild(this.$$.slotted[t])}attributeChangedCallback(e,t,n){this[e]=n}disconnectedCallback(){L(this.$$.on_disconnect)}$destroy(){we(this,1),this.$destroy=m}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const s=n.indexOf(t);s!==-1&&n.splice(s,1)}}$set(e){this.$$set&&!ce(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}});const Ce=e=>{const t=n=>{const s=!e,r=n.composedPath().includes(e);n.defaultPrevented||s||r||e.dispatchEvent(new CustomEvent("command-palette:click-outside",{detail:e}))};return document.addEventListener("click",t,!0),{destroy(){document.removeEventListener("click",t,!0)}}};class xe{constructor(){ie(this,C,new Map)}add(t,n,s,r={once:!1}){t.addEventListener(n,s,r),T(this,C).has(t)||T(this,C).set(t,[]),T(this,C).get(t).push({event:n,fn:s})}remove(t,n,s){const r=T(this,C).get(t);!r||(T(this,C).set(t,r.filter(a=>a.event===n&&a.fn===s)),t.removeEventListener(n,s))}removeAll(){T(this,C).forEach((t,n)=>{t.forEach(s=>{this.remove(n,s.event,s.fn)}),T(this,C).delete(n)})}}C=new WeakMap;function ne(e,t,n){const s=e.slice();return s[28]=t[n],s[29]=t,s[30]=n,s}function oe(e){let t,n,s,r,a,l,E,g,d,y,f,p=e[6],c=[];for(let u=0;u<p.length;u+=1)c[u]=se(ne(e,p,u));return{c(){t=S("div"),n=S("form"),s=S("label"),r=U(e[0]),a=z(),l=S("input"),E=z(),g=S("ul");for(let u=0;u<c.length;u+=1)c[u].c();k(s,"class","command-palette__label u-visually-hidden"),k(s,"for","command-palette-input"),k(l,"id","command-palette-input"),k(l,"class","command-palette__input"),k(l,"type","text"),k(l,"placeholder",e[0]),k(n,"class","command-palette__field"),k(g,"class","command-palette__suggestions"),k(t,"class","command-palette")},m(u,w){j(u,t,w),v(t,n),v(n,s),v(s,r),v(n,a),v(n,l),e[16](l),W(l,e[1]),e[18](n),v(t,E),v(t,g);for(let i=0;i<c.length;i+=1)c[i].m(g,null);e[22](t),y||(f=[O(l,"input",e[17]),O(n,"submit",fe(e[19])),O(t,"keydown",pe(e[10])),O(t,"command-palette:click-outside",e[8]),ae(d=Ce.call(null,t))],y=!0)},p(u,w){if(w&1&&Q(r,u[0]),w&1&&k(l,"placeholder",u[0]),w&2&&l.value!==u[1]&&W(l,u[1]),w&228){p=u[6];let i;for(i=0;i<p.length;i+=1){const D=ne(u,p,i);c[i]?c[i].p(D,w):(c[i]=se(D),c[i].c(),c[i].m(g,null))}for(;i<c.length;i+=1)c[i].d(1);c.length=p.length}},d(u){u&&M(t),e[16](null),e[18](null),ue(c,u),e[22](null),y=!1,L(f)}}}function se(e){let t,n,s=e[28].name+"",r,a=e[30],l,E,g;const d=()=>e[20](n,a),y=()=>e[20](null,a);function f(...p){return e[21](e[28],...p)}return{c(){t=S("li"),n=S("button"),r=U(s),l=z(),k(n,"class","command-palette__suggestion"),k(t,"class","command-palette__suggestions-item")},m(p,c){j(p,t,c),v(t,n),v(n,r),d(),v(t,l),E||(g=O(n,"click",f),E=!0)},p(p,c){e=p,c&64&&s!==(s=e[28].name+"")&&Q(r,s),a!==e[30]&&(y(),a=e[30],d())},d(p){p&&M(t),y(),E=!1,g()}}}function Te(e){let t,n,s,r=e[4]===e[3].OPEN&&oe(e);return{c(){r&&r.c(),t=de(),this.c=m},m(a,l){r&&r.m(a,l),j(a,t,l),n||(s=O(window,"keydown",e[9]),n=!0)},p(a,[l]){a[4]===a[3].OPEN?r?r.p(a,l):(r=oe(a),r.c(),r.m(t.parentNode,t)):r&&(r.d(1),r=null)},i:m,o:m,d(a){r&&r.d(a),a&&M(t),n=!1,s()}}}function Se(e,t,n){let s,{commands:r=[]}=t,{openShortcutTest:a=o=>o.metaKey&&o.key==="k"}=t,{placeholder:l=""}=t;const E=o=>{n(15,p=o.commands||[]),n(0,l=o.placeholder),n(1,c=o.query),i.input.focus()},g=o=>new Promise(h=>{E(o);const _={element:i.root,type:y.EXECUTE},I=q=>{const{detail:He}=q;q.preventDefault(),w.remove(_.element,_.type,I),h(He.handler())};w.add(_.element,_.type,I)}),d=o=>new Promise(h=>{E(o);const _={element:i.form,type:"submit"},I=q=>{q.preventDefault(),w.remove(_.element,_.type,I),h(c)};w.add(_.element,_.type,I)});var y;(function(o){o.EXECUTE="command-palette:execute"})(y||(y={}));var f;(function(o){o.CLOSED="closed",o.OPEN="open"})(f||(f={}));let p=r,c="",u=f.CLOSED;const w=new xe;let i;const D=(o,h,_)=>o.dispatchEvent(new CustomEvent(h,{bubbles:!0,detail:_})),R=()=>{let{activeElement:o}=document;return o.shadowRoot&&(o=o.shadowRoot.activeElement),o},K=()=>{n(1,c=""),n(4,u=f.CLOSED),w.removeAll()},Le=async()=>{n(15,p=r),n(4,u=f.OPEN),await ge(),await g({placeholder:"Please enter a command",commands:r}).finally(K)},Oe=o=>{u===f.CLOSED&&a(o)?Le():u===f.OPEN&&o.key==="Escape"&&K()},Pe=[{test:o=>o.key==="Escape",handler:K},{test:o=>o.key==="ArrowDown",handler:o=>{o.preventDefault();let h=0;const _=i.suggestions.indexOf(R());_!==-1&&(h=_+1),!(h>=s.length)&&i.suggestions[h].focus()}},{test:o=>o.key==="ArrowUp",handler:o=>{o.preventDefault();let h=-1;const _=i.suggestions.indexOf(R());_!==-1&&(h=_-1),h===-1?i.input.focus():i.suggestions[h].focus()}},{test:o=>o.key==="Home",handler:o=>{o.preventDefault(),i.suggestions.includes(R())&&i.suggestions[0].focus()}},{test:o=>o.key==="End",handler:o=>{o.preventDefault(),i.suggestions.includes(R())&&i.suggestions[i.suggestions.length-1].focus()}}],Ae=o=>{const h=Pe.find(_=>_.test(o));!h||h.handler(o)};function De(o){P[o?"unshift":"push"](()=>{i.input=o,n(5,i)})}function Ne(){c=this.value,n(1,c)}function Ie(o){P[o?"unshift":"push"](()=>{i.form=o,n(5,i)})}const je=({target:o})=>D(o,y.EXECUTE,s[0]);function Me(o,h){P[o?"unshift":"push"](()=>{i.suggestions[h]=o,n(5,i)})}const Ue=(o,{target:h})=>D(h,y.EXECUTE,o);function Xe(o){P[o?"unshift":"push"](()=>{i.root=o,n(5,i)})}return e.$$set=o=>{"commands"in o&&n(11,r=o.commands),"openShortcutTest"in o&&n(12,a=o.openShortcutTest),"placeholder"in o&&n(0,l=o.placeholder)},e.$$.update=()=>{e.$$.dirty&32770&&n(6,s=p.filter(o=>c?o.name.toLowerCase().replaceAll(" ","").includes(c.toLowerCase().replaceAll(" ","")):!0))},n(5,i={form:null,input:null,root:null,suggestions:[]}),[l,c,y,f,u,i,s,D,K,Oe,Ae,r,a,g,d,p,De,Ne,Ie,je,Me,Ue,Xe]}class re extends te{constructor(t){super();this.shadowRoot.innerHTML=`<style>*{box-sizing:border-box}.command-palette{--colour-red:#ff3e00;--spacing:10px;--vertical-offset:150px;background-color:#ffffff;box-shadow:0 1px 3px 0 rgba(0, 0, 0, 0.3),
        0 1px 2px 0 rgba(0, 0, 0, 0.18);display:grid;gap:calc(var(--spacing) * .5);left:50%;margin-inline:auto;padding:var(--spacing);position:fixed;text-align:left;top:var(--vertical-offset);transform:translateX(-50%);width:600px}.command-palette__input{appearance:none;background-color:transparent;border:1px solid rgba(0, 0, 0, .3);padding:5px;width:100%}.command-palette__input:focus{border:1px solid var(--colour-red);outline:none}.command-palette__suggestions{display:grid;list-style-type:none;margin:0 calc(var(--spacing) * -1) calc(var(--spacing) * -1);max-height:calc(100vh - (var(--vertical-offset) * 2));padding:calc(var(--spacing) * .5) var(--spacing) calc(var(--spacing) * .5);overflow:auto}.command-palette__suggestions-item{margin-inline:calc(var(--spacing) * -1)}.command-palette__suggestion{appearance:none;background-color:transparent;border:0;cursor:pointer;padding:calc(var(--spacing) * .5) calc(var(--spacing) * 1);text-align:left;width:100%}.command-palette__suggestion:focus{background-color:rgba(0, 0, 0, .01);outline:1px solid var(--colour-red)}.command-palette__suggestion:hover{background-color:rgba(0, 0, 0, .01)}.u-visually-hidden{border-width:0;clip:rect(0, 0, 0, 0);height:1px;padding:0;position:absolute;margin:-1px;overflow:hidden;white-space:nowrap;width:1px}</style>`,ve(this,{target:this.shadowRoot,props:he(this.attributes),customElement:!0},Se,Te,le,{commands:11,openShortcutTest:12,placeholder:0,awaitCommand:13,awaitInput:14},null),t&&(t.target&&j(t.target,this,t.anchor),t.props&&(this.$set(t.props),A()))}static get observedAttributes(){return["commands","openShortcutTest","placeholder","awaitCommand","awaitInput"]}get commands(){return this.$$.ctx[11]}set commands(t){this.$$set({commands:t}),A()}get openShortcutTest(){return this.$$.ctx[12]}set openShortcutTest(t){this.$$set({openShortcutTest:t}),A()}get placeholder(){return this.$$.ctx[0]}set placeholder(t){this.$$set({placeholder:t}),A()}get awaitCommand(){return this.$$.ctx[13]}get awaitInput(){return this.$$.ctx[14]}}return customElements.define("command-palette",re),re});
