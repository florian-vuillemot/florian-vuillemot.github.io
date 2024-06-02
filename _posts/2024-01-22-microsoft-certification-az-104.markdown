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

## Entitlement management
- Allow to create access packages (typical for a new collaborator).
- Allow self requests with approvers and time box.
- Access to Sharepoint, Application using Entra.
- Concepts
  - Catalog
    - Resources (1)
    - Access packages
      - Resources (1)
      - Lifecycle
      - Resources Roles
      - Requests
        - In directory, external users, administrator assignmeents.
        - Require approval
        - Enable new requests.

# Azure Storage solution
- Azure Blob Storage support the protocol NFS.
- Azure Queue Storage: message can be up to 64KB.
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
  - SMB (port 445) and NFS (port 2049) support.
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
    - Rehydration priority can be specify when asking for rehydration and specify at the blob level:
      - Standard priority:
        - Default option.
        - Up to 15 hours to complete for objects > 10 GB.
      - High priority:
        - Additional cost.
        - Complete in less then 1 hour for objects < 10 GB.
- Blob lifecycle are based on if/then condition.
- Snapshot are not replicated across region.
- **Client-side encryption** allows user to protect data in transit by doing the encryption locally.
- User delegate key is a key secured by Entra.
- The Stored Access Policy is used to grant permissions on containers, and can be associated with SAS to restrict them.
- Object storage replication
  - Change feed on source account.
  - Blob versioning on source and dest => This is why this functionality is not available with Hierarchical Namespace on DataLake.
- Redundancy migration can need to perform a conversion in the redundancy panel before or after changing the SKU.

## Storage Insights
- Allows sorting
  - Transactions
  - Latency
  - Errors
  - Availability
- Max 200 storage accounts displayed.
- Cross subscription.

# Virtual Machine
- Only support 64 bits system.
- Diagnostics Extension allows to collect application logs and performance from a Windows VM and put them in a storage account.
- Encryption
  - Can be performed with the machine running.
  - Can target "OS", "DATA" or "All" disks.

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
- Azure Site Recovery.
  - **High Churn** support for VM like database for a better RPO.
    - Using *Prenium Block Blob* the cost is higher.

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
- By default all users can create Management Group. Toggle the "Require permissions for creating new management groups" under the root management group.

# Alerting
- Rate limit
  - Email alerts: 100/hour.
  - Voice and SMS: 12/hour.

# Azure Container Instances
- Container Groups can be deployed in a subnet:
  - Empty
  - Containing another Container Group.

# Dashboard
- No more then 30 days of data can be displayed.

# Miscellianous
- SFTP => 22
- FTPS => 989 & 990

# Load balancer
- Standard SKU
  - Only supports Standard Public IP.
  - **Deny** inbound connection by default.
  - HTTPS health probe.
  - Backend based on IP or NIC.
  - Allow outbound with NAT.
  - Private link and Global.
- Basic SKU
  - Support Standard and default Public IP.
  - **Allow** inbound connection by default.
  - Only backend based on NIC.
  - No availability zones.
  - No diagnostic.
  - No SLA.

# App Service plan
- WebJobs
  - Continuous or triggered
    - Continuous:
      - Can run on all instances of the linked web app.
      - The program run in a endless loop. If end, it can be restarted.
      - Starts when created.
      - Support remote debugging.
    - Triggered:
      - Can **only** run on one instance. Selected by Azure for load balancing.
      - Start when manually triggered or schedule.
  - Support basic plan.
  - Can be linked to a web project to run in its context. Otherwise, it can run as web app by itself.
  - For Windows only.
  - D1 Shared plan allow 240 CPU minutes /day.

# Azure Policy
- Evaluation order: Disabled, Append, Deny, Audit.
- Append:
  - Add additional field during the creation/update of resource.
  - If field already exists but value different, then the policy acts as deny and rejects the request.
- DeployIfNotExists effect is only evaluated if the request is a success.