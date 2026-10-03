const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the parent container padding
content = content.replace(/<div className=\"text-\[15px\] w-full text-card-foreground flex flex-col items-start pl-11\">/g, '<div className=\"text-[15px] w-full text-card-foreground flex flex-col items-start\">');

// Add margin to the chat bubble
content = content.replace(/<div className=\"bg-muted\/30 border border-border\/50 text-foreground px-5 py-3 rounded-3xl rounded-tl-sm text-\[15px\] shadow-sm max-w-\[90\%\]\">/g, '<div className=\"bg-muted/30 border border-border/50 text-foreground px-5 py-3 rounded-3xl rounded-tl-sm text-[15px] shadow-sm max-w-[90%] ml-11\">');

fs.writeFileSync('src/App.tsx', content);
