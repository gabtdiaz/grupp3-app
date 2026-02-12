# FriendZone

## Byggt för Newton SYSM8, Grupp 3

Välkommen till FriendZone, en social plattform där användare hittar vänner genom gemensamma aktiviteter och event. Applikationen hanterar användarautentisering, eventhantering, nested kommentarer och profilanpassning med integritetskontroller.Vi använder moderna webbteknologier och säkra autentiseringsmetoder för att skapa en säker och engagerande plattform. Backend följer separation of concerns-principer med .NET Minimal API, medan frontend ger en responsiv användarupplevelse med React och TypeScript.Denna README förklarar hur plattformen används, vilka features som finns tillgängliga och hur du kommer igång tekniskt.

## Innehållsförteckning
1. Teknologier och Verktyg
2. Applikationsstruktur
3. Funktionsöversikt
4. Förutsättningar
5. Installationsguide
6. Hur man Bidrar
7. Lokal Utveckling
8. Bygga för Produktion
9. API Integration

## 1. Teknologier och Verktyg
Projektet är utvecklat med följande teknologier:

Backend:
- .NET 9 Minimal API
- Entity Framework Core
- Azure SQL Database
- BCrypt.Net (lösenordshashning)
- JWT (autentisering)

Frontend:
- React 18
- TypeScript
- Vite (byggverktyg)
- Tailwind CSS
- Axios (HTTP-klient)
- React Router DOM

DevOps:
- Azure App Service
- GitHub Actions (CI/CD)
- Application Insights (övervakning)

## 2. Applikationsstruktur
Applikationen kan delas in i 3 huvudfunktioner:

### Autentisering & Användarhantering
Ingångspunkten där användare:

- Registrerar sig med GDPR-samtycke
- Loggar in med JWT-tokenautentisering
- Hanterar profilinställningar och integritetskontroller
- Raderar konto med fullständig databorttagning

### Eventhantering
Kärnfunktionen där användare:

- Skapar event med restriktioner (ålder, kön, plats, max deltagare)
- Bläddrar och filtrerar event efter kategori, stad och datum
- Går med i eller lämnar event
- Ser deltagarlistor och eventdetaljer

### Social Interaktion
Community-funktioner som inkluderar:

- Kommentera event
- Svara på kommentarer med 1-nivå nested struktur
- Radera egna kommentarer
- Visa användarprofiler med integritetsvänlig visning

## 3. Funktionsöversikt
### Datavalidering
Flerlagers-valideringssystem:

- Frontend-validering för omedelbar användarfeedback
- DTO-validering med anpassade attribut
- Service-lager business logic-validering
- Databasrestriktioner som slutgiltig säkerhet

### Säkerhet
Säkerhetsimplementation:

- BCrypt lösenordshashning
- JWT-tokens med HS512-signering
- Rate limiting
- Säkerhetsheaders (HSTS, CSP, X-Frame-Options, Referrer-Policy)
- HTTPS-enforcement via Azure
- Auktoriseringskontroller på alla skyddade endpoints

### Integritet & GDPR
Integritetsfokuserade funktioner:

- Användarsamtycke krävs vid registrering
- Integritetsinställningar för kön, ålder och stadssynlighet
- Kontoborttagning med kommentarsanonymisering

### Övervakning
Observerbarhet och health checks:

- Application Insights för fel- och prestandaspårning
- Health check endpoint för API- och databasstatus
- ILogger audit trail för säkerhetshändelser

## 4. Förutsättningar

- .NET 9 SDK
- Node.js 18.x eller senare
- SQL Server LocalDB eller Azure SQL Database
- Modern webbläsare 

## 5. Installationsguide

### Klona repositoryt
```bash
git clone https://github.com/[your-org]/friendzone.git
cd friendzone
```

### Installera Backend Dependencies
```bash
cd backend
dotnet restore
```

### Miljöinställningar
```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\mssqllocaldb;Database=FriendZoneDb;Trusted_Connection=True;"
dotnet user-secrets set "JwtSettings:TokenKey" "din-superhemliga-nyckel-minimum-32-tecken"
dotnet user-secrets set "JwtSettings:Issuer" "FriendZone"
dotnet user-secrets set "JwtSettings:Audience" "FriendZoneUsers"
```

### Kör databasmigrationer
```bash
dotnet ef database update
```

### Starta Backend server
```bash
dotnet run
```

- Backend kommer vara tillgängligt på http://localhost:5011
- Swagger UI finns på http://localhost:5011/swagger

### Installera Frontend Dependencies
```bash
cd frontend
npm install
```

