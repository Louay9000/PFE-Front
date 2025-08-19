import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import pickle

# Charger les données
df = pd.read_csv("tasks.csv")

# Garder seulement les colonnes utiles
X = df[['taskWeight', 'taskStartValue', 'taskDoneValue']]
y = df['taskState']

# Encoder les labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Entraîner le modèle
model = LogisticRegression(max_iter=200)
model.fit(X_train, y_train)

# Sauvegarder le modèle et l’encoder
with open("model.pkl", "wb") as f:
    pickle.dump((model, label_encoder), f)
