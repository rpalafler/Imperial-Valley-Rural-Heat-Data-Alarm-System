#!/bin/bash

# Start the main server
echo 'Waiting for main storage server to initialize...'
weed master -ip 127.0.0.1 -port 9333 &
sleep 5
echo 'Main Server started.'

# Start the volume server
echo 'Waiting for volume storage server to initialize...'
weed volume -dir /mnt/c/climate_storage/data -ip 127.0.0.1 -port 8080 -mserver 127.0.0.1:9333 &
sleep 5
echo 'Volume storage server started.'

# Start the filer storage system
echo 'Waiting for the file storage system to intialize...'
weed filer -master 127.0.0.1:9333 -ip 127.0.0.1 -port 8888 &
sleep 5
echo 'Filer storage system started.'

# Start the S3 API gateway
echo 'Waiting for the S3 API gateway to initialize...'
weed s3 -filer 127.0.0.1:8888 -port 8333 &
sleep 5
echo 'S3 API gateway is ready.'