# Project README

## Description
This is the API for the [Cogitarium project](https://github.com/Daanisaanwezig/Cogitarium). It is used for retrieving and searching ideas and generating chat responses. It uses the Ollama API to generate embeddings, chat responses, and search queries.

## Getting Started
### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [Ollama](https://ollama.ai/) (Install via [Ollama CLI](https://ollama.ai/download) and run `ollama serve`)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up PostgreSQL:
- Create a database and user
- Update `.env` with your database credentials:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
    ```
4. Ensure Ollama is running and models are pulled:
   ```bash
   ollama pull gemma3:1b
   ollama pull nomic-embed-text:latest
   ```

## Usage
1. Start the server:
   ```bash
   node index
   ```

## Notes
- Ensure Ollama is running before starting the server
- The `ideas` table must exist in your PostgreSQL database (schema: `id`, `title`, `description`, `embedding`, `metadata`, `tags`)