from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import pandas as pd

class XGBoostClassifierModel:
    def __init__(self):
        self.model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
        self.le = LabelEncoder()
    
    def train(self, df: pd.DataFrame, target_column: str):
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        # Standardize labels for XGBoost
        y = self.le.fit_transform(y)
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        # Convert classification report back to original labels if needed, but for now utilize numeric
        report = classification_report(y_test, y_pred, output_dict=True)
        conf_matrix = confusion_matrix(y_test, y_pred).tolist()
        
        return {
            "accuracy": accuracy,
            "classification_report": report,
            "confusion_matrix": conf_matrix
        }
