# ── Model Types ──────────────────────────────────────
CLASSIFICATION_MODELS = [
    "logistic_regression", "svm", "random_forest",
    "xgboost", "naive_bayes", "knn",
]

REGRESSION_MODELS = [
    "linear_regression", "ridge_regression", "lasso_regression",
    "xgboost_regression", "decision_tree",
]

CLUSTERING_MODELS = ["kmeans", "dbscan", "hierarchical"]

DEEP_LEARNING_MODELS = ["neural_network"]

ALL_MODELS = CLASSIFICATION_MODELS + REGRESSION_MODELS + CLUSTERING_MODELS + DEEP_LEARNING_MODELS

# ── Allowed File Types ───────────────────────────────
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".parquet"}

# ── Task Types ───────────────────────────────────────
TASK_CLASSIFICATION = "classification"
TASK_REGRESSION = "regression"
TASK_CLUSTERING = "clustering"

# ── Preprocessing Strategies ─────────────────────────
MISSING_VALUE_STRATEGIES = ["drop", "mean", "median", "mode", "constant"]
ENCODING_STRATEGIES = ["label", "onehot", "target"]
SCALING_STRATEGIES = ["none", "standard", "minmax", "robust"]
OUTLIER_STRATEGIES = ["none", "iqr", "zscore", "clip"]

# ── Status Codes ─────────────────────────────────────
STATUS_PENDING = "pending"
STATUS_TRAINING = "training"
STATUS_COMPLETED = "completed"
STATUS_FAILED = "failed"

# ── Drift Thresholds ────────────────────────────────
DRIFT_P_VALUE_THRESHOLD = 0.05
