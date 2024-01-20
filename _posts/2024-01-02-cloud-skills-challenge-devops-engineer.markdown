---
layout: post
title:  "Cloud Skills Challenge - DevOps Engineer"
categories: azure azure-devops devops github feedback microsoft-learn
permalink: microsof-learn/cloud-skills-challenge/devops-engineer
---
# Introduction
Deep dive into the [DevOps Engineer](https://learn.microsoft.com/en-us/collections/67pku71drej4?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac) challenge from Microsoft Learn.

This challenge is a personal way of staying up to date in a neutral context. I use GitHub every day as part of my job, but - as everyone - I'm not familiar with all the platform's features and best practices. Beside, my usage is drive by my compagny needs, that can be far away from best practices and scope on certain topic.

Here are my notes. I capture what I consider interesting and make a quick summary. If you're familiar with GitHub and don't want to read the whole challenge, this is a way of taking only what you want.

# Modules
## Capture Web Application Logs with App Service Diagnostics Logging
> [Link](https://learn.microsoft.com/en-us/training/modules/capture-application-logs-app-service/1-introduction)

- File system log:
  - Windows supports [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction) as a logging target.
  - Contains *Stderr* and *Stdout* outputs except for Windows *ASP.NET* and *ASP.NET Core* applications, which are managed by IIS.
  - If file system logs on Windows are configured, they are automatically reset to **off** after 12 hours for "performance reasons": This is not usable in production.
  - The *Quota* and *Retention period* are available for **Azure Blob Storage** and Linux file system logs.
  - Storage location:
    - Windows & File System: Virtual drive in `D:\Home`.
    - Windows & **Azure Blob Storage**: Storage in year, month, date and time hierarchies.
    - Linux: Docker log files accessible via SSH.
  - Windows storage access: [Az CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli), [Kudu](https://learn.microsoft.com/en-us/azure/app-service/resources-kudu) and the storage browser depending on log destination.
- Azure Application Insight:
  - More info: Monitoring, performance, designed for production.
  - SDK-based, so requires configuration.
  - Billable service.
  - [Doc](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- Log feeds panel:
  - Real-time analysis.
  - Connection to a single instance, so not totally useful with a multi-instance application - and so production -.
  - Accessible with **curl** but requires FTPS credentials.

Good introduction to logs on Azure Web Application, but too Windows-centric.

## Control and organize Azure resources with Azure Resource Manager
> [Link](https://learn.microsoft.com/en-us/training/modules/control-and-organize-with-azure-resource-manager/)

- Resource Group organisation: ressource type, lifecycle, RBAC, prices.
- Tags importances: finance, organisation, meta data, automation.
- Policy usage: enforce standards, organisation, impact on ressources.
- RBAC: usage, scope, best practices.
- Resource locks: Read-only, delete, side effect - ex: list storage account -.

Back to basic modules! Quick summary of some Azure services.

## Deploy Spring microservices to Azure
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-spring-cloud-workshop/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Create the Spring Cluster.
- Create a GitHub repository.
- Create a MYSQL database and integrate it in the Spring Boot Cluster.
- Create a Spring Cloud Gateway.
- Introduction to distributed tracing provided by default. Too quick to be pertinent. Adding some content would be appreciate.
- Scaling the application from the Azure Portal. Unfortunalty there is nothing on the monitoring here and no introduction on this topic. Before scaling, a user need to know what is happening! 

This module show how powerfull using PAAS services allows to quickly expose to your end user an application but nothing on the troubleshooting or the monitoring. I would appreciate monitoring content with the distributed tracing unit.

## Microsoft Azure Well-Architected Framework - Performance efficiency
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-well-architected-performance-efficiency/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Identify the target, what the platform can offert and what the business need.
- Idenfity potential growth and impact on the application.
- Forecast capacity needs.
- POC for testing application and infrastructure behaviours.
- Check infrastructure is able to provide the capacity.
- Test performance on development as on production.
- Repeatable process for monitoring performance during lifecycle.
- Allocate technical time on debt and performance.
- Azure Application Insights can help on finding hotspots.

High level view on performance problem with a kind introduction on the shift-left. Debt, performance and reliability are couple and well handle they help keep the velocity and anticipate problem. As tests this must be consider as soon as possible and its only possible with tools and processes.

## Microsoft Azure Well-Architected Framework - Operational excellence
> [Link](https://learn.microsoft.com/en-us/training/modules/azure-well-architected-operational-excellence/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Introduction to project management with Azure DevOps. Nothing about GitHub Project, the doc must be to old.
- Continous improvement with feedbacks, sharing knowledge, retrospective and sharing success.
- A/B testing, decision based on data.
- Introduction to SCRUM, relative tools and hygiene.
- Keep relevant alerting and telemetry.
- Introduction Infrastructure As Code.
- Automation importance: Simple flows, design for automation, inforced standards.
- Feature flags: limit exposition of new feature to get metrics and easy switch off.

## Analyze your Azure infrastructure by using Azure Monitor logs
> [Link](https://learn.microsoft.com/en-us/training/modules/analyze-infrastructure-with-azure-monitor-logs/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Data collected:
  - Application data: Data that relates to your custom application code.
  - Operating-system data: Data from the Windows or Linux virtual machines that host your application.
  - Azure resource data: Data that relates to the operations of an Azure resource, such as a web app or a load balancer.
  - Azure subscription data: Data that relates to your subscription. It includes data about Azure health and availability.
  - Azure tenant data: Data about your Azure organization-level services, such as Microsoft Entra ID.
- Enabled diagnostic logging and agent with Log Analytics Workspace.
- Logs: Time-stamped information organized as records. Event type, the quantity is difficult to predict.
- Metrics: Numerical values describing aspect of the system at a point in time. Constant in time, the quantity is simple to predict.
- [Introduction to Kusto](https://learn.microsoft.com/en-us/training/modules/analyze-infrastructure-with-azure-monitor-logs/3-create-log-queries).

Good introduction on Azure Monitor. Exercices with Kusto is good but a dedicated module on can be better. This language is a pillar of the platform, and event if it is simple and near of SQL, it takes time to masterize.

## Monitor cloud resources
> [Link](https://learn.microsoft.com/en-us/training/modules/cmu-monitor-cloud-resources/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Logs: Permanent immutable records containing information about changes, tasks and error. Intend to be redable by a human as it is.
  - Log Management Platform: Scan and create response depending of the content. There do correlation, normalization and reporting.
  - Key for diagnose and predict failure.
- Metrics: Represent the relative health, stability, and availability. It's a quantitative value.
  - Correlation based: Metrics are based on composition and comparisons of ratios.
  - Can be high levels: Users sessions length, user sentiment.
  - Fit in the service delivery framework.
- Traces: Records of the paths of execution between services.
  - Follow low level call between components with graph and performances.
  - Usefull for analysis and find errors and they impacts.
- Application Performance Management (APM) are agent based or agentless:
  - Agent based can be a SDK in a Web Page. It's just something scrapping data where it is. Messages between agent are not human friendly and can drive to a huge amount of data difficult to manage. Protocol and data usage must be analysed.
  - Agentless will grab metrics and logs from the outside on an human format. Generally its based on logs and passive data.
- Metrics indicator and metrics correlation:
  - Simple: CPU, idle, garbage collector invocation, error rate, response time,
  - Complex:
    - Saturation point: Point where the system start to enter in a bad state increasing the number of timeout, the size of a queue or error message impacting the end user.
    - Application Performance Index ([Apdex](https://www.apdex.org/)): Metric from 0 (Satisfied) to 100 (Frustrated) based on the response time of an application from the end user perspective.
  - Framework:
    - [Utilization Saturation Errors](https://www.brendangregg.com/usemethod.html): Usage and error oriented on metrics particulary infrastructure.
    - [Rate Errors Duration](https://thenewstack.io/monitoring-microservices-red-method/): Application oriented fit perfectly in microservice.
- Remediation planning or how to fix when something **goes** or **will go**  wrong:
  - Ticketing system or IT Operation Management (ITOM) integrate with alerts and notifications.
  - KPI monitoring and alerting:
    - Bussiness metrics
    - Mean Time To Detection (MTTD)
    - Mean Time To Resolution (MTTR)
    - Percentage of system impact on issues
- Everyday remediation
  - Nothing is normal anymore, services are changing continously
  - Continously improve the system to stay ahead of saturation and keep it agile and understandable

Great module on monitoring principal and how to define it inside your organisation.

## React to state changes in your Azure services by using Event Grid
> [Link](https://learn.microsoft.com/en-us/training/modules/react-to-state-changes-using-event-grid/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Event Grid
  - Event based routing service
  - Event are infrastructure updated that be filtered and custom
  - 24 hour retries to ensure message delivrery
  - Webhook handler to call endpoint outside Azure
- Logic App
  - Can be triggered by Event Grid
  - Designer and JSON view
  - Allow logic flow and condition
  - Plethora of connector

Interresting module on Event Grid with a exercice including Logic App on an use case near from a real usage.

## Design a full-stack monitoring strategy on Azure
> [Link](https://learn.microsoft.com/en-us/training/modules/design-monitoring-strategy-on-azure/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Full Stack Monitoring: Monitor Infrastructure and services (Azure Monitor), application (Application Insight) and security (Microsoft defender and Sentinel).
- Microsoft Defender for Cloud.
  - Natively integrate in the platform it centralize security information at one place.- Connected to a Log Analytics Workspace to grab and analyse logs.
  - Analyses data, network and application security but also identity and access.
  - Show recommandation with a score. Ex: enforce MFA.
  - Enable Just-in-time (JIT) VM access to enable VM access during a limited amount of time and audit them.
  - *Adaptive Application Controls* to verify conformity of running process on a VM. In case of un usual running process, raised an alert.
  - Propose remedation, alerts and prevention.
- Microsoft Sentinel.
  - Thread hunting, alerting and proactive response based on users and platform logs.
  - Multi-cloud and on-prem solution.
  - Plethora of connectors including **Microsoft Entra** and **Office 365**.
  - Custom or build-in workbook and alerts.
  - Incident investigation and management.
- Application Insight for application monitoring for performance, availability, user behavior.
- Azure Monitor insights hub for ressource monitoring on the platform.
  - VM insights for monitoring at scale accross subscriptions and get processes and network topology.
  - Container insights for AKS accross subscriptions and get metrics, logs and performance.
  - Prometheus support for querying in PromQL and display with Graphana.
- Azure Monitor can be used with an Managed Graphana.
- All collected information can be used to create alerts rules.

Broad theorical module. The security aspect is new but a lot of information on the monitoring are redundante with previous modules.

## Introduction to GitHub
> [Link](https://learn.microsoft.com/en-us/training/modules/introduction-to-github/?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac)

- Code repository integrating code security tools, CI/CD, AI, wiki, etc.
- Code snippets using *gist*.
- Git flows with branches and commits but also GitHub features flow based on Pull Request, reviewers.
- Collaboration with issues, pull requests, discussion.
- Keep updating using subscription
- GitHub Pages for static hosting.

Overall GitHub guide. It's a nice tutorial really usefull for new to the platform.

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

