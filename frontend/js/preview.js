window.onload = () => {
  const imgUpload = document.querySelector('.q-form__image-upload');
  const imgBlock = document.querySelector('.outer-upload__block');
  const imgUploadBtns = document.querySelector('.image-upload-btns');

  imgUpload.onchange = (e) => {
    const file = URL.createObjectURL(e.target.files[0]);
    const uploadedImg = document.createElement('img');
    uploadedImg.src = file;
    uploadedImg.classList.add('upload-image-preview');
    imgBlock.innerHTML = '';
    imgBlock.appendChild(uploadedImg);
    imgUploadBtns.classList.add('image-upload-btns-show');
  };
};
