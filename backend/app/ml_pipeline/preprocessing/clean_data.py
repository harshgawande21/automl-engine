import pandas as pd
import numpy as np


def clean_data(df: pd.DataFrame, strategy: str = "mean", outlier_strategy: str = "none") -> pd.DataFrame:
    """Clean data: drop duplicates, handle missing values, and optionally remove outliers."""
    df = df.drop_duplicates()

    numeric_cols = df.select_dtypes(include=[np.number]).columns
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns

    # Missing values
    if strategy == "drop":
        df = df.dropna()
    elif strategy == "mean":
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
        for col in categorical_cols:
            if not df[col].mode().empty:
                df[col] = df[col].fillna(df[col].mode()[0])
    elif strategy == "median":
        df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
        for col in categorical_cols:
            if not df[col].mode().empty:
                df[col] = df[col].fillna(df[col].mode()[0])
    elif strategy == "mode":
        for col in df.columns:
            if not df[col].mode().empty:
                df[col] = df[col].fillna(df[col].mode()[0])
    elif strategy == "constant":
        df[numeric_cols] = df[numeric_cols].fillna(0)
        df[categorical_cols] = df[categorical_cols].fillna("unknown")

    # Outliers
    if outlier_strategy == "iqr":
        for col in numeric_cols:
            Q1, Q3 = df[col].quantile(0.25), df[col].quantile(0.75)
            IQR = Q3 - Q1
            df = df[(df[col] >= Q1 - 1.5 * IQR) & (df[col] <= Q3 + 1.5 * IQR)]
    elif outlier_strategy == "zscore":
        from scipy.stats import zscore
        z = np.abs(zscore(df[numeric_cols], nan_policy="omit"))
        df = df[(z < 3).all(axis=1)]
    elif outlier_strategy == "clip":
        for col in numeric_cols:
            lower, upper = df[col].quantile(0.01), df[col].quantile(0.99)
            df[col] = df[col].clip(lower, upper)

    return df.reset_index(drop=True)
