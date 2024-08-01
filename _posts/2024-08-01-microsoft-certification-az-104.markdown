---
layout: post
title: "Microsoft learn - Azure Administrator Associate (AZ-104)"
categories: azure feedback microsoft-learn certification az-104 azure-administrator-associate
permalink: microsof-learn/certifications/azure-administrator-associate
---
# Introduction
These are personal notes on the [Azure Administrator Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/) certification. Readers may use and share them, but they do not constitute a certification tutorial.

# My feedback and advices
The AZ 104 is an extensive certification with many topics. What I learned during my preparation wasn't the key to pass the certification. My experience was more important. Something that helped me is using the Azure doc, which is now available during the certification. In fact, as an Azure Engineer, I use the platform every day as my web browser engine and the Azure documentation. Consequently, a quick search gave me the expected answer to non-empirical questions. To summarise, my advice would be to use the platform and search in the doc rather than hit books.

# Azure Resource Manager, Azure CLI and Azure Powershell
## Azure CLI
- Find commands that can help with something: `az find <the-something>`
  - Ex: `az find blob`

## Azure Resource Manager template
- A Resource Manager template can contain the following sections:
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
- An **account** is an identity with some data associated.
- An **Microsoft Entra account** is an **account** in **Microsoft Entra** or another Microsoft cloud service such as **Microsoft 365**.
- An **Azure Tenant** is an instance of **Microsoft Entra**.
- An **Azure Subscription** is used to pay for Azure cloud service and join an **Azure tenant**.

## Microsoft Entra
- Is an identity solution, whereas AD DS is a directory service.
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
      - Global Administrators can always reset their passwords.
      - WriteBack on-premise is possible.
      - Groups or all domain users can register it.
    - Conditional Access.
    - Advanced Group Access Management.
    - Hybrid identities - for on-premises accesses -.
    - Prenium Features.
  - Premium P2:
    - Privileged Identity Management.
    - Identity Protection.
    - Just-in-time access.
    - Identity Governance.
  - Microsoft 365 Business Standard:
    - Does not support writeback on AD.
  - Microsoft Entra Suite:
    - Combine licences:
      - Entra Internet Access.
      - Entra Internal Access.
      - Entra ID Governance.
      - Entra ID Verified ID.
    - Cheaper than two separate licenses.

## User accounts
- Cloud identity: Only defined in Microsoft Entra ID.
- Directory-synchronized identity: From Active Directory.
- Guest user: Outside as another cloud provider, XBOX Live, etc.
- Create or invite by **Global Administrator** or **User Administrator**.
- Can't be restored after 30 days.

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
  - Dynamic user: Based on user attributes.
  - Dynamic device: Based on device attributes and only for **security groups**.


## Administrative units (AU)
- Restrict administrative scope inside the organization.
- Mainly for organizations with independent divisions.
- Can't be nested.
- Groups can be added, but not users of the groups. So AU administrators can't control users outside their AU.

## Entitlement management
- Allows the creation of access packages (typical for a new collaborator).
- Allow self-requests with approvers and time box.
- Access to Sharepoints or applications using Entra.
- Concepts
  - Catalog
    - Resources (1)
    - Access packages
      - Resources (1)
      - Lifecycle
      - Resources Roles
      - Requests
        - In the directory, external users, administrator assignments.
        - Require approval
        - Enable new requests.

# Azure Storage solution
- Azure Blob Storage supports the protocol NFS.
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
  - This is for storing index and sparse data structures.
- Block blob:
  - For large files.
  - Commit process enabling update and modification before updates.
  - Block ID enabling parsing.
- Page blob:
  - Based on 512-bytes pages.
  - For random read/write.
  - Write are immediately committed.
  - Write are 4MiB.
  - Base of Azure Disk.
- Append blob:
  - Mainly for logs and append operations on content.
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
    - Rehydration priority can be specified when asking for rehydration and specified at the blob level:
      - Standard priority:
        - Default option.
        - Up to 15 hours to complete for objects > 10 GB.
      - High priority:
        - Additional cost.
        - Complete in less than 1 hour for objects < 10 GB.
