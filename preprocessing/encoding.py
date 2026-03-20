import pandas as pd
from sklearn.preprocessing import LabelEncoder

def encode_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Encodes categorical features using Label Encoding.
    Future improvement: Add One-Hot Encoding support.
    """
    categorical_cols = df.select_dtypes(exclude=['number']).columns
    
    le = LabelEncoder()
    
    for col in categorical_cols:
        # Convert to string to ensure consistency before encoding
        df[col] = df[col].astype(str)
        df[col] = le.fit_transform(df[col])
        
    return df
