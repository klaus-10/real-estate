



# make a call to this endpoint but change the pag=? untill < "maxPages": 5733
# https://www.immobiliare.it/api-next/search-list/real-estates/?fkRegione=lom&idNazione=IT&idContratto=1&idCategoria=1&__lang=it&pag=1&paramsCount=0&path=%2Fvendita-case%2Flombardia%2F

# read the response

# save into the database the results field

# index the database based on the latitude & longitude


import requests
import json
import time
import pymongo
from pymongo import MongoClient

# Define base URL and parameters
base_url = "https://www.immobiliare.it/api-next/search-list/real-estates/"
params = {
    "fkRegione": "lom",
    "idNazione": "IT",
    "idContratto": 1,
    "idCategoria": 1,
    "__lang": "it",
    "paramsCount": 0,
    "path": "/vendita-case/lombardia/",
}

# Set maximum pages
max_pages = 5733

# Database connection (replace with your specific library and connection details)
client = MongoClient("mongodb://user:password@localhost:27017/")
db = client["real-estate"]
collection = db["immobiliare"]

# Create an index on "location" with geospatial indexing for latitude and longitude
# collection.create_index([("loc", pymongo.GEO2D)])

# for page in range(1, 1 + 1):
#     params["pag"] = page

#     # Make API call
#     response = requests.get(base_url, params=params)

#     # Check for successful response
#     if response.status_code == 200:
#         # Parse JSON response
#         data = json.loads(response.content)

#         # Extract results (assuming 'results' key holds the data)
#         results = data.get("results", [])
        
#         for res in results:
#             print(res)
#             res["realEstate"]["loc"] = { "type": "Point", "coordinates":[res["realEstate"]["properties"][0]["location"]["latitude"], res["realEstate"]["properties"][0]["location"]["longitude"]]}
        
#         # Bulk save into the database
#         collection.insert_many(results)

#         # Indexing based on latitude & longitude (replace with your specific library and operations)
#         # db.collection_name.create_index([("latitude", pymongo.GEO2D)])  # Example for MongoDB

#     else:
#         print(f"Error: {response.status_code} on page {page}")
    
#     print("ok");
#     time.sleep(5) # Sleep for 3 seconds
    

print("Completed processing all pages.")
