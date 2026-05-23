# SJIT Smart Internal Calculator

A web application designed for students at **St. Joseph's Institute of Technology (SJIT), Chennai** to calculate internal assessment marks, check semester exam eligibility, and simulate academic grades. 

The application is built on React, styled with Tailwind CSS, and uses dynamic visualization tools to display mark distributions. It features a dark/black theme with custom gold accents, reflecting the institute's branding.

---

## Key Features

- **SJIT Internal Mark Calculator (Out of 40)**: Computes marks based on Model 1, 2, and 3 exam scores, including the official 1.5x bonus multiplier and category-specific co-curricular credits (General, HOPE Elite, and PEP).
- **Minimum Passing Mark Forecast**: Calculates the exact score required in the Anna University Semester (External) Exam to pass the subject, depending on the compiled internal marks.
- **Interactive Grade Simulator**: A real-time slider to test hypothetical internal mark values and preview the corresponding estimated final grades (O, A+, A, B+, B, RA).
- **Marks Share Visualization**: An interactive pie chart powered by Recharts detailing weightage contributions from model exams and co-curricular assessments.
---

## Technical Stack

- **Frontend Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (with custom brand palettes)
- **Animations**: Framer Motion
- **Charts**: Recharts

---

## Setup & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Aj230910/sjit-internal_calculator.git
   cd sjit-internal_calculator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Once started, open your browser and navigate to `http://localhost:5173/`.

4. **Build for Production**
   ```bash
   npm run build
   ```
   The compiled assets will be placed in the `dist/` directory, ready to be deployed to static hosting providers (GitHub Pages, Netlify, Vercel, etc.).

---

## Academic Calculations

### 1. Internal Mark Breakdown (Max 40)
- **Model 1 & Model 2 Exams (Max 10 Marks)**:
  $$\text{Exam weight } 1 = \min\left(10, \frac{(\text{Model 1} \times b + \text{Model 2} \times b) \times 10}{200}\right)$$
- **Model 3 Exam (Max 10 Marks)**:
  $$\text{Exam weight } 2 = \min\left(10, \frac{\text{Model 3} \times b \times 10}{100}\right)$$
  *Where $b$ represents the **Bonus factor**: $1.5$ if the 1.5x multiplier option is enabled; $1.0$ otherwise.*

- **Co-curricular Activities (Max 20 Marks)**:
  If the sum of the student's Model 1, 2, and 3 scores is at least **100 marks**, category-specific credits are added:
  - **General**: NPTEL (Max 8), Course (Max 7), Extra (Max 5)
  - **HOPE Elite**: Certification (Max 7), Assessment (Max 6), Performance (Max 7)
  - **PEP**: Cert/Course (Max 7), Assessment (Max 6), NPTEL (Max 7)
  *(Note: If the model exams total is under 100, these extra credits default to 0.)*

### 2. Passing Requirements
- If Compiled Internals $\ge 23$: The student requires a minimum of **45 marks** in the external semester exam to pass.
- If Compiled Internals $< 23$: The student requires:
  $$\text{Required External} = \max\left(45, \lfloor(50 - \text{Compiled Internals}) \times 1.667\rfloor\right)$$
  *(This adjusts for Anna University's requirement of a combined total of at least 50 marks out of 100.)*
