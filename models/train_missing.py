import os
import numpy as np
import tensorflow as tf
from data_preprocessing import download_and_clean_data, scale_data, create_sequences
from model import build_gru_model
from timegan import build_generator, build_discriminator, build_gan

def train_gru(X_train, y_train, input_shape):
    print("\n--- Training GRU Model ---")
    gru_model = build_gru_model(input_shape)
    
    early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    
    gru_model.fit(
        X_train, y_train,
        epochs=30,  # Fast training
        batch_size=32,
        validation_split=0.2,
        callbacks=[early_stopping],
        verbose=1
    )
    
    os.makedirs('saved_models', exist_ok=True)
    gru_model.save('saved_models/gru_model.keras')
    print("GRU Model Saved Successfully.")

def train_timegan(X_train, sequence_length, num_features):
    print("\n--- Training TimeGAN (Lightweight) ---")
    generator = build_generator(sequence_length, num_features)
    discriminator = build_discriminator(sequence_length, num_features)
    gan = build_gan(generator, discriminator)
    
    batch_size = 32
    epochs = 40  # Lower epochs for demo purposes, enough to learn basic shapes
    
    half_batch = int(batch_size / 2)
    
    for epoch in range(epochs):
        # 1. Train Discriminator
        idx = np.random.randint(0, X_train.shape[0], half_batch)
        real_seqs = X_train[idx]
        
        noise = np.random.normal(0, 1, (half_batch, sequence_length, num_features))
        fake_seqs = generator.predict(noise, verbose=0)
        
        d_loss_real = discriminator.train_on_batch(real_seqs, np.ones((half_batch, 1)))
        d_loss_fake = discriminator.train_on_batch(fake_seqs, np.zeros((half_batch, 1)))
        d_loss = 0.5 * np.add(d_loss_real, d_loss_fake)
        
        # 2. Train Generator
        noise = np.random.normal(0, 1, (batch_size, sequence_length, num_features))
        valid_y = np.array([1] * batch_size) # We want generator to fool discriminator
        
        g_loss = gan.train_on_batch(noise, valid_y)
        
        if epoch % 10 == 0:
            print(f"Epoch {epoch}/{epochs} [D loss: {d_loss[0]:.4f}, acc: {100*d_loss[1]:.2f}%] [G loss: {g_loss:.4f}]")
            
    os.makedirs('saved_models', exist_ok=True)
    generator.save('saved_models/timegan_generator.keras')
    print("TimeGAN Generator Saved Successfully.")

if __name__ == "__main__":
    print("Loading data for missing model training...")
    df = download_and_clean_data()
    feature_cols = ['CO', 'PM2.5', 'NO2', 'SO2']
    df_scaled, scaler_ignored = scale_data(df, feature_cols)
    
    SEQ_LENGTH = 30
    
    print("Building sequences...")
    X, y = create_sequences(df_scaled, feature_cols, target_col='CO', seq_length=SEQ_LENGTH)
    
    # 80/20 train/test split
    split_index = int(len(X) * 0.8)
    X_train = X[:split_index]
    y_train = y[:split_index]
    
    input_shape = (SEQ_LENGTH, len(feature_cols))
    
    # Train GRU
    train_gru(X_train, y_train, input_shape)
    
    # Train TimeGAN
    train_timegan(X_train, SEQ_LENGTH, len(feature_cols))
    
    print("\nAll missing models trained. Run your backend now!")
