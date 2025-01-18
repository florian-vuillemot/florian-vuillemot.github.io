---
title: Understanding Azure Service Endpoints
description: A small tutorial about Service Endpoint and there implication
---

# Introduction

Azure Service Endpoints are a powerful feature designed to enhance security and optimize network traffic within your Azure environment. In this post, we will explore what Azure Service Endpoints are, how they work, their routing and impact, Service Endpoint Policies, and their cost implications.

# Context

Consider a scenario where you have an Azure Virtual Machine (VM) running in a Virtual Network (VNet) that needs to access Azure Blob Storage. By default, the VM connects to Blob Storage over the public internet, despite both resources being part of Azure.

Here's the Azure resources not configured with the Azure VM in the VNET `serviceendpoint-vnet`:
![Resources](../../../assets/azure-network/service-endpoint/init-state.png)

The default setup involves:

- The VM sending requests to the Blob Storage account's public endpoint.
- Traffic potentially flowing through the public internet, introducing risks such as data interception or unauthorized access.
- The Blob Storage being open to the internet, necessitating firewall configuration with IP restrictions.
- Increased latency as traffic leaves the secure Azure backbone network.
- This setup, while functional, is suboptimal in terms of security and performance.

Now, let's see how Azure Service Endpoints simplify this process.

# What is an Azure Service Endpoint and How Does It Work?

An Azure Service Endpoint is a network link between a VNet and an Azure service that supports this feature.
It create a link between the VNet and the Azure service, allowing traffic to flow over the Azure backbone network instead of the public internet without consuming any IP from the VNET and quicker.

![Service Endpoint path](../../../assets/azure-network/service-endpoint/network-path.png)

You can see this configuration at the VNET level in the Azure Portal with an important detail, the geographic region reachable from with this Service Endpoint:
![Network path](../../../assets/azure-network/service-endpoint/impact-on-the-vnet.png)

Ressources trying to access to the resource using Service Endpoint must be allow at the resource firewall level.
Example, for our Azure Blob Storage, we need to allow the subnet to access the storage account as you can see in the image below where the firewall of the Azure Storage Account allows our VM subnet.

![Storage Firewall](../../../assets/azure-network/service-endpoint/add-my-ip.png)

Consequently, when activated, our VM will be able to reach all Azure Blob Storage resources directly which can be a problem if you want to restrict access to a specific storage account.
To solve this problem, you can use Service Endpoint Policies.

# Service Endpoint Policies

Service Endpoint Policies can restrict connectivity from a VNET to an Azure Storage Account.
Because it's apply at the subnet level, the restriction is for the resource trying to access to the storage from the VNET and not on the storage directly.
Consequently, it doesn't prevent the connection on another storage through the Internet.

![Service Endpoint Policy in action](../../../assets/azure-network/service-endpoint/service-endpoint-policy.png)

# Routing

When configured, Service Endpoint add to the VNET route table range(s) of IP targetting the configured service and creating the routing optimization.
Keeping the example, if we have a look to the "Effective routes" of the VM Network Interface, we can see them:

![Service Endpoint IPs ranges](../../../assets/azure-network/service-endpoint/effective-routes.png)

Due to the precision of the range, it's also possible to override Service Endpoint routing using User Defined Route and Service Tag.

![UDR blocking Service Endpoint](../../../assets/azure-network/service-endpoint/route-table.png)

It can be noted, that due to the implementation of Private Link, Service Endpoint are by passed because Private Link announced an IP more precise then the Service Endpoint range.

# Summary

Use cases drive the infrastructure and the hub-spoke implementation too. Considering Azure Application Gateway as the entry point of your Azure network can be pertinent and bon marché. But don't forget to look at the big picture of your infrastructure and where it is going. 
