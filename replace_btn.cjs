const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<Button variant=\"ghost\" size=\"icon\" className=\"rounded-full size-10\">
                      <ChevronRight className=\"size-6\" />
                    </Button>`;

const replacement = `<Button variant=\"default\" size=\"sm\" className=\"shadow-sm font-semibold rounded-full px-5 h-9 bg-primary hover:bg-primary/90 text-primary-foreground group-hover:scale-105 transition-all\" onClick={(e) => { e.stopPropagation(); navigate(\`/chat/\${prob.id}\`); }}>
                      <MessageSquare className=\"size-4 mr-2\" />
                      Start Chat with Agent
                    </Button>`;

// In case line endings differ
const cleanTarget = target.replace(/\r\n/g, '\n');
const cleanContent = content.replace(/\r\n/g, '\n');

if (cleanContent.includes(cleanTarget)) {
    const newContent = cleanContent.replace(cleanTarget, replacement);
    fs.writeFileSync('src/App.tsx', newContent);
    console.log('Replaced successfully');
} else {
    console.log('Target not found');
}
