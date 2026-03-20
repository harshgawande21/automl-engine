import pandas as pd
import numpy as np


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Automated feature engineering: create interaction and polynomial features for numerics."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()

    # Polynomial features (squared) for top correlated columns – limited to avoid explosion
    if len(numeric_cols) > 1:
        for col in numeric_cols[:5]:
            df[f"{col}_squared"] = df[col] ** 2

    # Pair-wise interaction for first 3 numeric columns
    for i in range(min(3, len(numeric_cols))):
        for j in range(i + 1, min(3, len(numeric_cols))):
            col_a, col_b = numeric_cols[i], numeric_cols[j]
            df[f"{col_a}_x_{col_b}"] = df[col_a] * df[col_b]

    # Log transform for skewed columns
    for col in numeric_cols:
        skew = df[col].skew()
        if abs(skew) > 1 and (df[col] > 0).all():
            df[f"{col}_log"] = np.log1p(df[col])

    return df
