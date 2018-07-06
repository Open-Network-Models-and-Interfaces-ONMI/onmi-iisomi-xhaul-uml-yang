#!/bin/bash

url="http://$1:8181/auth/v1/users";
login="-u admin:admin";

# curl -v --data-binary @user-$2.json $login -H "Content-Type: application/json" -X POST $url
# curl -v $login -X DELETE $url/Mickey%20Mouse@onap.org
# curl -v $login -H "Content-Type: application/json" $url
# curl -v $login $url/Mickey%20Mouse@onap.org

urlRole="http://$1:8181/auth/v1/domains/onap.org/users/$2@onap.org/roles";
curl -v $login -H "Content-type:application/json" --data-binary @grant.json -X POST $urlRole 

