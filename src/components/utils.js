import randwords from "./randwords";

export default function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * (randwords.length - 1))
    const randomWord = randwords[randomIndex]

    return randomWord
}

