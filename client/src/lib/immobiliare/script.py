



# # make a call to this endpoint but change the pag=? untill < "maxPages": 5733
# # https://www.immobiliare.it/api-next/search-list/real-estates/?fkRegione=lom&idNazione=IT&idContratto=1&idCategoria=1&__lang=it&pag=1&paramsCount=0&path=%2Fvendita-case%2Flombardia%2F

# # read the response

# # save into the database the results field

# # index the database based on the latitude & longitude

# # python installation
# # python -m venv real-estate-env  # Replace "my_venv" with your desired name

# # Windows:
# # real-estate-env\Scripts\activate

# # MacOs:
# #  source my_venv/bin/activate

# # install libraries:
# # pip install requests json pymongo

# # deactivate venv when finish:
# # deactivate

# import requests
# import json
# import time
# import pymongo
# from pymongo import MongoClient
# import math
# from geopy.geocoders import Nominatim
# from geopy.exc import GeocoderTimedOut, GeocoderServiceError
# import random
# from datetime import date, datetime

# # Static params

# # Define base URL and parameters
# base_url = "https://www.immobiliare.it/api-next/search-list/real-estates/"
# params = {
#     "fkRegione": "lom",
#     "idNazione": "IT",
#     "idContratto": 1,
#     "idCategoria": 1,
#     "__lang": "it",
#     "paramsCount": 0,
#     "path": "/vendita-case/lombardia/",
# }
# # nuove-costruzioni
# # Set maximum pages
# max_pages = 5728

# # Database connection (replace with your specific library and connection details)
# client = MongoClient("mongodb://root:password@localhost:27017/")
# db = client["real-estate"]
# collection = db["realestates"]






# def initRealEstatePresentField():
#     # Update all 'present' fields in the MongoDB collection to False
#     result = collection.update_many({}, {"$set": {"present": False}})
#     print(f"Matched {result.matched_count} documents and modified {result.modified_count} documents.")

# def deleteRealEstateMarkedToDelete(): # if present field is "false" = marked to delete
#     # Delete all documents where 'present' is False
#     delete_result = collection.delete_many({"present": False})
#     print(f"Deleted {delete_result.deleted_count} documents.")

# def get_bounding_box(city_name):
#     # geolocator = Nominatim(user_agent="geoapiExercises")
#     geolocator = Nominatim(user_agent="Geolocation")
#     # print("geolocator ", geolocator)
    
#     try:
#         location = geolocator.geocode(city_name)
        
#         if location:
#             return location.raw['boundingbox']
#         else:
#             print(f"Could not find bounding box for {city_name}")
#             return None
#     except (GeocoderTimedOut, GeocoderServiceError) as e:
#         print(f"Error: {e}")
#         return None

# def generate_random_coordinates_within_city(city_name):
#     bounding_box = get_bounding_box(city_name)
    
#     if not bounding_box:
#         return None

#     min_lat, max_lat = float(bounding_box[0]), float(bounding_box[1])
#     min_lon, max_lon = float(bounding_box[2]), float(bounding_box[3])

#     random_lat = random.uniform(min_lat, max_lat)
#     random_lon = random.uniform(min_lon, max_lon)

#     return [random_lon, random_lat]

# def set_mq_price(res):
#     try:
#         if (
#             "realEstate" in res and
#             "properties" in res["realEstate"] and
#             len(res["realEstate"]["properties"]) > 0 and
#             res["realEstate"]["properties"][0] is not None and
#             "surface" in res["realEstate"]["properties"][0] and
#             res["realEstate"]["properties"][0]["surface"] is not None
#         ):
#             surface = res["realEstate"]["properties"][0]["surface"]
#             surface_val = int(surface.split(" ")[0])

#             res["realEstate"]["price"]["mq_price"] = math.ceil(res["realEstate"]["price"]["value"] / surface_val)
#         else:
#             print(f"Missing or invalid surface information for property {res.get('realEstate', {}).get('id', 'unknown')}.")
#             res["realEstate"]["price"]["mq_price"] = 0
            
#     except (ValueError, KeyError):
#             print(f"Error processing property {res['realEstate']['id']}: invalid surface value or missing key.")
#             res["realEstate"]["price"]["mq_price"] = 0

# def check_realEstate(id):
#     res = collection.find_one({"realEstate.id": id})
#     # update to the database
#     collection.update_many({"realEstate.id": id}, {"$set": {"present": True}})
#     return res is not None

# def fillRealEstateLocField(res):
#     if res["realEstate"]["properties"][0]["location"]["longitude"] is not None:
#         res["realEstate"]["loc"] = {
#             "type": "Point",
#             "coordinates": [
#                 res["realEstate"]["properties"][0]["location"]["longitude"],
#                 res["realEstate"]["properties"][0]["location"]["latitude"]
#             ]
#         }
#     else:
#         random_coords = generate_random_coordinates_within_city(res["realEstate"]["properties"][0]["location"]["city"])
#         if random_coords:
#             res["realEstate"]["loc"] = {
#                 "type": "Point",
#                 "coordinates": random_coords
#             }
#         else:
#             print("Failed to generate random coordinates.")
    
