var conf = jQuery.noConflict(true);

(function ($) {

    $(function () {

        chrome.storage.sync.get('colorblindingValue', function (obj) {

            var noValue = obj.colorblindingValue === null || obj.colorblindingValue === undefined;
            $("input[name=type][value=" + (noValue ? "deactive" : obj.colorblindingValue ) + "]").prop('checked', true);

            if (obj.colorblindingValue !== 'deactivate' && !noValue) {
                //console.log("internal " + obj.colorblindingValue);
                execute();
            }

        });

        $('input[name="type"]:radio').change(
            function () {

                var newValue = $('input[name=type]:checked', '#cvd_radios').val();
                chrome.storage.sync.set({'colorblindingValue': newValue}, function () {

                    if (newValue !== 'deactivate') {
                        chrome.tabs.executeScript({file: 'background.js'});
                    } else {
                        chrome.tabs.executeScript({file: 'reload.js'});
                    }

                });
            }
        );

    });

})(conf);


document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const pasteImageButton = document.getElementById('pasteImageButton');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const MAX_WIDTH = 400;
    const MAX_HEIGHT = 400;
  
    pasteImageButton.addEventListener('click', async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        
        let imageFound = false;
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const url = URL.createObjectURL(blob);
              const img = new Image();
              img.src = url;
              img.onload = () => {
                const [newWidth, newHeight] = resizeImage(img.width, img.height, MAX_WIDTH, MAX_HEIGHT);
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                processImage();
              };
              imageFound = true;
              break;
            }
          }
          if (imageFound) break;
        }
  
        if (!imageFound) {
          alert('No image found in clipboard.');
        }
      } catch (error) {
        console.error('Failed to read from clipboard:', error);
        alert('Failed to read from clipboard.');
      }
    });
  
    uploadButton.addEventListener('click', async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
  
      input.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
  
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
  
          const synth = window.speechSynthesis;
          const utterance = new SpeechSynthesisUtterance(data.prediction);
          synth.speak(utterance);
  
          alert('Prediction: ' + data.prediction);
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to get prediction.');
        }
      });
  
      input.click();
    });
  
    function processImage() {
      const imageData = canvas.toDataURL('image/png');
      const formData = new FormData();
      formData.append('file', dataURItoBlob(imageData));
  
      fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(data.prediction);
        synth.speak(utterance);
  
        alert('Prediction: ' + data.prediction);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to get prediction.');
      });
    }
  
    function dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }
  
    function resizeImage(width, height, maxWidth, maxHeight) {
      if (width <= maxWidth && height <= maxHeight) {
        return [width, height];
      }
  
      const aspectRatio = width / height;
      if (width > height) {
        const newWidth = maxWidth;
        const newHeight = maxWidth / aspectRatio;
        return [newWidth, newHeight];
      } else {
        const newHeight = maxHeight;
        const newWidth = maxHeight * aspectRatio;
        return [newWidth, newHeight];
      }
    }
  });