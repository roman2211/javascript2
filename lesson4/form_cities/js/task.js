
document.querySelector('input[type="submit"]').addEventListener('click', function () {
    var name = document.querySelector('#name');
    var tel = document.querySelector('#tel');
    var mail = document.querySelector('#mail');
    var nameRE = /^[a-zа-яё]{2,}$/i;
    var telRE = /\+\d\(\d{3}\)\d{3}\-\d{4}/;
    var emailRE = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.ru$/;
   
    function classListToggle(re, data) {
        var test = re.test(data.value);
        if (test) {
            data.classList.remove('false');
            data.nextElementSibling.classList.add('hidden');
        } else {
            data.classList.add('false');
            data.nextElementSibling.classList.remove('hidden');
        }
    }

    classListToggle(nameRE, name);
    classListToggle(telRE, tel);
    classListToggle(emailRE, mail);

    //button 'reset' clears all classes 'false'
    document.querySelector('input[type="reset"]').addEventListener('click', function () {
        name.classList.remove('false');
        tel.classList.remove('false');
        mail.classList.remove('false');
    });
});


