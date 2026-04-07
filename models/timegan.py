import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, LSTM, Dropout, Input, LeakyReLU, BatchNormalization, Reshape, Flatten

def build_generator(sequence_length, num_features):
    """
    Builds a lightweight TimeGAN Generator.
    Takes random noise sequence and generates realistic CO emission pathways.
    """
    model = Sequential([
        Input(shape=(sequence_length, num_features)),
        LSTM(64, return_sequences=True),
        BatchNormalization(),
        LeakyReLU(alpha=0.2),
        
        LSTM(64, return_sequences=True),
        BatchNormalization(),
        LeakyReLU(alpha=0.2),
        
        Dense(32),
        LeakyReLU(alpha=0.2),
        
        # Output synthetic sequence matching original shape
        Dense(num_features, activation='linear')
    ], name="timegan_generator")
    
    return model

def build_discriminator(sequence_length, num_features):
    """
    Builds a TimeGAN Discriminator.
    Attempts to distinguish between real historical sequences and fake generator sequences.
    """
    model = Sequential([
        Input(shape=(sequence_length, num_features)),
        LSTM(64, return_sequences=True),
        LeakyReLU(alpha=0.2),
        Dropout(0.3),
        
        LSTM(32, return_sequences=False),
        LeakyReLU(alpha=0.2),
        Dropout(0.3),
        
        Dense(1, activation='sigmoid') # Real (1) or Fake (0)
    ], name="timegan_discriminator")
    
    # We compile the discriminator separately 
    model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5), metrics=['accuracy'])
    return model

def build_gan(generator, discriminator):
    """
    Combines Generator and Discriminator to train the Generator.
    """
    discriminator.trainable = False # For the combined model, discriminator only provides gradient to generator
    
    model = Sequential([
        generator,
        discriminator
    ])
    
    model.compile(loss='binary_crossentropy', optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002, beta_1=0.5))
    return model
