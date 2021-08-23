import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

function provisionTraefikController(provider: Provider, isLocal: boolean): k8s.helm.v3.Chart {
    const additionalValues = !isLocal ? {} : {
        service: {
            type: 'NodePort'
        },
        ports: {
            web: {
                nodePort: 32080
            }
        }
    }

    return new k8s.helm.v3.Chart('traefik-ingress', {
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
            },
            ...additionalValues
        }
    }, {
        provider
    })
}

function provisionIngress(provider: Provider, frontendApplication: k8s.core.v1.Service, backendApplication: k8s.core.v1.Service): k8s.networking.v1.Ingress {
    return new k8s.networking.v1.Ingress('default-ingress', {
        metadata: {
            name: 'default-ingress'
        },
        spec: {
            rules: [{
               http: {
                   paths: [{
                       path: '/api',
                       pathType: 'Prefix',
                       backend: {
                           service: {
                               name: backendApplication.metadata.name,
                               port: {
                                   number: backendApplication.spec.ports[0].port
                               }
                           }
                       }
                   }, {
                       path: '/',
                       pathType: 'Prefix',
                       backend: {
                           service: {
                               name: frontendApplication.metadata.name,
                               port: {
                                   number: frontendApplication.spec.ports[0].port
                               }
                           }
                       }
                   }]
               }
            }]
        }
    }, { provider })
}

export default function (
    provider: Provider,
    frontendApplication: k8s.core.v1.Service,
    backendApplication: k8s.core.v1.Service,
    isLocal: boolean
) {
    provisionTraefikController(provider, isLocal)
    provisionIngress(provider, frontendApplication, backendApplication)
}