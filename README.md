# DOM API

## Endpoint

GET `/addresses/{address}`

### Función

Este endpoint retorna el punto y poligonos de la dirección consultada 

### Parameters

address: dirección, comuna (String)

### Respuestas

Status 200

Content-type `application/json`

```
{
    "response": {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -70.739869,
                -34.1657158
            ]
        },
        "properties": {
            "display_name": "Calle del Estado, Población Urmeneta, Rancagua Sur, Rancagua, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2852046, Chile"
        }
    }
}
```

## Endpoint

GET `/polygons`

### Función

Este endpoint retorna todos poligonos

### Parameters

### Respuestas

Status 200

Content-type `application/json`

```
{
    "response": {
        "type": "FeatureCollection",
        "features": [
            {
                ...
            }
        ]
    }
}
```

## Endpoint

GET `/polygons/zone/{zone}`

### Función

Este endpoint retorna todos poligonos de una zona consultada

### Parameters

zone: zona (String)

### Respuestas

Status 200

Content-type `application/json`

```
{
    "response": {
        "type": "FeatureCollection",
        "features": [
            {
                ...
            }
        ]
    }
}
```

## Endpoint

GET `/polygons/loc/{location}`

### Función

Este endpoint retorna un poligono de una zona consultada la longitud y latitud

### Parameters

location: lon,lat (String)

### Respuestas

Status 200

Content-type `application/json`

```
{
    "response": {
        "_id": "5bf5dd47bf6c1f034a8699b7",
        "type": "Feature",
        "properties": {
            "ZONA_PRC": "AV-PU",
            "AREA": 3444,
            "LENGHT": 706,
            "DESCRIP": "AREA VERDE PUBLICA"
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                ...
            ]
        }
    }
}
```

## Respuestas genericas

Status 500

Content-type `application/json`

```
{
    "response": "error connecting to db"
}

{
    "response": "error in db"
}


{
    "response": "error connecting to geocodification service ..."
}
```

Status 404

Content-type `application/json`

```
{
    "response": "address not found"
}
```
