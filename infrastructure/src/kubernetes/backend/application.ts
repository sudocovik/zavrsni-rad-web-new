import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

function provisionDeployment(
    provider: Provider,
    mysqlConfiguration: k8s.core.v1.Secret,
    mysqlService: k8s.core.v1.Service,
    dockerLogin: k8s.core.v1.Secret,
    isLocal: boolean
): k8s.apps.v1.Deployment {
    const labels = { app: 'box-app-backend' }

    return new k8s.apps.v1.Deployment('box-app-backend', {
        spec: {
            selector: { matchLabels: labels },
            replicas: 1,
            template: {
                metadata: { labels: labels },
                spec: {
                    imagePullSecrets: [{ name: dockerLogin.metadata.name }],
                    containers: [{
                        name: 'box-app-backend',
                        image: 'ghcr.io/covik/box-app-backend:' + (isLocal ? 'dev' : 'latest'),
                        imagePullPolicy: 'Always',
                        ports: [{ containerPort: 9000 }],
                        env: [
                            {
                                name: 'LOG_CHANNEL',
                                value: 'stderr'
                            },
                            {
                                name: 'APP_ENV',
                                value: 'production'
                            },
                            {
                                name: 'APP_KEY',
                                value: 'base64:qrEAkmIzeUHTgGJZrFORW2nt7UI9uEBxuNy5dYUZqxA='
                            },
                            {
                                name: 'DB_HOST',
                                value: mysqlService.metadata.name
                            },
                            {
                                name: 'DB_PORT',
                                value: '3306'
                            },
                            {
                                name: 'DB_USERNAME',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfiguration.metadata.name,
                                        key: 'username'
                                    }
                                }
                            },
                            {
                                name: 'DB_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfiguration.metadata.name,
                                        key: 'password'
                                    }
                                }
                            },
                            {
                                name: 'DB_DATABASE',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfiguration.metadata.name,
                                        key: 'databaseName'
                                    }
                                }
                            }
                        ]
                    }, {
                        name: 'box-app-webserver',
                        image: 'ghcr.io/covik/box-app-backend-webserver:latest',
                        imagePullPolicy: 'Always',
                        ports: [{ containerPort: 80 }]
                    }]
                },
            },
        },
    }, { provider })
}

function provisionService(provider: Provider, deployment: k8s.apps.v1.Deployment): k8s.core.v1.Service {
    return new k8s.core.v1.Service('box-app-backend', {
        metadata: { labels: deployment.spec.template.metadata.labels },
        spec: {
            type: 'ClusterIP',
            ports: [{
                port: 80,
                targetPort: 80,
                protocol: 'TCP'
            }],
            selector: deployment.spec.template.metadata.labels,
        },
    }, { provider })
}

export default function (
    provider: Provider,
    mysqlConfiguration: k8s.core.v1.Secret,
    mysqlService: k8s.core.v1.Service,
    dockerLogin: k8s.core.v1.Secret,
    isLocal: boolean
): k8s.core.v1.Service {
    const deployment: k8s.apps.v1.Deployment = provisionDeployment(provider, mysqlConfiguration, mysqlService, dockerLogin, isLocal)
    return provisionService(provider, deployment)
}