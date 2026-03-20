import numpy as np
import pandas as pd


def compute_lime_explanation(model, instance: pd.DataFrame, training_data: pd.DataFrame = None) -> dict:
    """Generate LIME explanation for a single prediction instance."""
    try:
        import lime
        import lime.lime_tabular

        if training_data is None:
            return {"message": "Training data required for LIME explanation"}

        feature_names = training_data.columns.tolist()

        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data.values,
            feature_names=feature_names,
            mode="classification" if hasattr(model, "predict_proba") else "regression",
            verbose=False,
        )

        predict_fn = model.predict_proba if hasattr(model, "predict_proba") else model.predict
        explanation = explainer.explain_instance(instance.values[0], predict_fn, num_features=len(feature_names))

        return {
            "explanation": {name: round(float(weight), 4) for name, weight in explanation.as_list()},
            "prediction": explanation.predict_proba.tolist() if hasattr(explanation, "predict_proba") else None,
            "method": "lime",
        }

    except ImportError:
        return {"message": "LIME library not installed. Run: pip install lime"}
    except Exception as e:
        return {"error": str(e)}
