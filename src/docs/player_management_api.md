# Player Management API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Player Management API
  description: API for managing SSB players, parents, and documents.
  version: 1.0.0

components:
  schemas:
    PlayerInput:
      type: object
      required:
        - name
        - dateOfBirth
        - nik
        - position
        - parent
      properties:
        name: { type: string, minLength: 3, maxLength: 100 }
        dateOfBirth: { type: string, format: date }
        nik: { type: string, pattern: "^\\d{16}$" }
        position: { type: string, enum: [goalkeeper, defender, midfielder, forward] }
        parent:
          type: object
          required: [motherName, contactNumber]
          properties:
            motherName: { type: string }
            contactNumber: { type: string, pattern: "^\\d+$" }
            relationshipType: { type: string }
            email: { type: string, format: email }

    Player:
      allOf:
        - $ref: '#/components/schemas/PlayerInput'
        - type: object
          properties:
            id: { type: string, format: uuid }
            globalId: { type: string }
            age: { type: integer }
            ageCategory: { type: string, enum: [U9, U11, U13, U15, U17, U20, Senior] }
            status: { type: string, enum: [active, inactive] }
            verificationStatus: { type: string, enum: [unverified, pending, verified, rejected] }
            createdAt: { type: string, format: date-time }
            updatedAt: { type: string, format: date-time }

paths:
  /players:
    get:
      summary: List players with search, filter, and pagination
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
        - name: name
          in: query
          schema: { type: string }
        - name: position
          in: query
          schema: { type: string, enum: [goalkeeper, defender, midfielder, forward] }
        - name: ageCategory
          in: query
          schema: { type: string, enum: [U9, U11, U13, U15, U17, U20] }
        - name: status
          in: query
          schema: { type: string, enum: [active, inactive] }
      responses:
        '200':
          description: List of players
          content:
            application/json:
              schema:
                type: object
                properties:
                  data: { type: array, items: { $ref: '#/components/schemas/Player' } }
                  total: { type: integer }
                  page: { type: integer }
                  pages: { type: integer }

    post:
      summary: Create a new player
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PlayerInput' }
      responses:
        '201':
          description: Created
        '400':
          description: Validation error

  /players/{id}:
    get:
      summary: Get player detail
    put:
      summary: Update player profile
    delete:
      summary: Soft delete player

  /players/{id}/documents:
    post:
      summary: Upload player document (akte, KK, foto)
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file: { type: string, format: binary }
                type: { type: string, enum: [birth_certificate, family_card, photo] }
      responses:
        '200':
          description: Upload successful
```
