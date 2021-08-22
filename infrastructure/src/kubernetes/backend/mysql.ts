import * as k8s from '@pulumi/kubernetes'
import { Provider } from '@pulumi/kubernetes'

function provisionConfiguration(provider: Provider): k8s.core.v1.Secret {
    return new k8s.core.v1.Secret('mysql-config', {
        metadata: {
            name: 'mysql-config',
        },
        data: {
            rootPassword: Buffer.from('root-mysql-password', 'utf-8').toString('base64'),
            username: Buffer.from('box-runner', 'utf-8').toString('base64'),
            password: Buffer.from('box-runner-password', 'utf-8').toString('base64'),
            databaseName: Buffer.from('box', 'utf-8').toString('base64')
        }
    }, { provider })
}

function provisionVolumeClaim(provider: Provider, storageClassName: string): k8s.core.v1.PersistentVolumeClaim {
    return new k8s.core.v1.PersistentVolumeClaim('mysql-volume-claim', {
        metadata: {
            name: 'mysql-volume-claim'
        },
        spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
                requests: {
                    storage: '1Gi'
                }
            },
            storageClassName
        }
    }, { provider })
}

function provisionDeployment(provider: Provider, volumeClaim: k8s.core.v1.PersistentVolumeClaim, configuration: k8s.core.v1.Secret): k8s.apps.v1.Deployment {
    const labels = { app: 'mysql' }

    return new k8s.apps.v1.Deployment('mysql', {
        spec: {
            selector: { matchLabels: labels },
            replicas: 1,
            strategy: {
                type: 'Recreate'
            },
            template: {
                metadata: { labels: labels },
                spec: {
                    volumes: [{
                        name: volumeClaim.metadata.name,
                        persistentVolumeClaim: {
                            claimName: volumeClaim.metadata.name
                        }
                    }],
                    containers: [{
                        name: 'mysql',
                        image: 'mysql:8.0',
                        imagePullPolicy: 'IfNotPresent',
                        ports: [{ containerPort: 3006 }],
                        readinessProbe: {
                            tcpSocket: {
                                port: 3306
                            },
                            initialDelaySeconds: 20
                        },
                        volumeMounts: [{
                            name: volumeClaim.metadata.name,
                            mountPath: '/var/lib/mysql'
                        }],
                        env: [
                            {
                                name: 'MYSQL_ROOT_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: configuration.metadata.name,
                                        key: 'rootPassword'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_USER',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: configuration.metadata.name,
                                        key: 'username'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: configuration.metadata.name,
                                        key: 'password'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_DATABASE',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: configuration.metadata.name,
                                        key: 'databaseName'
                                    }
                                }
                            }
                        ]
                    }]
                }
            }
        }
    }, { provider })
}

function provisionService(provider: Provider, deployment: k8s.apps.v1.Deployment): k8s.core.v1.Service {
    return new k8s.core.v1.Service('mysql', {
        metadata: {
            labels: deployment.spec.template.metadata.labels,
            name: 'mysql'
        },
        spec: {
            type: 'ClusterIP',
            ports: [{
                port: 3306,
                targetPort: 3306,
                protocol: 'TCP'
            }],
            selector: deployment.spec.template.metadata.labels,
        },
    }, { provider })
}

export default function (provider: Provider, isLocal: boolean) {
    const storageClassName: string = isLocal ? 'manual' : 'do-block-storage'

    const configuration: k8s.core.v1.Secret = provisionConfiguration(provider)
    const volumeClaim: k8s.core.v1.PersistentVolumeClaim = provisionVolumeClaim(provider, storageClassName)
    const deployment: k8s.apps.v1.Deployment = provisionDeployment(provider, volumeClaim, configuration)
    const service: k8s.core.v1.Service = provisionService(provider, deployment)

    return {
        configuration,
        service
    }
}