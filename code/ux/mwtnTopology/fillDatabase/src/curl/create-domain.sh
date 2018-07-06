#!/bin/bash

url="http://$1:8181/auth/v1/domains";
data='{"domainid":"onap.org","name":"onap.org","description":"default onap domain","enabled":"true"}';
login="-u admin:admin"

# curl -v --data-binary @domain.json $login -H "Content-Type: application/json" -X POST $url
curl -v $login -H "Content-Type: application/json" $url
