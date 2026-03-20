import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler


def scale_features(df: pd.DataFrame, strategy: str = "standard") -> pd.DataFrame:
    """Scale numeric features using the given strategy."""
    if strategy == "none":
        return df

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if not numeric_cols:
        return df

    scaler_map = {
        "standard": StandardScaler,
        "minmax": MinMaxScaler,
        "robust": RobustScaler,
    }

    scaler_cls = scaler_map.get(strategy)
    if not scaler_cls:
        return df

    scaler = scaler_cls()
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    return df
