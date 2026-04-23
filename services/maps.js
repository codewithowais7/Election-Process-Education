/**
 * VoteWise — Google Maps Service
 * Handles map initialization, geolocation, and polling booth search
 */

const MAPS_CONFIG = {
  // Replace with your actual Maps API key
  API_KEY: 'AIzaSyAeYI7ySvvcLrTYodGFxyldHJT8LuESl0U',
  DEFAULT_CENTER: { lat: 20.5937, lng: 78.9629 }, // India center
  DEFAULT_ZOOM: 5,
  SEARCH_RADIUS: 2000, // metres
  MAX_RESULTS: 6,
  // Types of places to use as polling booth proxies
  PLACE_TYPES: ['local_government_office', 'school', 'city_hall', 'courthouse']
};

let map = null;
let markers = [];
let placesService = null;
let mapInitialized = false;

/**
 * Dynamically loads the Google Maps JavaScript API script
 * Called when the Maps tab is first activated
 */
function loadGoogleMaps() {
  if (window.google && window.google.maps) {
    _onMapsLoaded();
    return;
  }

  // Avoid double-loading
  if (document.getElementById('gmaps-script')) return;

  window._votewiseMapsCallback = _onMapsLoaded;

  const script = document.createElement('script');
  script.id = 'gmaps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places,geometry&callback=_votewiseMapsCallback&loading=async`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    _showMapError('Failed to load Google Maps. Please check your Maps API key in services/maps.js.');
  };
  document.head.appendChild(script);
}

/**
 * Called once Google Maps SDK is ready
 */
function _onMapsLoaded() {
  const mapEl = document.getElementById('google-map');
  const loadingEl = document.getElementById('map-loading');

  if (!mapEl) return;

  try {
    map = new google.maps.Map(mapEl, {
      center: MAPS_CONFIG.DEFAULT_CENTER,
      zoom: MAPS_CONFIG.DEFAULT_ZOOM,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        },
        {
          featureType: 'transit',
          elementType: 'labels',
          stylers: [{ visibility: 'simplified' }]
        }
      ]
    });

    placesService = new google.maps.places.PlacesService(map);

    // Wire up Places Autocomplete to location input
    const input = document.getElementById('location-input');
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' }, // Restrict to India
        fields: ['geometry', 'name', 'formatted_address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location) {
          findNearbyBooths(place.geometry.location);
        }
      });
    }

    mapInitialized = true;

    // Hide loading overlay
    if (loadingEl) {
      loadingEl.style.opacity = '0';
      loadingEl.style.transition = 'opacity 0.4s ease';
      setTimeout(() => { loadingEl.style.display = 'none'; }, 400);
    }

  } catch (err) {
    console.error('Maps init error:', err);
    _showMapError('Error initializing Google Maps. Please verify your API key has Maps JavaScript API enabled.');
  }
}

/**
 * Uses browser Geolocation API to find user's position
 */
function useMyLocation() {
  const btn = document.getElementById('use-location-btn');
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser. Please enter your address manually.');
    return;
  }

  if (!map) {
    loadGoogleMaps();
    // Retry after maps load
    const retry = setInterval(() => {
      if (mapInitialized) {
        clearInterval(retry);
        _doGeolocate(btn);
      }
    }, 500);
    return;
  }

  _doGeolocate(btn);
}

function _doGeolocate(btn) {
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.innerHTML = '<span class="spinner"></span> Locating...';
    btn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      const location = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      findNearbyBooths(location);
    },
    (err) => {
      if (btn) { btn.innerHTML = originalText; btn.disabled = false; }
      const msgs = {
        1: 'Location access denied. Please allow location access in your browser settings, or enter your address manually.',
        2: 'Location unavailable. Please enter your address manually.',
        3: 'Location request timed out. Please enter your address manually.'
      };
      alert(msgs[err.code] || 'Unable to get your location. Please enter it manually.');
    },
    { timeout: 10000, enableHighAccuracy: false }
  );
}

/**
 * Geocodes the manually typed address and finds nearby booths
 */
function searchPollingBooths() {
  const input = document.getElementById('location-input');
  const query = input?.value?.trim();

  if (!query) {
    input?.focus();
    return;
  }

  if (!map) {
    loadGoogleMaps();
    const retry = setInterval(() => {
      if (mapInitialized) {
        clearInterval(retry);
        _geocodeAndSearch(query);
      }
    }, 500);
    return;
  }

  _geocodeAndSearch(query);
}

function _geocodeAndSearch(query) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    { address: query, componentRestrictions: { country: 'in' } },
    (results, status) => {
      if (status === 'OK' && results[0]) {
        findNearbyBooths(results[0].geometry.location);
      } else {
        _showBoothError('Address not found. Please try a more specific address or use GPS location.');
      }
    }
  );
}

/**
 * Searches for nearby government/school locations as polling booth proxies
 * @param {google.maps.LatLng} location - Center of search
 */
