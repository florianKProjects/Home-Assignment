from flask import Flask, request, jsonify, render_template
from collections import defaultdict
from  time import time,sleep


app = Flask(__name__, static_folder="static")

queues = defaultdict(list)


@app.route('/api/<queue_name>', methods=['POST'])
def post_message(queue_name):
    try:
        message = request.json
        if not message:
            raise ValueError("No message content found")
        
        # Add message to the queue with a timestamp
        queues[queue_name].append((message, time()))
        return jsonify({"status": "Message added to queue"}), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to add message"}), 500
    

@app.route('/api/<queue_name>', methods=['GET'])
def get_message(queue_name):
    try:
        # Retrieve timeout value in milliseconds (default: 10000ms = 10 seconds)
        timeout = int(request.args.get('timeout', 10000)) / 1000  # convert to seconds
        start_time = time()

        while time() - start_time < timeout:
            # Check if the queue has any messages
            if queues[queue_name]:
                message, timestamp = queues[queue_name].pop(0)
                return jsonify({"message": message}), 200

            # Sleep briefly to avoid high CPU usage
            sleep(0.1)

        # No messages found in the queue within the timeout period
        return '', 204

    except KeyError:
        return jsonify({"error": f"Queue '{queue_name}' not found"}), 404
    except ValueError:
        return jsonify({"error": "Invalid timeout value"}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500


def handle_options(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, X-Requested-With"
    return response

@app.route('/')
def index():
    return render_template('index.html')

if __name__=='__main__':
    app.run(port=8080,debug=True)