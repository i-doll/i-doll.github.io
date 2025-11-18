
const closeCaution = document.getElementById('close-caution');
closeCaution.addEventListener('click', () => {
    document.getElementById('caution').close();
    document.getElementById('modal-backdrop').style.display = 'none';
});
document.getElementById('caution').showModal();