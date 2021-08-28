import { getStack } from '@pulumi/pulumi'
import { readFileSync } from 'fs'
import provisionCloudResources from './src/cloud-resources'
import provisionKubernetesManifests from './src/kubernetes'

if (getStack() === 'production') {
    provisionCloudResources().then(provisionKubernetesManifests)
}

if (getStack() == 'local') {
    const kubeconfig = readFileSync('./local/cluster/kubeconfig.yml', 'utf-8')

    provisionKubernetesManifests(kubeconfig, true)
}