import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'
import { Output } from '@pulumi/pulumi'
import createProvider from './provider'
import provisionPersistentVolume from './local-volume'
import provisionDockerLoginSecret from './docker-login'
import provisionBackendApplication from './backend'
import provisionFrontendApplication from './frontend'
import provisionIngress from './ingress'

export default function(kubeconfig: Output<string> | string, isLocal: boolean = false) {
    const provider: Provider = createProvider(kubeconfig)

    isLocal && provisionPersistentVolume(provider)
    const dockerLogin: k8s.core.v1.Secret = provisionDockerLoginSecret(provider)

    const backendApplication: k8s.core.v1.Service = provisionBackendApplication(provider, dockerLogin, isLocal)
    const frontendApplication: k8s.core.v1.Service = provisionFrontendApplication(provider, dockerLogin)

    provisionIngress(provider, frontendApplication, backendApplication, isLocal)
}