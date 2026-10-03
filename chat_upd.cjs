const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regexMap = /{messages\.map\(\(m, i\) => \(\s*<div key={i} className={\`flex flex-col gap-1\.5 \${m\.role === 'user' \? 'items-end' : 'items-start'}\`}>\s*<div className={\`p-4 rounded-2xl text-\[14px\] leading-relaxed max-w-\[90%\] shadow-sm \${m\.role === 'user' \? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted\\/50 border border-border\\/50 text-foreground rounded-tl-sm'}\`}>\s*{m\.content}\s*<\/div>\s*<\/div>\s*\)\)}/g;

const replacementMap = `{messages.map((m, i) => (
              <div key={i} className={\`flex flex-col gap-2 \${m.role === 'user' ? 'items-end' : 'items-start'}\`}>
                <div className={\`p-4 rounded-2xl text-[14px] leading-relaxed max-w-[95%] shadow-sm \${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-sm'}\`}>
                  <div dangerouslySetInnerHTML={{ __html: m.content }} />
                  {m.table && (
                    <div className="mt-4 rounded-xl border border-border/80 bg-background overflow-hidden shadow-sm">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-muted/50 border-b border-border/50">
                          <tr>
                            {m.table.headers.map((h, hi) => <th key={hi} className="p-3 text-foreground font-semibold">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {m.table.rows.map((row, ri) => (
                            <tr key={ri} className="hover:bg-muted/20">
                              {row.map((cell, ci) => <td key={ci} className="p-3 text-muted-foreground">{cell}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {m.options && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.options.map((opt, oi) => (
                        <button key={oi} className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 text-[11px] px-3 py-1.5 rounded-full transition-colors font-semibold text-left" onClick={() => handleSendMessage(opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}`;

const regexHandler = /let reply = `I've analyzed that metric for you\. The data shows a 42% improvement week-over-week directly correlated to automated triaging\.`;[\s\S]*?setMessages\(prev => \[\.\.\.prev, { role: 'ai', content: reply }\]\);/;

const replacementHandler = `let replyMsg: any = { role: 'ai', content: "I've analyzed the network health. The overall stability score is 92%, but there are emerging anomalies.", options: ["Show top failing sectors", "Analyze Microwave links", "Compare with last week"] };
        
        if (userMsg.toLowerCase().includes("failing sectors") || userMsg.toLowerCase().includes("sectors")) {
           replyMsg.content = "Here are the top 3 worst performing sectors across the island right now based on RRC connection drops:";
           replyMsg.table = {
             headers: ["Sector ID", "Location", "Drop Rate", "Trend"],
             rows: [
               ["CMB-004-A", "Colombo 4", "12.4%", "🔴 Worsening"],
               ["KND-012-C", "Kandy Town", "9.8%", "🟡 Stable"],
               ["GAL-009-B", "Galle Fort", "8.1%", "🟢 Improving"]
             ]
           };
           replyMsg.options = ["Investigate CMB-004-A", "Show active alarms"];
        } else if (userMsg.toLowerCase().includes("investigate cmb")) {
           replyMsg.content = "Deep scan initiated for **CMB-004-A**.<br/><br/>Primary issue detected: **VSWR alarm active on Antenna Port 1**. The hardware is likely degraded or experiencing water ingress due to recent rain.<br/><br/>Recommended actions:";
           replyMsg.options = ["Create Field Ticket", "Mute Alarm temporarily"];
        } else if (userMsg.includes("Problem Frequency")) {
          replyMsg.content = "The highest frequency anomaly detected by the AI this week is **Hardware (VSWR/Cable)** issues, constituting nearly 30% of all alerts. This indicates a physical degradation pattern that manual teams are currently addressing.";
          replyMsg.options = ["Show VSWR trends", "List affected sites"];
        } else if (userMsg.includes("Most Affected Areas")) {
          replyMsg.content = "Kandy City Center has triggered **145 AI-based congestion warnings** this week, primarily due to intermittent hardware failure. I recommend prioritizing Field Rigging dispatches to this region.";
          replyMsg.options = ["Generate dispatch report"];
        }
        setMessages(prev => [...prev, replyMsg]);`;

content = content.replace(regexMap, replacementMap);
content = content.replace(regexHandler, replacementHandler);
fs.writeFileSync('src/App.tsx', content);
