---
layout: bootstrap
title:  "Azure Virtual Network"
categories: azure azure-vnet azure-subnet security azure-peering azure-routing
---
Azure Virtual Network is a fundamental building block in Microsoft Azure that enables you to securely connect and isolate your Azure resources. It serves as the cornerstone for constructing a flexible, scalable, and highly available cloud infrastructure. It is also the entrypoint for extending your on-premises data center into Azure and privately connect your PAAS services to your IAAS.

{% include alerts/info.html content="**Note:** We will talk about on-premise integration here." %}

# Definition

Defined a Address space max /16 only private IPs.
No encryption inside the VNET. It is the resource responsability. Keep in mind it is a software defined network so the communication is probably in a multi tenant environement. Preview encryption between VM. Traffic between physical datacenter are encrypt natively, but this is all flux (https://learn.microsoft.com/en-us/azure/security/fundamentals/encryption-overview#data-link-layer-encryption-in-azure).
Conteneant du réseaux.
No cost.
Routing + DNS.
Can create multiple VNET with same IP address in the same region. But no peering possible.
Virtual networks and subnets span all availability zones in a region. So no impact in case of datacenter failure.
It's recommended you have fewer large virtual networks rather than multiple small
virtual networks to prevent management overhead.
Provide default DNS.
DNS name is consistent across the network.

MTU fragment packet bytes of 1400 and 1500 for VMs.
Bandwidth: based on the VM size and not the VNET itself.

# Restrictions VNEt

Sending email: https://learn.microsoft.com/en-us/azure/virtual-network/troubleshoot-outbound-smtp-connectivity
Dedicated IPs: 168.63.129.16 and 169.254.169.254
Management IPs in subnet.
UDP restriction
Traceroute restrictions.

# Subnets

Segmentation.
5 IPs for Azure everytime. Smaller /29
where private ip are defined.
Routing + DNS
PAAS (App service) integration Essentielmenet resource outbound in vnet
Can be dedicated to a service.
Default sytem route in each subnet (https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#default). Can not create nor delete system route but override possible with custom routes.
UDR can be shared between subnets.
UDR with service tags.
If the destination address is for one of Azure's services, Azure routes the
traffic directly to the service over Azure's backbone network, rather than routing
the traffic to the Internet. Traffic between Azure services doesn't traverse the
Internet, regardless of which Azure region the virtual network exists in, or which
Azure region an instance of the Azure service is deployed in.
Routing virtual network appliance.
NSG place or on VM but overkilled.
NSG on subnet apply to NICs and so the communication subnet.

Route selection (https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview#how-azure-selects-a-route):
1. Longest prefix
2. UDR
4. System route
Note: Ignore BGP place 3 puisque use case on prem.



## Network security groups

# Peering

Routing et non annonce routes.
Region or global.
global add limitation https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview#constraints-for-peered-virtual-networks
only backbone
nonoverlapping.
Route vNet peering only on subnet with peering. Automatiquement créé.
Cost.
No impact on perf.
Pas de reverse dns lookup (PTR) en dehors du vnet.
Non transitivity.
No name resolution between vnet without custom or private dns.

## Network virtual appliances

Routing between VNET.
Hub-and-Spoke.

# Service Endpoint + private endpoint

SQL server, storage..
Routing direct, pbm de non connaissance des UDR.
Private endpoint: Private endpoints allow ingress of traffic from your virtual network to an Azure resource
securely.
Service endpoints provide secure and direct connectivity to Azure services over the
Azure backbone network. Extend the vnet identity to the target resource. Optimized route via route table.
Service endpoint can be for a resource in another region except for SQL server. Accros subscriptions. Accross tenant for some (kv, storage).
Service endpoint to use with service tag.
Service endpoint can be deployed only in the hub (NVA) vnet for filtering.
Check the routes on the VM.
Service endpoint policies. Contrainient dans (meme région) et peu casser des intégrations avec des PAAS. Peut s'appliquer via policies.
Route VirtualNetworkServiceEndpoint only on subnet. Automatiquement créé.
Service endpoint: no cost.
Service endpoint: Natively configured for failover to the paired region.

# Internet

In/Out bound.
Public IP address, NAT gateway, or public load balancer to manage your inbound + outbound connections.


# Monitoring

NSG events.
+ d'info avec NSG flow loggins mais moins bonne integration. En particulier il y a l'ip.
Next hop with Network Watcher

# Security

DDOS protection plan.
 VNET: Layer 3/4. IPs. Do nothing.
 App: App Gateway
 => Course complet sur DDOS.
Be compliante with Policies.
VMs can't receive packet if not the destination (holding the good ip addr) except if "enable forward IP" is allowed.

# Conclusion

Although it may be disturbing at first glance, this implementation, which works entirely within the user's browser, is yet another demonstration of the Zero Trust model applied by Microsoft to improve the overall security of our platform.


In the VM exemple:
- Stateful connection so network out from the VM
- Outbound connection via NAT Gateway if not public IP.
Application security groups.
DNS configuration VM update to a retry every second (client side retry). This is not the case on Linux.
Enable accelerate networking. Presque aucun impact si les VM ne sont pas dans le meme vnet ou si les deux VMs n'ont pas l'option.
NIC: DNS server applied on.
NIC can get multiple IP to redirect on multiple docker hosted on the VM.
NIC: MTU and fragmentation
Bandwith limit allow is shared between NIC. Only on outbound.
