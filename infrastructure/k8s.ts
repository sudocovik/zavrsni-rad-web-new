import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

export function configure(provider: Provider, isLocal: boolean = false) {
    const dockerConfigSecret = new k8s.core.v1.Secret('docker-config', {
        metadata: {
            name: 'docker-config'
        },
        data: {
            '.dockerconfigjson': 'ewoJImF1dGhzIjogewoJCSJnaGNyLmlvIjogewoJCQkiYXV0aCI6ICJZMjkyYVdzNloyaHdYMmRPYVRkamFETnhZa1p6VVVGUVZEQkdlRk5XYUZGcmVXOUNkSFF6WmpCWVRVZElSQT09IgoJCX0KCX0KfQ=='
        },
        type: 'kubernetes.io/dockerconfigjson'
    }, { provider })

    const nginxConfig = new k8s.core.v1.ConfigMap('nginx-config', {
        metadata: {
            name: 'nginx-config'
        },
        data: {
            'app.conf': `
              server {
                index index.php;
                server_name localhost;
                error_log  /var/log/nginx/error.log;
                access_log /var/log/nginx/access.log;
                root /app/public;
            
                location ~ \\.php$ {
                    try_files $uri =404;
                    fastcgi_split_path_info ^(.+\\.php)(/.+)$;
                    fastcgi_pass 127.0.0.1:9000;
                    fastcgi_index index.php;
                    include fastcgi_params;
                    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                    fastcgi_param PATH_INFO $fastcgi_path_info;
                }
            
                location / {
                    try_files $uri $uri/ /index.php?$query_string;
                }
              }
            `
        }
    }, { provider })

    const storageClassName = isLocal ? 'manual' : 'do-block-storage'

    if (isLocal) {
        const persistentVolume = new k8s.core.v1.PersistentVolume('default-volume', {
            metadata: {
                name: 'default-volume'
            },
            spec: {
                storageClassName,
                capacity: {
                    storage: '1Gi'
                },
                accessModes: [
                    'ReadWriteOnce'
                ],
                hostPath: {
                    path: '/storage/database'
                }
            }
        }, { provider })
    }

/*
    const mysqlConfig = new k8s.core.v1.Secret('mysql-config', {
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

    const mysqlVolumeClaim = new k8s.core.v1.PersistentVolumeClaim('mysql-volume-claim', {
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

    const mysqlName = 'mysql'
    const mysqlLabels = { app: mysqlName }
    const mysqlDeployment = new k8s.apps.v1.Deployment(mysqlName, {
        spec: {
            selector: { matchLabels: mysqlLabels },
            replicas: 1,
            strategy: {
                type: 'Recreate'
            },
            template: {
                metadata: { labels: mysqlLabels },
                spec: {
                    volumes: [{
                        name: mysqlVolumeClaim.metadata.name,
                        persistentVolumeClaim: {
                            claimName: mysqlVolumeClaim.metadata.name
                        }
                    }],
                    containers: [{
                        name: mysqlName,
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
                            name: mysqlVolumeClaim.metadata.name,
                            mountPath: '/var/lib/mysql'
                        }],
                        env: [
                            {
                                name: 'MYSQL_ROOT_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
                                        key: 'rootPassword'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_USER',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
                                        key: 'username'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
                                        key: 'password'
                                    }
                                }
                            },
                            {
                                name: 'MYSQL_DATABASE',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
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

    const mysqlService = new k8s.core.v1.Service(mysqlName, {
        metadata: {
            labels: mysqlDeployment.spec.template.metadata.labels,
            name: mysqlName
        },
        spec: {
            type: 'ClusterIP',
            ports: [{
                port: 3306,
                targetPort: 3306,
                protocol: 'TCP'
            }],
            selector: mysqlLabels,
        },
    }, { provider })
*/
    const appName = 'box-app'
    const appLabels = { app: appName }
    const boxApp = new k8s.apps.v1.Deployment(appName, {
        spec: {
            selector: { matchLabels: appLabels },
            replicas: 1,
            template: {
                metadata: { labels: appLabels },
                spec: {
                    volumes: [
                        {
                            name: nginxConfig.metadata.name,
                            configMap: {
                                name: nginxConfig.metadata.name
                            }
                        }
                    ],
                    imagePullSecrets: [{ name: dockerConfigSecret.metadata.name }],
                    containers: [{
                        name: appName,
                        image: 'ghcr.io/covik/box-app:latest',
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
                            /*{
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
                                        name: mysqlConfig.metadata.name,
                                        key: 'username'
                                    }
                                }
                            },
                            {
                                name: 'DB_PASSWORD',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
                                        key: 'password'
                                    }
                                }
                            },
                            {
                                name: 'DB_DATABASE',
                                valueFrom: {
                                    secretKeyRef: {
                                        name: mysqlConfig.metadata.name,
                                        key: 'databaseName'
                                    }
                                }
                            }*/
                        ]
                    }, {
                        name: appName + '-webserver',
                        image: 'ghcr.io/covik/box-webserver:latest',
                        imagePullPolicy: 'Always',
                        ports: [{ containerPort: 80 }],
                        volumeMounts: [{
                            name: nginxConfig.metadata.name,
                            mountPath: '/etc/nginx/conf.d/app.conf',
                            subPath: 'app.conf'
                        }]
                    }]
                },
            },
        },
    }, { provider })

    const frontend = new k8s.core.v1.Service(appName, {
        metadata: { labels: boxApp.spec.template.metadata.labels },
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
        },
        values: {
            ingressRoute: {
                dashboard: {
                    enabled: false
                }
            }
        }
    }, {
        provider
    })

    const ingress = new k8s.networking.v1.Ingress('default-ingress', {
        metadata: {
            name: 'default-ingress'
        },
        spec: {
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
