import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

print("Script Flask démarré !")

app = Flask(__name__)
CORS(app)

# 🔹 Charger le modèle et l'encodeur
try:
    model = joblib.load("task_model.pkl")
    encoder = joblib.load("label_encoder.pkl")
    model_loaded = True
    print("Modèle ML chargé avec succès !")
except Exception as e:
    print("Erreur en chargeant le modèle ML:", e)
    model_loaded = False

@app.route('/predict', methods=['POST'])
def predict_task_state():
    data = request.json
    print("Données reçues pour ML:", data)

    taskWeight = data.get('taskWeight', 0)
    taskStartValue = data.get('taskStartValue', 0)
    taskDoneValue = data.get('taskDoneValue', 0)

    result = {}

    if model_loaded:
        try:
            df = pd.DataFrame([data])
            proba = model.predict_proba(df[['taskWeight', 'taskStartValue', 'taskDoneValue']])

            # Transformer les classes encodées en noms lisibles
            for i, cls_encoded in enumerate(model.classes_):
                cls_name = encoder.inverse_transform([cls_encoded])[0]
                result[f"proba_{cls_name}"] = round(proba[0][i], 3)

        except Exception as e:
            print("Erreur lors de la prédiction ML:", e)
            # Fallback simple si le modèle plante
            progress = taskDoneValue / max(taskStartValue, 1)
            proba_REACHED = min(progress, 1) * (taskWeight / 5)
            proba_UNREACHED = max(0, 1 - proba_REACHED)
            proba_INPROGRESS = max(0, 1 - (proba_REACHED + proba_UNREACHED))

            result = {
                "proba_REACHED": round(proba_REACHED, 2),
                "proba_INPROGRESS": round(proba_INPROGRESS, 2),
                "proba_UNREACHED": round(proba_UNREACHED, 2)
            }
    else:
        # Si modèle non chargé, fallback simple
        progress = taskDoneValue / max(taskStartValue, 1)
        proba_REACHED = min(progress, 1) * (taskWeight / 5)
        proba_UNREACHED = max(0, 1 - proba_REACHED)
        proba_INPROGRESS = max(0, 1 - (proba_REACHED + proba_UNREACHED))

        result = {
            "proba_REACHED": round(proba_REACHED, 2),
            "proba_INPROGRESS": round(proba_INPROGRESS, 2),
            "proba_UNREACHED": round(proba_UNREACHED, 2)
        }

    print("Probabilités retournées:", result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
