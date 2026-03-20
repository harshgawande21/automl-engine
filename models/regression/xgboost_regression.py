from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pandas as pd

class XGBoostRegressionModel:
    def __init__(self):
        self.model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)

    def train(self, df: pd.DataFrame, target_column: str):
        X = df.drop(columns=[target_column])
        y = df[target_column]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)

        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        return {
            "mean_squared_error": mse,
            "r2_score": r2,
            "feature_importances": self.model.feature_importances_.tolist()
        }
