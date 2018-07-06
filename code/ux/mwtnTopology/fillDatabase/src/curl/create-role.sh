#!/bin/bash

url="http://$1:8181/auth/v1/roles";
login="-u admin:admin"

curl -v --data-binary @role-$2.json $login -H "Content-Type: application/json" -X POST $url
# curl -v $login -H "Content-Type: application/json" $url




