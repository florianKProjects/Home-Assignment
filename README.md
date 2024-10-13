# Message Queue App

## Installation
1. Clone the repository
2. Install dependencies: `pip install Flask Flask-RESTful`
3. Run the app: `python app.py`, the port will open on 8080


## Usage
- POST messages to a queue via `/api/{queue_name}`
- GET messages from a queue via `/api/{queue_name}?timeout={ms}`

# Request Example
## Add Queue
- curl -X POST `/api/queue1` 
- header: `Content-Type: application/json`
- body: `{\"message\": \"Hello World\"}`
## Get Queue
- curl -X GET `/api/queue1?timeout=5000`
