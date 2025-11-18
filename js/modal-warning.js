
const closeCaution = document.getElementById('close-caution');
const caution = document.getElementById('caution');
const modalBackdrop = document.getElementById('modal-backdrop');

if (!closeCaution || !caution || !modalBackdrop) {
    console.error('Required modal elements not found');
} else {
    closeCaution.addEventListener('click', () => {
        caution.close();
        modalBackdrop.style.display = 'none';
    });
    caution.showModal();
}