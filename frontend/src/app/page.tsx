'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Code2, Cloud, Brain, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-sky-500" />
            <span className="font-bold text-xl">DevCloud</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-slate-300 hover:text-white">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            The All-in-One Cloud Development Platform
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Collaborate on code, manage files, integrate AI, and host virtual machines—all in one unified platform.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-sky-600 hover:bg-sky-700 rounded-lg font-semibold"
          >
            Start Building Free
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<Code2 className="w-8 h-8" />}
            title="Collaborative Coding"
            description="Real-time code editing and version control with your team, just like GitHub."
          />
          <FeatureCard
            icon={<Cloud className="w-8 h-8" />}
            title="Cloud Storage"
            description="Unlimited cloud storage with file sync, sharing, and organization tools."
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Assistant"
            description="Intelligent code suggestions, debugging help, and automation powered by AI."
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="VM Hosting"
            description="Deploy and manage virtual machines without the hassle or cost."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-900 to-blue-900 py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-slate-300 mb-8">
            Join thousands of developers building amazing things with DevCloud.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-slate-100"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-sky-500 hover:bg-slate-700/50 transition-all">
      <div className="text-sky-400 mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  )
}
