# Technical Documentation: Training Schedule Module

## 1. Database Schema (Supabase/PostgreSQL)

### `training_schedules`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| title | varchar | Title of the training session |
| description | text | Detailed description |
| start_time | timestamptz | Start date and time |
| end_time | timestamptz | End date and time |
| location | varchar | Venue name or address |
| max_participants | integer | Maximum capacity |
| status | enum | scheduled, completed, cancelled |
| age_category | enum | U8, U10, U12, U15, U18, Senior |
| group_id | uuid (FK) | Reference to participant_groups |
| recurrence_type | enum | none, daily, weekly, monthly |
| recurrence_end_date | date | End date for recurring series |
| exception_dates | jsonb | Array of dates to skip (holidays, etc) |
| created_at | timestamptz | Timestamp of creation |
| updated_at | timestamptz | Timestamp of last update |

### `trainer_assignments`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| trainer_id | uuid (FK) | Reference to trainers table |
| schedule_id | uuid (FK) | Reference to training_schedules |
| role | varchar | Role (Main Coach, Assistant, etc) |
| assigned_at | timestamptz | Timestamp of assignment |

### `participant_groups`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| name | varchar | Group name |
| age_category | enum | Age category for this group |
| min_skill_level | integer | Optional skill level requirement (1-5) |
| max_capacity | integer | Maximum number of participants |
| created_at | timestamptz | Timestamp of creation |

### `notification_logs`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| schedule_id | uuid (FK) | Reference to training_schedules |
| recipient_id | uuid (FK) | Reference to players/parents |
| channel | enum | email, whatsapp, push |
| template_type | enum | reminder, change, cancellation |
| status | enum | sent, failed, delivered, bounced |
| error_message | text | Details if status is failed/bounced |
| sent_at | timestamptz | Timestamp of sending |

---

## 2. API Endpoints

### Training Schedules
- **GET** `/api/training-schedules`
  - Filters: `start_date`, `end_date`, `age_category`, `trainer_id`, `location`
  - Support for pagination and sorting
- **POST** `/api/training-schedules`
  - Create a single or recurring schedule
  - Validation: Max capacity, trainer availability
- **PUT** `/api/training-schedules/{id}`
  - Update a specific occurrence or the entire series
  - Conflict detection: Trainer overlapping schedules
- **DELETE** `/api/training-schedules/{id}`
  - Soft delete with cascade handling for assignments and logs

### Trainer Assignments
- **POST** `/api/training-schedules/{id}/assign-trainer`
  - Assign one or more trainers to a session
  - Validation: Trainer availability, specialization check

### Notifications
- **POST** `/api/training-schedules/{id}/notify-parents`
  - Trigger manual notifications
  - Parameters: `channel`, `template_type`

---

## 3. Business Logic & Validation Rules

### Age Category Validation
- Automatically calculated based on `dateOfBirth` vs current date.
- Rules:
  - U8: age < 8
  - U10: 8 <= age < 10
  - U12: 10 <= age < 12
  - U15: 12 <= age < 15
  - U18: 15 <= age < 18
  - Senior: age >= 18

### Conflict Detection
- A trainer cannot be assigned to two schedules that overlap in time.
- Buffer time of 15 minutes is recommended between sessions at different locations.

### Recurring Schedule Pattern
- Generator logic for creating future instances based on pattern.
- Bulk operations for updating/deleting recurring series to optimize performance.
