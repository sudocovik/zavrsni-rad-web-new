import {
    Project,
    Region,
    Vpc,
    KubernetesCluster
} from '@pulumi/digitalocean'
import { getStack, Output } from '@pulumi/pulumi'
import { Provider } from '@pulumi/kubernetes'
import { configure } from './k8s'
import { readFileSync } from 'fs'

const clusterName: string = 'final-thesis'

if (getStack() === 'production') {
    const region: Region = Region.FRA1

    const vpc: Vpc = new Vpc('main-vpc', {
        name: 'final-thesis',
        region
    })

    const cluster: KubernetesCluster = new KubernetesCluster('main-cluster', {
        name: clusterName,
        region,
        nodePool: {
            name: 'worker',
            size: 's-1vcpu-2gb',
            autoScale: false,
            nodeCount: 1
        },
        version: '1.21.2-do.2',
        autoUpgrade: false,
        surgeUpgrade: false,
        vpcUuid: vpc.id
    })

    new Project('main-project', {
        name: 'Final thesis',
        description: 'Resources supporting final thesis',
        purpose: 'Class project / Educational purposes',
        resources: [ cluster.clusterUrn ]
    })

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