import { Input, interpolate, Output } from '@pulumi/pulumi'
import { KubernetesCluster, Project, Region, Vpc } from '@pulumi/digitalocean'

export function createTokenKubeconfig(
    cluster: KubernetesCluster,
    user: Input<string>,
    apiToken: Input<string>,
): Output<string> {
    const clusterName = interpolate`do-${cluster.region}-${cluster.name}`

    return interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.kubeConfigs[0].clusterCaCertificate}
    server: ${cluster.endpoint}
  name: ${clusterName}
contexts:
- context:
    cluster: ${clusterName}
    user: ${clusterName}-${user}
  name: ${clusterName}
current-context: ${clusterName}
kind: Config
users:
- name: ${clusterName}-${user}
  user:
    token: ${apiToken}
`;
}

export default async function(clusterToken: string): Promise<Output<string>> {
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

    return createTokenKubeconfig(cluster, 'admin', clusterToken)
}