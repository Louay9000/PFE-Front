import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

# Charger le dataset
df = pd.read_csv("tasksDuration.csv")

# Limiter taskDoneValue pour qu'il soit réaliste (done >= start, max start+10)
df['taskDoneValue'] = np.clip(df['taskDoneValue'], df['taskStartValue'], df['taskStartValue'] + 10)

# Générer taskDuration si elle n'existe pas
if 'taskDuration' not in df.columns:
    # Durée = poids + avancement + petit bruit aléatoire
    df['taskDuration'] = df['taskWeight'] + df['taskDoneValue'] - df['taskStartValue'] + np.random.randint(0, 3, size=len(df))

# Features et target
X = df[['taskWeight', 'taskStartValue', 'taskDoneValue']]
y = df['taskDuration']

# Créer et entraîner le modèle RandomForest
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Sauvegarder le modèle
joblib.dump(model, 'task_duration_model.pkl')
print("Modèle de durée sauvegardé avec succès !")

# Test rapide
test_task = np.array([[3, 5, 7]])  # taskWeight=3, start=5, done=7
predicted_duration = model.predict(test_task)
print("Durée prédite pour test_task:", predicted_duration)
