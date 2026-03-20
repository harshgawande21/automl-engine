from fastapi.testclient import TestClient
from main import app
import os
import pandas as pd
import pytest

client = TestClient(app)

# Create a dummy CSV file for testing
TEST_FILENAME = "test_data.csv"
TEST_FILE_PATH = os.path.join("uploads", TEST_FILENAME)

@pytest.fixture(scope="module", autouse=True)
def setup_test_data():
    os.makedirs("uploads", exist_ok=True)
    df = pd.DataFrame({
        "feature1": [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        "feature2": [5, 4, 3, 2, 1, 5, 4, 3, 2, 1],
        "target": [0, 0, 0, 1, 1, 0, 0, 0, 1, 1]
    })
    df.to_csv(TEST_FILE_PATH, index=False)
    yield
    # Cleanup
    if os.path.exists(TEST_FILE_PATH):
        os.remove(TEST_FILE_PATH)
    if os.path.exists("saved_models"):
         for f in os.listdir("saved_models"):
             if f.startswith("test_data.csv"):
                 os.remove(os.path.join("saved_models", f))

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AutoInsight API"}

def test_upload_file():
    with open(TEST_FILE_PATH, "rb") as f:
        response = client.post("/data/upload", files={"file": (TEST_FILENAME, f, "text/csv")})
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == TEST_FILENAME
    assert "columns" in data

def test_train_logistic_regression():
    response = client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "logistic_regression"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "accuracy" in data["results"]

def test_train_random_forest():
    response = client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "random_forest"
    })
    assert response.status_code == 200
    data = response.json()
    assert "feature_importances" in data["results"]

def test_train_svm():
    response = client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "svm"
    })
    assert response.status_code == 200

def test_train_xgboost():
    # XGBoost might fail if libraries are strictly missing in some envs, but commonly installed
    response = client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "xgboost"
    })
    # If xgb not installed, checking for 500 or 200 depending on env. 
    # But since we are mocking/assuming, let's assert 200
    assert response.status_code == 200

def test_train_naive_bayes():
    response = client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "naive_bayes"
    })
    assert response.status_code == 200

def test_predict():
    # First ensure a model exists (Logistic Regression)
    client.post("/train", json={
        "filename": TEST_FILENAME,
        "target_column": "target",
        "model_type": "logistic_regression"
    })
    
    response = client.post("/predict", json={
        "model_filename": f"{TEST_FILENAME}_logistic_regression.joblib",
        "features": {"feature1": 2, "feature2": 4}
    })
    assert response.status_code == 200
    assert "prediction" in response.json()
