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

