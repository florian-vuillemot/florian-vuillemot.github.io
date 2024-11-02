# Exploring Azure Managed Identity and Its Performance Impact

## Overview of Azure Managed Identity

[Azure Managed Identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/) is a secure, Azure-native authentication solution that allows Azure resources to seamlessly access supported services without requiring manual credential management. This service automatically creates and manages identity lifecycles, providing a straightforward and secure way for applications to connect to Azure services using Microsoft Entra authentication. Although tokens are still used behind the scenes, they are provided and managed by Microsoft Entra.

In the example below, a Python application uploads data to [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/) using Azure Managed Identity.

```python
# managed-identity.py
import time
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Container and blob details (replace with your values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
blob_name = "example_blob.txt"

start_time = time.time()

# Configure Managed Identity and Blob Storage
credential = DefaultAzureCredential()
blob_service_client = BlobServiceClient(
    account_url=f"https://{storage_account_name}.blob.core.windows.net",
    credential=credential
)

blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
blob_client.upload_blob(b"data", overwrite=True)

end_time = time.time()
print(f"Time to authenticate and upload using Managed Identity: {end_time - start_time:0.3f} seconds")
```

**Output:**
```
$ python3 managed-identity.py
Time to authenticate and upload using Managed Identity: 0.154 seconds
```

## Performance Impact of Using Managed Identity

Retrieving a token via Microsoft Entra introduces a slight delay due to the authentication process. Although this delay is minimal, it can be noticeable for performance-sensitive applications, especially on initial access.

Below is a comparison using a [Shared Access Signature (SAS)](https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview) token, which bypasses the Managed Identity token retrieval step.

```python
# sas.py
import time
from azure.storage.blob import BlobClient

# SAS token configuration (replace with your values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
sas_token = "<sas-token>"
blob_name = "example_blob.txt"
sas_url = f"https://{storage_account_name}.blob.core.windows.net/{container_name}/{blob_name}?{sas_token}"

start_time = time.time()

blob_client = BlobClient.from_blob_url(sas_url)
blob_client.upload_blob(b"data", overwrite=True)

end_time = time.time()
print(f"Time to upload using SAS Token: {end_time - start_time:0.3f} seconds")
```

**Output:**
```
$ python3 sas.py
Time to upload using SAS Token: 0.071 seconds
```

Since the SAS token-based method does not require additional time to retrieve a token, the application execution time is smaller.

In this example, uploading data with a SAS token is nearly twice as fast as using Managed Identity. However, as file size increases, the impact of Managed Identity token retrieval becomes less noticeable.

## Initial Authentication Impact Only

The performance impact of Managed Identity authentication primarily occurs at startup or during token renewal. For repeated operations, there is no overhead. The code snippet below demonstrates this with multiple upload operations.

```python
# loop-managed-identity.py
import time
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

# Configuration (replace with your values)
storage_account_name = "<storage-account-name>"
container_name = "<your-container-name>"
blob_name = "example_blob.txt"

# Managed Identity and storage setup
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
    print(f"Time to authenticate and upload using Managed Identity: {end_time - start_time:0.3f} seconds")
```

**Output:**
```
$ python3 loop-managed-identity.py
Time to authenticate and upload using Managed Identity: 0.143 seconds
Time to authenticate and upload using Managed Identity: 0.009 seconds
Time to authenticate and upload using Managed Identity: 0.008 seconds
Time to authenticate and upload using Managed Identity: 0.009 seconds
...
```

As shown, the initial upload takes more time due to authentication, but subsequent uploads are significantly faster since no additional authentication is required.

## Summary

Azure Managed Identity provides a secure and streamlined authentication mechanism, which, while introducing a slight initial delay, offers considerable security benefits without requiring explicit credential management. For use cases where maximum upload speed is critical and authentication overhead is a concern, SAS tokens may be preferable. However, for most scenarios, Managed Identity’s advantages outweigh the minor performance impact.

### Notes and Remarks

- These tests were conducted on an Azure VM in the **North Europe** region, with a **Premium Storage Account** also located in North Europe.
- This article offers an informal performance overview of Managed Identity at a specific time and is not intended as a formal benchmark.
- Sample code leverages the following libraries:
  - `azure-identity`
  - `azure-storage-blob`
- For simplicity, exceptions are not handled in the sample code.