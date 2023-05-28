---
layout: post
title:  "Azure Bastion Key Vault integration behind the scene"
categories: azure azure-bastion azure-keyvault security zero-trust
---
# Introduction

[Azure Bastion](https://learn.microsoft.com/en-us/azure/bastion/bastion-overview) and [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/overview), two essential security components of Microsoft Azure, work seamlessly together to provide enhanced security and remote access capabilities to your Virtual Machines. But, you may have already faced issues accessing your Azure Key Vault secrets from the Azure Bastion interface when they are both in the network but not your browser. This article aims to explain why.

# Setup

The following architecture is composed of an Azure Virtual Network `vnet-demo` with two subnets `AzureBastionSubnet` and `VMSubnet` respectively for the Azure Bastion `bastion`, a Virtual Machine `vm-demo` and an Azure Key Vault `kvbastionintegration`. `vnet-demo` is setup with default settings and default Network Security Group that enable communications between each component within the network.

![Initial setup](/assets/2023-05-24-azure-bastion-keyvault-integration/init-setup.png)

`kvbastionintegration` is open on the Internet and contains a secret named `vm-password`, which is the virtual machine password for the SSH-based connection on `vm-demo`.

![Initial `kvbastionintegration` network](/assets/2023-05-24-azure-bastion-keyvault-integration/init-kv-network.png)


# Connection

In that basic configuration, the connection to `vm-demo` via `bastion` using `vm-password` in `kvbastionintegration` is possible.

![`vm-password` is available](/assets/2023-05-24-azure-bastion-keyvault-integration/secret-available.png)


# Applying network restrictions

For security reasons, we want to limit `kvbastionintegration` accesses from `AzureBastionSubnet`, `VMSubnet` and trusted Microsoft services.

![`kvbastionintegration` network restriction to the subnet](/assets/2023-05-24-azure-bastion-keyvault-integration/kv-with-network-restrictions.png)

Here's what the updated architecture looks like.
![Infrastructure with network restriction](/assets/2023-05-24-azure-bastion-keyvault-integration/infra-network-close.png)

Unfortunately, this setup leads to denied access to `kvbastionintegration` if we try to access its content from the `bastion` interface.

![Access denied on `kvbastionintegration` secrets](/assets/2023-05-24-azure-bastion-keyvault-integration/access-deny-on-secrets.png)


# Why ?

This can be considered inappropriate at the beginning because the subnet of `bastion` is allowed to communicate with `kvbastionintegration`. The reason is trivial: the secret is not obtained by the backend of the `bastion`, but by your browser. In other words, the integration between Azure Bastion and Azure Key Vault is nothing but a piece of Javascript being executed in your navigator that calls your key vault to get the secret and pass it on to the Azure Bastion. And that explains why the only network that should be allowed on your Azure Key Vault is the one where your browser is in.

# Any proof ?

Let's open your developer console in your navigator and do a network analysis. 

![Access denied to `kvbastionintegration` - network tram](/assets/2023-05-24-azure-bastion-keyvault-integration/access-deny-on-list.png)

Now, if your IP is allowed to `kvbastionintegration`, you can see the list operation first. 
![Key vault list operation](/assets/2023-05-24-azure-bastion-keyvault-integration/kv-list-operation.png)

Then when retrieving the selected secret.
![Key vault get secret value](/assets/2023-05-24-azure-bastion-keyvault-integration/kv-get-operation.png)


# Zero Trust

Azure Bastion delegates responsibility for retrieving the secret to the user's browser for security reasons. Only Azure Key Vault can explicitly verify a user's legitimacy, which involves its network. Allowing Azure Bastion to access an Azure Key Vault because network communication is open between them is a presumption of user legitimacy, which is contrary to the [Zero Trust](https://learn.microsoft.com/en-us/azure/security/fundamentals/zero-trust) model.

# Conclusion

Although it may be disturbing at first glance, this implementation, which works entirely within the user's browser, is yet another demonstration of the Zero Trust model applied by Microsoft to improve the overall security of our platform.