# def updateResultsItems(results):
#     for res in results:
#         # Check if res is already in the database, else mark it to present and set other ready to delete
#         if(check_realEstate(res["realEstate"]["id"])):
#             res = None
#             continue
        
#         # fill the realEstate.loc field
#         fillRealEstateLocField(res)
        
#         # copy at upper level the default location field
#         res["realEstate"]["location"] = res["realEstate"]["properties"][0]["location"];
        
#         # set insertion date as a string in 'YYYY-MM-DD' format
#         res["realEstate"]["date"] = date.today().isoformat()
        
#         # set default field present to 'True'
#         res["present"] = True
        
#         # set "mq_price"
#         set_mq_price(res)


# def remove_null_objects(results):
#     temp = []
#     for elem in results:
#         if(elem is not None):
#             temp.append(elem)
#     return temp

# def insertion(comune, quartiere):
#     for page in range(80, max_pages):
#         print("page ", page)
#         params["pag"] = page

#         # Make API call
#         response = requests.get(base_url, params=params)

#         # Check for successful responsei
#         if response.status_code == 200:
            
#             # Parse JSON response
#             data = json.loads(response.content)

#             # Extract results (assuming 'results' key holds the data)
#             results = data.get("results", [])
            
#             # Update results items accoirding to additional fields: realEstate.loc, 
#             updateResultsItems(results)
            
#             # Remove null objects
#             results = remove_null_objects(results)

#             # Bulk save into the database
#             if(len(results) != 0):
#                 collection.insert_many(results)

#         else:
#             time.sleep(30)
#             page = page - 1
#             print("response: ", response)
#             print(f"Error: {response.status_code} on page {page}")
        
#         print("ok")
#         time.sleep(10) # Sleep for 3 seconds
        

# def main():
#     # set all 'present' field into the realEstate collection of the database to false
#     initRealEstatePresentField()

#     # start the process of item insertion
#     insertion()

#     # clean the database from the solded realEstates
#     # deleteRealEstateMarkedToDelete()

# # start main script
# main()

# # print the end of the process
# print("Completed processing all pages.")


from pymongo import MongoClient
import requests
import logging
import time
import json
import math
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import random
from datetime import date

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# URL data
HEADERS = {
    'Connection': 'keep-alive',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5089.114 Safari/537.36',
    'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.6',
}
URL = 'https://www.immobiliare.it/api-next/search-list/real-estates/'

# MongoDB setup
client = MongoClient("mongodb://root:password@localhost:27017/", serverSelectionTimeoutMS=5000, socketTimeoutMS=30000)
db = client["real-estate"]
collection_city = db["city"]
collection_city_macrozone = db["city_macrozone"]
collection_real_estate = db["realestates2"]

PROJECTION_DETAILS = {"name": 1, "place_id": 1, "_id": 0}


def build_params(fkRegione, idProvincia, idComune, comune, idMZona, macrozona, page):
    return {
        'fkRegione': fkRegione,
        'idProvincia': idProvincia,
        'idComune': idComune,
        'idMZona': [idMZona] if idMZona else [],
        'idNazione': 'IT',
        'idContratto': 1,
        'idCategoria': 1,
        '__lang': 'it',
        'pag': page,
        'paramsCount': 1,
        'path': f'/vendita-case/{comune}/{macrozona}/' if macrozona else f'/vendita-case/{comune}/',
    }


def initRealEstatePresentField():
    # Update all 'present' fields in the MongoDB collection to False
    result = collection_real_estate.update_many({}, {"$set": {"present": False}})
    logging.info(f"Matched {result.matched_count} documents and modified {result.modified_count} documents.")


def deleteRealEstateMarkedToDelete():
    # Delete all documents where 'present' is False
    delete_result = collection_real_estate.delete_many({"present": False})
    logging.info(f"Deleted {delete_result.deleted_count} documents.")


def get_bounding_box(city_name):
    geolocator = Nominatim(user_agent="Geolocation")
    
    try:
        location = geolocator.geocode(city_name)
        
        if location:
            return location.raw['boundingbox']
        else:
            logging.warning(f"Could not find bounding box for {city_name}")
            return None
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logging.error(f"Error: {e}")
        return None


def generate_random_coordinates_within_city(city_name):
    bounding_box = get_bounding_box(city_name)
    
    if not bounding_box:
        return None

    min_lat, max_lat = float(bounding_box[0]), float(bounding_box[1])
    min_lon, max_lon = float(bounding_box[2]), float(bounding_box[3])

    random_lat = random.uniform(min_lat, max_lat)
    random_lon = random.uniform(min_lon, max_lon)

    return [random_lon, random_lat]


def set_mq_price(res):
    try:
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
            logging.warning(f"Missing or invalid surface information for property {res.get('realEstate', {}).get('id', 'unknown')}.")
            res["realEstate"]["price"]["mq_price"] = 0
            
    except (ValueError, KeyError):
        logging.error(f"Error processing property {res['realEstate']['id']}: invalid surface value or missing key.")
        res["realEstate"]["price"]["mq_price"] = 0


