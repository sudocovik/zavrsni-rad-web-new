import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'
import provisionPersistentVolume from './local-volume'
import provisionDockerLoginSecret from './docker-login'
import provisionMysql from './backend/mysql'
import provisionBackendApplication from './backend/application'

export default function(provider: Provider, isLocal: boolean = false) {
    isLocal && provisionPersistentVolume(provider)
    const dockerLogin: k8s.core.v1.Secret = provisionDockerLoginSecret(provider)
    const {
        configuration: mysqlConfiguration,
        service: mysqlService
    } = provisionMysql(provider, isLocal)
    provisionBackendApplication(provider, mysqlConfiguration, mysqlService, dockerLogin, isLocal)
}