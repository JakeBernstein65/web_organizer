#! /bin/bash

PGPASSWORD=student psql -U student -h localhost -d users --file=$1
