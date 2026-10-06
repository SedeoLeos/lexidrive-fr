import ctypes,json,wave
from pathlib import Path
lib=ctypes.CDLL('libespeak-ng.so.1');rate=lib.espeak_Initialize(2,0,None,0)
assert rate>0 and lib.espeak_SetVoiceByName(b'fr')==0
lib.espeak_SetParameter(1,145,0)
CB=ctypes.CFUNCTYPE(ctypes.c_int,ctypes.POINTER(ctypes.c_short),ctypes.c_int,ctypes.c_void_p);chunks=[]
@CB
def cb(data,n,events):
 if n>0 and data:chunks.append(ctypes.string_at(data,n*2))
 return 0
lib.espeak_SetSynthCallback(cb)
for exam in json.loads(Path('src/content/certifications.json').read_text()):
 chunks.clear();buffer=ctypes.create_string_buffer(exam['listening'].encode('utf-8'));assert lib.espeak_Synth(buffer,len(buffer),0,1,0,1,None,None)==0;lib.espeak_Synchronize()
 with wave.open('assets/audio/exam-'+exam['level']+'.wav','wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(chunks))
 print(exam['level'],round(sum(map(len,chunks))/(rate*2),1),'s')
lib.espeak_Terminate()
