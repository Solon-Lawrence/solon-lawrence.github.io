const themeSwitch = document.getElementById('theme-switch')

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    document.body.classList.add('darkmode')
} else {
    document.body.classList.remove('darkmode')
    localStorage.setItem('theme', 'dark')
}

themeSwitch.addEventListener('click', function() {
    if (document.body.classList.contains('darkmode')) {
        document.body.classList.remove('darkmode')
        localStorage.setItem('theme', 'dark')
    } else {
        document.body.classList.add('darkmode')
        localStorage.setItem('theme', 'light')
    }
});