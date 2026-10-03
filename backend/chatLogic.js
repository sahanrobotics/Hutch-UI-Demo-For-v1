// Data Schema & Logic for Chat System

// This acts as a database/store for the chat definitions
const chatConfigs = {
  'c-1002': { // Intermittent Call Drops (KANDY)
    initial: {
      role: 'ai',
      type: 'initial-analysis-deep', // Kept for backwards compatibility if needed, but we use schema now
      content: 'CRITICAL: User reported **Intermittent Call Drops & Slow Data** via the Mobile App. Triangulated with 14 other hidden network anomalies in **Kandy City Center**. \n\nI have run a **deep multi-layer RF and Erlang Capacity analysis**. Here is the detailed step-by-step breakdown:',
      steps: [
        {
          stepNumber: 1,
          topic: 'Topic: Spatial Triangulation',
          topicColor: 'blue',
          color: 'primary',
          title: 'Interactive GIS Coverage Map',
          icon: 'Map',
          description: 'Mapped user coordinates via App triangulation. Latched to <strong class=\"text-foreground\">Kandy-1_G1-091</strong> (Sector 1).',
          widget: {
            type: 'map',
            center: [7.2906, 80.6337],
            towers: [
              { id: 'Kandy-1_G1-091', pos: [7.2970, 80.6360], status: 'Congested (VSWR)', reason: 'Capacity: 52/60', color: '#ef4444' },
              { id: 'Kandy-1_G2-092', pos: [7.2830, 80.6250], status: 'Optimal', reason: 'Load: 40%', color: '#3b82f6' }
            ],
            userPos: [7.2906, 80.6337],
            userLabel: 'User (KCC)'
          }
        },
        {
          stepNumber: 2,
          topic: 'Topic: RF Diagnostics',
          topicColor: 'orange',
          color: 'muted',
          title: 'Air Interface & Signaling Logs',
          icon: 'Radio',
          description: 'Extracted real-time eNodeB logs. The RF conditions are extremely poor. The sector is overwhelmed.',
          widget: {
            type: 'rf-table',
            data: [
              { metric: 'RSRP', val: '-112 dBm', stat: 'Critical', col: 'text-red-500' },
              { metric: 'SINR', val: '2 dB', stat: 'Poor', col: 'text-orange-500' },
              { metric: 'RRC Drops', val: '14', stat: 'High', col: 'text-red-500' },
              { metric: 'CQI', val: '4', stat: 'Poor', col: 'text-orange-500' }
            ]
          }
        },
        {
          stepNumber: 3,
          topic: 'Topic: Erlang & Traffic Analysis',
          topicColor: 'emerald',
          color: 'muted',
          title: 'Live Core Telemetry & Capacity',
          icon: 'Activity',
          description: 'Live interactive telemetry from the eNodeB baseband unit. Notice the massive spike in Active Users (PRB utilization at 98%).',
          widget: { type: 'chart-telemetry' }
        },
        {
          stepNumber: 4,
          topic: 'Topic: AI Synthesis',
          topicColor: 'primary',
          color: 'muted',
          title: 'Root Cause & Action Plan',
          icon: 'Brain',
          description: '',
          widget: {
            type: 'synthesis',
            rootCause: 'The sector <strong class=\"text-foreground\">Kandy-1_G1-091</strong> is experiencing severe capacity congestion due to an ongoing localized event (Esala Perahera crowd). The interference is causing RRC drops.',
            actions: [
              { text: 'Soft-lock Sector 1 and offload edge users to Kandy-1_G2-092 via MLB (Mobility Load Balancing).' },
              { text: 'Increase Remote Electrical Tilt (RET) by 2 degrees to shrink the cell footprint.' },
              { text: 'Dispatch a temporary COW (Cell on Wheels) for tomorrow.' }
            ]
          }
        }
      ]
    }
  },
  'h-1001': { // Hidden Anomaly 
    initial: {
      role: 'ai',
      type: 'initial-analysis-hidden',
      content: 'I have autonomously detected a pattern of **Silent RRC Connection Drops** in **Nuwara Eliya**. No user complaints were filed, but my telemetry sweeps identified a 14% increase in drop rates during night hours over the past week. \n\nI traced this to an automated power-saving feature aggressively shutting down carriers. I recommend re-tuning the threshold.',
      options: ['Tune threshold automatically', 'Review power saving logs']
    }
  },
  'c-1003': { // Backhaul Issue (Nuwara Eliya)
    initial: {
      role: 'ai',
      type: 'initial-analysis-backhaul',
      content: 'I have intercepted a complaint reporting **Extremely Slow 4G Data (High Latency)** in **Nuwara Eliya Town**. \n\nI initiated a cross-domain correlation between RAN metrics, Backhaul Microwave links, and Weather APIs. Here is the root cause analysis:',
      steps: [
        {
          stepNumber: 1,
          topic: 'Topic: Backhaul Transmission',
          topicColor: 'blue',
          color: 'primary',
          title: 'Microwave Link Telemetry',
          icon: 'Radio',
          description: 'Monitoring the 15GHz microwave link connecting Nuwara Eliya Hub to the Core. Massive fading and packet loss detected.',
          widget: { type: 'chart-microwave' }
        },
        {
          stepNumber: 2,
          topic: 'Topic: Environmental API',
          topicColor: 'cyan',
          color: 'muted',
          title: 'Weather Impact Analysis',
          icon: 'CloudRain',
          description: 'Correlated the packet loss timeline with live meteorology data via OpenWeather API.',
          widget: {
            type: 'weather',
            data: { stat: '145 mm/hr', desc: 'Torrential downpour in the line-of-sight path causing severe rain fade on the 15GHz frequency band.' }
          }
        },
        {
          stepNumber: 3,
          topic: 'Topic: AI Synthesis',
          topicColor: 'primary',
          color: 'muted',
          title: 'Final Diagnosis & Mitigation',
          icon: 'Brain',
          description: '',
          widget: {
            type: 'synthesis',
            rootCause: 'Severe Rain Fade on the 15GHz Microwave Backhaul link. The modulation has dropped from 1024QAM to QPSK, choking throughput.',
            actions: [
              { text: 'Initiate Automatic Route Failover to the backup 7GHz link (lower capacity, higher stability in rain).' },
              { text: 'Send SMS notification to affected users in the sector apologizing for the weather-induced latency.' }
            ]
          }
        }
      ]
    }
  },
  'c-1004': { // Core Signaling Issue
    initial: {
      role: 'ai',
      type: 'initial-analysis-core',
      content: 'URGENT NOC ALERT: A massive spike of **\"Emergency Calls Only\"** incidents just triggered at **Peradeniya University**. Over 800+ users are failing to latch to the network. \n\nI have traced the signaling flow from the eNodeB all the way to the Core Network (EPC). Here is the immediate diagnosis:',
      steps: [
        {
          stepNumber: 1,
          topic: 'Topic: Core Network',
          topicColor: 'purple',
          color: 'primary',
          title: 'EPC Signaling Trace (MME / HSS)',
          icon: 'Server',
          description: 'Analyzing S1-AP signaling between the eNodeB and Mobility Management Entity (MME).',
          widget: { type: 'chart-core' }
        },
        {
          stepNumber: 2,
          topic: 'Topic: AI Synthesis',
          topicColor: 'primary',
          color: 'muted',
          title: 'Root Cause & Automated Fix',
          icon: 'Brain',
          description: '',
          widget: {
            type: 'synthesis',
            rootCause: 'The eNodeB is sending Attach Requests, but the MME is rejecting them with cause <strong class=\"text-red-500\">\"Network Failure (Code 17)\"</strong>. The MME link to the HSS database has flapped.',
            actions: [
              { text: 'Reset the SCTP association between MME-Node-02 and HSS-Node-01.' },
              { text: 'Clear the stranded UE context cache on the affected eNodeB.' }
            ]
          }
        }
      ]
    }
  }
};

