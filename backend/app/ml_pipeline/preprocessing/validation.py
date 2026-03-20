import pandas as pd
import numpy as np


def validate_data(df: pd.DataFrame) -> list:
    """Validate a DataFrame and return a list of issues/warnings."""
    issues = []

    if df.empty:
        issues.append({"level": "error", "message": "Dataset is empty"})
        return issues

    # Check for high missing ratio
    for col in df.columns:
        missing_pct = df[col].isnull().sum() / len(df) * 100
        if missing_pct > 50:
            issues.append({"level": "warning", "message": f"Column '{col}' has {missing_pct:.1f}% missing values"})

    # Check for constant columns
    for col in df.columns:
        if df[col].nunique() <= 1:
            issues.append({"level": "warning", "message": f"Column '{col}' has only {df[col].nunique()} unique value(s)"})

    # Check for duplicate rows
    dup_count = df.duplicated().sum()
    if dup_count > 0:
        issues.append({"level": "info", "message": f"{dup_count} duplicate rows found"})

    # Check for high cardinality categoricals
    for col in df.select_dtypes(exclude=[np.number]).columns:
        if df[col].nunique() > 0.5 * len(df) and len(df) > 100:
            issues.append({"level": "warning", "message": f"Column '{col}' has very high cardinality ({df[col].nunique()} unique)"})

    return issues