### Frontend Miljöinställningar

Skapa en `.env.development` fil i frontend-katalogen:
```bash
VITE_API_URL=http://localhost:5011
```

## 6. Hur man Bidrar
Följ installationsguiden för att komma igång.
Skapa en feature branch från main:

```
git checkout -b feature/ditt-feature-namn
```

Gör dina ändringar och committa med tydliga, beskrivande meddelanden.

Pusha till din branch:
```
git push origin feature/ditt-feature-namn
```

Skapa en pull request till main-branchen.

Din kod kommer att granskas av minst en teammedlem och antingen godkännas eller kräva ändringar.

### Kodstandarder

- Använd PascalCase för backend-klasser, metoder och properties
- Använd camelCase för lokala variabler i backend och all frontend-kod
- Använd TypeScript för all frontend-kod med korrekta interface-definitioner
- Följ befintlig projektstruktur med separation av Models, DTOs, Services och Endpoints
- Lägg till loggning i alla endpoints med ILogger
- Inkludera auktoriseringskontroller på skyddade endpoints
- Testa noggrant innan du submittar pull request

## 7. Lokal Utveckling

### Projektstruktur - Backend
```
backend/
├── Models/              # Datamodeller (User, Event, EventComment)
├── DTOs/                # Data Transfer Objects
├── Services/            # Business logic
├── Endpoints/           # API endpoint mappings
├── Validation/          # Anpassade validators
├── Extensions/          # Middleware extensions
├── Data/                # ApplicationDbContext
└── Program.cs           # Entry point
```

### Projektstruktur - Frontend
```
frontend/
├── src/
│   ├── components/      # React-komponenter
│   ├── contexts/        # Global state (AuthContext)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page-komponenter
│   └──  api/            # API-integration
└── public/
```

### Lägga till en Ny Feature

För backend:

- Skapa Model om ny databastabell behövs
- Lägg till DTO för request/response-validering
- Implementera Service för business logic om komplex validering krävs
- Skapa Endpoints-fil med API-routes
- Registrera endpoints i Program.cs
- Lägg till migration med:
```
dotnet ef migrations add DittMigrationsNamn
```

Uppdatera databasen med:
```
dotnet ef database update
```

För frontend:
- Lägg till API-anrop i api/ med axios
- Skapa custom hook i hooks-katalogen för state management
- Bygg React-komponenter i components-katalogen
- Uppdatera routing i App.tsx om ny sida behövs

## 8. Bygga för Produktion

### Automatisk Deployment via GitHub Actions

Projektet använder CI/CD pipeline för automatisk deployment till Azure.

### Workflow:

Push till main-branchen triggar automatiskt:

- Backend byggs med dotnet build
- Frontend byggs med npm run build
- Deploy till Azure App Service
- Health check körs för verifiering

### Databasmigrationer

När du gör ändringar som påverkar databasen
```
cd backend
dotnet ef migrations add DittMigrationsNamn --project grupp3-app.Api.csproj
dotnet ef database update --project grupp3-app.Api.csproj
```
Committa migration-filerna

Pipeline bygger och deployar automatiskt, migration-filerna följer med

## 9. API Integration

### Backend Endpoints
Applikationen tillhandahåller ett REST API dokumenterat via Swagger:
- Bas-URL (Lokalt): http://localhost:5011
- Bas-URL (Produktion): https://friendzone-app.azurewebsites.net
- Swagger UI: /swagger

### Huvudendpoints
Autentisering:
- POST /api/auth/register - Registrera ny användare med GDPR-samtycke
- POST /api/auth/login - Logga in och ta emot JWT-token

Event:
- GET /api/events - Lista alla event
- POST /api/events - Skapa nytt event
- GET /api/events/{id} - Hämta eventdetaljer
- POST /api/events/{id}/join - Gå med i event
- DELETE /api/events/{id}/leave - Lämna event

Kommentarer:
- GET /api/events/{id}/comments - Hämta kommentarer
- POST /api/events/{id}/comments - Skapa kommentar eller svar
- DELETE /api/events/{eventId}/comments/{commentId} - Radera kommentar

Profil:
- GET /api/profile - Hämta egen profil
- PUT /api/profile - Uppdatera profil
- GET /api/profile/{userId} - Visa annan användares profil
- DELETE /api/profile - Radera konto

Health:
- GET /health - Health check

### Autentisering
Skyddade endpoints kräver JWT-token i Authorization-header.

Erhåll token via POST /api/auth/login, inkludera sedan i requests:
```
Authorization: Bearer DIN_JWT_TOKEN
```
