from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Charger le modèle
model = joblib.load('task_duration_model.pkl')

@app.route('/predict-duration', methods=['POST'])
def predict_duration():
    data = request.json
    X_new = np.array([[data['taskWeight'], data['taskStartValue'], data['taskDoneValue']]])
    pred = model.predict(X_new)
    return jsonify({'taskDuration': float(pred[0])})

if __name__ == '__main__':
    # CORS pour Angular
    from flask_cors import CORS
    CORS(app)
    app.run(port=5001)
