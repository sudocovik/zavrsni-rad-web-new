import { Provider } from '@pulumi/kubernetes'
import * as k8s from '@pulumi/kubernetes'

export default function (provider: Provider): k8s.core.v1.PersistentVolume {
    return new k8s.core.v1.PersistentVolume('default-volume', {
        metadata: {
            name: 'default-volume'
        },
        spec: {
            storageClassName: 'manual',
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