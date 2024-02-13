const checkEnd = (text) => {
    // check if string contains the text "END-CHAT"
    if (text.includes("END-CHAT")) {
        return true;
    } else {
        return false;
    }
}

export { checkEnd }