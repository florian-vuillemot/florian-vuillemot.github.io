---
layout: post
title:  "Cloud Skills Challenge - Azure AI Language"
categories: azure azure-devops devops github feedback microsoft-learn
permalink: microsof-learn/cloud-skills-challenge/devops-engineer
---
# Introduction
Diving into the [DevOps Engineer](https://learn.microsoft.com/en-us/collections/67pku71drej4?WT.mc_id=cloudskillschallenge_8351edfe-a67a-46d4-81cd-6439844b72ac).

# Modules
## Capture Web Application Logs with App Service Diagnostics Logging
> [Link](https://learn.microsoft.com/en-us/training/modules/capture-application-logs-app-service/1-introduction)

- Recall file system logs limitation.
  - Windows support Blob Storage as log target.
  - Stderr and Stdout except for Windows ASP.NET and ASP.NET Core apps which are well handle by IIS.
  - If File System logs on **Windows** is configured, it is automatically reset to **off** after 12 hours for "performance reason": not usable in production.
  - **Quota** and **Retention period** are available for Blob Storage and Linux File System logs.
  - Storage location:
    - Windows & File System: Virtual drive in `D:\Home`.
    - Windows & Blob Storage: Store as year, month, date and hour hierarchy.
    - Linux: Docker log files accessible from SSH.
  - Storage access for Windows: Az CLI, Kudu and Az Storage browser depending of the log destination.
- Azure Application Insight.
  - More information: Monitoring, performance, designed for production.
  - SDK based and so need configuration.
  - Billable service.
- Log stream
  - Real time analysis.
  - Connect to a single instance so not fully usefull with multi-instance app.
  - Accessible with **curl** but need FTPS credentials.

Good and smooth introduction of logs on Azure Web Application but too focus on Windows.

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
