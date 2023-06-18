---
layout: post
title:  "Hub-spoke based on Azure Application Gateway"
categories: azure azure-app-gateway hub-and-spoke network
---
# Introduction

The hub-spoke architecture is becoming a standard in companies due to its ability to centralize network management, enhance security, improve scalability, and streamline connectivity between various components within the network infrastructure. In Azure, this architecture is frequently based on Azure Firewall; nevertheless, in specific contexts, Azure Application Gateway can offer a cost-effective alternative, ensuring secure and optimized traffic management while reducing overall expenses.

# Disclaimer

Azure Firewall and Azure Application Gateway are [complementary](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/gateway/firewall-application-gateway) not competitive network tools. This article guides you when you can use one instead of the other. As a reminder, here are some limitations of Azure Application Gateway compared to Azure Firewall:

1. Network-level filtering: Azure Application Gateway operates at the application layer, focusing on HTTP/HTTPS traffic. In contrast, Azure Firewall provides network-level filtering, allowing it to inspect and control traffic at both the application and network layers.

2. Advanced security features: Azure Firewall offers a broader range of advanced security features such as intrusion detection and prevention system (IDPS), application-level and network-level threat intelligence, and integrated threat intelligence feeds. Azure Application Gateway can provide Web Application Firewall based on the Open Web Application Security Project (OWASP).

3. Protocol support: Azure Firewall supports a broader range of protocols and ports, including non-HTTP/HTTPS protocols, making it suitable for various scenarios. On the other hand, Azure Application Gateway is primarily designed for HTTP/HTTPS traffic.

4. Centralized management: Azure Firewall can be centrally managed and configured using Azure Firewall Manager, enabling consistent policies across multiple regions and subscriptions.

5. Scale and performance: Azure Firewall is designed for high scalability and performance, capable of handling large-scale deployments and high throughput. Azure Application Gateway may have limitations in terms of scalability and performance, depending on the specific deployment requirements.

# Architecture impacts and limitations

This section will go over the [reference hub-spoke documentation](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli) from Azure and show the significant impacts it has.

## On-premise communication

The following diagrams show how Azure Firewall can be the bridge between on-premise networks, the cloud or the Internet.

![Firewall based hub-spoke](/assets/2023-06-11-hub-and-spoke-based-on-azure-app-gateway/firewall-based-hub-spoke.png)

Azure Application Gateway is not built to do this job because it works at Layer 7 of the model OSI. Even if possible to obtain some success focussing on HTTP/HTTPS, it is probably a short-term solution.


## Spoke to spoke communication

Spoke to spoke communication can be centralized or not.

### Centralized with Azure Firewall

![Firewall based hub-spoke - spoke to spoke routing](/assets/2023-06-11-hub-and-spoke-based-on-azure-app-gateway/spoke-spoke-routing.png)

That topology is possible with Azure Application Gateway but is limited to HTTP/HTTPS communication. Database protocols or even gRPC and SSH will not be allowed.


### Direct communication

![Firewall based hub-spoke - mesh routing](/assets/2023-06-11-hub-and-spoke-based-on-azure-app-gateway/spoke-spoke-avnm.png)

In that case, the protocol will not be a problem because the communication can be direct between spokes.


# Outbound communication

Inspecting ingress and egress can level up the network security of your platform, particularly if you want to limit data exfiltration. Azure Application Gateway doesn't help with that. If the egress control will be in your backlog soon, go for an Azure Firewall, it will save you time.


# When is it making sense?

Even though there is a lot of restriction, using Azure Application Gateway instead of Azure Firewall is still relevant when you need a cheap hub-spoke for HTTP/HTTPS communication and to allow direct communication between spokes.

Besides, activating the Web Application Firewall (WAF) on your Azure Application Gateway provides a public TLS entry point for each service. This option is unavailable with Azure Firewall; consequently, you must link your Azure Firewall with an Azure Application Gateway.

# Cost saving

Overall, Azure Application Gateway is cheaper than Azure Firewall at runtime. Furthermore, enabling/disabling Azure Application Gateway's WAF option in certain environments costs half its price.

The cost at the time of construction is more difficult to assess. Opening communication based on a range of IP addresses is simple with Azure Firewall. In contrast, HTTP/HTTPS routing associated with a health probe on Azure Application Gateway may seem more complex because it provides Layer 7 capabilities.

But, before rushing for a cheaper solution, analyze the current and future infrastructure. If you need to change your Azure Application Gateway for an Azure Firewall in a few months, pay attention to the build and change cost. Those tools are not differents functions, 

# Summary

Use cases drive the infrastructure and the hub-spoke implementation too. Considering Azure Application Gateway as the entry point of your Azure network can be pertinent and bon marché. But don't forget to look at the big picture of your infrastructure and where it is going. 
