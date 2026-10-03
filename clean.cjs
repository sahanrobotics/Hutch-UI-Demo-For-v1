const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Strip out glow shadows
content = content.replace(/shadow-\[0_0_.*?\]/g, 'shadow-sm');

// Strip out colored card backgrounds
content = content.replace(/bg-(orange|blue|cyan|indigo|emerald|purple|red)-500\/(5|10|15|20)/g, 'bg-background');

// Standardize card borders
content = content.replace(/border-(orange|blue|cyan|indigo|emerald|purple|red)-500\/(20|30|40|50|60)/g, 'border-border/50');

// Clean up the left step indicator circles
content = content.replace(/absolute -left-\[61px\] top-1 size-10 rounded-full bg-background border-\[3px\] border-[a-z]+-500 text-[a-z]+-500 flex items-center justify-center font-black text-lg shadow-sm/g, 'absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground shadow-sm');
content = content.replace(/absolute -left-\[61px\] top-1 size-10 rounded-full bg-orange-500 border-\[3px\] border-orange-500 text-white flex items-center justify-center font-black text-lg shadow-sm/g, 'absolute -left-[53px] top-1.5 size-6 rounded-full bg-primary border-none flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm');
content = content.replace(/absolute -left-\[61px\] top-1 size-10 rounded-full bg-background border-\[3px\] border-emerald-500 text-emerald-500 flex items-center justify-center shadow-sm/g, 'absolute -left-[53px] top-1.5 size-6 rounded-full bg-muted border border-border/60 flex items-center justify-center text-xs text-muted-foreground shadow-sm');

// Remove extra rings
content = content.replace(/ring-1 ring-[^\s\"]+/g, '');

// Clean Card components
content = content.replace(/<Card className=\"bg-background border-border\/60 shadow-sm hover:border-[a-z]+-500\/50 transition-colors\"/g, '<Card className=\"bg-card border-border/50 shadow-sm\"');
content = content.replace(/<Card className=\"bg-background border-border\/50 shadow-sm hover:border-[a-z]+-500\/60 transition-colors\"/g, '<Card className=\"bg-card border-border/50 shadow-sm\"');
content = content.replace(/<Card className=\"bg-background border-border\/50 shadow-sm hover:border-primary\/60 transition-colors\"/g, '<Card className=\"bg-card border-border/50 shadow-sm\"');

// Update timeline line
content = content.replace(/mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4/g, 'mt-6 relative border-l border-border/50 ml-5 pl-10 space-y-8 pb-4');

// Remove bright text from CardTitles
content = content.replace(/<CardTitle className=\"text-lg flex items-center\"><([a-zA-Z]+) className=\"size-5 mr-2 text-[a-z]+-500\" \/>/g, '<CardTitle className=\"text-lg flex items-center text-foreground\"><$1 className=\"size-4 mr-2 text-muted-foreground\" />');
content = content.replace(/<CardTitle className=\"text-xl flex items-center text-[a-z]+-500\"><([a-zA-Z]+) className=\"size-6 mr-2\" \/>/g, '<CardTitle className=\"text-lg flex items-center text-foreground\"><$1 className=\"size-4 mr-2 text-muted-foreground\" />');

// Remove Badges
content = content.replace(/<Badge variant=\"outline\" className=\"mb-2 text-\[10px\] uppercase tracking-wider text-[a-z]+-500 border-[a-z]+-500\/30 font-bold bg-[a-z]+-500\/5\">.*?<\/Badge>/g, '');
content = content.replace(/<Badge className=\"mb-2 text-\[10px\] uppercase tracking-wider bg-[a-z]+-500 text-white hover:bg-[a-z]+-600 shadow-sm\">.*?<\/Badge>/g, '');

fs.writeFileSync('src/App.tsx', content);