def check_realEstate(id):
    try:
        res = collection_real_estate.find_one({"realEstate.id": id})
        # update to the database
        collection_real_estate.update_many({"realEstate.id": id}, {"$set": {"present": True}})
        return res is not None
    except Exception as e:
        logging.error(f"Error checking real estate: {e}")
        return False


def fillRealEstateLocField(res):
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
            logging.warning("Failed to generate random coordinates.")
    

def updateResultsItems(results):
    tmp = 0
    for res in results:
        # Check if res is already in the database, else mark it to present and set other ready to delete
        if check_realEstate(res["realEstate"]["id"]):
            tmp += 1
            res = None
            continue
        
        logging.info(f"EXISTS: {tmp}")

        # fill the realEstate.loc field
        fillRealEstateLocField(res)
        
        # copy at upper level the default location field
        res["realEstate"]["location"] = res["realEstate"]["properties"][0]["location"]
        
        # set insertion date as a string in 'YYYY-MM-DD' format
        res["realEstate"]["date"] = date.today().isoformat()
        
        # set default field present to 'True'
        res["present"] = True
        
        # set "mq_price"
        set_mq_price(res)


def remove_null_objects(results):
    return [elem for elem in results if elem is not None]


def fetch_and_insert_results(params):
    logging.info(f"Fetching results...")
    
    request = requests.Request("GET", URL, params=params, headers=HEADERS)
    prepared_request = request.prepare()

    # Print the request as a string
    logging.info(f"Request URL: {prepared_request.url}")
    
    response = requests.get(URL, params=params, headers=HEADERS)
    
    logging.info(f"Fetched = {response.status_code}")
    # Check for successful response
    if response.status_code == 200:
        
        # Parse JSON response
        data = response.json()

        # Extract results (assuming 'results' key holds the data)
        results = data.get("results", [])
        
        # Update results items according to additional fields: realEstate.loc, etc.
        updateResultsItems(results)
        
        # Remove null objects
        results = remove_null_objects(results)

        logging.info(f"Parsed")
        
        # Bulk save into the database
        if results:
            try:
                collection_real_estate.insert_many(results)
            except Exception as e:
                logging.error(f"Error inserting documents: {e}")
            
        time.sleep(5)
        return int(data.get("totalAds", 0) / 25) - 1

    else:
        logging.error(f"Error...: {response.status_code}")
        logging.error(f"Response: {response.text}")
        logging.error(f"Params: {params}")
        logging.info(f"Sleeping...")
        time.sleep(15)
        return -1


def insertion():
    # Default solution
    # --------------------------------------------------------
    # cursor = collection_city.find({"location.state": "Lombardia"}, PROJECTION_DETAILS).batch_size(1000)
    
    # current solution
    # --------------------------------------------------------
    # select distict cities
    distinct_cities = collection_real_estate.distinct("realEstate.location.city")
    
    # remove from cursor distict cities
    # Exclude these cities from the cursor query on the city collection
    cursor = collection_city.find(
        {"location.state": "Lombardia", "name": {"$nin": distinct_cities}},
        PROJECTION_DETAILS
    ).batch_size(1000)
    # --------------------------------------------------------
    
    try:
        for comune in cursor:
            page = 1
            name = comune["name"]
            doc = collection_city_macrozone.find_one({"label": name})

            if not doc:
                continue

            logging.info(f"Doc: {doc}")
            
            fkRegione = next((elem["id"] for elem in doc["parents"] if elem["type"] == 0), None)
            idProvincia = next((elem["id"] for elem in doc["parents"] if elem["type"] == 1), None)
            idComune = doc["id"]
            comuneLabel = comune["name"].lower()
            
            if doc.get("macrozones"):
                logging.info(f"Comune & macrozona: {comuneLabel}")
                for macrozona in doc["macrozones"]:
                    logging.info(f"Macrozona: {macrozona}")
                    params = build_params(fkRegione, idProvincia, idComune, comuneLabel, macrozona["id"], macrozona["keyurl"], page)
                    totalPage = fetch_and_insert_results(params)
                    logging.info(f"Page: {page}")
                    page += 1

                    while totalPage is not None and page <= totalPage:
                        params = build_params(fkRegione, idProvincia, idComune, comuneLabel, macrozona["id"], macrozona["keyurl"], page)
                        fetch_and_insert_results(params)
                        page += 1
            else:
                logging.info(f"Comune NO macrozona: {comuneLabel}")
                params = build_params(fkRegione, idProvincia, idComune, comuneLabel, None, None, page)
                totalPage = fetch_and_insert_results(params)

                while page <= totalPage:
                    params = build_params(fkRegione, idProvincia, idComune, comuneLabel, None, None, page)
                    fetch_and_insert_results(params)
                    logging.info(f"Page: {page}")
                    page += 1
    except Exception as e:
        logging.error(f"Error during insertion: {e}")
    finally:
        cursor.close()


def main():
    # Set all 'present' fields in the realEstate collection of the database to false
    # initRealEstatePresentField()

    # Start the process of item insertion
    insertion()

    # Clean the database from the sold realEstates
    # deleteRealEstateMarkedToDelete()
    
if __name__ == "__main__":
    main()
