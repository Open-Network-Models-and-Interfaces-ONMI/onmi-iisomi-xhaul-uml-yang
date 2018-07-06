#!/bin/bash

url="http://$1:8181/database/mwtn/required-networkelement/_search";
data='{"size":999,"query":{"match_all":{}}}';

curl -v -d $data -H "Content-Type: application/json" -X POST $url
