import { Region, Vpc, KubernetesCluster,  } from '@pulumi/digitalocean'

const region: Region = Region.FRA1

const vpc: Vpc = new Vpc('main-vpc', {
    name: 'final-thesis',
    region: region
})

const cluster: KubernetesCluster = new KubernetesCluster('main-cluster', {
    name: 'main',
    region: region,
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