- Blob lifecycle is based on if/then condition.
- Snapshots are not replicated across regions.
- **Client-side encryption** allows users to protect data in transit by encrypting it locally.
- User delegate key secure access via a key provided by Entra.
- The Stored Access Policy grants container permissions and can be associated with SAS to restrict them.
- Object storage replication
  - Change feed on source account.
  - Blob versioning on source and dest => This is why this functionality is unavailable with Hierarchical Namespace on DataLake.
- Redundancy migration can need to perform a conversion in the redundancy panel before or after changing the SKU.
- AzCopy
  - `sync` command, the flag `--delete-destination` deletes files in the dest folder but not the origin.
  - Work with Entra ID and SAS token.
- File share OAuth in hybrid with Kerberos.

## Storage Insights
- Allows sorting
  - Transactions
  - Latency
  - Errors
  - Availability
- Max 200 storage accounts displayed.
- Cross subscription.

# Virtual Machine
- Only support 64-bit systems.
- Diagnostics Extension allows the collection of application logs and performance from a Windows VM and putting them in a storage account.
- Encryption
  - This can be performed while the machine is running.
  - Can target "OS", "DATA" or "All" disks.
- Boot diagnostics
  - It doesn't support the Prenium and ZRS Storage Account.
  - The Storage Account must be in the same region as the VM.
- Fault Domains (physically separeted) max 3.
- The update domain is how VMs are separated in scale set and packet for software updates. Ex: for 6 VMs, an update domain of 2 leads to update VMs by a block of 3.
- Disks
  - Can be attached or detached while the VM is running
  - `Update-AzVM` after attaching or detaching a disk to update the VM state.
- File Mapping with Azure File for VM Windows 2019 or younger.

# Azure Backup
- Contains Backup Center for managing all backups.
- Azure Recovery Services contains a Recovery Service Vault, which stores backup data.
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
- By default all users can create Management Group. Toggle the "Require permissions for creating new management groups" under the root management group.
- The Entra role **User Administrator** allows user management without access to Azure resources.
- The role **User Access Administrator** allows the creation and management of users and groups but not passwords.

# Monitor
- APIs
  - metric:getBatch
    - Retrieved batch data in place of multiple API calls.
    - All resources must be in the same subscription, region and of the same type.

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
- SMB => 445

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
      - The program runs in an endless loop. It can be restarted if it stops.
      - Starts when created.
      - Support remote debugging.
    - Triggered:
      - Can **only** run on one instance. Selected by Azure for load balancing.
      - Start when manually triggered or scheduled.
  - Support basic plan.
  - Can be linked to a web project to run in its context. Otherwise, it can run as web app by itself.
  - For Windows only.
- D1 Shared plan allows 240 CPU minutes /day.
- Scaling
  - Basic => No autoscale and max 3 instances.
  - Standard => Max 10 instances.
  - Premium => Max 30 instances.
  - Isolated => Max 100 instances.
- Backups
  - Support Prenium and Standard storage.
  - Can be restored to an Deployment Slot.
  - Automatic
    - Without settings.
    - Support 0-30 days of retention.
    - Restored in the **same** App Service Plan.
    - 30GB.
    - Hourly.
  - Custom
    - Link the database backup for SQL Database, Azure Database for MySQL/PostgreSQL.
    - Indefinite retention point.
    - Restored in the same or another App Service Plan.
    - 10GB with max 4GB for the database linked.
    - Storaged account required.
    - Can be downloaded.
    - Partial backup.
    - Over VNET.

# Azure Policy
- Evaluation order: Disabled, Append, Deny, Audit.
- Append:
  - Add additional fields when creating/updating resources.
  - If the field already exists but the value is different, then the policy acts as denial and rejects the request.
- DeployIfNotExists effect is only evaluated if the request is a success.

# Network
## Troubleshoot
- **Network Watcher IP Flow** test the outbound connection from the source VM and source port to an IP. If a NSG block the communication, it will display it.
- **Effective Network Security Group** returns network security rules associated with a network interface.
- **Connection troubleshoot** is used to check whether a TCP connection between a source and destination VM exists.
- **Next hop** allows the packets to travel from a VM to somewhere.
## VNEt
- There is no name resolution (DNS) between VNET even if peered.
