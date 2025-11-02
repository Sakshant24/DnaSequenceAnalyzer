# 🧬 DNA Sequence Analyzer

An end-to-end, high-performance web application for the analysis of large-scale DNA sequences. This project is a Data Structures and Algorithms (DSA) showcase, demonstrating how to build and optimize classical bioinformatics algorithms to handle massive datasets without crashing.

The application features a complete backend REST API built with **Spring Boot** and **Java**, and a modern, responsive frontend built with **React** and **Vite**.



---

## ✨ Key Features

* **Gene Frequency Analysis:** Upload a multi-megabyte DNA file and instantly visualize the frequency of all "k-mers" (subsequences of length 'k') using an interactive bar chart powered by `Chart.js`.
* **High-Speed Motif Search:** Perform blazing-fast substring searches to find all occurrences of a specific gene pattern (motif) within a massive sequence.
* **Mutation Detection:** Compare two DNA sequences to calculate their "Edit Distance" (Levenshtein distance), providing a score of how many mutations (insertions, deletions, substitutions) differentiate them.
* **Large-Scale Data Processing:** Capable of handling multi-megabyte (`.txt`, `.fasta`) DNA files by using a clean, stateless API and optimized backend code.
* **Optimized Algorithms:** The core of the project. It demonstrates the critical difference between naive algorithms that cause `OutOfMemoryError` and their space-optimized counterparts that can handle real-world data.

---

## 🛠️ Technology Stack

This project is split into two main parts: a backend API and a frontend client.

| Backend (The "Brain") | Frontend (The "Face") | Core DSA |
| :--- | :--- | :--- |
| ☕ **Spring Boot** | ⚛️ **React** | 🧠 **`HashMap`** |
| ☕ **Java 17** | ⚡ **Vite** | For **O(n)** Frequency Analysis |
| 📦 **Maven** | 🌐 **`axios`** | 🧠 **`Suffix Array`** |
| 🔌 **REST API** | 📊 **`Chart.js`** | For **O(m log n)** Motif Search |
| | 💅 **CSS** | 🧠 **`Dynamic Programming`** |
| | | For **O(m)** space Mutation Detection |

---

## 🏛️ Architecture & Design Philosophy

### Stateless Processing Engine

This project is intentionally **database-free**. It's designed as a **stateless processing tool**, not a data storage system.

* The backend is a pure "processor." It receives a `String` of DNA, performs a complex calculation using its DSA classes, and returns the result.
* It never saves the DNA or the analysis results. Every API call is a new, independent task. This makes the architecture simple, fast, and highly scalable.

### How File Handling Works

The frontend (React) is 100% responsible for file handling.
1.  A user uploads a `.txt` file.
2.  The React app uses the `FileReader` API to read the file *in the browser*.
3.  The React app performs all data cleaning (removing headers, numbers, and spaces) to create one giant, clean DNA string.
4.  This *string* (not the file) is sent to the Spring Boot backend in a JSON object.

This design keeps the backend simple and focused on its one task: **algorithms**.

---

## 🚀 Local Setup and Installation

Follow these steps to run the complete project locally. You will need to run **two** servers at the same time in two separate terminals.

### 1. Prerequisites

* **Java JDK 17** or later
* **IntelliJ IDEA** (Recommended) or another Java IDE
* **Node.js** (v18 or later)
* **WebStorm** (Recommended) or **VS Code**

### 2. Running the Backend (Spring Boot)

The backend server runs on `http://localhost:8080`.

1.  **Open the Backend:**
    Open the `backend/dna-analyzer` folder in IntelliJ IDEA.

2.  **Run the Application:**
    Find the `DnaAnalyzerApplication.java` file inside `src/main/java/...` and click the green "Run" button next to it.

3.  **Check the Console:**
    The console should start up and end with a line saying:
    `Tomcat started on port 8080 (http)`

### 3. Running the Frontend (React)

The frontend server runs on `http://localhost:5173`.

1.  **Open the Frontend:**
    Open the `frontend` folder in WebStorm or VS Code.

2.  **Open a Terminal:**
    Use the built-in terminal in your IDE.

3.  **Install Dependencies:**
    This only needs to be run once.
    ```sh
    npm install
    ```

4.  **Run the App:**
    ```sh
    npm run dev
    ```

5.  **Open Your Browser:**
    The terminal will show you a local URL. Open `http://localhost:5173` in your browser to use the application.

---

## API Endpoints

The backend provides three main endpoints, all rooted at `/api/v1/analyze`.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/frequency` | Analyzes the k-mer frequency of a DNA string. |
| `POST` | `/motif` | Finds all occurrences of a given motif in a DNA string. |
| `POST` | `/mutation` | Calculates the edit distance between two DNA strings. |
