## ############################################################################# ##
##           Python FastAPI Server, Pathways, Requests, and Responses            ##
##                    Developed by Ryan Paul Lafler, M.Sc.                       ##
##                     Premier Analytics Consulting, LLC                         ##
##                      rplafler@premier-analytics.com                           ##
##   Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.   ##
## ############################################################################# ##

# SUDO ID Issue with WSL ?
#Open Windows Command Prompt
#RUN : 
### ubuntu config --default-user root
### ubuntu run
### su -
### mount -o remount,rw /
### passwd -u root
### passwd root
### mv /etc/sudoers /etc/sudoers.broken
### apt-get -o Dpkg::Options::="--force-confmiss" install --reinstall sudo
### sudo --version
### sudo -h

# ---------------------------------------------- #
#                 Library Imports                #
# ---------------------------------------------- #
# FastAPI and Uvicorn imports
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse, ORJSONResponse
import s3fs
# import asyncio
from concurrent.futures import ThreadPoolExecutor

# Fast data encoding JSON library
import orjson

import pynio


# ---------------------------------------------- #
#                 App Declaration                #
# ---------------------------------------------- #
# Declare the server application
app = FastAPI()

# Enable and permit Cross-Origin Resource Sharing (CORS)
origins = [
    "http://localhost:5000",
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "http://localhost",
    "http://127.0.0.1",
]

# Enable Middleware in the FastAPI app that to process each request and 
# return each response using the specified pathways
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # allow_methods=["GET", "POST", "PUT", 'DELETE'],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ---------------------------------------------- #
#           App Pathways (GET, POST)             #
# ---------------------------------------------- #
print("Success")
