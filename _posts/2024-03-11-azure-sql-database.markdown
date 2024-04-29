---
layout: post
title:  "Azure SQL Database"
categories: azure azure-app-gateway hub-and-spoke network
permalink: azure-databases/sql
---
PAAS solution

Consumption
- DTU (database transaction unit): Preconfigure for simplicity, just move the cursor for adaption. Theorically the good ratio between compute, storage and IO. 
 Storage tempdb based on the number of dtu: https://learn.microsoft.com/en-us/azure/azure-sql/database/resource-limits-dtu-single-databases?view=azuresql#tempdb-sizes
- vCore Model: More align with history, maximise the computational power, support Azure Hybrid Benefit and reserved capacity.
 Storage + 30% provisionned for transaction logs but can becomes greater. It is fully managed by azure: https://learn.microsoft.com/en-us/azure/azure-sql/database/single-database-scale?view=azuresql&tabs=azure-portal#impact
 On 32GB per vCore for the tempdb database. tembdb is always on SSD. Cost included in the total price.
- Serverless: General purpose and hyperscale. Problem, if your application is keeping an open connection as webapp does, your serverless will run and you will pay more. To prefer in data scenario.
- Elastic database pools: Share computational power and storage between SQL databases. eDTU is 1.5 more costly then DTU. `tempdb` is also shared but protected by access. A single DB can't use all the I/O due to limit, but multiple limit at the same time can.

Storage Space governance:
=> Prenium and Business Critical.
Both services tiers stored data on local SSD storage or elastic pool. This local storage stock data, transaction logs, tempdb files but also operating system and managed components. This can be retrieve with SQL query but not managed. When the storage  reach the limit, the move occurs online but meanwhile if data still grow the impact on the database can be important including a "out-of-space" error. Same then a scaling operation, there is an impact with a short failover.
source: https://learn.microsoft.com/en-us/azure/azure-sql/database/resource-limits-logical-server?view=azuresql#storage-space-governance

Migration from hyperscale to business critical.

Monitoring and optimization of sql query

=> If too large shrink: https://learn.microsoft.com/en-us/azure/azure-sql/database/file-space-manage?view=azuresql-db&viewFallbackFrom=azuresql
Failover allows to empty the `tempdb` table.

Persistent Version Store (PVC)
- take space during a spike
- speed up recovery
https://learn.microsoft.com/en-us/azure/azure-sql/accelerated-database-recovery?view=azuresql
https://learn.microsoft.com/en-us/azure/azure-sql/database/resource-limits-logical-server?view=azuresql


Quotas: 100DTU == 1Vcore
