from sklearn.neural_network import MLPClassifier, MLPRegressor


def get_deep_learning_model(task_type: str = "classification", params: dict = None):
    """Return an sklearn MLP model as a lightweight deep-learning proxy.
    For production use, replace with PyTorch/TensorFlow models.
    """
    params = params or {}
    default_hidden = params.get("hidden_layer_sizes", (128, 64, 32))
    max_iter = params.get("max_iter", 500)
    learning_rate_init = params.get("learning_rate_init", 0.001)

    if task_type == "classification":
        return MLPClassifier(
            hidden_layer_sizes=default_hidden,
            max_iter=max_iter,
            learning_rate_init=learning_rate_init,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1,
        )
    else:
        return MLPRegressor(
            hidden_layer_sizes=default_hidden,
            max_iter=max_iter,
            learning_rate_init=learning_rate_init,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1,
        )
