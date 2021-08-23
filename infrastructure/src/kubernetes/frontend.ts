import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

function provisionApplication(provider: Provider, dockerLogin: k8s.core.v1.Secret): k8s.apps.v1.Deployment {
    const labels = { app: 'box-app-frontend' }

    return new k8s.apps.v1.Deployment('box-app-frontend', {
        spec: {
            selector: {
                matchLabels: labels
            },
            replicas: 1,
            template: {
                metadata: { labels: labels },
                spec: {
                    imagePullSecrets: [{ name: dockerLogin.metadata.name }],
                    containers: [{
                        name: 'box-app-frontend',
                        image: 'ghcr.io/covik/box-app-frontend:latest',
                        imagePullPolicy: 'Always',
                        ports: [{
                            name: 'http',
                            containerPort: 80,
                            protocol: 'TCP'
                        }]
                    }]
                }
            }
        }
    }, { provider })
}

function provisionService(provider: Provider, deployment: k8s.apps.v1.Deployment): k8s.core.v1.Service {
    return new k8s.core.v1.Service('box-app-frontend', {
        metadata: { labels: deployment.spec.template.metadata.labels },
        spec: {
            type: 'ClusterIP',
            selector: deployment.spec.template.metadata.labels,
            ports: [{
                port: 80,
                targetPort: deployment.spec.template.spec.containers[0].ports[0].name,
                protocol: 'TCP'
            }]
        }
    }, { provider })
}

export default function (provider: Provider, dockerLogin: k8s.core.v1.Secret): k8s.core.v1.Service {
    const deployment: k8s.apps.v1.Deployment = provisionApplication(provider, dockerLogin)
    return provisionService(provider, deployment)
}