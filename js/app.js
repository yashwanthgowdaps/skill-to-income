// App logic: rendering, routing, progress. Data comes from js/data/*.js (loaded first).
const EARN=[
 ["uTest","Bug finding, test cases","Paid per accepted bug; India supported; pays twice a month","https://www.utest.com"],
 ["Test IO","Bug finding on apps","Bugs pay up to $50; paid monthly","https://test.io/become-a-tester"],
 ["Testlio","Managed project testing","Hourly projects (e.g. $18/hr listings); some India projects","https://testlio.com"],
 ["UserTesting","Use a website and talk aloud","About $10 for a 20-minute test","https://www.usertesting.com"],
 ["Userlytics","Website and app feedback","$5–$90 per study","https://www.userlytics.com"],
 ["Trymata","Website and app feedback","Pays by PayPal; open in India","https://trymata.com"]];
const TOOLS=[
 ["Claude","Chat","Writing, analysis, coding, long documents.","https://claude.ai"],
 ["ChatGPT","Chat","General chat, images, voice.","https://chatgpt.com"],
 ["Gemini","Chat","Google's assistant; works with Gmail and Docs.","https://gemini.google.com"],
 ["Microsoft Copilot","Chat","Microsoft's assistant; works with Office.","https://copilot.microsoft.com"],
 ["Perplexity","Search","Answers with sources from the web.","https://www.perplexity.ai"],
 ["NotebookLM","Study","Upload notes and PDFs, ask questions, get audio summaries.","https://notebooklm.google.com"],
 ["Google AI Studio","Build","Try Gemini models and get an API key.","https://aistudio.google.com"],
 ["Hugging Face","Build","Open-source models, datasets and free demos.","https://huggingface.co"],
 ["GitHub Copilot","Code","AI help inside your code editor.","https://github.com/features/copilot"],
 ["n8n","Automate","Build automation workflows with AI steps.","https://n8n.io"],
 ["Canva","Design","Posters, thumbnails and slides with AI help.","https://www.canva.com"],
 ["Claude Academy","Learn","Free Claude courses with certificates.","https://academy.claude.com"]];
