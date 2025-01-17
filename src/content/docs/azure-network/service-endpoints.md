---
title: Understanding Azure Service Endpoints
description: A small tutorial about Service Endpoint and there implication
---

# Introduction

Azure Service Endpoints are a powerful feature designed to enhance security and optimize network traffic within your Azure environment. In this blog post, we'll explore what Azure Service Endpoints are, how they work, their routing and impact, Service Endpoint Policies, and their cost implications.

# Some context

Imagine you have an Azure Virtual Machine (VM) running in a Virtual Network (VNet) that needs to access Azure Blob Storage to store and retrieve data. By default, the VM connects to Blob Storage over the public internet, even though both resources are part of Azure. Here’s what happens:
1. The VM sends requests to the Blob Storage account's public endpoint, which has a public IP address.
2. The traffic may flows through the public internet, which introduces potential risks such as data interception or unauthorized access.
3. The blob Storage is open on the Internet and for security reason it's better to to configure at least its firewalls with IP restriction.
4. While this setup works, it's less secure and can result in higher latency because the traffic may leaves the secure Azure backbone network.

Now, let's see how Azure Service Endpoints simplify this process.

# What is an Azure Service Endpoint and how it works?

An Azure Service Endpoint is a network link between a VNET and an Azure service supporting this feature.
This link, transparent from the user point of view, is an optimized route to reach a ressource with the certitude to stay on the Azure Backbone.
This feature is free and can even save you money by limiting the data transfer costs.

![Network path](../../../assets/azure-network/service-endpoint/network-path.png)

# Security impact

While service endpoints provide a secure connection to Azure services, it is important to understand that they open the network on the service globally, not just on the user's resources.
This means that service endpoints alone do not protect against data leaks.
To enhance security and limit this risk, you can use Service Endpoint Policies to restrict access to the resources to specific subnets or VNets.

# Service Endpoint Policies

Service Endpoint Policies can restrict connectivity to specific Azure services from specific **subnets** or **VNets**, enhancing the security of your network.
This restriction helps reduce the attack surface and ensures only authorized resources can communicate with your critical services.
Policies can be applied to different types of Azure services, including storage accounts, SQL databases, and other PaaS offerings.

Implementing Service Endpoint Policies provides a more granular control over network traffic, ensuring compliance with organizational security requirements and regulatory standards.

![Service Endpoint Policy in action](../../../assets/azure-network/service-endpoint/service-endpoint-policy.png)

# Summary

Use cases drive the infrastructure and the hub-spoke implementation too. Considering Azure Application Gateway as the entry point of your Azure network can be pertinent and bon marché. But don't forget to look at the big picture of your infrastructure and where it is going. 
