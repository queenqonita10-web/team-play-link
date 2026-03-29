# Technical Documentation: Match Management Module

## 1. Database Schema (3NF Normalized)

### `matches`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique match ID |
| competition_id | uuid (FK) | Reference to competition |
| category_id | uuid (FK) | Reference to age category |
| home_team_id | uuid (FK) | Reference to tournament_teams |
| away_team_id | uuid (FK) | Reference to tournament_teams |
| home_score | integer | Current home score (default 0) |
| away_score | integer | Current away score (default 0) |
| date | date | Scheduled match date |
| time | time | Scheduled match time |
| venue | varchar | Match location |
| status | enum | scheduled, live, completed, cancelled, postponed |
| referee_id | uuid (FK) | Reference to users (referee) |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Last update timestamp |

### `match_goals`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique goal ID |
| match_id | uuid (FK) | Reference to matches |
| team_id | uuid (FK) | Reference to tournament_teams |
| player_id | uuid (FK) | Reference to players (scorer) |
| assist_player_id | uuid (FK) | Reference to players (assistant) |
| minute | integer | Match minute when goal scored |
| type | enum | regular, penalty, own_goal |
| created_at | timestamptz | Timestamp of record |

### `match_cards`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique card ID |
| match_id | uuid (FK) | Reference to matches |
| team_id | uuid (FK) | Reference to tournament_teams |
| player_id | uuid (FK) | Reference to players |
| minute | integer | Match minute when card given |
| type | enum | yellow, red |
| reason | text | Disciplinary reason |
| created_at | timestamptz | Timestamp of record |

### `match_statistics`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique stat ID |
| match_id | uuid (FK) | Reference to matches |
| team_id | uuid (FK) | Reference to tournament_teams |
| possession | integer | Ball possession percentage |
| shots_on_target | integer | Number of shots on target |
| shots_off_target | integer | Number of shots off target |
| corners | integer | Number of corners |
| offsides | integer | Number of offsides |
| fouls | integer | Number of fouls |
| pass_accuracy | integer | Pass accuracy percentage |

### `match_audit_trail`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique log ID |
| match_id | uuid (FK) | Reference to matches |
| user_id | uuid (FK) | Reference to users (operator) |
| action | varchar | Action performed (e.g. UPDATE_SCORE) |
| old_value | jsonb | Previous state |
| new_value | jsonb | New state |
| timestamp | timestamptz | Action timestamp |

---

## 2. API Endpoints (RESTful)

### Match Lifecycle
- **POST** `/api/matches` - Create a new match schedule
- **GET** `/api/matches/{id}` - Get full match details including goals, cards, and stats
- **PATCH** `/api/matches/{id}/status` - Update match status (e.g., scheduled -> live)

### Result Entry (Live Updates)
- **POST** `/api/matches/{id}/goals` - Add a goal record (automatically updates match score)
- **DELETE** `/api/matches/{id}/goals/{goal_id}` - Remove a goal (reverts score)
- **POST** `/api/matches/{id}/cards` - Add a disciplinary record
- **PUT** `/api/matches/{id}/statistics` - Bulk update team statistics

### Reporting
- **GET** `/api/matches/{id}/report` - Generate a comprehensive match report (JSON/PDF)

---

## 3. Business Logic & Validation

- **Score Integrity**: `home_score` and `away_score` are calculated fields based on the sum of non-own-goal records in `match_goals` for the respective teams.
- **Role-Based Access**: Only users with the `operator` or `eo_admin` role assigned to the competition can input results.
- **Concurrency**: Use database transactions for goal/card records to ensure score consistency during simultaneous updates.
