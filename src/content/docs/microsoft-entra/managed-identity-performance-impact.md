# Exploring Azure Managed Identity and Its Performance Impact

## Azure Managed Identity

[Azure Managed Identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/) is a secure, Azure-native authentication solution that allows Azure resources to seamlessly access supported services without requiring manually stored credentials.
This service automatically creates and manages the identity lifecycle, offering an easy and secure method for applications to connect to Azure services using the Microsoft Entra authentication.
Behind the scene, token are still used but provided and managed by Microsoft Entra.

In the following example, a Python application uploads some data to [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/) by using Azure Managed Identity.

```python
$ cat managed-identity.py
import time
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Container and blob details (replace with appropriate values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
blob_name = "example_blob.txt"

start_time = time.time()

# Managed Identity and storage configuration
credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=f"https://{storage_account_name}.blob.core.windows.net",
    credential=credential
)

blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
blob_client.upload_blob(b"data", overwrite=True)

end_time = time.time()
print(f"Time to authenticate and upload using Managed Identity: {end_time - start_time} seconds")

$ python3 managed-identity.py
Time to authenticate and upload using Managed Identity: 0.15455961227416992 seconds
```

## Impact of Retrieving the Managed Identity

Even it may not be visible for an human, retrieving the token using Microsoft Entra is not without impact on the application performance.
Here the same example using a [Shared Access Signature (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview) token.

```python
$ cat sas.py
import time
from azure.storage.blob import BlobClient

# SAS token configuration (replace with appropriate values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
sas_token = "<sas-token>"
blob_name = "example_blob.txt"
sas_url = f"https://{storage_account_name}.blob.core.windows.net/{container_name}/example_blob.txt?{sas_token}"

start_time = time.time()

blob_client = BlobClient.from_blob_url(sas_url)
blob_client.upload_blob(b"data", overwrite=True)

end_time = time.time()
print(f"Time to upload using SAS Token: {end_time - start_time} seconds")

$ python3 sas.py
Time to upload using SAS Token: 0.0714268684387207 seconds
```

Because SAS token-based access avoids additional Managed Identity token retrieval time, it typically allows faster initial file uploads.

Because the data uploaded in small, the impact is in the order of the double.
In other word, using SAS token is near twice faster then using Managed Identity in this case.
Of course, more the data uploaded is consequent, more the impact of retrieving the identity will be negligeable.

## It is only at the startup

Fortunatly the impact of retrieving the identity is only at the startup or during token rotation.
Let's update the first example to demonstrate that:

```python
$ cat loop-managed-identity.py
import time
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Container and blob details (replace with appropriate values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
blob_name = "example_blob.txt"

# Managed Identity and storage configuration
# Important: Puting this peace of code in the loop lead to retrieving an new token on each iteration and so produce no performance gain compare to the first example.
credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=f"https://{storage_account_name}.blob.core.windows.net",
    credential=credential
)

for _ in range(10):
    start_time = time.time()

    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    blob_client.upload_blob(b"data", overwrite=True)

    end_time = time.time()
    print(f"Time to authenticate and upload using Managed Identity: {end_time - start_time} seconds")

$ python3 loop-managed-identity.py
Time to authenticate and upload using Managed Identity: 0.14351415634155273 seconds
Time to authenticate and upload using Managed Identity: 0.00931859016418457 seconds
Time to authenticate and upload using Managed Identity: 0.008269548416137695 seconds
Time to authenticate and upload using Managed Identity: 0.017528057098388672 seconds
Time to authenticate and upload using Managed Identity: 0.007775783538818359 seconds
Time to authenticate and upload using Managed Identity: 0.007443666458129883 seconds
Time to authenticate and upload using Managed Identity: 0.007903337478637695 seconds
Time to authenticate and upload using Managed Identity: 0.0072193145751953125 seconds
Time to authenticate and upload using Managed Identity: 0.011053085327148438 seconds
Time to authenticate and upload using Managed Identity: 0.024396896362304688 seconds
```

## Summary

The value of Managed Identity is important, but its impact can be too important in some uses cases where tokens may still makes sens.

### Notes and remarks

Tests were conducted on an Azure VM in the **North Europe** region with a **Premium Storage Account** also located in North Europe.

This article offer an informel **order of magnitude** on the impact of the Managed Identity at a certain time and is **not** a bencharmk.

The following packages were used with examples:
- `azure-identity`
- `azure-storage-blob`

Exceptions are not handled in the sample code for simplicity.
