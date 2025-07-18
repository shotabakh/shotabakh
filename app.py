from flask import Flask, request, jsonify
       import sqlite3

       app = Flask(__name__)

       def init_db():
           conn = sqlite3.connect('contacts.db')
           c = conn.cursor()
           c.execute('''CREATE TABLE IF NOT EXISTS contacts (name TEXT, email TEXT, message TEXT)''')
           conn.commit()
           conn.close()

       @app.route('/submit', methods=['POST'])
       def submit_form():
           name = request.form['name']
           email = request.form['email']
           message = request.form['message']
           
           conn = sqlite3.connect('contacts.db')
           c = conn.cursor()
           c.execute("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", (name, email, message))
           conn.commit()
           conn.close()
           
           return jsonify({'status': 'success', 'message': 'შეტყობინება გაგზავნილია!'})

       if __name__ == '__main__':
           init_db()
           app.run(debug=True)