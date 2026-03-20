import pandas as pd
from scipy.stats import ks_2samp

def detect_drift(reference_data: pd.DataFrame, current_data: pd.DataFrame, threshold=0.05) -> dict:
    """
    Detects data drift using Kolmogorov-Smirnov test for numerical columns.
    Returns a dictionary of drifted columns.
    """
    drift_report = {}
    numerical_cols = reference_data.select_dtypes(include=['number']).columns
    
    for col in numerical_cols:
        if col in current_data.columns:
            # Drop NaNs for KS test
            ref_col = reference_data[col].dropna()
            curr_col = current_data[col].dropna()
            
            if len(ref_col) > 0 and len(curr_col) > 0:
                statistic, p_value = ks_2samp(ref_col, curr_col)
                
                drift_detected = p_value < threshold
                drift_report[col] = {
                    "p_value": p_value,
                    "drift_detected": drift_detected
                }
                
    return drift_report
