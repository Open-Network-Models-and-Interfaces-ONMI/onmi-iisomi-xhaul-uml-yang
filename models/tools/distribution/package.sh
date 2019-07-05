#!/bin/bash

################################################################################
# Copyright 2019 higshtreet technologies GmbH
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 
# Author: martin.skorupski@highstreet-technologies.com

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ $# -gt 0 ]; then
  DIR=$1;
fi

pyang -f tree -p $DIR -o all-together.tree *.yang
for yang in $DIR/*.yang
do
  pyang -f tree -p $DIR -o ${yang%%.*}.tree core-model.yang $yang 
done

for yang in $DIR/*.yang
do
  filename=${yang#*$DIR/};
	echo "package ${filename%%.*}"
  zip ${yang%%.*}.yang.0.zip core-model.yang ${filename%%.*}.tree $filename 
done

# mv core-model.zip 