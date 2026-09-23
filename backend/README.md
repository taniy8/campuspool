# Campus Commute — Backend

Spring Boot REST API for a campus-only carpool matching platform. Students verified via
their college email post commute trips (route + time); a distance-time matching engine
finds other students on a similar route around the same time.

## Stack

- Java 17, Spring Boot 3.3 (Web, Data JPA, Security, Validation, Mail)
- PostgreSQL
- JWT auth (jjwt)
- Maven
- springdoc-openapi (Swagger UI)

## Project layout

```
src/main/java/com/campuscommute/backend/
  config/       AppProperties, SecurityConfig
  controller/   REST endpoints
  dto/          request/response payloads (auth, trip, match, common)
  entity/       JPA entities (User, Trip, TripMatch, VerificationToken)
  enums/        Role, TripType, TripStatus, MatchStatus
  exception/    custom exceptions + @RestControllerAdvice
  repository/   Spring Data JPA repositories
  security/     JWT util, filter, UserDetails
  service/      business logic — AuthService, TripService, MatchingService, DashboardService
  util/         GeoUtils (Haversine distance)
```

## Running locally

1. **Start Postgres** (or point at your own instance):
   ```bash
   docker compose up -d
   ```

2. **Set environment variables** (or edit `application.yml` directly for local dev):
   ```bash
   export DB_USERNAME=postgres
   export DB_PASSWORD=postgres
   export JWT_SECRET="a-long-random-secret-at-least-32-characters"
   export ALLOWED_EMAIL_DOMAINS="college.edu,college.ac.in"   # your campus domain(s)
   export FRONTEND_BASE_URL="http://localhost:5173"
   export CORS_ALLOWED_ORIGINS="http://localhost:5173"
   ```
   Mail (`MAIL_HOST` / `MAIL_USERNAME` / `MAIL_PASSWORD`) is optional for the prototype —
   if not configured, verification links are printed to the console log instead of emailed.

3. **Run**:
   ```bash
   mvn spring-boot:run
   ```

4. API docs: `http://localhost:8080/swagger-ui.html`

## Key design decisions

- **Trusted-campus access control**: `CollegeEmailValidator` rejects registration for any
  email whose domain isn't in `app.allowed-email-domains`. This is the platform's core
  safety mechanism in place of manual ID checks.
- **Matching engine** (`MatchingService`): for a newly-posted trip, candidates are pulled
  from other *active* trips of the same direction (`TO_CAMPUS` / `FROM_CAMPUS`) whose
  departure time falls within `app.matching.max-time-window-minutes`. Each candidate's
  origin and destination points are compared to the new trip's using the **Haversine
  formula** (`GeoUtils`); pairs within `app.matching.max-distance-km` on both ends are
  scored 0–100 (70% weight on route proximity, 30% on time proximity) and persisted as a
  `TripMatch` so both students see the suggestion.
- **Ride-history dashboard** (`DashboardService`): aggregates a student's trips by status
  plus their match activity in one call, so the frontend doesn't need three round trips.

## API overview

| Method | Endpoint                         | Auth | Description |
|--------|-----------------------------------|------|--------------|
| POST   | `/api/auth/register`             | –    | Register with a college email |
| POST   | `/api/auth/login`                | –    | Get a JWT |
| POST   | `/api/auth/verify-email`         | –    | Verify email via token |
| GET    | `/api/users/me`                  | JWT  | Current user profile |
| POST   | `/api/trips`                     | JWT  | Post a trip (triggers matching) |
| GET    | `/api/trips/active`              | JWT  | Browse all active trips |
| GET    | `/api/trips/mine`                | JWT  | My posted trips |
| GET    | `/api/trips/{id}`                | JWT  | Trip details |
| PATCH  | `/api/trips/{id}/cancel`         | JWT  | Cancel my trip |
| PATCH  | `/api/trips/{id}/complete`       | JWT  | Mark my trip completed |
| GET    | `/api/matches/trip/{tripId}`     | JWT  | Matches for a trip |
| GET    | `/api/matches/mine`              | JWT  | All my matches |
| PATCH  | `/api/matches/{id}/accept`       | JWT  | Accept a suggested match |
| PATCH  | `/api/matches/{id}/reject`       | JWT  | Reject a suggested match |
| GET    | `/api/dashboard`                 | JWT  | Ride-history dashboard |

All authenticated requests need `Authorization: Bearer <accessToken>`.

## Notes for the report / write-up

- Matching thresholds (`max-distance-km`, `max-time-window-minutes`) are externalized in
  `application.yml`, so you can tune or justify them without touching code.
- The matching score formula and its weighting are documented inline in
  `MatchingService.computeMatchScore` — useful if you need to explain the algorithm in a
  viva or report.
- `ddl-auto: update` is fine for a prototype; switch to Flyway/Liquibase migrations if this
  goes further than a college project.
