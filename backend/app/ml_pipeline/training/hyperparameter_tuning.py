import pandas as pd
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from app.ml_pipeline.training.train_model import get_model_instance
from app.core.config import DEFAULT_RANDOM_STATE


def tune_hyperparameters(df: pd.DataFrame, target_column: str, model_type: str,
                         param_grid: dict, search_strategy: str = "grid", cv_folds: int = 5) -> dict:
    """Perform hyperparameter tuning with Grid or Randomized search."""
    X = df.drop(columns=[target_column])
    y = df[target_column]

    wrapper = get_model_instance(model_type)
    base_model = wrapper.model

    if search_strategy == "random":
        searcher = RandomizedSearchCV(
            base_model, param_grid, n_iter=20, cv=cv_folds,
            scoring="accuracy", random_state=DEFAULT_RANDOM_STATE, n_jobs=-1,
        )
    else:
        searcher = GridSearchCV(
            base_model, param_grid, cv=cv_folds,
            scoring="accuracy", n_jobs=-1,
        )

    searcher.fit(X, y)

    return {
        "best_params": searcher.best_params_,
        "best_score": round(float(searcher.best_score_), 4),
        "cv_results": [
            {
                "params": params,
                "mean_score": round(float(mean), 4),
                "std_score": round(float(std), 4),
            }
            for params, mean, std in zip(
                searcher.cv_results_["params"],
                searcher.cv_results_["mean_test_score"],
                searcher.cv_results_["std_test_score"],
            )
        ][:20],
    }
