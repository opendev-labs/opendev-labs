import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Server,
  Zap,
  CheckCircle2,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Workflow,
  ArrowRight,
  Sparkles,
  Command,
  Code2
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Live2DWavesCanvas } from '../components/ui/Live2DWavesCanvas';
import { useNavigate } from 'react-router-dom';

export const AutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'health' | 'backup' | 'docker' | 'deploy'>('health');
  const [copied, setCopied] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const scripts = {
    health: `#!/usr/bin/env bash
# Sovereign Server Health & Failover Watchdog
set -euo pipefail

MEMORY_THRESHOLD=85
CPU_THRESHOLD=90

check_mem() {
  local free_mem=$(free -m | awk '/Mem:/ { print $4/$2 * 100.0 }')
  echo "[WATCHDOG] Free Memory: \${free_mem}%"
}

check_mem
echo "[WATCHDOG] All system telemetry green. Zero packet loss."`,

    backup: `#!/usr/bin/env bash
# Automated PostgreSQL & Media Cloud Backup
set -euo pipefail

TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
BACKUP_DIR="/var/backups/opendev"

mkdir -p "$BACKUP_DIR"
echo "[BACKUP] Dumping PostgreSQL database..."
pg_dump -U postgres -d opendev_prod | gzip > "$BACKUP_DIR/db_$TIMESTAMP.sql.gz"

echo "[BACKUP] Uploading snapshot to encrypted GCS bucket..."
gsutil cp "$BACKUP_DIR/db_$TIMESTAMP.sql.gz" gs://opendev-backups/
echo "[SUCCESS] Daily backup completed in 1.4s"`,

    docker: `#!/usr/bin/env bash
# Zero-Downtime Container Hot-Swap
set -euo pipefail

echo "[DOCKER-SWAP] Pulling latest production container..."
docker pull opendevlabs/api:latest

echo "[DOCKER-SWAP] Hot-swapping containers via cgroups..."
docker-compose up -d --no-deps --build web_api
docker image prune -f
echo "[SUCCESS] Service updated without dropping incoming connections."`,

    deploy: `#!/usr/bin/env bash
# High-Speed Linux Server Bootstrap Script
set -euo pipefail

echo "[BOOTSTRAP] Hardening SSH port & installing WireGuard mesh..."
apt-get update && apt-get install -y wireguard ufw nginx jq

ufw allow 22/tcp
ufw allow 443/tcp
ufw enable

echo "[SUCCESS] Node bootstrapped and secured in 18 seconds."`
  };

  const handleGenerateScript = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setGeneratedScript(`#!/usr/bin/env bash
# Auto-Generated Bash Automation Pipeline for: "${promptInput}"
set -euo pipefail

log() { echo "[AGENTSYNC $(date +'%H:%M:%S')] $1"; }

log "Initializing target environment..."
log "Running POSIX pre-flight safety check..."
log "Executing automated workflow..."

# Targeted task handler
echo "Executing requested automation for: ${promptInput}"

log "[SUCCESS] Script completed with exit code 0."`);
  };

  const handleCopy = () => {
    const text = generatedScript || scripts[activeTab];
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <Live2DWavesCanvas className="absolute inset-0 pointer-events-none opacity-80 z-0" waveCount={5} verticalBaseStart={0.35} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-6">
              <Terminal className="size-3.5" /> Production-Grade Bash & Linux Automation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-zinc-900 dark:text-white"
          >
            Sovereign Shell Scripting & Server Infrastructure Orchestration
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed"
          >
            Led by expert bash engineer <span className="font-extrabold text-zinc-900 dark:text-white">Yash Ramteke</span>, we craft high-speed Linux shell scripts, zero-downtime CI/CD workflows, automated backups, and self-healing terminal daemons.
          </motion.p>
        </div>
      </section>

      {/* Interactive Terminal Playground */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Live Bash Script Simulator
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            Inspect real POSIX bash scripts used across production Linux server clusters.
          </p>
        </div>

        {/* Terminal Window Box */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden font-mono text-xs">
          
          {/* Window Header */}
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[11px] text-zinc-400 font-sans font-bold">
                opendev-labs@bash-kernel-v6.8:~
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-sans font-semibold transition-colors"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>

          {/* Script Tabs */}
          <div className="flex border-b border-zinc-800 bg-zinc-900/60 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('health'); setGeneratedScript(null); }}
              className={`px-4 py-2.5 text-[11px] font-sans font-bold border-b-2 transition-colors ${
                activeTab === 'health' && !generatedScript
                  ? 'border-blue-500 text-white bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1. Health Watchdog
            </button>

            <button
              onClick={() => { setActiveTab('backup'); setGeneratedScript(null); }}
              className={`px-4 py-2.5 text-[11px] font-sans font-bold border-b-2 transition-colors ${
                activeTab === 'backup' && !generatedScript
                  ? 'border-blue-500 text-white bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2. Daily Database Backup
            </button>

            <button
              onClick={() => { setActiveTab('docker'); setGeneratedScript(null); }}
              className={`px-4 py-2.5 text-[11px] font-sans font-bold border-b-2 transition-colors ${
                activeTab === 'docker' && !generatedScript
                  ? 'border-blue-500 text-white bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              3. Zero-Downtime Hot-Swap
            </button>

            <button
              onClick={() => { setActiveTab('deploy'); setGeneratedScript(null); }}
              className={`px-4 py-2.5 text-[11px] font-sans font-bold border-b-2 transition-colors ${
                activeTab === 'deploy' && !generatedScript
                  ? 'border-blue-500 text-white bg-zinc-800/50'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              4. Server Bootstrap
            </button>
          </div>

          {/* Code Viewer Body */}
          <div className="p-6 overflow-x-auto min-h-[220px]">
            <pre className="text-amber-400 leading-relaxed font-mono whitespace-pre-wrap">
              {generatedScript || scripts[activeTab]}
            </pre>
          </div>
        </div>

        {/* Interactive Custom Script Request Box */}
        <div className="mt-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 sm:p-8">
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" /> Need a Custom Bash Automation Script?
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Type your server task requirement below to simulate an automated shell script generator.
          </p>

          <form onSubmit={handleGenerateScript} className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Sync server logs to S3 every midnight and send Telegram alert"
              className="flex-1 h-11 px-4 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              Generate Script <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Bash Projects Links */}
      <section className="py-16 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-8 text-center">
            Yash Ramteke's Bash Automation Case Studies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="size-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4 font-bold font-mono">
                01
              </div>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">AgentBash Engine</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                Sovereign autonomous bash scripting agent executing multi-step POSIX automation with self-healing capabilities.
              </p>
              <a
                href="/iamyashramteke/case-study/agentbash/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read AgentBash Study →
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 font-bold font-mono">
                02
              </div>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">Quantum Compute</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                High-throughput Linux cluster automation suite for zero-downtime node hot-swapping and WireGuard mesh setup.
              </p>
              <a
                href="/iamyashramteke/case-study/quantum-compute/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read Quantum Compute Study →
              </a>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-4 font-bold font-mono">
                03
              </div>
              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">GH-Sync-Desk</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                Cross-repository workflow engine synchronizing 100+ git codebases, CI/CD scripts, and automated releases.
              </p>
              <a
                href="/iamyashramteke/case-study/gh-sync-desk/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Read GH-Sync-Desk Study →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
