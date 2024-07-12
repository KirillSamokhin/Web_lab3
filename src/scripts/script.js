"use strict";
$(document).ready(function () {
    $('#form').on('submit', async function (event) {
        const url = window.location.href;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        const number = parseInt(lastPart, 10);
        event.preventDefault();
        let formData = $('#form').serialize();
        await fetch(`/set/${number}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        })
            .then(response => {
                if (response.ok) {
                    console.log("Окей");
                    location.href = '/';
                }
                else {
                    alert('Произошла ошибка при обновлении данных пользователя.');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при обновлении данных пользователя.');
            });
    })
})