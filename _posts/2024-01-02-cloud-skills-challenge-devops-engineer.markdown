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


