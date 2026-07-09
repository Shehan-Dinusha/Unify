import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

const LIBRARIES = []; // No extra libs needed for basic maps + geocoding

const MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
};

// Default center: Colombo, Sri Lanka — adjust to your city
const DEFAULT_CENTER = {
    lat: 6.9271,
    lng: 79.8612,
};

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: true,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#94a3b8" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64748b" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#1e293b" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#4ade80" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#1e3a5f" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#0f2847" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64748b" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#2b5ea7" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1e3a5f" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#94a3b8" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#1e293b" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#64748b" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#0c2340" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#475569" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#0c2340" }],
        },
    ],
};

/**
 * LocationPicker
 *
 * Props:
 *   onChange({ lat, lng, address }) — called whenever the marker is placed/moved
 *   initialLat, initialLng — optional starting coordinates
 */
const LocationPicker = ({ onChange, initialLat, initialLng }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || "",
        libraries: LIBRARIES,
    });

    const [markerPos, setMarkerPos] = useState(
        initialLat && initialLng
            ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) }
            : null
    );
    const [geocoding, setGeocoding] = useState(false);
    const mapRef = useRef(null);

    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    /**
     * Reverse-geocode a lat/lng using the Google Geocoding REST API.
     * Using REST (not the JS SDK) to avoid loading extra libraries.
     */
    const reverseGeocode = async (lat, lng) => {
        if (!apiKey) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.status === "OK" && data.results.length > 0) {
                return data.results[0].formatted_address;
            }
        } catch {
            // fallback to coordinate string
        }
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const handleMapClick = useCallback(
        async (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
            setGeocoding(true);
            try {
                const address = await reverseGeocode(lat, lng);
                onChange({ lat, lng, address });
            } finally {
                setGeocoding(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange, apiKey]
    );

    const handleMarkerDragEnd = useCallback(
        async (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPos({ lat, lng });
            setGeocoding(true);
            try {
                const address = await reverseGeocode(lat, lng);
                onChange({ lat, lng, address });
            } finally {
                setGeocoding(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange, apiKey]
    );

    // ── Render states ──────────────────────────────────────────────────────────

    if (!apiKey) {
        return (
            <div className="w-full h-[340px] rounded-xl bg-[#0F172A]/80 border border-amber-500/30 flex flex-col items-center justify-center gap-3 text-amber-400 p-6">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-semibold text-center">
                    Google Maps API key not set.
                </p>
                <p className="text-xs text-amber-400/70 text-center">
                    Add <code className="bg-amber-500/10 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-amber-500/10 px-1 rounded">.env.local</code> file and restart the dev server.
                </p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="w-full h-[340px] rounded-xl bg-[#0F172A]/80 border border-red-500/30 flex flex-col items-center justify-center gap-3 text-red-400 p-6">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-semibold">Failed to load Google Maps.</p>
                <p className="text-xs text-red-400/70">Check your API key and enabled APIs.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[340px] rounded-xl bg-[#0F172A]/80 border border-white/10 flex flex-col items-center justify-center gap-3 text-text-secondary">
                <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
                <p className="text-sm">Loading map…</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Instruction banner */}
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-blue/10 border border-primary-blue/20 rounded-lg">
                <MapPin className="w-4 h-4 text-primary-blue flex-shrink-0" />
                <p className="text-xs text-primary-blue">
                    Click anywhere on the map — or drag the pin — to set the exact location. The address field will auto-fill.
                </p>
            </div>

            {/* Map */}
            <div className="relative w-full h-[340px] rounded-xl overflow-hidden border border-white/10 shadow-lg">
                <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={markerPos || DEFAULT_CENTER}
                    zoom={markerPos ? 15 : 12}
                    options={MAP_OPTIONS}
                    onLoad={onMapLoad}
                    onClick={handleMapClick}
                >
                    {markerPos && (
                        <Marker
                            position={markerPos}
                            draggable={true}
                            onDragEnd={handleMarkerDragEnd}
                            animation={window.google?.maps?.Animation?.DROP}
                        />
                    )}
                </GoogleMap>

                {/* Geocoding spinner overlay */}
                {geocoding && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-2 bg-[#0F172A]/90 border border-white/10 px-4 py-2.5 rounded-xl shadow-lg">
                            <Loader2 className="w-4 h-4 animate-spin text-primary-blue" />
                            <span className="text-xs text-white font-medium">Getting address…</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Coordinates display */}
            {markerPos && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-text-secondary font-mono">
                        {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                    </span>
                    <span className="ml-auto text-[10px] text-green-400 font-semibold uppercase tracking-wider">
                        Pin set ✓
                    </span>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
