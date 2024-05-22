



# make a call to this endpoint but change the pag=? untill < "maxPages": 5733
# https://www.immobiliare.it/api-next/search-list/real-estates/?fkRegione=lom&idNazione=IT&idContratto=1&idCategoria=1&__lang=it&pag=1&paramsCount=0&path=%2Fvendita-case%2Flombardia%2F

# read the response

# save into the database the results field

# index the database based on the latitude & longitude

# python installation
# python -m venv real-estate-env  # Replace "my_venv" with your desired name

# Windows:
# real-estate-env\Scripts\activate

# MacOs:
#  source my_venv/bin/activate

# install libraries:
# pip install requests json pymongo

# deactivate venv when finish:
# deactivate

import requests
import json
import time
import pymongo
from pymongo import MongoClient
import math
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import random


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
# nuove-costruzioni
# Set maximum pages
max_pages = 5728

# Database connection (replace with your specific library and connection details)
client = MongoClient("mongodb://user:password@localhost:27017/")
db = client["real-estate"]
collection = db["realestates"]

# Create an index on "location" with geospatial indexing for latitude and longitude
# collection.create_index([("loc", pymongo.GEO2D)])

def get_bounding_box(city_name):
    # geolocator = Nominatim(user_agent="geoapiExercises")
    geolocator = Nominatim(user_agent="Geolocation")
    # print("geolocator ", geolocator)
    
    try:
        location = geolocator.geocode(city_name)
        
        # print("location ", location)
        
        if location:
            return location.raw['boundingbox']
        else:
            print(f"Could not find bounding box for {city_name}")
            return None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        print(f"Error: {e}")
        return None


def generate_random_coordinates_within_city(city_name):
    bounding_box = get_bounding_box(city_name)
    # print("bounding_box ", bounding_box)
    
    if not bounding_box:
        return None

    min_lat, max_lat = float(bounding_box[0]), float(bounding_box[1])
    min_lon, max_lon = float(bounding_box[2]), float(bounding_box[3])

    random_lat = random.uniform(min_lat, max_lat)
    random_lon = random.uniform(min_lon, max_lon)

    return [random_lon, random_lat]

print(generate_random_coordinates_within_city("Alserio"));

for page in range(1, 15):
    print("page ", page)
    params["pag"] = page

    # Make API call
    response = requests.get(base_url, params=params)

    # Check for successful responsei
    if response.status_code == 200:
        # Parse JSON response
        data = json.loads(response.content)

        # Extract results (assuming 'results' key holds the data)
        results = data.get("results", [])
        
        # print("count ")
        # print(len(results))

        for res in results:
            # print(res)
            # if [res["realEstate"]["properties"][0]["location"]["longitude"]] is not None:
            #     res["realEstate"]["loc"] = { "type": "Point", "coordinates":[res["realEstate"]["properties"][0]["location"]["longitude"], res["realEstate"]["properties"][0]["location"]["latitude"]]}
            # else:
            #     res["realEstate"]["loc"] = { "type": "Point", "coordinates":generate_random_coordinates_within_city(res["realEstate"]["properties"][0]["location"]["city"])}
            
            if res["realEstate"]["properties"][0]["location"]["longitude"] is not None:
                res["realEstate"]["loc"] = {
                    "type": "Point",
                    "coordinates": [
                        res["realEstate"]["properties"][0]["location"]["longitude"],
                        res["realEstate"]["properties"][0]["location"]["latitude"]
                    ]
                }
            else:
                random_coords = generate_random_coordinates_within_city(res["realEstate"]["properties"][0]["location"]["city"])
                if random_coords:
                    res["realEstate"]["loc"] = {
                        "type": "Point",
                        "coordinates": random_coords
                    }
                else:
                    print("Failed to generate random coordinates.")
                    
                    
            res["realEstate"]["location"] = res["realEstate"]["properties"][0]["location"];
            
            try:
            #     if len(res["realEstate"]["properties"]) != 0 and res["realEstate"]["properties"][0] is not None and res["realEstate"]["properties"][0]["surface"] is not None:
            #         # print("surface")
            #         surface = res["realEstate"]["properties"][0]["surface"]
            #         surface_val = int(surface.split(" ")[0])
            #         # print("surface_val")
            #         # print(surface_val)
            #         res["realEstate"]["price"]["mq_price"] = math.ceil(res["realEstate"]["price"]["value"] / int(surface.split(" ")[0]))
                if (
                    "realEstate" in res and
                    "properties" in res["realEstate"] and
                    len(res["realEstate"]["properties"]) > 0 and
                    res["realEstate"]["properties"][0] is not None and
                    "surface" in res["realEstate"]["properties"][0] and
                    res["realEstate"]["properties"][0]["surface"] is not None
                ):
                    surface = res["realEstate"]["properties"][0]["surface"]
                    surface_val = int(surface.split(" ")[0])

                    res["realEstate"]["price"]["mq_price"] = math.ceil(res["realEstate"]["price"]["value"] / surface_val)
                else:
                    print(f"Missing or invalid surface information for property {res.get('realEstate', {}).get('id', 'unknown')}.")
                    res["realEstate"]["price"]["mq_price"] = 0
                    
            except (ValueError, KeyError):
                    print(f"Error processing property {res['realEstate']['id']}: invalid surface value or missing key.")
                    res["realEstate"]["price"]["mq_price"] = 0

        # Bulk save into the database
        collection.insert_many(results)

        # Indexing based on latitude & longitude (replace with your specific library and operations)
        # db.collection_name.create_index([("latitude", pymongo.GEO2D)])  # Example for MongoDB

    else:
        print(f"Error: {response.status_code} on page {page}")
    
    print("ok")
    time.sleep(10) # Sleep for 3 seconds
    

print("Completed processing all pages.")





