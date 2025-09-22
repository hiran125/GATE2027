// script.js - 12-month GATE CS roadmap with filtering, mark-done, export
const LS_KEY = 'gate12_checks_v2';

// ==== DATA ==== //
const subjectsData = [
  {id:'math', title:'Engineering Mathematics', code:'MA', months:['month1','month2','month3'],
   topics:[
     'Discrete Math: Propositional logic, Predicates, Set theory',
     'Relations & Functions, Partial orders, Lattices',
     'Linear Algebra: Matrices, Determinants, Rank, Eigenvalues',
     'Calculus: Limits, Derivatives, Taylor Series, Multivariable',
     'Probability & Statistics: RVs, PDFs, Expectation, Variance',
     'Numerical Methods: Root finding, Interpolation, Numerical integration'
   ]},

  {id:'dl', title:'Digital Logic', code:'DL', months:['month1'],
   topics:[
     'Boolean Algebra, Logic simplification (K-map)',
     'Combinational circuits: adders, mux, encoder/decoder',
     'Sequential circuits: flip-flops, counters, FSM',
     'Number representations, Floating point basics',
     'Minimization: Quine–McCluskey method'
   ]},

  {id:'coa', title:'Computer Organization & Architecture', code:'COA', months:['month1','month2'],
   topics:[
     'Instruction sets, Addressing modes',
     'CPU microarchitecture, datapath & control',
     'Pipelining, hazards, forwarding, stall handling',
     'Memory hierarchy: cache design, associativity',
     'I/O: Interrupts, DMA, Bus architectures'
   ]},

  {id:'dsa', title:'Programming & Data Structures', code:'DSA', months:['month1','month2','month3','month4'],
   topics:[
     'C/C++ fundamentals: pointers, recursion, memory',
     'Arrays, Strings, Linked Lists',
     'Stacks, Queues, Heaps, Priority Queues',
     'Trees: BST, AVL, Segment Trees, B-trees',
     'Graphs: adjacency, BFS/DFS, shortest paths',
     'Hashing, Tries, Disjoint Set Union'
   ]},

  {id:'algo', title:'Algorithms', code:'ALGO', months:['month2','month3','month4'],
   topics:[
     'Asymptotic analysis, Recurrence relations, Master Theorem',
     'Sorting & Searching: Quick, Merge, Heap, Binary search',
     'Divide & Conquer, Greedy, Dynamic Programming',
     'Graph algorithms: Dijkstra, Bellman-Ford, MST',
     'String algorithms: KMP, Z-algo, Rolling hash',
     'NP, NP-Complete, Reductions (conceptual)'
   ]},

  {id:'os', title:'Operating Systems', code:'OS', months:['month3','month4','month5'],
   topics:[
     'Processes & Threads, CPU Scheduling algorithms',
     'Concurrency: Mutex, Semaphore, Monitors, Locks',
     'Deadlock: detection, prevention, Bankers algorithm',
     'Memory Management: paging, segmentation, virtual memory',
     'File systems, Disk scheduling, I/O buffering'
   ]},

  {id:'db', title:'Databases', code:'DB', months:['month4','month5','month6'],
   topics:[
     'ER model & Relational model fundamentals',
     'Relational algebra, SQL queries, Joins, Subqueries',
     'Normalization: 1NF–BCNF, anomalies',
     'Indexing: B+ tree, Hashing, Query optimization basics',
     'Transactions: ACID properties, Concurrency control'
   ]},

  {id:'cn', title:'Computer Networks', code:'CN', months:['month5','month6','month7'],
   topics:[
     'Layered models: OSI & TCP/IP stacks',
     'Data link layer: framing, CRC, ARP, switches',
     'Network layer: IP addressing, routing algorithms',
     'Transport layer: UDP, TCP, congestion & flow control',
     'Application layer: DNS, HTTP, SMTP, sockets'
   ]},

  {id:'toc', title:'Theory of Computation', code:'TOC', months:['month2','month3','month8'],
   topics:[
     'Regular languages: DFA, NFA, regex, pumping lemma',
     'Context-free languages: CFG, PDA, parse trees',
     'Turing machines, Decidability, Halting problem',
     'Complexity: P, NP, NP-Complete, reductions'
   ]},

  {id:'cd', title:'Compiler Design', code:'CD', months:['month6','month9'],
   topics:[
     'Lexical analysis, tokenization, regular grammars',
     'Parsing: top-down (LL), bottom-up (LR), parse trees',
     'Syntax-directed translation and semantic analysis',
     'Intermediate code generation, basic optimizations',
     'Code generation & register allocation'
   ]},

  {id:'se', title:'Software Engineering', code:'SE', months:['month9','month10'],
   topics:[
     'Software process models: Waterfall, Agile, Spiral, V-Model',
     'Requirement engineering & SRS documents',
     'Design: UML, Design patterns, modularity',
     'Testing: unit, integration, system, test planning',
     'Project management basics, metrics, risk analysis'
   ]},

  {id:'ml', title:'Machine Learning Basics', code:'ML', months:['month10','month11','month12'],
   topics:[
     'Supervised learning: Regression, Classification basics',
     'Loss functions, evaluation metrics, cross-validation',
     'Basic algorithms: Linear regression, Logistic, kNN',
     'Overfitting/underfitting, regularization techniques',
     'Basic Neural Nets intro (intuition) and applications'
   ]},

  {id:'ga', title:'General Aptitude', code:'GA', months:['month11','month12'],
   topics:[
     'Numerical ability: percentages, ratios, mixture, time-speed-distance',
     'Probability & combinatorics basics',
     'Verbal ability: grammar, sentence correction, vocabulary',
     'Logical reasoning, puzzles and data interpretation'
   ]}
];

