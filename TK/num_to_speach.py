#!/usr/bin/env python3
import logging

import num2words
from pydub import AudioSegment
from pydub.playback import play

logger = logging.getLogger(__name__)

def detect_num_and_convert(word):
    numbers = "0123456789.-"
    is_number = all(map(lambda x: x in numbers, word))
    if is_number:
        try:
            return num2words.num2words(word, lang="uk")
        except Exception as e:
            print(e)
            return word
    else:
        return word

if __name__ == '__main__':
    while True:
        number = input("Enter number: ")
        combined = AudioSegment.empty()
        text = detect_num_and_convert(str(number))
        for part in text.split(" "):
            voice_part = AudioSegment.from_file(f'./audio/{part}.m4a', 'm4a')
            combined += voice_part
        print(f"Generated audio representation of number {number} and saved to output directory")
        play(combined)
        combined.export(f"./output/{str(number)}.wav", format="wav")


