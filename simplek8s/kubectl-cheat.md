
```
kubectl apply -f <config_file>
kubectl delete -f <config_file>
kubectl get pods
# Get a little more info
kubectl get pods -o wide
kubectl logs <pod_name>
kubectl replace --force -f <config_file>

kubecl get deployments

# client-deployment is the name of our deployment
# client is the name of the image
kubectl set image deployment/client-deployment client=stephengrider/multi-client:v5
```