// ==== HELPERS ==== //
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

// ==== INIT ==== //
function init(){
  buildSubjectSelect();
  buildSidebarList();
  renderCards();
  attachHandlers();
  restoreState();
  applyFilters();
}

// ==== UI BUILD ==== //
function buildSubjectSelect(){
  const sel = $('#subjectSelect');
  subjectsData.forEach(s=>{
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.title;
    sel.appendChild(opt);
  });
}

function buildSidebarList(){
  const list = $('#subjectList');
  list.innerHTML = '';
  subjectsData.forEach(s=>{
    const div = document.createElement('div');
    div.className = 'subject-item';
    div.dataset.id = s.id;
    div.innerHTML = `
      <div class="code">${s.code}</div>
      <div style="flex:1">
        <div class="title">${s.title}</div>
        <div class="months">${s.months.map(m=>m.replace('month','M')).join(', ')}</div>
      </div>
      <div><input type="checkbox" class="sid-chk" data-id="${s.id}"></div>
    `;
    div.addEventListener('click', (e)=>{
      if(e.target.tagName.toLowerCase()==='input') return;
      const card = document.getElementById('card-'+s.id);
      if(card) card.scrollIntoView({behavior:'smooth'});
      $$('.subject-item').forEach(it=>it.classList.remove('selected'));
      div.classList.add('selected');
      $('#subjectSelect').value = s.id;
      $('#pageTitle').textContent = s.title;
    });
    list.appendChild(div);
  });
}

function renderCards(){
  const area = $('#cardsArea');
  area.innerHTML = '';
  subjectsData.forEach(s=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.id = 'card-'+s.id;
    card.dataset.months = s.months.join(',');
    card.innerHTML = `
      <div class="head">
        <h3>${s.title}</h3>
        <div class="meta">${s.code} • Months: ${s.months.map(m=>m.replace('month','M')).join(', ')}</div>
      </div>
      <div class="card-actions">
        <button class="btn-select" data-id="${s.id}">Select all</button>
        <button class="btn-clear" data-id="${s.id}">Clear</button>
        <button class="btn-print" data-id="${s.id}">Print</button>
        <button class="btn-png" data-id="${s.id}">PNG</button>
        <button class="btn-pdf" data-id="${s.id}">PDF</button>
      </div>
      <ul class="topics">
        ${s.topics.map((t,i)=>`
          <li class="topic-row">
            <input type="checkbox" id="${s.id}-chk-${i}" data-sub="${s.id}" data-idx="${i}">
            <label for="${s.id}-chk-${i}">${t}</label>
          </li>
        `).join('')}
      </ul>
    `;
    area.appendChild(card);
  });
}

