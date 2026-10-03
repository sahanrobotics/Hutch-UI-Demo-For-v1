const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Wrap the bot text in a chat bubble
content = content.replace(/<div className=\"text-\[15px\] w-full text-card-foreground pl-11\">\s*<div dangerouslySetInnerHTML={{ __html: msg\.content\.replace\(\/\\\*\\\*\(.*?\)\\\*\\\*\/g, \'<strong class=\"text-foreground\">\$1<\/strong>\'\) }} className=\"leading-relaxed text-muted-foreground whitespace-pre-wrap text-\[15px\]\" \/>/g, `<div className="text-[15px] w-full text-card-foreground flex flex-col items-start pl-11">
                <div className="bg-muted/30 border border-border/50 text-foreground px-5 py-3 rounded-3xl rounded-tl-sm text-[15px] shadow-sm max-w-[90%]">
                  <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground whitespace-pre-wrap text-[15px]" />
                </div>`);

// Make sure the latent anomaly description is also wrapped
content = content.replace(/<p dangerouslySetInnerHTML={{ __html: msg\.content\.replace\(\/\\\*\\\*\(.*?\)\\\*\\\*\/g, \'<strong class=\"text-foreground\">\$1<\/strong>\'\) }} className=\"leading-relaxed text-muted-foreground text-\[15px\] whitespace-pre-wrap\" \/>/g, `<div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground whitespace-pre-wrap text-[15px]" />`);

// Standardize ALL numeric circles
content = content.replace(/absolute -left-\[61px\] top-1 size-10 rounded-full bg-background border-\[3px\] border-([a-zA-Z]+)-500 text-\1-500 flex items-center justify-center font-black text-lg shadow-sm/g, 'absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm');
content = content.replace(/absolute -left-\[61px\] top-1 size-10 rounded-full bg-background border-\[3px\] border-primary text-primary flex items-center justify-center font-black text-lg shadow-sm/g, 'absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm');


fs.writeFileSync('src/App.tsx', content);
