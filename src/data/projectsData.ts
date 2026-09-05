export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: 'Bash Automation' | 'Developer Tools' | 'AI Infrastructure' | 'Fullstack Web Apps' | 'FinTech & Trading';
  description: string;
  longDescription: string;
  architectureHighlights: string[];
  techStack: string[];
  metrics: { label: string; value: string }[];
  caseStudyUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  terminalSnippet?: string;
  iconName: string;
  accentColor: string;
}

export const projectsData: ProjectItem[] = [
  {
    id: 'agentbash',
    title: 'AgentBash',
    tagline: 'Sovereign Autonomous Bash Scripting Engine & AI Shell Agent',
    category: 'Bash Automation',
    description: 'An autonomous command-line agent that generates, tests, and executes complex multi-step POSIX bash automation scripts with self-healing capabilities.',
    longDescription: 'AgentBash is designed for DevOps engineers and system administrators who require autonomous infrastructure management. It interprets high-level natural language intents into validated, battle-tested Bash scripts with built-in rollback logic, error logging, and system health checks.',
    architectureHighlights: [
      'Pure POSIX-compliant shell execution engine with safety isolation',
      'Automated syntax verification with ShellCheck AST analysis',
      'Self-healing loop: catches non-zero exit codes and auto-patches runtime scripts',
      'Zero-dependency runtime deployable on any Linux kernel 4.x+'
    ],
    techStack: ['Bash', 'POSIX Shell', 'Linux Kernel', 'ShellCheck', 'Systemd', 'Python'],
    metrics: [
      { label: 'Execution Speed', value: '12ms' },
      { label: 'Script Reliability', value: '99.98%' },
      { label: 'Lines of Bash', value: '14,200+' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/agentbash/',
    featured: true,
    terminalSnippet: `#!/usr/bin/env bash
# AgentBash Autonomous Health Check & Self-Healing Pipeline
set -euo pipefail

log_info() { echo "[AGENTSYNC $(date +'%H:%M:%S')] INFO: $1"; }
log_warn() { echo "[AGENTSYNC $(date +'%H:%M:%S')] WARN: $1"; }

check_service_health() {
  local service="$1"
  if ! systemctl is-active --quiet "$service"; then
    log_warn "Service $service is degraded. Initiating auto-recovery..."
    systemctl restart "$service"
    log_info "Service $service successfully restored."
  fi
}`,
    iconName: 'Terminal',
    accentColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 'void',
    title: 'Void IDE & Cloud Terminal',
    tagline: 'Next-Gen Autonomous Cloud Terminal & Container Dev Suite',
    category: 'Developer Tools',
    description: 'Cloud-native development environment integrating live WebSockets terminal streams, container management, and instant microservice deployment.',
    longDescription: 'Void IDE empowers developers to orchestrate cloud workloads, run interactive shell commands in isolated sandboxes, and inspect live container telemetry directly from a sleek web interface.',
    architectureHighlights: [
      'Low-latency WebSocket terminal multiplexing with xterm.js integration',
      'Container sandbox creation in under 800ms via optimized cgroup hooks',
      'Integrated live environment variables management and secrets encryption',
      'Real-time CPU/RAM telemetry stream visualization'
    ],
    techStack: ['TypeScript', 'React', 'Docker', 'WebSockets', 'Node.js', 'TailwindCSS'],
    metrics: [
      { label: 'Container Spin-Up', value: '<800ms' },
      { label: 'Active Sessions', value: '5,000+' },
      { label: 'Uptime', value: '99.99%' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/void/',
    demoUrl: '/dashboard',
    featured: true,
    terminalSnippet: `$ void-cli init project-nexus
[+] Provisioning cloud container... Done (640ms)
[+] Mounting bash volume /dev/shm... Success
[+] Attaching WebSocket stream wss://void.opendev-labs.com/stream/v1
Ready! Type 'help' to inspect container commands.`,
    iconName: 'Cpu',
    accentColor: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'gh-sync-desk',
    title: 'GH-Sync-Desk',
    tagline: 'GitHub Cross-Repository Workflow & Sync Automation Engine',
    category: 'Bash Automation',
    description: 'High-speed automated workflow suite synchronizing multi-repository codebases, release tags, and CI/CD shell scripts across GitHub organizations.',
    longDescription: 'GH-Sync-Desk eliminates manual multi-repo synchronization by executing parallel git trees, automated branch synchronization, and uniform workflow distribution via custom Bash CLI utilities.',
    architectureHighlights: [
      'Parallel git tree tree execution across 100+ repositories simultaneously',
      'Automated conflict detection with inline git patch resolution',
      'Custom GitHub REST/GraphQL API integration wrapped in optimized Bash scripts',
      'Encrypted token management with GPG key verification'
    ],
    techStack: ['Bash', 'Git', 'GitHub Actions', 'Electron', 'Node.js'],
    metrics: [
      { label: 'Sync Velocity', value: '100 Repos / 5s' },
      { label: 'Hours Saved/Mo', value: '120+ hrs' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/gh-sync-desk/',
    featured: true,
    terminalSnippet: `$ gh-sync-desk sync --all --org opendev-labs
[✓] Synchronized 24 repositories
[✓] Distributed security patch v2.4.1 to all CI/CD pipelines
[✓] Clean git working directory across all nodes`,
    iconName: 'Workflow',
    accentColor: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'quantum-compute',
    title: 'Quantum Compute',
    tagline: 'High-Throughput Linux Cluster & Server Orchestration',
    category: 'Bash Automation',
    description: 'Production bash automation suite for zero-downtime server cluster provisioning, automated failover, load balancer setup, and system monitoring.',
    longDescription: 'Engineered for high-availability enterprise infrastructure, Quantum Compute provides modular bash scripts to bootstrap bare-metal Linux servers, configure WireGuard VPN mesh networks, and auto-scale Nginx clusters.',
    architectureHighlights: [
      'Zero-downtime rolling blue/green node deployment scripts',
      'Automated WireGuard mesh network peering setup via bash',
      'Real-time system metric extraction pushing to influx/prometheus',
      'Automated SSL certificate renewal and Nginx reload hooks'
    ],
    techStack: ['Linux Kernel', 'Systemd', 'Bash', 'WireGuard', 'Nginx', 'Ansible'],
    metrics: [
      { label: 'Cluster Boot Time', value: '45s' },
      { label: 'Automated Nodes', value: '250+' },
      { label: 'SLA Guarantee', value: '99.999%' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/quantum-compute/',
    featured: true,
    terminalSnippet: `$ quantum-compute cluster --deploy prod-asia-1
[+] Initializing WireGuard mesh node... OK
[+] Configuring cgroup memory limits... OK
[+] Hot-swapping Nginx configuration without packet drop... Done`,
    iconName: 'Server',
    accentColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'auto-notion',
    title: 'AutoNotion',
    tagline: 'Automated Notion Workspace & Server Status Sync Pipeline',
    category: 'Bash Automation',
    description: 'Bi-directional bash sync pipeline that streams developer commit logs, server health telemetry, and incident reports into Notion databases.',
    longDescription: 'AutoNotion connects server terminal environments directly with Notion product databases, maintaining real-time visibility into server uptime, database backups, and daily developer logs without manual entry.',
    architectureHighlights: [
      'Lightweight curl-based Notion API client written in pure Bash',
      'Cron-backed automated telemetry daemon consuming minimal memory (<4MB)',
      'Markdown-to-Notion block AST translator',
      'Webhooks trigger for instant incident ticket creation'
    ],
    techStack: ['Bash', 'Notion API', 'cURL', 'Cron', 'JSON/jq'],
    metrics: [
      { label: 'RAM Footprint', value: '<4 MB' },
      { label: 'Sync Latency', value: '<200ms' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/auto-notion/',
    featured: false,
    iconName: 'RefreshCw',
    accentColor: 'from-pink-500 to-rose-600'
  },
  {
    id: 'qbet',
    title: 'QBET Algorithmic Bot',
    tagline: 'High-Frequency Automated Trading & Risk Management Bot',
    category: 'FinTech & Trading',
    description: 'Real-time algorithmic trading execution engine powered by low-latency shell pipelines and automated risk mitigation rules.',
    longDescription: 'QBET combines real-time orderbook streaming with sub-millisecond execution triggers to manage crypto and stock positions while enforcing strict capital protection rules.',
    architectureHighlights: [
      'Sub-millisecond order execution via optimized socket pipelines',
      'Automated daily PnL logging and automated trailing stop-loss adjustments',
      'Backtesting engine simulating 5 years of tick data in seconds',
      'Encrypted API key vault with memory-only key storage'
    ],
    techStack: ['Bash', 'Python', 'WebSockets', 'C++', 'Redis'],
    metrics: [
      { label: 'Execution Speed', value: '<1.2ms' },
      { label: 'Win Rate', value: '74.2%' },
      { label: 'Daily Trade Vol', value: '$250K+' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/qbet/',
    featured: false,
    iconName: 'Activity',
    accentColor: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'quantum-api',
    title: 'Quantum API Gateway',
    tagline: 'High-Performance Microservice Gateway & Shell Security',
    category: 'Developer Tools',
    description: 'Ultra-low overhead API gateway with automated rate limiting, IP dynamic throttling, and DDoS mitigation bash handlers.',
    longDescription: 'Quantum API acts as a shield and router for backend services, combining Nginx performance with shell script dynamic blocklists for real-time security enforcement.',
    architectureHighlights: [
      'Automated IP threat scoring with iptables dynamic ban hooks',
      'Zero-downtime routing table update scripts',
      'JWT token verification at edge before microservice proxy'
    ],
    techStack: ['Nginx', 'Bash', 'iptables', 'Go', 'Redis'],
    metrics: [
      { label: 'Req Throughput', value: '50K req/s' },
      { label: 'Added Latency', value: '0.4ms' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/quantum-api/',
    featured: false,
    iconName: 'ShieldCheck',
    accentColor: 'from-emerald-400 to-green-600'
  },
  {
    id: 'quantum-ml',
    title: 'Quantum ML Pipeline',
    tagline: 'Automated ML Preprocessing & Model Training Pipeline',
    category: 'AI Infrastructure',
    description: 'End-to-end automated data cleaning, feature extraction, and PyTorch model training pipeline executed through automated shell workflows.',
    longDescription: 'Quantum ML automates raw dataset ingest from Cloud Storage, executes automated data cleaning algorithms, and triggers GPU node cluster training with automated status callbacks.',
    architectureHighlights: [
      'Automated dataset ETL bash pipeline with checksum validation',
      'Distributed multi-GPU training setup triggered via shell scripts',
      'Automated model checkpoint evaluation and deployment to inference nodes'
    ],
    techStack: ['Python', 'PyTorch', 'Bash', 'CUDA', 'Docker'],
    metrics: [
      { label: 'ETL Velocity', value: '10GB / min' },
      { label: 'Accuracy Gain', value: '+14%' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/quantum-ml/',
    featured: false,
    iconName: 'Zap',
    accentColor: 'from-violet-500 to-purple-600'
  },
  {
    id: 'quantum-nlp',
    title: 'Quantum NLP CLI',
    tagline: 'Terminal Natural Language Processor & Bash Generator',
    category: 'AI Infrastructure',
    description: 'Command-line tool translating developer natural language instructions into safe, executable bash command chains.',
    longDescription: 'Quantum NLP translates prompts like "Find all log files older than 7 days, compress them, and upload to S3" into precise, error-checked one-liner bash scripts.',
    architectureHighlights: [
      'Sub-50ms local LLM command generation model',
      'Dry-run simulation mode before command execution',
      'Destructive command guardrails (prevents accidental rm -rf)'
    ],
    techStack: ['Bash', 'Python', 'Transformers', 'CLI'],
    metrics: [
      { label: 'Prompt Latency', value: '45ms' },
      { label: 'Command Accuracy', value: '99.4%' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/quantum-nlp/',
    featured: false,
    iconName: 'Code2',
    accentColor: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'ebookstall',
    title: 'EbookStall Platform',
    tagline: 'Digital Marketplace & E-commerce Automated Delivery System',
    category: 'Fullstack Web Apps',
    description: 'High-converting digital product store with automated payment fulfillment, instant license key generation, and bash script delivery pipeline.',
    longDescription: 'EbookStall provides digital creators with a lightning-fast marketplace platform featuring instant Stripe payment callbacks and automated secure link generation.',
    architectureHighlights: [
      'Serverless payment webhook handlers with instant license minting',
      'Automated PDF watermarking and CDN link generation',
      'Sleek responsive UI with dark/light mode support'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'TailwindCSS'],
    metrics: [
      { label: 'Conversion Rate', value: '4.8%' },
      { label: 'Orders Processed', value: '12,500+' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/ebookstall/',
    featured: false,
    iconName: 'CreditCard',
    accentColor: 'from-orange-500 to-amber-600'
  },
  {
    id: 'transcenders',
    title: 'Transcenders UI Engine',
    tagline: 'Next-Gen 60FPS WebGL & Interactive Graphics Platform',
    category: 'Fullstack Web Apps',
    description: 'Immersive web app featuring 60FPS interactive canvas shaders, liquid smooth animations, and high-performance UI components.',
    longDescription: 'Transcenders demonstrates state-of-the-art web graphic engineering using custom Canvas 2D and WebGL renderers for memorable user landing pages.',
    architectureHighlights: [
      'Custom 60FPS math particle physics engine',
      'Zero layout thrashing with RAF render loops',
      'Hardware-accelerated CSS 3D transforms'
    ],
    techStack: ['React', 'Canvas 2D', 'Three.js', 'Framer Motion'],
    metrics: [
      { label: 'Frame Rate', value: '60 FPS' },
      { label: 'Lighthouse Score', value: '99/100' }
    ],
    caseStudyUrl: '/iamyashramteke/case-study/transcenders/',
    featured: false,
    iconName: 'Sparkles',
    accentColor: 'from-fuchsia-500 to-pink-600'
  }
];
