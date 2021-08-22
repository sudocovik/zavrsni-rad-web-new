import { getStack, Output } from '@pulumi/pulumi'
import { KubernetesCluster } from '@pulumi/digitalocean'
import { Provider } from '@pulumi/kubernetes'
import { provision as provisionCloudResources } from './src/cloud-resources'
import configure from './src/kubernetes'
import { readFileSync } from 'fs'

if (getStack() === 'production') {
    const cluster: KubernetesCluster = provisionCloudResources()
    const kubeconfig: Output<string> = cluster.kubeConfigs[0].rawConfig

    const cloudKubernetesProvider: Provider = new Provider('cloud-provider', {
        kubeconfig
    })

    configure(cloudKubernetesProvider)
}

if (getStack() == 'local') {
    const localKubernetesProvider: Provider = new Provider('local-provider', {
        kubeconfig: readFileSync('./local/cluster/kubeconfig.yml', 'utf-8')
    })

    configure(localKubernetesProvider, true)
}