---
title: Behind the Cloud — Storage
description: Most application need storage
---

## Introduction

Most applications running on this cluster are for data scrapping and data analysis.
A part of the data are stored on external cloud provider but not all (and in the futur we want the less possible or only encrypted datas), the other part of the data must be stored on the cluster for permanent reason or during the analysis.
Storing data locally, where the application is running is basic with cloud provider, but it's not without work for a rasperry pi cluster!

## Type of data

We have the following kind of application running on the cluster.

| Workload            | Description                                                                                     | Storage requirements                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Data scraping       | Retrieves data from the internet and stores it locally.                                         | Persistent storage or external transfer; potentially high write volume.          |
| Data analysis       | Reads local or remote data to produce statistics, regressions, and other results.               | Fast data access; temporary storage; persistent storage for small results.       |
| Data transformation | Reads data from one or more sources and applies operations such as merging and cleaning.        | Fast access; temporary storage; potentially high output volume.                  |
| Cluster monitoring  | Collects cluster health information, metrics, and logs using tools such as Prometheus and Loki. | Continuous writes; configurable retention; enough capacity for metrics and logs. |


The quantity of data stored is growing at each collection and analysis on older data are frequent. having all the data present and always accessible is frequent (but not automatic). And the quantity of data by application is going from 10GB to 2TB leading to some needs in data disk.

## Hardware

Raspberry Pis typically use SD cards for storage.
However, SD cards offer limited capacity and relatively low read and write performance. Their long-term reliability is also a concern. Even premium SD cards can fail after sustained write-intensive use and may eventually need to be replaced or reformatted.
The storage requirements of our applications made SD cards unsuitable for application data. Their limited durability under heavy workloads would also have reduced the cluster's reliability.
We therefore connected SSDs to the Raspberry Pis using USB-to-SATA adapters. The SD cards are now used only for the operating system.
We also changed several settings to reduce writes to the SD cards. We disabled swap, stored systemd journal logs in RAM, and limited log retention.
Finally, we enabled the higher USB current limit to ensure that the SSDs received enough power.

## Software

### Mounting point

Having a disk plugged in is great but we need to mounted it automatically at each start up of the machine. We did so and decided to mount it at the `/mnt/data` place using the disk UUID.
Just using a mount point on each machine is great for data persistence but lead to complex setup with K3S and persistent volume. The complexity is due to the need of to bind pods using the volume to the machine itself and this kill the simplicity of deployment. This also creates a resilience problem: if a node fails, every application tied to its local storage stops working and this is not the behaviour we expect from a Kubernetes cluster!

### Longhorn

To avoid tying each stateful application to a specific machine, we installed and configured [Longhorn](https://longhorn.io/).
Longhorn provides a storage abstraction between Kubernetes applications and the physical disks. Applications request persistent volumes without needing to know which node stores the data. Longhorn then manages volume attachment, replication, snapshots, and backups across the cluster.

Despite its capabilities, Longhorn was relatively straightforward to deploy and manage. However, our first replication strategy was too optimistic.
We initially stored each volume on two different nodes to remain available if one failed. After adding a third SSD-equipped node, we increased the replica count to three. Although this improved resilience, it also consumed significant disk capacity, CPU, memory, and network bandwidth. Every write had to be replicated between several Raspberry Pis, which placed too much pressure on the cluster during write-intensive workloads.

We therefore reduced some volumes to a single replica. This improved read and write performance, reduced inter-node traffic, and limited storage consumption. In exchange, we accepted that losing the node containing the replica could require restoring the volume from a backup. We also accept that a node failure can affect the resilience of the cluster. This may seem counterintuitive for Kubernetes, but it is a deliberate trade-off based on our limited hardware and acceptable data-loss window.
Longhorn volumes are backed up to Azure Blob Storage. Depending on the application's lifecycle and acceptable data-loss window, backups run every two days or approximately once a week. This compromise matches the nature of our workloads: recent data may occasionally be lost, but it can usually be collected again or recomputed.

Longhorn still gives us the flexibility we originally wanted. Deployments are no longer manually tied to the node containing their data, which keeps their Kubernetes configuration simpler. However, with only one replica for some application, this flexibility should not be confused with storage redundancy: applications can move between nodes, but some data still depends on the node holding its only copy.


### NAS

Longhorn is a great tool helping a lot with data management but the need for storage continue to grow and we decided to use an already present Sysnology NAS present in the lab to store some data. Openning the network from the cluster to the NAS was simple, both are on the same private network and we "just" need to update endpoint and provide secrets to the application. The network between the NAS and the cluster impact a little bit the performance but the NAS throughput couple to its power make the impact really limited. From a network point of view, only one appliance layer 3 separed both configuration.
For application only doing bulk read and write the performance impact is manageable but we got a lot of gain whith database. Moving them from the pi to the NAS allow huge gain due to the NAS power (more cpu and ram) and the direct connection to the disk. We may haven't see this kind of impact if we forced the longhorn volume and application on the same node but we find doing this kind of configuration killing the why we are using longhorn (because we didn't use the sync and only backup).
We also configured the NAS to do backup into the cloud following the same convention. A big problem with the NAS we have is the limit of the automation and we find ourselve doing manual configuration and deployment on the NAS. We may have automated more on it but id didn't look appropriate with the ecosystem. This was a big paint point that almost lead us to quit the NAS solution if the gain for database operation wasn't so important.
Putting all the storage in the NAS to turn the cluster in stateless system would also have been possible. But come with a complexity price, a performance impact on bulk operation and probably performance impact if we had migrate all the state on it due to the number of remote file system we must had created for the task. Finding a solution in the middle was the best to do for the application.

## Conclusion

Storage is not simple, and dedicated storage solution certainly have a place in IT stack. When we started, we wanted to put on in the raspberry pi cluster, but the reality of the situation challenge this dream and increase the complexity of our solution to know have several way of dealing with storage based of the application needs. I guess the moral is to always challenge the tools for what there aims to be.  
