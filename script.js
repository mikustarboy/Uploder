document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const previewContainer = document.getElementById('previewContainer');
    const fileLink = document.getElementById('fileLink');
    const copyBtn = document.getElementById('copyBtn');
    const errorElement = document.getElementById('error');
    const fileInfo = document.getElementById('fileInfo');
    const uploadForm = document.getElementById('uploadForm');
    
    // Event untuk tombol browse
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Event untuk drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    // Event untuk drop file
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files[0]);
        }
    }
    
    // Event untuk input file
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(this.files[0]);
        }
    });
    
    function handleFiles(file) {
        // Tampilkan informasi file
        const fileSize = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.textContent = `${file.name} (${fileSize} MB)`;
        
        // Reset tampilan
        errorElement.style.display = 'none';
        resultContainer.style.display = 'none';
        
        // Validasi ukuran file (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            showError('Ukuran file melebihi batas maksimum (100 MB)');
            return;
        }
        
        // Validasi tipe file
        const fileType = file.type.split('/')[0];
        if (fileType !== 'image' && fileType !== 'video') {
            showError('Hanya file gambar dan video yang diizinkan');
            return;
        }
        
        uploadFile(file);
    }
    
    function uploadFile(file) {
        loading.style.display = 'block';
        
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('upload.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            
            if (data.success) {
                showResult(data, file);
            } else {
                showError(data.message || 'Terjadi kesalahan saat mengunggah file');
            }
        })
        .catch(error => {
            loading.style.display = 'none';
            showError('Terjadi kesalahan pada server. Silakan coba lagi.');
            console.error('Error:', error);
        });
    }
    
    function showResult(data, file) {
        resultContainer.style.display = 'block';
        fileLink.textContent = data.file_url;
        
        // Bersihkan preview sebelumnya
        previewContainer.innerHTML = '';
        
        // Buat preview berdasarkan tipe file
        if (data.file_type === 'image') {
            const img = document.createElement('img');
            img.src = data.file_url;
            img.alt = data.original_filename;
            img.className = 'preview';
            previewContainer.appendChild(img);
        } else if (data.file_type === 'video') {
            const video = document.createElement('video');
            video.src = data.file_url;
            video.controls = true;
            video.className = 'preview';
            previewContainer.appendChild(video);
        }
    }
    
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Fungsi untuk menyalin tautan
    copyBtn.addEventListener('click', () => {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = fileLink.textContent;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        copyBtn.textContent = 'Tersalin!';
        setTimeout(() => {
            copyBtn.textContent = 'Salin Tautan';
        }, 2000);
    });
});
