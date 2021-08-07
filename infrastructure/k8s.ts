import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

export function configure(provider: Provider) {
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
                        ports: [{ containerPort: 9000 }]
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