// ==== EVENTS ==== //
function attachHandlers(){
  $('#monthSelect').addEventListener('change', applyFilters);
  $('#subjectSelect').addEventListener('change', ()=>{
    applyFilters();
    const val = $('#subjectSelect').value;
    if(val!=='all'){
      document.getElementById('card-'+val).scrollIntoView({behavior:'smooth'});
      $('#pageTitle').textContent = subjectsData.find(s=>s.id===val).title;
    } else {
      $('#pageTitle').textContent = '12-Month GATE CS Roadmap';
    }
  });

  $('#searchBox').addEventListener('input',(e)=>applySearch(e.target.value.toLowerCase()));

  $('#selectAllSubjects').addEventListener('click',()=>$$('.sid-chk').forEach(c=>c.checked=true));
  $('#clearAllSubjects').addEventListener('click',()=>$$('.sid-chk').forEach(c=>c.checked=false));

  $('#printAll').addEventListener('click', async()=>await printElement($('#cardsArea')));
  $('#downloadPNGAll').addEventListener('click', async()=>await downloadElementAsPNG($('#cardsArea'),'GATE_All'));
  $('#downloadPDFAll').addEventListener('click', async()=>await downloadElementAsPDF($('#cardsArea'),'GATE_All'));

  document.body.addEventListener('click', async(e)=>{
    const t = e.target;
    if(t.matches('.btn-select')){
      const id=t.dataset.id;
      $(`#card-${id}`).querySelectorAll('input[type="checkbox"]').forEach(i=>{i.checked=true;markRow(i)});
      saveState();
    }
    if(t.matches('.btn-clear')){
      const id=t.dataset.id;
      $(`#card-${id}`).querySelectorAll('input[type="checkbox"]').forEach(i=>{i.checked=false;markRow(i)});
      saveState();
    }
    if(t.matches('.btn-print')) await printElement(document.getElementById('card-'+t.dataset.id));
    if(t.matches('.btn-png')) await downloadElementAsPNG(document.getElementById('card-'+t.dataset.id),'GATE_'+t.dataset.id);
    if(t.matches('.btn-pdf')) await downloadElementAsPDF(document.getElementById('card-'+t.dataset.id),'GATE_'+t.dataset.id);
  });

  document.body.addEventListener('change',(e)=>{
    if(e.target.matches('input[type="checkbox"][data-idx]')){
      markRow(e.target);
      saveState();
    }
  });
}

// ==== FILTERS ==== //
function applyFilters(){
  const m=$('#monthSelect').value, s=$('#subjectSelect').value;
  $$('.card').forEach(c=>{
    const okM=(m==='all')||c.dataset.months.includes(m);
    const okS=(s==='all')||c.id==='card-'+s;
    c.style.display=(okM&&okS)?'block':'none';
  });
}

function applySearch(q){
  if(!q){applyFilters();return;}
  $$('.card').forEach(c=>{
    const txt=c.textContent.toLowerCase();
    c.style.display=txt.includes(q)?'block':'none';
  });
}

// ==== STATE ==== //
function markRow(chk){
  chk.closest('.topic-row').classList.toggle('done',chk.checked);
}

function saveState(){
  const state={};
  subjectsData.forEach(s=>{
    const checked=$$(`#card-${s.id} input[type="checkbox"]`).map(i=>i.checked?+i.dataset.idx:null).filter(x=>x!==null);
    if(checked.length) state[s.id]=checked;
  });
  localStorage.setItem(LS_KEY,JSON.stringify(state));
}

function restoreState(){
  const raw=localStorage.getItem(LS_KEY); if(!raw) return;
  let state={}; try{state=JSON.parse(raw)}catch(e){};
  Object.keys(state).forEach(sub=>{
    (state[sub]||[]).forEach(idx=>{
      const chk=document.querySelector(`#card-${sub} input[data-idx="${idx}"]`);
      if(chk){chk.checked=true;markRow(chk);}
    });
  });
}

// ==== EXPORT ==== //
async function downloadElementAsPNG(ele, filename){
  const canvas=await html2canvas(ele,{scale:2,useCORS:true});
  const link=document.createElement('a');
  link.download=filename+'.png';
  link.href=canvas.toDataURL('image/png');
  link.click();
}

async function downloadElementAsPDF(ele, filename){
  const {jsPDF}=window.jspdf;
  const canvas=await html2canvas(ele,{scale:2,useCORS:true});
  const img=canvas.toDataURL('image/png');
  const pdf=new jsPDF({orientation:'portrait',unit:'px',format:[canvas.width,canvas.height]});
  pdf.addImage(img,'PNG',0,0,canvas.width,canvas.height);
  pdf.save(filename+'.pdf');
}

async function printElement(ele){
  const w=window.open('','_blank','width=900,height=700');
  w.document.write('<html><head><title>Print</title></head><body>');
  w.document.body.appendChild(ele.cloneNode(true));
  w.document.write('</body></html>');
  w.document.close();
  setTimeout(()=>{w.print();w.close();},400);
}

// ==== DOM READY ==== //
document.addEventListener('DOMContentLoaded',init);
