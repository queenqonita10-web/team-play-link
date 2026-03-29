# Technical Documentation: Comprehensive Attendance System

## 1. Database Schema (PostgreSQL/Supabase)

### `attendance`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| member_id | uuid (FK) | Reference to players/members |
| session_id | uuid (FK) | Reference to training_schedules |
| check_in_time | timestamptz | Actual time of attendance |
| status | enum | hadir (present), izin (permitted), tidak_hadir (absent) |
| attendance_method | enum | qr_code, manual |
| qr_code | varchar (unique) | The specific QR code string used |
| created_at | timestamptz | Timestamp of creation |
| updated_at | timestamptz | Timestamp of last update |

---

## 2. QR Code Logic & Security

### Algorithm
- **Hashing**: SHA-256 (Minimal)
- **Payload**: `JSON.stringify({ member_id, session_id, timestamp })`
- **Encryption**: Payload should be signed or encrypted to prevent tampering.
- **Validity**: QR code is valid for **5 minutes** from the timestamp in the payload.

### Flow
1. Server generates a signed token/hash containing `member_id`, `session_id`, and current `timestamp`.
2. Frontend displays this as a QR Code.
3. Scanner (Coach/Admin) scans the QR.
4. `POST /attendance/qr-scan` sends the QR string to the server.
5. Server validates:
   - Signature/Hash integrity.
   - Expiration (Current time - payload timestamp < 5 mins).
   - `session_id` exists and is active.
   - `member_id` is assigned to the session group.

---

## 3. API Endpoints (RESTful)

### Attendance Operations
- **POST** `/api/attendance/qr-scan`
  - Validates and records attendance via QR.
  - Body: `{ qr_data: string, coach_id: uuid }`
- **POST** `/api/attendance/manual`
  - Records attendance manually by admin/coach.
  - Body: `{ member_id: uuid, session_id: uuid, status: enum, note?: string }`

### Reports & Statistics
- **GET** `/api/attendance/statistics/{member_id}`
  - Personal statistics: percentage, total sessions, history.
- **GET** `/api/attendance/session/{session_id}/report`
  - Per-session recapitulation (who's present, absent, permitted).

---

## 4. Technical Requirements

### Security & Authentication
- **JWT Middleware**: All endpoints must be protected by JWT authentication.
- **Role-based Access**: Only `Coach` or `Admin` can perform scans or manual updates.

### Validation
- **Frontend/Backend Validation**: Use **Yup** or **Joi** for strict input validation.
- **JSON:API Standard**: All responses must follow the JSON:API format with appropriate status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden).

### Error Handling
- Informative error messages for: `Expired QR Code`, `Invalid Session`, `Already Checked In`, etc.

### Documentation
- Full API documentation via **Swagger/OpenAPI 3.0**.
