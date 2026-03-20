from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import pandas as pd

class KMeansClusteringModel:
    def __init__(self, n_clusters=3):
        self.model = KMeans(n_clusters=n_clusters, random_state=42)
    
    def train(self, df: pd.DataFrame):
        # Clustering is unsupervised, so we use all columns or dropped target if specified externally
        # Here we assume df is already Feature matrix X
        
        self.model.fit(df)
        labels = self.model.labels_
        
        # Calculate silhouette score if more than 1 cluster and > 1 sample
        try:
            score = silhouette_score(df, labels)
        except:
            score = -1.0
            
        return {
            "silhouette_score": score,
            "cluster_centers": self.model.cluster_centers_.tolist(),
            "labels": labels.tolist()
        }
