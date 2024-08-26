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
    sidebar: [{
      label: 'Azure network',
      items: [{
        label: 'Bastion and KeyVault integration',
        slug: 'azure-network/bastion-keyvault-integration'
      }, {
        label: 'Hub and spoke based on Application Gateway',
        slug: 'azure-network/hub-and-spoke-based-on-app-gateway'
      }]
    }, {
      label: 'Microsoft Learn',
      items: [{
        label: 'AZ 104',
        slug: 'microsoft-learn/az-104'
      }, {
        label: 'AI Language challenge',
        slug: 'microsoft-learn/ai-language'
      }, {
        label: 'DevOps Engineer challenge',
        slug: 'microsoft-learn/devops-engineer'
      }]
    }, {
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
			label: 'Part 3: Deployment based on the scoring',
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
    }]
  }), mdx()]
});