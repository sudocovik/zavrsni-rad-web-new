import { Provider } from '@pulumi/kubernetes'
import provisionPersistentVolume from './local-volume'
import provisionDockerLoginSecret from './docker-login'
import provisionMysql from './backend/mysql'

export default function(provider: Provider, isLocal: boolean = false) {
    isLocal && provisionPersistentVolume(provider)
    provisionDockerLoginSecret(provider)
    provisionMysql(provider, isLocal)
}