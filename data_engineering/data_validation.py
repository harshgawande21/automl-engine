import pandas as pd

def validate_schema(df: pd.DataFrame, expected_columns: list) -> bool:
    """
    Checks if the dataframe contains all expected columns.
    """
    return all(col in df.columns for col in expected_columns)

def check_missing_values(df: pd.DataFrame, threshold: float = 0.5) -> dict:
    """
    Checks for columns with missing values exceeding a threshold.
    """
    missing_percent = df.isnull().mean()
    high_missing_cols = missing_percent[missing_percent > threshold].index.tolist()
    
    return {
        "has_high_missing_values": len(high_missing_cols) > 0,
        "high_missing_columns": high_missing_cols
    }
