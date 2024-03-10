---
layout: post
title:  "Microsoft learn - Azure Administrator Associate (AZ-104)"
categories: azure azure-devops devops github feedback microsoft-learn certification az-104 azure-administrator-associate
permalink: microsof-learn/certification/azure-administrator-associate
---
# Introduction
Personal notes on the [Azure Administrator Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/) certification.

These notes are personal documentation on Az-104 certification. Readers may use and share them if they wish, but they do not constitute a tutorial on certification.

- [ ] Virtual networks
- [ ] Storage
- [ ] Compute
- [ ] Identity
- [ ] Security
- [ ] Governance

# Azure Resource Manager, Azure CLI and Azure Powershell
## Azure CLI
- Find commands that can help with something: `az find <the-something>`
  - Ex: `az find blob`

## Azure Resource Manager template
- A Resource Manager template can contain following sections:
```
{
    "$schema": "http://schema.management.​azure.com/schemas/2019-04-01/deploymentTemplate.json#",​ - required -
    "contentVersion": "",​ - required -
    "parameters": {},​
    "variables": {},​
    "functions": [],​
    "resources": [],​ - required -
    "outputs": {}​
}
```
- Resource Manager template Parameters can contain:
```
"parameters": {
    "<parameter-name>" : {
        "type" : "<type-of-parameter-value>",
        "defaultValue": "<default-value-of-parameter>",
        "allowedValues": [ "<array-of-allowed-values>" ],
        "minValue": <minimum-value-for-int>,
        "maxValue": <maximum-value-for-int>,
        "minLength": <minimum-length-for-string-or-array>,
        "maxLength": <maximum-length-for-string-or-array-parameters>,
        "metadata": {
        "description": "<description-of-the parameter>"
        }
    }
}
```
- Max 256 parameters by Resource Manager templates.

# Identity
- An **identity** is an object that can be authenticated.
- An **account** is an identity with data associate.
- An **Microsoft Entra account** is an **account** in **Microsoft Entra** or another Microsoft cloud service such **Microsoft 365**.
- An **Azure Tenant** is an instance of **Microsoft Entra**.
- An **Azure Subscription** is used to pay for Azure cloud service and join to an **Azure tenant**.

## Microsoft Entra
- Is a identity solution whereas AD DS is a directory service.
- Support HTTP/HTTPS protocols: SAML, WS-Federation and OpenID Connect.
- Federation services and third-party - Google, Facebook, etc. -.
- Flat structure, no Organization Units or Group Policy Objects.
- Licences:
  - Free:
    - Max 500 000 directory objects.
  - Microsoft 365 Apps:
    - Unlimited directory objects.
    - Identity and Access Management for M365 apps.
  - Premium P1:
    - Self-service password reset (SSPR) for on-premises users.
      - Global Administrator can always reset their passwords.
    - Conditional Access.
    - Advanced Group Access Management.
    - Hybrid identites - for on-premises accesses -.
    - Prenium Features.
  - Premium P2:
    - Identity Protection.
    - Just-in-time access.
    - Identity Governance.

## User accounts
- Cloud identity: Only defined in Microsoft Entra ID.
- Directory-synchronized identity: From Active Directory.
- Guest user: Outside as other cloud provider, XBOX Live, etc.
- Create or invite by **Global Administrator** or **User Administrator**.
- Can be restored after 30 days.

## Group accounts
- Security groups:
  - To manage member and computer accesses.
  - To group security policy and permissions.
  - Can be implemented by **Microsoft Entra Administrator**
- Microsoft 365 groups:
  - For collaborative opportunities.
  - Shared mailbox, calendar, files, etc.
- Add users to a group:
  - Assigned.
  - Dynamic user: Based on users attributes.
  - Dynamic device: Based on device attributes and only for **security groups**.


## Administrative units
- Restrict administrative scope inside the organization.
- Mainly for organization with independent divisions.
- Can't be nested.
- Groups can be added but not users of the groups. So AU adminstrator can't control users outside their AU.

# Azure Storage solution
- Azure Blob Storage support the protocol NFS.
- Azure Queue Storage: messge can be up to 64KB.
- Standard general-purpose v2 support services:
  - Blob Storage - including Data Lake Storage -.
  - Queue Storage.
  - Table Storage.
  - Azure Files.
- Premium block blobs:
  - Blob Storage - including Data Lake Storage -.
  => Block blobs and append blobs. For smaller objects and low storage latency.
- Premium file share:
  - Azure Files.
  - SMB and NFS support.
- Premium page blobs:
  - Page blobs only.
  - For storing index and sparse data structures.
- Block blob:
  - For large files.
  - Commit process enabling update and modification before updates.
  - Block ID enabling parsing.
- Page blob:
  - Based on 512-bytes pages.
  - For random read/write.
  - Write are immediatly committed.
  - Write are 4MiB.
  - Base of Azure Disk.
- Append blob:
  - For logs and append operation on content.
  - Blocks can be up to 4MiB.
  - Max 195GiB.
- Map custom domain:
  - CNAME for HTTP.
  - Azure Front Door or Azure CDN for HTTPS.
- Tier
  - Hot:
    - Availability: 99.9%
    - Availability (RA-GRS): 99.99%
  - Cool:
    - Min storage retention: 30 days.
    - Availability: 99%
    - Availability RA-GRS: 99.9%
  - Cold:
    - Min storage retention: 90 days.
    - Availability: 99%
    - Availability RA-GRS: 99.9%
  - Archive:
    - Min storage retention: 180 days.
    - Redundancy conf: LRS, GRS, RA-GRS.
- Blob lifecycle are based on if/then condition.
- Snapshot are not replicated across region.
- **Client-side encryption** allows user to protect data in transit by doing the encryption locally.
- User delegate key is a key secured by Entra.
- The Stored Access Policy is used to grant permissions on containers, and can be associated with SAS to restrict them.

# Virtual Machine
- Only support 64 bits system.

# Azure Backup
- Contains Backup Center for managing all backups.
- Azure Recovery Services contains a Recovery Service Vault which store backup data.
- For Azure Files, data are store on the storage account.
- The replication is not updatable when the backup is configured.
- Microsft Azure Recovery Services (MARS) agent for on-premise.
  - Only for Windows.
  - Compatible with Microsoft Azure Backup Server (MABS) and System Center Data Protection Manager (DPM) server.
  - Data are saved on Azure.
  - Can save only a file or folder.

# Permissions
- Azure roles manages Azure ressources as VM or blob.
- Entra roles manages access to Entra resources like user accounts and password.
  - Global Administrator.
  - User Administrator.
  - Billing Administrator.
- Member users are all user who are not guest and not admin.
- Member users can invite guest users.
- Use Entra B2B for collaboration between companies.
- Roles are provided with the combination of Roles Definitions, Scopes an the Security Principal targetted.

