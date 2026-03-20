from fastapi.testclient import TestClient
from main import app
import unittest
import os
import pandas as pd
import shutil

class TestBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.TEST_FILENAME = "test_data_unittest.csv"
        cls.TEST_FILE_PATH = os.path.join("uploads", cls.TEST_FILENAME)
        
        os.makedirs("uploads", exist_ok=True)
        df = pd.DataFrame({
            "feature1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
            "feature2": [5, 4, 3, 2, 1, 5, 4, 3, 2, 1],
            "target": [0, 0, 0, 1, 1, 0, 0, 0, 1, 1]
        })
        df.to_csv(cls.TEST_FILE_PATH, index=False)

    @classmethod
    def tearDownClass(cls):
        if os.path.exists(cls.TEST_FILE_PATH):
            os.remove(cls.TEST_FILE_PATH)
        # Cleanup models
        if os.path.exists("saved_models"):
             for f in os.listdir("saved_models"):
                 if f.startswith(cls.TEST_FILENAME):
                     os.path.join("saved_models", f)

    def test_01_read_main(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Welcome to AutoInsight API"})

    def test_02_upload_file(self):
        with open(self.TEST_FILE_PATH, "rb") as f:
            response = self.client.post("/data/upload", files={"file": (self.TEST_FILENAME, f, "text/csv")})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["filename"], self.TEST_FILENAME)
        self.assertTrue("columns" in data)

    def test_03_train_logistic_regression(self):
        response = self.client.post("/train", json={
            "filename": self.TEST_FILENAME,
            "target_column": "target",
            "model_type": "logistic_regression"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertTrue("accuracy" in data["results"])

    def test_04_train_random_forest(self):
        response = self.client.post("/train", json={
            "filename": self.TEST_FILENAME,
            "target_column": "target",
            "model_type": "random_forest"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("feature_importances" in data["results"])

    def test_05_predict(self):
        # We need to make sure logic is trained first, which test_03 does.
        # But unit tests order isn't guaranteed alphabetically usually, but 03 runs before 05 typically with naming
        response = self.client.post("/predict", json={
            "model_filename": f"{self.TEST_FILENAME}_logistic_regression.joblib",
            "features": {"feature1": 2, "feature2": 4}
        })
        self.assertEqual(response.status_code, 200)
        self.assertTrue("prediction" in response.json())

if __name__ == '__main__':
    unittest.main()
