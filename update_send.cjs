const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetMethod = `  const handleSendMessage = (textOverride?: string) => {
    const userMsg = textOverride || chatInput;
    if (!userMsg.trim() && !reference && !textOverride) return;

    const fullMsg = reference && !textOverride ? \`[Ref: \${reference}] \${userMsg}\` : userMsg;
    setMessages(prev => [...prev, { role: 'user', content: fullMsg }]);
    if (!textOverride) {
      setChatInput("");
      setReference(null);
    }
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (userMsg.includes("Generate User Feedback")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'translations',
          content: \`I have generated simple, customer-friendly notifications for affected users regarding this outage.\`
        }]);
      } else if (userMsg.includes("deep research")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'deep-research',
          content: \`I have pulled historical fault logs for the past 90 days and scanned adjacent sector behaviors.\`
        }]);
      } else if (userMsg.includes("Analyze behavior inside the")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'area-analysis',
          content: \`Scanning network behavior for all active sessions within that radius... \\n\\nI detect multiple correlated anomalies inside this geographic boundary matching the primary failure signature.\`
        }]);
      } else if (userMsg.includes("Analyze the specific Erlang congestion spike")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'time-analysis',
          content: \`I have extracted the core data points from the selected time window.\\n\\n**Finding:** The data reveals a sudden and massive correlation between the exact moment the hardware alarm triggered and the immediate drop in capacity. Because the physical user traffic volume remained high while the capacity shrank, the Blocking Probability exponentially skyrocketed.\`
        }]);
      } else if (userMsg.includes("Forwarded the generated translations")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Done. The draft has been queued directly into the Customer Care Zendesk portal for final approval and dispatch."
        }]);
      } else if (userMsg.includes("Dispatched the automated SMS")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Broadcast sent successfully via SMPP gateway. 1,420 users in the affected cell radius have received the notification."
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Action executed via NOC API. Real-time telemetry confirms the mitigation script has been deployed successfully. Traffic is normalizing."
        }]);
      }
    }, 1500);
  };`;

const replacementMethod = `  const handleSendMessage = (textOverride?: string) => {
    const userMsg = textOverride || chatInput;
    if (!userMsg.trim() && !reference && !textOverride) return;

    const fullMsg = reference && !textOverride ? \`[Ref: \${reference}] \${userMsg}\` : userMsg;
    setMessages(prev => [...prev, { role: 'user', content: fullMsg }]);
    if (!textOverride) {
      setChatInput("");
      setReference(null);
    }
    setIsTyping(true);

    fetch('http://localhost:3001/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, message: fullMsg, context: {} })
    })
    .then(res => res.json())
    .then(data => {
       setIsTyping(false);
       if (data.messages && data.messages.length > 0) {
          setMessages(prev => [...prev, ...data.messages]);
       }
    })
    .catch(err => {
       console.error(err);
       setIsTyping(false);
    });
  };`;

const cleanTarget = targetMethod.replace(/\r\n/g, '\n');
const cleanContent = content.replace(/\r\n/g, '\n');

if (cleanContent.includes(cleanTarget)) {
    const newContent = cleanContent.replace(cleanTarget, replacementMethod);
    fs.writeFileSync('src/App.tsx', newContent);
    console.log('Replaced handleSendMessage successfully');
} else {
    console.log('Target handleSendMessage not found');
}
