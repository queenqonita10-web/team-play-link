# Standings API Documentation

## 1. Get League Standings
Retrieve the current standings for a specific competition and category.

- **Endpoint**: `GET /api/standings`
- **Authentication**: Optional (Public access)
- **Response Format**: `JSON`

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `competitionId` | `uuid` | Yes | The ID of the competition |
| `categoryId` | `uuid` | Yes | The ID of the age category (e.g. U10, U12) |
| `season` | `string` | No | Filter by season (e.g. "2026") |

### Success Response
- **Code**: `200 OK`
- **Content**:
```json
[
  {
    "teamId": "uuid-1",
    "teamName": "Garuda Muda U10",
    "played": 10,
    "won": 7,
    "drawn": 2,
    "lost": 1,
    "goalsFor": 25,
    "goalsAgainst": 10,
    "goalDifference": 15,
    "points": 23
  },
  {
    "teamId": "uuid-2",
    "teamName": "Elang Biru U10",
    "played": 10,
    "won": 6,
    "drawn": 3,
    "lost": 1,
    "goalsFor": 20,
    "goalsAgainst": 12,
    "goalDifference": 8,
    "points": 21
  }
]
```

### Tie-breaking Rules
The standings are automatically calculated and sorted based on:
1.  **Points** (3 for win, 1 for draw)
2.  **Goal Difference** (GF - GA)
3.  **Goals For** (Total goals scored)
4.  **Head-to-Head Results** (Matches between tied teams)
5.  **Alphabetical Order** (Fallback)

### Error Responses
- **400 Bad Request**: Missing `competitionId` or `categoryId`.
- **404 Not Found**: Competition or Category does not exist.
- **500 Internal Server Error**: Unexpected processing error.

---

## 2. Standings Data Integrity
- Standings are recalculated in real-time as match results are confirmed.
- Only matches with status `completed` are included in the calculation.
- Any updates to match scores via the `MatchOperator` will trigger a recalculation of the respective league table.
