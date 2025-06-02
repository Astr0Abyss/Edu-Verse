// make visual buttons work like buttons
document.querySelectorAll('[role=button], .btn').forEach((button) => {
    // <button> elements already have enter & space key clicks
    if (button && button.nodeName === 'BUTTON') return;
    // links already have enter click, only add space click
    // other elements get both space and enter clicks
    const isLink = button.nodeName === 'A';
    const clickKeys = isLink ? [' '] : [' ', 'Enter'];
    // trigger click on keys
    button.addEventListener('keyup', function(event) {
        if (clickKeys.includes(event.key)) button.click();
    });
});