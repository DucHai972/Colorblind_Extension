import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# img_url = 'https://storage.googleapis.com/sfr-vision-language-research/BLIP/demo.jpg'
# raw_image = Image.open(requests.get(img_url, stream=True).raw).convert('RGB')

file_path = 'C:/Users/Computer/Desktop/extension/a.jpg'
raw_image = Image.open(file_path).convert('RGB')

# conditional image captioning
text = "a photography of"
inputs = processor(raw_image, text, return_tensors="pt")

print(inputs)
out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))
# >>> a photography of a woman and her dog

# unconditional image captioning
inputs = processor(raw_image, return_tensors="pt")

out = model.generate(**inputs)
print(processor.decode(out[0], skip_special_tokens=True))




####  Drop 
import pickle
from transformers import BlipProcessor, BlipForConditionalGeneration

# Load the processor and model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Define the file paths
processor_path = "C:/Users/Computer/Desktop/extension/venv/processor.pkl"
model_path = "C:/Users/Computer/Desktop/extension/venv/model.pkl"

# Save the processor and model to pickle files
with open(processor_path, "wb") as f:
    pickle.dump(processor, f)

with open(model_path, "wb") as f:
    pickle.dump(model, f)
