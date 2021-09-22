import { getStack } from '@pulumi/pulumi'
import { readFileSync } from 'fs'
import provisionCloudResources from './src/cloud-resources'
import provisionKubernetesManifests from './src/kubernetes'

const clusterToken: string = process.env.CLUSTER_TOKEN ?? ''

if (getStack() === 'production') {
    provisionCloudResources(clusterToken).then(provisionKubernetesManifests)
}

if (getStack() == 'local') {
    const kubeconfig = readFileSync('./local/cluster/kubeconfig.yml', 'utf-8')

    provisionKubernetesManifests(kubeconfig, true)
}