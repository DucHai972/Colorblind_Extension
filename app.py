from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io
import pickle
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # This will allow requests from all origins

# Load the processor.pkl model
with open('processor.pkl', 'rb') as f:
    processor = pickle.load(f)

with open ('model.pkl', 'rb') as f:
    model = pickle.load(f)
    
# Function to preprocess the image
def preprocess_image(image):
    # Resize the image to match the model's input size (if needed)
    # Convert the image to the format expected by the model (e.g., RGB)
    # Perform any other necessary preprocessing steps
    return image.convert('RGB')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        # Read the image file
        img = Image.open(io.BytesIO(file.read()))
        
        # Preprocess the image
        img = preprocess_image(img)
        
        # Get additional parameters (e.g., text input)
        text = request.form.get('text', '')
        
        # Process the image and text inputs with the processor model
        inputs = processor(img, text, return_tensors="pt")
        
        # Generate predictions using the model
        out = model.generate(**inputs)
        
        # Decode the model output to get the prediction
        prediction = processor.decode(out[0], skip_special_tokens=True)

        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
