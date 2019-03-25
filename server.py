from flask import Flask, request, jsonify
from flask_cors import *

app = Flask(__name__)
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

if __name__ == '__main__':
    app.run(port=8888, debug=True)