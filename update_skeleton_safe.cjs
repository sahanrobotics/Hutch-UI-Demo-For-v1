const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = '  const [messages, setMessages] = useState<any[]>([]);';
const newState = '  const [messages, setMessages] = useState<any[]>([]);\n  const [isChatLoading, setIsChatLoading] = useState(true);';
content = content.replace(targetState, newState);

const targetEffect = `  useEffect(() => {
    fetch(\`http://localhost:3001/api/chat/init/\${id}\`)
      .then(res => res.json())
      .then(data => {
         if (data.messages) {
            setMessages(data.messages);
         }
      })
      .catch(err => console.error('Failed to init chat', err));
  }, [id, complaint]);`;

const newEffect = `  useEffect(() => {
    setIsChatLoading(true);
    fetch(\`http://localhost:3001/api/chat/init/\${id}\`)
      .then(res => res.json())
      .then(data => {
         if (data.messages) {
            setMessages(data.messages);
         }
         setIsChatLoading(false);
      })
      .catch(err => {
         console.error('Failed to init chat', err);
         setIsChatLoading(false);
      });
  }, [id, complaint]);`;

// Be careful with Windows newlines
const cleanTargetEffect = targetEffect.replace(/\r\n/g, '\n');
const cleanContent = content.replace(/\r\n/g, '\n');

content = cleanContent.replace(cleanTargetEffect, newEffect);

const targetRender = `        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="bg-background text-muted-foreground shadow-sm">Today, {complaint.time}</Badge>
        </div>

        {messages.map((msg, i) => (`;

const newRender = `        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="bg-background text-muted-foreground shadow-sm">Today, {complaint.time}</Badge>
        </div>

        {isChatLoading ? (
          <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto animate-pulse">
            <div className="flex items-center gap-2 mb-2 pl-1">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shadow-md"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </div>
            <div className="bg-muted/30 border border-border/50 px-5 py-4 rounded-3xl rounded-tl-sm shadow-sm max-w-[90%] ml-11 space-y-3">
              <div className="h-3 w-[80%] bg-muted rounded"></div>
              <div className="h-3 w-[95%] bg-muted rounded"></div>
              <div className="h-3 w-[60%] bg-muted rounded"></div>
            </div>
            <div className="mt-6 relative border-l border-border/50 ml-5 pl-10 space-y-8 pb-4">
               <div className="relative">
                 <div className="absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60"></div>
                 <div className="bg-card border border-border/60 shadow-sm rounded-xl h-48 w-full"></div>
               </div>
               <div className="relative">
                 <div className="absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60"></div>
                 <div className="bg-card border border-border/60 shadow-sm rounded-xl h-64 w-full"></div>
               </div>
            </div>
          </div>
        ) : messages.map((msg, i) => (`;

content = content.replace(targetRender, newRender);

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx skeleton updated successfully');
