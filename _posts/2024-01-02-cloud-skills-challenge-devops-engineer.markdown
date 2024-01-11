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


