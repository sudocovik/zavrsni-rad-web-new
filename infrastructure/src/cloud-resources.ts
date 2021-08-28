import { KubernetesCluster, Project, Region, Vpc } from '@pulumi/digitalocean'

export default function() {
    const region: Region = Region.FRA1
    const clusterName: string = 'final-thesis'

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

    return cluster
}