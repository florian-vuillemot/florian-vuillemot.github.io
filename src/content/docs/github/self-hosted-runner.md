---
title: GitHub Self-Hosted Runners on AKS
description: Using GitHub self-hosted runners on AKS.
---

## Introduction

GitHub self-hosted runners allow you to run GitHub Actions workflows on your infrastructure.
This can be beneficial for various reasons, including potential cost savings, better performance, longer jobs, and more environmental control.
This article will cover setting up GitHub self-hosted runners on AKS with external components such as [Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/).

## Authentication Using GitHub Application

Using a [GitHub application](https://docs.github.com/en/apps/overview) for authentication is more secure than a Personal Access Token (PAT).
You must create a GitHub App, configure it with the necessary permissions, and use its credentials in your runner configuration.
You must select the appropriate permissions based on your requirements and generate a private key for the GitHub App.
If you need to [update the permissions](https://docs.github.com/en/apps/maintaining-github-apps/modifying-a-github-app-registration), you can do so in the GitHub App settings and then validate it in your account without regenerating the private key.

We will not cover the GitHub App creation process here, but you can find detailed instructions in the [GitHub documentation](https://docs.github.com/en/apps/creating-github-apps).

## Components

### Update the Base Image

You may need custom tools in your CI and don't want to install them each time in your GitHub Workflow. In that case, you can extend the [default image](https://github.com/actions/runner/pkgs/container/actions-runner) and reference it in the Helm.


### The Controller

First, you must deploy the [GitHub Actions Runner Controller](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/about-actions-runner-controller) on your Kubernetes cluster.
Here is an example of how you can deploy the operator using Helm and Terraform:

```terraform
provider "helm" {
  kubernetes {
    host                   = "<host>"
    client_certificate     = "<client_certificate_in_clear>"
    client_key             = "<client_key_in_clear>"
    cluster_ca_certificate = "<cluster_ca_certificate_in_clear>"
  }
}

resource "helm_release" "github-runner" {
    provider = helm

    chart               = "gha-runner-scale-set-controller"
    name                = "arc"
    namespace           = "arc-systems"
    repository          = "oci://ghcr.io/actions/actions-runner-controller-charts/"
    version             = "0.10.1"
    create_namespace    = true

    # You can defined additional configuration here.
    values = [
<<EOF
nodeSelector:
  github-listener: "yes"
EOF
    ]
}
```

### The Scale Set

Next, you need to deploy the [GitHub Actions Runner Scale Set](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners-with-actions-runner-controller/deploying-runner-scale-sets-with-actions-runner-controller).
This component will run the workflow job.
The following example defined more than the necessary configuration to give you an idea of what you can do.
The complete list of configurations is available [here](https://github.com/actions/actions-runner-controller/blob/master/charts/gha-runner-scale-set/values.yaml).

```terraform
resource "helm_release" "runner" {
    provider = helm

    chart               = "gha-runner-scale-set"
    name                = "myworkflow"
    namespace           = "myworkflow"
    repository          = "oci://ghcr.io/actions/actions-runner-controller-charts/"
    version             = "0.10.1"
    create_namespace    = true

    values = [
<<EOF
githubConfigUrl: "https://github.com/<account>/<repository>"
githubConfigSecret:
  github_app_id: "<github_app_id>"
  github_app_installation_id: "<github_app_installation_id>"
  github_app_private_key: |
    ${indent(4, <private_key_file_path>)}

listenerTemplate:
  spec:
    containers:
      - name: listener
        securityContext:
          runAsUser: 1000
template:
  spec:
    serviceAccountName: "<my-service-account>"
    initContainers:
    - name: init-dind-externals
      # Here we are using a custom image based on: ghcr.io/actions/actions-runner
      image: "my-custom-image"
      command: ["cp", "-r", "-v", "/home/runner/externals/.", "/home/runner/tmpDir/"]
      volumeMounts:
        - name: dind-externals
          mountPath: /home/runner/tmpDir
    containers:
    - name: runner
      # Here we are using a custom image based on: ghcr.io/actions/actions-runner
      image: "my-custom-image"
      command: ["/home/runner/run.sh"]
      env:
        - name: DOCKER_HOST
          value: unix:///var/run/docker.sock
      volumeMounts:
        - name: work
          mountPath: /home/runner/_work
        - name: dind-sock
          mountPath: /var/run
        # Here an example of mounting secrets from a volume.
        - name: secrets-store01-inline
          mountPath: "/home/runner/.ssh"
          readOnly: false
        - name: secrets-store01-inline
          mountPath: "/etc/ssh"
          readOnly: true
      resources:
        limits:
          cpu: "4"
          memory: 8Gi
        requests:
          cpu: "1"
          memory: 2Gi
    # Sometimes we need more than just the runner container.
    # Here we are adding a MongoDB container that the runner will use during the workflow execution.
    - name: mongo
      image: mongo
      env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "foo"
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: "bar"
        - name: MONGO_INITDB_DATABASE
          value: "foobar"
      # ... Resources configuration and volumes ...
    - name: dind
      image: docker:dind
      args:
        - dockerd
        - --host=unix:///var/run/docker.sock
        - --group=$(DOCKER_GROUP_GID)
      env:
        - name: DOCKER_GROUP_GID
          value: "123"
      securityContext:
        privileged: true
      volumeMounts:
        - name: work
          mountPath: /home/runner/_work
        - name: dind-sock
          mountPath: /var/run
        - name: dind-externals
          mountPath: /home/runner/externals
      # ... Resources configuration and volumes ...
    volumes:
    - name: work
      emptyDir: {}
    - name: dind-sock
      emptyDir: {}
    - name: dind-externals
      emptyDir: {}
    # Mounting a secret from Azure Key Vault
    - name: secrets-store01-inline
      csi:
        driver: secrets-store.csi.k8s.io
        readOnly: true
        volumeAttributes:
          secretProviderClass: "my-secret-provider-class"
    # Retricting the runner to spot instances
    tolerations:
      - key: "kubernetes.azure.com/scalesetpriority"
        operator: "Equal"
        value: "spot"
        effect: "NoSchedule"
EOF
    ]
}
```

## Deep Dive in the Scale Set Configuration

### Service Account with Entra Application

In the example above, we defined a service account for the runner pod.
This service account is used to authenticate with Azure Key Vault to access secrets.
The first step is to create an [Entra application](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/what-is-application-management) and then [federated identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview?tabs=dotnet) credentials for this application using the AKS as the OIDC issuer.

```terraform
data "azuread_client_config" "current" {}

resource "azuread_application_registration" "self" {
  description      = "<description>"
  display_name     = "<display_name>"
  sign_in_audience = "AzureADMyOrg"
}

resource "azuread_application_federated_identity_credential" "self" {
  application_id = azuread_application_registration.self.id
  audiences      = ["api://AzureADTokenExchange"]
  description    = "<description>"
  display_name   = "<name>"
  issuer         = "<kubernetes-oidc-issuer>
  subject        = "system:serviceaccount:<namespace>:<name>"
}

resource "azuread_service_principal" "self" {
  app_role_assignment_required = false
  client_id                    = azuread_application_registration.self.client_id
  description                  = "<description>"
  owners                       = [data.azuread_client_config.current.object_id]

  feature_tags {
    enterprise = true
    gallery    = false
  }
}
```

### Mounting Volume and Secrets

#### Azure Key Vault as Volume

You can mount secrets from Azure Key Vault as volumes in your runner pods, ensuring that sensitive information is securely managed.
Remember to provide the Entra application with the necessary permissions to access the Key Vault.

```terraform
data "azurerm_client_config" "current" {}

resource "kubernetes_manifest" "secrets" {
    provider = kubernetes

    manifest = {
        apiVersion  = "secrets-store.csi.x-k8s.io/v1"
        kind        = "SecretProviderClass"
        metadata = {
            name        = "name"
            namespace   = "namespace"
        }
        spec = {
            provider = "azure"
            parameters = {
                usePodIdentity = "false"
                useVMManagedIdentity = "false"
                clientID = "<entra-application-id>"
                keyvaultName = "<keyvault-name>"
                objects = <<EOF
array:
# Mounts a list of secrets from Azure Key Vault
%{ for secret in var.secrets ~}
  - |
    objectName: ${secret}
    objectAlias: "${secret}"
    objectType: secret
    objectVersion: ""
%{ endfor ~}
                EOF
                tenantId = data.azurerm_client_config.current.tenant_id
            }
        }
    }
}
```

### Multiple Containers

You can run multiple containers alongside the main runner container.
This is useful for running additional services like databases or caching layers.

```terraform
# ...existing code...
    containers:
    - name: mongo
      image: mongo
      env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "foo"
        - name: MONGO_INITDB_ROOT_PASSWORD
          value: "bar"
        - name: MONGO_INITDB_DATABASE
          value: "foobar"
      resources:
        requests:
          cpu: "0.5"
          memory: 1Gi
        limits:
          cpu: "1"
          memory: 2Gi
# ...existing code...
```

### Spot and Machine Specific Usage

This can optimize costs and performance based on your requirements, mainly because only the listener stays permanently up.
It's also helpful to train a model or run a specific task requiring a particular type of machine using GitHub Actions as an orchestrator.

```terraform
# ...existing code...
    tolerations:
      - key: "kubernetes.azure.com/scalesetpriority"
        operator: "Equal"
        value: "spot"
        effect: "NoSchedule"
# ...existing code...
```

Note: I wrote an article about using GitHub Actions as an orchestrator for machine learning tasks; you can find it [here](../serverless-machine-learning/part-1.mdx).

## Unexpected Behaviors

Sometimes, you may encounter unexpected behaviors when using self-hosted runners on Kubernetes.
The worst encountered was the scale set not scaling when the listener asked for a new runner.
This blocked all workflows and impacted the development team.
Even after lengthy troubleshooting, the root cause was not found and we had to delete and redeploy all components.

To fix the problem, we tried removing all namespaces containing a Scale Set and the Controller using Terraform; it was a nightmare.
Namespaces stayed in the deletion status due to some remaining underlying components that can't be deleted.
We finally had to patch some resources to empty the `finalizers` metadata and unblock the situation.

## Conclusion

Using self-hosted runners on Kubernetes provides greater control and flexibility for running GitHub Actions workflows, even if it includes maintenance.
Leveraging the AKS ecosystem allows you to run jobs or cron jobs based on GitHub and an existing infrastructure without having to create another resource.
