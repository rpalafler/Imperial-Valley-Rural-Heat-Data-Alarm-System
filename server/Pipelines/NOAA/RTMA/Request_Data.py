## --------------------------------------------------------------------------------------- ##
##  NOAA's Real-Time Mesoscale Analysis (RTMA) Data Pipeline                               ##
## ~ Ensuring Data Structures for FastAPI with Pydantic ~                                  ##
## --------------------------------------------------------------------------------------- ##
##  Ryan Paul Lafler, M.Sc.                                                                ##
##  Copyright 2024 by Ryan Paul Lafler and Premier Analytics Consulting, LLC.              ##
##  E-mail: rplafler@premier-analytics.com                                                 ##
## --------------------------------------------------------------------------------------- ##


## --------------------------------------------------------------- ##
##                  Pydantic Validation Methods                    ##
## --------------------------------------------------------------- ##
from pydantic import BaseModel
from typing import List
from datetime import datetime


## --------------------------------------------------------------- ##
##            RTMA Hourly Data Pipeline Python Class               ##
## --------------------------------------------------------------- ##
class RTMA_Data_Submission(BaseModel) :
    year: str
    month: str
    day: str
    hour: str

class RTMA_Parse_Data :
    def __init__(self, json_object, ) :
        self.df = json_object
    
    def read(self, ) :
        return self.df

