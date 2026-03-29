# Single Player Identity API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: Single Player Identity API
  description: API for managing universal player identity across SSB and EO platforms.
  version: 1.0.0

servers:
  - url: https://api.teamplaylink.com/v1
    description: Production server

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Player:
      type: object
      required:
        - name
        - dateOfBirth
        - nik
        - email
        - phone
      properties:
        id:
          type: string
          format: uuid
        globalId:
          type: string
          description: Unique global identifier (e.g., P-2026-XXXX)
        name:
          type: string
        nik:
          type: string
          description: Identity number (NIK/Passport), encrypted in transit/storage.
        dateOfBirth:
          type: string
          format: date
        email:
          type: string
          format: email
        phone:
          type: string
        photoUrl:
          type: string
          format: uri
        verificationStatus:
          type: string
          enum: [unverified, pending, verified, rejected]
        ssbId:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time

    CompetitionHistory:
      type: object
      properties:
        id:
          type: string
          format: uuid
        competitionName:
          type: string
        participationDate:
          type: string
          format: date
        achievement:
          type: string
        pointsEarned:
          type: number

    Error:
      type: object
      properties:
        code:
          type: integer
        message:
          type: string

security:
  - bearerAuth: []

paths:
  /players/register:
    post:
      summary: Register a new player
      tags: [Players]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Player'
      responses:
        '201':
          description: Player registered successfully
        '400':
          description: Invalid input data
        '409':
          description: Player with this NIK/Email already exists

  /players/{player_id}:
    get:
      summary: Get player profile by ID
      tags: [Players]
      parameters:
        - name: player_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Player'
        '404':
          description: Player not found

    put:
      summary: Update player profile
      tags: [Players]
      parameters:
        - name: player_id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Player'
      responses:
        '200':
          description: Updated successfully

  /players/{player_id}/competition-history:
    get:
      summary: Get player's competition history
      tags: [History]
      parameters:
        - name: player_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CompetitionHistory'

  /players/validate-age:
    post:
      summary: Validate player age for a specific competition date
      tags: [Validation]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                playerId:
                  type: string
                competitionDate:
                  type: string
                  format: date
                minAge:
                  type: integer
                maxAge:
                  type: integer
      responses:
        '200':
          description: Validation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  isValid:
                    type: boolean
                  currentAge:
                    type: integer

  /players/search:
    get:
      summary: Search players by criteria
      tags: [Players]
      parameters:
        - name: query
          in: query
          description: Name, NIK, or Global ID
          schema:
            type: string
        - name: ssbId
          in: query
          schema:
            type: string
      responses:
        '200':
          description: List of players
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Player'
```