function getInitialMessages(id) {
  if (chatConfigs[id]) return [chatConfigs[id].initial];
  return [{ role: 'ai', content: 'I have analyzed the basic metrics. What would you like to investigate?' }];
}

function handleReply(id, msg, context) {
    if (msg.includes('Execute mitigation')) {
       return [{
           role: 'ai',
           content: 'Action executed via NOC API. Real-time telemetry confirms the mitigation script has been deployed successfully. Traffic is normalizing.',
           options: ['View Post-Mitigation Logs', 'Close Ticket']
       }];
    }
    
    if (msg.includes('deep research')) {
       return [{
           role: 'ai',
           type: 'deep-research',
           content: 'I have scanned our internal Knowledge Base, 3GPP standards, and historical tickets for similar anomalies. Here is what I found:',
           widget: {
               type: 'research',
               sources: 16,
               links: [
                   'What ML methods work for hourly anomaly detection with monthly history',
                   'Is this data sufficient for anomaly detection',
                   'How to implement these models'
               ]
           }
       }];
    }
    
    return [{
       role: 'ai',
       content: 'I understand you are asking about: ' + msg + '. I am analyzing the live telemetry parameters now...',
       options: ['Execute mitigation plan', 'Show deep research']
    }];
}

module.exports = { getInitialMessages, handleReply };
