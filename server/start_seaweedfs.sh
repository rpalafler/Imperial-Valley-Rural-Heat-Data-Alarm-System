#!/bin/bash

## #################################################### ##
##      GLOBAL VARIABLES FOR IP ADDRESS & PORTS         ##
## #################################################### ## 
# Data Storage IP Address
IP_ADDRESS="127.0.0.1"

# Main Server Port
MAIN_SERVER_PORT='9333'

# Data Volume Port
VOLUME_SERVER_PORT='8080'

# Filer Port
FILER_SERVER_PORT='8888'

# S3 API Gateway Port
S3_GATEWAY_PORT='8333'
## #################################################### ##  
## #################################################### ##



## ######################################################### ##
##   INITIATING THE MAIN, DATA VOLUME, FILER, & S3 SERVERS   ##
## ######################################################### ## 
# Start the main server
echo 'Waiting for main storage server to initialize...'
weed master -ip ${IP_ADDRESS} -port ${MAIN_SERVER_PORT} &
sleep 10
echo 'Main Server started.'

# Start the volume server
echo 'Waiting for volume storage server to initialize...'
weed volume -dir /mnt/c/climate_storage/data -ip ${IP_ADDRESS} -port ${VOLUME_SERVER_PORT} -mserver ${IP_ADDRESS}:${MAIN_SERVER_PORT} &
sleep 10
echo 'Volume storage server started.'

# Start the filer storage system
echo 'Waiting for the file storage system to intialize...'
weed filer -master ${IP_ADDRESS}:${MAIN_SERVER_PORT} -ip ${IP_ADDRESS} -port ${FILER_SERVER_PORT} &
sleep 10
echo 'Filer storage system started.'

# Start the S3 API gateway
echo 'Waiting for the S3 API gateway to initialize...'
weed s3 -filer ${IP_ADDRESS}:${FILER_SERVER_PORT} -port ${S3_GATEWAY_PORT} &
sleep 10
echo 'S3 API gateway is ready.'
## ######################################################### ##