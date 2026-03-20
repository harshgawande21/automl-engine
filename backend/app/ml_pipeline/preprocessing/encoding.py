import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, OneHotEncoder


def encode_features(df: pd.DataFrame, strategy: str = "onehot") -> pd.DataFrame:
    """Encode categorical columns using the given strategy."""
    categorical_cols = df.select_dtypes(exclude=[np.number]).columns.tolist()

    if not categorical_cols:
        return df

    if strategy == "label":
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))

    elif strategy == "onehot":
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    elif strategy == "target":
        # Target encoding is a placeholder — requires target column knowledge
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))

    return df
