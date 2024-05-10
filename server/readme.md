

swagger autegen

linux/macOS:
"generate-swagger": "rm ./src/docs/swagger_output.json && ts-node ./src/docs/swagger.ts",

windows:
"generate-swagger": "del .\\src\\docs\\swagger_output.json && ts-node .\\src\\docs\\swagger.ts",
