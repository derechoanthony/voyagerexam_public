#!/bin/bash
DB="gato-negro"
UNAME="maria"
PWD="m4r14"
for FILE in *.json; do
    c= basename $FILE .json;
    mongoimport --db=$DB --collection=$c --drop --file=$FILE --host 127.0.0.1:27017 -u $UNAME -p $PWD --authenticationDatabase=admin
done
