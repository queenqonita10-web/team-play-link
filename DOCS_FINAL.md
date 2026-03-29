# Football Grassroots Ecosystem Platform - Final Documentation

## 1. OpenAPI 3.0 Specification (Core Endpoints)
```yaml
openapi: 3.0.0
info:
  title: Football Grassroots Ecosystem API
  version: 1.0.0
paths:
  /auth/login:
    post:
      summary: User Authentication
      responses:
        200:
          description: JWT Token & User Profile
  /players/{globalId}:
    get:
      summary: Get Single Player Identity
      parameters:
        - name: globalId
          in: path
          required: true
      responses:
        200:
          description: Universal Player Profile
  /ssb/attendance/scan:
    post:
      summary: Record QR Attendance with Geo-tagging
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                playerId: { type: string }
                sessionId: { type: string }
                location: 
                  type: object
                  properties:
                    lat: { type: number }
                    lng: { type: number }
  /eo/matches/{matchId}/result:
    post:
      summary: Input Real-time Match Result
      security:
        - BearerAuth: []
```

## 2. BPMN 2.0 User Flow (Critical Paths)
- **SSB Registration**: SSB Admin -> Input Player -> Identity Verification -> Parent Confirmation.
- **Tournament Registration**: SSB Admin -> Squad Selection -> EO Admin Approval -> Payment -> Match Day.
- **Match Day**: EO Operator -> Start Match -> Live Score Input -> Auto Standing Update.

## 3. Deployment Guide (Kubernetes & Docker)
### Dockerization
```dockerfile
# Base image
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Kubernetes Orchestration
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: football-ecosystem-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: football-api
  template:
    metadata:
      labels:
        app: football-api
    spec:
      containers:
      - name: api
        image: teamplaylink/api:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: api-secrets
```

## 4. Scalability & Performance
- **Caching**: Redis digunakan untuk menyimpan hasil klasemen (standings) dan profil pemain yang sering diakses.
- **Data Isolation**: Menggunakan `tenant_id` pada setiap tabel utama untuk memastikan isolasi data antar organisasi (SSB/EO).
- **Concurrency**: Sistem dirancang untuk menangani 10,000 users melalui load balancing dan stateless API design.

## 5. Mobile Readiness (PWA)
- Implementasi `manifest.json` dan `service-worker.js` untuk dukungan offline dan instalasi di perangkat mobile.
- Responsive design menggunakan Tailwind CSS breakpoints.
