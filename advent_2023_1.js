const fs = require('fs');

const spelledNumbers = {
    'one': 'o1e',
    'two': 't2o',
    'three': 'thr3e',
    'four': 'fo4r',
    'five': 'f5ve',
    'six': 's6x',
    'seven': 'sev7n',
    'eight': 'e8ght',
    'nine': 'n9ne'
};
const data = fs.readFileSync('calibrate_values.txt', 'utf8');

const regexPatternKeys = `(${Object.keys(spelledNumbers).join('|')})|\\d+`;
const regexKeys = new RegExp(regexPatternKeys, 'g');
// regex resolves to /one|two|three|four|five|six|seven|eight|nine|\d+/g

const getIndexByKey = (obj, key) => {
    // returns the index of a key in an object
    if (Object.keys(obj).indexOf(key) !== -1) {
        return Object.keys(obj).indexOf(key);
    };
}

const createNumber = (lineOfText, regex) => {
    // returns a string of numbers from a line of text
    let matches = lineOfText.match(regex);
    matches = matches.map((match) => {
        // if the match is a written out number, replace it by its index + 1
        return match = getIndexByKey(spelledNumbers, match) + 1 || match
    });
    return matches ? matches.join('') : '';
}

const firstLastNumber = (stringNumber) => {
    // returns first and last character of a string as a number
    const firstChar = stringNumber.charAt(0);
    const lastChar = stringNumber.charAt(stringNumber.length - 1);
    return parseInt(firstChar + lastChar);
}

const replaceSpelledNumberWithWorkaround = (line, regex, obj) => {
    // returns a line with 'one' as 'o1e' etc.
    const numText = line.match(regex);

    if (numText) {
        numText.forEach((num) => {
            if (obj[num]) {
                line = line.replace(num, obj[num]);
            }
        });
    }
    return line;
}

//Start of the Main Program
const lines = data.split('\n');
const lineMatches = lines.map((line) => {
    return replaceSpelledNumberWithWorkaround(line, regexKeys, spelledNumbers);
});

const total = lineMatches.reduce((acc, line) => {
    const matchesJoined = createNumber(line, regexKeys);

    if (matchesJoined) {
        return acc + firstLastNumber(matchesJoined);
    }
    return acc;
}, 0);

console.log(total);
