---
layout: post
title:  "Cloud Skills Challenge - DevOps Engineer"
categories: azure azure-devops devops github feedback microsoft-learn
permalink: microsof-learn/cloud-skills-challenge/devops-engineer
---
# Introduction
Deep dive into the [DevOps Engineer](https://learn.microsoft.com/en-us/collections/67pku71drej4?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac) challenge from Microsoft Learn.

This challenge is a personal way of staying updated in a neutral context. I use Azure and GitHub every day as part of my job, but - like everyone - I can improve my knowledge of these platforms and their best practices. Besides, my daily usage is driven by my company's needs, which can be far from best practices and scope on specific topics.

Here are my notes. I capture what I consider interesting and make a quick summary. Feel free to use them as you need.

# Modules
## Capture Web Application Logs with App Service Diagnostics Logging
> [Link](https://learn.microsoft.com/en-us/training/modules/capture-application-logs-app-service/1-introduction)

- File system log:
  - Windows supports [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) as a logging target.
  - Contains *Stderr* and *Stdout* outputs except for Windows *ASP.NET* and *ASP.NET Core* applications, which are managed by IIS.
  - If file system logs on Windows is configured, it is automatically reset to **off** after 12 hours for "performance reasons": This is not usable in production.
  - The *Quota* and *Retention period* are available for **Azure Blob Storage** and Linux file system logs.
  - Storage location:
    - Windows & File System: Virtual drive in `D:\Home`.
    - Windows & **Azure Blob Storage**: Storage in year, month, date and time hierarchies.
    - Linux: Docker log files accessible via SSH.
  - Windows storage access: [Az CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli), [Kudu](https://learn.microsoft.com/en-us/azure/app-service/resources-kudu) and the storage browser depending on log destination.
- Azure Application Insight:
  - More info: Monitoring, performance, designed for production.
  - SDK-based, so it requires configuration.
  - Billable service.
  - [Doc](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- Log feeds panel:
  - Real-time analysis.
  - Connection to a single instance, so not useful with a multi-instance application - and so production -.
  - Accessible with **curl** but requires FTPS credentials.

A good introduction to logs on Azure Web Application, but too Windows-centric.

## Control and organize Azure resources with Azure Resource Manager
> [Link](https://learn.microsoft.com/en-us/training/modules/control-and-organize-with-azure-resource-manager/)

- Resource group organization: resource type, lifecycle, RBAC, price.
- Tags are essential for finance, organization, metadata, automation, etc.
- Use of policies: application of standards, organization, impact on resources.
- RBAC: use, scope, best practices.
- Resource locking: read-only, delete. Be careful with side effects! Ex: the storage account list key is no longer possible with a read-only lock.

Back to the basics! Quick summary of some Azure services.

## Deploy Spring microservices to Azure
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-spring-cloud-workshop/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Create the Spring Cluster.
- Create a GitHub repository.
- Create a MYSQL database and integrate it into the Spring Boot Cluster.
- Create a Spring Cloud gateway.
- Short introduction to distributed tracing provided by default.
- Scaling the application from the Azure portal. Unfortunately, there's nothing about monitoring here and no introduction to the subject. Before scaling, a user needs to know what's going on! 

This module shows how PAAS services can quickly expose an application to the end user, but there needs to be something on troubleshooting or monitoring. I'd appreciate some monitoring content with the distributed tracing unit.

## Microsoft Azure Well-Architected Framework - Performance efficiency
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-well-architected-performance-efficiency/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Identify the target: what a platform can offer vs what the company needs.
- Identify potential growth and impact on the application.
- Forecast capacity requirements.
- POC and test application and infrastructure behavior.
- Verify that the infrastructure can deliver the capacity.
- Test performance in development and production.
- Reproducible performance control process throughout the lifecycle.
- Allocate technical time to debt and performance.
- Azure Application Insights can help find hot spots.

A high-level module on performance problems, including a gentle introduction to the DevOps shift-left methodology. Debt, performance, and reliability are linked and well managed, helping to maintain velocity and anticipate problems. As tests, they need to be addressed as early as possible, and this is only possible with tools and processes.

## Microsoft Azure Well-Architected Framework - Operational excellence
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-well-architected-operational-excellence/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Introduction to project management with Azure DevOps. There is nothing on the GitHub project; the doc must be too old.
- Continuous improvement with feedback, knowledge sharing, retrospective and success sharing.
- A/B testing, data-driven decision making.
- Introduction to SCRUM, tools and hygiene.
- Keeping alerts and telemetry relevant.
- Introduction to infrastructure as code.
- Importance of automation: simple workflows, design for automation, computerized standards.
- Feature flags: limit exposure of new features for metrics and easy deactivation.

What's interesting about this module is the importance of project management. Technology isn't everything; process and knowledge are essential.

## Analyze your Azure infrastructure by using Azure Monitor logs
> [Link](https://learn.microsoft.com/en-us/training/modules/analyze-infrastructure-with-azure-monitor-logs/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Data collected :
  - Application data: Data relating to your customized application code.
  - Operating system data: Data from the Windows or Linux virtual machines hosting your application.
  - Azure resource data: Data relating to the operations of an Azure resource, such as a web application or a load balancer.
  - Azure subscription data: Data relating to your subscription. This includes data on Azure status and availability.
  - Azure tenant data: Data relating to your Azure services at the organization level, such as [Microsoft Entra](https://learn.microsoft.com/fr-fr/entra/).
- Activation of logging and diagnostic agent with [Log Analytics Workspace](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview).
- Logs: Time-stamped information organized in the form of records. The type of event and quantity are difficult to predict.
- Metrics: Numerical values describing an aspect of the system at a given time. Constant over time, the quantity is easy to predict.
- [Introduction to Kusto] (https://learn.microsoft.com/en-us/training/modules/analyze-infrastructure-with-azure-monitor-logs/3-create-log-queries).

Good overview of the [Azure Monitor](https://learn.microsoft.com/en-us/azure/azure-monitor/overview) service. The exercises with Kusto are good, but a dedicated module might be better. This language is a pillar of the platform, and even though it's simple and close to SQL, it takes time to master.

## Monitor cloud resources
> [Link](https://learn.microsoft.com/en-us/training/modules/cmu-monitor-cloud-resources/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Logs: Permanent, immutable records containing information on changes, tasks, and errors. They are intended to be read by a human being in their current state.
  - Log management platform: Analyzes and creates a response based on content. It provides correlation, normalization, and reporting.
  - Essential for fault diagnosis and prediction.
- Metrics: Represent a system's relative health, stability, and availability. It is a quantitative value.
  - Correlation-based: Metrics are based on the composition and comparison of ratios.
  - Can be high-level: user session duration, user sentiment.
  - Part of service delivery.
- Traces: Records of execution paths between services.
  - They enable tracking low-level calls between components using graphs and performance.
  - Useful for analyzing and tracing errors and their impact.
- Application Performance Management (APM) is agent-based or agentless:
  - The agent can be an SDK in a Web page. It's a tool that retrieves data from where it is. Messages between agents are machine-to-machine oriented and can lead to huge amounts of data that are difficult to manage. The protocol and use of data need to be analyzed.
  - Agentless retrieves metrics and logs from the outside world in a human format. Generally, it is based on logs and passive data.
- Indicator and correlation measurements:
  - Simple: CPU, inactivity, garbage collection invocation, error rate, response time.
  - Complex:
    - Saturation point: The point at which the system begins to enter a bad state by increasing the waiting times, the size of a queue, or error messages impacting the end user.
    - Application performance index ([Apdex](https://www.apdex.org/)): A measure ranging from 0 (satisfied) to 100 (frustrated) based on an application's response time from the end-users point of view.
  - Framework:
    - [Utilization Saturation and Errors](https://www.brendangregg.com/usemethod.html): Utilization and errors oriented towards metrics, in particular infrastructure.
    - [Rate Errors Duration](https://thenewstack.io/monitoring-microservices-red-method/): Application-oriented, it integrates perfectly with microservices.
- Remediation planning or how to fix when something **goes** or **will** go wrong:
  - Ticketing system or IT operations management (ITOM) integrates with alerts and notifications.
  - KPI monitoring and alerts:
    - Activity indicators.
    - Mean time to detection (MTTD).
    - Mean time to resolution (MTTR).
    - Percentage of system impact on problems.
- Daily remediation:
  - Nothing is normal anymore; services are constantly changing.
  - Continuously improve the system to stay ahead of saturation and keep it agile and understandable.

A key module on monitoring and how to define it within your organization.

## React to state changes in your Azure services by using Event Grid
> [Link](https://learn.microsoft.com/en-us/training/modules/react-to-state-changes-using-event-grid/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- [Event Grid](https://learn.microsoft.com/en-us/azure/event-grid/):
  - Event-based routing service.
  - Events are updated infrastructures that can be filtered and customized.
  - 24-hour retries to ensure message delivery.
  - Webhook manager for calling an endpoint outside Azure.
- Logical application:
  - Can be triggered by the Event Grid.
  - Designer and JSON view.
  - Allows logical flow and conditions.
  - Plenty of connectors.

Interesting module with an exercise using Event Grid with the Logic App on a good use case.

## Design a full-stack monitoring strategy on Azure
> [Link](https://learn.microsoft.com/en-us/training/modules/design-monitoring-strategy-on-azure/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Full stack monitoring: monitoring of infrastructure and services (with Azure Monitor), applications (with Application Insight) and security (with [Microsoft Defender](https://learn.microsoft.com/en-us/training/modules/intro-to-defender-cloud/) and [Sentinel](https://learn.microsoft.com/en-us/training/modules/intro-to-azure-sentinel/)).
- Microsoft Defender for Cloud:
  - Integrated natively into the platform, it centralizes security information in one place
  - Connects to a Log Analysis Workspace to capture and analyze logs.
  - Analyzes data, network, and application security, as well as identity and access.
  - Recommendation based on scoring simplifying prioritization. Ex: apply MFA.
  - Enable just-in-time (JIT) access to virtual machines to authorize access to virtual machines for a limited period and audit them.
  - *Adaptive Application Control* to verify the conformity of processes running on a virtual machine. If an unusual process is running, trigger an alert.
  - Suggest remedies, alerts, and preventive measures.
- Microsoft Sentinel:
  - Thread search, alerts and proactive responses based on user and platform logs.
  - Multi-cloud and on-premise solution.
  - Plethora of connectors, including **Microsoft Entra** and **Office 365**.
  - Customized or integrated binder and alerts.
  - Incident investigation and management.
- Application Insight is used to monitor application performance, availability, but also the user behavior.
- Azure Monitor insights hub for monitoring resources on the platform:
  - VM insights for monitoring at scale across subscriptions and obtaining processes and network topology.
  - Container insights for AKS across subscriptions and get metrics, logs and performance.
  - Prometheus support for PromQL querying and Graphana display.
- Azure Monitor can be used with managed Graphana.
- All collected information can be used to create alert rules.

General theory module. The security topic is new, but much of the monitoring information is redundant with previous modules.

## Introduction to GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/introduction-to-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Code repository with integrated tools for code security, CI/CD, AI, wiki, etc.
- Code snippets with *gist*.
- Git flows with branches and commits, but also GitHub features based on pull requests and reviewers.
- Collaboration with issues, pull requests, and discussions.
- Keeping updated with a notification system on users, repository and organisation.
- GitHub Pages for static hosting.

Overall GitHub guide. It's a nice tutorial that is really useful for those new to the platform.

## Migrate your repository by using GitHub best practices
> [Link](https://learn.microsoft.com/en-us/training/modules/migrate-repository-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- GitHub is a Cloud based solution and all on GitHub must be considered as compromised.
- History can be keept.
- Support Large File is needed via [Git LFS](https://git-lfs.com/).
- Understand files as a Gitignore for simpler and safer collaboration. [Here some best practices](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions).

Getting started practise around GitHub with a lab.

## Upload your project by using GitHub best practices
> [Link](https://learn.microsoft.com/en-us/training/modules/upload-project-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Import project in GitHub.
- Add meta data on the project as email for commits.
- Import or create a project with the GitHub website, the Git command or the GitHub CLI.

The content is near from the previous module but with a example focused on the migration from another code management platform.

## Manage repository changes by using pull requests on GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/manage-changes-pull-requests-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Pull Request and review as communication tool.

GitHub practices around Pull Request and processes.

## Settle competing commits by using merge conflict resolution on GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/resolve-merge-conflicts-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Git branch and rebase management.

Basic good practices around Git and the integration in GitHub.

## Search and organize repository history by using GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/search-organize-repository-history-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Search on [GitHub](https://github.com/search/advanced) in repository and pull requests.
  - The search [syntax](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/about-searching-on-github)
- [Links](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/autolinked-references-and-urls) between PR, issues, comment based on tag and keywords.

Still on the GitHub usage, it's a good module on common pure GitHub usage.

## Manage an InnerSource program by using GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/manage-innersource-program-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Using OpenSource in compagny by keeping best practises: [InnerSource](https://resources.github.com/innersource/fundamentals/).
  - Keeping transparency, communication, history.
  - Reduce friction by enabling self doing from a team to another and even fork.
  - Standardize practices.
- Repository permissions
  - Read level is recommended for non-code contributors who want to view or discuss the project.
  - Triage level is recommended for contributors who need to proactively manage issues and pull requests without write access.
  - Write level is recommended for contributors who actively push to the project.
  - Maintain level is recommended for project managers who need to manage the repository without access to sensitive or destructive actions.
  - Admin level is recommended for people who need full access to the project, including sensitive and destructive actions like managing security or deleting a repository.
- Readme, naming and description to allow retrieve information at scale.
- Readme.md, codeowner and contributing.md can be put in the `.github` folder.
- Standardize process using pull request templates.

Great module on how to use InnerSource and mesure if its working.

## Communicate effectively on GitHub using Markdown
> [Link](https://learn.microsoft.com/en-us/training/modules/communicate-using-markdown/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Broad description of the Markdown language.
- Introduction to the GitHub-Flavored Markdown (GFM).
- Reference using a URL, the syntax '#', 'GH-' or 'Username/Repository#' for pull request and issues. Similar syntax for commit and users.
- Commands base on '/command' as '/code' or '/details'.

Good review of the Markdown/GFM on GitHub to be more efficient on day to day tasks.

## Maintain a secure repository by using GitHub best practices
> [Link](https://learn.microsoft.com/en-us/training/modules/maintain-secure-repository-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Shift left the security and must be handle at the begining of the project.
- Use the "security" tab of the repository
  - Security policies that allow you to specify how to report a security vulnerability in your project by adding a SECURITY.md file to your repository.
  - Dependabot alerts that notify you when GitHub detects that your repository is using a vulnerable dependency or malware.
  - Security advisories that you can use to privately discuss, fix, and publish information about security vulnerabilities in your repository.
  - Code scanning that helps you find, triage, and fix vulnerabilities and errors in your code with CodeQL.
  - Secret scanning to prevent credential leaks. In case of leak, remove and push the history then contact GitHub to clear some cache.
- Use `.gitignore` for sensitive files.
- Assume your GitHub account as compromised.
- Use branch protection rules.
- Use codeowner.

Good introduction! CodeQL can be complex but really powerfull, a deep dive would be appreciate.

## Automate DevOps processes by using GitHub Apps
> [Link](https://learn.microsoft.com/en-us/training/modules/automate-devops-github-apps/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Use API to extend GitHub functionality.
- Permission can be at the repository level.
- Oauth App
  - Application acting on behalf of a user.
  - Consume a seat on GitHub Orga.
  - For read, write and modify user data.
- GitHub App
  - Install on personal, orga or repository. Need admin access.
  - Does not consume GitHub seat.
  - Need token.
  - Customize permissions.
  - Support auth as user as Oauth App.
- Events can be
  - GitHub webhooks
  - Polling
- Github tokens
  - GitHub personal access tokens (ghp)
    - Individual token for user
    - Can be fined-grained
  - Device token (gup)
    - Machine version of PAT.
    - Mainly for runners.
  - GitHub Application Installation tokens (ghs)
    - Valid for a short period of time
    - Perfect for installation actions
  - OAuth access tokens (gho)
    - For headless CLI
    - Can be acquired using the web application flow
    - Behalf oauth.
  - Refresh tokens (ghr): OAuth token refreshed
- There is rate limits on tokens delivrery. GitHub allows to monitor and manage it.

Great module with total new content. Github App is a good topic and market for numerous tools. The exercice based on a video is interesting fit well behalf this module.

## Automate GitHub by using GitHub Script
> [Link](https://learn.microsoft.com/en-us/training/modules/automate-github-using-github-script/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Based on [Octokit](https://octokit.github.io/rest.js/v20).
- Provide a Octokit client authenticate on the repository.
- Another way to interact with GitHub APIs and act on them.

Ex:
```
- uses: actions/github-script@0.8.0
  with:
    github-token: ${{secrets.GITHUB_TOKEN}}
    script: |
      github.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: "🎉 You've created this issue comment using GitHub Script!!!"
      })
```

Each organisation creates their own process and GitHub Script helps a lot for implement them and this module provides valuable information on it.

## Manage software delivery by using a release based workflow on GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/release-based-workflow-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Using GitHub Project and issues to create sprint.
- Sprint are time-boxed period to produce incremental changes.
- Milestones are similar to project tracking but focused on product features.
- Long-lived branches should mainly be for released and must come from the `main` branch. Also they must be protected against write and delete.
- Use `git cherry-pick` to apply specific commits from a branch to another and update releases.
- Releasing to consumers must be based on [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).

Managing project release is simplify by Git, GitHub release and GitHub Project and this module clearly explain how to do it correctly.

## Build continuous integration (CI) workflows by using GitHub Actions
> [Link](https://learn.microsoft.com/en-us/training/modules/github-actions-ci/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac&ns-enrollment-type=Collection&ns-enrollment-id=67pku71drej4)

- GitHub Action for automated task on a repository and its content based on event.
- An [Artifact](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts) is a job output other then logs and it can be keept and stored.
- Environment variable for workflows can be provided
  - At the GitHub level in [secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) and [variable](https://docs.github.com/en/actions/learn-github-actions/variables) - defined by someone with permission -
  - At the workflow and job level - defined by the developper -
  - By GitHub directly - defined by GitHub -
- Customs scripts for the CI can directly be put in the `.github/scripts` folder.
- Reproductible action in workflow - as installing dependencies - can be reuse between runs and reduce the CI time by using [cache](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows).
- More [debugging information](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging) can be provided at the runner or step level by defining in GitHub secrets respectively `ACTIONS_RUNNER_DEBUG` and `ACTIONS_STEP_DEBUG` to true.
- Logs are accessible from the GitHub UI or by API.

This module well introduce the GitHub Action syntax and the possiblity offer. I'm surprised it comes after the module **Automate GitHub by using GitHub Script** introducing the `Octokit` framework which imply a GitHub workflow.

## Build and deploy applications to Azure by using GitHub Actions
> [Link](https://learn.microsoft.com/en-us/training/modules/github-actions-cd/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- GitHub Action can upload a container image on Azure using pre build actions on the [GitHub marketplace](https://github.com/marketplace).
- GitHub Action can also interact with resources on cloud provider as Azure. It can be use to create, modify or delete cloud resources.
- Workflow status badges can provide visibility.
  - They can display information on any branch or event on the repository.
  - They can be integrated in website, not only GitHub.
  - Ex: `![example branch parameter.](https://github.com/mona/special-octo-eureka/actions/workflows/grading.yml/badge.svg?branch=my-workflow)`
- Workflow can use [environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) with custom secrets and variables. As branches, they can be protected with reviewer or delay with a timer.

Great module on how to use GitHub with Azure. Unfortunatly, this module only talk about auth based on token between both platforms. Even if more complex, an [OpenId](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure) configuration steps would be appreciate.

## Implement a code workflow in your build pipeline by using Git and GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/implement-code-workflow/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

This module is a complete project showing the integration between Azure DevOps - the board and pipeline - and GitHub. It's interesting to understand how to use both together and how both platforms provide similar or additional features.
