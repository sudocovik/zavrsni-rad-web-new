import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

function provisionNginxConfiguration(provider: Provider): k8s.core.v1.ConfigMap {
    return new k8s.core.v1.ConfigMap('nginx-config', {
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
}

function provisionDeployment(
    provider: Provider,
    nginxConfiguration: k8s.core.v1.ConfigMap,
    mysqlConfiguration: k8s.core.v1.Secret,
    mysqlService: k8s.core.v1.Service,
    dockerLogin: k8s.core.v1.Secret,
    isLocal: boolean
): k8s.apps.v1.Deployment {
    const labels = { app: 'box-app' }

    return new k8s.apps.v1.Deployment('box-app', {
        spec: {
            selector: { matchLabels: labels },
            replicas: 1,
            template: {
                metadata: { labels: labels },
                spec: {
                    volumes: [
                        {
                            name: nginxConfiguration.metadata.name,
                            configMap: {
                                name: nginxConfiguration.metadata.name
                            }
                        }
                    ],
                    imagePullSecrets: [{ name: dockerLogin.metadata.name }],
                    containers: [{
                        name: 'box-app',
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
                        image: 'ghcr.io/covik/box-webserver:latest',
                        imagePullPolicy: 'Always',
                        ports: [{ containerPort: 80 }],
                        volumeMounts: [{
                            name: nginxConfiguration.metadata.name,
                            mountPath: '/etc/nginx/conf.d/app.conf',
                            subPath: 'app.conf'
                        }]
                    }]
                },
            },
        },
    }, { provider })
}

function provisionService(provider: Provider, deployment: k8s.apps.v1.Deployment): k8s.core.v1.Service {
    return new k8s.core.v1.Service('box-app', {
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
    const nginxConfiguration: k8s.core.v1.ConfigMap = provisionNginxConfiguration(provider)
    const deployment: k8s.apps.v1.Deployment = provisionDeployment(provider, nginxConfiguration, mysqlConfiguration, mysqlService, dockerLogin, isLocal)
    return provisionService(provider, deployment)
}