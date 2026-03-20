from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score
import pandas as pd

class HierarchicalClusteringModel:
    def __init__(self, n_clusters=3):
        self.model = AgglomerativeClustering(n_clusters=n_clusters)

    def train(self, df: pd.DataFrame):
        self.model.fit(df)
        labels = self.model.labels_

        try:
            score = silhouette_score(df, labels)
        except:
            score = -1.0

        return {
            "n_clusters": self.model.n_clusters_,
            "silhouette_score": score,
            "labels": labels.tolist()
        }
