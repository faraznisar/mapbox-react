import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {Marker, Popup} from 'react-map-gl'
// import "maplibre-gl/dist/maplibre-gl.css";
import {locations} from '../constants/locations'

function CustomMap() {

  const mapRef = useRef();
  // console.warn("🚀 ~ file: CustomMap.js ~ line 9 ~ CustomMap ~ mapRef", mapRef)

  // console.log(locations);
    const [viewState, setViewState] = useState({
      height: '100vh', 
      width: '80%',
      longitude: -100,
      latitude: 40,
      zoom: 2,
    });

    const [mapMoved, setMapMoved] = useState(0)
    const [list, setList] = useState(locations) // this will be the computed list after the user drags the map
    console.warn("🚀 ~ file: CustomMap.js ~ line 22 ~ CustomMap ~ list", list)
    const [selectedLocation, setSelectedLocation] = useState({}) // this will be used tro show the popup

    const onMapLoad = useCallback(() => {
      mapRef.current.on("move", () => {
        const bounds = mapRef?.current?.getMap().getBounds();
        setList(locations.filter(
          (item) =>
            item.latitude >= bounds?._sw?.lat &&
            item.latitude <= bounds?._ne?.lat &&
            item.longitude >= bounds?._sw?.lng &&
            item.longitude <= bounds?._ne?.lng
        ))
      });
    }, []);

  return (
    <>
      <div style={{ height: "50vh", width: "20%" }}>
        {list?.map(i => <p>{i.address}</p>)}
      </div>
      <Map
        ref={mapRef}
        onLoad={onMapLoad}
        onDragEnd={() => setMapMoved(mapMoved + 1)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_API}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {locations.map((location, index) => {
          return (
            <Marker
              key={index}
              onClick={() =>
                setSelectedLocation({
                  longitude: parseFloat(location.longitude),
                  latitude: parseFloat(location.latitude),
                })
              }
              longitude={parseFloat(location.longitude)}
              latitude={parseFloat(location.latitude)}
            ></Marker>
          );
        })}
        {/* show popup when marker is clicked */}
        {/* {selectedLocation && (
        <Popup
          longitude={-100}
          latitude={40}
          anchor="bottom"
          onClose={() => setSelectedLocation({})}
        >
          Hello there
        </Popup>
      )} */}
      </Map>
    </>
  );
}

export default CustomMap