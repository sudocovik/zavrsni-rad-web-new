import { Provider } from '@pulumi/kubernetes'
import { Output } from '@pulumi/pulumi'

export default function (kubeconfig: Output<string> | string): Provider {
    return new Provider('k8s', { kubeconfig })
}