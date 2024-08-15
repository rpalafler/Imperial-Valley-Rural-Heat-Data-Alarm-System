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
import fastapi
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse, ORJSONResponse
# Fast data encoding JSON library
import orjson


# ---------------------------------------------- #
#  Data Pipeline Validation (Pydantic) Imports   #
# ---------------------------------------------- #
from Pipelines.NOAA.RTMA.Request_Data import RTMA_Data_Submission, RTMA_Parse_Data


# ---------------------------------------------- #
#            Data Pipeline Imports               #
# ---------------------------------------------- #
from Pipelines.NOAA.RTMA.RTMA_Pipe import RTMA_Data_Pipe


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
origins = ['*']

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

# RTMA Data Pipeline --> Post User Request (POST operation)
@app.post('/send_RTMA_request')
async def send_RTMA_request( data: RTMA_Data_Submission ) :
    # Pydantic interpretation of user request for RTMA data
    df = RTMA_Parse_Data( json_object = data )
    df = jsonable_encoder(df.read())

    # Retrieve and format user's variable selections
    year = str(df['year'])
    month = str(df['month'])
    day = str(df['day'])
    hour = str(df['hour'])

    # Redirect the formatted user's request to the GET URL for RTMA Data
    return RedirectResponse(
        f'get_RTMA_request/?year={year}&month={month}&day={day}&hour={hour}', status_code=303
    )



# RTMA Pipeline --> Retrieve Data Request (GET User Request)
@app.get('/get_RTMA_request', response_class=ORJSONResponse)
async def get_RTMA_request( year:str, month:str, day:str, hour:str ) :
    # Establish unique connection to RTMA Pipeline
    conn_rtma = RTMA_Data_Pipe()

    # Retrieve queried RTMA Dataset
    ds = conn_rtma.retrieve_hourly_dask(
        year = year,
        month = month,
        day = day ,
        hour = hour
    )

    # Generate JSON-structure containing visualization, data arrays, and metadata
    vis_json = conn_rtma.produce_vis_json(
        u = ds[0],
        v = ds[1],
        climate_var = ds[2]
    )

    # Serve the requested ORJSON-encoded data to the client
    return ORJSONResponse(vis_json)




# RETRIEVE (GET) DATA FROM SERVER BACK TO CLIENT (BACKEND --> FRONTEND)
# Python processing classes & methods

