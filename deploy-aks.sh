#!/usr/bin/env bash

kubectl delete deployment,service,ingress ita-taxonomy-browser -n mdsnamespace
kubectl apply -f kube-config.yml -n mdsnamespace
