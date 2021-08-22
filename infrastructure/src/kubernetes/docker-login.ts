import * as k8s from '@pulumi/kubernetes'
import { Provider } from '@pulumi/kubernetes'

export default function (provider: Provider): k8s.core.v1.Secret {
    return new k8s.core.v1.Secret('docker-config', {
        metadata: {
            name: 'docker-config'
        },
        data: {
            '.dockerconfigjson': 'ewoJImF1dGhzIjogewoJCSJnaGNyLmlvIjogewoJCQkiYXV0aCI6ICJZMjkyYVdzNloyaHdYMmRPYVRkamFETnhZa1p6VVVGUVZEQkdlRk5XYUZGcmVXOUNkSFF6WmpCWVRVZElSQT09IgoJCX0KCX0KfQ=='
        },
        type: 'kubernetes.io/dockerconfigjson'
    }, { provider })
}