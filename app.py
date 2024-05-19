from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import io
import pickle
from flask_cors import CORS
from transformers import BlipProcessor, BlipForConditionalGeneration

app = Flask(__name__)
CORS(app)  

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
    
def preprocess_image(image):
    return image.convert('RGB')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    try:
        img = Image.open(io.BytesIO(file.read()))
        img = preprocess_image(img)
        text = request.form.get('text', '')
        inputs = processor(img, text, return_tensors="pt")

        out = model.generate(**inputs)
        prediction = processor.decode(out[0], skip_special_tokens=True)

        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
