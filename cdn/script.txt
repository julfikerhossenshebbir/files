// Show the image preview modal
function showPreview(img) {
    const modal = document.getElementById("imagePreviewModal");
    const modalImg = document.getElementById("previewImage");

    modal.style.display = "block";
    modalImg.src = img.src;
    document.body.classList.add("modal-open"); // Add blur to link cards
}

// Close the image preview modal
function closePreview() {
    const modal = document.getElementById("imagePreviewModal");

    modal.style.display = "none";
    document.body.classList.remove("modal-open"); // Remove blur from link cards
}
