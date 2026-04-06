# Guía de Debug - Error "No context provided: useLeafletContext()"

## ¿Qué hacer?

1. **Abre la consola del navegador** (F12 → Console)
2. **Navega a la página de servicios** (`/servicios`)
3. **Captura los LOGS** que aparecen (copialos y envíame)

---

## ¿Qué deberías VER en la consola?

### ✅ LOGS ESPERADOS (en orden):

```
🗺️ CustomMap DEBUG: {
  markersCount: N,
  markersData: [
    {
      _id: "...",
      name: "Nombre Profesional",
      hasLocation: true,
      hasLocationCoordinates: true,
      coordinates: [-75.23, 4.444],  // ← ESTO ES CRÍTICO
      location: { type: "Point", coordinates: [-75.23, 4.444] }
    }
  ],
  locationUser: [lat, lng],
  pathname: "/servicios"
}

📍 First marker coordinates: {
  markerName: "Nombre",
  coords: [-75.23, 4.444],
  isArray: true,
  length: 2
}

📍 Using user location: [lat, lng]
✅ Valid center: { lat: ..., lng: ... }

✅ CustomControls: useMap() successful
✅ ProfessionalsUpdate: useMap() successful

✅ Rendering marker 0: {
  name: "Nombre",
  coords: [-75.23, 4.444],
  leafletPosition: [4.444, -75.23]
}
```

---

## ❌ PROBLEMAS QUE BUSCAR:

### 1. **¿Markers sin location?**
```
⚠️ Marker 0 has invalid coordinates: {
  name: "Nombre",
  coords: undefined,
  hasLocation: false
}
```
**→ El backend no está devolviendo `location.coordinates`**

### 2. **¿Coordenadas [0, 0]?**
```
📍 First marker coordinates: {
  coords: [0, 0],
  ...
}
```
**→ Los profesionales están siendo filtrados por posición [0,0]**

### 3. **¿useMap() falla?**
```
❌ CustomControls: useMap() failed Error: No context provided...
❌ ProfessionalsUpdate: useMap() failed Error: No context provided...
```
**→ MapContainer no está siendo renderizado correctamente**

### 4. **¿Invalid center?**
```
❌ Invalid center: { lat: undefined, lng: undefined }
```
**→ Los datos son null u undefined**

---

## 📊 ESTRUCTURA ESPERADA DE DATOS

### Lo que devuelve la API (`/users`):
```javascript
{
  _id: "69b97d2f5fade9fe4dadc2e6",
  firstname: "Cristian",
  lastname: "Yepes",
  location: {
    type: "Point",
    coordinates: [-75.23293733596803, 4.444077464494928]  // [lng, lat]
  },
  address: {
    city: "ibague",
    state: "tolima",
    country: "CO"
  }
  // ... otros campos
}
```

### Lo que debería pasar a CustomMap:
```javascript
markers = [
  {
    _id: "69b97d2f5fade9fe4dadc2e6",
    name: "Cristian Yepes",
    location: { // ← CRITICAL: debe estar presente
      type: "Point",
      coordinates: [-75.23293733596803, 4.444077464494928]
    },
    // ... otros campos
  }
]
```

### Lo que espera Leaflet:
```javascript
<Marker position={[latitud, longitud]} />
// Ejemplo:
<Marker position={[4.444, -75.232]} />  // [lat, lng] - INVERTIDO vs GeoJSON
```

---

## 🔍 PASOS DE DEBUG

### Paso 1: Verifica que getProfessionals() devuelve datos correctos
```javascript
// En DevTools console:
await fetch('http://localhost:3001/users?role=professional').then(r => r.json()).then(d => {
  console.log("Raw API response:", d.users[0])
  return d
})
```

### Paso 2: Verifica que location.coordinates existe
```javascript
// Si profesionales = data.users
console.log("First professional:", profesionales[0])
console.log("Location:", profesionales[0]?.location)
console.log("Coordinates:", profesionales[0]?.location?.coordinates)
```

### Paso 3: Verifica que el servicio NO sobrescribe location
```javascript
// En professionals.js, busca líneas como:
coordinates: [user.latitud || 0, user.longitud || 0]  // ❌ INCORRECTO
```

---

## 🛠️ PROBLEMAS PROBABLES

| Problema | Síntoma | Solución |
|----------|---------|----------|
| Backend no envía `location.coordinates` | `coordinates: undefined` | Verificar API, schema MongoDB |
| Servicio sobrescribe con latitud/longitud inexistentes | `coordinates: [0, 0]` | Arreglar getProfessionals() |
| CustomMap no recibe datos | `markersCount: 0` | Verificar ServicioMain.jsx |
| Dynamic import con SSR | `useMap() fallido` | Verificar dynamic import config |
| MapWrapper no renderiza | `Invalid center error` | Verificar center validation |

---

## 📝 NEXT STEPS

1. **Captura los logs de la consola** cuando navegues a `/servicios`
2. **Envia los logs completos**
3. **Indica si ves alguno de los errores ❌ arriba**
4. **Verifica el request a la API** (Network tab)

Eso me ayudará a diagnóstico exacto del problema.
