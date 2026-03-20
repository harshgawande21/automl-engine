import time

class ModelMonitor:
    def __init__(self):
        self.logs = []
        
    def log_prediction(self, model_name, input_data_shape, prediction_time_ms):
        log_entry = {
            "timestamp": time.time(),
            "model": model_name,
            "input_shape": input_data_shape,
            "latency_ms": prediction_time_ms
        }
        self.logs.append(log_entry)
        
    def get_logs(self):
        return self.logs
