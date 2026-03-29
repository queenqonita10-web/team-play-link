# Technical Documentation: Competition Management Module (EO)

## 1. Database Schema (PostgreSQL/Supabase)

### `competitions`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| eo_id | uuid (FK) | Reference to EO organization |
| name | varchar | Competition name |
| type | enum | league, tournament |
| format | enum | group, knockout, hybrid |
| start_date | date | Competition start date |
| end_date | date | Competition end date |
| registration_start | date | Registration period start |
| registration_end | date | Registration period end |
| status | enum | draft, upcoming, ongoing, completed |
| description | text | Detailed description |
| prize_structure | text | Information about prizes |
| participant_limit | integer | Max teams across all categories |
| created_at | timestamptz | Timestamp of creation |

### `competition_categories`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| competition_id | uuid (FK) | Reference to competitions |
| age_category | enum | U12, U15, U18, Senior, Veteran |
| min_age | integer | Optional minimum age validation |
| max_age | integer | Optional maximum age validation |
| max_teams | integer | Max teams for this category |
| rules | text | Category-specific rules |

### `tournament_teams`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| competition_id | uuid (FK) | Reference to competitions |
| category_id | uuid (FK) | Reference to competition_categories |
| ssb_id | uuid (FK) | Reference to SSB organization |
| name | varchar | Team name for this competition |
| status | enum | pending, approved, rejected |
| registered_at | timestamptz | Timestamp of registration |
| players | jsonb | Array of Player Global IDs |

### `tournament_matches`
| Field | Type | Description |
|-------|------|-------------|
| id | uuid (PK) | Unique identifier |
| competition_id | uuid (FK) | Reference to competitions |
| category_id | uuid (FK) | Reference to competition_categories |
| stage | varchar | Group name or Knockout stage (e.g. Semi Final) |
| home_team_id | uuid (FK) | Reference to tournament_teams |
| away_team_id | uuid (FK) | Reference to tournament_teams |
| home_score | integer | Home team score |
| away_score | integer | Away team score |
| match_date | date | Date of match |
| match_time | time | Time of match |
| venue | varchar | Location of match |
| status | enum | scheduled, ongoing, completed, cancelled |
| statistics | jsonb | Detailed match stats (scorers, cards) |

---

## 2. API Endpoints

### Competition Management
- **GET** `/api/competitions`
  - Filters: `type`, `status`, `eo_id`
- **POST** `/api/competitions`
  - Create a new competition with categories
- **PUT** `/api/competitions/{id}`
  - Update competition details
- **DELETE** `/api/competitions/{id}`
  - Soft delete competition

### Participant Management
- **POST** `/api/competitions/{id}/register`
  - SSB registers a team for a category
  - Validation: Age eligibility of players, category capacity
- **GET** `/api/competitions/{id}/participants`
  - List registered teams with approval status
- **PATCH** `/api/competitions/participants/{team_id}/status`
  - Approve or reject registration

### Match & Results
- **POST** `/api/competitions/{id}/schedule`
  - Automated or manual match generation
  - Conflict detection: Venue and participant overlaps
- **PATCH** `/api/matches/{id}/result`
  - Input score and statistics
  - Triggers real-time standings update

### Standings & Reports
- **GET** `/api/competitions/{id}/categories/{cat_id}/standings`
  - Returns calculated standings table
- **GET** `/api/competitions/{id}/report`
  - Export competition results and statistics

---

## 3. Business Logic: Standings Calculation

### Point System (Standard)
- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

### Ranking Criteria (Tie-breakers)
1. Points
2. Goal Difference (Goals For - Goals Against)
3. Goals For
4. Head-to-head result
5. Fair Play (Card counts)

---

## 4. Tournament Formats

### Group Stage
- Round-robin within groups.
- Top N teams advance to next stage.

### Knockout
- Single elimination.
- Optional 3rd place match.

### Hybrid
- Group stage followed by Knockout (e.g. World Cup format).