const GROUPS=["Interview preparation","Earn and AI tools","Testing and quality","AI","Programming languages","App and web development","Careers","Electronics (ECE)","Electrical (EEE)","Mechanical","Civil"];
// Branch filter for the Job Programs tab. "all" shows every program.
const BRANCHES=[["all","All branches"],["cse","CSE / IT"],["ece","ECE"],["eee","EEE"],["mech","Mechanical"],["civil","Civil"]];
let branch="all";try{const b=localStorage.getItem("sti-branch");if(BRANCHES.some(x=>x[0]===b))branch=b}catch(e){}
const inBranch=p=>branch==="all"||(PROGRAMS[p].branch||[]).includes(branch);
// Programs in picker order: with a branch chosen, that branch's own programs come first.
const progOrder=()=>branch==="all"?PORDER:[...PORDER].sort((a,b)=>((PROGRAMS[a].branch||[])[0]===branch?0:1)-((PROGRAMS[b].branch||[])[0]===branch?0:1));
const ORDER=GROUPS.flatMap(g=>Object.keys(SYL).filter(k=>SYL[k].group===g)).concat(Object.keys(SYL).filter(k=>!GROUPS.includes(SYL[k].group)));
const KEY="sti-progress-v2";
let done={};try{done=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){done={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
// Every outside link goes through U(): only http(s) addresses, escaped for the href attribute.
const U=u=>/^https?:\/\//i.test(u||"")?esc(u):"#";
const tk=(k,name)=>k+"::"+name;
const split=t=>{const i=t.indexOf("|");return [t.slice(0,i),t.slice(i+1)]};
function counts(k,lv){let d=0,n=0;(lv?[lv]:SYL[k].levels).forEach(L=>L.modules.forEach(m=>m.topics.forEach(t=>{n++;if(done[tk(k,split(t)[0])])d++})));return [d,n]}
// Picker: two tabs. "Job Programs" lists the 8 programs; "Courses" lists all courses (Placement Preparation first).
// Each tab remembers the last item opened in it, so switching tabs goes back to where the learner was.
const lastPick={job:null,course:null};
// Course fits the chosen branch: made for it, or useful for every branch.
const cInBranch=k=>branch==="all"||(SYL[k].branch||[]).includes(branch)||(SYL[k].branch||[]).includes("any");
const brName=id=>(BRANCHES.find(x=>x[0]===id)||[id,id])[1];
// Courses in picker order for the chosen branch: its own courses first, then the ones for every branch.
const courseOwn=()=>ORDER.filter(k=>(SYL[k].branch||[]).includes(branch)).sort((a,b)=>((SYL[a].branch||[])[0]===branch?0:1)-((SYL[b].branch||[])[0]===branch?0:1));
const courseAny=()=>ORDER.filter(k=>(SYL[k].branch||[]).includes("any"));
const firstIn=tab=>tab==="job"?"job-"+(progOrder().find(inBranch)||PORDER[0]):(branch==="all"?"placement":(courseOwn()[0]||courseAny()[0]||ORDER[0]));
// Picker, three steps: 1) your branch, 2) Job Programs or Courses, 3) the list for that branch.
// With a branch chosen, the list has two parts: items made for the branch, then items that suit every branch.
const pOwn=p=>(PROGRAMS[p].branch||[])[0]===branch;
const isOwn=cur=>cur.startsWith("job-")?pOwn(cur.slice(4)):(SYL[cur].branch||[]).includes(branch);
function nav(cur){const box=document.getElementById("nav"),isPr=cur==="practice",isJob=isPr||cur.startsWith("job-");if(!isPr)lastPick[isJob?"job":"course"]=cur;
 box.style.setProperty("--c",isPr?"var(--l-place)":isJob?PROGRAMS[cur.slice(4)].color:SYL[cur].color);
 const all=branch==="all",bn=esc(brName(branch));
 const tab=(id,label,n,on)=>`<button type="button" role="tab" class="ptab" data-tab="${id}" aria-selected="${on}">${label}<small>${n}</small></button>`;
 // Options carry a colour dot and the days in their own span. Browsers with the new styleable list show them as rows;
 // others show the plain text "Name · 75 days".
 const opt=k=>`<option value="${esc(k)}" ${k===cur?"selected":""}><span class="odot" style="--oc:${esc(SYL[k].color)}"></span><span class="onm">${esc(SYL[k].name)}</span><span class="osep"> · </span><span class="omt">${SYL[k].days} days</span></option>`;
 const popt=p=>`<option value="job-${esc(p)}" ${("job-"+p)===cur?"selected":""}><span class="odot" style="--oc:${esc(PROGRAMS[p].color)}"></span><span class="onm">${esc(PROGRAMS[p].name)}</span></option>`;
 const grp=(label,items,f)=>items.length?`<optgroup label="${esc(label)}">${items.map(f).join("")}</optgroup>`:"";
 const ownP=PORDER.filter(pOwn),alsoP=PORDER.filter(p=>!pOwn(p)&&inBranch(p)),ownC=courseOwn(),anyC=courseAny();
 let opts;
 if(isJob){const lead=isPr?`<option value="" selected disabled>Practice and interview hub</option>`:"";
  if(all)opts=lead+PORDER.map(popt).join("");
  else{const extra=!isPr&&!inBranch(cur.slice(4))?[cur.slice(4)]:[];
   opts=lead+grp("Open now",extra,popt)+grp(`Made for ${brName(branch)} (${ownP.length})`,ownP,popt)+grp(`Also open to ${brName(branch)}: IT jobs (${alsoP.length})`,alsoP,popt)}}
 else if(all)opts=GROUPS.map(g=>grp(g,ORDER.filter(k=>SYL[k].group===g),opt)).join("");
 else opts=(!cInBranch(cur)?grp("Open now",[cur],opt):"")+grp(`${brName(branch)} courses (${ownC.length})`,ownC,opt)+grp(`For every branch (${anyC.length})`,anyC,opt);
 // Badges count only what is made for the branch, so the number changes with the branch.
 const nP=all?PORDER.length:ownP.length,nC=all?ORDER.length:ownC.length;
 const outside=!isPr&&!all&&(isJob?!inBranch(cur.slice(4)):!cInBranch(cur));
 const forWhom=isJob?(PROGRAMS[cur.slice(4)]||{}).branch:(SYL[cur]||{}).branch;
 const meta=isPr?"Questions, plans and practice sites":all?(isJob?"1–2 year plans that join several courses":"Single A–Z courses with videos and projects")
  :isJob?`${ownP.length} made for ${bn}${alsoP.length?` + ${alsoP.length} IT job programs open to ${bn}`:""}`:`${ownC.length} ${bn} courses + ${anyC.length} for every branch`;
 box.innerHTML=`<label class="step brsel"><span>1 · Your branch</span><select id="branch">${BRANCHES.map(([id,lab])=>`<option value="${id}" ${id===branch?"selected":""}>${esc(lab)}</option>`).join("")}</select></label>
 <div class="step stabs"><span id="lbl-show">2 · Show</span><div class="ptabs" role="tablist" aria-labelledby="lbl-show">${tab("job",`<span class="lg">Job </span>Programs`,nP,isJob&&!isPr)}${tab("course","Courses",nC,!isJob)}</div></div>
 <label class="step spick"><span>3 · Choose ${isJob?"a program":"a course"}</span><div class="pickwrap"><span class="dot"></span><select id="pick"><button type="button" tabindex="-1"><selectedcontent></selectedcontent></button>${opts}</select></div></label>
 <span class="pickmeta">${meta}</span>
 ${outside?`<p class="brnote">This ${isJob?"program":"course"} is mainly for ${esc((forWhom||[]).map(brName).join(", "))} students. <button type="button" class="ghost sm" id="brall">Show all branches</button></p>`:""}`;
 document.getElementById("pick").addEventListener("change",e=>{if(e.target.value)location.hash=e.target.value});
 box.querySelectorAll(".ptab").forEach(b=>b.addEventListener("click",()=>{const t=b.dataset.tab;let want=lastPick[t];
  const fits=want&&(t==="job"?PROGRAMS[want.slice(4)]&&inBranch(want.slice(4)):SYL[want]&&cInBranch(want));if(!fits)want=firstIn(t);if(location.hash.slice(1)!==want)location.hash=want}));
 const setBranch=v=>{branch=BRANCHES.some(x=>x[0]===v)?v:"all";try{localStorage.setItem("sti-branch",branch)}catch(e){}};
 // New branch: keep the open item only if it is made for that branch; otherwise open the branch's first own item.
 document.getElementById("branch").addEventListener("change",e=>{setBranch(e.target.value);if(isPr||branch==="all")return nav(cur);
  const want=isOwn(cur)?cur:firstIn(isJob?"job":"course");lastPick[isJob?"course":"job"]=null;if(want!==cur)location.hash=want;else nav(cur)});
 const ba=document.getElementById("brall");if(ba)ba.addEventListener("click",()=>{setBranch("all");nav(cur)})}
// Links the scheduled checker found broken (js/data/link-status.js). Missing file = nothing marked.
const LS=(typeof LINK_STATUS!=="undefined"&&LINK_STATUS)||{checked:null,broken:{}};
const DEAD=u=>!!(u&&LS.broken&&LS.broken[u]);
// Replacement videos picked by the scheduled check for removed videos. Only plain YouTube watch links are used.
const REPL=u=>{const r=u&&LS.replaced&&Object.prototype.hasOwnProperty.call(LS.replaced,u)&&LS.replaced[u];return r&&/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(r.u)&&!DEAD(r.u)?r:null};
function markDead(root){if(!root)return;root.querySelectorAll("a[href]").forEach(a=>{if(a.classList.contains("vid")||a.dataset.dead||!DEAD(a.getAttribute("href")))return;a.dataset.dead="1";a.classList.add("dead");a.title="This link stopped working. A replacement is coming.";a.insertAdjacentHTML("beforeend",' <span class="deadtag">link not working</span>')})}
// Videos. A module's videos are shown once at the top of the module; a topic shows only its own extra video.
// No chosen video yet -> a YouTube search link (never an empty "being checked" box).
const LANGS=[["en","EN","English"],["hi","हिन्दी","Hindi"]];
function vchip(x,lab,search){
 if(x&&DEAD(x.u)){const r=REPL(x.u);
  if(r)return `<a class="vid repl" href="${U(r.u)}" target="_blank" rel="noopener noreferrer" title="${esc(`The earlier video${x.t?` "${x.t}"`:""} was removed from YouTube, so it was replaced with this one${r.on?` on ${r.on}`:""}. If the earlier video comes back, it will be shown again.`)}"><span class="lang">${lab}</span><span class="vt">▶ ${esc(r.t||"Video")}${r.len?" · "+esc(r.len):""}</span><span class="ch">${esc(r.ch||"")}</span><span class="newtag">New video · earlier one removed</span></a>`;
  x=null}
 if(!x)return `<a class="vid srch" href="https://www.youtube.com/results?search_query=${encodeURIComponent(search.trim())}" target="_blank" rel="noopener noreferrer"><span class="lang">${lab}</span>Search YouTube</a>`;
 return `<a class="vid" href="${U(x.u)}" target="_blank" rel="noopener noreferrer" title="${esc(x.ch)}"><span class="lang">${lab}</span><span class="vt">▶ ${esc(x.t)}${x.len?" · "+esc(x.len):""}</span><span class="ch">${esc(x.ch)}</span></a>`}
function modVids(k,m){const v=MODV[k+"::"+m.name]||{};
 return LANGS.map(([l,lab,word])=>vchip(v[l],lab,`${m.name} ${SYL[k].short} ${l==="hi"?"in Hindi":"tutorial"}`)).join("")}
// A topic's own videos, minus any that are the same as its module's video (already shown at the top of the module).
const ownVids=(k,name,mname)=>{const v=VIDEOS[tk(k,name)]||{},mv=(mname&&MODV[k+"::"+mname])||{},o={};LANGS.forEach(([l])=>{const a=[].concat(v[l]||[]).filter(x=>x&&!(mv[l]&&mv[l].u===x.u));if(a.length)o[l]=a});return o};
// Every topic gets something to click: its own videos, else its practice links, else a YouTube search (EN + Hindi).
function topicVids(k,name,mname){const v=ownVids(k,name,mname),q=l=>`${name} ${SYL[k].short} ${l==="hi"?"in Hindi":"tutorial"}`;
 const own=LANGS.flatMap(([l,lab])=>[].concat(v[l]||[]).map(x=>vchip(x,lab,q(l)))).join("");
 if(own||(TOPL[tk(k,name)]||[]).length)return own;
 return LANGS.map(([l,lab])=>vchip(null,lab,q(l))).join("")}
// How well each course is covered by videos: a topic's own video, else its module's video, else a YouTube search.
function coverage(k){let own=0,mod=0,none=0;SYL[k].levels.forEach(L=>L.modules.forEach(m=>{const mv=MODV[k+"::"+m.name]||{};
 m.topics.forEach(t=>{const v=ownVids(k,split(t)[0],m.name);if(v.en||v.hi)own++;else if(mv.en||mv.hi)mod++;else none++})}));return {own,mod,none}}
function coverageLine(k){const c=coverage(k),n=c.own+c.mod+c.none;
 if(!c.own&&!c.mod)return `<p class="forwho cover"><b>Videos:</b> being chosen for this course. Each topic has a YouTube search button for now; the free course links are ready.</p>`;
 return `<p class="forwho cover"><b>Videos:</b> ${c.own} of ${n} topics have their own video${c.mod?`, ${c.mod} use the module's video`:""}${c.none?`, ${c.none} ${c.none===1?"shows":"show"} a YouTube search for now`:""}.</p>`}
let query="",ctab="roadmap";
// "Free and flexible" note: top of every course Roadmap tab and every job program page (English + Hindi).
const FREE_NOTE=`<div class="freenote"><p><b>Free and flexible.</b> Every video and course linked here is free. Use this roadmap as your foundation, and change the order or skip what you already know. Paid courses are optional; choose one later only if you want more depth.</p><details class="hi" lang="hi"><summary>हिन्दी में पढ़ें</summary><p><b>मुफ़्त और लचीला।</b> यहाँ दिए गए सभी वीडियो और कोर्स मुफ़्त हैं। इस रोडमैप को अपनी नींव मानें; अपनी सुविधा से क्रम बदलें या जो पहले से आता है उसे छोड़ दें। पेड कोर्स ज़रूरी नहीं हैं; ज़्यादा गहराई चाहिए तो बाद में ही चुनें।</p></details></div>`;
// ---- Links to practice: internal targets ("#dsa:1:0", "#testing:projects", "#practice:sd") or outside sites ----
const CTABS=["roadmap","problems","questions","projects","certs","next","hub"];
const PR=(typeof PRACTICE!=="undefined"&&PRACTICE)||{sections:[]},TL=(typeof TASKLINKS!=="undefined"&&TASKLINKS)||{},CP=(typeof COURSE_PRACTICE!=="undefined"&&COURSE_PRACTICE)||{},QB=(typeof QBANK!=="undefined"&&QBANK)||{},TOPL=(typeof TOPICLINKS!=="undefined"&&TOPICLINKS)||{},MODPAT=(typeof DSA_MODPAT!=="undefined"&&DSA_MODPAT)||{};
const planRows=()=>((PR.sections.find(x=>x.plan)||{}).plan)||[];
// An internal target is valid only if it names a real course/level/module/tab or practice section.
// Only names the site defines count as a course or program (never built-in names like "constructor").
const isCourse=k=>Object.prototype.hasOwnProperty.call(SYL,k),isProg=p=>Object.prototype.hasOwnProperty.call(PROGRAMS,p);
function validTarget(t){const m=/^#([a-z0-9-]+)(?::([a-z0-9]+))?(?::(\d+))?$/.exec(t||"");if(!m)return false;const [,k,a,b]=m;
 if(k==="practice")return !a||PR.sections.some(s=>s.id===a);
 if(k.startsWith("job-"))return isProg(k.slice(4))&&!a;
 if(!isCourse(k))return false;const S=SYL[k];if(!a)return true;
 if(/^\d+$/.test(a)){const L=S.levels[+a];return !!L&&(b===undefined||!!L.modules[+b])}
 if(a==="problems")return k==="dsa"&&(b===undefined||+b<planRows().length);
 return CTABS.includes(a)&&b===undefined}
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,"")}catch(e){return ""}};
// One link chip. Outside sites get data-ext so the leave-site warning opens first.
function linkChip([label,t]){if(/^https:\/\//i.test(t||""))return `<a class="xlink" href="${U(t)}" data-ext="1" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span><span class="sr">(outside site: ${esc(host(t))})</span></a>`;
 return validTarget(t)?`<a class="ilink" href="${esc(t)}">${esc(label)} <span aria-hidden="true">→</span></a>`:""}
function siteCard([name,u,note]){return `<div class="card xcard"><a href="${U(u)}" data-ext="1" target="_blank" rel="noopener noreferrer">${esc(name)} <span aria-hidden="true">↗</span></a><span class="xhost">${esc(host(u))}</span>${note?`<p>${esc(note)}</p>`:""}</div>`}
// Leave-site warning: one dialog for the whole page, filled with textContent (never HTML from data).
let leaveOK=false;
function leaveSite(url){if(!/^https:\/\//i.test(url))return;const open=()=>{const w=window.open(url,"_blank","noopener,noreferrer");if(w)w.opener=null};
 if(leaveOK)return open();
 let d=document.getElementById("leave");
 if(!d||typeof d.showModal!=="function"){if(confirm(`You are leaving Skill to Income Academy to open ${host(url)}.\nThis site is not run by us. Never pay or share passwords or OTPs because a site asks. Continue?`))open();return}
 d.querySelector("#lv-host").textContent=host(url);d.dataset.url=url;d.querySelector("#lv-again").checked=false;d.showModal()}
function leaveDialog(){if(document.getElementById("leave"))return;
 const d=document.createElement("dialog");d.id="leave";d.setAttribute("aria-labelledby","lv-title");
 d.innerHTML=`<h3 id="lv-title">You are leaving this site</h3><p>This opens <b id="lv-host"></b> in a new tab. It is <b>not run by Skill to Income Academy</b>, so we do not control its content, ads or sign-ups.</p><ul><li>Use only the free parts; paying is your choice.</li><li>Never share passwords, OTPs, Aadhaar or bank details because a site asks.</li><li>Come back here to tick your progress.</li></ul><label class="lvagain"><input type="checkbox" id="lv-again"> Don't warn me again on this visit</label><div class="lvbtns"><button type="button" class="ghost" id="lv-stay" autofocus>Stay here</button><button type="button" id="lv-go">Open site ↗</button></div>`;
 document.body.appendChild(d);
 d.querySelector("#lv-stay").onclick=()=>d.close();
 d.querySelector("#lv-go").onclick=()=>{const u=d.dataset.url||"";if(d.querySelector("#lv-again").checked)leaveOK=true;d.close();if(/^https:\/\//i.test(u)){const w=window.open(u,"_blank","noopener,noreferrer");if(w)w.opener=null}};
 d.addEventListener("click",e=>{if(e.target===d)d.close()})}
// Save a generated file. Inside the claude.ai viewer the "downloads" capability is used; elsewhere a normal download.
async function saveFile(name,text,type){
 try{if(window.claude&&typeof window.claude.use==="function"){const dl=await Promise.race([window.claude.use("downloads"),new Promise(r=>setTimeout(()=>r(null),3000))]);
  if(dl){try{await dl.save({filename:name,data:text});return "saved"}catch(e){return e&&e.code==="declined"?"declined":"failed"}}}}catch(e){}
 try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.rel="noopener";document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return "saved"}catch(e){return "failed"}}
// Roadmap as plain text (roadmap only: no videos or links). [x] = ticked on this device.
const NL="\r\n",LINE="=".repeat(60);
const tickMark=id=>done[id]?"[x]":"[ ]";
function courseText(k){const S=SYL[k],[d,n]=counts(k),o=[];
 o.push(LINE,"SKILL TO INCOME ACADEMY - COURSE ROADMAP",S.name,LINE,`${S.days} days | ${S.perDay} per day | ${S.levels.length} levels | ${n} topics`,`Who it's for: ${S.forWho}`,`Certificate: ${S.cert}`,`Your progress on this device: ${d} of ${n} topics done (${new Date().toISOString().slice(0,10)})`,"","You will be able to:",...S.outcome.map(x=>"  - "+x),"");
 S.levels.forEach((L,i)=>{o.push(`LEVEL ${i+1}: ${L.name}  (${L.days})`,`Goal: ${L.goal}`);
  L.modules.forEach(m=>{o.push(`  Module: ${m.name}  (free course: ${m.course[0]})`);m.topics.forEach(t=>{const [a,b]=split(t);o.push(`    ${tickMark(tk(k,a))} ${a} - ${b}`)})});o.push("")});
 if(S.next)o.push("After this course:",...S.next.map(x=>"  - "+x),"");
 o.push("Free and flexible: change the order or skip what you already know. Every video and course on the site is free.");return o.join(NL)}
function programText(pk){const P=PROGRAMS[pk],o=[];
 o.push(LINE,"SKILL TO INCOME ACADEMY - JOB PROGRAM ROADMAP",P.name,LINE,`Plan: ${plan==="two"?"2-year plan":"1-year fast track"}`,`The job: ${P.role}`,`Who it's for: ${P.forWho}`,`Who hires: ${P.hires}`,"");
 P.phases.forEach((ph,i)=>{o.push(`PHASE ${i+1}: ${ph.name}  (${plan==="two"?ph.two:ph.one})`);
  if(ph.pick)o.push(`  Note: ${ph.pick}`);
  o.push("  Courses:");ph.courses.forEach(c=>{const S=SYL[c],[a,b]=pcounts(c,ph),ix=partIdx(ph,c);o.push(`    - ${S.name}${isPart(ph,c)?` (levels ${lvLabel(ix)} of ${S.levels.length})`:""}: ${pdays(c,ph)} days, ${ix.length} levels (${a}/${b} topics done)${altOf(ph,c)?"  [choose one: "+altOf(ph,c).map(x=>SYL[x].short).join(" or ")+"]":""}`);partIdx(ph,c).forEach(j=>{const L=S.levels[j];o.push(`        Level ${j+1}: ${L.name} (${L.days})`)})});
  o.push("  Also do in this phase:");ph.tasks.forEach((t,j)=>o.push(`    ${tickMark(`job-${pk}::${i}::${j}`)} ${t}`));o.push(`  Milestone: ${ph.milestone}`,"")});
 o.push("Typical interview rounds:",...P.interview.map((r,i)=>`  ${i+1}. ${r}`),"","No course can honestly guarantee a job. Finish every phase and milestone to be ready for this role's tests and interviews.");return o.join(NL)}
function dlButton(kind,key){return `<div class="dlrow"><button type="button" class="ghost sm" id="dl" data-kind="${kind}" data-key="${esc(key)}">⬇ Download roadmap (.txt)</button><span class="status" id="dlst" aria-live="polite"></span></div>`}
function wireDownload(){const b=document.getElementById("dl");if(!b)return;b.onclick=async()=>{const k=b.dataset.key,isP=b.dataset.kind==="job";
 const text="﻿"+(isP?programText(k):courseText(k)),name=`skill-to-income-${isP?"program-"+k:k}-roadmap.txt`,st=document.getElementById("dlst");
 const r=await saveFile(name,text,"text/plain;charset=utf-8");st.textContent=r==="saved"?"Roadmap file ready: check your Downloads.":r==="declined"?"Download cancelled.":"Download is not allowed here. Open the site in a normal browser tab."}}
// Alternative courses in a phase (e.g. Java or Python): a learner does one, so totals count the one with more progress.
const altOf=(ph,c)=>(ph.alt||[]).find(g=>g.includes(c))||null;
// A phase can use only some levels of a course (1-based): parts:{testing:[1,2]} = levels 1 to 2,
// parts:{placement:[[1,1],[3,5]]} = levels 1 and 3 to 5. No entry = the whole course.
function partIdx(ph,c){const n=SYL[c].levels.length,p=ph.parts&&Object.prototype.hasOwnProperty.call(ph.parts,c)?ph.parts[c]:null;
 const rs=!Array.isArray(p)?[[1,n]]:Array.isArray(p[0])?p:[p],o=new Set();
 rs.forEach(r=>{if(!Array.isArray(r))return;const a=Math.max(1,r[0]|0),b=Math.min(n,r[1]|0);for(let k=a;k<=b;k++)o.add(k-1)});
 return o.size?[...o].sort((x,y)=>x-y):[...Array(n).keys()]}
const isPart=(ph,c)=>partIdx(ph,c).length<SYL[c].levels.length;
// "1–2", "1, 3–5": level numbers for labels
function lvLabel(ix){const out=[];let a=null,b=null;ix.forEach(i=>{const k=i+1;if(a!==null&&k===b+1)b=k;else{if(a!==null)out.push(a===b?a:a+"–"+b);a=b=k}});if(a!==null)out.push(a===b?a:a+"–"+b);return out.join(", ")}
const lvDays=L=>{const m=(L.days||"").match(/\d+/g)||[];return m.length?+m[m.length-1]-(+m[0])+1:0};
function pcounts(c,ph){let d=0,n=0;partIdx(ph,c).forEach(i=>{const [x,y]=counts(c,SYL[c].levels[i]);d+=x;n+=y});return [d,n]}
function pdays(c,ph){return partIdx(ph,c).reduce((s,i)=>s+lvDays(SYL[c].levels[i]),0)}
function phaseCourses(ph){const out=[];ph.courses.forEach(c=>{const g=altOf(ph,c);if(!g)return out.push(c);const best=g.reduce((x,y)=>pcounts(y,ph)[0]>pcounts(x,ph)[0]?y:x,g[0]);if(!out.includes(best))out.push(best)});return out}
// "Put your work on GitHub": shown on every course (except the Git and GitHub course itself, which teaches it).
const KIND={c:"programs",cpp:"programs",java:"programs",python:"programs",sql:"queries",dsa:"solutions",frontend:"projects",fullstack:"projects",android:"apps",ios:"apps",testing:"test frameworks and bug reports",ai:"notebooks and apps",claude:"prompts and apps",data:"analyses and dashboards",devops:"scripts and pipelines",cyber:"lab write-ups",trading:"journals and backtests",placement:"resume and notes",tools:"prompts and workflows",aivideo:"scripts, prompts and finished videos",sap:"notes, test scripts and ABAP code"};
const ghKind=k=>KIND[k]||"projects, files and notes";
function githubTip(k){if(k==="github")return "";return `<div class="ghtip"><b>Put your work on GitHub.</b> Save your ${esc(ghKind(k))} from this course in a GitHub repository and add the link to your resume. You learn Git while you learn this course. <a class="ilink" href="#github">How: Git and GitHub course →</a></div>`}
function githubSteps(k){if(k==="github")return "";return `<section class="block ghsteps"><h3 class="sec">Put your work on GitHub</h3><p class="sub">Recruiters open your GitHub before they call you. Keep everything from this course in one public repository, in small steps.</p>
 <ol class="steps"><li>Create a repository named like <code>${esc(SYL[k].short.toLowerCase().replace(/[^a-z0-9]+/g,"-"))}-learning</code>, with a README and a .gitignore.</li><li>Make one folder per level (level-1, level-2 …) and add your ${esc(ghKind(k))} there as you finish each topic.</li><li>Commit after every topic with a clear message, for example "Level 2: binary search on answer".</li><li>Give each capstone project its own repository with a README: what it does, screenshots, how to run it, what you learnt.</li><li>Pin your best 3 repositories on your GitHub profile and put the links on your resume and LinkedIn.</li></ol>
 <div class="tlinks"><a class="ilink" href="#github:0">Git basics →</a><a class="ilink" href="#github:2">Using GitHub →</a><a class="ilink" href="#github:2:0">Profile README and GitHub Pages →</a></div></section>`}
function scrollToEl(el){if(!el)return;const nav=(document.getElementById("nav")||{}).offsetHeight||0;const y=el.getBoundingClientRect().top+scrollY-nav-10;scrollTo({top:Math.max(0,y),behavior:"auto"})}
function render(k){
 const S=SYL[k],v=document.getElementById("view");v.style.setProperty("--c",S.color);
 const [d,n]=counts(k),mods=S.levels.reduce((a,L)=>a+L.modules.length,0);
 let h=`<div class="eyebrow">${esc(S.group||"")} · Course ${ORDER.indexOf(k)+1} of ${ORDER.length} · Basic to advanced</div><h2>${esc(S.name)}</h2>${(()=>{const ps=PORDER.filter(p=>PROGRAMS[p].phases.some(ph=>ph.courses.includes(k)));return ps.length?`<div class="partof"><span>Part of these job programs:</span>${ps.map(p=>`<a href="#job-${p}" style="--pc:${PROGRAMS[p].color}">${esc(PROGRAMS[p].name)}</a>`).join("")}</div>`:""})()}
 <div class="over"><div class="panel"><h3>You will be able to</h3><ul>${S.outcome.map(o=>`<li>${esc(o)}</li>`).join("")}</ul><p class="forwho"><b>Who it's for:</b> ${esc(S.forWho)}</p></div>
 <div class="panel"><div class="facts"><div class="fact"><b>${S.days}</b><span>days</span></div><div class="fact"><b>${esc(S.perDay)}</b><span>per day</span></div><div class="fact"><b>${S.levels.length}</b><span>levels · ${mods} modules</span></div><div class="fact"><b>${n}</b><span>topics</span></div></div><p class="forwho"><b>Certificate:</b> ${esc(S.cert)}</p>${coverageLine(k)}</div></div>`;
 h+=dlButton("course",k);
 if(S.note)h+=`<div class="note">${S.note}</div>`;
 const top=h;h=FREE_NOTE+githubTip(k)+`<h3 class="sec linehead">Your progress line</h3><div class="mapwrap" aria-label="Levels and your progress"><div class="map">${mapStops(k)}</div></div>
 <div class="overall"><div class="bar"><i id="bar" style="width:${n?d/n*100:0}%"></i></div><span id="ptext">${d} of ${n} topics done</span></div>
 <div class="controw"><button type="button" id="cont">${d?"Continue where you left off →":"Start the first topic →"}</button><span class="status" id="contst"></span></div>
 <div class="tools-row"><input class="search" id="q" type="search" placeholder="Search topics, e.g. RSI, locators, RAG" value="${esc(query)}" aria-label="Search topics"></div>
 <p class="hint">Tap a module to open it. One module stays open at a time.</p><div id="levels"></div>`;
 const P={roadmap:h},T=[["roadmap","Roadmap",n+" topics"]];h="";
 if(k==="dsa"&&planRows().length&&typeof DSA300!=="undefined"){const all=Object.values(DSA300).flat().length;P.problems=`<section class="block"><h3 class="sec">300 problems by pattern</h3><p class="sub">The best way to learn DSA: after each module, solve its pattern's problems here, easy first. Tick each one you solve yourself. Your ticks are shared with the Practice hub.</p>${dsaPlan(planRows())}</section>`;T.push(["problems","300 problems",all+" problems"])}
 if(S.earn){h=""; h+=`<section class="block"><h3 class="sec">Get paid to test</h3><p class="sub">Real sites that pay testers. UI feedback sites (UserTesting, Userlytics, Trymata) pay you to use a site and speak your thoughts; bug sites (uTest, Test IO, Testlio) pay for bugs you find. Expect $50–$150 a month at first. Never pay any site to join.</p><div class="tablewrap"><table><thead><tr><th>Site</th><th>Work</th><th>Pay (from public listings)</th></tr></thead><tbody>${EARN.map(e=>`<tr><td><a href="${U(e[3])}" target="_blank" rel="noopener noreferrer">${esc(e[0])}</a></td><td>${esc(e[1])}</td><td>${esc(e[2])}</td></tr>`).join("")}</tbody></table></div></section>`;P.earn=h}
 if(S.hub){h=""; h+=`<section class="block"><h3 class="sec">Open any AI tool</h3><p class="sub">Write your question once, copy it, then open a tool and paste. Tools open in a new tab.</p><textarea id="ask" aria-label="Your question" placeholder="Example: Explain RSI in simple words with an example."></textarea><div class="tools-row" style="margin-top:8px"><button type="button" id="copy">Copy question</button><span class="status" id="st" aria-live="polite"></span></div><div class="grid">${TOOLS.map(t=>`<div class="card"><span class="cat">${esc(t[1])}</span><h4>${esc(t[0])}</h4><p>${esc(t[2])}</p><a href="${U(t[3])}" target="_blank" rel="noopener noreferrer">Open ${esc(t[0])} →</a></div>`).join("")}</div></section>`;P.hub=h;T.push(["hub","AI tools",TOOLS.length+" tools"])}
 {const qh=courseQs(k);if(qh.html){P.questions=qh.html;T.push(["questions","Interview",qh.n+" items"])}}
 h=githubSteps(k); const caps=CAP[k]||[];if(caps.length)h+=`<section class="block"><h3 class="sec">Capstone projects</h3><p class="sub">Build these after the matching levels. Together they use every major concept in this course. Each starts from a real GitHub repo; fork it and push your own version.</p><div class="caps">${caps.map(c=>`<article class="cap"><div class="caphead"><span class="lvl">${esc(c.lv)}</span><h4>${esc(c.t)}</h4></div><p>${esc(c.b)}</p><div class="concepts">${c.c.map(x=>`<span class="concept">${esc(x)}</span>`).join("")}</div><details class="capsteps"><summary>How to build it · ${c.s.length} steps</summary><ol class="steps">${c.s.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></details><div class="caprepo">Repo to fork or study: <a href="${U(c.r[1])}" target="_blank" rel="noopener noreferrer">${esc(c.r[0])}</a>${c.r2?` · <a href="${U(c.r2[1])}" target="_blank" rel="noopener noreferrer">${esc(c.r2[0])}</a>`:""}</div></article>`).join("")}</div></section>`;
 if((CP[k]||[]).length&&!P.questions)h+=`<section class="block"><h3 class="sec">Free practice sites</h3><p class="sub">Outside websites for extra practice. Each opens in a new tab after a short safety note.</p><div class="grid">${CP[k].map(siteCard).join("")}</div></section>`;
 if(S.repos.length)h+=`<section class="block"><h3 class="sec">GitHub repos for this line</h3><p class="sub">Fork a repo to get your own copy, then practise in it.</p><div class="grid">${S.repos.map(r=>`<div class="card"><a class="mono" href="${U(r[1])}" target="_blank" rel="noopener noreferrer">${esc(r[0])}</a><p>${esc(r[2])}</p></div>`).join("")}</div></section>`;
 h+=`<section class="block"><h3 class="sec">More project ideas</h3><p class="sub">Huge free collections when you want extra practice.</p><div class="grid">${IDEAS.map(r=>`<div class="card"><a class="mono" href="${U(r[1])}" target="_blank" rel="noopener noreferrer">${esc(r[0])}</a><p>${esc(r[2])}</p></div>`).join("")}</div></section>`;
 if(h)T.push(["projects","Projects",caps.length+" capstones"]);P.projects=h;h="";
 const cs=CERTS[k]||[];if(cs.length){const L=(x,t)=>x?`<a href="${U(x)}" target="_blank" rel="noopener noreferrer">${esc(t)}</a>`:esc(t);
 h+=`<section class="block" id="certs"><h3 class="sec">Certifications, study material and practice papers</h3><p class="sub">Take these after the course. Each card shows who issues it, the free study material and where to find official sample papers.</p>
 <div class="note">Use only official sample papers and genuine practice tests. Never use "exam dumps": they break exam rules and can get a certificate cancelled. Fees, exam codes and dates change, so check the official page before you book.</div>
 ${["Free","India","Intl","Co"].map(t=>{const g=cs.filter(x=>x.type===t);return g.length?`<h4 class="ctype">${CERT_TYPES[t]}</h4><div class="certs">${g.map(x=>`<article class="cert"><div class="certtop"><h5>${L(x.link,x.name)}</h5><span class="cfee">${esc(x.f)}</span></div><div class="cmeta">${esc(x.by)} · ${esc(x.lvl)}</div>${x.note?`<p class="cnote">${esc(x.note)}</p>`:""}<dl><dt>Study material</dt><dd>${L(x.m[1],x.m[0])}</dd><dt>Practice papers</dt><dd>${L(x.p[1],x.p[0])}</dd></dl></article>`).join("")}</div>`:""}).join("")}</section>`}
 if(h){T.push(["certs","Certificates",cs.length+" options"]);P.certs=h;h=""}
 if(S.next)h+=`<section class="block"><h3 class="sec">After this course, learn next</h3><p class="sub">Good next steps once you finish every level and capstone.</p><div class="nextlist">${S.next.map(x=>`<span>${esc(x)}</span>`).join("")}</div></section>`;
 h=(P.earn||"")+h;if(h){P.next=h;T.push(["next","What next",S.earn?"+ get paid":"after the course"])}
 if(T.length>4&&P.certs&&P.next){P.certs+=P.next;T.pop()} // keep at most 4 tabs so they fit a phone
 if(T.length>4&&P.certs&&P.projects){const i=T.findIndex(t=>t[0]==="certs"),j=T.findIndex(t=>t[0]==="projects");P.projects+=P.certs;T[j][2]+=" + certificates";T.splice(i,1)}
 {const into={next:"certs",certs:"projects"};let g=0;while(!T.some(t=>t[0]===ctab)&&into[ctab]&&g++<3)ctab=into[ctab]} // a merged tab opens the tab that now holds it
 if(!T.some(t=>t[0]===ctab))ctab="roadmap";
 v.innerHTML=top+`<div class="ctabs" role="tablist" aria-label="Course sections">${T.map(([id,lab,sub])=>`<button type="button" role="tab" class="ctab" data-ct="${id}" aria-selected="${id===ctab}">${lab}${sub?`<small>${esc(sub)}</small>`:""}</button>`).join("")}</div>`+
  T.map(([id])=>`<div class="cpanel" data-cp="${id}" ${id===ctab?"":"hidden"}>${P[id]}</div>`).join("");
 renderLevels(k);markDead(v);wireDownload();wireDsaPlan();
 v.querySelectorAll("[data-jump]").forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.getElementById(a.dataset.jump);if(t)scrollToEl(t)});
 document.getElementById("cont").onclick=()=>{const nx=nextTopic(k),st=document.getElementById("contst");if(!nx){st.textContent="Every topic is ticked. Well done! Check the Projects tab next.";return}
  if(query){query="";document.getElementById("q").value="";renderLevels(k)}openModule(nx.L,nx.M,nx.id)};
 v.querySelectorAll(".ctab").forEach(b=>b.onclick=()=>{ctab=b.dataset.ct;v.querySelectorAll(".ctab").forEach(x=>x.setAttribute("aria-selected",x===b));v.querySelectorAll(".cpanel").forEach(x=>x.hidden=x.dataset.cp!==ctab);
  const tb=v.querySelector(".ctabs");if(tb.getBoundingClientRect().top<0)tb.scrollIntoView()});
 const q=document.getElementById("q");let qt;q.addEventListener("input",()=>{clearTimeout(qt);qt=setTimeout(()=>{query=q.value;renderLevels(k)},150)});
 v.querySelector(".mapwrap").onclick=e=>{const b=e.target.closest("[data-go]");if(!b)return;const i=+b.dataset.go;if(query){query="";document.getElementById("q").value="";renderLevels(k)}openModule(i,0)};
 if(S.hub){const ta=document.getElementById("ask");document.getElementById("copy").onclick=()=>{const st=document.getElementById("st");if(!ta.value.trim()){st.textContent="Type a question first.";return}navigator.clipboard.writeText(ta.value).then(()=>st.textContent="Copied. Open a tool and paste.").catch(()=>{ta.select();st.textContent="Press Ctrl+C (or long-press → Copy)."})}}
}
// Progress line: done levels are filled, the first unfinished level is marked "You are here".
function mapStops(k){const S=SYL[k];let here=-1;const c=S.levels.map(L=>counts(k,L));here=c.findIndex(([a,b])=>a<b);
 return S.levels.map((L,i)=>{const [a,b]=c[i],cls=a===b?"full":i===here?"here":a?"part":"";return `<button type="button" class="stop ${cls}" data-go="${i}" aria-label="Level ${i+1}: ${esc(L.name)}, ${a} of ${b} done${i===here?", you are here":""}"><span class="pin"></span>${i===here?`<span class="youare">You are here</span>`:""}<span class="ln">Level ${i+1} · ${a}/${b}</span><span class="nm">${esc(L.name)}</span><span class="dy">${esc(L.days)}</span></button>`}).join("")}
function nextTopic(k){const S=SYL[k];for(let i=0;i<S.levels.length;i++)for(let j=0;j<S.levels[i].modules.length;j++)for(const t of S.levels[i].modules[j].topics){const id=tk(k,split(t)[0]);if(!done[id])return {L:i,M:j,id}}return null}
// Open one module (closing the others) and scroll to it, or to one topic inside it.
function openModule(L,M,topicId){const d=document.getElementById(`m-${L}-${M}`)||document.querySelector(`#lv-${L} details.mod`);if(!d)return false;
 document.querySelectorAll("#levels details.mod[open]").forEach(o=>{if(o!==d)o.open=false});d.open=true;
 let el=d;if(topicId){const li=[...d.querySelectorAll("li.topic")].find(x=>x.dataset.tid===topicId);if(li){el=li;li.classList.add("flash");setTimeout(()=>li.classList.remove("flash"),2200)}}
 requestAnimationFrame(()=>scrollToEl(el));return true}
// Practice questions (no answers): plain text, or [text, link] that opens the problem on an outside site.
function qItem(q){if(Array.isArray(q)){const [t,u]=q;if(/^https:\/\//i.test(u||""))return `<li><a href="${U(u)}" data-ext="1" target="_blank" rel="noopener noreferrer">${esc(t)} <span aria-hidden="true">↗</span></a> <span class="qhost">solve on ${esc(host(u))}</span></li>`;return `<li>${esc(t)}</li>`}return `<li>${esc(q)}</li>`}
function qOwn(o,key){return o&&typeof o==="object"&&Object.prototype.hasOwnProperty.call(o,key)?o[key]:null}
function topicQs(k,name){const c=qOwn(QB,k),L=c&&qOwn(c.topics,name);if(!Array.isArray(L)||!L.length)return "";
 return `<details class="tq"><summary>Practice questions (${L.length})</summary><ol class="qlist">${L.map(qItem).join("")}</ol><p class="qnote">Try each one yourself first. Links open the problem on a free practice site.</p></details>`}
function courseQs(k){const c=qOwn(QB,k);if(!c)return {html:"",n:0};const arr=x=>Array.isArray(x)?x:[];const F=arr(c.full),PG=arr(c.prog),TK=arr(c.tasks),tp=c.topics&&typeof c.topics==="object"?c.topics:{};
 let tn=0;for(const t of Object.keys(tp))if(Array.isArray(tp[t]))tn+=tp[t].length;
 if(!F.length&&!PG.length&&!TK.length)return {html:"",n:0};
 const sec=(id,title,sub,L)=>L.length?`<section class="block" id="${id}"><h3 class="sec">${title} <span class="qcount">${L.length}</span></h3><p class="sub">${sub}</p><ol class="qlist big">${L.map(qItem).join("")}</ol></section>`:"";
 let h=`<nav class="qjump" aria-label="Jump to">${[["iq-prog","Programs",PG],["iq-tasks","Practical tasks",TK],["iq-full","Questions",F]].filter(x=>x[2].length).map(([id,l,L])=>`<a class="ilink" href="#${esc(k)}:questions" data-jump="${id}">${l} · ${L.length}</a>`).join("")}</nav>`;
 h+=sec("iq-prog","Common interview programs","Programs and problems that interviewers often ask you to write for this course. Write each one yourself before you look anything up. Links open the problem on a free practice site where you can write and run your code.",PG);
 h+=sec("iq-tasks","Practical tasks asked in interviews","Hands-on tasks from real interviews and first jobs: debug this, design that, explain your work. Do them on your own machine or a free practice site.",TK);
 h+=sec("iq-full","Interview questions for the whole course","These mix topics from across the course, like a real interview. There are no answers on purpose: say or write your answer first, then check it with the course material.",F);
 if(tn)h+=`<p class="hint">Every topic in the Roadmap tab also has its own "Practice questions" list (${tn} questions in this course). Some programs here also appear there: the topic list is for learning, this tab is for revising everything before an interview.</p>`;
 if((CP[k]||[]).length)h+=`<section class="block"><h3 class="sec">Free practice sites</h3><p class="sub">Outside websites for extra practice. Each opens in a new tab after a short safety note.</p><div class="grid">${CP[k].map(siteCard).join("")}</div></section>`;
 return {html:h,n:F.length+PG.length+TK.length}}
function renderLevels(k){
 const S=SYL[k],qq=query.trim().toLowerCase(),box=document.getElementById("levels");let any=false;
 box.innerHTML=S.levels.map((L,i)=>{
  const mods=L.modules.map((m,j)=>{
   const tops=m.topics.map(split).filter(([a,b])=>!qq||(a+" "+b+" "+m.name).toLowerCase().includes(qq));
   if(!tops.length)return "";any=true;
   const md=m.topics.filter(t=>done[tk(k,split(t)[0])]).length;
   return `<details class="mod" id="m-${i}-${j}" ${qq?"open":""}><summary><span class="chev"></span><span class="mn">${esc(m.name)}</span><span class="cnt">${md}/${m.topics.length} topics</span></summary><div class="modbody">
   <div class="modres"><div class="course"><span class="rl">Free course</span><a href="${U(m.course[1])}" target="_blank" rel="noopener noreferrer">${esc(m.course[0])} →</a></div><div class="course"><span class="rl">Videos</span><span class="vids">${modVids(k,m)}</span></div>${k==="dsa"&&MODPAT[m.name]?`<div class="course"><span class="rl">Practise</span><span class="tlinks">${MODPAT[m.name].map(p=>{const i=planRows().findIndex(r=>r[0]===p),[a,b]=d3count(p);return i<0?"":`<a class="ilink" href="#dsa:problems:${i}">${esc(p)} · ${a}/${b} →</a>`}).join("")}</span></div>`:""}</div>
   <ul class="topics">${tops.map(([a,b])=>{const id=tk(k,a),on=!!done[id];return `<li class="topic ${on?"done":""}" data-tid="${esc(id)}"><input type="checkbox" aria-label="Done: ${esc(a)}" data-id="${esc(id)}" ${on?"checked":""}><div><div class="tname">${esc(a)}</div><div class="tdesc">${esc(b)}</div>${(TOPL[id]||[]).length?`<div class="tlinks">${TOPL[id].map(linkChip).join("")}</div>`:""}${topicQs(k,a)}</div>${(()=>{const tv=topicVids(k,a,m.name);return tv?`<div class="vids">${tv}</div>`:""})()}</li>`}).join("")}</ul></div></details>`}).join("");
  if(!mods)return "";const [a,b]=counts(k,L);
  return `<section class="level ${a===b?"full":""}" id="lv-${i}"><span class="pin"></span><div class="lv-head"><div class="ln">Level ${i+1} · ${esc(L.days)}</div><h3>${esc(L.name)}</h3><p>${esc(L.goal)}</p></div>${mods}</section>`}).join("");
 if(!any)box.innerHTML=`<div class="empty">No topic matches “${esc(query)}”. Try a shorter word.</div>`;
 markDead(box);
 // One module open at a time (search results stay open so all matches show).
 box.querySelectorAll("details.mod").forEach(d=>d.addEventListener("toggle",()=>{if(!d.open||query.trim())return;
  box.querySelectorAll("details.mod[open]").forEach(o=>{if(o!==d)o.open=false});
  const sm=d.querySelector("summary"),top=sm.getBoundingClientRect().top,nav=(document.getElementById("nav")||{}).offsetHeight||0;
  if(top<nav||top>innerHeight)sm.scrollIntoView({block:"start"}),scrollBy(0,-nav-8)}));
 box.querySelectorAll("input[type=checkbox]").forEach(cb=>cb.addEventListener("change",()=>{if(cb.checked)done[cb.dataset.id]=1;else delete done[cb.dataset.id];save();
  cb.closest("li").classList.toggle("done",cb.checked);refresh(k)}));
}
function refresh(k){const [d,n]=counts(k);document.getElementById("bar").style.width=(n?d/n*100:0)+"%";document.getElementById("ptext").textContent=`${d} of ${n} topics done`;
 const mp=document.querySelector(".map");if(mp)mp.innerHTML=mapStops(k);
 const cb=document.getElementById("cont");if(cb)cb.textContent=d?"Continue where you left off →":"Start the first topic →";
 SYL[k].levels.forEach((L,i)=>{const [a,b]=counts(k,L);const lv=document.getElementById("lv-"+i);if(lv)lv.classList.toggle("full",a===b)});
 const byName=new Map();SYL[k].levels.forEach(L=>L.modules.forEach(x=>byName.set(x.name,x)));
 document.querySelectorAll("#levels details.mod").forEach(dm=>{const m=byName.get(dm.querySelector(".mn").textContent);if(m){const md=m.topics.filter(t=>done[tk(k,split(t)[0])]).length;dm.querySelector(".cnt").textContent=`${md}/${m.topics.length} topics`}});
}
let plan="two";try{plan=localStorage.getItem("sti-plan")==="one"?"one":"two"}catch(e){}
// Phase progress = ticked topics of its courses (alternatives: the one in use) + ticked tasks.
function phaseProgress(pk,ph,i){let a=0,b=0;phaseCourses(ph).forEach(c=>{const [x,y]=pcounts(c,ph);a+=x;b+=y});ph.tasks.forEach((t,j)=>{b++;if(done[`job-${pk}::${i}::${j}`])a++});return [a,b]}
function renderProgram(pk){const P=PROGRAMS[pk],v=document.getElementById("view");v.style.setProperty("--c",P.color);
 const lv=new Map();P.phases.forEach(ph=>phaseCourses(ph).forEach(c=>{if(!lv.has(c))lv.set(c,new Set());partIdx(ph,c).forEach(i=>lv.get(c).add(i))}));
 const allC=[...lv.keys()];let td=0,tn=0;lv.forEach((s,c)=>s.forEach(i=>{const [a,b]=counts(c,SYL[c].levels[i]);td+=a;tn+=b}));
 const tasks=P.phases.flatMap((ph,i)=>ph.tasks.map((t,j)=>`job-${pk}::${i}::${j}`));const tdn=tasks.filter(t=>done[t]).length;
 const hrs=[...lv].reduce((a,[c,s])=>a+[...s].reduce((d,i)=>d+lvDays(SYL[c].levels[i]),0)*parseFloat(SYL[c].perDay)*(/min/.test(SYL[c].perDay)?1/60:1),0);
 const pp=P.phases.map((ph,i)=>phaseProgress(pk,ph,i)),here=pp.findIndex(([a,b])=>a<b);
 const card=(c,ph)=>{const S=SYL[c],[a,b]=pcounts(c,ph),g=altOf(ph,c),pt=isPart(ph,c),ix=partIdx(ph,c),f=ix[0]+1,nl=ix.length,last=S.levels[ix[nl-1]];
  return `<a class="pcourse" href="#${esc(c)}${pt?":"+(f-1):""}" style="--pc:${S.color}">${g?`<span class="palt">Choose one: ${g.map(x=>esc(SYL[x].short)).join(" or ")}</span>`:""}<span class="pct">${esc(S.name)}</span>${pt?`<span class="ppart">${nl>1?"Levels":"Level"} ${lvLabel(ix)} of ${S.levels.length}: ${esc(S.levels[f-1].name)}${nl>1?` → ${esc(last.name)}`:""}</span>`:""}<span class="pcm">${pdays(c,ph)} days · ${nl} level${nl>1?"s":""} · ${b} topics</span><span class="pbar"><i style="width:${b?a/b*100:0}%"></i></span><span class="pcm">${a}/${b} done · ${pt?`open level ${f}`:"open course"} →</span></a>`};
 const taskLinks=t=>{const ls=(TL[t]||[]).map(linkChip).filter(Boolean);return ls.length?`<div class="tlinks">${ls.join("")}</div>`:""};
 let h=`<div class="eyebrow">Job-oriented program · ${plan==="two"?"2-year plan":"1-year fast track"}</div><h2>${esc(P.name)}</h2>${dlButton("job",pk)}
 <div class="over"><div class="panel"><h3>The job</h3><p class="forwho" style="margin-top:0">${esc(P.role)}</p><p class="forwho"><b>Who it's for:</b> ${esc(P.forWho)}</p><p class="forwho"><b>Who hires:</b> ${esc(P.hires)}</p>${(P.branch||[]).length?`<p class="forwho"><b>Best for:</b> ${P.branch.map(b=>esc((BRANCHES.find(x=>x[0]===b)||[b,b])[1])).join(", ")} students</p>`:""}</div>
 <div class="panel"><div class="facts"><div class="fact"><b>${plan==="two"?"24":"12"}</b><span>months</span></div><div class="fact"><b>${allC.length}</b><span>linked courses</span></div><div class="fact"><b>~${Math.round(hrs/(plan==="two"?96:48))}</b><span>hours per week</span></div><div class="fact"><b>${tn}</b><span>topics</span></div></div>
 <div class="plantoggle" role="group" aria-label="Plan length"><button type="button" class="${plan==="two"?"":"ghost"}" data-plan="two">2-year plan (from 1st/2nd year)</button><button type="button" class="${plan==="one"?"":"ghost"}" data-plan="one">1-year fast track</button></div></div></div>
 ${FREE_NOTE}<div class="note">No course can honestly guarantee a job. Finish every phase and milestone and you will be ready for this role's online tests and interviews.</div>
 <h3 class="sec linehead" style="margin-top:22px">Your progress line</h3>
 <div class="mapwrap" aria-label="Phases and your progress"><div class="map">${P.phases.map((ph,i)=>{const [a,b]=pp[i],cls=a===b?"full":i===here?"here":a?"part":"";return `<button type="button" class="stop ${cls}" data-ph="${i}" aria-label="Phase ${i+1}: ${esc(ph.name)}, ${b?Math.round(a/b*100):0}% done${i===here?", you are here":""}"><span class="pin"></span>${i===here?`<span class="youare">You are here</span>`:""}<span class="ln">Phase ${i+1} · ${b?Math.round(a/b*100):0}%</span><span class="nm">${esc(ph.name)}</span><span class="dy">${esc(plan==="two"?ph.two:ph.one)}</span></button>`}).join("")}<button type="button" class="stop goal ${here<0?"full":""}" data-ph="end"><span class="pin"></span><span class="ln">Goal</span><span class="nm">Interview-ready</span><span class="dy">Placements</span></button></div></div>
 <div class="overall"><div class="bar"><i style="width:${tn+tasks.length?(td+tdn)/(tn+tasks.length)*100:0}%"></i></div><span>${td} of ${tn} course topics · ${tdn} of ${tasks.length} program tasks done</span></div>
 <div class="controw"><button type="button" id="contp">${here<0?"All phases done: go to interview practice →":here===0&&!pp[0][0]?"Start phase 1 →":`Continue: phase ${here+1} →`}</button><a class="ilink" href="#practice">Practice and interview hub →</a></div>
 <h3 class="sec" style="margin-top:22px">How the courses connect</h3>
 <div class="flowwrap"><ol class="flow">${P.phases.map((ph,i)=>`<li><span class="fwhen">${esc(plan==="two"?ph.two:ph.one)}</span><span class="fname">${i+1}. ${esc(ph.name)}</span><span class="fcs">${ph.courses.map(c=>{const ix=partIdx(ph,c),pt=isPart(ph,c);return `<a href="#${esc(c)}${pt?":"+ix[0]:""}" style="--pc:${SYL[c].color}">${esc(SYL[c].short)}${pt?` <small>L${lvLabel(ix)}</small>`:""}</a>`}).join("")}</span></li>`).join("")}<li class="fend"><span class="fwhen">Goal</span><span class="fname">Interview-ready</span><span class="fcs"><a href="#placement" style="--pc:${SYL.placement.color}">Placements</a></span></li></ol></div>
 <div id="phases">${P.phases.map((ph,i)=>`<section class="level ${pp[i][0]===pp[i][1]?"full":""}" id="ph-${i}"><span class="pin"></span><div class="lv-head"><div class="ln">Phase ${i+1} · ${esc(plan==="two"?ph.two:ph.one)} · ${pp[i][1]?Math.round(pp[i][0]/pp[i][1]*100):0}% done</div><h3>${esc(ph.name)}</h3></div>
  ${ph.pick?`<p class="pick">${esc(ph.pick)}</p>`:""}<div class="pcourses">${ph.courses.map(c=>card(c,ph)).join("")}</div>
  <h4 class="ptitle">Also do in this phase</h4><p class="hint">Tick a task when it is done. Use the links under it to open the matching course part or a practice site.</p><ul class="topics ptasks">${ph.tasks.map((t,j)=>{const id=`job-${pk}::${i}::${j}`;return `<li class="topic ${done[id]?"done":""}"><input type="checkbox" id="t-${i}-${j}" data-id="${esc(id)}" ${done[id]?"checked":""}><div><label class="tname" for="t-${i}-${j}">${esc(t)}</label>${taskLinks(t)}</div></li>`}).join("")}</ul>
  <div class="milestone"><b>Milestone:</b> ${esc(ph.milestone)}</div></section>`).join("")}</div>
 <section class="block"><h3 class="sec">Typical interview rounds for this role</h3><ol class="rounds">${P.interview.map(r=>`<li>${esc(r)}</li>`).join("")}</ol><p class="sub">Prepare for each round with the <a class="see" href="#placement">Placement Preparation</a> course and the <a class="see" href="#practice">Practice and interview hub</a>.</p></section>`;
 v.innerHTML=h;markDead(v);wireDownload();
 v.querySelectorAll("[data-plan]").forEach(b=>b.onclick=()=>{plan=b.dataset.plan==="one"?"one":"two";try{localStorage.setItem("sti-plan",plan)}catch(e){};renderProgram(pk)});
 v.querySelector(".mapwrap").onclick=e=>{const b=e.target.closest("[data-ph]");if(!b)return;scrollToEl(b.dataset.ph==="end"?v.querySelector(".rounds"):document.getElementById("ph-"+b.dataset.ph))};
 document.getElementById("contp").onclick=()=>{if(here<0){location.hash="practice";return}scrollToEl(document.getElementById("ph-"+here))};
 v.querySelectorAll(".ptasks input").forEach(cb=>cb.addEventListener("change",()=>{if(cb.checked)done[cb.dataset.id]=1;else delete done[cb.dataset.id];const yy=scrollY;save();renderProgram(pk);scrollTo(0,yy)}));}
// Practice and interview hub (#practice): internal question lists + outside practice sites behind the leave-site warning.
function renderPractice(){const v=document.getElementById("view");v.style.setProperty("--c","var(--l-place)");
 const list=(arr,ord)=>`<${ord?"ol":"ul"} class="qlist">${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</${ord?"ol":"ul"}>`;
 let h=`<div class="eyebrow">Interview preparation · for every job program</div><h2>Practice and interview hub</h2><p class="lead2">${esc(PR.intro||"")}</p>
 <nav class="prjump" aria-label="Sections">${PR.sections.map(s=>`<a class="ilink" href="#practice:${esc(s.id)}">${esc(s.title.split(":")[0])}</a>`).join("")}</nav>`;
 PR.sections.forEach(s=>{h+=`<section class="block prsec" id="pr-${esc(s.id)}"><h3 class="sec">${esc(s.title)}</h3><p class="sub">${esc(s.sub)}</p>`;
  if(s.plan)h+=dsaPlan(s.plan);
  if(s.routine)h+=`<h4 class="ptitle">Your weekly routine</h4>${list(s.routine)}`;
  if(s.concepts)h+=`<h4 class="ptitle">Concepts to learn first</h4>${list(s.concepts)}`;
  if(s.questions)h+=`<h4 class="ptitle">Practice questions (answer out loud, then check)</h4>${list(s.questions,true)}`;
  if(s.groups)s.groups.forEach(([g,qs])=>{h+=`<h4 class="ptitle">${esc(g)}</h4>${list(qs,true)}`});
  if((s.inside||[]).length)h+=`<h4 class="ptitle">On this site</h4><div class="tlinks">${s.inside.map(linkChip).join("")}</div>`;
  if((s.outside||[]).length)h+=`<h4 class="ptitle">Free outside sites</h4><div class="grid">${s.outside.map(siteCard).join("")}</div>`;
  h+=`</section>`});
 v.innerHTML=h;markDead(v);wireDsaPlan()}
// 300-problem plan: one row per pattern; open it to see its problems, tick them, open each on LeetCode.
const D3=(typeof DSA300!=="undefined"&&DSA300)||{};
// Cache the fixed 300-problem list once; reuse it for progress and backup checks.
const D3ALL=Object.values(D3).flat();
const d3id=slug=>"dsa300::"+slug;
const d3count=pat=>{const L=D3[pat]||[];return [L.filter(r=>done[d3id(r[0])]).length,L.length]};
function dsaPlan(plan){const all=D3ALL,dn=all.filter(r=>done[d3id(r[0])]).length;
 if(!all.length)return "";
 return `<div class="overall"><div class="bar"><i id="d3bar" style="width:${dn/all.length*100}%"></i></div><span id="d3txt">${dn} of ${all.length} problems solved</span></div>
 <p class="hint">Tap a pattern to see its problems. Tick each one when you solve it yourself. Problems open on LeetCode (free account; no Premium needed).</p>
 <div class="d3list">${plan.map(([pat],i)=>{const L=D3[pat]||[],[a,b]=d3count(pat),e=L.filter(r=>r[3]==="Easy").length,m=L.filter(r=>r[3]==="Medium").length,hd=b-e-m;
  return `<details class="d3pat" data-pat="${esc(pat)}"><summary><span class="chev"></span><span class="d3name">${esc(pat)}</span><span class="d3mix"><b class="dE">${e} easy</b> <b class="dM">${m} medium</b>${hd?` <b class="dH">${hd} hard</b>`:""}</span><span class="d3cnt">${a}/${b}</span></summary>
  <ol class="d3probs">${L.map(([slug,num,title,dif])=>{const id=d3id(slug),on=!!done[id];return `<li class="${on?"done":""}"><input type="checkbox" id="p-${esc(slug)}" data-id="${esc(id)}" ${on?"checked":""} aria-label="Solved: ${esc(title)}"><a class="d3title" href="https://leetcode.com/problems/${esc(slug)}/" data-ext="1" target="_blank" rel="noopener noreferrer" title="LeetCode problem ${num}">${esc(title)}</a><span class="d3dif d${esc(dif[0])}">${esc(dif)}</span><a class="d3vid" href="https://www.youtube.com/results?search_query=${encodeURIComponent("leetcode "+num+" "+title+" solution")}" target="_blank" rel="noopener noreferrer" title="Find a video solution on YouTube">▶ Solution</a></li>`}).join("")}</ol></details>`}).join("")}</div>`}
function wireDsaPlan(){const box=document.querySelector(".d3list");if(!box)return;
 box.addEventListener("change",e=>{const cb=e.target;if(!cb.matches||!cb.matches("input[data-id]"))return;
  if(cb.checked)done[cb.dataset.id]=1;else delete done[cb.dataset.id];save();cb.closest("li").classList.toggle("done",cb.checked);
  const d=cb.closest("details"),[a,b]=d3count(d.dataset.pat);d.querySelector(".d3cnt").textContent=`${a}/${b}`;
  const all=D3ALL,dn=all.filter(r=>done[d3id(r[0])]).length;document.getElementById("d3bar").style.width=dn/all.length*100+"%";document.getElementById("d3txt").textContent=`${dn} of ${all.length} problems solved`});
 box.querySelectorAll("details.d3pat").forEach(d=>d.addEventListener("toggle",()=>{if(!d.open)return;box.querySelectorAll("details.d3pat[open]").forEach(o=>{if(o!==d)o.open=false});
  const t=d.getBoundingClientRect().top,nav=(document.getElementById("nav")||{}).offsetHeight||0;if(t<nav)scrollToEl(d)}))}
// Save / load progress as a small file, to move it to another phone or browser. Nothing goes to any server.
// A loaded file only adds ticks the site knows (unknown or changed topics are skipped), and never removes any.
function knownIds(){const ids=new Set();ORDER.forEach(k=>SYL[k].levels.forEach(L=>L.modules.forEach(m=>m.topics.forEach(t=>ids.add(tk(k,split(t)[0]))))));
 PORDER.forEach(p=>PROGRAMS[p].phases.forEach((ph,i)=>ph.tasks.forEach((t,j)=>ids.add(`job-${p}::${i}::${j}`))));D3ALL.forEach(r=>ids.add("dsa300::"+r[0]));return ids}
function progressBox(){const box=document.getElementById("progio");if(!box)return;
 box.innerHTML=`<button type="button" class="ghost sm" id="psave" title="Download your ticks as a small file">Save progress</button><button type="button" class="ghost sm" id="popen" title="Open a progress file saved on another device">Load progress</button><input type="file" id="pload" accept=".json,application/json" hidden><span class="status" id="pst" aria-live="polite">Moves your ticks to another phone or browser.</span>`;
 document.getElementById("popen").onclick=()=>document.getElementById("pload").click();
 const st=document.getElementById("pst");
 document.getElementById("psave").onclick=()=>{const n=Object.keys(done).length;if(!n){st.textContent="Nothing ticked yet.";return}
  saveFile("skill-to-income-progress.json",JSON.stringify({site:"skill-to-income",version:1,saved:new Date().toISOString().slice(0,10),plan,progress:done}),"application/json")
   .then(r=>{st.textContent=r==="saved"?`Saved ${n} ticks. Open this file on your other device with "Load".`:r==="declined"?"Save cancelled.":"Saving files is not allowed here. Open the site in a normal browser tab."})};
 document.getElementById("pload").onchange=e=>{const f=e.target.files&&e.target.files[0];e.target.value="";if(!f)return;
  if(f.size>512*1024){st.textContent="That file is too big to be a progress file.";return}
  f.text().then(txt=>{const data=JSON.parse(txt);if(!data||data.site!=="skill-to-income"||typeof data.progress!=="object"||Array.isArray(data.progress))throw 0;
   const ids=knownIds();let added=0,skipped=0;Object.keys(data.progress).forEach(id=>{if(!data.progress[id])return;if(!ids.has(id)){skipped++;return}if(!done[id]){done[id]=1;added++}});
   if(data.plan==="one"||data.plan==="two"){plan=data.plan;try{localStorage.setItem("sti-plan",plan)}catch(x){}}
   save();route();st.textContent=`Loaded: ${added} new ${added===1?"tick":"ticks"} added${skipped?`, ${skipped} skipped (topics changed since you saved)`:""}.`})
  .catch(()=>{st.textContent="This is not a progress file from this site."})}}
// Address: #course | #course:L | #course:L:M | #course:tab | #job-x | #practice | #practice:section.
// Returns true when it scrolled to a target (so the page is not sent back to the top).
function route(){let raw="";try{raw=decodeURIComponent((location.hash||"").slice(1))}catch(e){raw=""}
 const m=/^([a-z0-9-]+)(?::([a-z0-9]+))?(?::(\d+))?$/.exec(raw)||[],key=m[1]||"",a=m[2],b=m[3];query="";ctab="roadmap";
 if(key==="practice"){nav("practice");renderPractice();const el=a&&document.getElementById("pr-"+a);if(el){scrollToEl(el);return true}return false}
 if(key.startsWith("job-")&&isProg(key.slice(4))){nav(key);renderProgram(key.slice(4));return false}
 if(!isCourse(key)){nav("job-sde");renderProgram("sde");return false}
 if(a&&CTABS.includes(a))ctab=a;
 nav(key);render(key);
 if(a&&/^\d+$/.test(a)&&SYL[key].levels[+a]){const L=+a,M=b&&SYL[key].levels[L].modules[+b]?+b:0;openModule(L,M);return true}
 if(ctab==="problems"&&b!==undefined){const d=document.querySelectorAll(".cpanel[data-cp=problems] details.d3pat")[+b];if(d){d.open=true;scrollToEl(d);return true}}
 if(ctab!=="roadmap"){scrollToEl(document.querySelector(".ctabs"));return true}
 return false}
// Copy protection (deterrent only: a public website can never be fully protected).
// Blocks right-click, copy/cut, drag, and Save / Print / View-source / Select-all shortcuts outside form fields.
(()=>{if(typeof document.addEventListener!=="function")return; // not in a browser (tools/check.js, links.js)
 const inField=e=>!!(e.target&&e.target.closest&&e.target.closest("input,textarea,select,[contenteditable]"));
 const stop=e=>{if(!inField(e)){e.preventDefault();return false}};
 ["contextmenu","copy","cut","dragstart","selectstart"].forEach(t=>document.addEventListener(t,stop));
 document.addEventListener("keydown",e=>{const k=(e.key||"").toLowerCase(),mod=e.ctrlKey||e.metaKey;
  if(mod&&["s","p","u"].includes(k)){e.preventDefault();return}
  if(mod&&["c","x","a"].includes(k)&&!inField(e))e.preventDefault()});
 addEventListener("beforeprint",()=>document.body.classList.add("noprint"))})();
{const fw=document.querySelector("footer .wrap");if(fw&&LS.checked){const b=Object.keys(LS.broken||{}),r=b.filter(u=>REPL(u)).length,n=b.length-r;fw.insertAdjacentHTML("beforeend",` Links last checked automatically on ${esc(LS.checked)}${r?`; ${r} removed video${r>1?"s":""} replaced with new one${r>1?"s":""}`:""}${n?`; ${n} not working, being replaced`:b.length?"":"; all working"}.`)}}
// Outside links marked data-ext open only after the leave-site warning (one listener for the whole page).
if(typeof document.addEventListener==="function"){document.addEventListener("click",e=>{const a=e.target.closest&&e.target.closest("a[data-ext]");if(!a||e.defaultPrevented||e.button>0)return;e.preventDefault();leaveSite(a.getAttribute("href"))});leaveDialog()}
addEventListener("hashchange",()=>{if(!route())scrollTo(0,0)});progressBox();route();
