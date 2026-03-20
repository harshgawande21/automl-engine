from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

class DBSCANClusteringModel:
    def __init__(self, eps=0.5, min_samples=5):
        self.model = DBSCAN(eps=eps, min_samples=min_samples)
        self.scaler = StandardScaler()

    def train(self, df: pd.DataFrame):
        X_scaled = self.scaler.fit_transform(df)
        self.model.fit(X_scaled)
        labels = self.model.labels_

        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise = list(labels).count(-1)

        try:
            if n_clusters > 1:
                score = silhouette_score(X_scaled, labels)
            else:
                score = -1.0
        except:
            score = -1.0

        return {
            "n_clusters": n_clusters,
            "n_noise_points": n_noise,
            "silhouette_score": score,
            "labels": labels.tolist()
        }
