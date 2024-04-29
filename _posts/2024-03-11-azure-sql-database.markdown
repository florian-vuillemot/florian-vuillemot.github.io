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
- Serverless: when possible. Problem, if your application is keeping an open connection as webapp does, your serverless will run and you will pay more. To prefer in data scenario.
- Elastic database pools: Share computational power and storage between SQL databases. eDTU is 1.5 more costly then DTU. `tempdb` is also shared but protected by access. A single DB can't use all the I/O due to limit, but multiple limit at the same time can.

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
