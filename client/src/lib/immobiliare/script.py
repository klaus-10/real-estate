



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
client = MongoClient("mongodb://root:password@localhost:27017/")
db = client["real-estate"]
collection = db["immobiliare"]

# Create an index on "location" with geospatial indexing for latitude and longitude
# collection.create_index([("loc", pymongo.GEO2D)])

for page in range(1, 15):
    params["pag"] = page

    # Make API call
    response = requests.get(base_url, params=params)

    # Check for successful responsei
    if response.status_code == 200:
        # Parse JSON response
        data = json.loads(response.content)

        # Extract results (assuming 'results' key holds the data)
        results = data.get("results", [])
        
        print("count ")
        print(len(results))

        for res in results:
            # print(res)
            res["realEstate"]["loc"] = { "type": "Point", "coordinates":[res["realEstate"]["properties"][0]["location"]["longitude"], res["realEstate"]["properties"][0]["location"]["latitude"]]}
            res["realEstate"]["location"] = res["realEstate"]["properties"][0]["location"];
            
            try:
                if len(res["realEstate"]["properties"]) != 0 and res["realEstate"]["properties"][0] is not None and res["realEstate"]["properties"][0]["surface"] is not None:
                    print("surface")
                    surface = res["realEstate"]["properties"][0]["surface"]
                    surface_val = int(surface.split(" ")[0])
                    print("surface_val")
                    print(surface_val)
                    res["realEstate"]["price"]["mq_price"] = math.ceil(res["realEstate"]["price"]["value"] / int(surface.split(" ")[0]))
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




# ---------------------------------------------
# fetch("https://www.immobiliare.it/api-next/search-list/real-estates/?fkRegione=lom&idNazione=IT&idContratto=1&idCategoria=6&__lang=it&minLat=43.113014&maxLat=47.583937&minLng=7.77832&maxLng=11.079712&pag=1&paramsCount=4&path=%2Fnuove-costruzioni%2Flombardia%2F", {
#   "headers": {
#     "accept": "*/*",
#     "accept-language": "en-US,en;q=0.6",
#     "priority": "u=1, i",
#     "sec-ch-ua": "\"Chromium\";v=\"124\", \"Brave\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
#     "sec-ch-ua-mobile": "?0",
#     "sec-ch-ua-platform": "\"Windows\"",
#     "sec-fetch-dest": "empty",
#     "sec-fetch-mode": "cors",
#     "sec-fetch-site": "same-origin",
#     "sec-gpc": "1",
#     "x-dtpc": "4$485839420_454h11vIJJSRIGLOUKQRQMPRPRLSKVMOACPEPFB-0e0",
#     "cookie": "AWSALBTG=PqGL4xWm3jdSJ9eg1pzIR4vdsUdHEf5Hvi4GC1T2Fugs0DSJ4GSNmkTPJ0Jk+91+3QVjT9DfKItNbjdMICEHn5audCgbqUIWkQRxp1QiRHJLSvqt4z8TTC5qNNPiN0mK8jk5/q08WAp4M3E3fcmUPWjmH2Y/Osy3qlpyTKXE9xYw; AWSALB=ZWOS+K/1HTsWPhsOgZiGcicYNrrwypD324SjVDYo6BiLCGIETB1+Zc4Rx1rHKx8Xeqmr/RdsYxNriQTrP15ak3Bf/3cDfxC66gnZOqNCXnSZhCicJtVo2A91VjmA; dtCookie=v_4_srv_4_sn_CB2B981748F454234B0971A9CDA848C5_perc_100000_ol_0_mul_1_app-3Aea7c4b59f27d43eb_0; PHPSESSID=38416190b8d1b51552da3944b48bcf31",
#     "Referer": "https://www.immobiliare.it/nuove-costruzioni/lombardia/?mapCenter=45.392664%2C9.429016&zoom=8",
#     "Referrer-Policy": "unsafe-url"
#   },
#   "body": null,
#   "method": "GET"
# });

# # nuove-costruzioni
# curl ^"https://www.immobiliare.it/api-next/search-list/real-estates/?fkRegione=lom&idNazione=IT&idContratto=1&idCategoria=6&__lang=it&minLat=43.113014&maxLat=47.583937&minLng=7.77832&maxLng=11.079712&pag=1&paramsCount=4&path=^%^2Fnuove-costruzioni^%^2Flombardia^%^2F^" ^
#   -H "accept: */*" ^
#   -H "accept-language: en-US,en;q=0.6" ^
#   -H "cookie: AWSALBTG=PqGL4xWm3jdSJ9eg1pzIR4vdsUdHEf5Hvi4GC1T2Fugs0DSJ4GSNmkTPJ0Jk+91+3QVjT9DfKItNbjdMICEHn5audCgbqUIWkQRxp1QiRHJLSvqt4z8TTC5qNNPiN0mK8jk5/q08WAp4M3E3fcmUPWjmH2Y/Osy3qlpyTKXE9xYw; AWSALB=ZWOS+K/1HTsWPhsOgZiGcicYNrrwypD324SjVDYo6BiLCGIETB1+Zc4Rx1rHKx8Xeqmr/RdsYxNriQTrP15ak3Bf/3cDfxC66gnZOqNCXnSZhCicJtVo2A91VjmA; dtCookie=v_4_srv_4_sn_CB2B981748F454234B0971A9CDA848C5_perc_100000_ol_0_mul_1_app-3Aea7c4b59f27d43eb_0; PHPSESSID=38416190b8d1b51552da3944b48bcf31" ^
#   -H "priority: u=1, i" ^
#   -H ^"referer: https://www.immobiliare.it/nuove-costruzioni/lombardia/?mapCenter=45.392664^%^2C9.429016&zoom=8^" ^
#   -H ^"sec-ch-ua: ^\^"Chromium^\^";v=^\^"124^\^", ^\^"Brave^\^";v=^\^"124^\^", ^\^"Not-A.Brand^\^";v=^\^"99^\^"^" ^
#   -H "sec-ch-ua-mobile: ?0" ^
#   -H ^"sec-ch-ua-platform: ^\^"Windows^\^"^" ^
#   -H "sec-fetch-dest: empty" ^
#   -H "sec-fetch-mode: cors" ^
#   -H "sec-fetch-site: same-origin" ^
#   -H "sec-gpc: 1" ^
#   -H "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" ^
#   -H ^"x-dtpc: 4^$485839420_454h11vIJJSRIGLOUKQRQMPRPRLSKVMOACPEPFB-0e0^"