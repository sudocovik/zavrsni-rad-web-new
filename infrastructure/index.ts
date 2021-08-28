import { getStack, Output } from '@pulumi/pulumi'
import { KubernetesCluster } from '@pulumi/digitalocean'
import { readFileSync } from 'fs'
import provisionCloudResources from './src/cloud-resources'
import provisionKubernetesManifests from './src/kubernetes'

if (getStack() === 'production') {
    const cluster: KubernetesCluster = provisionCloudResources()
    const kubeconfig: Output<string> = cluster.kubeConfigs[0].rawConfig

    provisionKubernetesManifests(kubeconfig)
}

if (getStack() == 'local') {
    const kubeconfig = readFileSync('./local/cluster/kubeconfig.yml', 'utf-8')

    provisionKubernetesManifests(kubeconfig, true)
}