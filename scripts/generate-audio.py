"""Generate bundled French WAV dictations locally with eSpeak NG."""
import ctypes
import re
import wave
from pathlib import Path

lib = ctypes.CDLL('libespeak-ng.so.1')
rate = lib.espeak_Initialize(2, 0, None, 0)
if rate <= 0 or lib.espeak_SetVoiceByName(b'fr') != 0:
    raise RuntimeError('La voix française eSpeak NG est indisponible.')
lib.espeak_SetParameter(1, 125, 0)
callback_type = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
chunks = []

@callback_type
def callback(data, count, events):
    if count > 0 and data:
        chunks.append(ctypes.string_at(data, count * 2))
    return 0

lib.espeak_SetSynthCallback(callback)
source = Path('src/content/workshops.ts').read_text()
source = source[source.index('export const dictations'):]
items = re.findall(r'id:\s*"(d\d+)",.*?text:\s*"([^"\n]+)"', source, re.S)
if len(items) != 8:
    raise RuntimeError(f'Attendu 8 dictées, trouvé {len(items)}. Vérifier le format du contenu.')
for identifier, text in items:
    chunks.clear()
    buffer = ctypes.create_string_buffer(text.encode('utf-8'))
    if lib.espeak_Synth(buffer, len(buffer), 0, 1, 0, 1, None, None) != 0:
        raise RuntimeError(f'Synthèse impossible : {identifier}')
    lib.espeak_Synchronize()
    data = b''.join(chunks)
    if len(data) < 10000:
        raise RuntimeError(f'Audio vide ou trop court : {identifier}')
    with wave.open(f'assets/audio/{identifier}.wav', 'wb') as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(rate)
        output.writeframes(data)
    print(identifier, round(len(data) / (rate * 2), 1), 'secondes — voix française')
lib.espeak_Terminate()
