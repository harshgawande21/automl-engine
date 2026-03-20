from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from xgboost import XGBClassifier


def get_classifier(model_type: str, params: dict = None):
    """Return an sklearn-compatible classification model."""
    params = params or {}

    models = {
        "logistic_regression": lambda: LogisticRegression(max_iter=params.get("max_iter", 1000), **{k: v for k, v in params.items() if k != "max_iter"}),
        "svm": lambda: SVC(probability=True, **params),
        "random_forest": lambda: RandomForestClassifier(n_estimators=params.get("n_estimators", 100), **{k: v for k, v in params.items() if k != "n_estimators"}),
        "xgboost": lambda: XGBClassifier(n_estimators=params.get("n_estimators", 100),
                                          max_depth=params.get("max_depth", 6),
                                          learning_rate=params.get("learning_rate", 0.1),
                                          use_label_encoder=False, eval_metric="logloss", verbosity=0),
        "naive_bayes": lambda: GaussianNB(**params),
        "knn": lambda: KNeighborsClassifier(n_neighbors=params.get("n_neighbors", 5)),
    }

    factory = models.get(model_type)
    if not factory:
        raise ValueError(f"Unknown classification model: {model_type}")
    return factory()