function findNearbyBooths(location) {
  if (!map || !placesService) return;

  map.setCenter(location);
  map.setZoom(14);

  // Clear previous markers
  markers.forEach(m => m.setMap(null));
  markers = [];

  // Add user location marker
  const userMarker = new google.maps.Marker({
    position: location,
    map,
    title: 'Your Location',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 11,
      fillColor: '#e85d04',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2.5
    },
    zIndex: 100
  });

  new google.maps.InfoWindow({
    content: '<div style="font-family:DM Sans,sans-serif;padding:4px"><strong>📍 Your Location</strong></div>'
  }).open(map, userMarker);

  markers.push(userMarker);

  // Show loading in booth list
  const list = document.getElementById('booth-list');
  list.innerHTML = '<div class="booth-placeholder"><div class="spinner-map" style="margin:0 auto 8px"></div><p>Searching for nearby polling locations...</p></div>';

  // Search for government offices first, then schools as fallback
  placesService.nearbySearch(
    {
      location,
      radius: MAPS_CONFIG.SEARCH_RADIUS,
      keyword: 'government office community hall school'
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        _displayBooths(results.slice(0, MAPS_CONFIG.MAX_RESULTS), location);
      } else {
        // Fallback: search schools
        placesService.nearbySearch(
          { location, radius: MAPS_CONFIG.SEARCH_RADIUS, type: 'school' },
          (r2, s2) => {
            if (s2 === google.maps.places.PlacesServiceStatus.OK && r2.length > 0) {
              _displayBooths(r2.slice(0, MAPS_CONFIG.MAX_RESULTS), location);
            } else {
              _showBoothError('No nearby locations found. Try expanding your search area or contact your local election office.');
            }
          }
        );
      }
    }
  );
}

/**
 * Renders booth markers on map and the sidebar list
 * @param {Array} places - Google Places results
 * @param {google.maps.LatLng} userLocation - User's position
 */
function _displayBooths(places, userLocation) {
  const list = document.getElementById('booth-list');
  list.innerHTML = `
    <div class="booth-note">
      ⚠️ Nearby government/public locations shown as proxies. Contact your local election office or visit 
      <a href="https://voterportal.eci.gov.in" target="_blank" rel="noopener noreferrer">voterportal.eci.gov.in</a> for official booth details.
    </div>
  `;

  const infoWindow = new google.maps.InfoWindow();

  places.forEach((place, i) => {
    const position = place.geometry.location;

    // Calculate distance
    let distanceKm = null;
    if (google.maps.geometry?.spherical) {
      const distMetres = google.maps.geometry.spherical.computeDistanceBetween(userLocation, position);
      distanceKm = (distMetres / 1000).toFixed(1);
    }

    // Map marker
    const marker = new google.maps.Marker({
      position,
      map,
      title: place.name,
      label: {
        text: `${i + 1}`,
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold'
      },
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 7,
        fillColor: '#1a3a6e',
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 1.5
      },
      animation: google.maps.Animation.DROP
    });

    markers.push(marker);

    // Info window on marker click
    marker.addListener('click', () => {
      infoWindow.setContent(`
        <div style="font-family:'DM Sans',sans-serif;padding:6px;max-width:220px">
          <strong style="color:#1a3a6e">${i + 1}. ${place.name}</strong><br>
          <span style="font-size:12px;color:#5a6a84">${place.vicinity || ''}</span>
          ${distanceKm ? `<br><span style="font-size:12px;color:#e85d04">📍 ${distanceKm} km away</span>` : ''}
          <br><a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.name)},India" target="_blank" rel="noopener" style="font-size:12px;color:#2952a3">🗺️ Get Directions</a>
        </div>
      `);
      infoWindow.open(map, marker);
      map.panTo(position);
    });

    // Sidebar list item
    const item = document.createElement('div');
    item.className = 'booth-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.id = `booth-${i}`;
    item.innerHTML = `
      <div class="booth-name">${i + 1}. ${place.name}</div>
      <div class="booth-address">${place.vicinity || 'Address not available'}</div>
      ${distanceKm ? `<div class="booth-distance">📍 ${distanceKm} km away</div>` : ''}
    `;

    const activateBooth = () => {
      map.setCenter(position);
      map.setZoom(16);
      google.maps.event.trigger(marker, 'click');
    };

    item.addEventListener('click', activateBooth);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateBooth();
      }
    });

    list.appendChild(item);
  });
}

function _showBoothError(message) {
  const list = document.getElementById('booth-list');
  list.innerHTML = `
    <div class="booth-placeholder">
      <div style="font-size:2rem;margin-bottom:8px">⚠️</div>
      <p>${message}</p>
    </div>
  `;
}

function _showMapError(message) {
  const loadingEl = document.getElementById('map-loading');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div style="text-align:center;padding:20px;font-family:'DM Sans',sans-serif">
        <div style="font-size:2rem;margin-bottom:12px">⚠️</div>
        <p style="color:#5a6a84;font-size:0.9rem;max-width:300px">${message}</p>
      </div>
    `;
  }
}

// Expose functions for HTML onclick and app.js
window.MapsService = {
  loadGoogleMaps,
  searchPollingBooths,
  useMyLocation,
  findNearbyBooths,
  isInitialized: () => mapInitialized
};

// Expose directly for onclick attributes in HTML
window.searchPollingBooths = searchPollingBooths;
window.useMyLocation = useMyLocation;
