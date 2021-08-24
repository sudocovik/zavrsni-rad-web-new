import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'
import provisionMysql from './mysql'
import provisionApplication from './application'

export default function (provider: Provider, dockerLogin: k8s.core.v1.Secret, isLocal: boolean): k8s.core.v1.Service {
    const {
        configuration: mysqlConfiguration,
        service: mysqlService
    } = provisionMysql(provider, isLocal)
    return  provisionApplication(provider, mysqlConfiguration, mysqlService, dockerLogin)
}