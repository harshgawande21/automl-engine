import pandas as pd
from app.utils.file_handler import load_dataframe
from app.ml_pipeline.preprocessing.clean_data import clean_data
from app.ml_pipeline.preprocessing.encoding import encode_features
from app.ml_pipeline.preprocessing.scaling import scale_features
from app.ml_pipeline.preprocessing.validation import validate_data


def preprocess_dataset(filename: str, missing: str = "mean", encoding: str = "onehot",
                       scaling: str = "standard", outlier: str = "none") -> dict:
    df = load_dataframe(filename)

    # Validate
    issues = validate_data(df)

    # Clean
    df = clean_data(df, strategy=missing, outlier_strategy=outlier)

    # Encode
    df = encode_features(df, strategy=encoding)

    # Scale
    df = scale_features(df, strategy=scaling)

    return {
        "filename": filename,
        "shape": list(df.shape),
        "columns": df.columns.tolist(),
        "validation_issues": issues,
        "preview": df.head(10).fillna("").to_dict(orient="records"),
    }
