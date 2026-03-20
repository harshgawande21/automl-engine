from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering


def get_clusterer(model_type: str, n_clusters: int = 3, params: dict = None):
    """Return an sklearn-compatible clustering model."""
    params = params or {}

    models = {
        "kmeans": lambda: KMeans(n_clusters=n_clusters, random_state=42, n_init=10, **params),
        "dbscan": lambda: DBSCAN(eps=params.get("eps", 0.5), min_samples=params.get("min_samples", 5)),
        "hierarchical": lambda: AgglomerativeClustering(n_clusters=n_clusters, **params),
    }

    factory = models.get(model_type)
    if not factory:
        raise ValueError(f"Unknown clustering model: {model_type}")
    return factory()
