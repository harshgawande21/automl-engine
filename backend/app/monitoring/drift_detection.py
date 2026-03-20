import pandas as pd
from scipy.stats import ks_2samp


def detect_drift(reference_data: pd.DataFrame, current_data: pd.DataFrame, threshold: float = 0.05) -> dict:
    """Detect data drift using Kolmogorov-Smirnov test for numerical columns."""
    drift_report = {}
    numerical_cols = reference_data.select_dtypes(include=["number"]).columns

    for col in numerical_cols:
        if col in current_data.columns:
            ref_col = reference_data[col].dropna()
            curr_col = current_data[col].dropna()

            if len(ref_col) > 0 and len(curr_col) > 0:
                statistic, p_value = ks_2samp(ref_col, curr_col)
                drift_detected = p_value < threshold
                drift_report[col] = {
                    "statistic": round(float(statistic), 4),
                    "p_value": round(float(p_value), 4),
                    "drift_detected": bool(drift_detected),
                }

    return drift_report
