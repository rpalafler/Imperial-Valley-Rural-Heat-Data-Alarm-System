

## --------------------------------------------------------------- ##
##                  Pydantic Validation Methods                    ##
## --------------------------------------------------------------- ##
from pydantic import BaseModel
from typing import List
from datetime import datetime


## --------------------------------------------------------------- ##
##            RTMA Hourly Data Pipeline Python Class               ##
## --------------------------------------------------------------- ##
class Sensor_Data_Submission(BaseModel) :
    year: int
    month: int
    day: int
    hour: int
    climateVar: str

class Sensor_Parse_Data :
    def __init__(self, json_object, ) :
        self.df = json_object
    
    def read(self, ) :
        return self.df