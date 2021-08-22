import { Provider } from '@pulumi/kubernetes'
import provisionDockerLoginSecret from './docker-login'

export function configure(provider: Provider, isLocal: boolean = false) {
    provisionDockerLoginSecret(provider)
}