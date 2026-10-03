const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the hardcoded arrays (lines 45 to 245)
// We will replace it with the dynamic fetch logic.
const arrayBlockStart = 'const erlangData1h = [';
const arrayBlockEnd = '];\n\nfunction Layout';

const startIdx = content.indexOf(arrayBlockStart);
let endIdx = content.indexOf(arrayBlockEnd);

if (startIdx !== -1 && endIdx !== -1) {
    // We want to delete everything between startIdx and endIdx
    const blockToRemove = content.substring(startIdx, endIdx + 2); // '];'
    
    const replacement = `let erlangData1h: any[] = [];
let erlangData6h: any[] = [];
let erlangData24h: any[] = [];
let mwData: any[] = [];
let signalingData: any[] = [];
let complaintsList: any[] = [];
let HIDDEN_PROBLEMS: any[] = [];
let globalDataLoaded = false;`;

    content = content.replace(blockToRemove, replacement);
}

// 2. Inject the data loading into App() component
const appDef = 'export default function App() {\n  const [checklists, setChecklists] = useState<string[]>([]);';
const newAppDef = `export default function App() {
  const [checklists, setChecklists] = useState<string[]>([]);
  const [dataLoaded, setDataLoaded] = useState(globalDataLoaded);

  useEffect(() => {
    if (globalDataLoaded) return;
    Promise.all([
      fetch('http://localhost:3001/api/data/complaints').then(r => r.json()),
      fetch('http://localhost:3001/api/data/hidden-problems').then(r => r.json()),
      fetch('http://localhost:3001/api/data/charts/erlang1h').then(r => r.json()),
      fetch('http://localhost:3001/api/data/charts/erlang6h').then(r => r.json()),
      fetch('http://localhost:3001/api/data/charts/erlang24h').then(r => r.json()),
      fetch('http://localhost:3001/api/data/charts/mw').then(r => r.json()),
      fetch('http://localhost:3001/api/data/charts/signaling').then(r => r.json())
    ]).then(([complaints, hidden, e1, e6, e24, mw, sig]) => {
      complaintsList = complaints;
      HIDDEN_PROBLEMS = hidden;
      erlangData1h = e1;
      erlangData6h = e6;
      erlangData24h = e24;
      mwData = mw;
      signalingData = sig;
      globalDataLoaded = true;
      setDataLoaded(true);
    }).catch(console.error);
  }, []);

  if (!dataLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary font-bold">Initializing Data from Backend...</div>;
  }`;

content = content.replace(appDef, newAppDef);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx updated successfully');
