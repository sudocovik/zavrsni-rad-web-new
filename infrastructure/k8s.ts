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
            type: 'ClusterIP',
            ports: [{
                port: 80,
                targetPort: 80,
                protocol: 'TCP'
            }],
            selector: appLabels,
        },
    }, { provider })

    const traefikIngress = new k8s.helm.v3.Chart('traefik-ingress', {
        chart: 'traefik',
        version: '10.1.1',
        fetchOpts: {
            repo: 'https://helm.traefik.io/traefik',
        }
    }, {
        provider
    })

    const ingress = new k8s.networking.v1.Ingress('default-ingress', {
        metadata: {
            name: 'default-ingress'
        },
        spec: {
            ingressClassName: 'traefik',
            defaultBackend: {
                service: {
                    name: frontend.metadata.name,
                    port: {
                        number: frontend.spec.ports[0].port
                    }
                }
            }
        }
    }, { provider })

    return {
        frontendIp: frontend.status.loadBalancer.ingress[0].ip
    }
}
