from sklearn.linear_model import LinearRegression, Ridge, Lasso
from xgboost import XGBRegressor
from sklearn.tree import DecisionTreeRegressor


def get_regressor(model_type: str, params: dict = None):
    """Return an sklearn-compatible regression model."""
    params = params or {}

    models = {
        "linear_regression": lambda: LinearRegression(**params),
        "ridge_regression": lambda: Ridge(**params),
        "lasso_regression": lambda: Lasso(**params),
        "xgboost_regression": lambda: XGBRegressor(n_estimators=params.get("n_estimators", 100),
                                                     max_depth=params.get("max_depth", 6),
                                                     learning_rate=params.get("learning_rate", 0.1),
                                                     verbosity=0),
        "decision_tree": lambda: DecisionTreeRegressor(**params),
    }

    factory = models.get(model_type)
    if not factory:
        raise ValueError(f"Unknown regression model: {model_type}")
    return factory()
