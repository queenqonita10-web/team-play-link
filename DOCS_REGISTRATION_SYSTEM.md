# Technical Documentation: Tim Registration System

## 1. Database Schema

### `registrasi_tim`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique registration ID |
| competition_id | uuid (FK) | Reference to competition |
| category_id | uuid (FK) | Reference to age category |
| ssb_id | uuid (FK) | Reference to originating SSB |
| status | enum | draft, pending, approved, rejected, batal |
| submitted_at | timestamptz | Timestamp when official submitted squad |
| official_id | uuid (FK) | User ID of the team official |
| created_at | timestamptz | Initial creation |

### `detail_registrasi_pemain`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Record ID |
| registrasi_id | uuid (FK) | Reference to registrasi_tim |
| player_global_id | varchar (FK) | Single Player Identity ID |
| position_at_reg | varchar | Position at time of registration |
| age_at_reg | integer | Calculated age at competition start |

### `log_validasi`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Log ID |
| registrasi_id | uuid (FK) | Reference to registrasi_tim |
| type | enum | info, warning, error |
| message | text | Validation message |
| timestamp | timestamptz | When log was generated |

---

## 2. API Endpoints

### Registration Management
- **POST** `/api/registrasi-tim`
  - Create a new registration draft.
  - Auth: JWT (SSB Admin/Official)
- **GET** `/api/registrasi-tim/{id}`
  - Get full details of a registration and its squad.
- **PUT** `/api/registrasi-tim/{id}/submit`
  - Submit the squad for EO review.
  - Triggers automated validation logic.
- **DELETE** `/api/registrasi-tim/{id}/batal`
  - Cancel a registration before it's approved.

---

## 3. Validation Logic

### `checkAge(player, category, competitionDate)`
Calculates `differenceInYears(competitionDate, birthDate)`.
- Rejects if `age < minAge` or `age > maxAge`.
- Rejects if `age >= catLimit` (e.g., U12 means must be < 12).

### `checkQuota(players, min, max)`
- Ensures `players.length` is between `min` and `max`.
- Ensures at least **1 GK** is present in the squad.

### `checkDuplicates(players)`
- Ensures each `globalId` appears only once in the squad selection.

---

## 4. Confirmation Flow
Upon successful submission:
1. System records `submitted_at`.
2. Notification is sent to Team Official (Submitter).
3. Status moves from `draft` to `pending`.
4. EO Admin receives notification for review.
