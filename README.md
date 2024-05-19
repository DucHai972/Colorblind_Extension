# UET May 2024
Class: Tương tác người-máy - INT2041_20
## Team Members

**Group 3**

- Nguyễn Đức Hải – 21020623
- Tạ Quang Chiến – 21020042
- Tạ Hoàng Giang – 21021484
- Trần Hữu Đức - 21020044

# Color Blind Assistant Extension

This project is developed by a school team to assist color blind individuals by changing the colors of websites for better visibility and providing audio descriptions for images. The extension leverages deep learning models to generate image captions and convert them to audio.

## Features

1. **Color Adjustment**: Modify website colors to enhance visibility for color blind users.
2. **Image Captioning**: Generate descriptive captions for images.
3. **Audio Output**: Convert the generated captions into audio to assist visually impaired users.

## How to Use

### Prerequisites

- Ensure you have Python installed on your system.
- Install the required Python packages using the following command:

    ```bash
    pip install -r requirements.txt
    ```

### Download Models

1. Download the two models required for the extension from the following link:
   [Download Models](https://drive.google.com/drive/folders/1amXsAG6dp1TYI5q1v15YpUYW0fzb0NYt?usp=sharing)

2. Place the downloaded models in the same directory as the extension files.

### Running the Flask Server

1. Navigate to the directory containing the extension files and the downloaded models.

2. Start the Flask server using the following command:

    ```bash
    python app.py
    ```

### Installing the Extension

1. Open Google Chrome and go to `chrome://extensions/`.

2. Enable "Developer mode" by clicking the toggle switch in the top right corner.

3. Click on the "Load unpacked" button and select the directory containing the extension files.

4. The extension should now be installed and visible in the Chrome toolbar.

### Using the Extension

1. **Color Adjustment**:
   - Click on the extension icon in the Chrome toolbar.
   - Use the provided options to adjust the website colors according to your preference.

2. **Image Captioning and Audio Output**:
   - Upload an image or paste an image from your clipboard using the extension interface.
   - The extension will send the image to the Flask server for processing.
   - An audio description of the image will be played automatically.

## Project Structure

- `app.py`: Flask server application.
- `static/`: Static files including HTML, CSS, and JavaScript for the extension.
- `templates/`: HTML templates for the extension interface.
- `requirements.txt`: List of Python packages required for the project.
- `models/`: Directory where the downloaded models should be placed.

## Credits

This project was developed by a dedicated team of students to enhance web accessibility for individuals with color blindness and visual impairments.
