import pandas as pd
from sklearn.model_selection import train_test_split
from app.core.config import DEFAULT_TEST_SIZE, DEFAULT_RANDOM_STATE
from app.core.constants import CLASSIFICATION_MODELS, REGRESSION_MODELS, CLUSTERING_MODELS
from app.ml_pipeline.models.classification_models import get_classifier
from app.ml_pipeline.models.regression_models import get_regressor
from app.ml_pipeline.models.clustering_models import get_clusterer
from app.ml_pipeline.evaluation.metrics import evaluate_classification, evaluate_regression


class ModelWrapper:
    """Unified wrapper around any sklearn-style model."""

    def __init__(self, model, task_type: str):
        self.model = model
        self.task_type = task_type

    def train(self, df: pd.DataFrame = None, target_column: str = None, X=None, test_size: float = DEFAULT_TEST_SIZE):
        if self.task_type == "clustering":
            labels = self.model.fit_predict(X if X is not None else df)
            return {"labels": labels.tolist(), "n_clusters": len(set(labels) - {-1})}

        X = df.drop(columns=[target_column])
        y = df[target_column]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=DEFAULT_RANDOM_STATE)

        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)

        if self.task_type == "classification":
            return evaluate_classification(y_test, y_pred, self.model, X)
        else:
            return evaluate_regression(y_test, y_pred)


def get_model_instance(model_type: str, n_clusters: int = 3, params: dict = None) -> ModelWrapper:
    """Factory: return the right ModelWrapper for the given model_type."""
    if model_type in CLASSIFICATION_MODELS:
        return ModelWrapper(get_classifier(model_type, params), "classification")
    elif model_type in REGRESSION_MODELS:
        return ModelWrapper(get_regressor(model_type, params), "regression")
    elif model_type in CLUSTERING_MODELS:
        return ModelWrapper(get_clusterer(model_type, n_clusters, params), "clustering")
    else:
        raise ValueError(f"Unknown model type: {model_type}")
