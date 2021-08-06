import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

export function configure(provider: Provider) {
    const appName = 'nginx'
    const appLabels = { app: appName }
    const nginx = new k8s.apps.v1.Deployment(appName, {
        spec: {
            selector: { matchLabels: appLabels },
            replicas: 1,
            template: {
                metadata: { labels: appLabels },
                spec: {
                    containers: [{
                        name: appName,
                        image: 'nginx:1.20-alpine',
                        ports: [
                            {
                                hostPort: 80,
                                containerPort: 80
                            }
                        ]
                    }]
                },
            },
        },
    }, { provider })

    const frontend = new k8s.core.v1.Service(appName, {
        metadata: { labels: nginx.spec.template.metadata.labels },
        spec: {
            type: 'LoadBalancer',
            ports: [{
                port: 80,
                targetPort: 80,
                protocol: 'TCP'
            }],
            selector: appLabels,
        },
    }, { provider })

    return {
        frontendIp: frontend.status.loadBalancer.ingress[0].ip
    }
}
