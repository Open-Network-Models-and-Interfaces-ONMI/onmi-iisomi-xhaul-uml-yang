#!/bin/bash
# (c) 2018 highstreet technologies
# Clean .m2 repository of the user and delte highstreet applications

echo "Clean .m2 repository from highstreet applications"
rm -rf ~/.m2/repository/com/highstreet
rm -r  ~/.m2/repository/org/opendaylight/mwtn