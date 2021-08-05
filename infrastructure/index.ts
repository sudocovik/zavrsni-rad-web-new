import { KubernetesCluster, Region } from '@pulumi/digitalocean'

const cluster: KubernetesCluster = new KubernetesCluster('main-cluster', {
    name: 'main',
    region: Region.FRA1,
    nodePool: {
        name: 'worker',
        size: 's-1vcpu-2gb',
        autoScale: false,
        nodeCount: 1
    },
    version: '1.21.2-do.2',
    autoUpgrade: false,
    surgeUpgrade: false
})
