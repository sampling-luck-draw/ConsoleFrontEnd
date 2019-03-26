from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import *

app = Flask(__name__)
socketio = SocketIO(app)
CORS(app, supports_credentials=True)

@app.route('/')
def hello_world():
    return 'hello world'

@app.route('/login', methods=['POST'])
def login():
    print(request.headers)
    username = request.form.get("username", "")
    password = request.form.get("password", "")
    if username == "1234" and password == "admin":
        return jsonify({"success": "true"})
    else:
        return 'rejected'

@socketio.on('message')
def handle_message(message):
     print('received message: ' + message)

@socketio.on('connect')
def connect_handler():
    emit('my response',
            {'message': '{0} has joined'.format(current_user.name)},
            broadcast=True)

if __name__ == '__main__':
    app.run(port=1923, debug=True)