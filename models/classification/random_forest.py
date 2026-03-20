from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pandas as pd

class RandomForestClassifierModel:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100)
    
    def train(self, df: pd.DataFrame, target_column: str):
        X = df.drop(columns=[target_column])
        y = df[target_column]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(y_test, y_pred, output_dict=True)
        conf_matrix = confusion_matrix(y_test, y_pred).tolist()
        
        return {
            "accuracy": accuracy,
            "classification_report": report,
            "confusion_matrix": conf_matrix,
            "feature_importances": dict(zip(X.columns, self.model.feature_importances_))
        }
