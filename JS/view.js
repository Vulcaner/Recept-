class View {
    constructor(){
        this.previewBox = document.querySelector('.image-preview-placeholder');
        this.uploadInput = document.getElementById('upload_foto');
    }

    bindFileUpload(handler) {
        this.uploadInput.addEventListener('change', () => {
            const file = this.uploadInput.files[0];
            handler(file);
        });
    }

    showImage(fileURL) {
        this.previewBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = fileURL;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        this.previewBox.appendChild(img);
    }

    showError(message) {
        alert(message);
        this.uploadInput.value = '';
    }

    resetPreview() {
        this.previewBox.innerHTML = 'Zatím není vložen žádný obrázek';
    }
}
