import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from app.services.model_service import load_model_object
from app.utils.file_handler import load_dataframe
from app.utils.helpers import generate_id, Timer
from app.database import crud


def predict_single(db: Session, model_id: str, features: dict, user_id: str = None) -> dict:
    result_tuple = load_model_object(model_id, db)
    model, record = result_tuple[0], result_tuple[1]
    col_encoders = result_tuple[2] if len(result_tuple) > 2 else {}
    saved_feature_cols = result_tuple[3] if len(result_tuple) > 3 else []

    # Get feature columns from hyperparameters or saved bundle
    feature_cols = saved_feature_cols or (
        record.hyperparameters.get("feature_columns") if record.hyperparameters else None
    )

    with Timer() as t:
        df = pd.DataFrame([features])

        # Apply saved encoders for text columns
        for col in df.columns:
            if col in col_encoders:
                le = col_encoders[col]
                val = str(df[col].iloc[0])
                # Handle unseen labels gracefully
                if val in le.classes_:
                    df[col] = le.transform([val])
                else:
                    # Use the most frequent class (index 0 after fit)
                    df[col] = 0
            else:
                # Try numeric conversion
                try:
                    df[col] = pd.to_numeric(df[col])
                except (ValueError, TypeError):
                    from sklearn.preprocessing import LabelEncoder
                    le = LabelEncoder()
                    df[col] = le.fit_transform(df[col].astype(str))

        # Align to training feature columns
        if feature_cols:
            for col in feature_cols:
                if col not in df.columns:
                    df[col] = 0
            df = df[feature_cols]

        prediction = model.predict(df)
        result = prediction.tolist()

    confidence = None
    probabilities = None
    if hasattr(model, "predict_proba"):
        try:
            proba = model.predict_proba(df)
            confidence = round(float(proba.max()), 4)
            probabilities = proba[0].tolist()
        except Exception:
            pass

    # Also decode the prediction back to original label if possible
    original_label = None
    target_unique_values = []
    if record.target_column:
        try:
            # Get unique values of target from the original dataset
            from app.utils.file_handler import load_dataframe as _load
            orig_df = _load(record.filename.split('_')[0] + '.csv') if '_' in record.filename else None
        except Exception:
            orig_df = None

    if col_encoders and record.target_column:
        target_col = record.target_column
        if target_col in col_encoders:
            try:
                pred_int = int(result[0])
                classes = col_encoders[target_col].classes_
                original_label = str(classes[pred_int]) if pred_int < len(classes) else str(result[0])
                target_unique_values = [str(v) for v in classes]
            except Exception:
                pass
        else:
            # Numeric target — just use the value directly
            original_label = str(result[0])

    similar_records = []
    try:
        from app.utils.file_handler import load_dataframe as _load
        
        # safely extract the original dataset filename
        dataset_name = record.filename
        if ".csv_" in record.filename:
            dataset_name = record.filename.split('.csv_')[0] + '.csv'
        elif record.name.startswith("Auto-trained on "):
            dataset_name = record.name.replace("Auto-trained on ", "")
            
        orig_df = _load(dataset_name)
        if record.task_type == "clustering":
            labels = record.metrics.get("labels", [])
            pred_cluster = int(result[0])
            indices = [i for i, l in enumerate(labels) if l == pred_cluster]
            if indices:
                import random
                sample_indices = random.sample(indices, min(3, len(indices)))
                similar_records = orig_df.iloc[sample_indices].to_dict(orient="records")
        elif record.target_column and record.target_column in orig_df.columns:
            if record.task_type == "classification":
                match_val = original_label if original_label is not None else result[0]
                matched_df = orig_df[orig_df[record.target_column].astype(str) == str(match_val)]
                if not matched_df.empty:
                    similar_records = matched_df.sample(min(3, len(matched_df))).to_dict(orient="records")
            elif record.task_type == "regression":
                pred_val = float(result[0])
                orig_df['__diff'] = (pd.to_numeric(orig_df[record.target_column], errors='coerce') - pred_val).abs()
                matched_df = orig_df.sort_values('__diff').head(3).drop(columns=['__diff'])
                similar_records = matched_df.to_dict(orient="records")
    except Exception as e:
        print("Error loading similar records:", e)

    pred = crud.create_prediction(
        db,
        model_id=model_id,
        input_data=features,
        result={"prediction": result, "original_label": original_label, "similar_records": similar_records},
        confidence=confidence,
        prediction_type="single",
        latency_ms=t.elapsed_ms,
        created_by=user_id,
    )

    return {
        "id": pred.id,
        "prediction": result[0] if len(result) == 1 else result,
        "original_label": original_label,
        "target_column": record.target_column,
        "target_unique_values": target_unique_values,
        "similar_records": similar_records,
        "confidence": confidence,
        "probabilities": probabilities,
        "latency_ms": t.elapsed_ms,
    }


def predict_batch(db: Session, model_id: str, filename: str, user_id: str = None) -> dict:
    model, record = load_model_object(model_id, db)

    with Timer() as t:
        df = load_dataframe(filename)
        predictions = model.predict(df)

    results = []
    for i, pred in enumerate(predictions):
        results.append({"row": i, "prediction": pred.item() if hasattr(pred, "item") else pred})

    crud.create_prediction(
        db,
        model_id=model_id,
        input_data={"filename": filename, "count": len(df)},
        result={"predictions": results},
        prediction_type="batch",
        latency_ms=t.elapsed_ms,
        created_by=user_id,
    )

    return {
        "count": len(results),
        "predictions": results[:20],
        "latency_ms": t.elapsed_ms,
    }


def get_prediction_history(db: Session, model_id: str = None) -> list:
    preds = crud.get_predictions(db, model_id=model_id)
    return [
        {
            "id": p.id, "model_id": p.model_id, "result": p.result,
            "confidence": p.confidence, "type": p.prediction_type,
            "latency_ms": p.latency_ms, "created_at": str(p.created_at),
        }
        for p in preds
    ]
