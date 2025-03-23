import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import mdx from "@astrojs/mdx";
import remarkMermaid from 'remark-mermaidjs'

// https://astro.build/config
export default defineConfig({
  site: 'https://florian-vuillemot.github.io',
  //base: 'florian-vuillemot.github.io',
  markdown: {
    // Applied to .md and .mdx files
    remarkPlugins: [remarkMermaid],
  },
  integrations: [starlight({
    title: 'Standard Cloud',
    social: {
      github: 'https://github.com/florian-vuillemot'
    },
    sidebar: [
      {
        label: 'Azure Functions and Machine Learning',
        items: [
          {
            label: 'Part 1: Getting started',
            slug: 'serverless-machine-learning/part-1'
          },
          {
            label: 'Part 2: Offline training',
            slug: 'serverless-machine-learning/part-2'
          },
          {
            label: 'Part 3: Conditional deployment',
            slug: 'serverless-machine-learning/part-3'
          },
          {
            label: 'Part 4: A staging environment',
            slug: 'serverless-machine-learning/part-4'
          },
          {
            label: 'Part 5: Increasing the model size',
            slug: 'serverless-machine-learning/part-5'
          },
        ]
      }, {
        label: 'Azure network',
        items: [{
            label: 'Bastion and KeyVault integration',
            slug: 'azure-network/bastion-keyvault-integration'
          }, {
            label: 'Hub and spoke based on Application Gateway',
            slug: 'azure-network/hub-and-spoke-based-on-app-gateway'
          }, {
            label: 'Understanding Azure Service Endpoints',
            slug: 'azure-network/service-endpoints'
        }]
      }, {
        label: 'Database',
        items: [{
            label: 'The SQL Over() function',
            slug: 'database/over'
        }]
      }, {
        label: 'Fabric',
        items: [{
            label: 'Key Concepts',
            slug: 'fabric/key-concepts'
        }]
      }, {
        label: 'GitHub',
        items: [{
            label: 'Self-Hosted Runners on AKS',
            slug: 'github/self-hosted-runner'
        }]
      }, {
        label: 'Microsoft Entra',
        items: [{
            label: 'OAuth with Python',
            slug: 'microsoft-entra/oauth-with-python'
          }, {
            label: 'Azure Managed Identity Performance Impact',
            slug: 'microsoft-entra/azure-managed-identity-performance-impact'
        }]
      }, {
        label: 'Microsoft Learn',
        items: [
          {
            label: 'AI 900',
            items: [
              'microsoft-learn/ai-900/overview',
              'microsoft-learn/ai-900/vision',
              'microsoft-learn/ai-900/nlp',
              'microsoft-learn/ai-900/knowledge-mining',
              'microsoft-learn/ai-900/generative-ai',
              'microsoft-learn/ai-900/responsible',
            ]
          }, {
            label: 'AI Language challenge',
            slug: 'microsoft-learn/ai-language'
          }, {
            label: 'AZ 104',
            slug: 'microsoft-learn/az-104'
          }, {
            label: 'DevOps Engineer challenge',
            slug: 'microsoft-learn/devops-engineer'
          }, {
            label: 'DP-900',
            slug: 'microsoft-learn/dp-900'
        }]
      }
    ]
  }), mdx()]
});