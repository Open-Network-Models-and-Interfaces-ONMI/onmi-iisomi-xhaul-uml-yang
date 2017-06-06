# mwtnTopology - Functional Specification

## Beschreibung

Das mwtnTopology Control zeichnet eine Karte mit Hilfe eines austauschbaren Kartendienstes
Dabei wird die Satellitendarstellung verwendet (wenn möglich), sonst wird die Kartendarstellung gewählt.
Über dem Kartenlayer soll ein Vectorlayer mit Informationen zu Mobilfunkmasten und zugehörigen Richtfunkstrecken dargestellt werden.
Die Karte soll mittels Mausbedienung Scroll und Zoombar sein, Klicks auf einen Mast oder eine Richtfunkstrecke stellen weitere Informationen in einem Popup zur Verfügung.

## Anforderungen

* Die Webseite / der Webserver hat *keinen* Zugriff auf das öffentliche Internet. Online-Kartendienste wie Google, Bing oder OpenStreetMap sind damit nicht erreichbar.
* Der Server stellt eine API bereit, an welcher die Kartenkacheln als Bitmaps (png/jpeg) bereitgestellt werden.
* Der darzustellende Bereich wird angegeben durch
  - Ein Latitude/Longitude Koordinatenpaar (Mittelpunkt) und eine Zoomstufe in % wobei 0% der "Weltraumansicht" und 100% der "Sandkrümel auf der Straße" entspricht.
    Die benötigten Kacheln werden anhand der Zoomstufe und der Größe des Kartenausschnitts in Bildschirmpixel berechnet.
  - Zwei Latitude/Longitude Koordinatenpaare, welche die obere rechte Ecke und die untere linke Ecke des darzustellenden Kartenausschnitts darstellen.
    Die benötigte Zoomstufe wird anhand der Koordinatenpaare und der Größe des Kartenausschnitts in Bildschirmpixel berechnet.
    + 2 Mögliche SubModi: "Fill" und "Cut"
* Die Zoomstufen als %-Angaben werden auf die vom Kartenprovider verwendeten ganzzahligen Zoomstufen gemappt.
  - Nicht jeder Kartenprovider kann für alle Zoomstufen Bitmaps liefern. Gibt es eine Möglichkeit die maximale Provider-Zoomstufe für eine Koordinate abzufragen?
* Der Client cached die Bildkacheln, um die Serverlast zu reduzieren.
  - Localstorage?

## Offene Fragen

* Soll die Karte immer eingenordet sein oder ist eine Kartenrotation erforderlich?
* Welche Karten-UI-Steuerelemente müssen angezeigt werden
  - +/- Button / Zoom-Slider
  - 2D-Rotations-Gizmo / Kompass
  - Geokoordinate Zentrieren
  - Kartenscale (20m|---------------|)
  - Copyright-Angaben der verwendeten Kartendaten
  - Ein/Ausblenden des Vector-Overlays
* Kann ein eigener Tile Render Server (wie z.B. Maperitive) verwendet werden?
* Transparente, vorberechnete Kacheln des VectorLayers verfügbar? (Kacheln erlauben keine Hover-Informationen einzelner Richtfunktstrecken)

## Berechnungsformeln

- [OSM: Slippy map tilenames](http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames)

The first part of the URL specifies the tile server, and perhaps other parameters which might influence the style.

Generally several subdomains (server names) are provided to get around browser limitations on the number of simultaneous HTTP connections to each host.
Browser-based applications can thus request multiple tiles from multiple subdomains faster than from one subdomain.
For example, OSM, OpenCycleMap and CloudMade servers have three subdomains (a.tile, b.tile, c.tile), MapQuest has four (otile1, otile2, otile3, otile4),
all pointing to the same CDN. That all comes before the /zoom/x/y.png tail.

Example:
http://[abc].tile.openstreetmap.org/zoom/x/y.png

```js
function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }

var zoom        = 9;
var top_tile    = lat2tile(north_edge, zoom); // eg.lat2tile(34.422, 9);
var left_tile   = lon2tile(west_edge, zoom);
var bottom_tile = lat2tile(south_edge, zoom);
var right_tile  = lon2tile(east_edge, zoom);
var width       = Math.abs(left_tile - right_tile) + 1;
var height      = Math.abs(top_tile - bottom_tile) + 1;

// total tiles
var total_tiles = width * height; // -> eg. 377
```

## Links

- [OpenStreetMap DE:Tile usage policy](http://wiki.openstreetmap.org/wiki/DE:Tile_usage_policy)
- [OpenStreetMap DE:Karte in Webseite einbinden](http://wiki.openstreetmap.org/wiki/DE:Karte_in_Webseite_einbinden)
- [OpenStreetMap DE:Maperitive](http://wiki.openstreetmap.org/wiki/DE:Maperitive)
- [Maperitive, EN:Hauptwebseite](http://maperitive.net/)
- [Google Maps Javascript API + Key anfordern](https://developers.google.com/maps/documentation/javascript/?hl=de)
- [Google Maps Javascript Erste Schritte](https://developers.google.com/maps/documentation/javascript/tutorial?hl=de)
- [Google Developer Console](https://console.developers.google.com/)
- [GoogleMap AngularJS Directive](https://rawgit.com/allenhwkim/angularjs-google-maps/master/build/docs/index.html)
- [Sample asnyc script load into head element](http://just-run.it/#/ByvA_ClTe/0)
