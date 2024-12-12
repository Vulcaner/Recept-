class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindFileUpload(this.handleFileUpload);
    }

    handleFileUpload = (file) => {
        const validation = this.model.validateFile(file);
        if (!validation.valid) {
            this.view.showError(validation.error);
            this.view.resetPreview();
            return;
        }

        const fileURL = URL.createObjectURL(file);
        this.view.showImage(fileURL);
    }
}
