<script>
    import {onMount} from 'svelte';

    export let address = "";   // Adresse à géocoder
    export let zoom = 17;

    let map;
    let coords = null;

    // Géocodage Nominatim d’une adresse vers lat/lon
    async function geocode(addr) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.length) {
            console.error("Adresse introuvable :", addr);
            return null;
        }

        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name
        };
    }

    onMount(async () => {
        const L = await import("leaflet");

        // Correction des icônes Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        });

        // 1) Géocodage de l’adresse
        coords = await geocode(address);
        if (!coords) return;

        // 2) Création de la carte
        map = L.map("osm-map", {
            center: [coords.lat, coords.lon],
            zoom: 12,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        L.marker([coords.lat, coords.lon]).addTo(map)
            .bindPopup(coords.displayName);

        // 3) Correction du rendu : recalcul après que tout soit visible
        setTimeout(() => map.invalidateSize(), 200);
    });
</script>

<style>
    #osm-map {
        width: 400px;
        height: 400px;
    }
</style>

<!-- Wrapper adapté à Skeleton (arrondi + border) -->
<div class="border border-surface-200 overflow-hidden shadow-xl">
    <div id="osm-map"></div>
</div>
