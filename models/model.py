import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, LSTM, GRU, Dropout, Input, LayerNormalization, MultiHeadAttention, GlobalAveragePooling1D, Flatten
def build_lstm_model(input_shape):
    """
    Builds a robust LSTM-based deep learning model for large time-series.
    """
    model = Sequential([
        Input(shape=input_shape),
        LSTM(128, return_sequences=True),
        Dropout(0.3),
        LSTM(64),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dense(1, activation='linear') # Output next day's CO (proxy for CO2)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

def build_gru_model(input_shape):
    """
    Builds a GRU-based deep learning model as promised in the methodology.
    Slightly faster to train than LSTM and useful for comparison.
    """
    model = Sequential([
        Input(shape=input_shape),
        GRU(128, return_sequences=True),
        Dropout(0.3),
        GRU(64),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dense(1, activation='linear')
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    return model

def build_transformer_model(input_shape):

    """
    Builds a robust Time-Series Transformer model for capturing massive temporal dependencies.
    """
    inputs = Input(shape=input_shape)
    
    # Setup dimension
    x = Dense(64)(inputs)
    
    # Layer norm and Multi-head attention
    x1 = LayerNormalization(epsilon=1e-6)(x)
    x1 = MultiHeadAttention(key_dim=64, num_heads=4, dropout=0.25)(x1, x1)
    res = x1 + x
    
    # Feed forward
    x2 = LayerNormalization(epsilon=1e-6)(res)
    x2 = Dense(128, activation="relu")(x2)
    x2 = Dropout(0.25)(x2)
    x2 = Dense(64)(x2)
    
    x3 = x2 + res
    
    # Pooling and output
    x4 = GlobalAveragePooling1D()(x3)
    x4 = Dense(32, activation='relu')(x4)
    outputs = Dense(1, activation='linear')(x4)
    
    model = Model(inputs, outputs)
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    return model

if __name__ == "__main__":
    dummy_shape = (30, 4) # 30 past days, 4 features (CO, PM2.5, NO2, SO2)
    
    lstm = build_lstm_model(dummy_shape)
    transformer = build_transformer_model(dummy_shape)
    
    print("LSTM Summary:")
    lstm.summary()
