import { KubernetesCluster, Region, Vpc } from '@pulumi/digitalocean'

const vpc: Vpc = new Vpc('main-vpc', {
    name: 'final-thesis',
    region: Region.FRA1
})

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
    surgeUpgrade: false,
    vpcUuid: vpc.id
})
