# BookPulse 📚

BookPulse is a premium book review journal and library tracker. It allows you to document your reading journey, log detailed reviews, rate books, and view matching cover art automatically. 

Built with a cozy, warm linen aesthetic, it features responsive card layouts, tactile animations, database sorting, and case-insensitive search.

---

## 🎨 Design System & Aesthetics
BookPulse is crafted with a customized, reader-focused warm organic color scheme:
- **Warm Linen Cream (`#F7F4EB`)**: Primary background for a comfortable, paper-like reading interface.
- **Deep Espresso (`#3C1B11`)**: Deep high-contrast typography and form labels.
- **Caramel / Terracotta (`#9B6A46`)**: Highlight elements, primary icons, and action buttons.
- **Earthy Sage Green (`#B2C0AE` / `#556B52`)**: Badge tags, metadata labels, and visual highlights.

### Features:
- **Backdrop Blur glass navbar**: Dynamic links that highlight matching navigation sub-pages automatically.
- **Micro-interactions**: Scale-on-hover cover art, visual card expansions, and button click compression animations (`scale(0.97)`) for responsive feedback.
- **Slide-up entrance animations**: Staggered cascading entry effect for reviews on page load.

---

## 🚀 Key Functionalities
1. **Interactive Star Ratings (1-5 Stars) ⭐**:
   - Pure-CSS hover star selectors in Create & Edit forms.
   - Dynamic star badge rendering on book card headers.
2. **Case-Insensitive Search 🔍**:
   - Filter book reviews by name or author. Uses Postgres native `ILIKE` so lowercase entries match uppercase titles.
3. **Sort Controls ↕️**:
   - Re-arrange content dynamically by **Newest First**, **Highest Rated**, or **Alphabetical order**.
4. **Covers API Integration 🖼️**:
   - Connects to the **Open Library Covers API** to fetch book covers using ISBN or Open Library IDs.
   - Graceful fallback to default placeholder covers for invalid or missing codes.
5. **Full CRUD Operations**:
   - Add new reviews, edit/save changes, and delete books natively with persistent database updates.

---

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via `pg` client)
- **Frontend**: EJS (Embedded JavaScript Templates), Bootstrap 5.3.3 (for grid utilities), Vanilla CSS

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js** installed on your system.
- **PostgreSQL** database service running locally or hosted.

### 2. Database Schema Configuration
Create the `books` table in your PostgreSQL database instance using the query below:
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  book_name VARCHAR(255) NOT NULL,
  url_code VARCHAR(255),
  review_body TEXT,
  author VARCHAR(255),
  date_time VARCHAR(255),
  rating INT DEFAULT 5
);
```

### 3. Environment Setup
Create a `.env` file in the project root directory:
```env
PG_USER="your_postgres_username"
PG_HOST="localhost"
PG_DATABASE="book"
PG_PASSWORD="your_postgres_password"
PG_PORT="5432"
```

### 4. Installation
Install the project dependencies:
```bash
npm install
```

### 5. Database Schema Migrations
If you have an existing table and need to add the `rating` column automatically, run our database migration utility:
```bash
node scratch/migrate.js
```

### 6. Run the Application
Start the development server:
```bash
# Using nodemon for live-reload
nodemon index.js

# Or standard Node
node index.js
```
Open `http://localhost:3000` in your web browser.

---

## 📁 Directory Structure
- `index.js` — Core Express server routing, logic, and database client queries.
- `public/`
  - `style.css` — Custom design tokens, animations, card styles, and components.
  - `views/` — EJS page templates (`header`, `footer`, `index`, `newpost`, `updatepost`, `about`).
  - `svg/` — Branding icons and assets.
  - `pictures/` — Local fallback graphics and background banners.
- `scratch/` — Transient database migration and verification utilities.
