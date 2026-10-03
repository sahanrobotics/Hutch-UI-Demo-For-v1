const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetUseEffect = `  useEffect(() => {
    if (id === 'c-1001') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-power',
        content: \`I have intercepted a high-priority SMS complaint from **\${complaint?.userId}** for **Total Signal Loss** in **Gampola South**. I have proactively analyzed the network data and alarms for this location.\`
      }]);
    } else if (id === 'c-1002') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-deep',
        content: \`CRITICAL: User **\${complaint?.userId}** reported **Intermittent Call Drops & Slow Data** via the Mobile App. Triangulated with 14 other hidden network anomalies in **Kandy City Center**. \\n\\nI have run a **deep multi-layer RF and Erlang Capacity analysis**. Here is the detailed step-by-step breakdown:\`
      }]);
    } else if (id === 'c-1003') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-backhaul',
        content: \`I have intercepted a complaint from **\${complaint?.userId}** reporting **Extremely Slow 4G Data (High Latency)** in **Nuwara Eliya Town**. \\n\\nI initiated a cross-domain correlation between RAN metrics, Backhaul Microwave links, and Weather APIs. Here is the root cause analysis:\`
      }]);
    } else if (id === 'c-1004') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-core',
        content: \`URGENT NOC ALERT: A massive spike of **"Emergency Calls Only"** incidents just triggered at **Peradeniya University**. Over 800+ users are failing to latch to the network. \\n\\nI have traced the signaling flow from the eNodeB all the way to the Core Network (EPC). Here is the immediate diagnosis:\`
      }]);
    } else if (id === 'h-1001') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: \`I have autonomously detected a pattern of **Silent RRC Connection Drops** in **Nuwara Eliya**. No user complaints were filed, but my telemetry sweeps identified a 14% increase in drop rates during night hours over the past week. \\n\\nI traced this to an automated power-saving feature aggressively shutting down carriers. I recommend re-tuning the threshold.\`
      }]);
    } else if (id === 'h-1002') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: \`A **Creeping Intercell Interference** issue in **Colombo Port** has been flagged. This is a monthly hidden trend. Over the last 30 days, average SINR has degraded by 4dB. \\n\\nAnalysis of propagation delay and timing advance indicates a newly constructed high-rise is causing severe signal reflection. Remote electrical tilt (RET) adjustment is required.\`
      }]);
    } else if (id === 'h-1003') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: \`I have identified a yearly recurring anomaly: **Seasonal Fiber Attenuation** in the **Kandy Hills** aggregation ring. \\n\\nBy correlating 3 years of performance data with weather APIs, I found that backhaul microwave links and certain exposed fiber joints suffer massive fading perfectly synced with the monsoon humidity cycles. Preventive maintenance is highly advised before next month.\`
      }]);
    } else if (id === 'h-1004') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: \`I detected a massive volume of **Ghost Handover Failures** near **Galle Fort**. Users are not dropping calls, but their phones are silently failing handovers and retrying up to 8 times before succeeding, draining UE batteries and congesting signaling links. \\n\\nThis weekly trend maps to a misconfigured X2 interface between eNodeB-GF1 and eNodeB-GF2.\`
      }]);
    } else if (id === 'h-1005') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: \`A **Dormant Core Bottleneck** was uncovered in the National Data Center. \\n\\nThis monthly anomaly shows the SGW (Serving Gateway) hitting 99% CPU capacity for micro-bursts of exactly 2 seconds every day at 8:00 PM. No alarms trigger because the duration is under the 5-minute NOC threshold. This indicates a massive automated IoT payload synchronization.\`
      }]);
    }
  }, [id, complaint?.userId]);`;

const replacementUseEffect = `  useEffect(() => {
    fetch(\`http://localhost:3001/api/chat/init/\${id}\`)
      .then(res => res.json())
      .then(data => {
         if (data.messages) {
            setMessages(data.messages);
         }
      })
      .catch(err => console.error('Failed to init chat', err));
  }, [id]);`;

const cleanTarget = targetUseEffect.replace(/\r\n/g, '\n');
const cleanContent = content.replace(/\r\n/g, '\n');

if (cleanContent.includes(cleanTarget)) {
    const newContent = cleanContent.replace(cleanTarget, replacementUseEffect);
    fs.writeFileSync('src/App.tsx', newContent);
    console.log('Replaced useEffect successfully');
} else {
    console.log('Target useEffect not found');
}
